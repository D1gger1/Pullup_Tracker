import type { ReactNode } from 'react';
import type { DailyStats } from '../../types/pullup';

type TodayStatsProps = {
  dailyStats: DailyStats | null;
  statsError: string;
  children: ReactNode;
};

export function TodayStats({ dailyStats, statsError, children }: TodayStatsProps) {
  return (
    <section className="mt-4 rounded-2xl border border-zinc-800/60 bg-zinc-900 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Сегодня</h2>

        {dailyStats !== null && !statsError && (
          <span className="text-xs text-zinc-400">Подходов: {dailyStats.sets.length}</span>
        )}
      </div>

      {statsError ? (
        <p role="alert" className="mt-4 text-sm text-red-300">
          {statsError}
        </p>
      ) : dailyStats !== null ? (
        <div className="mt-4">
          {dailyStats.sets.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center text-center">
              <p className="text-sm text-zinc-400">
                Сегодня подходов пока нет. Добавь первый подход.
              </p>
            </div>
          ) : (
            children
          )}

          <div className="mt-5 border-t border-zinc-800 pt-4">
            <p className="text-xs text-zinc-400">Всего повторений сегодня</p>
            <p className="mt-1 text-2xl font-bold text-zinc-100">{dailyStats.totalReps}</p>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-zinc-400">Загружаем статистику...</p>
      )}
    </section>
  );
}
