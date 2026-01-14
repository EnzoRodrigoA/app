import ExerciseCard from "@/components/complete-workout/ExerciseCard"
import Button from "@/components/UI/Button"
import { Text } from "@/components/UI/Text"
import { useTheme } from "@/contexts/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import {
  Keyboard,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View
} from "react-native"
import Carousel from "react-native-reanimated-carousel"

interface Exercise {
  id: string
  name: string
  muscle: string
}

const BASE_WIDTH = 375

export default function TopSets() {
  const router = useRouter()
  const { theme } = useTheme()
  const { height: MAX_HEIGHT, width: MAX_WIDTH } = useWindowDimensions()

  const scaleWidth = MAX_WIDTH / BASE_WIDTH
  const normalizeSize = (size: number) => Math.round(size * scaleWidth)

  const [exercises, setExercises] = useState<Exercise[]>([])
  const [weight, setWeight] = useState("60.0")
  const [reps, setReps] = useState("10")

  useEffect(() => {
    setExercises([
      { id: "1", name: "Supino Reto", muscle: "Peito" },
      { id: "2", name: "Puxada Alta", muscle: "Costas" },
      { id: "3", name: "Agachamento Livre", muscle: "Pernas" },
      { id: "4", name: "Elevação Lateral", muscle: "Ombros" }
    ])
  }, [])

  const IncrementWeight = useCallback(
    () => setWeight((prev) => (parseFloat(prev || "0") + 0.5).toFixed(1)),
    []
  )

  const decrementWeight = useCallback(
    () => setWeight((prev) => Math.max(0, parseFloat(prev || "0") - 0.5).toFixed(1)),
    []
  )

  const incrementReps = useCallback(() => {
    setReps((prev) => {
      const currentReps = parseInt(prev || "0")
      // Verifica se o valor atual é menor que 30 antes de incrementar
      if (currentReps < 30) {
        return (currentReps + 1).toString()
      }
      return "30" // Mantém em 30 se já estiver no limite
    })
  }, [])

  const decrementReps = useCallback(
    () => setReps((prev) => Math.max(0, parseInt(prev || "0") - 1).toString()),
    []
  )

  const repsStatus = useCallback(() => {
    const repsNumber = parseInt(reps || "0")
    if (repsNumber === 0) {
      return theme.colors.text.primary
    } else if (repsNumber < 3 || repsNumber > 15) {
      return theme.colors.error[500]
    } else if ((repsNumber >= 3 && repsNumber <= 4) || (repsNumber >= 13 && repsNumber <= 15)) {
      return theme.colors.warning[500]
    } else {
      return theme.colors.success[500]
    }
  }, [reps, theme])

  const getRepsMessage = useCallback(() => {
    const repsNumber = parseInt(reps || "0")

    if (repsNumber === 0) {
      return {
        text: "",
        color: theme.colors.text.secondary
      }
    } else if (repsNumber >= 1 && repsNumber <= 2) {
      return {
        text: "Peso pode estar muito elevado",
        color: theme.colors.error[500]
      }
    } else if (repsNumber >= 3 && repsNumber <= 4) {
      return {
        text: "Foco em cargas máximas",
        color: theme.colors.warning[500]
      }
    } else if (repsNumber >= 5 && repsNumber <= 12) {
      return {
        text: "Ideal para construir massa muscular.",
        color: theme.colors.success[500]
      }
    } else if (repsNumber >= 13 && repsNumber <= 15) {
      return {
        text: "O peso pode estar leve demais.",
        color: theme.colors.warning[500]
      }
    } else {
      return {
        text: "Foco em Resistência Muscular. Ajuste o peso.",
        color: theme.colors.error[500]
      }
    }
  }, [reps, theme])

  const handleRepsChange = useCallback((text: string) => {
    const numericText = text.replace(/[^0-9]/g, "")
    const number = parseInt(numericText || "0")
    if (number <= 30) {
      setReps(numericText)
    } else {
      setReps("30")
    }
  }, [])

  const renderItem = ({ item, index }: { item: Exercise; index: number }) => (
    <ExerciseCard
      item={item}
      index={index}
      weight={weight}
      reps={reps}
      repsStatus={repsStatus}
      repsMessage={getRepsMessage()}
      IncrementWeight={IncrementWeight}
      decrementWeight={decrementWeight}
      incrementReps={incrementReps}
      decrementReps={decrementReps}
      setWeight={setWeight}
      scaleWidth={scaleWidth}
      handleRepsChange={handleRepsChange}
    />
  )

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
        <View style={styles.header}>
          <View style={styles.headerContainer}>
            <Text variant="h1" style={styles.title}>
              Meu Treino
            </Text>
            <Pressable onPress={() => router.back()} style={{ padding: 10 }}>
              <Ionicons name="close-outline" size={36} color={theme.colors.text.primary} />
            </Pressable>
          </View>
        </View>

        <Carousel
          width={MAX_WIDTH}
          height={MAX_HEIGHT * 0.9}
          data={exercises}
          renderItem={renderItem}
          mode="parallax"
          modeConfig={{
            parallaxAdjacentItemScale: 0.55,
            parallaxScrollingScale: 0.75,
            parallaxScrollingOffset: 40
          }}
          loop={false}
          scrollAnimationDuration={300}
          style={{ top: -60 }}
        />
        <View
          style={{
            position: "absolute",
            bottom: normalizeSize(20),
            right: normalizeSize(20)
          }}
        >
          <Button
            title=""
            style={{
              width: normalizeSize(60),
              height: normalizeSize(60),
              borderRadius: 50,
              paddingVertical: 0,
              paddingHorizontal: 0
            }}
            icon={<Ionicons name="checkmark-circle-outline" size={44} color={"#fff"} />}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    justifyContent: "space-between"
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 60,
    zIndex: 10,
    width: "100%"
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontFamily: "TekoRegular",
    fontSize: 38,
    letterSpacing: 0
  }
})
