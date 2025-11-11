import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { MutableRefObject, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
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

type WalkthroughKey = 'summary' | 'returnless' | 'coach' | 'vip' | 'plan'

type WalkthroughStep = {
  key: WalkthroughKey
  title: string
  description: string
  helper?: string
  ctaLabel?: string
}

type GateMode = 'open' | 'blurred' | 'preview'

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    key: 'summary',
    title: 'Start with the ROI snapshot',
    description:
      'These cards show how much margin you can reclaim, landfill you can divert, and time you return to your CX team.',
    helper: 'Review this every Monday—it updates automatically.',
    ctaLabel: 'Reveal ROI snapshot',
  },
  {
    key: 'returnless',
    title: 'Inspect returnless intelligence',
    description:
      'This table ranks SKUs by refund risk so you can launch keep-it credits or donations where they save the most margin.',
    helper: 'Use these insights to update policies or notify fulfillment partners.',
    ctaLabel: 'Reveal returnless intelligence',
  },
  {
    key: 'coach',
    title: 'Queue up AI Exchange Coach plays',
    description:
      'Exchange Coach suggests the next best plays to flip refunds into revenue—each card explains why it matters.',
    helper: 'Approve the highest impact plays first and monitor uplift.',
    ctaLabel: 'Reveal AI Exchange Coach',
  },
  {
    key: 'vip',
    title: 'Prioritise VIP resolution tickets',
    description:
      'See your highest-value customers and recommended concierge actions so you keep loyalty intact.',
    helper: 'Handle these every morning to protect repeat revenue.',
    ctaLabel: 'Reveal VIP queue',
  },
  {
    key: 'plan',
    title: 'Pick the package that unlocks live data',
    description:
      'Choose Launch, Scale, or Elite to unblur live metrics and automate the plays you just previewed.',
    helper: 'You can upgrade or downgrade any time inside billing.',
    ctaLabel: 'Choose my package',
  },
]

const ALL_WALKTHROUGH_KEYS: WalkthroughKey[] = WALKTHROUGH_STEPS.map((step) => step.key)

