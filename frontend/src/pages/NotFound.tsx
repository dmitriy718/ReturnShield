import { Link } from 'react-router-dom'
import '../App.css'

export default function NotFoundPage() {
  return (
    <div className="page not-found">
      <div className="not-found-hero">
        <span className="tagline">404 · Off the return path</span>
        <h1>We couldn’t find that page, but we can rescue your returns.</h1>
        <p>
          The link you followed doesn’t exist. While you’re here, explore how ReturnShield transforms refunds into
          retention wins and protects every shipment from leaking revenue.
        </p>
      </div>

      <div className="not-found-actions">
        <Link className="btn btn-primary" to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Start Preventing Returns
        </Link>
        <Link className="btn btn-secondary" to="/exchange-automation">
          Unlock Your ReturnShield Effect
        </Link>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            const faq = document.getElementById('faq')
            if (faq) {
              faq.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }}
        >
          See the Why Behind Returns
        </button>
      </div>

      <div className="not-found-grid">
        <article>
          <h2>What you can do next</h2>
          <ul>
            <li>Return to the dashboard to analyze return hotspots.</li>
            <li>Visit Exchange Autopilot and convert refunds to exchanges automatically.</li>
            <li>Chat with our concierge team to tailor playbooks for your brand.</li>
          </ul>
        </article>
        <article>
          <h2>Need help immediately?</h2>
          <p>
            Email <a href="mailto:concierge@returnshield.app">concierge@returnshield.app</a> and a ReturnShield operator
            will help you recover the page (and your revenue) in minutes.
          </p>
          <Link className="btn btn-link" to="/privacy">
            Review Privacy Commitments
          </Link>
        </article>
      </div>
    </div>
  )
}
