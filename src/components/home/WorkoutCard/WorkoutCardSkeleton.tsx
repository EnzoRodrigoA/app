import { Card } from "@/components/UI/Card";
import { StyleSheet, View } from "react-native";

/**
 * Workout card loading skeleton component
 * Displays while workout data is being fetched
 */
export const WorkoutCardSkeleton = () => {
  return (
    <Card variant="elevated" style={styles.workoutCard}>
      <View style={styles.skeletonContent}>
        <View style={[styles.skeleton, { width: "60%", height: 28 }]} />
        <View
          style={[styles.skeleton, { width: "40%", height: 16, marginTop: 8 }]}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  workoutCard: {
    borderRadius: 24,
    padding: 24,
  },
  skeletonContent: {
    paddingVertical: 16,
  },
  skeleton: {
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 8,
  },
});
