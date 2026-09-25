import { Outlet, useNavigate } from 'react-router-dom';
import { MobileNavigation } from './MobileNavigation';
import { DesktopNavigation } from './DesktopNavigation';

export function AppLayout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem('pullupTrackerToken');
    navigate('/auth', { replace: true });
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 md:ml-64">
      <DesktopNavigation onLogout={handleLogout} />
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 md:hidden">
        <p>REP / TRACK</p>
        <button type="button" onClick={handleLogout}>
          Выход
        </button>
      </header>
      <div className="pb-16 md:pb-0">
        <Outlet />
      </div>
      <MobileNavigation />
    </div>
  );
}
