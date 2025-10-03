import Button from "@/components/Button";
import { DraggableCard } from "@/components/DraggableCard";
import AppModal from "@/components/Modal";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Text, useTheme } from "@ui-kitten/components";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOutRight,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface Workout {
  id: string;
  name: string;
  isRest: boolean;
}

interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise_sequence: string;
  name: string;
}

const toWorkout = (w: any): Workout => ({
  id: w.id,
  name: w.name,
  isRest: w.is_rest,
});

export const getExercises = async (
  workoutId: string
): Promise<WorkoutExercise[]> => {
  const response = await api.get(`/workout-exercises/${workoutId}`);
  return response.data;
};

export const getWorkouts = async (): Promise<Workout[]> => {
  const response = await api.get("/workouts");
  return response.data.map(toWorkout);
};

export const updateWorkoutOrder = async (workouts: Workout[]) => {
  const order = workouts.map((w) => w.id);
  await api.patch("/workouts/reorder", { order });
};

export const updateWorkoutName = async (id: string, name: string) => {
  await api.patch(`/workouts/${id}`, { name });
};

export const deleteWorkout = async (id: string) => {
  await api.delete(`/workouts/${id}`);
};

export const addWorkout = async (name: string, isRest: boolean) => {
  const response = await api.post("/workouts", { name, is_rest: isRest });
  return toWorkout(response.data);
};

export const addRestDay = async () => {
  const response = await api.post("/workouts/rest");
  return toWorkout(response.data);
};

