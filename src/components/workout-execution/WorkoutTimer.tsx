// ============================================
// LIFTLOG - Workout Timer Component
// ============================================

import { Text } from "@/components/UI/Text"
import { WorkoutTimerProps } from "@/types/workout-execution"
import { Ionicons } from "@expo/vector-icons"
import { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"

export function WorkoutTimer({ startTime, theme }: WorkoutTimerProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const start = new Date(startTime).getTime()
      const now = Date.now()
      setElapsed(Math.floor((now - start) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60

  return (
    <View style={styles.timerContainer}>
      <Ionicons name="time-outline" size={16} color={theme.colors.text.secondary} />
      <Text variant="body" color="secondary">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4
  }
})
