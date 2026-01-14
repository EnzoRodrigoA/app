import { TodayWorkout } from "@/types";
import { ANIMATION_DELAYS, ANIMATION_DURATION } from "@/utils/constants";
import { View, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ActiveWorkoutCard } from "./ActiveWorkoutCard";
import { RestDayCard } from "./RestDayCard";
import { EmptyWorkoutCard } from "./EmptyWorkoutCard";
import { WorkoutCardSkeleton } from "./WorkoutCardSkeleton";
import { Text } from "@/components/UI/Text";
import { useTheme } from "@/contexts/ThemeContext";

interface WorkoutCardProps {
  workout: TodayWorkout | null;
  loading: boolean;
  onStart: (workoutId: string) => void;
  onConfigure: () => void;
}

/**
 * Compound workout card component
 * Renders appropriate card based on workout state (loading, rest, active, empty)
 */
export const WorkoutCard = ({
  workout,
  loading,
  onStart,
  onConfigure,
}: WorkoutCardProps) => {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(ANIMATION_DURATION).delay(
        ANIMATION_DELAYS.workout
      )}
      style={styles.section}
    >
      <View style={styles.workoutHeader}>
        <Text variant="caption" color="secondary" style={styles.sectionLabel}>
          TREINO DE HOJE
        </Text>
        <View style={styles.workoutBadge}>
          <View
            style={[
              styles.badgeDot,
              { backgroundColor: theme.colors.success[500] },
            ]}
          />
          <Text variant="small" color="secondary">
            Disponível
          </Text>
        </View>
      </View>

      {loading ? (
        <WorkoutCardSkeleton />
      ) : workout?.isRestDay ? (
        <RestDayCard />
      ) : workout?.workout ? (
        <ActiveWorkoutCard workout={workout.workout} onStart={onStart} />
      ) : (
        <EmptyWorkoutCard onConfigure={onConfigure} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionLabel: {
    letterSpacing: 1,
    fontWeight: "600",
  },
  workoutBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 12,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
