import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import './index.css'
import App from './App.tsx'

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

function AnalyticsBootstrap() {
  useEffect(() => {
    posthog.capture('$pageview')
  }, [])

  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AnalyticsBootstrap />
  </StrictMode>,
)
