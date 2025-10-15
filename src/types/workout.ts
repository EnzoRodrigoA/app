export interface Workout {
  id: string;
  name: string;
  isRest: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise_sequence: string;
  name: string;
  target_muscle?: string;
}
