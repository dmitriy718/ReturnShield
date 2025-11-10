import { Link } from 'react-router-dom'
import './CheckoutSuccessPage.css'

export function CheckoutSuccessPage() {
  return (
    <div className="checkout-success">
      <div className="success-card">
        <span className="success-icon" aria-hidden="true">
          ✓
        </span>
        <h2>Subscription confirmed</h2>
        <p>
          Thanks for upgrading! Your billing portal email has been sent and automation features are ready to configure.
          Jump back into the dashboard to activate the Exchange Coach or head to automation to launch a playbook.
        </p>
        <div className="success-actions">
          <Link to="/" className="btn-primary">
            View dashboard
          </Link>
          <Link to="/automation" className="btn-secondary">
            Launch automation
          </Link>
        </div>
      </div>
    </div>
  )
}

