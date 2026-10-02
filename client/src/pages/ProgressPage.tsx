import { useEffect, useState } from 'react';
import type { PullupSet } from '../types/pullup';

type Weekly = {
  totalReps: number;
  sets: PullupSet[];
};

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function ProgressPage() {
  const [weeklyStats, setWeeklyStats] = useState<Weekly | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const totalsByDay = new Map<string, number>();

  for (const set of weeklyStats?.sets ?? []) {
    const dateKey = getDateKey(new Date(set.performedAt));
    const currentTotal = totalsByDay.get(dateKey) ?? 0;

    totalsByDay.set(dateKey, currentTotal + set.reps);
  }

  const startOfWeek = new Date();
  const daYOfWeek = startOfWeek.getDay();
  const daysForMonday = daYOfWeek === 0 ? 6 : daYOfWeek - 1;

  startOfWeek.setDate(startOfWeek.getDate() - daysForMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  const dayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const weeklyDays = dayLabels.map((label, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);

    return {
      dateKey: getDateKey(date),
      label,
      totalReps: totalsByDay.get(getDateKey(date)) ?? 0,
    };
  });

  const maxDailyReps = Math.max(...weeklyDays.map((day) => day.totalReps), 1);
  useEffect(() => {
    let cancelled = false;

    async function checkProgress() {
      const token = localStorage.getItem('pullupTrackerToken');

      if (!token) {
        if (!cancelled) {
          setErrorMessage('Нужно войти в аккаунт.');
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetch('/api/pullups/stats/weekly', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (!cancelled) {
            setErrorMessage(data.message ?? 'Не удалось загрузить статистику.');
          }
          return;
        }
        if (!cancelled) {
          setWeeklyStats(data);
          setErrorMessage('');
        }
      } catch (error) {
        console.error('Ошибка загрузки подходов:', error);

        if (!cancelled) {
          setErrorMessage('Не удалось загрузить. Проверь соединение.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void checkProgress();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 md:px-8 md:py-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Прогресс</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Следи за объёмом тренировок и изменением результатов
      </p>
      {isLoading ? (
        <p className="mt-6 text-sm text-zinc-400">Загружаем прогресс...</p>
      ) : errorMessage ? (
        <p role="alert" className="mt-6 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : weeklyStats ? (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <section className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <h2 className="text-xs font-medium text-zinc-400">Повторений за неделю</h2>

              <p className="mt-2 text-3xl font-bold text-zinc-100 tabular-nums">
                {weeklyStats.totalReps}
              </p>
            </section>

            <section className="min-w-0 rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <h2 className="text-xs font-medium text-zinc-400">Подходов за неделю</h2>

              <p className="mt-2 text-3xl font-bold text-zinc-100 tabular-nums">
                {weeklyStats.sets.length}
              </p>
            </section>
          </div>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="text-sm font-semibold text-zinc-100">Текущая неделя</h2>

            <div className="mt-6 grid grid-cols-7 gap-2">
              {weeklyDays.map((day) => {
                const barHeight =
                  day.totalReps === 0 ? 0 : Math.max((day.totalReps / maxDailyReps) * 100, 8);

                return (
                  <div key={day.dateKey} className="flex min-w-0 flex-col items-center">
                    <span className="mb-2 text-xs text-zinc-400 tabular-nums">{day.totalReps}</span>

                    <div className="flex h-40 w-full items-end justify-center">
                      <div
                        title={`${day.label}: ${day.totalReps} повторений`}
                        className={`w-full max-w-8 rounded-t-lg ${
                          day.totalReps > 0 ? 'bg-lime-300' : 'bg-zinc-800'
                        }`}
                        style={{
                          height: day.totalReps > 0 ? `${barHeight}%` : '4px',
                        }}
                      />
                    </div>

                    <span className="mt-2 text-xs font-medium text-zinc-500">{day.label}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
