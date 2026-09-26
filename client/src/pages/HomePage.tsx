import { useEffect, useState, type FormEvent } from 'react';

type PullupSet = {
  _id: string;
  reps: number;
  performedAt: string;
};

type DailyStats = {
  totalReps: number;
  sets: PullupSet[];
};

export function HomePage() {
  const [reps, setReps] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statsError, setStatsError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [statsVersion, setStatsVersion] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [currentStreak, setCurrentStreak] = useState<number | null>(null);
  const [streakError, setStreakError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentStreak() {
      const token = localStorage.getItem('pullupTrackerToken');

      if (!token) {
        if (!cancelled) {
          setStreakError('Войдите в аккаунт, чтобы увидеть статистику.');
        }
        return;
      }

      try {
        const response = await fetch('/api/pullups/stats/streak', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (!cancelled) {
            setStreakError(data.message ?? 'Не удалось загрузить серию.');
          }

          return;
        }
        if (!cancelled) {
          setCurrentStreak(data.currentStreak);
          setStreakError('');
        }
      } catch (error) {
        console.error('Ошибка загрузки серии:', error);

        if (!cancelled) {
          setStreakError('Не удалось загрузить серию. Проверь соединение.');
        }
      }
    }

    async function loadDailyStats() {
      const token = localStorage.getItem('pullupTrackerToken');

      if (!token) {
        if (!cancelled) {
          setStatsError('Войдите в аккаунт, чтобы увидеть статистику.');
        }
        return;
      }

      try {
        const response = await fetch('/api/pullups/stats/daily', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (!cancelled) {
            setStatsError(data.message ?? 'Не удалось загрузить статистику.');
          }
          return;
        }
        if (!cancelled) {
          setDailyStats(data);
          setStatsError('');
        }
      } catch (error) {
        console.error('Ошибка загрузки статистики:', error);

        if (!cancelled) {
          setStatsError('Не удалось загрузить статистику. Проверь соединение.');
        }
      }
    }

    void loadCurrentStreak();
    void loadDailyStats();

    return () => {
      cancelled = true;
    };
  }, [statsVersion]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;
    setErrorMessage('');
    setSuccessMessage('');

    const repetitions = Number(reps);
    const token = localStorage.getItem('pullupTrackerToken');
    if (!token) {
      setErrorMessage('Нужно войти в аккаунт');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/pullups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reps: repetitions }),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message ?? 'Не удалось сохранить подход');
        return;
      }
      setSuccessMessage(`Подход сохранён. Повторений: ${repetitions}`);
      setReps('');
      setStatsVersion((previous) => previous + 1);
    } catch (error) {
      console.error('Ошибка запроса или чтения ответа:', error);
      setErrorMessage('Не удалось получить ответ сервера. Проверь соединение.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold text-lime-300">Обзор</h1>

      <p className="mt-3 text-zinc-400">Каждый подход — шаг вперёд. Запиши свой результат</p>

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
      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-lg font-semibold">Сегодня</h2>
        {statsError ? (
          <p role="alert" className="mt-3 text-sm text-red-300">
            {statsError}
          </p>
        ) : dailyStats !== null ? (
          <div className="mt-3 space-y-2">
            {dailyStats.sets.length === 0 && (
              <p className="text-sm text-zinc-400">
                Сегодня подходов пока нет. Запиши первый ниже.
              </p>
            )}
            <p>Повторений: {dailyStats.totalReps}</p>
            <p>Подходов: {dailyStats.sets.length}</p>
            <ul className="max-h-64 space-y-2 overflow-y-auto pr-2">
              {dailyStats.sets.map((set) => (
                <li
                  key={set._id}
                  className="flex items-center justify-between gap-3 rounded-lg bg-zinc-950 px-4 py-3 text-sm"
                >
                  <span>Повторений: {set.reps} </span>
                  <time dateTime={set.performedAt} className="text-zinc-400">
                    {new Date(set.performedAt).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-400">Загружаем статистику...</p>
        )}
      </section>
      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-lg font-semibold">Добавить подход</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="reps" className="block text-sm font-medium text-zinc-300">
              Количество повторений
            </label>
            <input
              type="number"
              id="reps"
              name="reps"
              value={reps}
              onChange={(event) => setReps(event.target.value)}
              disabled={isSubmitting}
              min={1}
              step={1}
              required
              className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-zinc-100 transition-colors outline-none focus:border-lime-300"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl bg-lime-300 px-4 text-sm font-bold text-zinc-950 transition-colors hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 active:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Сохраняем...' : 'Сохранить подход'}
          </button>
          {errorMessage && (
            <p role="alert" className="text-sm text-red-300">
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p role="status" className="text-sm text-lime-300">
              {successMessage}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}
