import { Card } from "@/components/UI/Card"
import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { ANIMATION_DELAYS, ANIMATION_DURATION } from "@/utils/constants"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, { FadeInDown, useAnimatedStyle, withTiming } from "react-native-reanimated"

type WeeklyData = {
  day: string
  value: number // 0-1 normalized value
  label: string // Day abbreviation
}

type InsightPreviewCardProps = {
  weeklyData: WeeklyData[]
  trend: number // Percentage change vs last week (e.g., +15)
  totalWorkouts: number
}

export const InsightPreviewCard = ({
  weeklyData,
  trend,
  totalWorkouts
}: InsightPreviewCardProps) => {
  const { theme } = useTheme()
  const router = useRouter()
  const maxBarHeight = 100
  const isTrendPositive = trend >= 0

  const handlePress = () => {
    router.push("/dashboard" as any)
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(ANIMATION_DURATION).delay(ANIMATION_DELAYS.weeklyProgress)}
      style={styles.section}
    >
      <Card
        variant="elevated"
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.background.paper,
            borderColor: theme.colors.border
          }
        ]}
        onPress={handlePress}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.titleRow}>
              <Ionicons name="bar-chart" size={24} color={theme.colors.info[500]} />
              <Text variant="h3" style={{ fontWeight: "800" }}>
                Esta Semana
              </Text>
            </View>
            <Text variant="small" color="secondary" style={styles.subtitle}>
              {totalWorkouts} treino{totalWorkouts !== 1 ? "s" : ""} completado
              {totalWorkouts !== 1 ? "s" : ""}
            </Text>
          </View>

          <View
            style={[
              styles.trendBadge,
              {
                backgroundColor: isTrendPositive
                  ? theme.colors.success[500]
                  : theme.colors.error[500]
              }
            ]}
          >
            <Ionicons
              name={isTrendPositive ? "trending-up" : "trending-down"}
              size={18}
              color="white"
            />
            <Text
              variant="bodyMedium"
              style={{
                color: "white",
                fontWeight: "700",
                fontSize: 14
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
                theme={theme}
              />
            ))}
          </View>
        </View>

        <Pressable
          onPress={handlePress}
          style={[styles.footer, { borderTopColor: theme.colors.gray[200] }]}
        >
          <View style={styles.footerContent}>
            <Ionicons name="arrow-forward" size={18} color={theme.colors.primary[500]} />
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.primary[500], fontWeight: "700" }}
            >
              Ver análise completa
            </Text>
          </View>
        </Pressable>
      </Card>
    </Animated.View>
  )
}

// Mini bar component for the chart
type MiniBarProps = {
  value: number
  maxHeight: number
  label: string
  color: string
  theme: any
}

const MiniBar = ({ value, maxHeight, label, color, theme }: MiniBarProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(maxHeight * value, { duration: 600 }),
      opacity: withTiming(value > 0 ? 1 : 0.35, { duration: 600 })
    }
  }, [value, maxHeight])

  const isActive = value > 0

  return (
    <View style={styles.barWrapper}>
      <Animated.View style={[styles.barContainer, animatedStyle]}>
        {isActive ? (
          <LinearGradient
            colors={[color, theme.colors.primary[600]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.bar, { borderRadius: 8 }]}
          >
            {value > 0.5 && (
              <View style={styles.barCheckmark}>
                <Ionicons name="checkmark" size={12} color="white" />
              </View>
            )}
          </LinearGradient>
        ) : (
          <View style={[styles.bar, { backgroundColor: theme.colors.gray[200] }]} />
        )}
      </Animated.View>
      <Text
        variant="small"
        style={[
          styles.barLabel,
          {
            color: isActive ? theme.colors.text.primary : theme.colors.text.secondary,
            fontWeight: isActive ? "700" : "500"
          }
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 22
  },
  card: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
    gap: 12
  },
  headerLeft: {
    flex: 1,
    gap: 6
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500"
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3
  },
  chartContainer: {
    marginBottom: 20
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 6
  },
  barWrapper: {
    flex: 1,
    alignItems: "center",
    gap: 8
  },
  barContainer: {
    width: "100%"
  },
  bar: {
    width: "100%",
    minHeight: 6,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 2
  },
  barCheckmark: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center"
  },
  barLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.4
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 16,
    borderTopWidth: 1
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  }
})
