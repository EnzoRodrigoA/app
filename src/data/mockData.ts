// ============================================
// LIFTLOG - Mock Data
// ============================================

import {
  Badge,
  Challenge,
  Exercise,
  ExerciseProgress,
  MuscleBalance,
  MuscleGroup,
  User,
  UserStats,
  WeeklyProgress,
  Workout,
  WorkoutExercise,
  WorkoutLog,
} from "@/types";

// ============================================
// Exercises Database
// ============================================

export const EXERCISES: Exercise[] = [
  // Chest
  {
    id: "ex-1",
    name: "Supino Reto",
    targetMuscle: "chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Barra",
  },
  {
    id: "ex-2",
    name: "Supino Inclinado",
    targetMuscle: "chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Halter",
  },
  {
    id: "ex-3",
    name: "Crucifixo",
    targetMuscle: "chest",
    equipment: "Halter",
  },
  {
    id: "ex-4",
    name: "Crossover",
    targetMuscle: "chest",
    equipment: "Cabo",
  },

  // Back
  {
    id: "ex-5",
    name: "Puxada Frontal",
    targetMuscle: "back",
    secondaryMuscles: ["biceps"],
    equipment: "Cabo",
  },
  {
    id: "ex-6",
    name: "Remada Curvada",
    targetMuscle: "back",
    secondaryMuscles: ["biceps"],
    equipment: "Barra",
  },
  {
    id: "ex-7",
    name: "Remada Unilateral",
    targetMuscle: "back",
    secondaryMuscles: ["biceps"],
    equipment: "Halter",
  },
  {
    id: "ex-8",
    name: "Pulldown",
    targetMuscle: "back",
    secondaryMuscles: ["biceps"],
    equipment: "Cabo",
  },

  // Shoulders
  {
    id: "ex-9",
    name: "Desenvolvimento",
    targetMuscle: "shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Halter",
  },
  {
    id: "ex-10",
    name: "Elevação Lateral",
    targetMuscle: "shoulders",
    equipment: "Halter",
  },
  {
    id: "ex-11",
    name: "Elevação Frontal",
    targetMuscle: "shoulders",
    equipment: "Halter",
  },

  // Biceps
  {
    id: "ex-12",
    name: "Rosca Direta",
    targetMuscle: "biceps",
    equipment: "Barra",
  },
  {
    id: "ex-13",
    name: "Rosca Alternada",
    targetMuscle: "biceps",
    equipment: "Halter",
  },
  {
    id: "ex-14",
    name: "Rosca Martelo",
    targetMuscle: "biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Halter",
  },

  // Triceps
  {
    id: "ex-15",
    name: "Tríceps Pulley",
    targetMuscle: "triceps",
    equipment: "Cabo",
  },
  {
    id: "ex-16",
    name: "Tríceps Francês",
    targetMuscle: "triceps",
    equipment: "Halter",
  },
  {
    id: "ex-17",
    name: "Tríceps Testa",
    targetMuscle: "triceps",
    equipment: "Barra",
  },

  // Legs
  {
    id: "ex-18",
    name: "Agachamento",
    targetMuscle: "legs",
    secondaryMuscles: ["glutes"],
    equipment: "Barra",
  },
  {
    id: "ex-19",
    name: "Leg Press",
    targetMuscle: "legs",
    secondaryMuscles: ["glutes"],
    equipment: "Máquina",
  },
  {
    id: "ex-20",
    name: "Extensora",
    targetMuscle: "legs",
    equipment: "Máquina",
  },
  {
    id: "ex-21",
    name: "Flexora",
    targetMuscle: "legs",
    equipment: "Máquina",
  },
  {
    id: "ex-22",
    name: "Stiff",
    targetMuscle: "legs",
    secondaryMuscles: ["glutes", "back"],
    equipment: "Barra",
  },
];

