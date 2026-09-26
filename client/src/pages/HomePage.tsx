import { useState, type FormEvent } from 'react';

export function HomePage() {
  const [reps, setReps] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
        <p className="mt-3 text-4xl font-bold text-lime-300">3 дня</p>
        <p className="mt-2 text-sm text-zinc-400">Дни подряд с записанными подходами</p>
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
