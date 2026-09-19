import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage'
import { HomePage } from './pages/HomePage'
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path='/'
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path='/auth' element={<AuthPage />} />

      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )

}

export default App