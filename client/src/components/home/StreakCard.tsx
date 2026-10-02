type StreakCardProps = {
  currentStreak: number | null;
  streakError: string;
};

export function StreakCard({ currentStreak, streakError }: StreakCardProps) {
  return (
    <section className="flex items-center gap-4 rounded-2xl border border-zinc-800/60 bg-zinc-900 p-4">
      <div
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-xl border border-lime-300/15 bg-lime-300/5 text-lime-300"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6"
        >
          <path d="M12 3c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-4 3-6 0 3 1 4 2 4 1-2 1-4 0-7Z" />
        </svg>
      </div>

      <div className="min-w-0">
        <h2 className="text-xs font-medium text-zinc-400">Текущая серия</h2>

        {streakError ? (
          <p role="alert" className="mt-1 text-sm text-red-300">
            {streakError}
          </p>
        ) : currentStreak !== null ? (
          <p className="mt-1 text-xl font-bold text-zinc-100">Дней подряд: {currentStreak}</p>
        ) : (
          <p className="mt-1 text-sm text-zinc-400">Загружаем серию...</p>
        )}
      </div>
    </section>
  );
}
