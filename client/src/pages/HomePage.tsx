import { useEffect, useState, type FormEvent } from 'react';
import { StreakCard } from '../components/home/StreakCard';
import { SummaryCards } from '../components/home/SummaryCards';
import { AddSetForm } from '../components/home/AddSetForm';
import { PullupSetItem } from '../components/home/PullupSetItem';
import { CurrentWorkoutCard } from '../components/home/CurrentWorkoutCard';
import type { CurrentWorkout, PullupSet } from '../types/pullup';

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

  const [currentWorkout, setCurrentWorkout] = useState<CurrentWorkout | null>(null);
  const [workoutError, setWorkoutError] = useState('');
  const [isFinishingWorkout, setIsFinishingWorkout] = useState(false);

  const isBusy = isSubmitting || isUpdating || isDeleting || isFinishingWorkout;

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentWorkout() {
      const token = localStorage.getItem('pullupTrackerToken');

      if (!token) {
        if (!cancelled) {
          setWorkoutError('Нужно войти в аккаунт.');
        }

        return;
      }

      try {
        const response = await fetch('/api/workouts/current', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (!cancelled) {
            setWorkoutError(data.message ?? 'Не удалось загрузить текущую тренировку.');
          }

          return;
        }

        if (!cancelled) {
          setCurrentWorkout(data);
          setWorkoutError('');
        }
      } catch (error) {
        console.error('Ошибка загрузки текущей тренировки:', error);

        if (!cancelled) {
          setWorkoutError('Не удалось загрузить тренировку. Проверь соединение.');
        }
      }
    }

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

    void loadCurrentStreak();
    void loadSummaryStats();
    void loadCurrentWorkout();

    return () => {
      cancelled = true;
    };
  }, [statsVersion]);

  async function handleFinishWorkout() {
    if (!currentWorkout?.workout || isFinishingWorkout) return;

    const token = localStorage.getItem('pullupTrackerToken');

    if (!token) {
      setWorkoutError('Нужно войти в аккаунт.');
      return;
    }

    setWorkoutError('');
    setIsFinishingWorkout(true);

    try {
      const response = await fetch(`/api/workouts/${currentWorkout.workout._id}/finish`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setWorkoutError(data.message ?? 'Не удалось завершить тренировку.');
        return;
      }

      setCurrentWorkout({
        workout: null,
        sets: [],
        totalReps: 0,
      });

      setStatsVersion((previous) => previous + 1);
    } catch (error) {
      console.error('Ошибка завершения тренировки:', error);
      setWorkoutError('Не удалось получить ответ сервера. Проверь соединение.');
    } finally {
      setIsFinishingWorkout(false);
    }
  }

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
        body: JSON.stringify({
          reps: repetitions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setEditError(data.message ?? 'Не удалось изменить подход.');
        return;
      }

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
        body: JSON.stringify({
          reps: repetitions,
        }),
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
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Обзор</h1>

      <p className="mt-1 text-sm text-zinc-400">
        Каждый подход — шаг вперёд. Запиши свой результат
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-3 lg:items-stretch">
        <div className="lg:col-span-2 lg:flex">
          <AddSetForm
            reps={reps}
            isBusy={isBusy}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            successMessage={successMessage}
            onRepsChange={setReps}
            onSubmit={handleSubmit}
          />
        </div>

        <div className="space-y-4">
          <StreakCard currentStreak={currentStreak} streakError={streakError} />

          <CurrentWorkoutCard
            currentWorkout={currentWorkout}
            workoutError={workoutError}
            isFinishing={isFinishingWorkout}
            onFinish={handleFinishWorkout}
          >
            <ul className="space-y-2">
              {currentWorkout?.sets.map((set, index) => (
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
          </CurrentWorkoutCard>
        </div>
      </div>

      <SummaryCards summaryError={summaryError} summaryStats={summaryStats} />
    </main>
  );
}
