import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import posthog from 'posthog-js'

import logoMark from '../assets/logo-mark.svg'
import '../App.css'

const proofPoints = [
  {
    stat: '26%',
    label: 'Average refund reduction when exchange-first automation is enabled',
    detail: 'Based on 2025 DTC benchmark study across apparel, beauty, and lifestyle brands.',
  },
  {
    stat: '3.2x',
    label: 'Lift in repeat purchases from customers offered instant exchanges',
    detail: 'Customers stay in the store experience instead of waiting for refunds.',
  },
  {
    stat: '$72',
    label: 'Median gross margin saved per 100 automated exchanges',
    detail: 'Includes avoided reverse logistics, restocking, and payment processing fees.',
  },
]

const automationStages = [
  {
    title: 'Intercept refund intent',
    description:
      'Detect return intent through Shopify order tags, helpdesk keywords, or PostHog behavioral signals. Swap refund CTAs with “Instant Exchange” copy and unlock bonus offers automatically.',
  },
  {
    title: 'Guide to the perfect replacement',
    description:
      'Use AI-assisted sizing, color recommendations, and bundled upsell logic so shoppers solve the problem immediately rather than waiting for a refund.',
  },
  {
    title: 'Automate fulfillment + comms',
    description:
      'Trigger SendGrid drips, update exchange orders in Shopify, and notify the concierge team in HelpScout—all with zero manual touch.',
  },
  {
    title: 'Validate ROI dashboards',
    description:
      'Track exchange adoption, recovered revenue, and margin lift inside the ReturnShield dashboard. Every event pipes into PostHog for real-time experimentation.',
  },
]

const testimonial = {
  quote:
    'Exchange Autopilot let us flip panic refunds into fast replacements. We clawed back $94K in 30 days and our VIP customers actually thanked us.',
  author: 'Natalie Chen, COO, LumiSkin Beauty',
}

const playbookHighlights = [
  {
    title: 'Smart eligibility rules',
    bullets: [
      'Target SKUs with high resale velocity or limited inventory windows.',
      'Exclude low-value items and damaged goods automatically.',
      'Set guardrails by customer segment, channel, or purchase value.',
    ],
  },
  {
    title: 'Incentives that convert',
    bullets: [
      'Instant store credit bonus or free two-day reship on first exchange.',
      'Limited-time bundles that upsell accessories during the exchange flow.',
      'Dynamic messaging that mirrors your brand tone and policy guidelines.',
    ],
  },
  {
    title: 'Human-in-the-loop safety',
    bullets: [
      'Escalate edge cases to the CX team via HelpScout macros.',
      'Generate AI-assisted replies that stay on-brand but keep exchanges front-and-center.',
      'Audit trails for every automation step so finance and ops can sign off with confidence.',
    ],
  },
]

