/**
 * Progress calculation utility functions
 * Pure functions with no side effects
 */

/**
 * Calculates weekly progress percentage
 * @param {number} completed - Number of workouts completed
 * @param {number} goal - Weekly workout goal
 * @returns {number} Progress percentage (0-100)
 */
export const calculateWeeklyProgress = (
  completed: number,
  goal: number
): number => {
  if (goal === 0) return 0;
  return Math.round((completed / goal) * 100);
};

/**
 * Returns color semantic based on progress percentage
 * @param {number} progress - Progress percentage (0-100)
 * @returns {"success" | "warning" | "error"} Color semantic
 */
export const getProgressColor = (
  progress: number
): "success" | "warning" | "error" => {
  if (progress >= 80) return "success";
  if (progress >= 50) return "warning";
  return "error";
};
