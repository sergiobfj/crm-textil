import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'

export function App() {
  const path = window.location.pathname
  if (path === '/login') return <LoginPage />
  return <LandingPage />
}
