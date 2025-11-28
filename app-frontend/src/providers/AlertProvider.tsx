import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AlertCenter } from '../components/ui/AlertCenter'
import { API_ERROR_EVENT, type ApiErrorEventDetail } from '../lib/events'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export type AlertPayload = {
  id: string
  title: string
  message?: string
  variant: AlertVariant
}

type AlertInput = Omit<AlertPayload, 'id'>

type AlertContextValue = {
  alerts: AlertPayload[]
  pushAlert: (alert: AlertInput) => void
  dismissAlert: (id: string) => void
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined)

const ALERT_TIMEOUT_MS = 8000

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertPayload[]>([])
  const timeoutRefs = useRef<Record<string, number>>({})

  const dismissAlert = useCallback((id: string) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id))
    const timeoutId = timeoutRefs.current[id]
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      delete timeoutRefs.current[id]
    }
  }, [])

  const pushAlert = useCallback(
    (alert: AlertInput) => {
      const id = crypto.randomUUID ? crypto.randomUUID() : `alert-${Date.now()}`
      setAlerts((current) => [...current, { ...alert, id }])

      timeoutRefs.current[id] = window.setTimeout(() => {
        dismissAlert(id)
      }, ALERT_TIMEOUT_MS)
    },
    [dismissAlert],
  )

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<ApiErrorEventDetail>
      pushAlert({
        title: `API error ${customEvent.detail.status}`,
        message: customEvent.detail.message ?? 'Unexpected error. Please retry.',
        variant: 'error',
      })
    }

    window.addEventListener(API_ERROR_EVENT, handler as EventListener)
    return () => {
      window.removeEventListener(API_ERROR_EVENT, handler as EventListener)
    }
  }, [pushAlert])

  const value = useMemo(
    () => ({
      alerts,
      pushAlert,
      dismissAlert,
    }),
    [alerts, pushAlert, dismissAlert],
  )

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertCenter alerts={alerts} onDismiss={dismissAlert} />
    </AlertContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAlerts() {
  const ctx = useContext(AlertContext)
  if (!ctx) {
    throw new Error('useAlerts must be used within an AlertProvider')
  }
  return ctx
}

