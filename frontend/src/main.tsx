import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import posthog from 'posthog-js'
import './index.css'
import App from './App.tsx'
import ExchangeAutopilotPage from './pages/ExchangeAutopilot.tsx'

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com'

if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageleave: true,
    capture_pageview: true,
    autocapture: true,
    disable_session_recording: false,
  })
}

function RoutedApp() {
  const location = useLocation()

  useEffect(() => {
    if (POSTHOG_KEY) {
      posthog.capture('$pageview', { path: location.pathname })
    }
  }, [location])

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/exchange-automation" element={<ExchangeAutopilotPage />} />
    </Routes>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  </StrictMode>,
)
