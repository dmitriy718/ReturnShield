import { useEffect, useMemo, useState } from 'react'
import posthog from 'posthog-js'
import { motion } from 'framer-motion'
import './App.css'

import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Metrics } from './components/Metrics'
import { RoiCalculator } from './components/RoiCalculator'
import { ImpactSection } from './components/ImpactSection'
import { ExchangeCoachSection } from './components/ExchangeCoachSection'
import { VIPResolutionHub } from './components/VIPResolutionHub'
import { ReturnlessIntelligence } from './components/ReturnlessIntelligence'
import { ExchangeAutopilot } from './components/ExchangeAutopilot'
import { Integrations } from './components/Integrations'
import { Pricing } from './components/Pricing'
import { Testimonials } from './components/Testimonials'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'

import {
  fetchReturnlessInsights,
  fetchExchangeCoach,
  fetchVIPResolution,
  fetchIntegrationStatus,
  createCheckoutSession,
} from './services/api'

import {
  fallbackReturnlessInsights,
  fallbackCoach,
  fallbackVip,
  DEFAULT_INTEGRATION_HIGHLIGHTS,
  stripePriceLookup,
} from './data/defaults'

import type { ReturnlessInsights, ExchangeCoachPayload, VIPQueuePayload, IntegrationHighlight } from './types'

