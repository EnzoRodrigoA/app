// /workouts/[id]/exercises.tsx
import Button from "@/components/Button";
import { DraggableCard } from "@/components/DraggableCard";
import AppModal from "@/components/Modal";
import api from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { Input, Text, useTheme } from "@ui-kitten/components";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";

interface Exercise {
  id: string;
  name: string;
  reps: number;
  sets: number;
}

interface AvailableExercise {
  id: string;
  name: string;
}

const toExercise = (e: any): Exercise => ({
  id: e.id,
  name: e.name,
  reps: e.reps,
  sets: e.sets,
});

const toAvailableExercise = (e: any): AvailableExercise => ({
  id: e.id,
  name: String(e.name),
});

const getExercises = async (workoutId: string): Promise<Exercise[]> => {
  const response = await api.get(`/workouts-exercises/${workoutId}`);
  return response.data.map(toExercise);
};

const getAvailableExercises = async (): Promise<AvailableExercise[]> => {
  const response = await api.get("/exercises");
  return response.data.map(toAvailableExercise);
};

const addExercise = async (workoutId: string, exerciseId: string) => {
  const response = await api.post(`/workouts-exercises/${workoutId}`, {
    exerciseId,
  });
  return toExercise(response.data);
};

export default function ExercisesScreen() {
  const { id: workoutId } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [availableExercises, setAvailableExercises] = useState<
    AvailableExercise[]
  >([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!workoutId) return;
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const data = await getExercises(workoutId);
        setExercises(data);
        const available = await getAvailableExercises();
        setAvailableExercises(available);
      } catch (err) {
        console.error("Erro ao buscar exercícios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [workoutId]);

  const filteredExercises = availableExercises.filter((e) =>
    e.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleAddExercise = async (exerciseId: string) => {
    if (!workoutId) return;
    try {
      setLoading(true);
      const newExercise = await addExercise(workoutId, exerciseId);
      setExercises((prev) => [...prev, newExercise]);
      setShowAddModal(false);
      setSearchText("");
    } catch (err) {
      console.error("Erro ao adicionar exercício:", err);
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
          styles.container,
          { backgroundColor: theme["background-basic-color-1"] },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={28}
              color={theme["text-basic-color"]}
            />
          </Pressable>
          <Text category="h1">Exercícios</Text>
          <View style={{ width: 28 }} />
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
              }: RenderItemParams<Exercise>) => (
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
                      {item.sets} sets x {item.reps} reps
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
              onPress={() => setShowAddModal(true)}
              style={[styles.floatButton, { backgroundColor: "#0037ff" }]}
            >
              <Ionicons name="add" size={28} color="white" />
            </Pressable>
            <Pressable
              onPress={() => setEditMode(true)}
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
          <Input
            placeholder="Buscar exercício..."
            value={searchText}
            onChangeText={setSearchText}
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
                <Text>{item.name}</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 50,
  },
  listContainer: { flex: 1 },
  floatButtonContainer: {
    position: "absolute",
    bottom: 30,
    right: 20,
    zIndex: 10,
  },
  floatButton: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  exerciseItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