export default function ExchangeAutopilotPage() {
  const [navOpen, setNavOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (navOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
  }, [navOpen])

  const scrollHomeSection = (id: string) => {
     setNavOpen(false)
    navigate('/', { state: { scrollTo: id } })
  }

  const handleFooterLink = (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => {
    setNavOpen(false)
    if (window.location.pathname === path) {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleDemoClick = (cta: string) => {
    posthog.capture('exchange_autopilot_cta', { cta })
  }

  return (
    <div className="page exchange-page">
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
          <button type="button" className="nav-link-button" onClick={() => scrollHomeSection('features')}>
            Platform
          </button>
          <button type="button" className="nav-link-button" onClick={() => scrollHomeSection('impact')}>
            Impact
          </button>
          <button type="button" className="nav-link-button" onClick={() => scrollHomeSection('coach')}>
            AI Coach
          </button>
          <button type="button" className="nav-link-button" onClick={() => scrollHomeSection('vip')}>
            VIP Hub
          </button>
          <span className="nav-active">Exchange Autopilot</span>
          <button type="button" className="nav-link-button" onClick={() => scrollHomeSection('pricing')}>
            Pricing
          </button>
          <button type="button" className="nav-link-button" onClick={() => scrollHomeSection('stories')}>
            Customer Wins
          </button>
          <div className="nav-mobile-cta">
            <a
              className="link-muted"
              href="mailto:hello@returnshield.app?subject=ReturnShield%20Demo"
              onClick={() => setNavOpen(false)}
            >
              Book a call
            </a>
            <a
              className="btn btn-primary"
              href="/#signup"
              onClick={() => {
                setNavOpen(false)
                posthog.capture('exchange_autopilot_cta', { cta: 'start_preventing_returns' })
              }}
            >
              Start Preventing Returns
            </a>
          </div>
        </nav>
        <div className="nav-actions">
          <a className="link-muted" href="mailto:hello@returnshield.app?subject=ReturnShield%20Demo">
            Book a call
          </a>
          <a
            className="btn btn-primary btn-trial"
            href="/#signup"
            onClick={() => posthog.capture('exchange_autopilot_cta', { cta: 'start_preventing_returns' })}
          >
            Start Preventing Returns
          </a>
        </div>
      </header>

      <main className="exchange-main">
        <section className="exchange-hero">
          <div className="exchange-hero-copy">
            <span className="tagline">Premium feature</span>
            <h1>Exchange Autopilot</h1>
            <p>
              Turn refund requests into instant exchanges with automation that mirrors your brand.
              No more lost margin. No more disjointed workflows. Just recovered revenue and happier
              shoppers.
            </p>
            <div className="hero-cta">
              <button
                className="btn btn-primary"
                onClick={() => handleDemoClick('start_preventing_returns')}
              >
                Start Preventing Returns
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleDemoClick('turn_returns_into_relationships')}
              >
                Turn Returns into Relationships
              </button>
              <button
                className="btn btn-link"
                onClick={() => handleDemoClick('see_the_why')}
              >
                See the Why Behind Returns
              </button>
            </div>
            <div className="hero-proof exchange-proof">
              {proofPoints.map((point) => (
                <div key={point.stat}>
                  <strong>{point.stat}</strong>
                  <p>{point.label}</p>
                  <span>{point.detail}</span>
                </div>
              ))}
            </div>
          </div>
          <aside className="exchange-hero-card">
            <div className="visual-card">
              <header>
                <span className="badge badge-accent">Live Insight</span>
                <span>Refunds converted this week</span>
              </header>
              <div className="visual-body">
                <div>
                  <p className="visual-metric">38 exchanges</p>
                  <p className="visual-subtext">$8,540 margin protected</p>
                </div>
                <button className="btn btn-primary btn-small" onClick={() => handleDemoClick('unlock_returnshield_effect')}>
                  Unlock Your ReturnShield Effect
                </button>
              </div>
              <footer>
                <p>Top levers firing:</p>
                <ul>
                  <li>Instant credit bonus deployed for VIP customers.</li>
                  <li>Fit guide drip triggered for size-related returns.</li>
                  <li>Returnless refund rule active on low-margin accessories.</li>
                </ul>
              </footer>
            </div>
          </aside>
        </section>

        <section className="automation-stages">
          <header>
            <h2>How Exchange Autopilot wins back revenue</h2>
            <p>
              Our automation engine pulls signals from Shopify, PostHog, HelpScout, and SendGrid to
              orchestrate the perfect exchange flow. Every step is configurable—no engineers
              required.
            </p>
          </header>
          <div className="stages-grid">
            {automationStages.map((stage) => (
              <article key={stage.title}>
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="testimonial">
          <blockquote>
            <p>“{testimonial.quote}”</p>
            <cite>{testimonial.author}</cite>
          </blockquote>
        </section>

        <section className="playbook-section">
          <header>
            <h2>What’s inside the Exchange Autopilot playbook</h2>
            <p>Everything we learned from hundreds of return rescues distilled into one package.</p>
          </header>
          <div className="playbook-grid">
            {playbookHighlights.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="roi-callout">
          <div>
            <h2>Ready to recover this month’s refund losses?</h2>
            <p>
              Exchange Autopilot installs in less than two hours and pays for itself with your first
              reclaimed shipment.
            </p>
          </div>
          <div className="hero-cta">
            <button
              className="btn btn-primary"
              onClick={() => handleDemoClick('start_now')}
            >
              Start Exchange Autopilot
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => handleDemoClick('speak_to_specialist')}
            >
              Talk to a specialist
            </button>
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
          <Link to="/dmarc" onClick={(event) => handleFooterLink(event, '/dmarc')}>
            DMARC Policy
          </Link>
        </div>
      </footer>
    </div>
  )
}

