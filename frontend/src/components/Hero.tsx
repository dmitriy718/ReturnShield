import { Link } from 'react-router-dom'
import posthog from 'posthog-js'
import { withUtm } from '../utils/utm'
import { formatCurrency, formatNumber, formatHours } from '../utils/format'

type HeroProps = {
    liveImpact: {
        revenueProtectedQuarter: number
        landfillDiverted: number
        hoursReturned: number
    }
}

export function Hero({ liveImpact }: HeroProps) {
    return (
        <section className="hero">
            <div className="hero-content">
                <span className="tagline">Stop losing money on returns</span>
                <h1>Return insights that actually make sense.</h1>
                <p className="hero-subtitle">
                    ReturnShield turns messy return data into revenue-saving actions. Detect operational leaks, automate smarter policies, and prove the ROI of every fulfillment decision.
                </p>
                <div className="impact-ticker">
                    <div>
                        <span className="ticker-label">Revenue protected (90 days)</span>
                        <strong>{formatCurrency(liveImpact.revenueProtectedQuarter)}</strong>
                    </div>
                    <div>
                        <span className="ticker-label">Landfill diverted</span>
                        <strong>{formatNumber(liveImpact.landfillDiverted, 0)} lbs</strong>
                    </div>
                    <div>
                        <span className="ticker-label">CX hours returned</span>
                        <strong>{formatHours(liveImpact.hoursReturned)}</strong>
                    </div>
                </div>
                <div className="hero-cta">
                    <a
                        className="btn btn-primary"
                        href={withUtm('https://app.returnshield.app/register', 'hero_primary_cta')}
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
                        <a
                            className="btn btn-secondary btn-compact"
                            href={withUtm('https://app.returnshield.app/register', 'hero_proof_start')}
                            onClick={() => posthog.capture('cta_click', { cta: 'turn_returns_into_relationships' })}
                        >
                            Turn Returns into Relationships
                        </a>
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
    )
}
