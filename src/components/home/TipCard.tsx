import { Card } from "@/components/UI/Card";
import { Text } from "@/components/UI/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { ANIMATION_DELAYS, ANIMATION_DURATION } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

interface TipCardProps {
  streak: number;
}

/**
 * Tip card component
 * Displays coaching tips based on user's streak
 */
export const TipCard = ({ streak }: TipCardProps) => {
  const { theme } = useTheme();

  const getTipMessage = () => {
    if (streak >= 7) {
      return "Você está voando! Considere uma semana de deload em breve.";
    }
    return "Continue assim! Consistência é a chave para resultados.";
  };

  if (streak === 0) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(ANIMATION_DURATION).delay(ANIMATION_DELAYS.tip)}
      style={styles.section}
    >
      <Card
        variant="outlined"
        style={[
          styles.tipCard,
          {
            backgroundColor: theme.colors.gray[50],
            borderColor: theme.colors.primary[100],
          },
        ]}
      >
        <View style={styles.tipContent}>
          <Ionicons
            name="bulb-outline"
            size={24}
            color={theme.colors.primary[600]}
            style={{ marginTop: 2 }}
          />
          <View style={styles.tipTextContainer}>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.primary[700] }}
            >
              Dica do Coach
            </Text>
            <Text
              variant="caption"
              style={{ color: theme.colors.primary[600] }}
            >
              {getTipMessage()}
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  tipCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  tipContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipTextContainer: {
    flex: 1,
    gap: 4,
  },
});
