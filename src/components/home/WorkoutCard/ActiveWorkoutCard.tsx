import { Card } from "@/components/UI/Card"
import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { useCardAnimations } from "@/hooks/use-card-animations"
import { Workout } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { Pressable, StyleSheet, View } from "react-native"
import Animated from "react-native-reanimated"

interface ActiveWorkoutCardProps {
  workout: Workout
  onStart: (workoutId: string) => void
}

/**
 * Active workout card component
 * Displays available workout with details and start button
 */
export const ActiveWorkoutCard = ({ workout, onStart }: ActiveWorkoutCardProps) => {
  const { theme } = useTheme()
  const { animatedStyle, handlePressIn, handlePressOut } = useCardAnimations()

  const handlePress = () => {
    onStart(workout.id)
  }

  return (
    <Pressable onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={animatedStyle}>
        <Card
          variant="filled"
          style={[
            styles.workoutCard,
            {
              backgroundColor: theme.colors.primary[500],
              overflow: "hidden"
            }
          ]}
        >
          <View style={styles.gradientOverlay} />

          <View style={styles.workoutCardContent}>
            <View style={styles.workoutTopSection}>
              <View style={styles.workoutMainInfo}>
                <View style={styles.workoutTextContainer}>
                  <Text variant="h2" color="inverse" style={{ fontSize: 24 }}>
                    {workout.name}
                  </Text>
                  <View style={styles.workoutMetaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="barbell-outline" size={14} color="rgba(255,255,255,0.9)" />
                      <Text variant="small" style={{ color: "rgba(255,255,255,0.9)" }}>
                        {workout.exercises.length} exercícios
                      </Text>
                    </View>
                    <View style={styles.metaDivider} />
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.9)" />
                      <Text variant="small" style={{ color: "rgba(255,255,255,0.9)" }}>
                        ~{workout.estimatedMinutes || 45} min
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.workoutDivider} />

            <View style={styles.workoutBottomSection}>
              <View style={styles.ctaContent}>
                <View>
                  <Text variant="caption" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Pronto para treinar?
                  </Text>
                  <Text variant="bodyMedium" color="inverse" style={{ marginTop: 2 }}>
                    Toque para começar
                  </Text>
                </View>
                <View style={[styles.startButton, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
                  <Ionicons name="play" size={20} color="white" />
                </View>
              </View>
            </View>
          </View>
        </Card>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  workoutCard: {
    borderRadius: 24,
    padding: 0
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1
  },
  workoutCardContent: {
    padding: 24
  },
  workoutTopSection: {
    marginBottom: 20
  },
  workoutMainInfo: {
    flexDirection: "row",
    gap: 16
  },
  workoutIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center"
  },
  workoutEmoji: {
    fontSize: 40,
    lineHeight: 60
  },
  workoutTextContainer: {
    flex: 1,
    gap: 8
  },
  workoutMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: "rgba(255,255,255,0.4)"
  },
  workoutDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 20
  },
  workoutBottomSection: {
    marginTop: 4
  },
  ctaContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  startButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center"
  }
})
