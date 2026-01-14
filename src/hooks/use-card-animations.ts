import { SCALE_VALUES } from "@/utils/constants"
import * as Haptics from "expo-haptics"
import { useCallback } from "react"
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

/**
 * Return type for useCardAnimations hook
 */
interface UseCardAnimationsReturn {
  animatedStyle: {
    transform: { scale: number }[]
  }
  handlePressIn: () => void
  handlePressOut: () => void
  handlePress: () => void
}

/**
 * Custom hook for card press animations
 * Provides consistent press, hover, and release animations for cards
 *
 * @returns {UseCardAnimationsReturn} Animated style and event handlers
 */
export const useCardAnimations = (): UseCardAnimationsReturn => {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }))

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(SCALE_VALUES.pressed)
  }, [scale])

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(SCALE_VALUES.normal)
  }, [scale])

  const handlePress = useCallback(() => {
    scale.value = withSpring(SCALE_VALUES.hover, {}, () => {
      scale.value = withSpring(SCALE_VALUES.normal)
    })
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
  }, [scale])

  return {
    animatedStyle,
    handlePressIn,
    handlePressOut,
    handlePress
  }
}
