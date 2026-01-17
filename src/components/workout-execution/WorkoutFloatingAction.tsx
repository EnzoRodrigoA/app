import Button from "@/components/UI/Button"
import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"
import Animated, { FadeInUp } from "react-native-reanimated"

interface WorkoutFloatingActionProps {
  exerciseName: string
  estimatedMinutes: number
  setsCount: number
  bottomPadding: number
  onStart: () => void
}

/**
 * Botão de ação flutuante com stats rápidos
 */
export function WorkoutFloatingAction({
  exerciseName,
  estimatedMinutes,
  setsCount,
  bottomPadding,
  onStart
}: WorkoutFloatingActionProps) {
  const { theme } = useTheme()

  return (
    <Animated.View
      entering={FadeInUp.duration(400).delay(300)}
      style={[styles.container, { paddingBottom: bottomPadding }]}
    >
      <Button
        title={`Iniciar ${exerciseName}`}
        type="primary"
        icon={<Ionicons name="play" size={20} color="white" />}
        onPress={onStart}
        style={styles.button}
      />

      <View style={styles.quickStats}>
        <View style={[styles.statItem, { backgroundColor: theme.colors.background.card }]}>
          <Ionicons name="time-outline" size={16} color={theme.colors.text.secondary} />
          <Text variant="small" color="secondary">
            ~{estimatedMinutes} min
          </Text>
        </View>

        <View style={[styles.statItem, { backgroundColor: theme.colors.background.card }]}>
          <Ionicons name="layers-outline" size={16} color={theme.colors.text.secondary} />
          <Text variant="small" color="secondary">
            {setsCount} séries
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12
  },
  button: {
    width: "100%"
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20
  }
})
