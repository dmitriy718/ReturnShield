import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiFetch, ApiError } from '../services/api'
import { useAuth } from '../providers/AuthProvider'
import './CheckoutSuccessPage.css'

export function CheckoutSuccessPage() {
  const { token, refreshUser } = useAuth()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Confirming your subscription…')
  const [plan, setPlan] = useState<'launch' | 'scale' | 'elite' | null>(null)

  const planDescriptions = useMemo(
    () => ({
      launch: 'Launch unlocks live ROI dashboards and policy playbooks.',
      scale: 'Scale activates Exchange Autopilot and VIP Resolution Hub.',
      elite: 'Elite adds concierge strategy sessions and custom automations.',
    }),
    [],
  )

  useEffect(() => {
    const planParam = (searchParams.get('plan') || '').toLowerCase()
    if (planParam === 'launch' || planParam === 'scale' || planParam === 'elite') {
      setPlan(planParam)
    } else {
      setStatus('error')
      setMessage('We could not determine which plan was purchased. Please contact support.')
      return
    }

    if (!token) {
      setStatus('error')
      setMessage('Please sign back in to complete activation.')
      return
    }

    const activate = async () => {
      try {
        await apiFetch('/billing/activate/', {
          method: 'POST',
          body: JSON.stringify({ plan: planParam }),
          token,
        })
        await refreshUser()
        setStatus('success')
        setMessage('Subscription confirmed! Live data is now unlocked inside your dashboard.')
      } catch (error) {
        const detail =
          error instanceof ApiError
            ? error.detail ?? error.message
            : 'Activation did not complete. Please retry or contact support.'
        setStatus('error')
        setMessage(detail)
      }
    }

    void activate()
  }, [refreshUser, searchParams, token])

  return (
    <div className="checkout-success">
      <div className="success-card">
        <span className={`success-icon ${status}`} aria-hidden="true">
          {status === 'success' ? '✓' : status === 'error' ? '!' : '…'}
        </span>
        <h2>{status === 'success' ? 'Subscription confirmed' : status === 'error' ? 'Activation issue' : 'Just a moment…'}</h2>
        <p>{message}</p>
        {status === 'success' && plan ? <p className="plan-summary">{planDescriptions[plan]}</p> : null}
        <div className="success-actions">
          <Link to="/" className="btn-primary">
            View dashboard
          </Link>
          <Link to="/automation" className="btn-secondary">
            Launch automation
          </Link>
        </div>
        {status === 'error' ? (
          <p className="success-support">
            Need help? Email{' '}
            <a href="mailto:hello@returnshield.app?subject=Checkout%20activation">hello@returnshield.app</a> and we’ll
            get you live right away.
          </p>
        ) : null}
      </div>
    </div>
  )
}

