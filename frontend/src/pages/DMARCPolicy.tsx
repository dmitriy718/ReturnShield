import { useEffect, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import posthog from 'posthog-js'
import logoMark from '../assets/logo-mark.svg'
import '../App.css'

export default function DMARCPolicyPage() {
  const [navOpen, setNavOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (navOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
    return () => {
      document.body.classList.remove('no-scroll')
    }
  }, [navOpen])

  const handleNavScroll = (sectionId: string) => {
    setNavOpen(false)
    navigate('/', { state: { scrollTo: sectionId } })
  }

  const handleFooterLink = (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => {
    setNavOpen(false)
    if (window.location.pathname === path) {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="page policy-page">
      <header className="top-nav">
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
            <button type="button" className="link-muted" onClick={() => handleNavScroll('pricing')}>
              Log in
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                posthog.capture('cta_click', { cta: 'start_preventing_returns' })
                handleNavScroll('pricing')
              }}
            >
              Start Preventing Returns
            </button>
          </div>
        </nav>
        <div className="nav-actions">
          <button type="button" className="link-muted" onClick={() => handleNavScroll('pricing')}>
            Log in
          </button>
          <button
            type="button"
            className="btn btn-primary btn-trial"
            onClick={() => {
              posthog.capture('cta_click', { cta: 'start_preventing_returns' })
              handleNavScroll('pricing')
            }}
          >
            Start Preventing Returns
          </button>
        </div>
      </header>

      <main className="policy-content">
        <header className="policy-hero">
          <span className="tagline">Email authenticity</span>
          <h1>ReturnShield DMARC Policy</h1>
          <p className="policy-lede">
            This Domain-based Message Authentication, Reporting & Conformance (DMARC) policy outlines how ReturnShield
            protects email identity, enforces authentication alignment, and processes aggregate and forensic feedback for
            all messages sent from our domains.
          </p>
          <p className="policy-effective">Effective date: November 10, 2025</p>
        </header>

        <section>
          <h2>1. Domains covered</h2>
          <p>
            This policy applies to outbound messages sent from the following domains and subdomains owned by ReturnShield
            Inc.: <strong>returnshield.app</strong>, <strong>returnshield.store</strong>, <strong>returnshield.io</strong>,
            <strong>returnshield.us</strong>, and <strong>returnshield.me</strong>. Marketing and product email activity is
            centralized on <code>returnshield.app</code> to simplify authentication management.
          </p>
        </section>

        <section>
          <h2>2. DMARC record</h2>
          <p>
            Our production DNS publishes the following DMARC resource record at <code>_dmarc.returnshield.app</code>:
          </p>
          <pre className="code-block">
            v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-aggregate@returnshield.app; ruf=mailto:dmarc-forensics@returnshield.app; fo=1; adkim=s; aspf=s
          </pre>
          <p>
            The policy of <code>p=quarantine</code> instructs receiving mailbox providers to place messages failing
            authentication into the spam folder. We evaluate aggregate reports weekly and will transition to
            <code>p=reject</code> once we reach 100% enforcement confidence.
          </p>
        </section>

        <section>
          <h2>3. Alignment requirements</h2>
          <ul>
            <li>SPF alignment (<code>aspf=s</code>) requires the envelope-from domain to exactly match ReturnShield domains.</li>
            <li>DKIM alignment (<code>adkim=s</code>) requires the signing domain to match the visible From domain.</li>
            <li>Messages sent through sanctioned platforms (SendGrid, HelpScout) are configured to satisfy both alignment rules.</li>
          </ul>
        </section>

        <section>
          <h2>4. Authorized senders</h2>
          <p>
            ReturnShield permits the following providers to send on our behalf, subject to SPF/DKIM alignment and vendor
            security reviews conducted at least annually:
          </p>
          <ul>
            <li>Transactional email: SendGrid (api.sendgrid.com)</li>
            <li>Support email: HelpScout (mailgun.org infrastructure)</li>
            <li>Marketing drips: Customer.io (SMTP relays configured with dedicated DKIM keys)</li>
          </ul>
          <p>
            Any third-party vendor must provide shared security attestations and allow us to host custom ReturnShield DKIM
            selectors. Unauthorized vendors are blocked at the DNS and email gateway layer.
          </p>
        </section>

        <section>
          <h2>5. Monitoring & reporting</h2>
          <ul>
            <li>
              Aggregate reports (<code>rua</code>) are delivered to <a href="mailto:dmarc-aggregate@returnshield.app">dmarc-aggregate@returnshield.app</a> and processed via ReturnShield analytics dashboards.
            </li>
            <li>
              Forensic failure reports (<code>ruf</code>) are routed to <a href="mailto:dmarc-forensics@returnshield.app">dmarc-forensics@returnshield.app</a> with automated triage to our security team.
            </li>
            <li>We retain report data for a minimum of 24 months to establish trendlines and respond to abuse complaints.</li>
          </ul>
        </section>

        <section>
          <h2>6. Incident response</h2>
          <p>
            If DMARC aggregate data indicates spoofing or deliverability issues, our workflow is as follows:
          </p>
          <ol>
            <li>Validate SPF and DKIM records for the impacted sending infrastructure.</li>
            <li>Isolate any unauthorized hosts and submit removal requests to mailbox providers as required.</li>
            <li>Notify affected customers if spoofing intersects with transactional or support communications.</li>
            <li>Escalate repeated incidents to our legal and compliance teams for further enforcement action.</li>
          </ol>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>
            Questions regarding DMARC enforcement or spoofing reports can be directed to
            <a href="mailto:security@returnshield.app"> security@returnshield.app</a>. Please include relevant email
            headers or provider feedback to accelerate investigation.
          </p>
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
