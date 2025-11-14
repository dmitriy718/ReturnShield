import posthog from 'posthog-js'

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://analytics.returnshield.app'

export const isPosthogEnabled = Boolean(POSTHOG_KEY)

if (isPosthogEnabled && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageleave: true,
    autocapture: true,
    capture_pageview: false,
    disable_session_recording: false,
  })
}

export function capturePageView(path: string) {
  if (isPosthogEnabled) {
    posthog.capture('$pageview', { path })
  }
}

export function captureEvent(event: string, properties?: Record<string, unknown>) {
  if (isPosthogEnabled) {
    posthog.capture(event, properties)
  }
}

export function identifyPosthogUser(distinctId: string, properties?: Record<string, unknown>) {
  if (isPosthogEnabled) {
    posthog.identify(distinctId, properties)
  }
}

export function resetPosthogUser() {
  if (isPosthogEnabled) {
    posthog.reset()
  }
}

