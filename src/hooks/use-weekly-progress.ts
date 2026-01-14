import { useMemo } from "react";
import { UserStats } from "@/types";
import { calculateWeeklyProgress } from "@/utils/progress-helpers";
import { isToday } from "@/utils/date-helpers";

/**
 * Return type for useWeeklyProgress hook
 */
interface UseWeeklyProgressReturn {
  progress: number;
  trainedToday: boolean;
}

/**
 * Custom hook to calculate weekly progress metrics
 * Derives progress percentage and training status from user stats
 *
 * @param {UserStats | null} stats - User statistics data
 * @returns {UseWeeklyProgressReturn} Progress metrics
 */
export const useWeeklyProgress = (
  stats: UserStats | null
): UseWeeklyProgressReturn => {
  const progress = useMemo(() => {
    if (!stats) return 0;
    return calculateWeeklyProgress(stats.weeklyCompleted, stats.weeklyGoal);
  }, [stats]);

  const trainedToday = useMemo(() => {
    if (!stats?.lastWorkoutDate) return false;
    return isToday(new Date(stats.lastWorkoutDate));
  }, [stats]);

  return { progress, trainedToday };
};
