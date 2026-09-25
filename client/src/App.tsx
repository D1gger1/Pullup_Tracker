import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { ProgressPage } from './pages/ProgressPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RecordsPage } from './pages/RecordsPage';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/records"
        element={
          <ProtectedRoute>
            <RecordsPage />
          </ProtectedRoute>
        }
      />

      <Route path="/auth" element={<AuthPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
