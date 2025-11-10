import { Link } from 'react-router-dom'
import './NotFoundPage.css'

export function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="not-found-card">
        <h1>We couldn’t find that page</h1>
        <p>
          The link you followed might be outdated or the page could have moved. Head back to the dashboard and continue
          optimising your returns.
        </p>
        <Link to="/" className="btn-primary">
          Return to dashboard
        </Link>
        <Link to="/billing" className="btn-secondary">
          View plans
        </Link>
      </div>
    </div>
  )
}

