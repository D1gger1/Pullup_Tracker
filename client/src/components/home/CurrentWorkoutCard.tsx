import type { ReactNode } from 'react';
import type { CurrentWorkout } from '../../types/pullup';

type CurrentWorkoutCardProps = {
  currentWorkout: CurrentWorkout | null;
  workoutError: string;
  isFinishing: boolean;
  onFinish: () => void;
  children: ReactNode;
};

export function CurrentWorkoutCard({
  currentWorkout,
  workoutError,
  isFinishing,
  onFinish,
  children,
}: CurrentWorkoutCardProps) {
  const hasActiveWorkout = currentWorkout?.workout !== null;

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-100">Текущая тренировка</h2>

        <span className="text-xs text-zinc-400">{currentWorkout?.sets.length ?? 0} подходов</span>
      </div>

      {workoutError ? (
        <p role="alert" className="mt-4 text-sm text-red-300">
          {workoutError}
        </p>
      ) : currentWorkout === null ? (
        <p className="mt-4 text-sm text-zinc-400">Загружаем тренировку...</p>
      ) : !hasActiveWorkout ? (
        <>
          <div className="flex min-h-44 items-center justify-center text-center">
            <p className="max-w-xs text-sm leading-6 text-zinc-400">
              Первый подход появится здесь.
              <br />
              Начни с комфортного числа.
            </p>
          </div>

          <div className="flex items-end justify-between gap-4 border-t border-zinc-800 pt-4">
            <div>
              <p className="text-xs text-zinc-400">Всего в тренировке</p>
              <p className="mt-1 text-xl font-bold text-zinc-100">0 повторений</p>
            </div>

            <button
              type="button"
              disabled
              className="min-h-11 rounded-xl border border-zinc-700 px-4 text-sm font-semibold text-zinc-500 disabled:cursor-not-allowed"
            >
              Завершить
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mt-4 max-h-64 overflow-y-auto pr-1">{children}</div>

          <div className="mt-5 flex items-end justify-between gap-4 border-t border-zinc-800 pt-4">
            <div>
              <p className="text-xs text-zinc-400">Всего в тренировке</p>

              <p className="mt-1 text-xl font-bold text-zinc-100 tabular-nums">
                {currentWorkout.totalReps} повторений
              </p>
            </div>

            <button
              type="button"
              onClick={onFinish}
              disabled={isFinishing}
              className="min-h-11 shrink-0 rounded-xl border border-zinc-700 px-4 text-sm font-semibold text-zinc-100 transition-colors hover:border-lime-300 hover:text-lime-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isFinishing ? 'Завершаем...' : 'Завершить'}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
