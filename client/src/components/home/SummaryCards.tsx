type SummaryCardProps = {
  summaryStats: {
    monthlyReps: number;
    bestSet: number;
  } | null;
  summaryError: string;
};

export function SummaryCards({ summaryStats, summaryError }: SummaryCardProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {summaryError && (
        <p role="alert" className="col-span-2 text-sm text-red-300">
          {summaryError}
        </p>
      )}

      <section className="min-w-0 rounded-2xl border border-zinc-800/60 bg-zinc-900 p-4">
        <h2 className="text-xs font-medium text-zinc-400">Повторений за месяц</h2>
        <p className="mt-2 text-2xl font-bold text-zinc-100 tabular-nums">
          {summaryError ? '—' : (summaryStats?.monthlyReps ?? '…')}
        </p>
      </section>

      <section className="min-w-0 rounded-2xl border border-zinc-800/60 bg-zinc-900 p-4">
        <h2 className="text-xs font-medium text-zinc-400">Лучший подход</h2>
        <p className="mt-2 text-2xl font-bold text-zinc-100 tabular-nums">
          {summaryError ? '—' : (summaryStats?.bestSet ?? '…')}
        </p>
        <p className="mt-2 text-xs text-zinc-400">За всё время</p>
      </section>
    </div>
  );
}
