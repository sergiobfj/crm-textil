import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/tokens.css'
import './styles/globals.css'
import './styles/footer.css'
import './styles/navigation.css'
import './styles/dashboard.css'
import './styles/dashboard-interactions.css'
import './styles/dashboard-modules.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>,
)
