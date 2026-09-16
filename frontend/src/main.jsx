import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/tokens.css'
import './styles/globals.css'
import './styles/footer.css'
import './styles/navigation.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>,
)
