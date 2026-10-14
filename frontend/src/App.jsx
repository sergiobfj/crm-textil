import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'

export function App() {
  const path = window.location.pathname
  if (path === '/login') return <LoginPage />
  if (path === '/dashboard') return <DashboardPage />
  return <LandingPage />
}
