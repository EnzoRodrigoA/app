import { Card } from "@/components/UI/Card";
import { Text } from "@/components/UI/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface EmptyWorkoutCardProps {
  onConfigure: () => void;
}

/**
 * Empty workout card component
 * Displays when no workout is scheduled for the day
 */
export const EmptyWorkoutCard = ({ onConfigure }: EmptyWorkoutCardProps) => {
  const { theme } = useTheme();

  return (
    <Card
      variant="elevated"
      style={[
        styles.workoutCard,
        {
          backgroundColor: theme.colors.background.secondary,
          borderWidth: 1,
          borderColor: theme.colors.gray[200],
          borderStyle: "dashed",
        },
      ]}
      onPress={onConfigure}
    >
      <View style={styles.noWorkoutContent}>
        <View
          style={[
            styles.emptyIconContainer,
            { backgroundColor: theme.colors.primary[50] },
          ]}
        >
          <Ionicons
            name="add-circle-outline"
            size={32}
            color={theme.colors.primary[500]}
          />
        </View>
        <Text variant="h3" style={{ marginTop: 12 }}>
          Nenhum treino programado
        </Text>
        <Text variant="caption" color="secondary" style={{ marginTop: 4 }}>
          Toque para configurar seu treino
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  workoutCard: {
    borderRadius: 24,
    padding: 32,
  },
  noWorkoutContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
