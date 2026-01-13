// ============================================
// LIFTLOG - Mock Service Layer
// ============================================
// Simulates API calls with realistic delays
// Replace with real API calls when backend is ready

import {
  MOCK_BADGES,
  MOCK_CHALLENGES,
  MOCK_EXERCISE_PROGRESS,
  MOCK_MUSCLE_BALANCE,
  MOCK_USER,
  MOCK_USER_STATS,
  MOCK_WEEKLY_PROGRESS,
  MOCK_WORKOUT_LOGS,
  MOCK_WORKOUTS,
  EXERCISES,
  getTodayWorkout,
} from "@/data/mockData";
import {
  Badge,
  Challenge,
  Exercise,
  ExerciseProgress,
  ExerciseSet,
  MuscleBalance,
  OnboardingData,
  TodayWorkout,
  User,
  UserStats,
  WeeklyProgress,
  Workout,
  WorkoutLog,
} from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ============================================
// Utilities
// ============================================

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const randomDelay = () => delay(300 + Math.random() * 500); // 300-800ms

// Storage keys
const STORAGE_KEYS = {
  USER: "@liftlog/user",
  USER_STATS: "@liftlog/user_stats",
  WORKOUTS: "@liftlog/workouts",
  WORKOUT_LOGS: "@liftlog/workout_logs",
  ONBOARDING: "@liftlog/onboarding",
  STREAK_DATA: "@liftlog/streak",
};

// ============================================
// Auth Service
// ============================================

export const authService = {
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    await randomDelay();

    // Mock validation
    if (!email || !password) {
      return { success: false, message: "Email e senha são obrigatórios" };
    }

    if (password.length < 6) {
      return { success: false, message: "Senha incorreta" };
    }

    // Return mock user
    const user = { ...MOCK_USER, email };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return { success: true, user };
  },

  async register(name: string, email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> {
    await randomDelay();

    if (!name || !email || !password) {
      return { success: false, message: "Todos os campos são obrigatórios" };
    }

    if (password.length < 6) {
      return { success: false, message: "Senha deve ter pelo menos 6 caracteres" };
    }

    const user: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      createdAt: new Date().toISOString(),
      goal: "hypertrophy",
      weeklyGoal: 4,
    };

    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return { success: true, user };
  },

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER,
      STORAGE_KEYS.ONBOARDING,
    ]);
  },

  async getCurrentUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },
};

// ============================================
// User Service
// ============================================

export const userService = {
  async getUser(): Promise<User> {
    await randomDelay();
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return stored ? JSON.parse(stored) : MOCK_USER;
  },

  async updateUser(updates: Partial<User>): Promise<User> {
    await randomDelay();
    const current = await this.getUser();
    const updated = { ...current, ...updates };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  },

  async getStats(): Promise<UserStats> {
    await randomDelay();
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_STATS);
    return stored ? JSON.parse(stored) : MOCK_USER_STATS;
  },

  async updateStats(updates: Partial<UserStats>): Promise<UserStats> {
    await randomDelay();
    const current = await this.getStats();
    const updated = { ...current, ...updates };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(updated));
    return updated;
  },
};

// ============================================
// Workout Service
// ============================================

export const workoutService = {
  async getWorkouts(): Promise<Workout[]> {
    await randomDelay();
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUTS);
    return stored ? JSON.parse(stored) : MOCK_WORKOUTS;
  },

  async getWorkoutById(id: string): Promise<Workout | null> {
    const workouts = await this.getWorkouts();
    return workouts.find((w) => w.id === id) || null;
  },

  async getTodayWorkout(): Promise<TodayWorkout> {
    await randomDelay();
    const today = new Date().getDay();
    const workouts = await this.getWorkouts();
    const workout = workouts.find((w) => w.scheduledDay === today) || null;

    // Get last time this workout was performed
    const logs = await this.getWorkoutLogs();
    const lastPerformed = workout
      ? logs.find((l) => l.workoutId === workout.id)
      : undefined;

    return {
      workout,
      isRestDay: workout?.isRestDay || false,
      lastPerformed,
      dayOfWeek: today,
    };
  },

  async saveWorkout(workout: Workout): Promise<Workout> {
    await randomDelay();
    const workouts = await this.getWorkouts();
    const index = workouts.findIndex((w) => w.id === workout.id);

    if (index >= 0) {
      workouts[index] = workout;
    } else {
      workouts.push(workout);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
    return workout;
  },

  async deleteWorkout(id: string): Promise<void> {
    await randomDelay();
    const workouts = await this.getWorkouts();
    const filtered = workouts.filter((w) => w.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(filtered));
  },

  async reorderWorkouts(orderedIds: string[]): Promise<Workout[]> {
    await randomDelay();
    const workouts = await this.getWorkouts();
    const reordered = orderedIds
      .map((id, index) => {
        const workout = workouts.find((w) => w.id === id);
        if (workout) {
          return { ...workout, scheduledDay: index };
        }
        return null;
      })
      .filter(Boolean) as Workout[];

    await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(reordered));
    return reordered;
  },

  // Workout Logs
  async getWorkoutLogs(): Promise<WorkoutLog[]> {
    await randomDelay();
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_LOGS);
    return stored ? JSON.parse(stored) : MOCK_WORKOUT_LOGS;
  },

  async saveWorkoutLog(log: WorkoutLog): Promise<WorkoutLog> {
    await randomDelay();
    const logs = await this.getWorkoutLogs();
    logs.unshift(log); // Add to beginning
    await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_LOGS, JSON.stringify(logs));

    // Update stats
    const stats = await userService.getStats();
    await userService.updateStats({
      totalWorkouts: stats.totalWorkouts + 1,
      totalVolume: stats.totalVolume + log.totalVolume,
      lastWorkoutDate: log.completedAt,
      weeklyCompleted: stats.weeklyCompleted + 1,
    });

    return log;
  },

  async getWorkoutLogById(id: string): Promise<WorkoutLog | null> {
    const logs = await this.getWorkoutLogs();
    return logs.find((l) => l.id === id) || null;
  },
};

