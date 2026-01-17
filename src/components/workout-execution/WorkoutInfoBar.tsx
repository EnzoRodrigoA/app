import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"
import Animated, { FadeInDown } from "react-native-reanimated"

interface WorkoutInfoBarProps {
  workoutName: string
  currentIndex: number
  totalExercises: number
}

/**
 * Barra de informações do treino atual
 */
export function WorkoutInfoBar({ workoutName, currentIndex, totalExercises }: WorkoutInfoBarProps) {
  const { theme } = useTheme()

  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(100)}
      style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}
    >
      <View style={styles.left}>
        <Ionicons name="barbell" size={18} color={theme.colors.primary[500]} />
        <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
          {workoutName}
        </Text>
      </View>

      <View style={styles.right}>
        <View style={styles.counter}>
          <Text variant="caption" color="secondary">
            Exercício
          </Text>
          <Text
            variant="bodyMedium"
            style={{ fontWeight: "700", color: theme.colors.primary[500] }}
          >
            {currentIndex + 1}/{totalExercises}
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  counter: {
    alignItems: "flex-end"
  }
})
