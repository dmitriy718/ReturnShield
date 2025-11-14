import './AlertCenter.css'
import type { AlertPayload } from '../../providers/AlertProvider'

type Props = {
  alerts: AlertPayload[]
  onDismiss: (id: string) => void
}

export function AlertCenter({ alerts, onDismiss }: Props) {
  if (alerts.length === 0) {
    return null
  }

  return (
    <div className="alert-center">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert-card ${alert.variant}`}>
          <div className="alert-content">
            <strong>{alert.title}</strong>
            {alert.message ? <p>{alert.message}</p> : null}
          </div>
          <button type="button" className="alert-dismiss" onClick={() => onDismiss(alert.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