// ============================================
// Exercise Service
// ============================================

export const exerciseService = {
  async getAllExercises(): Promise<Exercise[]> {
    await randomDelay();
    return EXERCISES;
  },

  async getExercisesByMuscle(muscle: string): Promise<Exercise[]> {
    await randomDelay();
    return EXERCISES.filter((e) => e.targetMuscle === muscle);
  },

  async searchExercises(query: string): Promise<Exercise[]> {
    await randomDelay();
    const lowerQuery = query.toLowerCase();
    return EXERCISES.filter(
      (e) =>
        e.name.toLowerCase().includes(lowerQuery) ||
        e.targetMuscle.toLowerCase().includes(lowerQuery)
    );
  },
};

// ============================================
// Progress Service
// ============================================

export const progressService = {
  async getExerciseProgress(exerciseId: string): Promise<ExerciseProgress | null> {
    await randomDelay();
    return MOCK_EXERCISE_PROGRESS.find((p) => p.exerciseId === exerciseId) || null;
  },

  async getAllProgress(): Promise<ExerciseProgress[]> {
    await randomDelay();
    return MOCK_EXERCISE_PROGRESS;
  },

  async getWeeklyProgress(): Promise<WeeklyProgress[]> {
    await randomDelay();
    return MOCK_WEEKLY_PROGRESS;
  },

  async getMuscleBalance(): Promise<MuscleBalance[]> {
    await randomDelay();
    return MOCK_MUSCLE_BALANCE;
  },
};

// ============================================
// Gamification Service
// ============================================

export const gamificationService = {
  async getBadges(): Promise<Badge[]> {
    await randomDelay();
    return MOCK_BADGES;
  },

  async getUnlockedBadges(): Promise<Badge[]> {
    await randomDelay();
    return MOCK_BADGES.filter((b) => b.unlockedAt);
  },

  async getChallenges(): Promise<Challenge[]> {
    await randomDelay();
    return MOCK_CHALLENGES;
  },

  async updateChallengeProgress(challengeId: string, progress: number): Promise<Challenge | null> {
    await randomDelay();
    const challenge = MOCK_CHALLENGES.find((c) => c.id === challengeId);
    if (challenge) {
      challenge.progress = progress;
      return challenge;
    }
    return null;
  },
};

// ============================================
// Streak Service
// ============================================

export const streakService = {
  async getCurrentStreak(): Promise<{ current: number; longest: number }> {
    await randomDelay();
    const stats = await userService.getStats();
    return {
      current: stats.currentStreak,
      longest: stats.longestStreak,
    };
  },

  async incrementStreak(): Promise<UserStats> {
    const stats = await userService.getStats();
    const newStreak = stats.currentStreak + 1;

    return userService.updateStats({
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, stats.longestStreak),
      lastWorkoutDate: new Date().toISOString(),
    });
  },

  async resetStreak(): Promise<UserStats> {
    return userService.updateStats({
      currentStreak: 0,
    });
  },

  async checkAndUpdateStreak(): Promise<{ streakBroken: boolean; newStreak: number }> {
    const stats = await userService.getStats();
    const lastWorkout = stats.lastWorkoutDate ? new Date(stats.lastWorkoutDate) : null;
    const today = new Date();

    if (!lastWorkout) {
      return { streakBroken: false, newStreak: 0 };
    }

    // Check if last workout was yesterday or today
    const diffDays = Math.floor(
      (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays > 1) {
      // Streak broken
      await this.resetStreak();
      return { streakBroken: true, newStreak: 0 };
    }

    return { streakBroken: false, newStreak: stats.currentStreak };
  },
};

// ============================================
// Onboarding Service
// ============================================

export const onboardingService = {
  async saveOnboardingData(data: OnboardingData): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(data));
  },

  async getOnboardingData(): Promise<OnboardingData | null> {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING);
    return stored ? JSON.parse(stored) : null;
  },

  async completeOnboarding(data: OnboardingData): Promise<User> {
    await randomDelay();

    // Update user with onboarding data
    const user = await userService.updateUser({
      name: data.name,
      goal: data.goal,
      weeklyGoal: data.weeklyGoal,
    });

    // Initialize default workouts if user doesn't have a routine
    if (!data.hasExistingRoutine) {
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(MOCK_WORKOUTS));
    }

    // Initialize stats
    await AsyncStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify({
      ...MOCK_USER_STATS,
      currentStreak: 0,
      totalWorkouts: 0,
      totalVolume: 0,
      weeklyCompleted: 0,
      weeklyGoal: data.weeklyGoal || 4,
    }));

    return user;
  },
};

// ============================================
// Export all services
// ============================================

export default {
  auth: authService,
  user: userService,
  workout: workoutService,
  exercise: exerciseService,
  progress: progressService,
  gamification: gamificationService,
  streak: streakService,
  onboarding: onboardingService,
};
