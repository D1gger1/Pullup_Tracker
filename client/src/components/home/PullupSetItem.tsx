import type { FormEvent } from 'react';
import type { PullupSet } from '../../types/pullup';

type PullupSetItemProps = {
  set: PullupSet;
  index: number;

  isEditing: boolean;
  editedReps: string;
  editError: string;

  isConfirmingDelete: boolean;
  deleteError: string;

  isBusy: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  onStartEditing: () => void;
  onEditedRepsChange: (value: string) => void;
  onUpdate: (event: FormEvent<HTMLFormElement>) => void;
  onCancelEditing: () => void;

  onStartDeleting: () => void;
  onDelete: () => void;
  onCancelDeleting: () => void;
};

export function PullupSetItem({
  set,
  index,
  isEditing,
  editedReps,
  editError,
  isConfirmingDelete,
  deleteError,
  isBusy,
  isUpdating,
  isDeleting,
  onStartEditing,
  onEditedRepsChange,
  onUpdate,
  onCancelEditing,
  onStartDeleting,
  onDelete,
  onCancelDeleting,
}: PullupSetItemProps) {
  return (
    <li className="rounded-xl border border-zinc-800 px-4 py-3">
      {isEditing ? (
        <form onSubmit={onUpdate} className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-400">
              {index + 1}
            </span>

            <label htmlFor={`edit-reps-${set._id}`} className="flex-1 text-sm text-zinc-300">
              Повторений
            </label>

            <input
              id={`edit-reps-${set._id}`}
              type="number"
              min={1}
              step={1}
              required
              value={editedReps}
              onChange={(event) => onEditedRepsChange(event.target.value)}
              disabled={isBusy}
              aria-invalid={Boolean(editError)}
              aria-describedby={editError ? `edit-error-${set._id}` : undefined}
              className="h-11 w-20 rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-base text-zinc-100 outline-none focus:border-lime-300 disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="submit"
              disabled={isBusy}
              className="min-h-11 rounded-lg bg-lime-300 px-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating ? 'Сохраняем...' : 'Сохранить'}
            </button>

            <button
              type="button"
              onClick={onCancelEditing}
              disabled={isBusy}
              className="min-h-11 rounded-lg border border-zinc-700 px-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Отмена
            </button>
          </div>

          {editError && (
            <p id={`edit-error-${set._id}`} role="alert" className="text-sm text-red-300">
              {editError}
            </p>
          )}
        </form>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-400">
            {index + 1}
          </span>

          <div className="flex flex-1 items-baseline gap-2">
            <span className="text-xl font-bold text-zinc-100 tabular-nums">{set.reps}</span>
            <span className="text-xs text-zinc-400">повт.</span>
          </div>

          <time dateTime={set.performedAt} className="shrink-0 text-xs text-zinc-500 tabular-nums">
            {new Date(set.performedAt).toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </time>

          <button
            type="button"
            onClick={onStartEditing}
            disabled={isBusy}
            className="min-h-11 shrink-0 rounded-lg px-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 focus-visible:outline-2 focus-visible:outline-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Изменить
          </button>

          <button
            type="button"
            onClick={onStartDeleting}
            disabled={isBusy}
            className="min-h-11 rounded-lg px-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Удалить
          </button>

          {isConfirmingDelete && (
            <div className="w-full space-y-2">
              <p className="text-sm text-zinc-300">Удалить этот подход?</p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isBusy}
                  className="min-h-11 rounded-lg bg-red-500 px-3 text-sm font-semibold text-white transition-colors hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? 'Удаляем...' : 'Да, удалить'}
                </button>

                <button
                  type="button"
                  onClick={onCancelDeleting}
                  disabled={isBusy}
                  className="min-h-11 rounded-lg px-3 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Отмена
                </button>
              </div>

              {deleteError && (
                <p role="alert" className="text-sm text-red-300">
                  {deleteError}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
