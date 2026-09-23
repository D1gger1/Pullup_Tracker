import { useNavigate } from "react-router"

export function HomePage() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem('pullupTrackerToken');
        navigate('/auth', { replace: true });
    }

    return (
        <main className="min-h-screen bg-zinc-950 p-6 text-zinc-100">
            <h1 className="text-3xl fonr-bold text-lime-300">
                Главная страница
            </h1>

            <p className="mt-3 text-zinc-400">
                Здесь будет трекер подтягиваний.
            </p>

            <button type="button" onClick={handleLogout}> Выход</button>
        </main>
    )
}