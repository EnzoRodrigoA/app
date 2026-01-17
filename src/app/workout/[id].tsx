import { Text } from "@/components/UI/Text"
import {
  ActiveExerciseCard,
  ExercisePathMap,
  GhostModeBanner
} from "@/components/workout-execution"
import { useTheme } from "@/contexts/ThemeContext"
import { workoutService } from "@/services/mockService"
import { Workout, WorkoutExercise, WorkoutExerciseLog, WorkoutLog } from "@/types"
import { ActiveSet } from "@/types/workout-execution"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { LinearGradient } from "expo-linear-gradient"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useCallback, useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from "react-native"
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function WorkoutExecutionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  // View mode: 'map' shows path overview, 'exercise' shows active exercise card
  const [viewMode, setViewMode] = useState<"map" | "exercise">("map")

  // Core state
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseLogs, setExerciseLogs] = useState<WorkoutExerciseLog[]>([])
  const [currentSets, setCurrentSets] = useState<ActiveSet[]>([])
  const [completedExerciseIndices, setCompletedExerciseIndices] = useState<number[]>([])

  const [startTime] = useState(new Date().toISOString())
  const [lastWorkoutLog, setLastWorkoutLog] = useState<WorkoutLog | null>(null)

  // Animation values
  const progressWidth = useSharedValue(0)

  // Derived values
  const currentExercise = workout?.exercises[currentExerciseIndex]
  const isLastExercise = workout && currentExerciseIndex === workout.exercises.length - 1
  const completedSetsCount = currentSets.filter((s) => s.completed).length
  const totalSetsCount = currentSets.length

  // Progress calculation for header
  const progress = useMemo(() => {
    if (!workout) return 0
    const exerciseProgress = currentExerciseIndex / workout.exercises.length
    const setProgress =
      totalSetsCount > 0 ? completedSetsCount / totalSetsCount / workout.exercises.length : 0
    return exerciseProgress + setProgress
  }, [workout, currentExerciseIndex, completedSetsCount, totalSetsCount])

  // Animate progress bar
  useEffect(() => {
    progressWidth.value = withSpring(progress * 100, { damping: 15 })
  }, [progress, progressWidth])

  // Animated progress bar style
  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`
  }))

  // Load workout data
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

  // Initialize sets for an exercise
  const initializeExerciseSets = (exercise: WorkoutExercise, lastLog?: WorkoutLog | null) => {
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

  // Handle set completion
  const handleSetComplete = useCallback((setIndex: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    setCurrentSets((prev) => {
      const updated = [...prev]
      updated[setIndex] = { ...updated[setIndex], completed: true }
      return updated
    })
  }, [])

  // Handle weight adjustment
  const handleAdjustWeight = useCallback((setIndex: number, delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    setCurrentSets((prev) => {
      const updated = [...prev]
      const newWeight = Math.max(0, updated[setIndex].weight + delta)
      updated[setIndex] = { ...updated[setIndex], weight: newWeight }
      return updated
    })
  }, [])

  // Handle reps adjustment
  const handleAdjustReps = useCallback((setIndex: number, delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    setCurrentSets((prev) => {
      const updated = [...prev]
      const newReps = Math.max(1, updated[setIndex].reps + delta)
      updated[setIndex] = { ...updated[setIndex], reps: newReps }
      return updated
    })
  }, [])

  // Finish workout
  const handleFinishWorkout = useCallback(
    async (logs: WorkoutExerciseLog[]) => {
      if (!workout) return

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

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
      router.replace("/(tabs)")
    },
    [workout, startTime, router]
  )

  // Move to next exercise
  const handleNextExercise = useCallback(() => {
    if (!workout || !currentExercise) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    // Save current exercise log
    const exerciseLog: WorkoutExerciseLog = {
      exerciseId: currentExercise.exercise.id,
      exerciseName: currentExercise.exercise.name,
      sets: currentSets.filter((s) => s.completed),
      personalRecord: false
    }

    const updatedLogs = [...exerciseLogs, exerciseLog]
    setExerciseLogs(updatedLogs)

    // Mark current exercise as completed
    setCompletedExerciseIndices((prev) => [...prev, currentExerciseIndex])

    if (isLastExercise) {
      handleFinishWorkout(updatedLogs)
    } else {
      const nextIndex = currentExerciseIndex + 1
      setCurrentExerciseIndex(nextIndex)
      initializeExerciseSets(workout.exercises[nextIndex], lastWorkoutLog)
      setViewMode("map") // Return to map view briefly
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

  const handleExercisePress = useCallback(
    (index: number) => {
      if (index === currentExerciseIndex) {
        setViewMode("exercise")
      }
    },
    [currentExerciseIndex]
  )

  // Navigation
  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.back()
  }

  const handleBackToMap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setViewMode("map")
  }

  // Loading state
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.primary }]}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      </View>
    )
  }

  // Error state
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
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={[styles.header, { borderBottomColor: theme.colors.background.secondary }]}
      >
        <Pressable
          onPress={viewMode === "exercise" ? handleBackToMap : handleClose}
          style={[styles.headerButton, { backgroundColor: theme.colors.background.secondary }]}
        >
          <Ionicons
            name={viewMode === "exercise" ? "chevron-back" : "close"}
            size={24}
            color={theme.colors.text.primary}
          />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text
            style={{
              fontSize: 22,
              fontFamily: "TekoRegular",
              color: theme.colors.text.primary,
              fontWeight: "600"
            }}
            numberOfLines={1}
          >
            {workout.name}
          </Text>
        </View>

        {/* Streak indicator */}
        <View style={styles.headerRight}>
          <View style={[styles.streakBadge, { backgroundColor: theme.colors.error[50] }]}>
            <Image source={require("../../assets/images/app-icon.png")} style={styles.streakIcon} />
            <Text variant="small" style={{ color: theme.colors.error[500], fontWeight: "700" }}>
              3
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Progress bar - Animated */}
      <View style={[styles.progressBar, { backgroundColor: theme.colors.gray[100] }]}>
        <Animated.View style={[styles.progressFill, animatedProgressStyle]}>
          <LinearGradient
            colors={[theme.colors.primary[500], theme.colors.primary[600]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressGradient}
          />
        </Animated.View>
      </View>

      {viewMode === "map" ? (
        <View style={[styles.mapContainer, { backgroundColor: theme.colors.background.secondary }]}>
          {lastWorkoutLog && <GhostModeBanner />}

          <ExercisePathMap
            exercises={workout.exercises}
            currentIndex={currentExerciseIndex}
            completedIndices={completedExerciseIndices}
            onExercisePress={handleExercisePress}
          />
        </View>
      ) : (
        <Animated.View entering={FadeIn.duration(300)} style={styles.exerciseContainer}>
          <ActiveExerciseCard
            exercise={currentExercise}
            sets={currentSets}
            completedSetsCount={completedSetsCount}
            exerciseIndex={currentExerciseIndex}
            totalExercises={workout.exercises.length}
            isLastExercise={isLastExercise || false}
            onSetComplete={handleSetComplete}
            onAdjustWeight={handleAdjustWeight}
            onAdjustReps={handleAdjustReps}
            onNextExercise={handleNextExercise}
          />
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center"
  },
  headerCenter: {
    flex: 1,
    alignItems: "center"
  },
  headerRight: {
    alignItems: "flex-end"
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12
  },
  streakIcon: {
    width: 16,
    height: 16
  },

  // Progress bar
  progressBar: {
    height: 4,
    width: "100%"
  },
  progressFill: {
    height: "100%"
  },
  progressGradient: {
    flex: 1
  },

  // Map view
  mapContainer: {
    flex: 1
  },
  ghostBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16
  },
  ghostIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center"
  },
  ghostTextContainer: {
    flex: 1
  },

  // Exercise view
  exerciseContainer: {
    flex: 1,
    paddingTop: 16
  }
})
