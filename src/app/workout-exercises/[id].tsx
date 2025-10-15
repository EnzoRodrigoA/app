import { DraggableCard } from "@/components/DraggableCard";
import AppModal from "@/components/Modal";
import Button from "@/components/UI/Button";
import { Text } from "@/components/UI/Text";
import { useTheme } from "@/contexts/ThemeContext";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import Animated, {
  FadeInDown,
  FadeInRight,
  FadeOut,
  FadeOutRight,
} from "react-native-reanimated";

interface Exercise {
  id: string;
  exercise_name: string;
  target_muscle: string;
}

interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise_sequence: string;
  name: string;
  muscle: string;
}

const getExercises = async (workoutId: string): Promise<WorkoutExercise[]> => {
  const response = await api.get(`/workout-exercises/${workoutId}`);
  return response.data;
};

const getAvailableExercises = async (muscle?: string, name?: string) => {
  const response = await api.get("/exercises", {
    params: { muscle, name },
  });
  return response.data;
};

const addExercise = async (workoutId: string, exerciseId: string) => {
  console.log("POST para:", api.defaults.baseURL + "/workout-exercises", {
    exerciseId,
    workoutId,
  });
  const response = await api.post("/workout-exercises", {
    exerciseId: exerciseId,
    workoutId: workoutId,
  });
  return response.data;
};

const updateExercisesOrder = async (exercises: WorkoutExercise[]) => {
  const order = exercises.map((ex) => ex.id);
  await api.patch("/workout-exercises/reorder", { order });
};

export default function ExercisesScreen() {
  const { id: workoutId } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();

  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);

  const muscles = ["Peito", "Costas", "Pernas", "Ombros", "Bíceps", "Tríceps"];

  useEffect(() => {
    if (!workoutId) return;
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const data = await getExercises(workoutId);
        setExercises(data);
      } catch (err) {
        console.error("Erro ao buscar exercícios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [workoutId]);

  const fetchAvailable = async (muscle?: string, name?: string) => {
    try {
      setLoading(true);
      const available = await getAvailableExercises(muscle, name);
      console.log("Exercises disponíveis:", available);
      setAvailableExercises(available);
    } catch (err) {
      console.error("Erro ao buscar exercícios disponíveis:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = async (exerciseId: string) => {
    if (!workoutId) return;
    try {
      setLoading(true);
      await addExercise(workoutId, exerciseId);

      const updatedExercises = await getExercises(workoutId);
      setExercises(updatedExercises);

      setShowAddModal(false);
      setSearchText("");
      setSelectedMuscle(null);
    } catch (err) {
      console.error("Erro ao adicionar exercício:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = availableExercises.filter((e) =>
    e.exercise_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSaveOrder = async () => {
    try {
      setLoading(true);
      await updateExercisesOrder(exercises);
    } catch (error) {
      console.error("Erro ao salvar ordem de Exercícios: ", error);
    } finally {
      setLoading(false);
    }
  };

  const colorScheme = useColorScheme();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <View style={styles.header}>
          <Text variant="h1" style={styles.title}>
            Exercícios
          </Text>
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="chevron-forward"
              size={28}
              color={colorScheme === "dark" ? "#fff" : "#000"}
            />
          </Pressable>
        </View>

        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator style={{ flex: 1 }} />
          ) : exercises.length === 0 ? (
            <Text variant="body" style={{ textAlign: "center", marginTop: 20 }}>
              Nenhum exercício adicionado.
            </Text>
          ) : (
            <DraggableFlatList
              data={exercises}
              onDragEnd={({ data }) => setExercises(data)}
              keyExtractor={(item) => item.id}
              renderItem={({
                item,
                drag,
                isActive,
              }: RenderItemParams<WorkoutExercise>) => (
                <Animated.View
                  entering={FadeInDown.delay(50)}
                  exiting={FadeOut}
                >
                  <DraggableCard
                    title={item.name}
                    drag={drag}
                    isExercise={true}
                    isActive={isActive}
                    editMode={editMode}
                  >
                    <Text variant="caption" style={{ marginTop: 6 }}>
                      Músculo alvo: {item.muscle}
                    </Text>
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
                    console.error(error);
                  }
                } else {
                  setEditMode(true);
                }
              }}
              style={[
                styles.floatButton,
                { backgroundColor: theme.colors.primary[500] },
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

        {editMode && !loading && (
          <Animated.View
            entering={FadeInRight.duration(300)}
            exiting={FadeOutRight.duration(300)}
            style={[styles.floatButtonContainer, { bottom: 100 }]}
          >
            <Pressable
              onPress={() => {
                setShowAddModal(true);
                fetchAvailable();
              }}
              disabled={loading}
              style={[
                styles.floatButton,
                { backgroundColor: theme.colors.primary[600] },
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

        <AppModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
          <Text variant="h2" style={{ marginBottom: 16 }}>
            Adicionar Exercício
          </Text>

          {/* Select customizado para músculos */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.muscleScroll}
          >
            <View style={styles.muscleContainer}>
              {muscles.map((muscle) => (
                <Pressable
                  key={muscle}
                  onPress={() => {
                    setSelectedMuscle(
                      muscle === selectedMuscle ? null : muscle
                    );
                    fetchAvailable(
                      muscle === selectedMuscle ? undefined : muscle,
                      searchText
                    );
                  }}
                  style={[
                    styles.muscleButton,
                    {
                      backgroundColor:
                        muscle === selectedMuscle
                          ? theme.colors.primary[500]
                          : theme.colors.background.secondary,
                      borderColor: theme.colors.background.tertiary,
                    },
                  ]}
                >
                  <Text
                    variant="caption"
                    style={[
                      styles.muscleText,
                      {
                        color:
                          muscle === selectedMuscle
                            ? "white"
                            : theme.colors.text.primary,
                      },
                    ]}
                  >
                    {muscle}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <TextInput
            placeholder="Buscar exercício..."
            placeholderTextColor={theme.colors.text.secondary}
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              fetchAvailable(selectedMuscle ?? undefined, text);
            }}
            style={[
              styles.searchInput,
              {
                backgroundColor: theme.colors.background.secondary,
                borderColor: theme.colors.background.tertiary,
                color: theme.colors.text.primary,
              },
            ]}
          />

          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleAddExercise(item.id)}
                style={[
                  styles.exerciseItem,
                  { borderBottomColor: theme.colors.background.tertiary },
                ]}
              >
                <Text variant="body" style={{ fontWeight: "600" }}>
                  {item.exercise_name}
                </Text>
                <Text
                  variant="caption"
                  style={{ color: theme.colors.text.secondary }}
                >
                  {item.target_muscle}
                </Text>
              </Pressable>
            )}
            style={{ maxHeight: 300 }}
          />

          <Button
            title="Cancelar"
            type="secondary"
            onPress={() => setShowAddModal(false)}
            style={{ marginTop: 12 }}
          />
        </AppModal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16 },
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
  listContainer: { flex: 1 },
  floatButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 10,
  },
  floatButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  exerciseItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  muscleScroll: {
    marginBottom: 12,
  },
  muscleContainer: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  muscleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  muscleText: {
    fontWeight: "500",
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
});
