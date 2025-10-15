import { Workout, WorkoutExercise } from "@/types/workout";
import api from "./api";

const toWorkout = (w: any): Workout => ({
  id: w.id,
  name: w.name,
  isRest: w.is_rest,
});

const getExercises = async (workoutId: string): Promise<WorkoutExercise[]> => {
  const response = await api.get(`/workout-exercises/${workoutId}`);
  return response.data;
};

const getWorkouts = async (): Promise<Workout[]> => {
  const response = await api.get("/workouts");
  return response.data.map(toWorkout);
};

const updateWorkoutOrder = async (workouts: Workout[]) => {
  const order = workouts.map((w) => w.id);
  await api.patch("/workouts/reorder", { order });
};

const updateWorkoutName = async (id: string, name: string) => {
  await api.patch(`/workouts/${id}`, { name });
};

const deleteWorkout = async (id: string) => {
  await api.delete(`/workouts/${id}`);
};

const addWorkout = async (name: string, isRest: boolean) => {
  const response = await api.post("/workouts", { name, is_rest: isRest });
  return toWorkout(response.data);
};

const addRestDay = async () => {
  const response = await api.post("/workouts/rest");
  return toWorkout(response.data);
};

const workoutService = {
  addRestDay,
  addWorkout,
  deleteWorkout,
  updateWorkoutOrder,
  updateWorkoutName,
  getExercises,
  getWorkouts,
};

export default workoutService;
