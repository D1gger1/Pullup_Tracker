import { NavLink } from 'react-router-dom';

export function MobileNavigation() {
  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-zinc-800 bg-zinc-950 md:hidden"
    >
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `grid min-h-16 place-items-center text-xs font-medium transition-colors ${
            isActive ? 'text-lime-300' : 'text-zinc-500 hover:text-zinc-200'
          }`
        }
      >
        Главная
      </NavLink>
      <NavLink
        to="/history"
        className={({ isActive }) =>
          `grid min-h-16 place-items-center text-xs font-medium transition-colors ${
            isActive ? 'text-lime-300' : 'text-zinc-500 hover:text-zinc-200'
          }`
        }
      >
        История
      </NavLink>
      <NavLink
        to="/progress"
        className={({ isActive }) =>
          `grid min-h-16 place-items-center text-xs font-medium transition-colors ${
            isActive ? 'text-lime-300' : 'text-zinc-500 hover:text-zinc-200'
          }`
        }
      >
        Прогресс
      </NavLink>
      <NavLink
        to="/records"
        className={({ isActive }) =>
          `grid min-h-16 place-items-center text-xs font-medium transition-colors ${
            isActive ? 'text-lime-300' : 'text-zinc-500 hover:text-zinc-200'
          }`
        }
      >
        Рекорды
      </NavLink>
    </nav>
  );
}
