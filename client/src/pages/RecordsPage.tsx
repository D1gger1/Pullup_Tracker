import { useEffect, useState } from 'react';
import type { RecordsStats } from '../types/pullup';

function formatRecordDate(date: string | undefined) {
  if (!date) {
    return 'Пока нет данных';
  }

  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function RecordsPage() {
  const [recordsStats, setRecordsStats] = useState<RecordsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadRecords() {
      const token = localStorage.getItem('pullupTrackerToken');

      if (!token) {
        if (!cancelled) {
          setErrorMessage('Нужно войти в аккаунт.');
          setIsLoading(false);
        }

        return;
      }

      setIsLoading(true);
      setErrorMessage('');

      try {
        const response = await fetch('/api/pullups/stats/records', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (!cancelled) {
            setErrorMessage(data.message ?? 'Не удалось загрузить рекорды.');
          }

          return;
        }

        if (!cancelled) {
          setRecordsStats(data);
        }
      } catch (error) {
        console.error('Ошибка загрузки рекордов:', error);

        if (!cancelled) {
          setErrorMessage('Не удалось загрузить рекорды. Проверь соединение.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadRecords();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 md:px-8 md:py-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Личные рекорды</h1>

      <p className="mt-1 text-sm text-zinc-400">Твои лучшие результаты за всё время тренировок</p>

      {isLoading ? (
        <p className="mt-6 text-sm text-zinc-400">Загружаем рекорды...</p>
      ) : errorMessage ? (
        <p role="alert" className="mt-6 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : recordsStats ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm font-medium text-zinc-400">Лучший подход</p>

            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-4xl font-bold text-lime-300 tabular-nums">
                {recordsStats.bestSet?.reps ?? 0}
              </p>

              <span className="text-sm text-zinc-400">повт.</span>
            </div>

            <p className="mt-3 text-xs text-zinc-500">
              {formatRecordDate(recordsStats.bestSet?.performedAt)}
            </p>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm font-medium text-zinc-400">Лучшая тренировка</p>

            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-4xl font-bold text-zinc-100 tabular-nums">
                {recordsStats.bestWorkout?.totalReps ?? 0}
              </p>

              <span className="text-sm text-zinc-400">повт.</span>
            </div>

            <p className="mt-3 text-xs text-zinc-500">
              {formatRecordDate(recordsStats.bestWorkout?.finishedAt)}
            </p>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm font-medium text-zinc-400">Максимум подходов</p>

            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-4xl font-bold text-zinc-100 tabular-nums">
                {recordsStats.mostSetsWorkout?.setsCount ?? 0}
              </p>

              <span className="text-sm text-zinc-400">подходов</span>
            </div>

            <p className="mt-3 text-xs text-zinc-500">
              {formatRecordDate(recordsStats.mostSetsWorkout?.finishedAt)}
            </p>
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <p className="text-sm font-medium text-zinc-400">Самая длинная серия</p>

            <div className="mt-3 flex items-baseline gap-2">
              <p className="text-4xl font-bold text-zinc-100 tabular-nums">
                {recordsStats.longestStreak}
              </p>

              <span className="text-sm text-zinc-400">дней</span>
            </div>

            <p className="mt-3 text-xs text-zinc-500">Дни тренировок подряд</p>
          </section>
        </div>
      ) : (
        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <p className="text-sm text-zinc-400">Рекордов пока нет.</p>
        </section>
      )}
    </main>
  );
}
