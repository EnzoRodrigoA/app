// ============================================
// LIFTLOG - Set Card Component
// ============================================

import { Text } from "@/components/UI/Text"
import { SetCardProps } from "@/types/workout-execution"
import { Ionicons } from "@expo/vector-icons"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated"

export function SetCard({
  set,
  index,
  isActive,
  onOneTapRepeat,
  onAdjustWeight,
  onAdjustReps,
  theme
}: SetCardProps) {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  const handleCompleteLongPress = () => {
    if (set.completed || !isActive) return
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1)
    })
    onOneTapRepeat()
  }

  const hasGhostData = set.previousWeight !== undefined
  const weightDiff = hasGhostData ? set.weight - (set.previousWeight || 0) : 0

  return (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <Animated.View style={animatedStyle}>
        <View
          style={[
            styles.setCard,
            {
              backgroundColor: set.completed
                ? `${theme.colors.success[500]}15`
                : isActive
                  ? theme.colors.background.secondary
                  : theme.colors.background.tertiary,
              borderColor: isActive ? theme.colors.primary[500] : "transparent",
              borderWidth: isActive ? 2 : 0,
              opacity: !isActive && !set.completed ? 0.5 : 1
            }
          ]}
        >
          {/* Set Number */}
          <Pressable
            style={styles.setNumber}
            onLongPress={handleCompleteLongPress}
            delayLongPress={350}
            hitSlop={12}
            disabled={set.completed || !isActive}
          >
            {set.completed ? (
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.success[500]} />
            ) : (
              <View
                style={[
                  styles.setNumberCircle,
                  {
                    backgroundColor: isActive
                      ? theme.colors.primary[500]
                      : theme.colors.background.tertiary
                  }
                ]}
              >
                {isActive ? (
                  <Ionicons
                    name="finger-print-outline"
                    variant="bodyMedium"
                    size={22}
                    style={{ color: isActive ? "white" : theme.colors.text.secondary }}
                  />
                ) : (
                  <Text variant="bodyMedium" style={{ color: theme.colors.primary[500] }}>
                    {index + 1}
                  </Text>
                )}
              </View>
            )}
          </Pressable>

          {/* Weight */}
          <View style={styles.setMetric}>
            <View style={styles.metricAdjust}>
              {isActive && !set.completed && (
                <Pressable
                  onPress={() => onAdjustWeight(-2.5)}
                  style={styles.adjustButton}
                  hitSlop={12}
                >
                  <Ionicons name="remove" size={16} color={theme.colors.text.secondary} />
                </Pressable>
              )}
              <View style={styles.metricValue}>
                <Text variant="h3">{set.weight}</Text>
                <Text variant="caption" color="secondary">
                  kg
                </Text>
              </View>
              {isActive && !set.completed && (
                <Pressable
                  onPress={() => onAdjustWeight(2.5)}
                  style={styles.adjustButton}
                  hitSlop={12}
                >
                  <Ionicons name="add" size={16} color={theme.colors.text.secondary} />
                </Pressable>
              )}
            </View>
            {hasGhostData && weightDiff !== 0 && (
              <Text
                variant="small"
                style={{
                  color: weightDiff > 0 ? theme.colors.success[500] : theme.colors.error[500]
                }}
              >
                {weightDiff > 0 ? "+" : ""}
                {weightDiff}kg
              </Text>
            )}
          </View>

          {/* Reps */}
          <View style={styles.setMetric}>
            <View style={styles.metricAdjust}>
              {isActive && !set.completed && (
                <Pressable
                  onPress={() => onAdjustReps(-1)}
                  style={styles.adjustButton}
                  hitSlop={12}
                >
                  <Ionicons name="remove" size={16} color={theme.colors.text.secondary} />
                </Pressable>
              )}
              <View style={styles.metricValue}>
                <Text variant="h3">{set.reps}</Text>
                <Text variant="caption" color="secondary">
                  reps
                </Text>
              </View>
              {isActive && !set.completed && (
                <Pressable onPress={() => onAdjustReps(1)} style={styles.adjustButton} hitSlop={12}>
                  <Ionicons name="add" size={16} color={theme.colors.text.secondary} />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  setCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12
  },

  setNumber: {
    width: 40,
    alignItems: "center"
  },

  setNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center"
  },

  setMetric: {
    flex: 1,
    alignItems: "center"
  },

  metricAdjust: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  metricValue: {
    alignItems: "center",
    minWidth: 50
  },
  adjustButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(128,128,128,0.2)"
  },
  oneTapHint: {
    position: "absolute",
    right: 16,
    top: 16
  }
})
