import { NavLink } from 'react-router-dom';

type DesktopNavigationProps = {
  onLogout: () => void;
};

export function DesktopNavigation({ onLogout }: DesktopNavigationProps) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-zinc-800 bg-zinc-950 p-6 md:flex">
      <div className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-xl border border-zinc-700 bg-zinc-900">
          <span className="text-sm font-black text-lime-300">
            R<span className="text-zinc-200">.</span>
          </span>
        </div>

        <span className="text-base font-black tracking-[-0.04em] text-zinc-100">REP / TRACK</span>
      </div>

      <nav aria-label="Основная навигация" className="mt-10 grid gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-zinc-900 text-lime-300'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
            }`
          }
        >
          Обзор
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            `rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-zinc-900 text-lime-300'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
            }`
          }
        >
          История
        </NavLink>
        <NavLink
          to="/progress"
          className={({ isActive }) =>
            `rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-zinc-900 text-lime-300'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
            } `
          }
        >
          Прогресс
        </NavLink>
        <NavLink
          to="/records"
          className={({ isActive }) =>
            `rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-zinc-900 text-lime-300'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
            } `
          }
        >
          Рекорды
        </NavLink>
      </nav>
      <button
        type="button"
        onClick={onLogout}
        className="mt-auto rounded-xl border border-zinc-800 px-4 py-3 text-left text-sm font-semibold text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
      >
        Выйти
      </button>
    </aside>
  );
}
