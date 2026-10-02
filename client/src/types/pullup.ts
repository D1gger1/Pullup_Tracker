export type PullupSet = {
  _id: string;
  userId: string;
  workoutId: string;
  reps: number;
  performedAt: string;
};

export type DailyStats = {
  totalReps: number;
  sets: PullupSet[];
};

export type Workout = {
  _id: string;
  userId: string;
  status: 'active' | 'completed';
  startedAt: string;
  finishedAt: string | null;
};

export type CurrentWorkout = {
  workout: Workout | null;
  sets: PullupSet[];
  totalReps: number;
};
