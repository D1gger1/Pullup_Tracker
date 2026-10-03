import { useEffect, useState } from 'react';
import type { CompletedWorkout } from '../types/pullup';

type HistoryFilter = 'all' | 'month' | 'best';

export function HistoryPage() {
  const [workouts, setWorkouts] = useState<CompletedWorkout[]>([]);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState<HistoryFilter>('all');

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
        const response = await fetch('/api/workouts', {
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
          setWorkouts(data);
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

  function toggleWorkout(workoutId: string) {
    setExpandedWorkoutId((currentId) => (currentId === workoutId ? null : workoutId));
  }

  const visibleWorkouts =
    activeFilter === 'month'
      ? workouts.filter((workout) => {
          const workoutDate = new Date(workout.startedAt);
          const currentDate = new Date();

          return (
            workoutDate.getMonth() === currentDate.getMonth() &&
            workoutDate.getFullYear() === currentDate.getFullYear()
          );
        })
      : activeFilter === 'best'
        ? [...workouts].sort((first, second) => second.totalReps - first.totalReps).slice(0, 3)
        : workouts;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-5 md:px-8 md:py-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100">История</h1>

      <p className="mt-1 text-sm text-zinc-400">Завершённые тренировки от новых к старым</p>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          aria-pressed={activeFilter === 'all'}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            activeFilter === 'all'
              ? 'bg-lime-300 text-zinc-950'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100'
          }`}
        >
          Все
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('month')}
          aria-pressed={activeFilter === 'month'}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            activeFilter === 'month'
              ? 'bg-lime-300 text-zinc-950'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100'
          }`}
        >
          Этот месяц
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('best')}
          aria-pressed={activeFilter === 'best'}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
            activeFilter === 'best'
              ? 'bg-lime-300 text-zinc-950'
              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-100'
          }`}
        >
          Лучшие
        </button>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-zinc-400">Загружаем историю...</p>
      ) : errorMessage ? (
        <p role="alert" className="mt-6 text-sm text-red-300">
          {errorMessage}
        </p>
      ) : visibleWorkouts.length === 0 ? (
        <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center">
          <p className="text-sm text-zinc-400">
            {activeFilter === 'month'
              ? 'В этом месяце завершённых тренировок пока нет.'
              : 'Завершённых тренировок пока нет.'}
          </p>
        </section>
      ) : (
        <div className="mt-6 space-y-3">
          {visibleWorkouts.map((workout) => {
            const startedAt = new Date(workout.startedAt);
            const isExpanded = expandedWorkoutId === workout._id;

            const day = startedAt.toLocaleDateString('ru-RU', {
              day: 'numeric',
            });

            const month = startedAt
              .toLocaleDateString('ru-RU', {
                month: 'short',
              })
              .replace('.', '')
              .toUpperCase();

            const fullDate = startedAt.toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <section
                key={workout._id}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
              >
                <button
                  type="button"
                  onClick={() => toggleWorkout(workout._id)}
                  aria-expanded={isExpanded}
                  className="focus-visible:outline-inset flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-zinc-800/50 focus-visible:outline-2 focus-visible:outline-lime-300"
                >
                  <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-zinc-950">
                    <span className="text-center">
                      <span className="block text-lg leading-none font-bold text-lime-300 tabular-nums">
                        {day}
                      </span>

                      <span className="mt-1 block text-[10px] font-bold tracking-wider text-lime-300">
                        {month}
                      </span>
                    </span>
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-zinc-100">Подтягивания</span>

                    <span className="mt-1 block text-xs text-zinc-400">
                      {workout.setsCount} подходов · {workout.durationMinutes} мин.
                    </span>
                  </span>

                  <span className="shrink-0 text-right">
                    <span className="block text-xl font-bold text-zinc-100 tabular-nums">
                      {workout.totalReps}
                    </span>

                    <span className="block text-xs text-zinc-400">повторений</span>
                  </span>

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                    className={`size-5 shrink-0 text-zinc-500 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="border-t border-zinc-800 px-4 pt-4 pb-4">
                    <p className="mb-3 text-xs text-zinc-500">{fullDate}</p>

                    <ul className="space-y-2">
                      {workout.sets.map((set, index) => (
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
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