// ============================================
// User Workouts (Routine)
// ============================================

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: "w-1",
    name: "Peito + Tríceps",
    isRestDay: false,
    scheduledDay: 1, // Monday
    estimatedMinutes: 45,
    color: "#F44336",
    exercises: [
      {
        id: "we-1",
        exercise: EXERCISES[0], // Supino Reto
        order: 1,
        restSeconds: 90,
        sets: [
          { id: "s-1", setNumber: 1, weight: 80, reps: 10, completed: false },
          { id: "s-2", setNumber: 2, weight: 80, reps: 10, completed: false },
          { id: "s-3", setNumber: 3, weight: 80, reps: 8, completed: false },
          { id: "s-4", setNumber: 4, weight: 80, reps: 8, completed: false },
        ],
      },
      {
        id: "we-2",
        exercise: EXERCISES[1], // Supino Inclinado
        order: 2,
        restSeconds: 90,
        sets: [
          { id: "s-5", setNumber: 1, weight: 28, reps: 12, completed: false },
          { id: "s-6", setNumber: 2, weight: 28, reps: 12, completed: false },
          { id: "s-7", setNumber: 3, weight: 28, reps: 10, completed: false },
        ],
      },
      {
        id: "we-3",
        exercise: EXERCISES[3], // Crossover
        order: 3,
        restSeconds: 60,
        sets: [
          { id: "s-8", setNumber: 1, weight: 15, reps: 15, completed: false },
          { id: "s-9", setNumber: 2, weight: 15, reps: 15, completed: false },
          { id: "s-10", setNumber: 3, weight: 15, reps: 12, completed: false },
        ],
      },
      {
        id: "we-4",
        exercise: EXERCISES[14], // Tríceps Pulley
        order: 4,
        restSeconds: 60,
        sets: [
          { id: "s-11", setNumber: 1, weight: 25, reps: 12, completed: false },
          { id: "s-12", setNumber: 2, weight: 25, reps: 12, completed: false },
          { id: "s-13", setNumber: 3, weight: 25, reps: 10, completed: false },
        ],
      },
      {
        id: "we-5",
        exercise: EXERCISES[15], // Tríceps Francês
        order: 5,
        restSeconds: 60,
        sets: [
          { id: "s-14", setNumber: 1, weight: 14, reps: 12, completed: false },
          { id: "s-15", setNumber: 2, weight: 14, reps: 12, completed: false },
          { id: "s-16", setNumber: 3, weight: 14, reps: 10, completed: false },
        ],
      },
    ],
  },
  {
    id: "w-2",
    name: "Costas + Bíceps",
    isRestDay: false,
    scheduledDay: 2, // Tuesday
    estimatedMinutes: 50,
    color: "#2196F3",
    exercises: [
      {
        id: "we-6",
        exercise: EXERCISES[4], // Puxada Frontal
        order: 1,
        restSeconds: 90,
        sets: [
          { id: "s-17", setNumber: 1, weight: 60, reps: 12, completed: false },
          { id: "s-18", setNumber: 2, weight: 60, reps: 12, completed: false },
          { id: "s-19", setNumber: 3, weight: 60, reps: 10, completed: false },
          { id: "s-20", setNumber: 4, weight: 60, reps: 10, completed: false },
        ],
      },
      {
        id: "we-7",
        exercise: EXERCISES[5], // Remada Curvada
        order: 2,
        restSeconds: 90,
        sets: [
          { id: "s-21", setNumber: 1, weight: 50, reps: 10, completed: false },
          { id: "s-22", setNumber: 2, weight: 50, reps: 10, completed: false },
          { id: "s-23", setNumber: 3, weight: 50, reps: 8, completed: false },
        ],
      },
      {
        id: "we-8",
        exercise: EXERCISES[6], // Remada Unilateral
        order: 3,
        restSeconds: 60,
        sets: [
          { id: "s-24", setNumber: 1, weight: 22, reps: 12, completed: false },
          { id: "s-25", setNumber: 2, weight: 22, reps: 12, completed: false },
          { id: "s-26", setNumber: 3, weight: 22, reps: 10, completed: false },
        ],
      },
      {
        id: "we-9",
        exercise: EXERCISES[11], // Rosca Direta
        order: 4,
        restSeconds: 60,
        sets: [
          { id: "s-27", setNumber: 1, weight: 30, reps: 10, completed: false },
          { id: "s-28", setNumber: 2, weight: 30, reps: 10, completed: false },
          { id: "s-29", setNumber: 3, weight: 30, reps: 8, completed: false },
        ],
      },
      {
        id: "we-10",
        exercise: EXERCISES[13], // Rosca Martelo
        order: 5,
        restSeconds: 60,
        sets: [
          { id: "s-30", setNumber: 1, weight: 14, reps: 12, completed: false },
          { id: "s-31", setNumber: 2, weight: 14, reps: 12, completed: false },
          { id: "s-32", setNumber: 3, weight: 14, reps: 10, completed: false },
        ],
      },
    ],
  },
  {
    id: "w-3",
    name: "Pernas",
    isRestDay: false,
    scheduledDay: 3, // Wednesday
    estimatedMinutes: 55,
    color: "#4CAF50",
    exercises: [
      {
        id: "we-11",
        exercise: EXERCISES[17], // Agachamento
        order: 1,
        restSeconds: 120,
        sets: [
          { id: "s-33", setNumber: 1, weight: 100, reps: 8, completed: false },
          { id: "s-34", setNumber: 2, weight: 100, reps: 8, completed: false },
          { id: "s-35", setNumber: 3, weight: 100, reps: 6, completed: false },
          { id: "s-36", setNumber: 4, weight: 100, reps: 6, completed: false },
        ],
      },
      {
        id: "we-12",
        exercise: EXERCISES[18], // Leg Press
        order: 2,
        restSeconds: 90,
        sets: [
          { id: "s-37", setNumber: 1, weight: 200, reps: 12, completed: false },
          { id: "s-38", setNumber: 2, weight: 200, reps: 12, completed: false },
          { id: "s-39", setNumber: 3, weight: 200, reps: 10, completed: false },
        ],
      },
      {
        id: "we-13",
        exercise: EXERCISES[19], // Extensora
        order: 3,
        restSeconds: 60,
        sets: [
          { id: "s-40", setNumber: 1, weight: 50, reps: 15, completed: false },
          { id: "s-41", setNumber: 2, weight: 50, reps: 15, completed: false },
          { id: "s-42", setNumber: 3, weight: 50, reps: 12, completed: false },
        ],
      },
      {
        id: "we-14",
        exercise: EXERCISES[20], // Flexora
        order: 4,
        restSeconds: 60,
        sets: [
          { id: "s-43", setNumber: 1, weight: 40, reps: 12, completed: false },
          { id: "s-44", setNumber: 2, weight: 40, reps: 12, completed: false },
          { id: "s-45", setNumber: 3, weight: 40, reps: 10, completed: false },
        ],
      },
      {
        id: "we-15",
        exercise: EXERCISES[21], // Stiff
        order: 5,
        restSeconds: 90,
        sets: [
          { id: "s-46", setNumber: 1, weight: 60, reps: 10, completed: false },
          { id: "s-47", setNumber: 2, weight: 60, reps: 10, completed: false },
          { id: "s-48", setNumber: 3, weight: 60, reps: 8, completed: false },
        ],
      },
    ],
  },
  {
    id: "w-4",
    name: "Ombros + Abs",
    isRestDay: false,
    scheduledDay: 4, // Thursday
    estimatedMinutes: 40,
    color: "#FF9800",
    exercises: [
      {
        id: "we-16",
        exercise: EXERCISES[8], // Desenvolvimento
        order: 1,
        restSeconds: 90,
        sets: [
          { id: "s-49", setNumber: 1, weight: 20, reps: 10, completed: false },
          { id: "s-50", setNumber: 2, weight: 20, reps: 10, completed: false },
          { id: "s-51", setNumber: 3, weight: 20, reps: 8, completed: false },
          { id: "s-52", setNumber: 4, weight: 20, reps: 8, completed: false },
        ],
      },
      {
        id: "we-17",
        exercise: EXERCISES[9], // Elevação Lateral
        order: 2,
        restSeconds: 60,
        sets: [
          { id: "s-53", setNumber: 1, weight: 10, reps: 15, completed: false },
          { id: "s-54", setNumber: 2, weight: 10, reps: 15, completed: false },
          { id: "s-55", setNumber: 3, weight: 10, reps: 12, completed: false },
        ],
      },
      {
        id: "we-18",
        exercise: EXERCISES[10], // Elevação Frontal
        order: 3,
        restSeconds: 60,
        sets: [
          { id: "s-56", setNumber: 1, weight: 10, reps: 12, completed: false },
          { id: "s-57", setNumber: 2, weight: 10, reps: 12, completed: false },
          { id: "s-58", setNumber: 3, weight: 10, reps: 10, completed: false },
        ],
      },
    ],
  },
  {
    id: "w-rest-1",
    name: "Descanso",
    isRestDay: true,
    scheduledDay: 5, // Friday
    exercises: [],
  },
  {
    id: "w-5",
    name: "Full Body",
    isRestDay: false,
    scheduledDay: 6, // Saturday
    estimatedMinutes: 60,
    color: "#9C27B0",
    exercises: [
      {
        id: "we-19",
        exercise: EXERCISES[0], // Supino Reto
        order: 1,
        restSeconds: 90,
        sets: [
          { id: "s-59", setNumber: 1, weight: 70, reps: 10, completed: false },
          { id: "s-60", setNumber: 2, weight: 70, reps: 10, completed: false },
          { id: "s-61", setNumber: 3, weight: 70, reps: 8, completed: false },
        ],
      },
      {
        id: "we-20",
        exercise: EXERCISES[4], // Puxada Frontal
        order: 2,
        restSeconds: 90,
        sets: [
          { id: "s-62", setNumber: 1, weight: 55, reps: 10, completed: false },
          { id: "s-63", setNumber: 2, weight: 55, reps: 10, completed: false },
          { id: "s-64", setNumber: 3, weight: 55, reps: 8, completed: false },
        ],
      },
      {
        id: "we-21",
        exercise: EXERCISES[17], // Agachamento
        order: 3,
        restSeconds: 120,
        sets: [
          { id: "s-65", setNumber: 1, weight: 80, reps: 8, completed: false },
          { id: "s-66", setNumber: 2, weight: 80, reps: 8, completed: false },
          { id: "s-67", setNumber: 3, weight: 80, reps: 6, completed: false },
        ],
      },
      {
        id: "we-22",
        exercise: EXERCISES[8], // Desenvolvimento
        order: 4,
        restSeconds: 60,
        sets: [
          { id: "s-68", setNumber: 1, weight: 18, reps: 10, completed: false },
          { id: "s-69", setNumber: 2, weight: 18, reps: 10, completed: false },
          { id: "s-70", setNumber: 3, weight: 18, reps: 8, completed: false },
        ],
      },
    ],
  },
  {
    id: "w-rest-2",
    name: "Descanso",
    isRestDay: true,
    scheduledDay: 0, // Sunday
    exercises: [],
  },
];

