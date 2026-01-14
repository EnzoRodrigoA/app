import { Card } from "@/components/UI/Card";
import { Text } from "@/components/UI/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { ANIMATION_DELAYS, ANIMATION_DURATION } from "@/utils/constants";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface WeeklyProgressCardProps {
  completed: number;
  goal: number;
  progress: number;
}

/**
 * Weekly progress card component
 * Displays weekly workout goal progress with progress bar
 */
export const WeeklyProgressCard = ({
  completed,
  goal,
  progress,
}: WeeklyProgressCardProps) => {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(ANIMATION_DURATION).delay(
        ANIMATION_DELAYS.weeklyProgress
      )}
      style={styles.section}
    >
      <Card variant="elevated" style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text variant="bodyMedium">Meta Semanal</Text>
          <Text variant="h3" color="primary">
            {completed}/{goal}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.gray[200] },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.colors.primary[500],
                  width: `${Math.min(progress, 100)}%`,
                },
              ]}
            />
          </View>
          <Text variant="small" color="secondary">
            {progress}% completo
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  progressCard: {
    padding: 20,
    borderRadius: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
});
