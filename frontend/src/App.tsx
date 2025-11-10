import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, MouseEvent as ReactMouseEvent } from 'react'
import posthog from 'posthog-js'
import logoMark from './assets/logo-mark.svg'
import './App.css'

function App() {
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()
  const navigateInternal = useNavigate()
  const [monthlyOrders, setMonthlyOrders] = useState<number>(350)
  const [averageOrderValue, setAverageOrderValue] = useState<number>(92)
  const [returnRate, setReturnRate] = useState<number>(0.17)

  const roiMetrics = useMemo(() => {
    const projectedReduction = 0.23
    const exchangeCaptureRate = 0.42
    const monthlyGrossSales = monthlyOrders * averageOrderValue
    const currentReturnLoss = monthlyGrossSales * returnRate
    const refundsPrevented = currentReturnLoss * projectedReduction
    const exchangeRevenue = monthlyOrders * returnRate * exchangeCaptureRate * averageOrderValue
    const totalReclaimed = refundsPrevented + exchangeRevenue
    const returnRateAfter = Math.max(returnRate * (1 - projectedReduction), 0)
    const roiMultiple = totalReclaimed / 100
    return {
      monthlyGrossSales,
      currentReturnLoss,
      refundsPrevented,
      exchangeRevenue,
      totalReclaimed,
      returnRateAfter,
      roiMultiple,
      projectedReduction,
      exchangeCaptureRate,
    }
  }, [averageOrderValue, monthlyOrders, returnRate])

  const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  const formatPercent = (value: number, digits = 0) => `${(value * 100).toFixed(digits)}%`

  const handleMonthlyOrdersChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value)
    if (!Number.isNaN(next)) {
      setMonthlyOrders(Math.max(0, Math.min(2000, Math.round(next))))
    }
  }

  const handleAverageOrderValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value)
    if (!Number.isNaN(next)) {
      setAverageOrderValue(Math.max(0, Math.min(500, Math.round(next))))
    }
  }

  const handleReturnRateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value)
    if (!Number.isNaN(next)) {
      setReturnRate(Math.max(0, Math.min(0.5, next)))
    }
  }

  useEffect(() => {
    if (navOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
  }, [navOpen])

  useEffect(() => {
    const state = (location.state as { scrollTo?: string } | null) || {}
    if (state.scrollTo) {
      requestAnimationFrame(() => {
        const target = document.getElementById(state.scrollTo!)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        navigateInternal(location.pathname, { replace: true, state: {} })
      })
    }
  }, [location, navigateInternal])

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleNavScroll = (id: string) => {
    setNavOpen(false)
    if (window.location.pathname === '/') {
      scrollToId(id)
    } else {
      navigateInternal('/', { state: { scrollTo: id } })
    }
  }

  const handleFooterLink = (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => {
    setNavOpen(false)
    if (window.location.pathname === path) {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePlanSelect = (planName: string) => {
    posthog.capture('pricing_plan_interest', { plan: planName })
  }
  const metrics = [
    {
      label: 'Return rate reduction',
      value: '23%',
      detail: 'Average drop within 60 days of activation.',
    },
    {
      label: 'Monthly revenue protected',
      value: '$48K',
      detail: 'Median revenue brands keep every month with ReturnShield.',
    },
    {
      label: 'Time to live insights',
      value: '72 hrs',
      detail: 'From install to actionable SKU-level recommendations.',
    },
  ]

  const featureHighlights = [
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
  ]

  const onboardingSteps = [
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
  ]

  const pricingTiers = [
    {
      name: 'Launch',
      price: '$29',
      cadence: '/month',
      spotlight: 'Built for brands testing product-market fit.',
      benefits: [
        'Daily return summary email',
        '30-day trends by SKU + channel',
        'Policy tweak library & playbooks',
        'Email support within 24 hours',
      ],
      cta: 'Start with Launch',
    },
    {
      name: 'Scale',
      price: '$69',
      cadence: '/month',
      spotlight: 'Designed for teams scaling fulfillment operations.',
      benefits: [
        'Everything in Launch',
        'AI-generated return responses',
        'Customer cohort segmentation',
        'Slack alerts for anomalies',
        'Unlimited team seats',
      ],
      cta: 'Scale smarter',
      highlighted: true,
    },
    {
      name: 'Elite',
      price: '$100',
      cadence: '/month',
      spotlight: 'For operators who demand bulletproof margins.',
      benefits: [
        'Everything in Scale',
        'Predictive loss forecasting',
        'Priority onboarding concierge',
        'Quarterly strategy workshops',
        '24/7 priority response SLA',
      ],
      cta: 'Book enterprise review',
    },
  ]

  const testimonials = [
    {
      quote:
        'We recaptured $62K in refund risk the first month. The dashboard surfaced one mislabeled SKU that explained 41% of our returns.',
      author: 'Riya Patel',
      role: 'COO, Oak & Ember Apparel',
    },
  ]

  return (
    <div className="page">
      <header className="top-nav">
        <Link to="/" className="brand" aria-label="ReturnShield home" onClick={() => setNavOpen(false)}>
          <img src={logoMark} alt="ReturnShield shield" className="brand-icon" />
          <div className="brand-text">
            <span className="brand-title">ReturnShield</span>
            <span className="brand-tagline">Turn Your Returns Into Relationships</span>
          </div>
        </Link>
        <button
          className={`nav-toggle ${navOpen ? 'is-open' : ''}`}
          aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setNavOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`nav-links ${navOpen ? 'nav-open' : ''}`}>
          <button type="button" className="nav-link-button" onClick={() => handleNavScroll('features')}>
            Features
          </button>
          <Link
            to="/exchange-automation"
            onClick={() => {
              setNavOpen(false)
              posthog.capture('cta_click', { cta: 'nav_exchange_autopilot' })
            }}
          >
            Exchange Autopilot
          </Link>
          <button type="button" className="nav-link-button" onClick={() => handleNavScroll('pricing')}>
            Pricing
          </button>
          <button type="button" className="nav-link-button" onClick={() => handleNavScroll('stories')}>
            Customer Wins
          </button>
          <button type="button" className="nav-link-button" onClick={() => handleNavScroll('faq')}>
            FAQ
          </button>
          <div className="nav-mobile-cta">
            <a className="link-muted" href="#login" onClick={() => setNavOpen(false)}>
              Log in
            </a>
            <a
              className="btn btn-primary"
              href="#signup"
              onClick={() => {
                setNavOpen(false)
                posthog.capture('cta_click', { cta: 'start_preventing_returns' })
              }}
            >
              Start Preventing Returns
            </a>
          </div>
        </nav>
        <div className="nav-actions">
          <a className="link-muted" href="#login">
            Log in
          </a>
          <a
            className="btn btn-primary btn-trial"
            href="#signup"
            onClick={() => posthog.capture('cta_click', { cta: 'start_preventing_returns' })}
          >
            Start Preventing Returns
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="tagline">Stop losing money on returns</span>
            <h1>Return insights that actually make sense.</h1>
            <p className="hero-subtitle">
              ReturnShield turns messy return data into revenue-saving actions. Detect operational leaks, automate smarter policies, and prove the ROI of every fulfillment decision.
            </p>
            <div className="hero-cta">
              <a
                className="btn btn-primary"
                href="#signup"
                onClick={() => posthog.capture('cta_click', { cta: 'start_preventing_returns' })}
              >
                Start Preventing Returns
              </a>
              <a
                className="btn btn-secondary"
                href="#features"
                onClick={() => posthog.capture('cta_click', { cta: 'see_the_why' })}
              >
                See the Why Behind Returns
              </a>
              <Link
                className="btn btn-link"
                to="/exchange-automation"
                onClick={() => posthog.capture('cta_click', { cta: 'unlock_returnshield_effect' })}
              >
                Unlock Your ReturnShield Effect
              </Link>
            </div>
            <div className="hero-proof">
              <div>
                <strong>Built for Shopify brands</strong>
                <p>Connect, sync, and act in under 72 hours.</p>
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    posthog.capture('cta_click', { cta: 'turn_returns_into_relationships' })
                    scrollToId('onboarding')
                  }}
                >
                  Turn Returns into Relationships
                </button>
              </div>
              <div>
                <strong>Convert returns, not customers</strong>
                <p>Exchange-first automation keeps loyal buyers in your store.</p>
                <Link
                  to="/exchange-automation"
                  className="text-link"
                  onClick={() => posthog.capture('cta_click', { cta: 'convert_returns_to_exchanges' })}
                >
                  Convert Returns to Exchanges
                </Link>
              </div>
            </div>
          </div>
          <aside className="hero-mockup">
            <div className="mockup-card">
              <div className="mockup-header">
                <span>Return health this week</span>
                <span className="badge badge-positive">+18% margin</span>
              </div>
              <div className="mockup-stat">
                <span className="mockup-value">38 refunds saved</span>
                <span className="mockup-meta">High-risk SKUs automatically flagged.</span>
              </div>
              <div className="mockup-chart">
                <span className="chart-bar bar-1" />
                <span className="chart-bar bar-2" />
                <span className="chart-bar bar-3" />
                <span className="chart-bar bar-4" />
              </div>
              <div className="mockup-footer">
                <p>AI recommendation: Switch ReturnShield Flex policy to exchanges-first for orders over $200.</p>
              </div>
            </div>
          </aside>
        </section>

        <section className="metrics" aria-label="Performance metrics">
          {metrics.map((metric) => (
            <div key={metric.label} className="metric-card">
              <span className="metric-value">{metric.value}</span>
              <span className="metric-label">{metric.label}</span>
              <p>{metric.detail}</p>
            </div>
          ))}
        </section>

        <section className="roi-calculator" aria-label="ReturnShield ROI forecaster">
          <div className="roi-header">
            <h2>Forecast your ReturnShield revenue impact</h2>
            <p>
              Adjust the levers below to see how exchange-first automation prevents refunds and keeps more revenue in play.
              We model against live operator benchmarks from the ReturnShield beta cohort.
            </p>
          </div>
          <div className="roi-layout">
            <form className="roi-form" aria-label="ROI assumptions">
              <label>
                <span>Monthly orders</span>
                <input
                  type="number"
                  min={0}
                  max={2000}
                  step={10}
                  value={monthlyOrders}
                  onChange={handleMonthlyOrdersChange}
                  inputMode="numeric"
                />
              </label>
              <label>
                <span>Average order value</span>
                <div className="input-prefix">
                  <span className="prefix">$</span>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    step={1}
                    value={averageOrderValue}
                    onChange={handleAverageOrderValueChange}
                    inputMode="decimal"
                  />
                </div>
              </label>
              <label className="range-field">
                <span>Current return rate</span>
                <div className="range-meta">{formatPercent(returnRate, 0)}</div>
                <input
                  type="range"
                  min={0}
                  max={0.5}
                  step={0.01}
                  value={returnRate}
                  onChange={handleReturnRateChange}
                  aria-valuemin={0}
                  aria-valuemax={0.5}
                  aria-valuenow={returnRate}
                />
              </label>
              <p className="roi-footnote">
                Benchmarks: {formatPercent(roiMetrics.projectedReduction, 0)} average return-rate reduction,{' '}
                {formatPercent(roiMetrics.exchangeCaptureRate, 0)} of refunded orders converted to exchanges when ReturnShield
                playbooks are live.
              </p>
            </form>
            <div className="roi-results" aria-label="Projected ROI outcomes">
              <article className="roi-card">
                <span className="label">Monthly gross sales</span>
                <strong>{formatCurrency(roiMetrics.monthlyGrossSales)}</strong>
              </article>
              <article className="roi-card">
                <span className="label">Current monthly refund leakage</span>
                <strong>{formatCurrency(roiMetrics.currentReturnLoss)}</strong>
              </article>
              <article className="roi-card">
                <span className="label">Refunds prevented</span>
                <strong>{formatCurrency(roiMetrics.refundsPrevented)}</strong>
              </article>
              <article className="roi-card">
                <span className="label">Exchange-driven revenue retained</span>
                <strong>{formatCurrency(roiMetrics.exchangeRevenue)}</strong>
              </article>
              <article className="roi-card">
                <span className="label">Projected return rate after 60 days</span>
                <strong>{formatPercent(roiMetrics.returnRateAfter, 1)}</strong>
              </article>
              <article className="roi-card roi-highlight">
                <span className="label">Monthly revenue protected</span>
                <strong>{formatCurrency(roiMetrics.totalReclaimed)}</strong>
                <small>{roiMetrics.roiMultiple.toFixed(1)}× subscription ROI</small>
              </article>
            </div>
          </div>
        </section>

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
              href="#pricing"
              onClick={() => posthog.capture('cta_click', { cta: 'unlock_returnshield_effect' })}
            >
              Unlock Your ReturnShield Effect
            </a>
            <Link
              className="btn btn-outline"
              to="/exchange-automation"
              onClick={() => posthog.capture('cta_click', { cta: 'convert_returns_to_exchanges' })}
            >
              Convert Returns to Exchanges
            </Link>
          </div>
        </section>

        <section id="features" className="features">
          <header>
            <h2>Keep revenue, not returns.</h2>
            <p>
              Every module is engineered to defend your contribution margin. We benchmark against a $100/month ROI mandate on every release.
            </p>
          </header>
          <div className="feature-grid">
            {featureHighlights.map((feature) => (
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
            {onboardingSteps.map((step, index) => (
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
            <Link
              to="/exchange-automation"
              className="btn btn-secondary"
              onClick={() => posthog.capture('cta_click', { cta: 'convert_returns_to_exchanges' })}
            >
              Convert Returns to Exchanges
            </Link>
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

        <section id="pricing" className="pricing">
          <header>
            <h2>Pricing engineered to pay for itself.</h2>
            <p>
              Every plan includes actionable insights, premium support, and the promise that ReturnShield protects more revenue than it costs.
            </p>
          </header>
          <div className="pricing-grid">
            {pricingTiers.map((plan) => (
              <article
                key={plan.name}
                className={`pricing-card ${plan.highlighted ? 'pricing-card-highlighted' : ''}`}
              >
                <div className="pricing-header">
                  <span className="plan-name">{plan.name}</span>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="cadence">{plan.cadence}</span>
                  </div>
                  <p className="plan-spotlight">{plan.spotlight}</p>
                </div>
                <ul className="plan-benefits">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit}>
                      <CheckIcon />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <a
                  className="btn btn-primary"
                  href="#signup"
                  onClick={() => handlePlanSelect(plan.name)}
                >
                  {plan.cta}
                </a>
              </article>
            ))}
          </div>
          <div className="pricing-cta">
            <a
              href="#features"
              className="btn btn-secondary"
              onClick={() => posthog.capture('cta_click', { cta: 'turn_returns_into_relationships' })}
            >
              Turn Returns into Relationships
            </a>
          </div>
        </section>

        <section id="stories" className="testimonials">
          {testimonials.map((story) => (
            <blockquote key={story.author}>
              <p>“{story.quote}”</p>
              <cite>
                {story.author} · {story.role}
              </cite>
            </blockquote>
          ))}
          <div className="testimonial-cta">
            <h3>Your next refund could be revenue.</h3>
            <p>Ship ReturnShield today and be the success story we feature next week.</p>
            <a className="btn btn-secondary" href="#demo">
              Schedule 15-minute walkthrough
            </a>
          </div>
        </section>

        <section id="faq" className="faq">
          <h2>Questions investors and operators ask us.</h2>
          <div className="faq-grid">
            <article>
              <h3>How fast do we see ROI?</h3>
              <p>Most brands recoup their monthly subscription with the first operational fix we surface—typically inside week one.</p>
            </article>
            <article>
              <h3>Do you replace our existing return portal?</h3>
              <p>No. ReturnShield analyzes your existing workflows, adds intelligence, and automates smart policy adjustments on top.</p>
            </article>
            <article>
              <h3>Will this work beyond Shopify?</h3>
              <p>Shopify is live today. WooCommerce, Amazon, and custom cart integrations are lined up for Stage 3—let us know your timeline.</p>
            </article>
            <article>
              <h3>Can our CX team actually use this?</h3>
              <p>Yes. The dashboard is built for non-technical operators with guided recommendations and a human support team on standby.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <Link
            to="/"
            className="brand"
            aria-label="ReturnShield home"
            onClick={(event) => handleFooterLink(event, '/')}
          >
            <img src={logoMark} alt="ReturnShield shield" className="brand-icon" />
            <div className="brand-text">
              <span className="brand-title">ReturnShield</span>
              <span className="brand-tagline">Turn Your Returns Into Relationships</span>
            </div>
          </Link>
        </div>
        <div className="footer-links">
          <a href="mailto:hello@returnshield.app">hello@returnshield.app</a>
          <Link to="/privacy" onClick={(event) => handleFooterLink(event, '/privacy')}>
            Privacy Policy
          </Link>
          <Link to="/terms" onClick={(event) => handleFooterLink(event, '/terms')}>
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg
      className="icon-check"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        d="M7.5 13.5L3.5 9.5L2 11L7.5 16.5L18 6L16.5 4.5L7.5 13.5Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default App