// ============================================
// User Data
// ============================================

export const MOCK_USER: User = {
  id: "user-1",
  name: "João",
  email: "joao@email.com",
  createdAt: "2024-06-01T00:00:00Z",
  goal: "hypertrophy",
  weeklyGoal: 5,
};

export const MOCK_USER_STATS: UserStats = {
  currentStreak: 5,
  longestStreak: 14,
  totalWorkouts: 87,
  totalVolume: 245000,
  weeklyCompleted: 4,
  weeklyGoal: 5,
  lastWorkoutDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  memberSince: "2024-06-01T00:00:00Z",
  level: "intermediate",
  experience: 1250,
};

// ============================================
// Workout History (Last 30 days sample)
// ============================================

export const MOCK_WORKOUT_LOGS: WorkoutLog[] = [
  {
    id: "log-1",
    workoutId: "w-1",
    workout: MOCK_WORKOUTS[0],
    startedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    completedAt: new Date(Date.now() - 86400000 + 2700000).toISOString(),
    totalVolume: 4520,
    mood: 4,
    exerciseLogs: [
      {
        exerciseId: "ex-1",
        exerciseName: "Supino Reto",
        sets: [
          { id: "ls-1", setNumber: 1, weight: 80, reps: 10, completed: true },
          { id: "ls-2", setNumber: 2, weight: 80, reps: 10, completed: true },
          { id: "ls-3", setNumber: 3, weight: 80, reps: 9, completed: true },
          { id: "ls-4", setNumber: 4, weight: 80, reps: 8, completed: true },
        ],
        personalRecord: false,
      },
    ],
  },
  {
    id: "log-2",
    workoutId: "w-2",
    workout: MOCK_WORKOUTS[1],
    startedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    completedAt: new Date(Date.now() - 172800000 + 3000000).toISOString(),
    totalVolume: 3890,
    mood: 5,
    exerciseLogs: [],
  },
  {
    id: "log-3",
    workoutId: "w-3",
    workout: MOCK_WORKOUTS[2],
    startedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    completedAt: new Date(Date.now() - 259200000 + 3300000).toISOString(),
    totalVolume: 6200,
    mood: 3,
    exerciseLogs: [],
  },
];

