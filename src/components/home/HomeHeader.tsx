import { useTheme } from "@/contexts/ThemeContext"
import { ANIMATION_DELAYS, ANIMATION_DURATION } from "@/utils/constants"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useMemo, useRef, useState } from "react"
import { Image, Pressable, Text as RNText, StyleSheet, View } from "react-native"
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming
} from "react-native-reanimated"

interface HomeHeaderProps {
  userName: string
  currentStreak: number
  workoutName?: string
  onAvatarPress: () => void
}

// Get formatted day of week in Portuguese
const getDayOfWeek = () => {
  const days = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
  ]
  return days[new Date().getDay()]
}

const SLOT_HEIGHT = 32

/**
 * Home screen header component
 * Displays rotating text with slot machine effect, streak counter, and user avatar button
 */
export const HomeHeader = ({
  userName,
  currentStreak,
  workoutName,
  onAvatarPress
}: HomeHeaderProps) => {
  const { theme } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const translateY = useSharedValue(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const dayOfWeek = getDayOfWeek()
  const displayWorkout = workoutName || "Descanso"

  // Array of texts to cycle through
  const texts = useMemo(() => [displayWorkout, dayOfWeek], [displayWorkout, dayOfWeek])

  // Cycle through texts
  useEffect(() => {
    const cycleText = () => {
      // Animate: current position -> spin up fast -> land on new position
      translateY.value = withSequence(
        // Quick spin up (exit current)
        withTiming(-SLOT_HEIGHT * 2, {
          duration: 200,
          easing: Easing.in(Easing.cubic)
        }),
        // Jump to below (instant)
        withTiming(SLOT_HEIGHT * 2, { duration: 0 }),
        // Spin up to center with bounce
        withTiming(0, {
          duration: 400,
          easing: Easing.out(Easing.back(1.2))
        })
      )

      // Change text in the middle of animation
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length)
      }, 200)
    }

    intervalRef.current = setInterval(cycleText, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [texts.length, translateY])

  const slotAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }))

  return (
    <Animated.View
      entering={FadeInDown.duration(ANIMATION_DURATION).delay(ANIMATION_DELAYS.header)}
      style={styles.header}
    >
      <View style={styles.leftSection}>
        <View style={styles.slotContainer}>
          <Animated.View style={[styles.slotContent, slotAnimatedStyle]}>
            <RNText
              style={[styles.slotText, { color: theme.colors.text.primary }]}
              numberOfLines={1}
            >
              {texts[currentIndex]}
            </RNText>
          </Animated.View>
        </View>
      </View>
      <View style={styles.rightSection}>
        <View style={styles.streakContainer}>
          <RNText style={[styles.streakText, { color: theme.colors.warning[900] }]}>
            {currentStreak}
          </RNText>
          <Image source={require("../../assets/images/app-icon.png")} style={styles.streakIcon} />
        </View>
        <Pressable
          onPress={onAvatarPress}
          style={[
            styles.avatarButton,
            {
              borderColor: theme.colors.gray[200],
              backgroundColor: "transparent"
            }
          ]}
        >
          <Ionicons name="person-outline" size={22} color={theme.colors.gray[600]} />
        </Pressable>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32
  },
  leftSection: {
    flex: 1,
    marginRight: 16
  },
  slotContainer: {
    height: SLOT_HEIGHT,
    overflow: "hidden",
    justifyContent: "center"
  },
  slotContent: {
    height: SLOT_HEIGHT,
    justifyContent: "center"
  },
  slotText: {
    fontSize: 32,
    lineHeight: 42,
    fontWeight: "700",
    fontFamily: "TekoRegular"
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  streakIcon: {
    width: 24,
    height: 24
  },
  streakText: {
    fontSize: 20,
    fontWeight: "500",
    fontFamily: "RobotoBold"
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center"
  }
})
