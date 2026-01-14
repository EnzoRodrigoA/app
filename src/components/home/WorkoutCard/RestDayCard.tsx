import { Card } from "@/components/UI/Card";
import { Text } from "@/components/UI/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

/**
 * Rest day card component
 * Displays rest day message with recovery tips
 */
export const RestDayCard = () => {
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
        },
      ]}
    >
      <View style={styles.restCardContent}>
        <View style={styles.restHeader}>
          <View
            style={[
              styles.restIconContainer,
              { backgroundColor: theme.colors.warning[50] },
            ]}
          >
            <Text style={styles.restEmoji}>😴</Text>
          </View>
          <View style={styles.restTextContainer}>
            <Text variant="h2">Dia de Descanso</Text>
            <Text variant="caption" color="secondary" style={{ marginTop: 4 }}>
              Recuperação ativa recomendada
            </Text>
          </View>
        </View>
        <View style={styles.restTips}>
          <View style={styles.restTip}>
            <Ionicons
              name="water-outline"
              size={16}
              color={theme.colors.primary[500]}
            />
            <Text variant="small" color="secondary">
              Mantenha-se hidratado
            </Text>
          </View>
          <View style={styles.restTip}>
            <Ionicons
              name="walk-outline"
              size={16}
              color={theme.colors.primary[500]}
            />
            <Text variant="small" color="secondary">
              Caminhada leve opcional
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  workoutCard: {
    borderRadius: 24,
    padding: 24,
  },
  restCardContent: {
    gap: 20,
  },
  restHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  restIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  restEmoji: {
    fontSize: 28,
  },
  restTextContainer: {
    flex: 1,
  },
  restTips: {
    gap: 12,
    paddingTop: 4,
  },
  restTip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
