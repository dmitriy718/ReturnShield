import { useEffect, useMemo, useState } from 'react'
import { apiFetch, ApiError } from '../services/api'
import type {
  ExchangeCoachPayload,
  OnboardingStage,
  ReturnlessInsights,
  VipQueuePayload,
} from '../types'
import { useAuth } from '../providers/AuthProvider'
import './DashboardPage.css'

type DashboardState = {
  insights: ReturnlessInsights | null
  coach: ExchangeCoachPayload | null
  vip: VipQueuePayload | null
  loading: boolean
  error: string | null
}

const INITIAL_STATE: DashboardState = {
  insights: null,
  coach: null,
  vip: null,
  loading: true,
  error: null,
}

const onboardingStages: { value: OnboardingStage; label: string }[] = [
  { value: 'connect', label: 'Connect Shopify' },
  { value: 'sync', label: 'Sync returns & billing' },
  { value: 'insights', label: 'Review insights' },
  { value: 'complete', label: 'Automation live' },
]

export function DashboardPage() {
  const { token, user, updateOnboarding, refreshUser } = useAuth()
  const [state, setState] = useState<DashboardState>(INITIAL_STATE)
  const [updatingStage, setUpdatingStage] = useState(false)

  const loadDashboard = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const [insights, coach, vip] = await Promise.all([
        apiFetch<ReturnlessInsights>('/returns/returnless-insights/'),
        apiFetch<ExchangeCoachPayload>('/returns/exchange-coach/'),
        apiFetch<VipQueuePayload>('/returns/vip-resolution/'),
      ])

      setState({
        insights,
        coach,
        vip,
        loading: false,
        error: null,
      })
    } catch (error) {
      const message =
        error instanceof ApiError ? error.detail ?? error.message : 'Unable to load dashboard data.'
      setState((prev) => ({ ...prev, loading: false, error: message }))
    }
  }

  useEffect(() => {
    void loadDashboard()
  }, [])

  const summaryCards = useMemo(() => {
    const insights = state.insights
    if (!insights) {
      return []
    }
    return [
      {
        label: 'Annualized margin recovery',
        value: formatCurrency(insights.summary.annualized_margin_recovery),
        detail: 'Automated returnless approvals offset reverse logistics costs.',
      },
      {
        label: 'Landfill diverted',
        value: `${formatNumber(insights.summary.landfill_lbs_prevented)} lbs`,
        detail: 'Keep-it policies and partner donations redirected waste.',
      },
      {
        label: 'Ops hours returned',
        value: `${formatNumber(insights.summary.manual_hours_reduced, 1)} hrs`,
        detail: 'Automation eliminated manual approval queues this month.',
      },
    ]
  }, [state.insights])

  const handleOnboardingChange = async (stage: OnboardingStage) => {
    if (!token) {
      return
    }
    setUpdatingStage(true)
    try {
      await updateOnboarding(stage)
      await refreshUser()
    } catch (error) {
      console.error('Failed to update onboarding stage', error)
    } finally {
      setUpdatingStage(false)
    }
  }

  return (
    <div className="dashboard">
      {state.error && (
        <div className="dashboard-error">
          <p>{state.error}</p>
          <button type="button" onClick={loadDashboard}>
            Retry
          </button>
        </div>
      )}

      <section className="dashboard-summary">
        {summaryCards.map((card) => (
          <article key={card.label}>
            <span className="summary-label">{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <header>
            <h2>Returnless intelligence</h2>
            <button type="button" onClick={loadDashboard} disabled={state.loading}>
              Refresh
            </button>
          </header>
          <p className="panel-subtitle">
            Top SKUs flagged for keep-it credits and donation routing. Use this to update policies weekly.
          </p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Returns (30d)</th>
                  <th>Margin at risk</th>
                  <th>Recommended actions</th>
                </tr>
              </thead>
              <tbody>
                {state.insights?.candidates.map((item) => (
                  <tr key={item.sku}>
                    <td>
                      <strong>{item.product_name}</strong>
                      <span className="table-muted">{item.sku}</span>
                    </td>
                    <td>{formatNumber(item.return_volume_30d)}</td>
                    <td>{formatCurrency(item.estimated_margin_recaptured)}</td>
                    <td>
                      <ul>
                        {item.recommended_actions.map((action) => (
                          <li key={action}>{action}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel">
          <header>
            <h2>AI Exchange Coach queue</h2>
          </header>
          <p className="panel-subtitle">
            Highest leverage exchange plays with projected uplift. Greenlight the ones that match your objectives.
          </p>
          <div className="coach-list">
            {state.coach?.actions.map((action) => (
              <div className="coach-card" key={`${action.sku}-${action.headline}`}>
                <div className="coach-card-header">
                  <span className="badge">{action.sku}</span>
                  <div>
                    <h3>{action.headline}</h3>
                    <p>{action.description}</p>
                  </div>
                </div>
                <dl>
                  <div>
                    <dt>Margin at risk</dt>
                    <dd>{formatCurrency(action.metrics.margin_at_risk)}</dd>
                  </div>
                  <div>
                    <dt>Exchange uplift</dt>
                    <dd>{formatCurrency(action.estimated_monthly_uplift)}</dd>
                  </div>
                  <div>
                    <dt>Returns (30d)</dt>
                    <dd>{formatNumber(action.metrics.return_volume_30d)}</dd>
                  </div>
                </dl>
                <ul className="coach-actions">
                  {action.recommended_play.map((play) => (
                    <li key={play}>{play}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <header>
            <h2>VIP resolution queue</h2>
          </header>
          <p className="panel-subtitle">Prioritise these loyalty-rich tickets to keep high-value revenue in play.</p>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Order value</th>
                  <th>Churn risk</th>
                  <th>Recommended action</th>
                </tr>
              </thead>
              <tbody>
                {state.vip?.queue.map((entry) => (
                  <tr key={entry.ticket_id}>
                    <td>
                      <strong>{entry.customer}</strong>
                      <span className="table-muted">{entry.loyalty_segment}</span>
                    </td>
                    <td>{formatCurrency(entry.order_value)}</td>
                    <td>{(entry.predicted_churn_risk / 100).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 1 })}</td>
                    <td>{entry.recommended_action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel onboarding-panel">
          <header>
            <h2>Onboarding progress</h2>
          </header>
          <p className="panel-subtitle">
            Track which stage your team is in and update once each workflow is live.
          </p>
          <div className="onboarding-list">
            {onboardingStages.map((stage) => (
              <button
                key={stage.value}
                type="button"
                className={stage.value === user?.onboarding_stage ? 'stage-button active' : 'stage-button'}
                onClick={() => handleOnboardingChange(stage.value)}
                disabled={updatingStage}
              >
                <span>{stage.label}</span>
                {stage.value === user?.onboarding_stage && <span className="stage-tag">Current</span>}
              </button>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function formatNumber(value: number, digits = 0) {
  return value.toLocaleString('en-US', { maximumFractionDigits: digits })
}

