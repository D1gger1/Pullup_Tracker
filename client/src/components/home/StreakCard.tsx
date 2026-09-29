type StreakCardProps = {
  currentStreak: number | null;
  streakError: string;
};

export function StreakCard({ currentStreak, streakError }: StreakCardProps) {
  return (
    <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-sm font-medium text-zinc-400">Текущая серия</h2>

      {streakError ? (
        <p role="alert" className="mt-3 text-sm text-red-300">
          {streakError}
        </p>
      ) : currentStreak !== null ? (
        <p className="mt-3 text-4xl font-bold text-lime-300">Дней подряд: {currentStreak}</p>
      ) : (
        <p className="mt-3 text-sm text-zinc-400">Загружаем серию...</p>
      )}

      <p className="mt-2 text-sm text-zinc-400">Дни подряд с записанными подходами</p>
    </section>
  );
}
