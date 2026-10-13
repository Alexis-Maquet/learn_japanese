import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from '@/App.tsx'
import { logger } from '@/utils/logger'

// Safari iOS ignore user-scalable=no : on bloque le zoom au pincement via les événements gesture
document.addEventListener('gesturestart', e => e.preventDefault());

logger.info('app', 'Application démarrée', { version: import.meta.env.VITE_APP_VERSION ?? 'dev' });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
