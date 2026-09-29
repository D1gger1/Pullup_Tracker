type SummaryCardProps = {
  summaryStats: {
    monthlyReps: number;
    bestSet: number;
  } | null;
  summaryError: string;
};

export function SummaryCards({ summaryStats, summaryError }: SummaryCardProps) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      {summaryError && (
        <p role="alert" className="col-span-2 text-sm text-red-300">
          {summaryError}
        </p>
      )}

      <section className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-sm font-medium text-zinc-400">Повторений за месяц</h2>
        <p className="mt-3 text-3xl font-bold text-zinc-100">
          {summaryError ? '—' : (summaryStats?.monthlyReps ?? '…')}
        </p>
      </section>

      <section className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="text-sm font-medium text-zinc-400">Лучший подход</h2>
        <p className="mt-3 text-3xl font-bold text-zinc-100">
          {summaryError ? '—' : (summaryStats?.bestSet ?? '…')}
        </p>
        <p className="mt-2 text-xs text-zinc-400">За всё время</p>
      </section>
    </div>
  );
}