// ============================================
// Progress Data
// ============================================

export const MOCK_EXERCISE_PROGRESS: ExerciseProgress[] = [
  {
    exerciseId: "ex-1",
    exerciseName: "Supino Reto",
    personalRecord: {
      weight: 85,
      reps: 8,
      date: "2024-12-15T00:00:00Z",
    },
    trend: "up",
    percentChange: 6.25,
    history: [
      { date: "2024-12-01", maxWeight: 75, totalVolume: 2800, totalReps: 38 },
      { date: "2024-12-08", maxWeight: 77.5, totalVolume: 2950, totalReps: 38 },
      { date: "2024-12-15", maxWeight: 80, totalVolume: 3100, totalReps: 37 },
      { date: "2024-12-22", maxWeight: 80, totalVolume: 3200, totalReps: 40 },
      { date: "2024-12-29", maxWeight: 82.5, totalVolume: 3280, totalReps: 39 },
      { date: "2025-01-05", maxWeight: 85, totalVolume: 3400, totalReps: 38 },
    ],
  },
  {
    exerciseId: "ex-18",
    exerciseName: "Agachamento",
    personalRecord: {
      weight: 110,
      reps: 6,
      date: "2025-01-02T00:00:00Z",
    },
    trend: "up",
    percentChange: 10,
    history: [
      { date: "2024-12-01", maxWeight: 90, totalVolume: 5400, totalReps: 60 },
      { date: "2024-12-08", maxWeight: 95, totalVolume: 5700, totalReps: 60 },
      { date: "2024-12-15", maxWeight: 100, totalVolume: 6000, totalReps: 60 },
      { date: "2024-12-22", maxWeight: 100, totalVolume: 6100, totalReps: 61 },
      { date: "2024-12-29", maxWeight: 105, totalVolume: 6300, totalReps: 60 },
      { date: "2025-01-05", maxWeight: 110, totalVolume: 6500, totalReps: 59 },
    ],
  },
];

