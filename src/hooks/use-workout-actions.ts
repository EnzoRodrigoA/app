import { useCallback } from "react";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

/**
 * Return type for useWorkoutActions hook
 */
interface UseWorkoutActionsReturn {
  startWorkout: (workoutId: string) => void;
  configureWorkout: () => void;
}

/**
 * Custom hook for workout-related actions
 * Handles navigation to workout screens with appropriate haptic feedback
 *
 * @returns {UseWorkoutActionsReturn} Workout action handlers
 */
export const useWorkoutActions = (): UseWorkoutActionsReturn => {
  const router = useRouter();

  const startWorkout = useCallback(
    (workoutId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push(`/workout/${workoutId}` as any);
    },
    [router]
  );

  const configureWorkout = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/workout" as any);
  }, [router]);

  return { startWorkout, configureWorkout };
};