export function DashboardPage() {
  const navigate = useNavigate()
  const { token, user, updateOnboarding, refreshUser, completeWalkthrough } = useAuth()
  const [state, setState] = useState<DashboardState>(INITIAL_STATE)
  const [updatingStage, setUpdatingStage] = useState(false)
  const [isWalkthroughActive, setIsWalkthroughActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [revealedSections, setRevealedSections] = useState<WalkthroughKey[]>([])

  const summaryRef = useRef<HTMLDivElement | null>(null)
  const returnlessRef = useRef<HTMLDivElement | null>(null)
  const coachRef = useRef<HTMLDivElement | null>(null)
  const vipRef = useRef<HTMLDivElement | null>(null)
  const planRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    if (!user) {
      setIsWalkthroughActive(false)
      setRevealedSections([])
      return
    }
    const isTrial = user.subscription_status === 'trial'
    if (isTrial && !user.has_completed_walkthrough) {
      setIsWalkthroughActive(true)
      setCurrentStepIndex(0)
      setRevealedSections([])
    } else {
      setIsWalkthroughActive(false)
      setRevealedSections(ALL_WALKTHROUGH_KEYS)
    }
  }, [user])

  const hasShopifyStore = user?.has_shopify_store ?? false
  const isTrial = user?.subscription_status === 'trial'
  const isPaid = !!user && user.subscription_status !== 'trial'
  const walkthroughComplete = user?.has_completed_walkthrough ?? false

  const startWalkthrough = useCallback(() => {
    if (!isTrial) {
      return
    }
    setIsWalkthroughActive(true)
    setCurrentStepIndex(0)
    setRevealedSections([])
    window.setTimeout(() => {
      summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }, [isTrial, summaryRef])

  const sectionRevealed = useCallback(
    (key: WalkthroughKey) => {
      if (!isTrial) {
        return true
      }
      if (walkthroughComplete) {
        return true
      }
      if (!isWalkthroughActive) {
        return revealedSections.includes(key)
      }
      return revealedSections.includes(key)
    },
    [isTrial, walkthroughComplete, isWalkthroughActive, revealedSections],
  )

  const getGateMode = useCallback(
    (key: WalkthroughKey): GateMode => {
      const revealed = sectionRevealed(key)
      if (!revealed) {
        return 'preview'
      }
      if (hasShopifyStore && !isPaid && key !== 'plan') {
        return 'blurred'
      }
      return 'open'
    },
    [sectionRevealed, hasShopifyStore, isPaid],
  )

  const handlePlanSelection = useCallback(() => {
    navigate('/billing')
  }, [navigate])

  const handleAdvanceWalkthrough = useCallback(async () => {
    const currentStep = WALKTHROUGH_STEPS[currentStepIndex]
    const stepKey = currentStep.key
    setRevealedSections((prev) => (prev.includes(stepKey) ? prev : [...prev, stepKey]))

    if (stepKey === 'plan') {
      await completeWalkthrough(true)
      setIsWalkthroughActive(false)
      setRevealedSections(ALL_WALKTHROUGH_KEYS)
      handlePlanSelection()
      return
    }

    const nextIndex = Math.min(currentStepIndex + 1, WALKTHROUGH_STEPS.length - 1)
    setCurrentStepIndex(nextIndex)

    const nextStep = WALKTHROUGH_STEPS[nextIndex]
    const targetMap: Record<WalkthroughKey, MutableRefObject<HTMLDivElement | null>> = {
      summary: summaryRef,
      returnless: returnlessRef,
      coach: coachRef,
      vip: vipRef,
      plan: planRef,
    }

    const targetRef = targetMap[nextStep.key]
    window.setTimeout(() => {
      targetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 250)
  }, [completeWalkthrough, currentStepIndex, handlePlanSelection])

  const gateContext = useMemo(
    () => ({
      startWalkthrough,
      openBilling: handlePlanSelection,
      canStartTour: isTrial && !walkthroughComplete && !isWalkthroughActive,
      hasShopifyStore,
    }),
    [startWalkthrough, handlePlanSelection, isTrial, walkthroughComplete, isWalkthroughActive, hasShopifyStore],
  )

  const activeStep = WALKTHROUGH_STEPS[Math.min(currentStepIndex, WALKTHROUGH_STEPS.length - 1)]
  const summaryMode = getGateMode('summary')
  const returnlessMode = getGateMode('returnless')
  const coachMode = getGateMode('coach')
  const vipMode = getGateMode('vip')
  const planMode = getGateMode('plan')
  const summaryCopy = getGateCopy(summaryMode, 'summary', gateContext)
  const returnlessCopy = getGateCopy(returnlessMode, 'returnless', gateContext)
  const coachCopy = getGateCopy(coachMode, 'coach', gateContext)
  const vipCopy = getGateCopy(vipMode, 'vip', gateContext)
  const planCopy = getGateCopy(planMode, 'plan', gateContext)

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
      <WalkthroughWizard
        active={isWalkthroughActive}
        step={activeStep}
        stepIndex={currentStepIndex}
        totalSteps={WALKTHROUGH_STEPS.length}
        onAdvance={handleAdvanceWalkthrough}
        hasShopifyStore={hasShopifyStore}
      />
      {state.error && (
        <div className="dashboard-error">
          <p>{state.error}</p>
          <button type="button" onClick={loadDashboard}>
            Retry
          </button>
        </div>
      )}

      <GateWrapper
        as="section"
        mode={summaryMode}
        copy={summaryCopy}
        hideOverlay={isWalkthroughActive}
        containerClassName="dashboard-summary"
        contentRef={summaryRef}
      >
        {summaryCards.map((card) => (
          <article key={card.label}>
            <span className="summary-label">{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.detail}</p>
          </article>
        ))}
      </GateWrapper>

      <section className="dashboard-grid">
        <GateWrapper
          as="article"
          mode={returnlessMode}
          copy={returnlessCopy}
          hideOverlay={isWalkthroughActive}
          containerClassName="panel"
          contentRef={returnlessRef}
        >
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
        </GateWrapper>

        <GateWrapper
          as="article"
          mode={coachMode}
          copy={coachCopy}
          hideOverlay={isWalkthroughActive}
          containerClassName="panel"
          contentRef={coachRef}
        >
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
        </GateWrapper>

        <GateWrapper
          as="article"
          mode={vipMode}
          copy={vipCopy}
          hideOverlay={isWalkthroughActive}
          containerClassName="panel"
          contentRef={vipRef}
        >
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
        </GateWrapper>

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

        <GateWrapper
          as="article"
          mode={planMode}
          copy={planCopy}
          hideOverlay={isWalkthroughActive}
          containerClassName="panel plan-panel"
          contentRef={planRef}
        >
          <header>
            <h2>Unlock live automation</h2>
          </header>
          <p className="panel-subtitle">
            Launch removes the blur, Scale unlocks exchange automation, and Elite adds white-glove strategy support. Pick
            the tier that matches your returns volume.
          </p>
          <div className="plan-options">
            <div>
              <strong>Launch</strong>
              <p>ROI snapshot + policy playbooks. Perfect for testing ReturnShield baseline.</p>
            </div>
            <div>
              <strong>Scale</strong>
              <p>Exchange Autopilot + AI Coach automations. Built for teams defending serious volume.</p>
            </div>
            <div>
              <strong>Elite</strong>
              <p>Custom playbooks, concierge support, and quarterly revenue workshops.</p>
            </div>
          </div>
          <button type="button" className="plan-cta" onClick={handlePlanSelection}>
            Choose my package
          </button>
        </GateWrapper>
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

type GateCopyContext = {
  startWalkthrough: () => void
  openBilling: () => void
  canStartTour: boolean
  hasShopifyStore: boolean
}

type GateCopy = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

function getGateCopy(mode: GateMode, key: WalkthroughKey, context: GateCopyContext): GateCopy | null {
  if (mode === 'open') {
    return null
  }

  if (mode === 'blurred') {
    return {
      title: 'Unlock live store data',
      description:
        'Connect billing to unblur real-time returns, exchange plays, and VIP queues for your Shopify storefront.',
      actionLabel: 'See plans',
      onAction: context.openBilling,
    }
  }

  if (key === 'plan') {
    return {
      title: 'Complete the guided walkthrough',
      description:
        'Finish the guided onboarding to understand each dashboard module before choosing the package that fits best.',
      actionLabel: context.canStartTour ? 'Resume guided tour' : undefined,
      onAction: context.canStartTour ? context.startWalkthrough : undefined,
    }
  }

  return {
    title: 'Guided onboarding in progress',
    description:
      'We reveal each dashboard section step-by-step so you know exactly how to use it. Continue the guided tour to unlock this view.',
    actionLabel: context.canStartTour ? 'Start guided tour' : undefined,
    onAction: context.canStartTour ? context.startWalkthrough : undefined,
  }
}

type GateWrapperProps = {
  as?: 'div' | 'section' | 'article'
  mode: GateMode
  copy: GateCopy | null
  containerClassName?: string
  contentRef?: MutableRefObject<HTMLDivElement | null> | null
  hideOverlay?: boolean
  children: ReactNode
}

function GateWrapper({
  as = 'div',
  mode,
  copy,
  containerClassName,
  contentRef,
  hideOverlay = false,
  children,
}: GateWrapperProps) {
  const Component = as
  const gateClass = mode !== 'open' ? ` data-gate--${mode}` : ''
  return (
    <Component className={`data-gate${gateClass}${containerClassName ? ` ${containerClassName}` : ''}`}>
      <div
        ref={(node) => {
          if (contentRef) {
            contentRef.current = node
          }
        }}
        className="data-gate__content"
      >
        {children}
      </div>
      {!hideOverlay && mode !== 'open' && copy ? (
        <div className="data-gate__overlay">
          <h3>{copy.title}</h3>
          <p>{copy.description}</p>
          {copy.actionLabel ? (
            <button type="button" className="data-gate__cta" onClick={copy.onAction}>
              {copy.actionLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </Component>
  )
}

type WalkthroughWizardProps = {
  active: boolean
  step: WalkthroughStep
  stepIndex: number
  totalSteps: number
  onAdvance: () => Promise<void>
  hasShopifyStore: boolean
}

function WalkthroughWizard({ active, step, stepIndex, totalSteps, onAdvance, hasShopifyStore }: WalkthroughWizardProps) {
  const [processing, setProcessing] = useState(false)

  if (!active) {
    return null
  }

  const progress = ((stepIndex + 1) / totalSteps) * 100
  const actionableHelper =
    step.key === 'plan' && hasShopifyStore
      ? 'Selecting a plan will unblur the live data you just previewed.'
      : step.helper

  const handleAdvance = async () => {
    if (processing) {
      return
    }
    setProcessing(true)
    try {
      await onAdvance()
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="walkthrough-overlay" role="dialog" aria-modal="true">
      <div className="walkthrough-card">
        <header>
          <span className="walkthrough-progress-label">
            Step {stepIndex + 1} of {totalSteps}
          </span>
          <div className="walkthrough-progress">
            <div className="walkthrough-progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </header>
        <div className="walkthrough-body">
          <h2>{step.title}</h2>
          <p>{step.description}</p>
          {actionableHelper ? <p className="walkthrough-helper">{actionableHelper}</p> : null}
        </div>
        <footer>
          <button type="button" onClick={handleAdvance} disabled={processing}>
            {processing ? 'Revealing…' : step.ctaLabel ?? 'Continue'}
          </button>
        </footer>
      </div>
    </div>
  )
}

