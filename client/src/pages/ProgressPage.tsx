import { useEffect, useState } from 'react';
import { ProgressChart } from '../components/progress/ProgressChart';
import { authFetch } from '../api/authFetch';
import type { ProgressPeriod, ProgressStats } from '../types/pullup';

const periodOptions: Array<{
  value: ProgressPeriod;
  label: string;
}> = [
  { value: 'week', label: '1 нед' },
  { value: 'month', label: '1 мес' },
  { value: 'threeMonths', label: '3 мес' },
];

export function ProgressPage() {
  const [activePeriod, setActivePeriod] = useState<ProgressPeriod>('month');
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProgress() {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const response = await authFetch(`/api/pullups/stats/progress?period=${activePeriod}`);
        const data = await response.json();

        if (!response.ok) {
          if (!cancelled) {
            setErrorMessage(data.message ?? 'Не удалось загрузить прогресс.');
          }

          return;
        }

        if (!cancelled) {
          setProgressStats(data);
        }
      } catch (error) {
        console.error('Ошибка загрузки прогресса:', error);

        if (!cancelled) {
          setErrorMessage('Не удалось загрузить прогресс. Проверь соединение.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProgress();

    return () => {
      cancelled = true;
    };
  }, [activePeriod]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 md:px-8 md:py-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Прогресс</h1>

      <p className="mt-1 text-sm text-zinc-400">
        Следи за объёмом тренировок и изменением результатов
      </p>

      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Общий объём</h2>

            {progressStats && !errorMessage && !isLoading && (
              <p className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-zinc-100 tabular-nums">
                  {progressStats.totalReps}
                </span>

                <span className="text-xs text-zinc-400">повторений</span>
              </p>
            )}
          </div>

          <div
            role="group"
            aria-label="Период статистики"
            className="flex rounded-xl border border-zinc-800 bg-zinc-950 p-1"
          >
            {periodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setActivePeriod(option.value)}
                aria-pressed={activePeriod === option.value}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  activePeriod === option.value
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center md:min-h-80">
            <p className="text-sm text-zinc-400">Загружаем прогресс...</p>
          </div>
        ) : errorMessage ? (
          <div className="flex min-h-64 items-center justify-center md:min-h-80">
            <p role="alert" className="text-sm text-red-300">
              {errorMessage}
            </p>
          </div>
        ) : progressStats && progressStats.points.length > 0 ? (
          <div className="mt-6">
            <ProgressChart points={progressStats.points} />
          </div>
        ) : (
          <div className="flex min-h-64 items-center justify-center text-center md:min-h-80">
            <p className="text-sm text-zinc-400">За выбранный период пока нет данных.</p>
          </div>
        )}
      </section>
    </main>
  );
}
