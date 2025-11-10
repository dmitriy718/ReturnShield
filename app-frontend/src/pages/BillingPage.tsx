import { useMemo, useState } from 'react'
import { apiFetch, ApiError } from '../services/api'
import './BillingPage.css'

type Plan = {
  slug: 'launch' | 'scale' | 'elite'
  name: string
  price: string
  description: string
  features: string[]
  priceId?: string
}

const plans: Plan[] = [
  {
    slug: 'launch',
    name: 'Launch',
    price: '$29 / month',
    description: 'Foundational insights and policy automation for emerging brands.',
    features: [
      'Return & exchange analytics updated daily',
      'Email notifications for at-risk SKUs',
      'Manual policy export templates',
      'Email support within 24 hours',
    ],
  },
  {
    slug: 'scale',
    name: 'Scale',
    price: '$99 / month',
    description: 'Automate exchange-first workflows and unlock VIP resolution hub.',
    features: [
      'Everything in Launch',
      'AI Exchange Coach with weekly playbooks',
      'VIP Resolution Hub for loyalty segments',
      'Slack alerts + Zendesk macros',
    ],
  },
  {
    slug: 'elite',
    name: 'Elite',
    price: '$249 / month',
    description: 'Advanced automation with concierge support for high-volume operators.',
    features: [
      'Everything in Scale',
      'Returnless keep-it routing engine',
      'Dedicated automation strategist',
      'Custom report exports & deep dives',
    ],
  },
]

export function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const priceMap = useMemo(
    () => ({
      launch: import.meta.env.VITE_STRIPE_PRICE_LAUNCH as string | undefined,
      scale: import.meta.env.VITE_STRIPE_PRICE_SCALE as string | undefined,
      elite: import.meta.env.VITE_STRIPE_PRICE_ELITE as string | undefined,
    }),
    [],
  )

  const startCheckout = async (plan: Plan) => {
    const priceId = priceMap[plan.slug]
    if (!priceId) {
      setError(`Stripe price ID is missing for the ${plan.name} plan.`)
      return
    }
    setSelectedPlan(plan)
    setLoadingPlan(plan.slug)
    setError(null)
    try {
      const successUrl = `${window.location.origin}/billing/success`
      const cancelUrl = `${window.location.origin}/billing`
      const response = await apiFetch<{ checkout_url: string }>('/billing/create-checkout-session/', {
        method: 'POST',
        body: JSON.stringify({
          plan: plan.slug,
          price_id: priceId,
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
      })
      window.location.href = response.checkout_url
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.detail ?? err.message)
      } else {
        setError('Unable to start checkout. Please try again or contact support.')
      }
      setLoadingPlan(null)
    }
  }

  return (
    <div className="billing-page">
      <header className="billing-header">
        <h2>Select the plan that matches your returns volume</h2>
        <p>
          Upgrade in seconds with Stripe. Plans can be changed or cancelled any time. Exchange automation and VIP hub
          unlock on the Scale tier.
        </p>
      </header>

      {error && (
        <div className="billing-error">
          <p>{error}</p>
        </div>
      )}

      <div className="plan-grid">
        {plans.map((plan) => (
          <article key={plan.slug} className={selectedPlan?.slug === plan.slug ? 'plan-card plan-selected' : 'plan-card'}>
            <header>
              <h3>{plan.name}</h3>
              <p className="plan-price">{plan.price}</p>
              <p className="plan-description">{plan.description}</p>
            </header>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => startCheckout(plan)}
              disabled={loadingPlan === plan.slug}
              className="plan-cta"
            >
              {loadingPlan === plan.slug ? 'Redirecting to Stripe…' : 'Start subscription'}
            </button>
          </article>
        ))}
      </div>

      <footer className="billing-footer">
        <p>
          Need enterprise return routing or bespoke analytics?{' '}
          <a href="mailto:hello@returnshield.app?subject=ReturnShield%20Enterprise%20Inquiry">Contact our team</a>.
        </p>
      </footer>
    </div>
  )
}

