import { useTheme } from "@/contexts/ThemeContext"
import { useEffect } from "react"
import { StyleSheet, View } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

interface WorkoutProgressBarProps {
  progress: number
  exerciseCount: number
  completedIndices: number[]
}

export function WorkoutProgressBar({
  progress,
  exerciseCount,
  completedIndices
}: WorkoutProgressBarProps) {
  const { theme } = useTheme()
  const progressWidth = useSharedValue(0)

  useEffect(() => {
    progressWidth.value = withTiming(progress * 100, { duration: 0.5 })
  }, [progress, progressWidth])

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`
  }))

  return (
    <View style={[styles.progressBar, { backgroundColor: theme.colors.gray[100] }]}>
      <Animated.View style={[styles.progressFill, animatedProgressStyle]}></Animated.View>

      <View style={styles.progressMilestones}>
        {Array.from({ length: exerciseCount }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressMilestone,
              {
                left: `${((index + 1) / exerciseCount) * 100}%`,
                backgroundColor: completedIndices.includes(index)
                  ? theme.colors.success[500]
                  : theme.colors.gray[300]
              }
            ]}
          />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  progressBar: {
    height: 8,
    width: "100%",
    position: "relative"
  },
  progressFill: {
    height: "100%",
    overflow: "hidden"
  },
  progressGradient: {
    flex: 1
  },
  progressMilestones: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  progressMilestone: {
    position: "absolute",
    width: 4,
    height: 8,
    marginLeft: -2,
    borderRadius: 2
  }
})