export default function WorkoutScreen() {
  const theme = useTheme();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [allExercises, setAllExercises] = useState<
    Record<string, WorkoutExercise[]>
  >({});

  const fade = useSharedValue(0);
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const WorkoutsFromAPI = await getWorkouts();
        setWorkouts(WorkoutsFromAPI);

        const exercisesObj: Record<string, WorkoutExercise[]> = {};
        await Promise.all(
          WorkoutsFromAPI.map(async (w) => {
            try {
              const ex = await getExercises(w.id);
              exercisesObj[w.id] = ex;
            } catch (error: any) {
              if (error.response?.status === 404) {
                exercisesObj[w.id] = [];
              } else {
                console.error("Erro ao buscar exercícios", error);
              }
            }
          })
        );
        setAllExercises(exercisesObj);
      } catch (error) {
        console.error("Erro ao buscar treinos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkouts();
  }, []);

  useEffect(() => {
    fade.value = withTiming(1, { duration: 600 });
  }, [fade]);

  const handleSaveOrder = async () => {
    try {
      setLoading(true);
      await updateWorkoutOrder(workouts);
    } catch (error) {
      console.error("Erro ao atualizar ordem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTitle = (id: string, newName: string) => {
    Alert.alert(
      "Editar treino",
      `Deseja alterar o nome do treino para: \n\n"${newName}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              setLoading(true);
              await updateWorkoutName(id, newName);
              setWorkouts((prev) =>
                prev?.map((w) => (w.id === id ? { ...w, name: newName } : w))
              );
            } catch (error) {
              console.error("Erro ao editar treino:", error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Remover treino",
      "Tem certeza que deseja excluir este treino?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteWorkout(id);
              setWorkouts((prev) => prev.filter((w) => w.id !== id));
            } catch (error) {
              console.error("Erro ao remover treino:", error);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleAddWorkout = async () => {
    try {
      setLoading(true);
      const newWorkout = await addWorkout("Novo Treino", false);
      setWorkouts((prev) => [...prev, newWorkout]);
    } catch (error) {
      console.error("Erro ao adicionar treino:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRestDay = async () => {
    try {
      setLoading(true);
      const newRestDay = await addRestDay();
      console.log("Resposta do back: ", newRestDay);
      setWorkouts((prev) => [...prev, newRestDay]);
    } catch (error) {
      console.error("Erro ao adicionar Descanso:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={[
          styles.Container,
          { backgroundColor: theme["background-basic-color-1"] },
        ]}
      >
        <View style={styles.header}>
          <Text category="h1" style={styles.title}>
            Treinos
          </Text>
          <Pressable onPress={() => router.replace("/(tabs)")}>
            <Ionicons
              name="chevron-forward"
              size={28}
              color={colorScheme === "dark" ? "#fff" : "#000"}
            />
          </Pressable>
        </View>

        <View style={styles.CardContainer}>
          {!loading && workouts?.length === 0 ? (
            <View style={styles.emptyState}>
              <Image
                source={require("@/assets/images/WorkoutsBackgroun.png")}
                resizeMode="cover"
                style={styles.emptyImage}
              />
              <Text category="c1" appearance="hint" style={styles.emptyText}>
                Você ainda não adicionou nenhum treino
              </Text>
            </View>
          ) : (
            <DraggableFlatList
              data={workouts ?? []}
              onDragEnd={({ data }) => setWorkouts(data)}
              autoscrollThreshold={100}
              keyExtractor={(item) => item.id}
              renderItem={({ item, drag, isActive }) => (
                <Animated.View
                  entering={FadeInDown.delay(100)}
                  exiting={FadeOutRight.delay(200)}
                >
                  <DraggableCard
                    title={item.name}
                    isRest={item.isRest}
                    drag={drag}
                    isActive={isActive}
                    editMode={editMode}
                    isExpanded={expandedId === item.id}
                    onEditTitle={(newTitle) =>
                      handleEditTitle(item.id, newTitle)
                    }
                    onDelete={() => handleDelete(item.id)}
                    onPressDetails={() =>
                      setExpandedId((prev) =>
                        prev === item.id ? null : item.id
                      )
                    }
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          marginTop: 10,
                          fontSize: 22,
                          fontFamily: "TekoRegular",
                        }}
                      >
                        Exercícios
                      </Text>
                      <View>
                        {!allExercises[item.id] ||
                        allExercises[item.id]?.length === 0 ? (
                          <Text>
                            Você ainda não adicionou exercícios nesse treino!
                          </Text>
                        ) : (
                          allExercises[item.id].map((ex) => (
                            <Text style={{ marginBottom: 6 }} key={ex.id}>
                              - {ex.name}
                            </Text>
                          ))
                        )}
                      </View>
                      <Button
                        style={styles.ModalButton}
                        onPress={() =>
                          router.push(`/workout-exercises/${item.id}`)
                        }
                        type="primary"
                        text="Editar exercícios"
                      />
                    </View>
                  </DraggableCard>
                </Animated.View>
              )}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          )}
        </View>

        {!loading && (
          <Animated.View
            entering={FadeInRight.duration(300).delay(300)}
            exiting={FadeOutRight.duration(300).delay(300)}
            style={styles.floatButtonContainer}
          >
            <Pressable
              onPress={async () => {
                if (editMode) {
                  try {
                    await handleSaveOrder();
                    setEditMode(false);
                  } catch (error) {
                    console.error("Erro ao salvar nova ordem:", error);
                  }
                } else {
                  setEditMode(true);
                }
              }}
              style={[
                styles.floatButton,
                {
                  backgroundColor: editMode
                    ? theme["color-success-500"]
                    : theme["color-primary-500"],
                },
              ]}
            >
              <Ionicons
                name={editMode ? "checkmark" : "pencil"}
                size={28}
                color="white"
              />
            </Pressable>
          </Animated.View>
        )}

        <AppModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
          <Text category="h5" style={styles.ModalTitle}>
            Adicionar
          </Text>

          <Button
            onPress={async () => {
              await handleAddWorkout();
              setShowAddModal(false);
            }}
            type="primary"
            style={styles.ModalButton}
            text="Novo treino"
          ></Button>
          <Button
            onPress={async () => {
              await handleAddRestDay();
              setShowAddModal(false);
            }}
            type="secondary"
            style={styles.ModalButton}
            text="Descanso"
          ></Button>
        </AppModal>

        {editMode && !loading && (
          <Animated.View
            entering={FadeInRight.duration(300)}
            exiting={FadeOutRight.duration(300)}
            style={[styles.floatButtonContainer, { bottom: 100 }]}
          >
            <Pressable
              onPress={() => setShowAddModal(true)}
              disabled={loading ? true : false}
              style={[
                styles.floatButton,
                { backgroundColor: theme["color-primary-500"] },
              ]}
            >
              {loading ? (
                <ActivityIndicator color={"white"} />
              ) : (
                <Ionicons name="add" size={28} color="white" />
              )}
            </Pressable>
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 90,
  },

  emptyImage: {
    width: "100%",
    height: "70%",
    opacity: 0.3,
  },

  emptyText: {
    textAlign: "center",
    fontFamily: "RobotoLight",
  },

  Container: {
    flex: 1,
    overflow: "hidden",
    gap: 16,
  },

  header: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 50,
  },

  title: {
    fontFamily: "TekoRegular",
  },

  CardContainer: {
    flex: 1,
  },

  floatButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },

  floatButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  ModalTitle: {
    marginBottom: 12,
    marginLeft: 10,
    fontFamily: "RobotoLight",
  },

  ModalButton: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
});
