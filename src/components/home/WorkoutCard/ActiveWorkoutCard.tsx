import Button from "@/components/UI/Button"
import { Card } from "@/components/UI/Card"
import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { Workout } from "@/types"
import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, View } from "react-native"

interface ActiveWorkoutCardProps {
  workout: Workout
  onStart: (workoutId: string) => void
}

export const ActiveWorkoutCard = ({ workout, onStart }: ActiveWorkoutCardProps) => {
  const { theme } = useTheme()

  const exerciseCount = workout?.exercises?.length ?? 0
  const estimatedMinutes = workout?.estimatedMinutes ?? 45

  const handlePress = () => {
    onStart(workout.id)
  }

  return (
    <Card
      variant="elevated"
      style={[
        styles.workoutCard,
        {
          backgroundColor: theme.colors.background.paper,
          borderColor: theme.colors.border
        }
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.headerContent}>
          <View style={[styles.badge, { backgroundColor: theme.colors.primary[50] }]}>
            <Ionicons name="flame" size={16} color={theme.colors.primary[700]} />
            <Text
              variant="captionMedium"
              style={[styles.badgeText, { color: theme.colors.primary[700] }]}
            >
              Treino do dia
            </Text>
          </View>

          <Text variant="h2" style={[styles.titleText, { color: theme.colors.text.primary }]}>
            {workout.name || "Iniciar Treino"}
          </Text>
          <Text
            variant="body"
            style={[styles.subtitleText, { color: theme.colors.text.secondary }]}
          >
            Inclui {exerciseCount} exercícios | ~{estimatedMinutes} min
          </Text>
        </View>

        <Button
          title="Começar agora"
          onPress={handlePress}
          backgroundColor={theme.colors.primary[500]}
          shadowColor={theme.colors.primary[600]}
          borderColor={theme.colors.primary[600]}
          style={styles.ctaButton}
          textStyle={styles.ctaText}
        />
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  workoutCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1
  },
  cardContent: {
    gap: 16
  },
  headerContent: {
    gap: 8
  },
  titleText: {
    letterSpacing: -0.5
  },
  subtitleText: {
    fontSize: 14
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600"
  },
  ctaButton: {
    width: "100%",
    margin: 0,
    marginTop: 8
  },
  ctaText: {
    fontWeight: "700"
  }
})
