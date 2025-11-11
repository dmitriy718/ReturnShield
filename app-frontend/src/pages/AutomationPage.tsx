import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { apiFetch, ApiError } from '../services/api'
import type { ExchangePlaybookResponse } from '../types'
import { useAuth } from '../providers/AuthProvider'
import './AutomationPage.css'

type AutomationForm = {
  return_rate: number | ''
  exchange_rate: number | ''
  average_order_value: number | ''
  logistic_cost_per_return: number | ''
  top_return_reason: string
}

const DEFAULT_FORM: AutomationForm = {
  return_rate: 24,
  exchange_rate: 8,
  average_order_value: 98,
  logistic_cost_per_return: 18,
  top_return_reason: 'Size / fit mismatch',
}

const FORM_STORAGE_PREFIX = 'returnshield_automation_form'

function sanitizeFormPayload(payload: Partial<AutomationForm>): AutomationForm {
  return {
    return_rate:
      typeof payload.return_rate === 'number' && Number.isFinite(payload.return_rate)
        ? payload.return_rate
        : DEFAULT_FORM.return_rate,
    exchange_rate:
      typeof payload.exchange_rate === 'number' && Number.isFinite(payload.exchange_rate)
        ? payload.exchange_rate
        : DEFAULT_FORM.exchange_rate,
    average_order_value:
      typeof payload.average_order_value === 'number' && Number.isFinite(payload.average_order_value)
        ? payload.average_order_value
        : DEFAULT_FORM.average_order_value,
    logistic_cost_per_return:
      typeof payload.logistic_cost_per_return === 'number' && Number.isFinite(payload.logistic_cost_per_return)
        ? payload.logistic_cost_per_return
        : DEFAULT_FORM.logistic_cost_per_return,
    top_return_reason: payload.top_return_reason ?? DEFAULT_FORM.top_return_reason,
  }
}

export function AutomationPage() {
  const { token, user } = useAuth()

  const [form, setForm] = useState(DEFAULT_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [playbook, setPlaybook] = useState<ExchangePlaybookResponse | null>(null)
  const storageKey = user ? `${FORM_STORAGE_PREFIX}_${user.id}` : FORM_STORAGE_PREFIX

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AutomationForm>
        setForm(sanitizeFormPayload(parsed))
      }
    } catch (storageError) {
      console.warn('Unable to load saved automation defaults', storageError)
    }
  }, [storageKey])

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(form))
    } catch (storageError) {
      console.warn('Unable to persist automation defaults', storageError)
    }
  }, [form, storageKey])

  const handleChange = (field: keyof AutomationForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        field === 'top_return_reason'
          ? value
          : value === ''
            ? ''
            : Number(value),
    }))
  }

  const handleResetForm = () => {
    setForm(DEFAULT_FORM)
    try {
      localStorage.removeItem(storageKey)
    } catch (storageError) {
      console.warn('Unable to clear automation defaults', storageError)
    }
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!token) {
      setError('You must be signed in to run the automation playbook.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const submission = {
        return_rate: Number(form.return_rate),
        exchange_rate: Number(form.exchange_rate),
        average_order_value: Number(form.average_order_value),
        logistic_cost_per_return: Number(form.logistic_cost_per_return),
        top_return_reason: form.top_return_reason,
      }

      const payload = await apiFetch<ExchangePlaybookResponse>('/returns/exchange-playbook/', {
        method: 'POST',
        body: JSON.stringify(submission),
        token,
      })
      setPlaybook(payload)
    } catch (err) {
      setPlaybook(null)
      if (err instanceof ApiError) {
        setError(err.detail ?? err.message)
      } else {
        setError('Unable to generate playbook. Please try again shortly.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="automation-page">
      <section className="automation-panel">
        <header>
          <h2>Generate an exchange-first playbook</h2>
          <p>
            Plug in your latest metrics and ReturnShield recommends the top three moves to capture revenue and
            reduce friction.
          </p>
        </header>

        <form className="automation-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              <span>Refund rate (last 30 days)</span>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={form.return_rate}
                onChange={(event) => handleChange('return_rate', event.target.value)}
                required
              />
              <small>Percent of orders that resulted in a refund.</small>
            </label>

            <label>
              <span>Exchange rate</span>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={form.exchange_rate}
                onChange={(event) => handleChange('exchange_rate', event.target.value)}
                required
              />
              <small>Percent of orders that currently convert to an exchange.</small>
            </label>

            <label>
              <span>Average order value (USD)</span>
              <input
                type="number"
                step="1"
                min="0"
                value={form.average_order_value}
                onChange={(event) => handleChange('average_order_value', event.target.value)}
                required
              />
            </label>

            <label>
              <span>Logistics cost per return (USD)</span>
              <input
                type="number"
                step="1"
                min="0"
                value={form.logistic_cost_per_return}
                onChange={(event) => handleChange('logistic_cost_per_return', event.target.value)}
                required
              />
            </label>
          </div>

          <label>
            <span>Top return reason</span>
            <input
              type="text"
              value={form.top_return_reason}
              onChange={(event) => handleChange('top_return_reason', event.target.value)}
              placeholder="Fit, quality, late shipments…"
            />
          </label>

          {error && <p className="automation-error">{error}</p>}

          <button type="button" className="automation-reset" onClick={handleResetForm} disabled={submitting}>
            Reset to defaults
          </button>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Generating recommendations…' : 'Generate playbook'}
          </button>
        </form>
      </section>

      {playbook && (
        <section className="automation-results">
          <header>
            <h3>Recommended actions</h3>
            <p>Put these steps into motion to reduce refunds and improve exchange adoption.</p>
          </header>
          <div className="results-grid">
            {playbook.recommendations.map((rec) => (
              <article key={rec.title}>
                <h4>{rec.title}</h4>
                <p>{rec.description}</p>
                <span className="impact">{rec.expected_impact}</span>
                <ul>
                  {rec.automation_actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </article>
            ))}
            {playbook.quick_wins?.map((rec) => (
              <article key={rec.title} className="quick-win">
                <h4>{rec.title}</h4>
                <p>{rec.description}</p>
                <span className="impact">{rec.expected_impact}</span>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