function App() {
  const [checkoutLoadingPlan, setCheckoutLoadingPlan] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [returnlessInsights, setReturnlessInsights] = useState<ReturnlessInsights>(fallbackReturnlessInsights)
  const [coachData, setCoachData] = useState<ExchangeCoachPayload>(fallbackCoach)
  const [vipData, setVipData] = useState<VIPQueuePayload>(fallbackVip)
  const [integrationHighlights, setIntegrationHighlights] =
    useState<IntegrationHighlight[]>(DEFAULT_INTEGRATION_HIGHLIGHTS)

  const liveImpact = useMemo(() => {
    const revenueProtectedQuarter = coachData.summary.projectedExchangeUplift * 3
    const landfillDiverted = returnlessInsights.summary.landfillLbsPrevented
    const hoursReturned = returnlessInsights.summary.manualHoursReduced + vipData.summary.opsHoursReturned
    return {
      revenueProtectedQuarter,
      landfillDiverted,
      hoursReturned,
    }
  }, [coachData.summary.projectedExchangeUplift, returnlessInsights.summary, vipData.summary])

  useEffect(() => {
    const controller = new AbortController()
    const loadInsights = async () => {
      try {
        const data = await fetchReturnlessInsights(controller.signal)
        if (data && !controller.signal.aborted) {
          setReturnlessInsights(data)
          posthog.capture('returnless_insights_loaded', {
            source: 'marketing_site',
            sku_count: data.candidates.length,
            period: data.summary.period,
          })
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Unable to fetch returnless insights', error)
        }
      }
    }
    void loadInsights()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const loadCoachAndVip = async () => {
      try {
        const [coachRes, vipRes] = await Promise.allSettled([
          fetchExchangeCoach(controller.signal),
          fetchVIPResolution(controller.signal),
        ])

        if (coachRes.status === 'fulfilled' && coachRes.value && !controller.signal.aborted) {
          setCoachData(coachRes.value)
        }
        if (vipRes.status === 'fulfilled' && vipRes.value && !controller.signal.aborted) {
          setVipData(vipRes.value)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Unable to fetch coach or VIP data', error)
        }
      }
    }
    void loadCoachAndVip()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const loadIntegrationStatus = async () => {
      try {
        const data = await fetchIntegrationStatus(controller.signal)
        if (data && !controller.signal.aborted) {
          setIntegrationHighlights(data)
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Unable to fetch integration status', error)
        }
      }
    }
    void loadIntegrationStatus()
    return () => controller.abort()
  }, [])

  const handlePlanCheckout = async (planKey: string) => {
    setCheckoutError(null)
    setCheckoutLoadingPlan(planKey)
    posthog.capture('pricing_checkout_attempt', { plan: planKey })

    const normalizedPlan = planKey.toLowerCase() as keyof typeof stripePriceLookup
    const priceId = stripePriceLookup[normalizedPlan]
    if (!priceId) {
      setCheckoutError('Selected plan is not available right now. Please contact concierge@returnshield.app.')
      setCheckoutLoadingPlan(null)
      posthog.capture('pricing_checkout_error', { plan: planKey, reason: 'missing_price_id' })
      return
    }

    try {
      const data = await createCheckoutSession(planKey, priceId)
      if (!data.checkout_url) {
        throw new Error('Stripe response missing checkout URL')
      }

      posthog.capture('pricing_checkout_redirect', { plan: planKey })
      window.location.href = data.checkout_url
    } catch (error) {
      console.error(error)
      setCheckoutError(
        "We couldn't launch checkout just now. Please verify billing is configured or reach out to concierge@returnshield.app."
      )
      posthog.capture('pricing_checkout_error', { plan: planKey })
    } finally {
      setCheckoutLoadingPlan(null)
    }
  }

  return (
    <div className="page">
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Hero liveImpact={liveImpact} />
        <Metrics />
        <RoiCalculator />
        <ImpactSection returnlessInsights={returnlessInsights} />
        <ExchangeCoachSection coachData={coachData} />
        <VIPResolutionHub vipData={vipData} />
        <ReturnlessIntelligence returnlessInsights={returnlessInsights} />

        <section className="cta-banner" aria-label="Unlock your ReturnShield effect">
          <div className="cta-banner-copy">
            <h2>Unlock Your ReturnShield Effect</h2>
            <p>
              Stop treating returns as a cost center. Surface the why behind returns, deploy exchange-first playbooks, and defend contribution margin on autopilot.
            </p>
          </div>
          <div className="cta-banner-actions">
            <a
              className="btn btn-primary"
              href="https://app.returnshield.app/register?utm_source=cta_banner_primary"
              onClick={() => posthog.capture('cta_click', { cta: 'unlock_returnshield_effect' })}
            >
              Unlock Your ReturnShield Effect
            </a>
            <a
              className="btn btn-outline"
              href="/exchange-automation"
              onClick={() => posthog.capture('cta_click', { cta: 'convert_returns_to_exchanges' })}
            >
              Convert Returns to Exchanges
            </a>
          </div>
        </section>

        <section id="signup" className="conversion-anchor">
          <h2>Ready to defend your contribution margin?</h2>
          <p>Start a live walkthrough and activate exchange-first automations within 72 hours.</p>
          <a
            className="btn btn-primary"
            href="https://app.returnshield.app/register?concierge=1&utm_source=conversion_concierge"
            onClick={() => posthog.capture('cta_click', { cta: 'schedule_concierge_onboarding' })}
          >
            Schedule concierge onboarding
          </a>
        </section>

        <section id="login" className="conversion-anchor">
          <h2>Already a customer?</h2>
          <p>Visit the ReturnShield operator console to monitor exchange wins and VIP queue updates.</p>
          <a
            className="btn btn-secondary btn-prominent"
            href="https://app.returnshield.app?utm_source=conversion_operator_console"
            onClick={() => posthog.capture('cta_click', { cta: 'operator_console' })}
          >
            Go to operator console
          </a>
        </section>

        <ExchangeAutopilot />
        <Integrations integrationHighlights={integrationHighlights} />

        <section id="features" className="features">
          <header>
            <h2>Keep revenue, not returns.</h2>
            <p>
              Every module is engineered to defend your contribution margin. We benchmark against a $100/month ROI mandate on every release.
            </p>
          </header>
          <div className="feature-grid">
            {[
              {
                title: 'SKU return heatmaps',
                description:
                  'Pinpoint high-risk products, spot sizing issues, and trigger proactive interventions before refunds stack up.',
              },
              {
                title: 'Smart policy automation',
                description:
                  'Auto-adjust policies by customer lifetime value, return reason, or shipping costs to protect your margins.',
              },
              {
                title: 'Cohort-grade reporting',
                description:
                  'Understand which customer segments send the most returns and redirect them toward exchanges or store credit.',
              },
              {
                title: 'AI-written response templates',
                description:
                  'Send empathetic, on-brand replies that deflect refunds and protect loyalty—ready in seconds, not hours.',
              },
            ].map((feature) => (
              <article key={feature.title} className="feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="onboarding" className="onboarding">
          <div className="onboarding-intro">
            <h2>Onboarding takes less than a coffee break.</h2>
            <p>
              We obsess over velocity because your cash flow depends on it. Connect ReturnShield, let the sync run, and watch insights surface immediately.
            </p>
          </div>
          <ol className="onboarding-steps">
            {[
              {
                title: 'Connect',
                body: 'Securely authenticate your Shopify storefront using the ReturnShield partner app and pull 12 months of order history.',
              },
              {
                title: 'Sync',
                body: 'Stripe activates billing, ReturnShield ingests return events, and our AI tags every claim with actionable insights.',
              },
              {
                title: 'See insights',
                body: 'Your dashboard lights up with prioritized savings opportunities, policy recommendations, and automation playbooks.',
              },
            ].map((step, index) => (
              <li key={step.title} className="onboarding-step">
                <span className="step-index">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="dashboard">
          <div className="dashboard-copy">
            <h2>Predict return risk before it hits your inbox.</h2>
            <p>
              The dashboard triages refunds by financial impact, customer lifetime value, and operational root cause. One glance and you know exactly where to intervene.
            </p>
            <ul>
              <li>Exchange nudges outperform refund requests by 2.4×.</li>
              <li>Bulk actions to update policies directly from insights.</li>
              <li>Export investor-ready reports that prove contribution gains.</li>
            </ul>
            <a
              href="/exchange-automation"
              className="btn btn-secondary"
              onClick={() => posthog.capture('cta_click', { cta: 'convert_returns_to_exchanges' })}
            >
              Convert Returns to Exchanges
            </a>
          </div>
          <div className="dashboard-visual">
            <div className="visual-card">
              <header>
                <span className="badge badge-accent">Live Insight</span>
                <span>SKU RS-104 is driving 17% of losses</span>
              </header>
              <div className="visual-body">
                <div>
                  <p className="visual-metric">53 return claims</p>
                  <p className="visual-subtext">$12,480 at risk · 61% size-related</p>
                </div>
                <button
                  className="btn btn-primary btn-small"
                  onClick={() => posthog.capture('cta_click', { cta: 'unlock_returnshield_effect' })}
                >
                  Unlock Your ReturnShield Effect
                </button>
              </div>
              <footer>
                <p>Suggested actions:</p>
                <ul>
                  <li>Trigger size guide email pre-delivery.</li>
                  <li>Offer instant exchanges for VIP customers.</li>
                  <li>Flag manufacturing batch #784 for QA review.</li>
                </ul>
              </footer>
            </div>
          </div>
        </section>

        <Pricing
          handlePlanCheckout={handlePlanCheckout}
          checkoutLoadingPlan={checkoutLoadingPlan}
          checkoutError={checkoutError}
        />
        <Testimonials />
        <FAQ />
      </motion.main>
      <Footer />
    </div>
  )
}

export default App
