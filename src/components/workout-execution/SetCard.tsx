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

  const handleCompletePress = () => {
    if (set.completed || !isActive) return
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1)
    })
    onOneTapRepeat()
  }

  const hasGhostData = set.previousWeight !== undefined
  const weightDiff = hasGhostData ? set.weight - (set.previousWeight || 0) : 0

  return (
    <Animated.View entering={FadeInDown.delay(index * 50)}>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={handleCompletePress}
          disabled={!isActive || set.completed}
          style={[
            styles.setCard,
            {
              backgroundColor: set.completed
                ? theme.colors.success[500]
                : isActive
                ? theme.colors.primary[500]
                : theme.colors.gray[100],
              borderWidth: 0,
              opacity: !isActive && !set.completed ? 0.6 : 1
            }
          ]}
        >
          {/* Set Number Circle */}
          <View
            style={[
              styles.setNumber,
              {
                backgroundColor: set.completed
                  ? "rgba(255,255,255,0.3)"
                  : isActive
                  ? "rgba(255,255,255,0.25)"
                  : theme.colors.gray[200]
              }
            ]}
          >
            <Text
              variant="bodyMedium"
              style={{
                color: set.completed || isActive ? "white" : theme.colors.text.primary,
                fontWeight: "800",
                fontSize: 16
              }}
            >
              {index + 1}
            </Text>
          </View>

          {/* Main Content */}
          <View style={styles.contentSection}>
            {/* Weight */}
            <View style={styles.metricBox}>
              <Text
                style={{
                  color: set.completed || isActive ? "white" : theme.colors.text.primary,
                  fontWeight: "900",
                  fontSize: 20
                }}
              >
                {set.weight}
              </Text>
              <Text
                variant="small"
                style={{
                  color:
                    set.completed || isActive
                      ? "rgba(255,255,255,0.8)"
                      : theme.colors.text.secondary,
                  fontSize: 11,
                  fontWeight: "600"
                }}
              >
                kg
              </Text>
              {hasGhostData && weightDiff !== 0 && (
                <Text
                  style={{
                    color:
                      set.completed || isActive
                        ? "white"
                        : weightDiff > 0
                        ? theme.colors.success[500]
                        : theme.colors.error[500],
                    fontSize: 10,
                    fontWeight: "700",
                    marginTop: 2
                  }}
                >
                  {weightDiff > 0 ? "↑" : "↓"} {Math.abs(weightDiff)}
                </Text>
              )}
            </View>

            {/* Reps */}
            <View style={styles.metricBox}>
              <Text
                style={{
                  color: set.completed || isActive ? "white" : theme.colors.text.primary,
                  fontWeight: "900",
                  fontSize: 20
                }}
              >
                {set.reps}
              </Text>
              <Text
                variant="small"
                style={{
                  color:
                    set.completed || isActive
                      ? "rgba(255,255,255,0.8)"
                      : theme.colors.text.secondary,
                  fontSize: 11,
                  fontWeight: "600"
                }}
              >
                reps
              </Text>
            </View>
          </View>

          {/* Status Indicator */}
          <View style={styles.statusIcon}>
            {set.completed ? (
              <Ionicons name="checkmark-done-circle" size={28} color="white" />
            ) : isActive ? (
              <View style={[styles.pulseCircle, { borderColor: "white" }]} />
            ) : null}
          </View>
        </Pressable>

        {/* Controls Row */}
        {isActive && !set.completed && (
          <View style={styles.controlsRow}>
            <View style={styles.controlGroup}>
              <Text
                variant="small"
                style={{
                  color: theme.colors.text.secondary,
                  fontWeight: "700",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 0.5
                }}
              >
                Peso
              </Text>
              <View style={styles.controlButtons}>
                <Pressable
                  onPress={() => onAdjustWeight(-2.5)}
                  style={[styles.controlBtn, { backgroundColor: theme.colors.error[500] }]}
                  hitSlop={10}
                >
                  <Ionicons name="remove" size={16} color="white" />
                </Pressable>
                <Pressable
                  onPress={() => onAdjustWeight(2.5)}
                  style={[styles.controlBtn, { backgroundColor: theme.colors.success[500] }]}
                  hitSlop={10}
                >
                  <Ionicons name="add" size={16} color="white" />
                </Pressable>
              </View>
            </View>

            <View style={styles.controlGroup}>
              <Text
                variant="small"
                style={{
                  color: theme.colors.text.secondary,
                  fontWeight: "700",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: 0.5
                }}
              >
                Reps
              </Text>
              <View style={styles.controlButtons}>
                <Pressable
                  onPress={() => onAdjustReps(-1)}
                  style={[styles.controlBtn, { backgroundColor: theme.colors.error[500] }]}
                  hitSlop={10}
                >
                  <Ionicons name="remove" size={16} color="white" />
                </Pressable>
                <Pressable
                  onPress={() => onAdjustReps(1)}
                  style={[styles.controlBtn, { backgroundColor: theme.colors.success[500] }]}
                  hitSlop={10}
                >
                  <Ionicons name="add" size={16} color="white" />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  setCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 18,
    gap: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },

  setNumber: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0
  },

  contentSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 20
  },

  metricBox: {
    alignItems: "center",
    justifyContent: "center"
  },

  statusIcon: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4
  },

  pulseCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    opacity: 0.6
  },

  controlsRow: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 16,
    paddingHorizontal: 0
  },

  controlGroup: {
    flex: 1,
    gap: 8,
    alignItems: "center"
  },

  controlButtons: {
    flexDirection: "row",
    gap: 8,
    width: "100%"
  },

  controlBtn: {
    flex: 1,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  }
})