export const MOCK_WEEKLY_PROGRESS: WeeklyProgress[] = [
  { weekStart: "2024-12-02", workoutsCompleted: 4, totalVolume: 18500, avgDuration: 48 },
  { weekStart: "2024-12-09", workoutsCompleted: 5, totalVolume: 21200, avgDuration: 52 },
  { weekStart: "2024-12-16", workoutsCompleted: 4, totalVolume: 19800, avgDuration: 45 },
  { weekStart: "2024-12-23", workoutsCompleted: 3, totalVolume: 15600, avgDuration: 50 },
  { weekStart: "2024-12-30", workoutsCompleted: 5, totalVolume: 22100, avgDuration: 51 },
  { weekStart: "2025-01-06", workoutsCompleted: 4, totalVolume: 20500, avgDuration: 49 },
];

export const MOCK_MUSCLE_BALANCE: MuscleBalance[] = [
  { muscle: "chest", volumePercentage: 22, lastTrained: "2025-01-12", status: "balanced" },
  { muscle: "back", volumePercentage: 18, lastTrained: "2025-01-11", status: "undertrained" },
  { muscle: "shoulders", volumePercentage: 12, lastTrained: "2025-01-09", status: "balanced" },
  { muscle: "legs", volumePercentage: 25, lastTrained: "2025-01-10", status: "balanced" },
  { muscle: "biceps", volumePercentage: 8, lastTrained: "2025-01-11", status: "balanced" },
  { muscle: "triceps", volumePercentage: 10, lastTrained: "2025-01-12", status: "balanced" },
  { muscle: "abs", volumePercentage: 5, lastTrained: "2025-01-05", status: "undertrained" },
];

