import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import OnboardingPage from '@/pages/OnboardingPage'
import AuthPage from '@/pages/AuthPage'
import FeedPage from '@/pages/FeedPage'
import FavorisPage from '@/pages/FavorisPage'
import ProfilPage from '@/pages/ProfilPage'
import RestaurantDetailPage from '@/pages/RestaurantDetailPage'
import AppShell from '@/components/shared/AppShell'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext()

  if (isLoading) return null // AppShell handles skeleton while loading

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected routes inside the app shell */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/feed" replace />} />
        <Route path="feed" element={<FeedPage />} />
        <Route path="favoris" element={<FavorisPage />} />
        <Route path="profil" element={<ProfilPage />} />
      </Route>

      {/* Restaurant detail — full screen overlay */}
      <Route
        path="/restaurant/:id"
        element={
          <ProtectedRoute>
            <RestaurantDetailPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  )
}
