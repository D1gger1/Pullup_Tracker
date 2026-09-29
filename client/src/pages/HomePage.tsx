import { useEffect, useState, type FormEvent } from 'react';
import { StreakCard } from '../components/home/StreakCard';
import { SummaryCards } from '../components/home/SummaryCards';
import { AddSetForm } from '../components/home/AddSetForm';
import { PullupSetItem } from '../components/home/PullupSetItem';
import { TodayStats } from '../components/home/TodayStats';
import type { PullupSet, DailyStats } from '../types/pullup';

type SummaryStats = {
  monthlyReps: number;
  bestSet: number;
};

export function HomePage() {
  const [reps, setReps] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [statsVersion, setStatsVersion] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [statsError, setStatsError] = useState('');

  const [currentStreak, setCurrentStreak] = useState<number | null>(null);
  const [streakError, setStreakError] = useState('');

  const [summaryStats, setSummaryStats] = useState<SummaryStats | null>(null);
  const [summaryError, setSummaryError] = useState('');

  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [editedReps, setEditedReps] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [editError, setEditError] = useState('');

  const [deletingSetId, setDeletingSetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const isBusy = isSubmitting || isUpdating || isDeleting;

  useEffect(() => {
    let cancelled = false;

    async function loadSummaryStats() {
      const token = localStorage.getItem('pullupTrackerToken');

      if (!token) {
        if (!cancelled) {
          setSummaryError('Войдите в аккаунт, чтобы увидеть показатели.');
        }
        return;
      }

      try {
        const response = await fetch('/api/pullups/stats/summary', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (!cancelled) {
            setSummaryError(data.message ?? 'Не удалось загрузить показатели.');
          }
          return;
        }

        if (!cancelled) {
          setSummaryStats(data);
          setSummaryError('');
        }
      } catch (error) {
        console.error('Ошибка загрузки показателей:', error);

        if (!cancelled) {
          setSummaryError('Не удалось загрузить показатели. Проверь соединение.');
        }
      }
    }

    async function loadCurrentStreak() {
      const token = localStorage.getItem('pullupTrackerToken');

      if (!token) {
        if (!cancelled) {
          setStreakError('Войдите в аккаунт, чтобы увидеть серию.');
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
    void loadSummaryStats();

    return () => {
      cancelled = true;
    };
  }, [statsVersion]);

  function startEditing(set: PullupSet) {
    if (isBusy) return;

    setDeletingSetId(null);
    setDeleteError('');

    setEditingSetId(set._id);
    setEditedReps(String(set.reps));
    setEditError('');
  }

  function cancelEditing() {
    if (isBusy) return;

    setEditingSetId(null);
    setEditedReps('');
    setEditError('');
  }

  function startDeleting(id: string) {
    if (isBusy) return;

    setEditingSetId(null);
    setEditedReps('');
    setEditError('');

    setDeletingSetId(id);
    setDeleteError('');
  }

  function cancelDeleting() {
    if (isBusy) return;

    setDeletingSetId(null);
    setDeleteError('');
  }

  async function handleUpdateSet(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isBusy || editingSetId === null) return;

    setEditError('');

    const repetitions = Number(editedReps);

    if (!Number.isInteger(repetitions) || repetitions < 1) {
      setEditError('Введите целое число больше нуля.');
      return;
    }

    const token = localStorage.getItem('pullupTrackerToken');

    if (!token) {
      setEditError('Нужно войти в аккаунт.');
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/pullups/${editingSetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reps: repetitions }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEditError(data.message ?? 'Не удалось изменить подход.');
        return;
      }

      setDailyStats((previous) => {
        if (previous === null) return previous;

        const updatedSets = previous.sets.map((item) =>
          item._id === data._id ? { ...item, reps: data.reps } : item,
        );

        return {
          ...previous,
          sets: updatedSets,
          totalReps: updatedSets.reduce((sum, item) => sum + item.reps, 0),
        };
      });

      setEditingSetId(null);
      setEditedReps('');
      setStatsVersion((previous) => previous + 1);
    } catch (error) {
      console.error('Ошибка изменения подхода:', error);
      setEditError('Не удалось получить ответ сервера. Проверь соединение.');
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDeleteSet() {
    if (isBusy || deletingSetId === null) return;

    setDeleteError('');

    const token = localStorage.getItem('pullupTrackerToken');

    if (!token) {
      setDeleteError('Нужно войти в аккаунт.');
      return;
    }

    const idToDelete = deletingSetId;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/pullups/${idToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setDeleteError(data.message ?? 'Не удалось удалить подход.');
        return;
      }

      setDailyStats((previous) => {
        if (previous === null) return previous;

        const remainingSets = previous.sets.filter((item) => item._id !== idToDelete);

        return {
          ...previous,
          sets: remainingSets,
          totalReps: remainingSets.reduce((sum, item) => sum + item.reps, 0),
        };
      });

      setDeletingSetId(null);
      setStatsVersion((previous) => previous + 1);
    } catch (error) {
      console.error('Ошибка удаления подхода:', error);
      setDeleteError('Не удалось получить ответ сервера. Проверь соединение.');
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isBusy) return;

    setErrorMessage('');
    setSuccessMessage('');

    const repetitions = Number(reps);

    if (!Number.isInteger(repetitions) || repetitions < 1) {
      setErrorMessage('Введите целое число больше нуля.');
      return;
    }

    const token = localStorage.getItem('pullupTrackerToken');

    if (!token) {
      setErrorMessage('Нужно войти в аккаунт.');
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
        setErrorMessage(data.message ?? 'Не удалось сохранить подход.');
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
    <main className="px-4 py-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Обзор</h1>

      <p className="mt-1 text-sm text-zinc-400">
        Каждый подход — шаг вперёд. Запиши свой результат
      </p>

      <AddSetForm
        reps={reps}
        isBusy={isBusy}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        successMessage={successMessage}
        onRepsChange={setReps}
        onSubmit={handleSubmit}
      />

      <StreakCard currentStreak={currentStreak} streakError={streakError} />

      <TodayStats dailyStats={dailyStats} statsError={statsError}>
        <ul className="max-h-64 space-y-2 overflow-y-auto pr-2">
          {dailyStats?.sets.map((set, index) => (
            <PullupSetItem
              key={set._id}
              set={set}
              index={index}
              isEditing={editingSetId === set._id}
              editedReps={editedReps}
              editError={editError}
              isConfirmingDelete={deletingSetId === set._id}
              deleteError={deleteError}
              isBusy={isBusy}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
              onStartEditing={() => startEditing(set)}
              onEditedRepsChange={setEditedReps}
              onUpdate={handleUpdateSet}
              onCancelEditing={cancelEditing}
              onStartDeleting={() => startDeleting(set._id)}
              onDelete={handleDeleteSet}
              onCancelDeleting={cancelDeleting}
            />
          ))}
        </ul>
      </TodayStats>

      <SummaryCards summaryError={summaryError} summaryStats={summaryStats} />
    </main>
  );
}
