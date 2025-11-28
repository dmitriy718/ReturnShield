/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './providers/AuthProvider.tsx'
import { capturePageView, isPosthogEnabled } from './lib/posthog.ts'
import { AlertProvider } from './providers/AlertProvider'

function PosthogRouteTracker() {
  const location = useLocation()

  useEffect(() => {
    if (isPosthogEnabled) {
      capturePageView(location.pathname)
    }
  }, [location])

  return null
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PosthogRouteTracker />
      <AlertProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AlertProvider>
    </BrowserRouter>
  </StrictMode>,
)
