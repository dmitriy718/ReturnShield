import posthog from 'posthog-js'
import { withUtm } from '../utils/utm'

type PricingProps = {
    handlePlanCheckout: (planKey: string) => void
    checkoutLoadingPlan: string | null
    checkoutError: string | null
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

export function Pricing({ handlePlanCheckout, checkoutLoadingPlan, checkoutError }: PricingProps) {
    const pricingTiers = [
        {
            slug: 'launch',
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
            slug: 'scale',
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
            slug: 'elite',
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

    return (
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
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handlePlanCheckout(plan.slug)}
                            disabled={checkoutLoadingPlan === plan.slug}
                        >
                            {checkoutLoadingPlan === plan.slug ? 'Redirecting to checkout…' : plan.cta}
                        </button>
                    </article>
                ))}
            </div>
            {checkoutError ? (
                <p className="pricing-error" role="alert">
                    {checkoutError}
                </p>
            ) : null}
            <div className="pricing-cta">
                <a
                    href={withUtm('https://app.returnshield.app/register', 'pricing_secondary_cta')}
                    className="btn btn-secondary btn-prominent"
                    onClick={() => posthog.capture('cta_click', { cta: 'turn_returns_into_relationships' })}
                >
                    Turn Returns into Relationships
                </a>
            </div>
        </section>
    )
}
