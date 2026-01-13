import { Text } from "@/components/UI/Text"
import { RestTimerOverlay, SetCard } from "@/components/workout-execution"
import { useTheme } from "@/contexts/ThemeContext"
import { workoutService } from "@/services/mockService"
import { Workout, WorkoutExercise, WorkoutExerciseLog, WorkoutLog } from "@/types"
import { ActiveSet } from "@/types/workout-execution"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native"
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function WorkoutExecutionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  // State
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseLogs, setExerciseLogs] = useState<WorkoutExerciseLog[]>([])
  const [currentSets, setCurrentSets] = useState<ActiveSet[]>([])
  const [isResting, setIsResting] = useState(false)
  const [restTimeLeft, setRestTimeLeft] = useState(0)
  const [startTime] = useState(new Date().toISOString())
  const [lastWorkoutLog, setLastWorkoutLog] = useState<WorkoutLog | null>(null)

  const restTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentExercise = workout?.exercises[currentExerciseIndex]
  const isLastExercise = workout && currentExerciseIndex === workout.exercises.length - 1
  const completedSetsCount = currentSets.filter((s) => s.completed).length
  const totalSetsCount = currentSets.length
  const progress = workout
    ? (currentExerciseIndex + completedSetsCount / totalSetsCount) / workout.exercises.length
    : 0

  const loadWorkout = useCallback(async () => {
    if (!id) return

    try {
      const workoutData = await workoutService.getWorkoutById(id)
      if (workoutData) {
        setWorkout(workoutData)

        // Load last workout log for ghost mode
        const logs = await workoutService.getWorkoutLogs()
        const lastLog = logs.find((l) => l.workoutId === id)
        setLastWorkoutLog(lastLog || null)

        // Initialize first exercise
        if (workoutData.exercises.length > 0) {
          initializeExerciseSets(workoutData.exercises[0], lastLog)
        }
      }
    } catch (error) {
      console.error("Error loading workout:", error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadWorkout()
  }, [loadWorkout])

  const initializeExerciseSets = (exercise: WorkoutExercise, lastLog?: WorkoutLog | null) => {
    // Find previous performance for this exercise
    const previousExerciseLog = lastLog?.exerciseLogs.find(
      (el) => el.exerciseId === exercise.exercise.id
    )

    const sets: ActiveSet[] = exercise.sets.map((set, index) => {
      const previousSet = previousExerciseLog?.sets[index]
      return {
        ...set,
        completed: false,
        weight: previousSet?.weight || set.weight,
        reps: previousSet?.reps || set.reps,
        previousWeight: previousSet?.weight,
        previousReps: previousSet?.reps
      }
    })

    setCurrentSets(sets)
  }

  const handleOneTapRepeat = useCallback(
    (setIndex: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

      setCurrentSets((prev) => {
        const updated = [...prev]
        updated[setIndex] = {
          ...updated[setIndex],
          completed: true
        }
        return updated
      })

      // Start rest timer
      startRestTimer(currentExercise?.restSeconds || 90)
    },
    [currentExercise]
  )

  const handleAdjustWeight = useCallback((setIndex: number, delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    setCurrentSets((prev) => {
      const updated = [...prev]
      const newWeight = Math.max(0, updated[setIndex].weight + delta)
      updated[setIndex] = {
        ...updated[setIndex],
        weight: newWeight
      }
      return updated
    })
  }, [])

  const handleAdjustReps = useCallback((setIndex: number, delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    setCurrentSets((prev) => {
      const updated = [...prev]
      const newReps = Math.max(1, updated[setIndex].reps + delta)
      updated[setIndex] = {
        ...updated[setIndex],
        reps: newReps
      }
      return updated
    })
  }, [])

  const startRestTimer = (seconds: number) => {
    setIsResting(true)
    setRestTimeLeft(seconds)

    if (restTimerRef.current) {
      clearInterval(restTimerRef.current)
    }

    restTimerRef.current = setInterval(() => {
      setRestTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(restTimerRef.current!)
          setIsResting(false)
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const skipRest = () => {
    if (restTimerRef.current) {
      clearInterval(restTimerRef.current)
    }
    setIsResting(false)
    setRestTimeLeft(0)
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }

  const handleFinishWorkout = useCallback(
    async (logs: WorkoutExerciseLog[]) => {
      if (!workout) return

      // Calculate total volume
      const totalVolume = logs.reduce((acc, el) => {
        return acc + el.sets.reduce((setAcc, s) => setAcc + s.weight * s.reps, 0)
      }, 0)

      const workoutLog: WorkoutLog = {
        id: `log-${Date.now()}`,
        workoutId: workout.id,
        workout,
        startedAt: startTime,
        completedAt: new Date().toISOString(),
        totalVolume,
        exerciseLogs: logs
      }

      await workoutService.saveWorkoutLog(workoutLog)

      // Navigate to summary or home
      router.replace("/(tabs)")
    },
    [workout, startTime, router]
  )

  const handleNextExercise = useCallback(() => {
    if (!workout || !currentExercise) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    // Save current exercise log
    const exerciseLog: WorkoutExerciseLog = {
      exerciseId: currentExercise.exercise.id,
      exerciseName: currentExercise.exercise.name,
      sets: currentSets.filter((s) => s.completed),
      personalRecord: false // TODO: Calculate PR
    }

    setExerciseLogs((prev) => [...prev, exerciseLog])

    // Move to next exercise or finish
    if (isLastExercise) {
      handleFinishWorkout([...exerciseLogs, exerciseLog])
    } else {
      const nextIndex = currentExerciseIndex + 1
      setCurrentExerciseIndex(nextIndex)
      initializeExerciseSets(workout.exercises[nextIndex], lastWorkoutLog)
    }
  }, [
    workout,
    currentExercise,
    currentSets,
    isLastExercise,
    exerciseLogs,
    lastWorkoutLog,
    currentExerciseIndex,
    handleFinishWorkout
  ])

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.back()
  }

  useEffect(() => {
    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current)
      }
    }
  }, [])

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.primary }]}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      </View>
    )
  }

  if (!workout || !currentExercise) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.primary }]}>
        <Text>Treino não encontrado</Text>
      </View>
    )
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background.primary,
          paddingTop: insets.top
        }
      ]}
    >
      {/* Header with Close Button & Workout Info */}
      <View style={[styles.header, { backgroundColor: theme.colors.background.primary }]}>
        <Pressable onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </Pressable>
        <View style={styles.workoutInfo}>
          <Text variant="caption" color="secondary" numberOfLines={1}>
            {workout.name}
          </Text>
          <View>
            <Animated.View entering={SlideInRight.springify()} style={styles.exerciseHeader}>
              <Text
                variant="bodyMedium"
                numberOfLines={1}
                style={{ color: theme.colors.text.primary }}
              >
                {currentExercise.exercise.name} • {totalSetsCount} séries
              </Text>
              <Text variant="small" style={{ color: theme.colors.text.primary }}>
                {currentExerciseIndex + 1}/{workout.exercises.length}
              </Text>
            </Animated.View>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View
        style={[
          styles.progressBarContainer,
          { backgroundColor: theme.colors.background.secondary }
        ]}
      >
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              backgroundColor: theme.colors.primary[500],
              width: `${progress * 100}%`
            }
          ]}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Exercise Info */}

        {/* Ghost Mode Banner */}
        {lastWorkoutLog && (
          <Animated.View
            entering={FadeIn.delay(200)}
            style={[styles.ghostBanner, { backgroundColor: `${theme.colors.primary[500]}15` }]}
          >
            <Ionicons name="time-outline" size={16} color={theme.colors.primary[500]} />
            <Text variant="caption" style={{ color: theme.colors.primary[500] }}>
              Ghost Mode: Comparando com seu último treino
            </Text>
          </Animated.View>
        )}

        {/* Sets */}
        <View style={styles.setsContainer}>
          {currentSets.map((set, index) => (
            <SetCard
              key={set.id}
              set={set}
              index={index}
              isActive={!set.completed && index === completedSetsCount}
              onOneTapRepeat={() => handleOneTapRepeat(index)}
              onAdjustWeight={(delta) => handleAdjustWeight(index, delta)}
              onAdjustReps={(delta) => handleAdjustReps(index, delta)}
              theme={theme}
            />
          ))}
        </View>

        {/* Next Exercise Preview */}
        {!isLastExercise && workout.exercises[currentExerciseIndex + 1] && (
          <View style={styles.nextExercisePreview}>
            <Text variant="caption" color="secondary">
              Próximo exercício
            </Text>
            <Text variant="body">{workout.exercises[currentExerciseIndex + 1].exercise.name}</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomAction, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={[
            styles.nextButton,
            {
              backgroundColor:
                completedSetsCount === totalSetsCount
                  ? theme.colors.primary[500]
                  : theme.colors.background.tertiary
            }
          ]}
          onPress={handleNextExercise}
          disabled={completedSetsCount === 0}
        >
          <Text
            variant="button"
            style={{
              color: completedSetsCount === totalSetsCount ? "white" : theme.colors.text.secondary
            }}
          >
            {isLastExercise ? "Finalizar Treino" : "Próximo Exercício"}
          </Text>
          <Ionicons
            name={isLastExercise ? "checkmark" : "arrow-forward"}
            size={20}
            color={completedSetsCount === totalSetsCount ? "white" : theme.colors.text.secondary}
          />
        </Pressable>
      </View>

      {/* Rest Timer Overlay */}
      {isResting && <RestTimerOverlay timeLeft={restTimeLeft} onSkip={skipRest} theme={theme} />}
    </View>
  )
}

// ============================================
// Styles
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128,128,128,0.1)"
  },
  closeButton: {
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0
  },
  workoutInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 2
  },

  // Progress Bar
  progressBarContainer: {
    height: 2,
    width: "100%",
    marginTop: 0
  },

  progressBarFill: {
    height: "100%",
    borderRadius: 2
  },

  // Content
  content: {
    flex: 1
  },
  contentContainer: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 120
  },

  // Exercise Header
  exerciseHeader: {
    marginBottom: 16
  },

  // Ghost Banner
  ghostBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 20
  },

  // Sets
  setsContainer: {
    gap: 12
  },

  // Next Exercise Preview
  nextExercisePreview: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(128,128,128,0.2)"
  },

  // Bottom Action
  bottomAction: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16
  },

  nextButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12
  }
})
