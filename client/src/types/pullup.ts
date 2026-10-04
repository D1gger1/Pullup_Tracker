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

export type CompletedWorkout = {
  _id: string;
  userId: string;
  status: 'completed';
  startedAt: string;
  finishedAt: string;
  sets: PullupSet[];
  setsCount: number;
  totalReps: number;
  durationMinutes: number;
};

export type ProgressPeriod = 'week' | 'month' | 'threeMonths';

export type ProgressPoint = {
  date: string;
  totalReps: number;
};

export type ProgressStats = {
  period: ProgressPeriod;
  totalReps: number;
  points: ProgressPoint[];
};
