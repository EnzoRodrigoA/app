import { useTheme } from "@/contexts/ThemeContext"
import { ANIMATION_DELAYS, ANIMATION_DURATION } from "@/utils/constants"
import { Ionicons } from "@expo/vector-icons"
import { Image, Pressable, Text as RNText, StyleSheet, View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

interface HomeHeaderProps {
  currentStreak: number
  workoutName?: string
  onAvatarPress: () => void
}

/**
 * Home screen header component
 * Displays today's workout name, streak counter, and user avatar button
 */
export const HomeHeader = ({ currentStreak, workoutName, onAvatarPress }: HomeHeaderProps) => {
  const { theme } = useTheme()
  const displayWorkout = workoutName || "Dia de Descanso"

  return (
    <Animated.View
      entering={FadeInDown.duration(ANIMATION_DURATION).delay(ANIMATION_DELAYS.header)}
      style={styles.header}
    >
      <View style={styles.leftSection}>
        <RNText
          style={[styles.workoutTitle, { color: theme.colors.text.primary }]}
          numberOfLines={1}
        >
          {displayWorkout}
        </RNText>
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
  workoutTitle: {
    fontSize: 28,
    lineHeight: 36,
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
    width: 32,
    height: 32
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
