import { Card } from "@/components/UI/Card"
import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { ANIMATION_DELAYS, ANIMATION_DURATION } from "@/utils/constants"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

interface WeeklyProgressCardProps {
  completed: number
  goal: number
  progress: number
}

/**
 * Weekly progress card component
 * Displays weekly workout goal progress with progress bar
 */
export const WeeklyProgressCard = ({ completed, goal, progress }: WeeklyProgressCardProps) => {
  const { theme } = useTheme()
  const isCompleted = completed >= goal

  return (
    <Animated.View
      entering={FadeInDown.duration(ANIMATION_DURATION).delay(ANIMATION_DELAYS.weeklyProgress)}
      style={styles.section}
    >
      <View style={styles.sectionHeader}>
        <Text variant="caption" color="secondary" style={{ fontWeight: "600", letterSpacing: 1 }}>
          META SEMANAL
        </Text>
        <Pressable onPress={() => router.push("/dashboard" as any)}>
          <Text variant="caption" color="primary">
            Ver mais →
          </Text>
        </Pressable>
      </View>
      <Card
        variant="elevated"
        style={[
          styles.progressCard,
          {
            backgroundColor: theme.colors.background.paper,
            borderColor: theme.colors.border
          }
        ]}
      >
        {/* Header */}
        <View style={styles.progressHeader}>
          <View style={styles.headerContent}>
            <View style={styles.titleRow}>
              <Ionicons name="flame" size={24} color={theme.colors.warning[800]} />
              <Text variant="h3" style={{ fontWeight: "800" }}>
                Semana em Fogo
              </Text>
            </View>
            <Text variant="small" color="secondary" style={{ marginLeft: 32 }}>
              Complete seus treinos
            </Text>
          </View>

          {/* Progress Badge */}
          <View
            style={[
              styles.progressBadge,
              {
                backgroundColor: isCompleted ? theme.colors.success[500] : theme.colors.primary[500]
              }
            ]}
          >
            <Text
              variant="h3"
              style={{
                color: "white",
                fontWeight: "900",
                fontSize: 20
              }}
            >
              {completed}
            </Text>
            <Text
              variant="small"
              style={{
                color: "rgba(255,255,255,0.9)",
                fontWeight: "600",
                fontSize: 11
              }}
            >
              de {goal}
            </Text>
          </View>
        </View>

        {/* Progress bar com gradiente */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { backgroundColor: theme.colors.gray[200] }]}>
            <LinearGradient
              colors={[theme.colors.primary[400], theme.colors.primary[500]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(progress, 100)}%`
                }
              ]}
            />
          </View>

          {/* Progress text */}
          <View style={styles.progressInfo}>
            <Text
              variant="small"
              style={{
                fontWeight: "700",
                color: theme.colors.text.primary
              }}
            >
              {progress}% Completo
            </Text>
            {isCompleted && (
              <View style={styles.completeBadge}>
                <Ionicons name="checkmark-circle" size={16} color={theme.colors.success[500]} />
                <Text
                  variant="small"
                  style={{
                    fontWeight: "600",
                    color: theme.colors.success[500],
                    fontSize: 11
                  }}
                >
                  Meta atingida!
                </Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 22
  },
  progressCard: {
    borderRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 16
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  headerContent: {
    flex: 1,
    gap: 4
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  progressBadge: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5
  },
  progressBarContainer: {
    gap: 12
  },
  progressBar: {
    height: 16,
    borderRadius: 8,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    borderRadius: 8
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  completeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  }
})