// ============================================
// Gamification
// ============================================

export const MOCK_BADGES: Badge[] = [
  {
    id: "badge-1",
    name: "Primeira Série",
    description: "Complete seu primeiro treino",
    icon: "🎯",
    unlockedAt: "2024-06-01T00:00:00Z",
    requirement: "1 treino completo",
  },
  {
    id: "badge-2",
    name: "Semana Perfeita",
    description: "Complete todos os treinos da semana",
    icon: "⭐",
    unlockedAt: "2024-06-15T00:00:00Z",
    requirement: "5 treinos em uma semana",
  },
  {
    id: "badge-3",
    name: "Centurião",
    description: "Levante 100kg no supino",
    icon: "🏆",
    requirement: "100kg no supino",
  },
  {
    id: "badge-4",
    name: "Streak de Fogo",
    description: "Mantenha um streak de 7 dias",
    icon: "🔥",
    unlockedAt: "2024-07-20T00:00:00Z",
    requirement: "7 dias consecutivos",
  },
  {
    id: "badge-5",
    name: "Streak Lendário",
    description: "Mantenha um streak de 30 dias",
    icon: "💎",
    requirement: "30 dias consecutivos",
  },
  {
    id: "badge-6",
    name: "Volume Monster",
    description: "Levante 100.000kg no total",
    icon: "💪",
    unlockedAt: "2024-10-01T00:00:00Z",
    requirement: "100.000kg de volume total",
  },
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: "challenge-1",
    title: "Treino do Dia",
    description: "Complete o treino de hoje",
    type: "daily",
    progress: 0,
    target: 1,
    reward: 50,
    expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString(),
  },
  {
    id: "challenge-2",
    title: "Meta Semanal",
    description: "Complete 5 treinos esta semana",
    type: "weekly",
    progress: 4,
    target: 5,
    reward: 200,
  },
  {
    id: "challenge-3",
    title: "Supino 85kg",
    description: "Alcance 85kg no supino reto",
    type: "milestone",
    progress: 80,
    target: 85,
    reward: 500,
  },
];

// ============================================
// Helper: Get today's workout
// ============================================

export function getTodayWorkout(): Workout | null {
  const today = new Date().getDay(); // 0 = Sunday
  return MOCK_WORKOUTS.find((w) => w.scheduledDay === today) || null;
}

// ============================================
// Helper: Get last workout for exercise
// ============================================

export function getLastWorkoutForExercise(exerciseId: string): ExerciseProgress | undefined {
  return MOCK_EXERCISE_PROGRESS.find((p) => p.exerciseId === exerciseId);
}
