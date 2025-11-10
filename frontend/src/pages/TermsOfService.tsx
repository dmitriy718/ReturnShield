import { useEffect, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import posthog from 'posthog-js'
import logoMark from '../assets/logo-mark.svg'
import '../App.css'

export default function TermsOfServicePage() {
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
          <span className="tagline">Legal essentials</span>
          <h1>ReturnShield Terms of Service</h1>
          <p className="policy-lede">
            These Terms of Service (“Terms”) govern access to and use of the ReturnShield platform, integrations,
            websites, and related services (collectively the “Services”) provided by ReturnShield Inc. (“ReturnShield”,
            “we”, “our”, or “us”). By creating an account, executing an order form, or using the Services, you
            (“Customer”, “you”, or “your”) agree to be bound by these Terms.
          </p>
          <p className="policy-effective">Effective date: November 10, 2025</p>
        </header>

        <section>
          <h2>1. Agreement and order forms</h2>
          <p>
            These Terms form a binding agreement between ReturnShield and Customer. Additional order forms or statements
            of work (“Order Forms”) may outline plan tiers, usage limits, fees, and special terms. If there is a conflict
            between these Terms and an executed Order Form, the Order Form controls for that Order Form only.
          </p>
        </section>

        <section>
          <h2>2. Eligibility and accounts</h2>
          <ul>
            <li>Customer must be at least 18 years old and have authority to enter into these Terms on behalf of its entity.</li>
            <li>Customer is responsible for maintaining accurate account information and safeguarding credentials.</li>
            <li>Customer must promptly notify ReturnShield of any unauthorized access or suspected security breach.</li>
          </ul>
        </section>

        <section>
          <h2>3. Services</h2>
          <p>
            ReturnShield provides software-as-a-service features that ingest commerce, returns, and support data to
            deliver analytics, automation recommendations, and workflows. We may update or modify the Services, provided
            such changes do not materially reduce core functionality. Customer will be notified of material updates.
          </p>
        </section>

        <section>
          <h2>4. Customer data and license</h2>
          <ul>
            <li>
              “Customer Data” means data, content, and materials submitted to the Services, including order, returns,
              exchange, inventory, and customer communication data pulled from Customer-authorized integrations.
            </li>
            <li>
              Customer retains ownership of Customer Data. Customer grants ReturnShield a worldwide, non-exclusive,
              royalty-free license to host, process, analyze, copy, modify, and display Customer Data solely to provide
              and improve the Services, comply with legal requests, and develop anonymized or aggregated insights.
            </li>
            <li>
              ReturnShield may create de-identified or aggregated data that does not identify Customer or its end users.
              We may use such data for internal analytics, benchmarking, or to enhance the Services.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Acceptable use</h2>
          <p>Customer agrees not to:</p>
          <ul>
            <li>Reverse engineer, decompile, or attempt to derive the source code of the Services.</li>
            <li>Use the Services to transmit malware, spam, or infringing, unlawful, or harmful content.</li>
            <li>Attempt to gain unauthorized access, disrupt service integrity, or perform penetration testing without written consent.</li>
            <li>Use the Services for high-risk activities where failure could result in death or serious injury.</li>
            <li>Misrepresent affiliation, impersonate others, or use the Services in violation of applicable law.</li>
          </ul>
          <p>ReturnShield may suspend access for violations of this section with reasonable notice when practicable.</p>
        </section>

        <section>
          <h2>6. Integrations and third-party services</h2>
          <p>
            Customer may enable integrations with third-party platforms (e.g., Shopify, helpdesk, ESPs). Customer
            consents to the transfer of Customer Data to and from such services. ReturnShield is not responsible for the
            availability, security, or functionality of third-party services and disclaims liability for them.
          </p>
        </section>

        <section>
          <h2>7. Fees and payment</h2>
          <ul>
            <li>Fees are specified in the applicable Order Form or online subscription plan.</li>
            <li>Invoices are due within 30 days unless otherwise stated. Late payments may incur finance charges (1.5% per month or the maximum permitted by law) and suspension of the Services.</li>
            <li>Fees are exclusive of taxes. Customer is responsible for applicable taxes, except for taxes based on ReturnShield’s net income.</li>
          </ul>
        </section>

        <section>
          <h2>8. Confidentiality</h2>
          <p>
            Each party agrees to use reasonable care to protect the other party’s confidential information (“Confidential
            Information”) and only use it to fulfill obligations under these Terms. Confidential Information excludes
            information that is publicly available, known prior to disclosure, independently developed, or rightfully
            received from a third party.
          </p>
        </section>

        <section>
          <h2>9. Intellectual property</h2>
          <ul>
            <li>ReturnShield owns all rights, title, and interest in the Services, including software, documentation,
              logos, trademarks, and improvements. No rights are granted except as expressly stated.</li>
            <li>Customer may provide feedback or suggestions. ReturnShield may use feedback without obligation.</li>
          </ul>
        </section>

        <section>
          <h2>10. Warranties and disclaimers</h2>
          <ul>
            <li>ReturnShield warrants that it will provide the Services in a professional manner and substantially in accordance with documentation.</li>
            <li>EXCEPT AS EXPRESSLY PROVIDED, THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE.” RETURNSHIELD DISCLAIMS ALL IMPLIED WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</li>
            <li>ReturnShield does not guarantee that the Services will be uninterrupted, error-free, or produce specific revenue outcomes.</li>
          </ul>
        </section>

        <section>
          <h2>11. Limitation of liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY WILL BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            CONSEQUENTIAL, SPECIAL, OR EXEMPLARY DAMAGES (INCLUDING LOST PROFITS, LOSS OF DATA, OR BUSINESS INTERRUPTION)
            EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. RETURNSHIELD’S TOTAL LIABILITY FOR ALL CLAIMS IN ANY 12
            MONTH PERIOD WILL NOT EXCEED THE AMOUNTS PAID BY CUSTOMER FOR THE SERVICES DURING THAT PERIOD.
          </p>
        </section>

        <section>
          <h2>12. Indemnification</h2>
          <ul>
            <li>
              ReturnShield will defend and indemnify Customer against third-party claims alleging that the Services
              infringe a valid U.S. patent, trademark, or copyright, provided Customer promptly notifies ReturnShield and
              cooperates in the defense. ReturnShield may modify the Services or refund prepaid fees if it cannot resolve a claim.
            </li>
            <li>
              Customer will defend and indemnify ReturnShield against claims arising from Customer Data, breach of these
              Terms, or violations of applicable law.
            </li>
          </ul>
        </section>

        <section>
          <h2>13. Term and termination</h2>
          <ul>
            <li>These Terms remain in effect while Customer uses the Services or until terminated.</li>
            <li>Either party may terminate for material breach with 30 days’ written notice if the breach is not cured.</li>
            <li>Upon termination, Customer must cease use of the Services, and ReturnShield will delete or return Customer Data per the Privacy Policy and mutually agreed retention schedules.</li>
          </ul>
        </section>

        <section>
          <h2>14. Governing law and dispute resolution</h2>
          <p>
            These Terms are governed by the laws of the State of Texas, USA, without regard to conflict of law rules. The
            parties will attempt to resolve disputes through good-faith negotiations. If unresolved, disputes will be
            submitted to binding arbitration in Austin, Texas, under the Commercial Arbitration Rules of the American
            Arbitration Association. Either party may seek injunctive relief in any court of competent jurisdiction for
            infringement or misuse of intellectual property or Confidential Information.
          </p>
        </section>

        <section>
          <h2>15. Compliance</h2>
          <p>
            Each party will comply with applicable laws, including privacy regulations (GDPR, UK GDPR, CPRA), export
            controls, and economic sanctions. Customer is responsible for obtaining necessary consents from its
            end-customers for the processing and transfer of Customer Data into the Services.
          </p>
        </section>

        <section>
          <h2>16. Updates to these Terms</h2>
          <p>
            We may modify these Terms to reflect changes in the Services or applicable law. Material changes will be
            communicated by email or in-product notification at least 14 days before the effective date. Continued use of
            the Services after the effective date constitutes acceptance of the updated Terms.
          </p>
        </section>

        <section>
          <h2>17. Miscellaneous</h2>
          <ul>
            <li>Each party is an independent contractor. These Terms do not create a partnership, joint venture, or agency relationship.</li>
            <li>Neither party may assign these Terms without the other party’s consent, except to an affiliate or in connection with a merger or sale of substantially all assets.</li>
            <li>If any provision is held unenforceable, the remaining provisions remain in effect.</li>
            <li>Failure to enforce a provision does not constitute a waiver.</li>
          </ul>
        </section>

        <section>
          <h2>18. Contact</h2>
          <p>Questions about these Terms should be directed to:</p>
          <address>
            ReturnShield Inc.
            <br />
            Legal Department
            <br />
            1200 Commerce Avenue, Suite 400
            <br />
            Austin, TX 78701 USA
            <br />
            <a href="mailto:legal@returnshield.app">legal@returnshield.app</a>
          </address>
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
