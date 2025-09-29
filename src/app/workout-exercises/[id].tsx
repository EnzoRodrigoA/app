import Button from "@/components/Button";
import { DraggableCard } from "@/components/DraggableCard";
import AppModal from "@/components/Modal";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import {
  IndexPath,
  Input,
  Select,
  SelectItem,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

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

export default function ExercisesScreen() {
  const { id: workoutId } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  console.log(setEditMode);

  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<IndexPath | undefined>();
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
    } catch (err) {
      console.error("Erro ao adicionar exercício:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = availableExercises.filter((e) =>
    e.exercise_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const colorScheme = useColorScheme();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: theme["background-basic-color-1"] },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text category="h1" style={styles.title}>
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
            <Text style={{ textAlign: "center", marginTop: 20 }}>
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
                    isActive={isActive}
                    editMode={editMode}
                  >
                    <Text category="c2" style={{ marginTop: 6 }}>
                      Músculo alvo: {item.name}
                    </Text>
                  </DraggableCard>
                </Animated.View>
              )}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          )}
        </View>

        {!loading && (
          <View style={styles.floatButtonContainer}>
            <Pressable
              onPress={() => {
                setShowAddModal(true);
                fetchAvailable();
              }}
              style={[styles.floatButton, { backgroundColor: "#0037ff" }]}
            >
              <Ionicons name="add" size={28} color="white" />
            </Pressable>
          </View>
        )}

        <AppModal visible={showAddModal} onClose={() => setShowAddModal(false)}>
          <Text category="h5" style={{ marginBottom: 12 }}>
            Adicionar Exercício
          </Text>

          <Select
            placeholder="Selecione o grupo muscular"
            selectedIndex={selectedIndex}
            onSelect={(index) => {
              const selected = index as IndexPath;
              setSelectedIndex(selected);

              const muscle = muscles[selected.row];
              setSelectedMuscle(muscle);
              fetchAvailable(muscle, searchText);
            }}
            style={{ marginBottom: 12 }}
          >
            {muscles.map((muscle) => (
              <SelectItem key={muscle} title={muscle} />
            ))}
          </Select>

          <Input
            placeholder="Buscar exercício..."
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
              fetchAvailable(selectedMuscle ?? undefined, text);
            }}
            style={{ marginBottom: 12 }}
          />

          <FlatList
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleAddExercise(item.id)}
                style={styles.exerciseItem}
              >
                <Text category="s1">{item.exercise_name}</Text>
                <Text appearance="hint" category="c2">
                  {item.target_muscle}
                </Text>
              </Pressable>
            )}
            style={{ maxHeight: 300 }}
          />

          <Button
            text="Cancelar"
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
  },
  exerciseItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
