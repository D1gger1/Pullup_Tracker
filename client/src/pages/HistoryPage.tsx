import { useEffect, useState } from 'react';
import type { PullupSet } from '../types/pullup';

type HistoryDay = {
  date: string;
  sets: PullupSet[];
  totalReps: number;
};

export function HistoryPage() {
  const [sets, setSets] = useState<PullupSet[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      const token = localStorage.getItem('pullupTrackerToken');

      if (!token) {
        if (!cancelled) {
          setErrorMessage('Нужно войти в аккаунт.');
          setIsLoading(false);
        }

        return;
      }

      try {
        const response = await fetch('/api/pullups', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (!cancelled) {
            setErrorMessage(data.message ?? 'Не удалось загрузить историю.');
          }

          return;
        }

        if (!cancelled) {
          setSets(data);
          setErrorMessage('');
        }
      } catch (error) {
        console.error('Ошибка загрузки истории:', error);

        if (!cancelled) {
          setErrorMessage('Не удалось загрузить историю. Проверь соединение.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedSets = [...sets].sort(
    (firstSet, secondSet) =>
      new Date(secondSet.performedAt).getTime() - new Date(firstSet.performedAt).getTime(),
  );

  const historyDays = sortedSets.reduce<HistoryDay[]>((days, set) => {
    const date = new Date(set.performedAt).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const lastDay = days[days.length - 1];

    if (lastDay?.date === date) {
      lastDay.sets.push(set);
      lastDay.totalReps += set.reps;
    } else {
      days.push({
        date,
        sets: [set],
        totalReps: set.reps,
      });
    }

    return days;
  }, []);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 md:px-8 md:py-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100">История тренировок</h1>

      <p className="mt-1 text-sm text-zinc-400">Все записанные подходы от новых к старым</p>

      {isLoading ? (
        <p className="mt-6 text-sm text-zinc-400">Загружаем историю...</p>
      ) : errorMessage ? (
        <p role="alert" className="mt-6 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : historyDays.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <p className="text-sm text-zinc-400">История пока пустая.</p>
        </section>
      ) : (
        <div className="mt-6 grid gap-4 space-y-4 lg:grid-cols-2 lg:items-start">
          {historyDays.map((day) => (
            <section key={day.date} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-zinc-100">{day.date}</h2>

                  <p className="mt-1 text-xs text-zinc-400">Подходов: {day.sets.length}</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-zinc-100 tabular-nums">{day.totalReps}</p>

                  <p className="text-xs text-zinc-400">повторений</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2 border-t border-zinc-800 pt-4 lg:max-h-80 lg:overflow-y-auto lg:pr-2">
                {day.sets.map((set, index) => (
                  <li
                    key={set._id}
                    className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-400">
                      {index + 1}
                    </span>

                    <div className="flex flex-1 items-baseline gap-2">
                      <span className="text-lg font-bold text-zinc-100 tabular-nums">
                        {set.reps}
                      </span>

                      <span className="text-xs text-zinc-400">повт.</span>
                    </div>

                    <time
                      dateTime={set.performedAt}
                      className="shrink-0 text-xs text-zinc-500 tabular-nums"
                    >
                      {new Date(set.performedAt).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
