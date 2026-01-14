import InputControlDial from "@/components/complete-workout/InputControlDial"
import { MoodSlider } from "@/components/complete-workout/MoodSlider"
import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { memo } from "react"
import { StyleSheet, View } from "react-native"

interface Exercise {
  id: string
  name: string
  muscle: string
}

interface RepsMessage {
  text: string
  color: string
}

interface ExerciseCardProps {
  item: Exercise
  index: number
  weight: string
  reps: string
  repsStatus: () => string
  IncrementWeight: () => void
  decrementWeight: () => void
  incrementReps: () => void
  decrementReps: () => void
  repsMessage: RepsMessage
  setWeight: (text: string) => void
  handleRepsChange: (text: string) => void
  scaleWidth: number
}

const ExerciseCard = memo(function ExerciseCard({
  item,
  index,
  weight,
  reps,
  repsStatus,
  IncrementWeight,
  decrementWeight,
  incrementReps,
  decrementReps,
  repsMessage,
  setWeight,
  handleRepsChange,
  scaleWidth
}: ExerciseCardProps) {
  const { theme } = useTheme()

  const normalizeSize = (size: number) => Math.round(size * scaleWidth)

  const dynamicStyles = StyleSheet.create({
    cardContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    },
    card: {
      flex: 1,
      width: "100%",
      borderRadius: normalizeSize(28),
      paddingVertical: normalizeSize(12),
      paddingHorizontal: normalizeSize(20),
      overflow: "hidden",
      maxHeight: 600,
      borderWidth: 0,
      backgroundColor: theme.colors.background.secondary
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: normalizeSize(20)
    },
    cardTitle: {
      fontFamily: "TekoRegular",
      fontSize: normalizeSize(32),
      flex: 1,
      marginRight: normalizeSize(12)
    },
    muscleBadge: {
      alignSelf: "flex-start",
      borderRadius: normalizeSize(12),
      paddingVertical: normalizeSize(6),
      paddingHorizontal: normalizeSize(16),
      backgroundColor: theme.colors.primary[500]
    },
    muscleText: {
      fontSize: normalizeSize(15),
      fontWeight: "200",
      color: "white"
    },
    inputsRow: {
      flex: 1,
      flexDirection: "column",
      alignItems: "stretch",
      gap: normalizeSize(20),
      justifyContent: "center"
    },
    repsFeedback: {
      textAlign: "center",
      fontSize: normalizeSize(14)
    },
    moodSection: {
      marginTop: normalizeSize(20),
      marginBottom: normalizeSize(10)
    },
    moodLabel: {
      textAlign: "center",
      marginBottom: normalizeSize(10),
      fontSize: normalizeSize(15),
      fontWeight: "bold",
      letterSpacing: 0.5
    }
  })

  const cardStyle = [dynamicStyles.card]

  return (
    <View style={dynamicStyles.cardContainer}>
      <View
        style={{
          flex: 1,
          shadowOpacity: 0.05,
          shadowColor: theme.colors.primary[500],
          shadowOffset: {
            width: 0,
            height: normalizeSize(10)
          },
          elevation: 10,
          shadowRadius: normalizeSize(12),
          width: "100%"
        }}
      >
        <View style={cardStyle}>
          <View style={dynamicStyles.cardHeader}>
            <Text variant="h1" style={dynamicStyles.cardTitle}>
              {item.name}
            </Text>
            <View style={dynamicStyles.muscleBadge}>
              <Text variant="caption" style={dynamicStyles.muscleText}>
                {item.muscle.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={dynamicStyles.inputsRow}>
            <InputControlDial
              label="PESO"
              value={weight}
              unit="Kg"
              onIncrement={IncrementWeight}
              onDecrement={decrementWeight}
              onChangeText={setWeight}
              scaleWidth={scaleWidth}
            />

            <InputControlDial
              label="REPETIÇÕES"
              value={reps}
              unit="Reps"
              onIncrement={incrementReps}
              onDecrement={decrementReps}
              valueColor={repsStatus()}
              onChangeText={handleRepsChange}
              scaleWidth={scaleWidth}
            />
            <Text variant="body" style={[dynamicStyles.repsFeedback, { color: repsMessage.color }]}>
              {repsMessage.text}
            </Text>
          </View>

          <View style={{ marginTop: 30, marginBottom: 10 }}>
            <Text
              variant="caption"
              style={[dynamicStyles.moodLabel, { color: theme.colors.text.secondary }]}
            >
              COMO VOCÊ SE SENTIU?
            </Text>
            <MoodSlider scaleWidth={scaleWidth} />
          </View>
        </View>
      </View>
    </View>
  )
})

export default ExerciseCard
