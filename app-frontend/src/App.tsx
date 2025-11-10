import './App.css'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './providers/AuthProvider'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { AutomationPage } from './pages/AutomationPage'
import { BillingPage } from './pages/BillingPage'
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AppLayout } from './components/layout/AppLayout'
import { LoadingScreen } from './components/ui/LoadingScreen'

function ProtectedRoute() {
  const { token, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingScreen message="Preparing your dashboard..." />
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

function GuestRoute() {
  const { token, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingScreen message="Loading account..." />
  }

  if (token) {
    const redirectPath =
      (location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname ?? '/'
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/automation" element={<AutomationPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/billing/success" element={<CheckoutSuccessPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
