import { Link } from 'react-router-dom'
import posthog from 'posthog-js'
import { withUtm } from '../utils/utm'

export function ExchangeAutopilot() {
    return (
        <section id="autopilot" className="autopilot-preview">
            <header>
                <span className="tagline">Exchange Autopilot</span>
                <h2>Automate the swap before a refund can settle.</h2>
                <p>
                    Redirect refund intent into curated exchanges, bonus credits, and concierge outreach. Exchange Autopilot plugs
                    into your existing helpdesk and 3PL in under a day.
                </p>
            </header>
            <div className="autopilot-grid">
                <article>
                    <h3>Intercept refund intent</h3>
                    <p>Dynamic CTAs and AI sizing recommendations guide shoppers to the right replacement instantly.</p>
                </article>
                <article>
                    <h3>Automate fulfillment & comms</h3>
                    <p>Trigger Shopify swaps, notify your 3PL, and send branded updates without touching a ticket.</p>
                </article>
                <article>
                    <h3>Measure ROI in real time</h3>
                    <p>Dashboards track exchange adoption, saved margin, and loyalty gains automatically.</p>
                </article>
            </div>
            <div className="autopilot-actions">
                <Link
                    to="/exchange-automation"
                    className="btn btn-primary"
                    onClick={() => posthog.capture('cta_click', { cta: 'deep_dive_exchange_autopilot' })}
                >
                    Explore Exchange Autopilot
                </Link>
                <a
                    className="btn btn-secondary"
                    href={withUtm('https://app.returnshield.app/register?plan=scale', 'autopilot_launch_scale')}
                    onClick={() => posthog.capture('cta_click', { cta: 'launch_exchange_autopilot' })}
                >
                    Launch in my store
                </a>
            </div>
        </section>
    )
}
