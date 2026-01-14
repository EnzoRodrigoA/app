import { useState, useCallback, useEffect } from "react";
import {
  workoutService,
  userService,
  streakService,
} from "@/services/mockService";
import { TodayWorkout, UserStats } from "@/types";

/**
 * Home data state interface
 */
interface HomeData {
  workout: TodayWorkout | null;
  stats: UserStats | null;
  userName: string;
  loading: boolean;
  error: Error | null;
}

/**
 * Return type for useHomeData hook
 */
interface UseHomeDataReturn extends HomeData {
  refreshing: boolean;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to manage home screen data fetching and state
 * Handles data loading, error states, and refresh functionality
 *
 * @returns {UseHomeDataReturn} Home data state and refresh function
 */
export const useHomeData = (): UseHomeDataReturn => {
  const [state, setState] = useState<HomeData>({
    workout: null,
    stats: null,
    userName: "Atleta",
    loading: true,
    error: null,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [workout, stats, user] = await Promise.all([
        workoutService.getTodayWorkout(),
        userService.getStats(),
        userService.getUser(),
      ]);

      setState((prev) => ({
        ...prev,
        workout,
        stats,
        userName: user.name,
        loading: false,
        error: null,
      }));

      await streakService.checkAndUpdateStreak();
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error as Error,
      }));
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { ...state, refreshing, refresh };
};
