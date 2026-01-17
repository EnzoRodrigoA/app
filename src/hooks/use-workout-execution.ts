import { workoutService } from "@/services/mockService"
import { Workout, WorkoutExercise, WorkoutExerciseLog, WorkoutLog } from "@/types"
import { ActiveSet } from "@/types/workout-execution"
import * as Haptics from "expo-haptics"
import { useRouter } from "expo-router"
import { useCallback, useEffect, useMemo, useState } from "react"

interface UseWorkoutExecutionProps {
  workoutId: string | undefined
  onRestStart: (seconds: number) => void
}

interface UseWorkoutExecutionReturn {
  // State
  workout: Workout | null
  loading: boolean
  currentExerciseIndex: number
  currentExercise: WorkoutExercise | undefined
  currentSets: ActiveSet[]
  completedExerciseIndices: number[]
  lastWorkoutLog: WorkoutLog | null

  // Derived values
  isLastExercise: boolean
  completedSetsCount: number
  totalSetsCount: number
  progress: number
  totalXP: number

  // Actions
  handleSetComplete: (setIndex: number) => void
  handleAdjustWeight: (setIndex: number, delta: number) => void
  handleAdjustReps: (setIndex: number, delta: number) => void
  handleNextExercise: () => void
}

/**
 * Hook principal para gerenciar a execução do treino
 * Encapsula toda a lógica de estado e ações do treino
 */
export function useWorkoutExecution({
  workoutId,
  onRestStart
}: UseWorkoutExecutionProps): UseWorkoutExecutionReturn {
  const router = useRouter()

  // Core state
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [exerciseLogs, setExerciseLogs] = useState<WorkoutExerciseLog[]>([])
  const [currentSets, setCurrentSets] = useState<ActiveSet[]>([])
  const [completedExerciseIndices, setCompletedExerciseIndices] = useState<number[]>([])
  const [startTime] = useState(new Date().toISOString())
  const [lastWorkoutLog, setLastWorkoutLog] = useState<WorkoutLog | null>(null)

  // Derived values
  const currentExercise = workout?.exercises[currentExerciseIndex]
  const isLastExercise = Boolean(workout && currentExerciseIndex === workout.exercises.length - 1)
  const completedSetsCount = currentSets.filter((s) => s.completed).length
  const totalSetsCount = currentSets.length

  const totalXP = useMemo(() => {
    return completedExerciseIndices.length * 50 + completedSetsCount * 10
  }, [completedExerciseIndices.length, completedSetsCount])

  const progress = useMemo(() => {
    if (!workout) return 0
    const exerciseProgress = currentExerciseIndex / workout.exercises.length
    const setProgress =
      totalSetsCount > 0 ? completedSetsCount / totalSetsCount / workout.exercises.length : 0
    return exerciseProgress + setProgress
  }, [workout, currentExerciseIndex, completedSetsCount, totalSetsCount])

  // Initialize sets for an exercise
  const initializeExerciseSets = useCallback(
    (exercise: WorkoutExercise, lastLog?: WorkoutLog | null) => {
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
    },
    []
  )

  // Load workout data
  const loadWorkout = useCallback(async () => {
    if (!workoutId) return

    try {
      const workoutData = await workoutService.getWorkoutById(workoutId)
      if (workoutData) {
        setWorkout(workoutData)

        const logs = await workoutService.getWorkoutLogs()
        const lastLog = logs.find((l) => l.workoutId === workoutId)
        setLastWorkoutLog(lastLog || null)

        if (workoutData.exercises.length > 0) {
          initializeExerciseSets(workoutData.exercises[0], lastLog)
        }
      }
    } catch (error) {
      console.error("Error loading workout:", error)
    } finally {
      setLoading(false)
    }
  }, [workoutId, initializeExerciseSets])

  useEffect(() => {
    loadWorkout()
  }, [loadWorkout])

  // Actions
  const handleSetComplete = useCallback(
    (setIndex: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

      setCurrentSets((prev) => {
        const updated = [...prev]
        updated[setIndex] = { ...updated[setIndex], completed: true }
        return updated
      })

      onRestStart(currentExercise?.restSeconds || 90)
    },
    [currentExercise, onRestStart]
  )

  const handleAdjustWeight = useCallback((setIndex: number, delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    setCurrentSets((prev) => {
      const updated = [...prev]
      const newWeight = Math.max(0, updated[setIndex].weight + delta)
      updated[setIndex] = { ...updated[setIndex], weight: newWeight }
      return updated
    })
  }, [])

  const handleAdjustReps = useCallback((setIndex: number, delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

    setCurrentSets((prev) => {
      const updated = [...prev]
      const newReps = Math.max(1, updated[setIndex].reps + delta)
      updated[setIndex] = { ...updated[setIndex], reps: newReps }
      return updated
    })
  }, [])

  const finishWorkout = useCallback(
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

  const handleNextExercise = useCallback(() => {
    if (!workout || !currentExercise) return

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    const exerciseLog: WorkoutExerciseLog = {
      exerciseId: currentExercise.exercise.id,
      exerciseName: currentExercise.exercise.name,
      sets: currentSets.filter((s) => s.completed),
      personalRecord: false
    }

    const updatedLogs = [...exerciseLogs, exerciseLog]
    setExerciseLogs(updatedLogs)
    setCompletedExerciseIndices((prev) => [...prev, currentExerciseIndex])

    if (isLastExercise) {
      finishWorkout(updatedLogs)
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
    finishWorkout,
    initializeExerciseSets
  ])

  return {
    workout,
    loading,
    currentExerciseIndex,
    currentExercise,
    currentSets,
    completedExerciseIndices,
    lastWorkoutLog,
    isLastExercise,
    completedSetsCount,
    totalSetsCount,
    progress,
    totalXP,
    handleSetComplete,
    handleAdjustWeight,
    handleAdjustReps,
    handleNextExercise
  }
}
