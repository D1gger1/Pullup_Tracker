export type PullupSet = {
  _id: string;
  reps: number;
  performedAt: string;
};

export type DailyStats = {
  totalReps: number;
  sets: PullupSet[];
};
