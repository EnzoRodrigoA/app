// ============================================
// LIFTLOG - Type Definitions
// ============================================

// Muscle Groups
export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "legs"
  | "glutes"
  | "abs"
  | "forearms"
  | "calves";

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  chest: "Peito",
  back: "Costas",
  shoulders: "Ombros",
  biceps: "Bíceps",
  triceps: "Tríceps",
  legs: "Pernas",
  glutes: "Glúteos",
  abs: "Abdômen",
  forearms: "Antebraços",
  calves: "Panturrilhas",
};

// ============================================
// Exercise & Sets
// ============================================

export interface ExerciseSet {
  id: string;
  setNumber: number;
  weight: number; // kg
  reps: number;
  completed: boolean;
  rpe?: number; // Rate of Perceived Exertion (1-10)
  isWarmup?: boolean;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: MuscleGroup;
  secondaryMuscles?: MuscleGroup[];
  equipment?: string;
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  restSeconds?: number; // Rest time between sets
  order: number;
}

// ============================================
// Workout
// ============================================

export interface Workout {
  id: string;
  name: string;
  exercises: WorkoutExercise[];
  isRestDay: boolean;
  scheduledDay?: number; // 0-6 (Sunday-Saturday)
  estimatedMinutes?: number;
  color?: string;
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  workout: Workout;
  startedAt: string; // ISO date
  completedAt?: string; // ISO date
  totalVolume: number; // kg lifted
  exerciseLogs: WorkoutExerciseLog[];
  mood?: number; // 1-5
  notes?: string;
}

export interface WorkoutExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSet[];
  personalRecord?: boolean; // Did user hit PR?
}

// ============================================
// User & Stats
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  goal: UserGoal;
  weeklyGoal: number; // days per week
}

export type UserGoal = "hypertrophy" | "strength" | "weight_loss" | "health";

export const USER_GOAL_LABELS: Record<UserGoal, string> = {
  hypertrophy: "Hipertrofia",
  strength: "Força",
  weight_loss: "Emagrecimento",
  health: "Saúde Geral",
};

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalWorkouts: number;
  totalVolume: number; // Total kg ever lifted
  weeklyCompleted: number;
  weeklyGoal: number;
  lastWorkoutDate?: string; // ISO date
  memberSince: string; // ISO date
  level: UserLevel;
  experience: number;
}

export type UserLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "elite"
  | "legend";

export const USER_LEVEL_LABELS: Record<UserLevel, string> = {
  beginner: "Novato",
  intermediate: "Intermediário",
  advanced: "Avançado",
  elite: "Elite",
  legend: "Lenda",
};

export const USER_LEVEL_THRESHOLDS: Record<UserLevel, number> = {
  beginner: 0,
  intermediate: 500,
  advanced: 2000,
  elite: 5000,
  legend: 10000,
};

// ============================================
// Progress & Analytics
// ============================================

export interface ExerciseProgress {
  exerciseId: string;
  exerciseName: string;
  history: ExerciseHistoryEntry[];
  personalRecord: {
    weight: number;
    reps: number;
    date: string;
  };
  trend: "up" | "down" | "plateau";
  percentChange: number; // Last 30 days
}

export interface ExerciseHistoryEntry {
  date: string;
  maxWeight: number;
  totalVolume: number;
  totalReps: number;
}

export interface WeeklyProgress {
  weekStart: string; // ISO date
  workoutsCompleted: number;
  totalVolume: number;
  avgDuration: number; // minutes
}

export interface MuscleBalance {
  muscle: MuscleGroup;
  volumePercentage: number; // % of total volume
  lastTrained?: string; // ISO date
  status: "overtrained" | "balanced" | "undertrained";
}

// ============================================
// Gamification
// ============================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string; // ISO date
  requirement: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly" | "milestone";
  progress: number;
  target: number;
  reward: number; // XP
  expiresAt?: string; // ISO date
}

// ============================================
// App State
// ============================================

export interface TodayWorkout {
  workout: Workout | null;
  isRestDay: boolean;
  lastPerformed?: WorkoutLog;
  dayOfWeek: number;
}

export interface OnboardingData {
  name?: string;
  goal?: UserGoal;
  weeklyGoal?: number;
  hasExistingRoutine?: boolean;
  experienceLevel?: "beginner" | "intermediate" | "advanced";
}
