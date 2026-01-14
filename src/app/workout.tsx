import Button from "@/components/UI/Button"
import { EmptyState } from "@/components/UI/Feedback/EmptyState"
import { LoadingState } from "@/components/UI/Feedback/LoadingState"
import { FloatingActionButton } from "@/components/UI/Layout/FloatingActionButton"
import { PageHeader } from "@/components/UI/Layout/PageHeader"
import AppModal from "@/components/UI/Modal"
import { Text } from "@/components/UI/Text"
import { DraggableCard } from "@/components/workout/DraggableCard"
import { useTheme } from "@/contexts/ThemeContext"
import workoutService from "@/services/workoutService"
import { Workout, WorkoutExercise } from "@/types/workout"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native"
import DraggableFlatList from "react-native-draggable-flatlist"
import Animated, { FadeInDown, FadeOutRight } from "react-native-reanimated"

export default function WorkoutScreen() {
  const theme = useTheme()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [allExercises, setAllExercises] = useState<Record<string, WorkoutExercise[]>>({})

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      setLoading(true)
      const WorkoutsFromAPI = await workoutService.getWorkouts()
      setWorkouts(WorkoutsFromAPI)

      const exercisesObj: Record<string, WorkoutExercise[]> = {}
      await Promise.all(
        WorkoutsFromAPI.map(async (w) => {
          try {
            const ex = await workoutService.getExercises(w.id)
            exercisesObj[w.id] = ex
          } catch (error: any) {
            if (error.response?.status === 404) {
              exercisesObj[w.id] = []
            } else {
              console.error("Erro ao buscar exercícios", error)
            }
          }
        })
      )
      setAllExercises(exercisesObj)
    } catch (error) {
      console.error("Erro ao buscar treinos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveOrder = async () => {
    try {
      setLoading(true)
      await workoutService.updateWorkoutOrder(workouts)
    } catch (error) {
      console.error("Erro ao atualizar ordem:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditTitle = (id: string, newName: string) => {
    Alert.alert("Editar treino", `Deseja alterar o nome do treino para: \n\n"${newName}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Confirmar",
        onPress: async () => {
          try {
            setLoading(true)
            await workoutService.updateWorkoutName(id, newName)
            setWorkouts((prev) => prev?.map((w) => (w.id === id ? { ...w, name: newName } : w)))
          } catch (error) {
            console.error("Erro ao editar treino:", error)
          } finally {
            setLoading(false)
          }
        }
      }
    ])
  }

  const handleDelete = (id: string) => {
    Alert.alert("Remover treino", "Tem certeza que deseja excluir este treino?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true)
            await workoutService.deleteWorkout(id)
            setWorkouts((prev) => prev.filter((w) => w.id !== id))
          } catch (error) {
            console.error("Erro ao remover treino:", error)
          } finally {
            setLoading(false)
          }
        }
      }
    ])
  }

  const handleAddWorkout = async () => {
    try {
      setLoading(true)
      const newWorkout = await workoutService.addWorkout("Novo Treino", false)
      setWorkouts((prev) => [...prev, newWorkout])
      setShowAddModal(false)
    } catch (error) {
      console.error("Erro ao adicionar treino:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddRestDay = async () => {
    try {
      setLoading(true)
      const newRestDay = await workoutService.addRestDay()
      setWorkouts((prev) => [...prev, newRestDay])
      setShowAddModal(false)
    } catch (error) {
      console.error("Erro ao adicionar Descanso:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderWorkoutItem = ({ item, drag, isActive }: any) => (
    <Animated.View entering={FadeInDown.delay(100)} exiting={FadeOutRight.delay(200)}>
      <DraggableCard
        title={item.name}
        isRest={item.isRest}
        drag={drag}
        isActive={isActive}
        editMode={editMode}
        isExpanded={expandedId === item.id}
        onEditTitle={(newTitle) => handleEditTitle(item.id, newTitle)}
        onDelete={() => handleDelete(item.id)}
        onPressDetails={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.exerciseTitle}>Exercícios</Text>
          <View>
            {!allExercises[item.id] || allExercises[item.id]?.length === 0 ? (
              <Text>Você ainda não adicionou exercícios nesse treino!</Text>
            ) : (
              allExercises[item.id].map((ex) => (
                <Text style={{ marginBottom: 6 }} key={ex.id}>
                  - {ex.name}
                </Text>
              ))
            )}
          </View>
          <Button
            title="Exercícios"
            style={styles.editButton}
            onPress={() => router.push(`/workout/${item.id}` as any)}
          />
        </View>
      </DraggableCard>
    </Animated.View>
  )

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { backgroundColor: theme.theme.colors.background.primary }]}>
        <PageHeader title="Treinos" />

        <View style={styles.content}>
          {loading && workouts.length === 0 ? (
            <LoadingState message="Carregando treinos..." />
          ) : workouts.length === 0 ? (
            <EmptyState
              image={require("@/assets/images/WorkoutsBackgroun.png")}
              title="Nenhum treino criado"
              description="Crie seu primeiro treino para começar a gerenciar seus treinos"
              buttonText="Criar Primeiro Treino"
              onButtonPress={() => setShowAddModal(true)}
            />
          ) : (
            <DraggableFlatList
              data={workouts}
              onDragEnd={({ data }) => setWorkouts(data)}
              autoscrollThreshold={100}
              keyExtractor={(item) => item.id}
              renderItem={renderWorkoutItem}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        {!loading && workouts.length > 0 && (
          <>
            <FloatingActionButton
              onPress={async () => {
                if (editMode) {
                  await handleSaveOrder()
                  setEditMode(false)
                } else {
                  setEditMode(true)
                }
              }}
              icon={editMode ? "checkmark" : "pencil"}
              loading={loading}
            />

            {editMode && (
              <FloatingActionButton
                onPress={() => setShowAddModal(true)}
                icon="add"
                position="top"
                loading={loading}
              />
            )}
          </>
        )}

        <AppModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
          <Text
            variant="h2"
            style={[styles.modalTitle, { color: theme.theme.colors.text.primary }]}
          >
            Adicionar
          </Text>
          <Button title="Novo Treino" type="primary" onPress={handleAddWorkout} />
          <Button title="Descanso" type="secondary" onPress={handleAddRestDay} />
        </AppModal>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1
  },
  listContent: {
    paddingBottom: 120,
    paddingHorizontal: 16
  },
  exerciseTitle: {
    marginTop: 10,
    fontSize: 22,
    fontFamily: "TekoRegular"
  },
  editButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 12
  },
  modalTitle: {
    marginBottom: 12,
    marginLeft: 10,
    fontFamily: "TekoRegular"
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  }
})
