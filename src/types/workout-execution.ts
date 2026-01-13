// ============================================
// LIFTLOG - Workout Execution Types
// ============================================

import { ExerciseSet } from "@/types"

export interface ActiveSet extends ExerciseSet {
  previousWeight?: number
  previousReps?: number
}

export interface SetCardProps {
  set: ActiveSet
  index: number
  isActive: boolean
  onOneTapRepeat: () => void
  onAdjustWeight: (delta: number) => void
  onAdjustReps: (delta: number) => void
  theme: any
}

export interface WorkoutTimerProps {
  startTime: string
  theme: any
}

export interface RestTimerOverlayProps {
  timeLeft: number
  onSkip: () => void
  theme: any
}
