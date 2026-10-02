import type { FormEvent } from 'react';
type AddSetFormProps = {
  reps: string;
  isBusy: boolean;
  isSubmitting: boolean;
  errorMessage: string;
  successMessage: string;
  onRepsChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AddSetForm({
  reps,
  isBusy,
  isSubmitting,
  errorMessage,
  successMessage,
  onRepsChange,
  onSubmit,
}: AddSetFormProps) {
  return (
    <section className="w-full rounded-2xl border border-zinc-800/60 bg-zinc-900 p-5">
      <p className="text-[10px] font-extrabold tracking-[0.18em] text-lime-300 uppercase">
        Быстрый подход
      </p>
      <h2 className="text-zinc-10 mt-2 text-lg font-bold">Сколько повторений?</h2>

      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <div className="py-6">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Уменьшить количество повторений"
              disabled={isBusy || Number(reps) <= 1}
              onClick={() => onRepsChange(String(Number(reps) - 1))}
              className="grid size-11 shrink-0 place-items-center rounded-full border border-zinc-800 bg-zinc-950 text-xl text-zinc-300 transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>

            <input
              type="number"
              id="reps"
              name="reps"
              value={reps}
              onChange={(event) => onRepsChange(event.target.value)}
              disabled={isBusy}
              min={1}
              step={1}
              required
              placeholder="0"
              className="h-24 w-28 min-w-0 [appearance:textfield] appearance-none rounded-xl bg-transparent text-center text-7xl font-black tracking-tight text-zinc-100 tabular-nums outline-none placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-lime-300 disabled:opacity-60 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />

            <button
              type="button"
              aria-label="Увеличить количество повторений"
              disabled={isBusy}
              onClick={() => onRepsChange(String(Number(reps) + 1))}
              className="grid size-11 shrink-0 place-items-center rounded-full border border-zinc-800 bg-zinc-950 text-xl text-zinc-300 transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-lime-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              +
            </button>
          </div>

          <label
            htmlFor="reps"
            className="mt-2 block text-center text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase"
          >
            Повторений
          </label>
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className="h-12 w-full rounded-xl bg-lime-300 px-4 text-sm font-bold text-zinc-950 transition-colors hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 active:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Добавляем...' : 'Добавить подход +'}
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
  );
}
