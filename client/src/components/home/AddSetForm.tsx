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
    <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-lg font-semibold">Добавить подход</h2>

      <form className="mt-4 space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label htmlFor="reps" className="block text-sm font-medium text-zinc-300">
            Количество повторений
          </label>

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
            className="h-12 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-sm text-zinc-100 transition-colors outline-none focus:border-lime-300 disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={isBusy}
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
  );
}
