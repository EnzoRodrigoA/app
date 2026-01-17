import Button from "@/components/UI/Button"
import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { WorkoutExercise } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { useCallback } from "react"
import { StyleSheet, View } from "react-native"
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated"

export type NodeState = "completed" | "active" | "upcoming" | "locked"

interface ExerciseNodeProps {
  exercise: WorkoutExercise
  index: number
  state: NodeState
  position: "left" | "center" | "right"
  onPress?: () => void
  totalExercises: number
}

const NODE_SIZE = 52
const ACTIVE_NODE_SIZE = 72

/**
 * Exercise node component - Duolingo style
 * Clean, minimal design with colored circles and icons
 */
export const ExerciseNode = ({
  exercise,
  index,
  state,
  position,
  onPress,
  totalExercises
}: ExerciseNodeProps) => {
  const { theme } = useTheme()

  const handlePress = useCallback(() => {
    if (state === "active" || state === "completed") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      onPress?.()
    }
  }, [state, onPress])

  const nodeSize = state === "active" ? ACTIVE_NODE_SIZE : NODE_SIZE
  const isInteractive = state === "active" || state === "completed"

  // Get alignment based on position
  const getAlignment = () => {
    switch (position) {
      case "left":
        return "flex-start"
      case "right":
        return "flex-end"
      default:
        return "center"
    }
  }

  // Get margin for serpentine effect - aligned with path connector
  const getMarginLeft = () => {
    switch (position) {
      case "left":
        return 20
      case "right":
        return 0
      default:
        return 0
    }
  }

  const getMarginRight = () => {
    switch (position) {
      case "right":
        return 20
      default:
        return 0
    }
  }

  // Entry animation
  const getEnteringAnimation = () => {
    if (state === "completed") {
      return ZoomIn.springify().delay(index * 40)
    }
    return FadeInDown.duration(300).delay(index * 60)
  }

  // Node colors based on state - Duolingo style
  const getNodeStyle = () => {
    switch (state) {
      case "completed":
        return {
          backgroundColor: theme.colors.success[500],
          borderColor: theme.colors.success[700],
          shadowColor: theme.colors.success[500]
        }
      case "active":
        return {
          backgroundColor: theme.colors.primary[500],
          borderColor: theme.colors.primary[700],
          shadowColor: theme.colors.primary[500]
        }
      case "upcoming":
        return {
          backgroundColor: theme.colors.gray[200],
          borderColor: theme.colors.gray[400],
          shadowColor: theme.colors.gray[300]
        }
      case "locked":
        return {
          backgroundColor: theme.colors.gray[300],
          borderColor: theme.colors.gray[500],
          shadowColor: theme.colors.gray[400]
        }
    }
  }

  const nodeStyle = getNodeStyle()

  // Render icon based on state
  const renderNodeContent = () => {
    if (state === "completed") {
      return <Ionicons name="checkmark" size={32} color="white" />
    }
    if (state === "locked") {
      return <Ionicons name="lock-closed" size={28} color={theme.colors.gray[500]} />
    }
    if (state === "active") {
      return <Ionicons name="play" size={32} color="white" />
    }
    // upcoming
    return <Ionicons name="barbell-outline" size={28} color={theme.colors.gray[500]} />
  }

  return (
    <Animated.View
      entering={getEnteringAnimation()}
      style={[
        styles.container,
        {
          alignItems: getAlignment(),
          marginLeft: getMarginLeft(),
          marginRight: getMarginRight()
        }
      ]}
    >
      <View style={styles.nodeWrapper}>
        {/* Glow ring for active state */}
        {state === "active" && (
          <View
            style={[
              styles.glowRing,
              {
                width: nodeSize + 16,
                height: nodeSize + 16,
                borderRadius: (nodeSize + 16) / 2,
                borderColor: theme.colors.primary[200],
                backgroundColor: theme.colors.primary[50]
              }
            ]}
          />
        )}

        {state === "active" && (
          <View style={styles.crownContainer}>
            <View style={[styles.crownBadge, { backgroundColor: theme.colors.warning[500] }]}>
              <Ionicons name="star" size={14} color="white" />
            </View>
          </View>
        )}

        {/* Main node button with 3D effect */}
        <Button
          shape="circular"
          size={nodeSize}
          onPress={handlePress}
          disabled={!isInteractive}
          backgroundColor={nodeStyle.backgroundColor}
          shadowColor={nodeStyle.shadowColor}
          borderColor={nodeStyle.borderColor}
          icon={renderNodeContent()}
        />

        {/* Exercise name label */}
        <View style={styles.labelContainer}>
          <Text
            variant="bodyMedium"
            style={[
              styles.exerciseName,
              {
                color:
                  state === "completed"
                    ? theme.colors.success[600]
                    : state === "active"
                    ? theme.colors.text.primary
                    : theme.colors.text.secondary,
                fontWeight: state === "active" ? "700" : "500"
              }
            ]}
            numberOfLines={2}
          >
            {exercise.exercise.name}
          </Text>

          {/* Sets info pill */}
          <View
            style={[
              styles.setsPill,
              {
                backgroundColor:
                  state === "completed"
                    ? theme.colors.success[100]
                    : state === "active"
                    ? theme.colors.primary[100]
                    : theme.colors.gray[100]
              }
            ]}
          >
            <Text
              variant="small"
              style={{
                color:
                  state === "completed"
                    ? theme.colors.success[600]
                    : state === "active"
                    ? theme.colors.primary[600]
                    : theme.colors.gray[500],
                fontWeight: "600"
              }}
            >
              {exercise.sets.length} séries
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16
  },
  nodeWrapper: {
    alignItems: "center",
    gap: 10,
    position: "relative",
    width: NODE_SIZE + 135
  },
  glowRing: {
    position: "absolute",
    top: -6,
    borderWidth: 3,
    zIndex: 0
  },
  crownContainer: {
    position: "absolute",
    top: -18,
    left: "50%",
    marginLeft: -14,
    zIndex: 10
  },
  crownBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4
  },
  labelContainer: {
    alignItems: "center",
    maxWidth: 140,
    gap: 6
  },
  exerciseName: {
    textAlign: "center",
    lineHeight: 24,
    fontSize: 18,
    fontFamily: "TekoRegular"
  },
  setsPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  }
})
