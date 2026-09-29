import { NavLink } from 'react-router-dom';

export function MobileNavigation() {
  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-4 bottom-4 z-50 grid grid-cols-4 gap-1 rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-lg md:hidden"
    >
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `grid min-h-12 place-items-center rounded-xl text-xs font-medium transition-colors ${
            isActive
              ? 'bg-lime-300/10 text-lime-300'
              : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
          }`
        }
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9v12h14V9" />
          <path d="M9 21v-8h6v8" />
        </svg>
        <span className="sr-only">Главная</span>
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          `grid min-h-12 place-items-center rounded-xl text-xs font-medium transition-colors ${
            isActive
              ? 'bg-lime-300/10 text-lime-300'
              : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
          }`
        }
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="M3 11a9 9 0 1 1 2.6 7.4" />
          <path d="M3 4v7h7" />
          <path d="M12 7v5l3 2" />
        </svg>
        <span className="sr-only">История</span>
      </NavLink>

      <NavLink
        to="/progress"
        className={({ isActive }) =>
          `grid min-h-12 place-items-center rounded-xl text-xs font-medium transition-colors ${
            isActive
              ? 'bg-lime-300/10 text-lime-300'
              : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
          }`
        }
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="M3 3v18h18" />
          <path d="m7 14 4-4 4 3 6-8" />
          <path d="M16 5h5v5" />
        </svg>
        <span className="sr-only">Прогресс</span>
        <span className="sr-only">Рекорды</span>
      </NavLink>

      <NavLink
        to="/records"
        className={({ isActive }) =>
          `grid min-h-12 place-items-center rounded-xl text-xs font-medium transition-colors ${
            isActive
              ? 'bg-lime-300/10 text-lime-300'
              : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
          }`
        }
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
        >
          <path d="M8 3h8v6a4 4 0 0 1-8 0V3Z" />
          <path d="M8 5H4v2a4 4 0 0 0 4 4" />
          <path d="M16 5h4v2a4 4 0 0 1-4 4" />
          <path d="M12 13v5" />
          <path d="M8 21v-3h8v3" />
          <path d="M6 21h12" />
        </svg>
        <span className="sr-only">Рекорды</span>
      </NavLink>
    </nav>
  );
}
