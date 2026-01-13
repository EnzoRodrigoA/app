import { RestTimerOverlayProps } from "@/types/workout-execution"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { useEffect, useMemo, useRef, useState } from "react"
import { Pressable, Text as RNText, StyleSheet, View } from "react-native"
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated"
import Svg, { Circle } from "react-native-svg"
import CustomText from "../UI/Text"

export function RestTimerOverlay({ timeLeft, onSkip, theme }: RestTimerOverlayProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  // Hold-to-skip state
  const [holdStep, setHoldStep] = useState(0)
  const holdIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isHoldingRef = useRef(false)

  // Animated styles
  const buttonScale = useSharedValue(1)
  const ringPulse = useSharedValue(0)
  const SIZE = 120
  const STROKE = 8
  const RADIUS = (SIZE - STROKE) / 2
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  const progressPercent = useMemo(() => holdStep / 4, [holdStep])

  const getStepColor = (step: number) => {
    if (step <= 1) return theme.colors.primary[300] ?? theme.colors.primary[500]
    if (step === 2) return theme.colors.primary[400] ?? theme.colors.primary[500]
    if (step === 3) return theme.colors.primary[500]
    return theme.colors.success[500]
  }

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }))

  const startHold = () => {
    if (isHoldingRef.current) return
    isHoldingRef.current = true
    setHoldStep(0)
    buttonScale.value = withSpring(1.05)
    ringPulse.value = withSpring(1)

    // 4 steps, 500ms each -> ~2s hold
    let step = 0
    holdIntervalRef.current = setInterval(async () => {
      if (!isHoldingRef.current) return
      step += 1
      setHoldStep(step)
      // Haptics per step
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      // small pulse
      buttonScale.value = withSpring(1.5, {}, () => {
        buttonScale.value = withSpring(1.05)
      })

      if (step >= 4) {
        // Completed
        clearInterval(holdIntervalRef.current!)
        holdIntervalRef.current = null
        isHoldingRef.current = false
        buttonScale.value = withSpring(1)
        ringPulse.value = withSpring(0)
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        onSkip()
      }
    }, 500)
  }

  const cancelHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
    isHoldingRef.current = false
    setHoldStep(0)
    buttonScale.value = withSpring(1)
    ringPulse.value = withSpring(0)
  }

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current)
    }
  }, [])

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.restOverlay, { backgroundColor: `${theme.colors.background.primary}EE` }]}
    >
      <View style={styles.restContent}>
        <RNText style={[styles.labelText, { color: theme.colors.text.secondary }]}>DESCANSO</RNText>
        <RNText style={[styles.timerText, { color: theme.colors.primary[500] }]}>
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </RNText>
        {/* Hold-to-Skip Button */}
        <Pressable onPressIn={startHold} onPressOut={cancelHold} style={[styles.skipButton]}>
          <Animated.View style={[styles.skipCircle, buttonAnimatedStyle]}>
            <Svg width={SIZE} height={SIZE}>
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={theme.colors.background.secondary}
                strokeWidth={STROKE}
                fill="none"
              />
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                stroke={getStepColor(holdStep)}
                strokeWidth={STROKE}
                strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                strokeDashoffset={CIRCUMFERENCE * (1 - progressPercent)}
                strokeLinecap="round"
                fill="none"
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              />
            </Svg>
            <View style={styles.skipIconWrapper}>
              <Ionicons
                name="finger-print-outline"
                size={40}
                color={getStepColor(Math.max(holdStep, 1))}
              />
            </View>
          </Animated.View>
        </Pressable>
        <CustomText variant="body" color="secondary">
          Segure para pular o descanso
        </CustomText>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  restOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    elevation: 1000
  },
  restContent: {
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 10
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 3,
    marginBottom: 8
  },
  timerText: {
    fontSize: 72,
    fontWeight: "bold",
    fontFamily: "TekoBold",
    lineHeight: 80
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600"
  },
  skipButton: {
    marginTop: 24
  },
  skipCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "transparent"
  },
  skipIconWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  }
})
