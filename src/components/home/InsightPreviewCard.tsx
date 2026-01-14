import { Card } from "@/components/UI/Card";
import { Text } from "@/components/UI/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

type WeeklyData = {
  day: string;
  value: number; // 0-1 normalized value
  label: string; // Day abbreviation
};

type InsightPreviewCardProps = {
  weeklyData: WeeklyData[];
  trend: number; // Percentage change vs last week (e.g., +15)
  totalWorkouts: number;
};

export const InsightPreviewCard = ({
  weeklyData,
  trend,
  totalWorkouts,
}: InsightPreviewCardProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const maxBarHeight = 80;

  const handlePress = () => {
    router.push("/dashboard" as any);
  };

  return (
    <Card variant="elevated" style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <View>
          <Text variant="h3">Esta Semana</Text>
          <Text variant="caption" color="secondary" style={styles.subtitle}>
            {totalWorkouts} treino{totalWorkouts !== 1 ? "s" : ""} completados
          </Text>
        </View>
        <View
          style={[
            styles.trendBadge,
            {
              backgroundColor:
                trend >= 0 ? theme.colors.success[50] : theme.colors.error[50],
            },
          ]}
        >
          <Ionicons
            name={trend >= 0 ? "trending-up" : "trending-down"}
            size={16}
            color={trend >= 0 ? theme.colors.success[600] : theme.colors.error[600]}
          />
          <Text
            variant="small"
            style={{
              color: trend >= 0 ? theme.colors.success[700] : theme.colors.error[700],
              fontWeight: "600",
            }}
          >
            {trend > 0 ? "+" : ""}
            {trend}%
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <View style={[styles.barsContainer, { height: maxBarHeight }]}>
          {weeklyData.map((day, index) => (
            <MiniBar
              key={index}
              value={day.value}
              maxHeight={maxBarHeight}
              label={day.label}
              color={theme.colors.primary[500]}
            />
          ))}
        </View>
      </View>

      <Pressable onPress={handlePress} style={styles.footer}>
        <Text variant="caption" color="primary" style={styles.footerText}>
          Ver análise completa
        </Text>
        <Ionicons name="arrow-forward" size={16} color={theme.colors.primary[500]} />
      </Pressable>
    </Card>
  );
};

// Mini bar component for the chart
type MiniBarProps = {
  value: number;
  maxHeight: number;
  label: string;
  color: string;
};

const MiniBar = ({ value, maxHeight, label, color }: MiniBarProps) => {
  const { theme } = useTheme();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(maxHeight * value, { duration: 600 }),
      opacity: withTiming(value > 0 ? 1 : 0.3, { duration: 600 }),
    };
  }, [value, maxHeight]);

  return (
    <View style={styles.barWrapper}>
      <Animated.View
        style={[
          styles.bar,
          {
            backgroundColor: color,
          },
          animatedStyle,
        ]}
      />
      <Text
        variant="small"
        color="secondary"
        style={styles.barLabel}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 4,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  chartContainer: {
    marginBottom: 16,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  bar: {
    width: "100%",
    borderRadius: 6,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 11,
    textTransform: "uppercase",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  footerText: {
    fontWeight: "500",
  },
});
