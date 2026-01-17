import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { WorkoutExercise } from "@/types"
import { ActiveSet } from "@/types/workout-execution"
import { Ionicons } from "@expo/vector-icons"
import * as Haptics from "expo-haptics"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, { FadeInUp, SlideInRight } from "react-native-reanimated"
import { SetCard } from "./SetCard"

interface ActiveExerciseCardProps {
  exercise: WorkoutExercise
  sets: ActiveSet[]
  completedSetsCount: number
  exerciseIndex: number
  totalExercises: number
  isLastExercise: boolean
  onSetComplete: (setIndex: number) => void
  onAdjustWeight: (setIndex: number, delta: number) => void
  onAdjustReps: (setIndex: number, delta: number) => void
  onNextExercise: () => void
}

/**
 * Active exercise card component
 * Shows current exercise details, sets to complete, and next action
 */
export const ActiveExerciseCard = ({
  exercise,
  sets,
  completedSetsCount,
  exerciseIndex,
  totalExercises,
  isLastExercise,
  onSetComplete,
  onAdjustWeight,
  onAdjustReps,
  onNextExercise
}: ActiveExerciseCardProps) => {
  const { theme } = useTheme()

  const allSetsCompleted = completedSetsCount === sets.length

  const handleNextPress = () => {
    if (completedSetsCount > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      onNextExercise()
    }
  }

  return (
    <Animated.View entering={FadeInUp.duration(400).springify()} style={styles.container}>
      {/* Score Badge - Destaque absoluto */}
      <View style={styles.scoreSection}>
        <Animated.View
          entering={SlideInRight.delay(50)}
          style={[styles.scoreBadge, { backgroundColor: theme.colors.primary[500] }]}
        >
          <Text variant="h1" style={{ color: "white", fontWeight: "900" }}>
            {completedSetsCount}
          </Text>
          <Text variant="body" style={{ color: "rgba(255,255,255,0.9)", fontWeight: "700" }}>
            de {sets.length}
          </Text>
        </Animated.View>

        <View style={styles.scoreInfo}>
          <Text variant="h3" style={{ fontWeight: "800", color: theme.colors.text.primary }}>
            {exercise.exercise.name}
          </Text>
          <Text variant="body" color="secondary" style={{ opacity: 0.7 }}>
            Exercício {exerciseIndex + 1} de {totalExercises}
          </Text>
        </View>
      </View>

      {/* Séries em grid gamificado */}
      <View style={styles.setsWrapper}>
        <View style={styles.setsGrid}>
          {sets.map((set, index) => (
            <SetCard
              key={set.id}
              set={set}
              index={index}
              isActive={!set.completed && index === completedSetsCount}
              onOneTapRepeat={() => onSetComplete(index)}
              onAdjustWeight={(delta) => onAdjustWeight(index, delta)}
              onAdjustReps={(delta) => onAdjustReps(index, delta)}
              theme={theme}
            />
          ))}
        </View>
      </View>

      {/* Ação com efeito */}
      <View style={styles.actionContainer}>
        <Pressable
          style={[
            styles.primaryButton,
            {
              backgroundColor: allSetsCompleted
                ? theme.colors.primary[500]
                : theme.colors.gray[300],
              opacity: completedSetsCount === 0 ? 0.5 : 1
            }
          ]}
          onPress={handleNextPress}
          disabled={completedSetsCount === 0}
        >
          <Ionicons
            name={
              allSetsCompleted
                ? isLastExercise
                  ? "checkmark-done"
                  : "arrow-forward"
                : "lock-closed"
            }
            size={28}
            color={allSetsCompleted ? "white" : theme.colors.gray[600]}
          />
          <Text
            variant="button"
            style={{
              color: allSetsCompleted ? "white" : theme.colors.gray[600],
              fontWeight: "700"
            }}
          >
            {completedSetsCount === 0
              ? "Complete as séries"
              : isLastExercise
              ? "Finalizar Treino"
              : "Próximo"}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 24,
    flex: 1,
    justifyContent: "space-between"
  },
  scoreSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  scoreBadge: {
    width: 100,
    height: 100,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8
  },
  scoreInfo: {
    flex: 1,
    gap: 4,
    justifyContent: "center"
  },
  setsWrapper: {
    flex: 1,
    justifyContent: "center"
  },
  setsGrid: {
    gap: 16
  },
  actionContainer: {
    gap: 12,
    alignItems: "stretch"
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 28,
    borderRadius: 20,
    width: "100%"
  }
})
