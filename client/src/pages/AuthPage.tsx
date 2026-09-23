import { useState, type FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';
type AuthResponse = {
  message?: string;
  token?: string;
  error?: string;
};

export function AuthPage() {
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';

    const requestBody =
      authMode === 'register'
        ? {
            name: name.trim(),
            email,
            password,
          }
        : {
            email,
            password,
          };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data: AuthResponse = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error ?? 'Не удалось выполнить запрос');
        return;
      }

      if (authMode === 'register') {
        setSuccessMessage('Аккаунт создан. Теперь войдите.');
        setAuthMode('login');
        setName('');
        setPassword('');
      } else {
        if (!data.token) {
          setErrorMessage('Сервер не вернул токен');
          return;
        }

        localStorage.setItem('pullupTrackerToken', data.token);
        setPassword('');

        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Network error', err);
      setErrorMessage('Не удалось связаться с сервером');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 px-10 py-6 text-zinc-100">
      <header className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900">
          <span className="text-sm font-black text-lime-300">
            R<span className="text-zinc-200">.</span>
          </span>
        </div>

        <span className="text-base font-black tracking-[-0.04em] text-zinc-100">REP / TRACK</span>
      </header>
      <main className="flex flex-1 items-center py-8">
        <section className="mx-auto w-full max-w-md">
          <div className="mb-4">
            <p className="py-4 text-xs font-bold tracking-widest text-lime-300">
              {' '}
              НАЧНЁМ ТРЕНИРОВКУ{' '}
            </p>
            <h1 className="text-3xl font-bold">
              {authMode === 'register' ? ' Создать аккаунт' : 'Войти в аккаунт'}
            </h1>
            <p className="py-3 text-zinc-400">
              {authMode === 'register'
                ? 'Сохраняйте подходы и наблюдайте, как растёт результат.'
                : 'Войдите, чтобы продолжить отслеживать тренировки.'}
            </p>
          </div>
          <div className="relative grid grid-cols-2 rounded-xl border border-zinc-800 bg-zinc-900 p-1">
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-zinc-800 shadow-sm transition-transform duration-300 ease-out ${
                authMode === 'login' ? 'translate-x-full' : 'translate-x-0'
              }`}
            />

            <button
              type="button"
              aria-pressed={authMode === 'register'}
              onClick={() => setAuthMode('register')}
              className={`relative z-10 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                authMode === 'register' ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              Регистрация
            </button>

            <button
              type="button"
              aria-pressed={authMode === 'login'}
              onClick={() => setAuthMode('login')}
              className={`relative z-10 rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                authMode === 'login' ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              Войти
            </button>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {authMode === 'register' && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
                  Имя
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  minLength={2}
                  maxLength={40}
                  required
                  className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-100 transition-colors outline-none placeholder:text-zinc-600 focus:border-lime-300"
                />
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-100 transition-colors outline-none placeholder:text-zinc-600 focus:border-lime-300"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Введите пароль"
                autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                required
                className="h-12 w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm text-zinc-100 transition-colors outline-none placeholder:text-zinc-600 focus:border-lime-300"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-lime-300 px-4 text-sm font-bold text-zinc-950 transition-colors hover:bg-lime-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-300 active:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? 'Подождите...'
                : authMode === 'register'
                  ? 'Создать аккаунт'
                  : 'Войти в аккаунт'}
            </button>
            {errorMessage && (
              <p
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                {errorMessage}
              </p>
            )}
            {successMessage && (
              <p
                role="status"
                className="rounded-xl border border-lime-300/30 bg-lime-300/10 px-4 py-3 text-sm text-lime-300"
              >
                {successMessage}
              </p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}
