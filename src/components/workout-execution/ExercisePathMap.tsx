import { WorkoutExercise } from "@/types"
import { useEffect, useRef } from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { ExerciseNode, NodeState } from "./ExerciseNode"
import { PathConnector } from "./PathConnector"

interface ExercisePathMapProps {
  exercises: WorkoutExercise[]
  currentIndex: number
  completedIndices: number[]
  onExercisePress?: (index: number) => void
}

type NodePosition = "left" | "center" | "right"

export const ExercisePathMap = ({
  exercises,
  currentIndex,
  completedIndices,
  onExercisePress
}: ExercisePathMapProps) => {
  const scrollRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (scrollRef.current && currentIndex >= 0) {
      const scrollY = Math.max(0, currentIndex * 160 - 100)
      scrollRef.current.scrollTo({ y: scrollY, animated: true })
    }
  }, [currentIndex])

  const getNodeState = (index: number): NodeState => {
    if (completedIndices.includes(index)) return "completed"
    if (index === currentIndex) return "active"
    if (index === currentIndex + 1) return "upcoming"
    return "locked"
  }

  const getNodePosition = (index: number): NodePosition => {
    const pattern: NodePosition[] = ["left", "center", "right", "center"]
    return pattern[index % pattern.length]
  }

  const getConnectorDirection = (
    currentPos: NodePosition,
    nextPos: NodePosition
  ): "left-to-center" | "center-to-right" | "right-to-center" | "center-to-left" | null => {
    if (currentPos === "left" && nextPos === "center") return "left-to-center"
    if (currentPos === "center" && nextPos === "right") return "center-to-right"
    if (currentPos === "right" && nextPos === "center") return "right-to-center"
    if (currentPos === "center" && nextPos === "left") return "center-to-left"
    return null
  }

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {exercises.map((exercise, index) => {
          const nodeState = getNodeState(index)
          const position = getNodePosition(index)
          const nextPosition = index < exercises.length - 1 ? getNodePosition(index + 1) : null
          const isLastNode = index === exercises.length - 1
          const isConnectorCompleted = completedIndices.includes(index)

          const connectorDirection =
            nextPosition !== null ? getConnectorDirection(position, nextPosition) : null

          return (
            <View key={exercise.id} style={styles.nodeRow}>
              <ExerciseNode
                exercise={exercise}
                index={index}
                state={nodeState}
                position={position}
                onPress={() => onExercisePress?.(index)}
                totalExercises={exercises.length}
              />

              {!isLastNode && connectorDirection && (
                <PathConnector
                  direction={connectorDirection}
                  isCompleted={isConnectorCompleted}
                  height={50}
                />
              )}
            </View>
          )
        })}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40
  },
  nodeRow: {
    paddingTop: 20,
    alignItems: "center",
    marginBottom: 8
  },
  bottomPadding: {
    height: 100
  }
})
