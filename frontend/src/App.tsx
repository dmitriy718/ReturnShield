import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, MouseEvent as ReactMouseEvent } from 'react'
import posthog from 'posthog-js'
import logoMark from './assets/logo-mark.svg'
import './App.css'

type ReturnlessCandidate = {
  sku: string
  productName: string
  avgUnitCost: number
  returnVolume30d: number
  reasonDriver: string
  estimatedMarginRecaptured: number
  carbonKgPrevented: number
  landfillLbsPrevented: number
  handlingMinutesReduced: number
  recommendedActions: string[]
}

type ReturnlessInsights = {
  summary: {
    period: string
    annualizedMarginRecovery: number
    carbonTonnesPrevented: number
    landfillLbsPrevented: number
    manualHoursReduced: number
  }
  candidates: ReturnlessCandidate[]
  playbook: string[]
}

const fallbackReturnlessInsights: ReturnlessInsights = {
  summary: {
    period: 'last_30_days',
    annualizedMarginRecovery: 53520,
    carbonTonnesPrevented: 0.28,
    landfillLbsPrevented: 592,
    manualHoursReduced: 5.6,
  },
  candidates: [
    {
      sku: 'RS-014',
      productName: 'Luxe Knit Throw',
      avgUnitCost: 18.5,
      returnVolume30d: 42,
      reasonDriver: 'Texture / feel not as expected',
      estimatedMarginRecaptured: 1240,
      carbonKgPrevented: 85,
      landfillLbsPrevented: 180,
      handlingMinutesReduced: 96,
      recommendedActions: [
        'Auto-approve returnless refund with 12% exchange credit coupon.',
        'Tag SKU for donation pickup with GiveBack Box.',
      ],
    },
    {
      sku: 'RS-221',
      productName: 'Everyday Bamboo Tee',
      avgUnitCost: 9.25,
      returnVolume30d: 136,
      reasonDriver: 'Fit feedback · relaxed cut',
      estimatedMarginRecaptured: 2280,
      carbonKgPrevented: 132,
      landfillLbsPrevented: 264,
      handlingMinutesReduced: 168,
      recommendedActions: [
        'Serve AI sizing quiz before checkout for repeat buyers.',
        'Offer returnless refund with keep-it note referencing sustainability pledge.',
      ],
    },
    {
      sku: 'RS-091',
      productName: 'Ceramic Mood Candle',
      avgUnitCost: 7.4,
      returnVolume30d: 58,
      reasonDriver: 'Minor packaging blemish',
      estimatedMarginRecaptured: 940,
      carbonKgPrevented: 64,
      landfillLbsPrevented: 148,
      handlingMinutesReduced: 72,
      recommendedActions: [
        'Bundle blemished units for outlet flash sale.',
        'Message VIP segment with 2-for-1 rescue offer.',
      ],
    },
  ],
  playbook: [
    'Keep-it refund for sub-$15 cost of goods when reverse logistics > 65% of margin.',
    'Tag donation-ready SKUs in Shopify metafields and sync nightly with fulfillment center.',
    'Trigger SendGrid sustainability story 48h after refund to reinforce loyalty.',
    'Track impact dashboards weekly: landfill diverted, CO₂e prevented, margin recaptured.',
  ],
}

type ReturnlessApiCandidate = {
  sku?: string
  product_name?: string
  avg_unit_cost?: number
  return_volume_30d?: number
  reason_driver?: string
  estimated_margin_recaptured?: number
  carbon_kg_prevented?: number
  landfill_lbs_prevented?: number
  handling_minutes_reduced?: number
  recommended_actions?: string[]
}

type ReturnlessApiPayload = {
  summary?: {
    period?: string
    annualized_margin_recovery?: number
    carbon_tonnes_prevented?: number
    landfill_lbs_prevented?: number
    manual_hours_reduced?: number
  }
  candidates?: ReturnlessApiCandidate[]
  playbook?: string[]
}

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

const formatCurrencyWithCents = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })

const formatPercent = (value: number, digits = 0) => `${(value * 100).toFixed(digits)}%`

const formatNumber = (value: number, digits = 0) =>
  value.toLocaleString('en-US', { maximumFractionDigits: digits })
const formatHours = (value: number) => `${value.toFixed(1)} hrs`

const stripePriceLookup: Record<'launch' | 'scale' | 'elite', string> = {
  launch: (import.meta.env.VITE_STRIPE_PRICE_LAUNCH as string | undefined) ?? '',
  scale: (import.meta.env.VITE_STRIPE_PRICE_SCALE as string | undefined) ?? '',
  elite: (import.meta.env.VITE_STRIPE_PRICE_ELITE as string | undefined) ?? '',
}

type ExchangeCoachAction = {
  sku: string
  headline: string
  description: string
  recommendedPlay: string[]
  estimatedMonthlyUplift: number
  impactScore: number
  metrics: {
    returnVolume30d: number
    avgUnitCost: number
    marginAtRisk: number
  }
}

type ExchangeCoachSummary = {
  period: string
  aggregateMarginAtRisk: number
  projectedExchangeUplift: number
}

type ExchangeCoachPayload = {
  actions: ExchangeCoachAction[]
  summary: ExchangeCoachSummary
}

type VIPQueueEntry = {
  ticketId: string
  customer: string
  loyaltySegment: string
  ltv: number
  orderValue: number
  returnReason: string
  recommendedAction: string
  hoursOpen: number
  predictedChurnRisk: number
  sku: string
}

type VIPQueueSummary = {
  openTickets: number
  avgHoursOpen: number
  revenueDefended: number
  opsHoursReturned: number
}

type VIPQueuePayload = {
  queue: VIPQueueEntry[]
  summary: VIPQueueSummary
}

const fallbackCoach: ExchangeCoachPayload = {
  actions: [
    {
      sku: 'PORTFOLIO',
      headline: 'Activate keep-it credits for low-margin SKUs',
      description: 'Returnless automation prevents unnecessary shipping and accelerates repeat orders.',
      recommendedPlay: [
        'Enable keep-it mode when reverse logistics cost is >65% of unit margin.',
        'Auto-enroll shoppers receiving keep-it credit into the loyalty win-back flow.',
        'Highlight sustainability impact in the follow-up email to reinforce loyalty.',
      ],
      estimatedMonthlyUplift: 2174.8,
      impactScore: 1227.68,
      metrics: {
        returnVolume30d: 236,
        avgUnitCost: 11.72,
        marginAtRisk: 4460,
      },
    },
    {
      sku: 'RS-221',
      headline: 'Convert Everyday Bamboo Tee refunds into bonus exchanges',
      description: 'Fit feedback · relaxed cut',
      recommendedPlay: [
        'Swap refund CTA with exchange-first modal offering 12% bonus credit.',
        'Pre-build Shopify exchange templates for the top three replacement SKUs.',
        'Trigger PostHog alert if refund intent stays above 15% after 7 days.',
      ],
      estimatedMonthlyUplift: 866.4,
      impactScore: 1623.5,
      metrics: {
        returnVolume30d: 136,
        avgUnitCost: 9.25,
        marginAtRisk: 2280,
      },
    },
    {
      sku: 'RS-014',
      headline: 'Convert Luxe Knit Throw refunds into bonus exchanges',
      description: 'Texture / feel not as expected',
      recommendedPlay: [
        'Swap refund CTA with exchange-first modal offering 12% bonus credit.',
        'Pre-build Shopify exchange templates for the top three replacement SKUs.',
        'Trigger PostHog alert if refund intent stays above 15% after 7 days.',
      ],
      estimatedMonthlyUplift: 471.2,
      impactScore: 807.7,
      metrics: {
        returnVolume30d: 42,
        avgUnitCost: 18.5,
        marginAtRisk: 1240,
      },
    },
    {
      sku: 'RS-091',
      headline: 'Convert Ceramic Mood Candle refunds into bonus exchanges',
      description: 'Minor packaging blemish',
      recommendedPlay: [
        'Swap refund CTA with exchange-first modal offering 12% bonus credit.',
        'Pre-build Shopify exchange templates for the top three replacement SKUs.',
        'Trigger PostHog alert if refund intent stays above 15% after 7 days.',
      ],
      estimatedMonthlyUplift: 357.2,
      impactScore: 586.84,
      metrics: {
        returnVolume30d: 58,
        avgUnitCost: 7.4,
        marginAtRisk: 940,
      },
    },
  ],
  summary: {
    period: 'last_30_days',
    aggregateMarginAtRisk: 4460,
    projectedExchangeUplift: 3869.6,
  },
}

const fallbackVip: VIPQueuePayload = {
  queue: [
    {
      ticketId: 'VIP-RS-1420',
      customer: 'Leah Ortega',
      loyaltySegment: 'Platinum',
      ltv: 3916.8,
      orderValue: 59.84,
      returnReason: 'Texture / feel not as expected',
      recommendedAction: 'Concierge exchange with complimentary shipping upgrade',
      hoursOpen: 2.5,
      predictedChurnRisk: 8,
      sku: 'RS-014',
    },
    {
      ticketId: 'VIP-RS-1421',
      customer: 'Marcus Lin',
      loyaltySegment: 'Gold',
      ltv: 6407.6,
      orderValue: 42,
      returnReason: 'Fit feedback · relaxed cut',
      recommendedAction: 'Concierge exchange with complimentary shipping upgrade',
      hoursOpen: 3.8,
      predictedChurnRisk: 47.68,
      sku: 'RS-221',
    },
    {
      ticketId: 'VIP-RS-1422',
      customer: 'Kaya Gomez',
      loyaltySegment: 'Gold',
      ltv: 2865.6,
      orderValue: 32.56,
      returnReason: 'Minor packaging blemish',
      recommendedAction: 'Instant keep-it refund with sustainability reinforcement',
      hoursOpen: 5.1,
      predictedChurnRisk: 17.04,
      sku: 'RS-091',
    },
  ],
  summary: {
    openTickets: 3,
    avgHoursOpen: 3.8,
    revenueDefended: 903.15,
    opsHoursReturned: 7.2,
  },
}

function App() {
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()
  const navigateInternal = useNavigate()
  const [monthlyOrders, setMonthlyOrders] = useState<number>(350)
  const [averageOrderValue, setAverageOrderValue] = useState<number>(92)
  const [returnRate, setReturnRate] = useState<number>(0.17)
  const [checkoutLoadingPlan, setCheckoutLoadingPlan] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [returnlessInsights, setReturnlessInsights] = useState<ReturnlessInsights>(fallbackReturnlessInsights)
  const [coachData, setCoachData] = useState<ExchangeCoachPayload>(fallbackCoach)
  const [vipData, setVipData] = useState<VIPQueuePayload>(fallbackVip)

  const apiBaseUrl = ((import.meta.env.VITE_API_URL as string | undefined) || '').replace(/\/$/, '')

  const roiMetrics = useMemo(() => {
    const projectedReduction = 0.23
    const exchangeCaptureRate = 0.42
    const monthlyGrossSales = monthlyOrders * averageOrderValue
    const currentReturnLoss = monthlyGrossSales * returnRate
    const refundsPrevented = currentReturnLoss * projectedReduction
    const exchangeRevenue = monthlyOrders * returnRate * exchangeCaptureRate * averageOrderValue
    const totalReclaimed = refundsPrevented + exchangeRevenue
    const returnRateAfter = Math.max(returnRate * (1 - projectedReduction), 0)
    const roiMultiple = totalReclaimed / 100
    return {
      monthlyGrossSales,
      currentReturnLoss,
      refundsPrevented,
      exchangeRevenue,
      totalReclaimed,
      returnRateAfter,
      roiMultiple,
      projectedReduction,
      exchangeCaptureRate,
    }
  }, [averageOrderValue, monthlyOrders, returnRate])

  const liveImpact = useMemo(() => {
    const revenueProtectedQuarter = coachData.summary.projectedExchangeUplift * 3
    const landfillDiverted = returnlessInsights.summary.landfillLbsPrevented
    const hoursReturned = returnlessInsights.summary.manualHoursReduced + vipData.summary.opsHoursReturned
    return {
      revenueProtectedQuarter,
      landfillDiverted,
      hoursReturned,
    }
  }, [coachData.summary.projectedExchangeUplift, returnlessInsights.summary, vipData.summary])

  const handleMonthlyOrdersChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value)
    if (!Number.isNaN(next)) {
      setMonthlyOrders(Math.max(0, Math.min(2000, Math.round(next))))
    }
  }

  const handleAverageOrderValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value)
    if (!Number.isNaN(next)) {
      setAverageOrderValue(Math.max(0, Math.min(500, Math.round(next))))
    }
  }

  const handleReturnRateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value)
    if (!Number.isNaN(next)) {
      setReturnRate(Math.max(0, Math.min(0.5, next)))
    }
  }

  const transformReturnlessPayload = (payload: ReturnlessApiPayload | null | undefined): ReturnlessInsights => {
    const summary = payload?.summary ?? {}
    const rawCandidates: ReturnlessApiCandidate[] = Array.isArray(payload?.candidates)
      ? (payload?.candidates as ReturnlessApiCandidate[])
      : []
    const rawPlaybook: string[] = Array.isArray(payload?.playbook) ? (payload?.playbook as string[]) : []
    return {
      summary: {
        period: summary.period ?? fallbackReturnlessInsights.summary.period,
        annualizedMarginRecovery:
          summary.annualized_margin_recovery ?? fallbackReturnlessInsights.summary.annualizedMarginRecovery,
        carbonTonnesPrevented:
          summary.carbon_tonnes_prevented ?? fallbackReturnlessInsights.summary.carbonTonnesPrevented,
        landfillLbsPrevented:
          summary.landfill_lbs_prevented ?? fallbackReturnlessInsights.summary.landfillLbsPrevented,
        manualHoursReduced: summary.manual_hours_reduced ?? fallbackReturnlessInsights.summary.manualHoursReduced,
      },
      candidates: rawCandidates.map((item: ReturnlessApiCandidate) => ({
        sku: item.sku ?? '',
        productName: item.product_name ?? '',
        avgUnitCost: item.avg_unit_cost ?? 0,
        returnVolume30d: item.return_volume_30d ?? 0,
        reasonDriver: item.reason_driver ?? '',
        estimatedMarginRecaptured: item.estimated_margin_recaptured ?? 0,
        carbonKgPrevented: item.carbon_kg_prevented ?? 0,
        landfillLbsPrevented: item.landfill_lbs_prevented ?? 0,
        handlingMinutesReduced: item.handling_minutes_reduced ?? 0,
        recommendedActions: Array.isArray(item.recommended_actions) ? item.recommended_actions : [],
      })),
      playbook: rawPlaybook.length > 0 ? rawPlaybook : fallbackReturnlessInsights.playbook,
    }
  }

const transformCoachPayload = (payload: any): ExchangeCoachPayload => {
  const summary = payload?.summary ?? {}
  const actions = Array.isArray(payload?.actions)
    ? payload.actions.map((item: any) => ({
        sku: item?.sku ?? '',
        headline: item?.headline ?? '',
        description: item?.description ?? '',
        recommendedPlay: Array.isArray(item?.recommended_play) ? item.recommended_play : [],
        estimatedMonthlyUplift: Number(item?.estimated_monthly_uplift ?? 0),
        impactScore: Number(item?.impact_score ?? 0),
        metrics: {
          returnVolume30d: Number(item?.metrics?.return_volume_30d ?? 0),
          avgUnitCost: Number(item?.metrics?.avg_unit_cost ?? 0),
          marginAtRisk: Number(item?.metrics?.margin_at_risk ?? 0),
        },
      }))
    : []

  return {
    actions: actions.length > 0 ? actions : fallbackCoach.actions,
    summary: {
      period: summary.period ?? fallbackCoach.summary.period,
      aggregateMarginAtRisk: Number(summary.aggregate_margin_at_risk ?? fallbackCoach.summary.aggregateMarginAtRisk),
      projectedExchangeUplift: Number(
        summary.projected_exchange_uplift ?? fallbackCoach.summary.projectedExchangeUplift,
      ),
    },
  }
}

const transformVipPayload = (payload: any): VIPQueuePayload => {
  const summary = payload?.summary ?? {}
  const queue = Array.isArray(payload?.queue)
    ? payload.queue.map((item: any) => ({
        ticketId: item?.ticket_id ?? '',
        customer: item?.customer ?? '',
        loyaltySegment: item?.loyalty_segment ?? '',
        ltv: Number(item?.ltv ?? 0),
        orderValue: Number(item?.order_value ?? 0),
        returnReason: item?.return_reason ?? '',
        recommendedAction: item?.recommended_action ?? '',
        hoursOpen: Number(item?.hours_open ?? 0),
        predictedChurnRisk: Number(item?.predicted_churn_risk ?? 0),
        sku: item?.sku ?? '',
      }))
    : []

  return {
    queue: queue.length > 0 ? queue : fallbackVip.queue,
    summary: {
      openTickets: Number(summary.open_tickets ?? fallbackVip.summary.openTickets),
      avgHoursOpen: Number(summary.avg_hours_open ?? fallbackVip.summary.avgHoursOpen),
      revenueDefended: Number(summary.revenue_defended ?? fallbackVip.summary.revenueDefended),
      opsHoursReturned: Number(summary.ops_hours_returned ?? fallbackVip.summary.opsHoursReturned),
    },
  }
}

  useEffect(() => {
    if (!apiBaseUrl) {
      return
    }
    const controller = new AbortController()
    const loadInsights = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/returns/returnless-insights/`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`Returnless insights request failed with status ${response.status}`)
        }
        const payload = await response.json()
        if (!controller.signal.aborted) {
          const parsed = transformReturnlessPayload(payload)
          setReturnlessInsights(parsed)
          posthog.capture('returnless_insights_loaded', {
            source: 'marketing_site',
            sku_count: parsed.candidates.length,
            period: parsed.summary.period,
          })
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Unable to fetch returnless insights', error)
        }
      }
    }

    void loadInsights()

    return () => {
      controller.abort()
    }
  }, [apiBaseUrl])

  useEffect(() => {
    if (!apiBaseUrl) {
      return
    }
    const controller = new AbortController()
    const loadCoachAndVip = async () => {
      try {
        const [coachRes, vipRes] = await Promise.all([
          fetch(`${apiBaseUrl}/returns/exchange-coach/`, { signal: controller.signal }),
          fetch(`${apiBaseUrl}/returns/vip-resolution/`, { signal: controller.signal }),
        ])
        if (coachRes.ok) {
          const rawCoach = await coachRes.json()
          if (!controller.signal.aborted) {
            setCoachData(transformCoachPayload(rawCoach))
          }
        }
        if (vipRes.ok) {
          const rawVip = await vipRes.json()
          if (!controller.signal.aborted) {
            setVipData(transformVipPayload(rawVip))
          }
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Unable to fetch coach or VIP data', error)
        }
      }
    }

    void loadCoachAndVip()
    return () => controller.abort()
  }, [apiBaseUrl])

  useEffect(() => {
    if (navOpen) {
      document.body.classList.add('no-scroll')
    } else {
      document.body.classList.remove('no-scroll')
    }
  }, [navOpen])

  useEffect(() => {
    const state = (location.state as { scrollTo?: string } | null) || {}
    if (state.scrollTo) {
      requestAnimationFrame(() => {
        const target = document.getElementById(state.scrollTo!)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        navigateInternal(location.pathname, { replace: true, state: {} })
      })
    }
  }, [location, navigateInternal])

  const scrollToId = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleNavScroll = (id: string) => {
    setNavOpen(false)
    if (window.location.pathname === '/') {
      scrollToId(id)
    } else {
      navigateInternal('/', { state: { scrollTo: id } })
    }
  }

  const handleFooterLink = (event: ReactMouseEvent<HTMLAnchorElement>, path: string) => {
    setNavOpen(false)
    if (window.location.pathname === path) {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePlanCheckout = async (planKey: string) => {
    setCheckoutError(null)
    setCheckoutLoadingPlan(planKey)
    posthog.capture('pricing_checkout_attempt', { plan: planKey })

    const normalizedPlan = planKey.toLowerCase() as keyof typeof stripePriceLookup
    const priceId = stripePriceLookup[normalizedPlan]
    if (!priceId) {
      setCheckoutError('Selected plan is not available right now. Please contact concierge@returnshield.app.')
      setCheckoutLoadingPlan(null)
      posthog.capture('pricing_checkout_error', { plan: planKey, reason: 'missing_price_id' })
      return
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/billing/create-checkout-session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planKey, price_id: priceId }),
      })

      if (!response.ok) {
        throw new Error(`Checkout initiation failed with status ${response.status}`)
      }

      const data: { checkout_url?: string } = await response.json()

      if (!data.checkout_url) {
        throw new Error('Stripe response missing checkout URL')
      }

      posthog.capture('pricing_checkout_redirect', { plan: planKey })
      window.location.href = data.checkout_url
    } catch (error) {
      console.error(error)
      setCheckoutError(
        "We couldn't launch checkout just now. Please verify billing is configured or reach out to concierge@returnshield.app."
      )
      posthog.capture('pricing_checkout_error', { plan: planKey })
    } finally {
      setCheckoutLoadingPlan(null)
    }
  }
  const metrics = [
    {
      label: 'Return rate reduction',
      value: '23%',
      detail: 'Average drop within 60 days of activation.',
    },
    {
      label: 'Monthly revenue protected',
      value: '$48K',
      detail: 'Median revenue brands keep every month with ReturnShield.',
    },
    {
      label: 'Time to live insights',
      value: '72 hrs',
      detail: 'From install to actionable SKU-level recommendations.',
    },
  ]

  const averageKeepItValue = useMemo(() => {
    if (!returnlessInsights.candidates.length) {
      return 0
    }
    const totalPerSku = returnlessInsights.candidates.reduce((accumulator, candidate) => {
      if (!candidate.returnVolume30d) {
        return accumulator
      }
      return accumulator + candidate.estimatedMarginRecaptured / candidate.returnVolume30d
    }, 0)
    return totalPerSku / returnlessInsights.candidates.length
  }, [returnlessInsights])

  const sustainabilityCards = useMemo(() => {
    const { summary } = returnlessInsights
    return [
      {
        label: 'Annualized margin recovered',
        value: formatCurrency(summary.annualizedMarginRecovery),
        detail: 'Projected savings from automated returnless authorizations.',
      },
      {
        label: 'Carbon emissions prevented',
        value: `${formatNumber(summary.carbonTonnesPrevented, 2)} t CO₂e`,
        detail: `Equivalent to avoiding ~${formatNumber(Math.round(summary.carbonTonnesPrevented * 1130))} last-mile deliveries.`,
      },
      {
        label: 'Landfill diverted',
        value: `${formatNumber(summary.landfillLbsPrevented, 0)} lbs`,
        detail: 'Kept out of landfill through donations and keep-it policies.',
      },
      {
        label: 'Team hours returned',
        value: `${formatNumber(summary.manualHoursReduced, 1)} hrs`,
        detail: 'Saved per month by skipping inspections and repacking.',
      },
    ]
  }, [returnlessInsights])

  const successStories = [
    {
      headline: 'Scaled apparel brand cut refunds by 26% in 60 days.',
      detail: 'AI Exchange Coach automated exchange-first flows across four high-risk SKUs.',
      cta: 'See apparel playbook',
      href: '/exchange-automation',
    },
    {
      headline: 'Subscription beauty merchant recovered $94K in Q2.',
      detail: 'VIP Resolution Hub prioritized top 5% customers and automated keep-it credits.',
      cta: 'Book a concierge review',
      href: '#signup',
    },
    {
      headline: 'Lifestyle retailer diverted 18K lbs from landfill.',
      detail: 'Returnless Impact Lab benchmarks guided donation + returnless decisions.',
      cta: 'Explore sustainability impact',
      href: '#impact',
    },
  ]

  const featureHighlights = [
    {
      title: 'SKU return heatmaps',
      description:
        'Pinpoint high-risk products, spot sizing issues, and trigger proactive interventions before refunds stack up.',
    },
    {
      title: 'Smart policy automation',
      description:
        'Auto-adjust policies by customer lifetime value, return reason, or shipping costs to protect your margins.',
    },
    {
      title: 'Cohort-grade reporting',
      description:
        'Understand which customer segments send the most returns and redirect them toward exchanges or store credit.',
    },
    {
      title: 'AI-written response templates',
      description:
        'Send empathetic, on-brand replies that deflect refunds and protect loyalty—ready in seconds, not hours.',
    },
  ]

  const onboardingSteps = [
    {
      title: 'Connect',
      body: 'Securely authenticate your Shopify storefront using the ReturnShield partner app and pull 12 months of order history.',
    },
    {
      title: 'Sync',
      body: 'Stripe activates billing, ReturnShield ingests return events, and our AI tags every claim with actionable insights.',
    },
    {
      title: 'See insights',
      body: 'Your dashboard lights up with prioritized savings opportunities, policy recommendations, and automation playbooks.',
    },
  ]

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

  const testimonials = [
    {
      quote:
        'We recaptured $62K in refund risk the first month. The dashboard surfaced one mislabeled SKU that explained 41% of our returns.',
      author: 'Riya Patel',
      role: 'COO, Oak & Ember Apparel',
    },
  ]

  return (
    <div className="page">
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
          <button type="button" className="nav-link-button" onClick={() => handleNavScroll('features')}>
            Features
          </button>
          <button type="button" className="nav-link-button" onClick={() => handleNavScroll('impact')}>
            Impact
          </button>
          <button type="button" className="nav-link-button" onClick={() => handleNavScroll('coach')}>
            AI Coach
          </button>
          <button type="button" className="nav-link-button" onClick={() => handleNavScroll('vip')}>
            VIP Hub
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
            <a className="link-muted" href="#login" onClick={() => setNavOpen(false)}>
              Log in
            </a>
            <a
              className="btn btn-primary"
              href="#signup"
              onClick={() => {
                setNavOpen(false)
                posthog.capture('cta_click', { cta: 'start_preventing_returns' })
              }}
            >
              Start Preventing Returns
            </a>
          </div>
        </nav>
        <div className="nav-actions">
          <a className="link-muted" href="#login">
            Log in
          </a>
          <a
            className="btn btn-primary btn-trial"
            href="#signup"
            onClick={() => posthog.capture('cta_click', { cta: 'start_preventing_returns' })}
          >
            Start Preventing Returns
          </a>
        </div>
      </header>

      <main>
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
                href="#signup"
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
                <button
                  type="button"
                  className="text-link"
                  onClick={() => {
                    posthog.capture('cta_click', { cta: 'turn_returns_into_relationships' })
                    scrollToId('onboarding')
                  }}
                >
                  Turn Returns into Relationships
                </button>
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

        <section className="metrics" aria-label="Performance metrics">
          {metrics.map((metric) => (
            <div key={metric.label} className="metric-card">
              <span className="metric-value">{metric.value}</span>
              <span className="metric-label">{metric.label}</span>
              <p>{metric.detail}</p>
            </div>
          ))}
        </section>

        <section className="roi-calculator" aria-label="ReturnShield ROI forecaster">
          <div className="roi-header">
            <h2>Forecast your ReturnShield revenue impact</h2>
            <p>
              Adjust the levers below to see how exchange-first automation prevents refunds and keeps more revenue in play.
              We model against live operator benchmarks from the ReturnShield beta cohort.
            </p>
          </div>
          <div className="roi-layout">
            <form className="roi-form" aria-label="ROI assumptions">
              <label>
                <span>Monthly orders</span>
                <input
                  type="number"
                  min={0}
                  max={2000}
                  step={10}
                  value={monthlyOrders}
                  onChange={handleMonthlyOrdersChange}
                  inputMode="numeric"
                />
              </label>
              <label>
                <span>Average order value</span>
                <div className="input-prefix">
                  <span className="prefix">$</span>
                  <input
                    type="number"
                    min={0}
                    max={500}
                    step={1}
                    value={averageOrderValue}
                    onChange={handleAverageOrderValueChange}
                    inputMode="decimal"
                  />
                </div>
              </label>
              <label className="range-field">
                <span>Current return rate</span>
                <div className="range-meta">{formatPercent(returnRate, 0)}</div>
                <input
                  type="range"
                  min={0}
                  max={0.5}
                  step={0.01}
                  value={returnRate}
                  onChange={handleReturnRateChange}
                  aria-valuemin={0}
                  aria-valuemax={0.5}
                  aria-valuenow={returnRate}
                />
              </label>
              <p className="roi-footnote">
                Benchmarks: {formatPercent(roiMetrics.projectedReduction, 0)} average return-rate reduction,{' '}
                {formatPercent(roiMetrics.exchangeCaptureRate, 0)} of refunded orders converted to exchanges when ReturnShield
                playbooks are live.
              </p>
            </form>
            <div className="roi-results" aria-label="Projected ROI outcomes">
              <article className="roi-card">
                <span className="label">Monthly gross sales</span>
                <strong>{formatCurrency(roiMetrics.monthlyGrossSales)}</strong>
              </article>
              <article className="roi-card">
                <span className="label">Current monthly refund leakage</span>
                <strong>{formatCurrency(roiMetrics.currentReturnLoss)}</strong>
              </article>
              <article className="roi-card">
                <span className="label">Refunds prevented</span>
                <strong>{formatCurrency(roiMetrics.refundsPrevented)}</strong>
              </article>
              <article className="roi-card">
                <span className="label">Exchange-driven revenue retained</span>
                <strong>{formatCurrency(roiMetrics.exchangeRevenue)}</strong>
              </article>
              <article className="roi-card">
                <span className="label">Projected return rate after 60 days</span>
                <strong>{formatPercent(roiMetrics.returnRateAfter, 1)}</strong>
              </article>
              <article className="roi-card roi-highlight">
                <span className="label">Monthly revenue protected</span>
                <strong>{formatCurrency(roiMetrics.totalReclaimed)}</strong>
                <small>{roiMetrics.roiMultiple.toFixed(1)}× subscription ROI</small>
              </article>
            </div>
          </div>
        </section>

        <section id="impact" className="impact">
          <header>
            <span className="tagline">Sustainability impact</span>
            <h2>Returnless refunds that protect margins and the planet.</h2>
            <p>
              ReturnShield pinpoints low-value items where reverse logistics erodes margin. Keep-it refunds, donation routing,
              and automated storytelling prevented{' '}
              {formatNumber(returnlessInsights.summary.landfillLbsPrevented, 0)} lbs of landfill waste and saved{' '}
              {formatCurrency(returnlessInsights.summary.annualizedMarginRecovery)} in annualized margin with just{' '}
              {returnlessInsights.candidates.length} SKUs in the pilot set.
            </p>
          </header>
          <div className="impact-grid">
            {sustainabilityCards.map((card) => (
              <article key={card.label} className="impact-card">
                <span className="impact-value">{card.value}</span>
                <span className="impact-label">{card.label}</span>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
          <div className="success-tiles">
            {successStories.map((story) => (
              <article key={story.headline}>
                <h3>{story.headline}</h3>
                <p>{story.detail}</p>
                <a
                  href={story.href}
                  className="text-link"
                  onClick={() => posthog.capture('cta_click', { cta: 'success_story', headline: story.headline })}
                >
                  {story.cta}
                </a>
              </article>
            ))}
          </div>
          <aside className="impact-timeline">
            <h3>Playbook moves live this week</h3>
            <ul>
              {returnlessInsights.playbook.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </aside>
        </section>

        <section id="coach" className="coach">
          <header>
            <h2>AI Exchange Coach™</h2>
            <p>
              Automate the next best exchange-saving move. {formatCurrency(coachData.summary.aggregateMarginAtRisk)} in
              margin is protected while the Coach unlocks {formatCurrencyWithCents(coachData.summary.projectedExchangeUplift)}
              in monthly uplift.
            </p>
          </header>
          <div className="coach-metrics">
            <div>
              <span className="label">Period</span>
              <strong>{coachData.summary.period.split('_').join(' ')}</strong>
            </div>
            <div>
              <span className="label">Actions live</span>
              <strong>{coachData.actions.length}</strong>
            </div>
            <div>
              <span className="label">Projected uplift</span>
              <strong>{formatCurrencyWithCents(coachData.summary.projectedExchangeUplift)}</strong>
            </div>
          </div>
          <div className="coach-grid">
            {coachData.actions.map((item) => (
              <article key={`${item.sku}-${item.headline}`} className="coach-card">
                <header>
                  <span className="coach-sku">{item.sku}</span>
                  <h3>{item.headline}</h3>
                </header>
                <p>{item.description}</p>
                <div className="coach-stats">
                  <div>
                    <span className="label">30-day returns</span>
                    <strong>{formatNumber(item.metrics.returnVolume30d, 0)}</strong>
                  </div>
                  <div>
                    <span className="label">Margin at risk</span>
                    <strong>{formatCurrency(item.metrics.marginAtRisk)}</strong>
                  </div>
                  <div>
                    <span className="label">Exchange uplift</span>
                    <strong>{formatCurrencyWithCents(item.estimatedMonthlyUplift)}</strong>
                  </div>
                </div>
                <ul className="coach-actions">
                  {item.recommendedPlay.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="vip" className="vip">
          <header>
            <h2>VIP Resolution Hub</h2>
            <p>
              Resolve loyalty-rich tickets first, blend returnless refunds with concierge touches, and defend{' '}
              {formatCurrencyWithCents(vipData.summary.revenueDefended)} in repeat revenue this quarter.
            </p>
          </header>
          <div className="vip-metrics-row">
            <div>
              <span className="label">Open VIP tickets</span>
              <strong>{vipData.summary.openTickets}</strong>
            </div>
            <div>
              <span className="label">Avg. hours open</span>
              <strong>{formatHours(vipData.summary.avgHoursOpen)}</strong>
            </div>
            <div>
              <span className="label">Ops hours returned</span>
              <strong>{formatHours(vipData.summary.opsHoursReturned)}</strong>
            </div>
          </div>
          <div className="vip-grid">
            {vipData.queue.map((entry) => (
              <article key={entry.ticketId} className="vip-card">
                <div className="vip-header">
                  <h3>{entry.customer}</h3>
                  <span>{entry.loyaltySegment}</span>
                </div>
                <dl className="vip-stats">
                  <div>
                    <dt>Ticket ID</dt>
                    <dd>{entry.ticketId}</dd>
                  </div>
                  <div>
                    <dt>Order value</dt>
                    <dd>{formatCurrency(entry.orderValue)}</dd>
                  </div>
                  <div>
                    <dt>LTV</dt>
                    <dd>{formatCurrency(entry.ltv)}</dd>
                  </div>
                  <div>
                    <dt>Churn risk</dt>
                    <dd>{formatPercent(entry.predictedChurnRisk / 100, 1)}</dd>
                  </div>
                  <div>
                    <dt>Hours open</dt>
                    <dd>{formatHours(entry.hoursOpen)}</dd>
                  </div>
                </dl>
                <p className="vip-return-reason">{entry.returnReason}</p>
                <p className="vip-action">{entry.recommendedAction}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="returnless" className="returnless">
          <header>
            <h2>Returnless refund intelligence, pre-modeled.</h2>
            <p>
              We stack-rank every SKU by margin risk, sustainability upside, and customer delight. Returnless automation frees{' '}
              {formatNumber(returnlessInsights.summary.manualHoursReduced, 1)} hours of CX time per month while keep-it credits
              average {formatCurrencyWithCents(averageKeepItValue)} per approval.
            </p>
          </header>
          <div className="returnless-grid">
            {returnlessInsights.candidates.map((candidate) => (
              <article key={candidate.sku} className="returnless-card">
                <header>
                  <span className="returnless-sku">{candidate.sku}</span>
                  <h3>{candidate.productName}</h3>
                  <p>{candidate.reasonDriver}</p>
                </header>
                <div className="returnless-stats">
                  <div>
                    <span className="label">30-day returns</span>
                    <strong>{formatNumber(candidate.returnVolume30d, 0)}</strong>
                  </div>
                  <div>
                    <span className="label">Avg. COGS</span>
                    <strong>{formatCurrencyWithCents(candidate.avgUnitCost)}</strong>
                  </div>
                  <div>
                    <span className="label">Margin recaptured</span>
                    <strong>{formatCurrency(candidate.estimatedMarginRecaptured)}</strong>
                  </div>
                  <div>
                    <span className="label">Carbon prevented</span>
                    <strong>{formatNumber(candidate.carbonKgPrevented, 0)} kg</strong>
                  </div>
                  <div>
                    <span className="label">Landfill diverted</span>
                    <strong>{formatNumber(candidate.landfillLbsPrevented, 0)} lbs</strong>
                  </div>
                  <div>
                    <span className="label">Ops minutes saved</span>
                    <strong>{formatNumber(candidate.handlingMinutesReduced, 0)} min</strong>
                  </div>
                </div>
                <ul className="returnless-actions">
                  {candidate.recommendedActions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-banner" aria-label="Unlock your ReturnShield effect">
          <div className="cta-banner-copy">
            <h2>Unlock Your ReturnShield Effect</h2>
            <p>
              Stop treating returns as a cost center. Surface the why behind returns, deploy exchange-first playbooks, and defend contribution margin on autopilot.
            </p>
          </div>
          <div className="cta-banner-actions">
            <a
              className="btn btn-primary"
              href="#pricing"
              onClick={() => posthog.capture('cta_click', { cta: 'unlock_returnshield_effect' })}
            >
              Unlock Your ReturnShield Effect
            </a>
            <Link
              className="btn btn-outline"
              to="/exchange-automation"
              onClick={() => posthog.capture('cta_click', { cta: 'convert_returns_to_exchanges' })}
            >
              Convert Returns to Exchanges
            </Link>
          </div>
        </section>

        <section id="signup" className="conversion-anchor">
          <h2>Ready to defend your contribution margin?</h2>
          <p>Start a live walkthrough and activate exchange-first automations within 72 hours.</p>
          <a className="btn btn-primary" href="mailto:concierge@returnshield.app">
            Schedule concierge onboarding
          </a>
        </section>

        <section id="login" className="conversion-anchor">
          <h2>Already a customer?</h2>
          <p>Visit the ReturnShield operator console to monitor exchange wins and VIP queue updates.</p>
          <a className="btn btn-secondary" href="https://app.returnshield.app">
            Go to operator console
          </a>
        </section>

        <section id="features" className="features">
          <header>
            <h2>Keep revenue, not returns.</h2>
            <p>
              Every module is engineered to defend your contribution margin. We benchmark against a $100/month ROI mandate on every release.
            </p>
          </header>
          <div className="feature-grid">
            {featureHighlights.map((feature) => (
              <article key={feature.title} className="feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="onboarding" className="onboarding">
          <div className="onboarding-intro">
            <h2>Onboarding takes less than a coffee break.</h2>
            <p>
              We obsess over velocity because your cash flow depends on it. Connect ReturnShield, let the sync run, and watch insights surface immediately.
            </p>
          </div>
          <ol className="onboarding-steps">
            {onboardingSteps.map((step, index) => (
              <li key={step.title} className="onboarding-step">
                <span className="step-index">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="dashboard">
          <div className="dashboard-copy">
            <h2>Predict return risk before it hits your inbox.</h2>
            <p>
              The dashboard triages refunds by financial impact, customer lifetime value, and operational root cause. One glance and you know exactly where to intervene.
            </p>
            <ul>
              <li>Exchange nudges outperform refund requests by 2.4×.</li>
              <li>Bulk actions to update policies directly from insights.</li>
              <li>Export investor-ready reports that prove contribution gains.</li>
            </ul>
            <Link
              to="/exchange-automation"
              className="btn btn-secondary"
              onClick={() => posthog.capture('cta_click', { cta: 'convert_returns_to_exchanges' })}
            >
              Convert Returns to Exchanges
            </Link>
          </div>
          <div className="dashboard-visual">
            <div className="visual-card">
              <header>
                <span className="badge badge-accent">Live Insight</span>
                <span>SKU RS-104 is driving 17% of losses</span>
              </header>
              <div className="visual-body">
                <div>
                  <p className="visual-metric">53 return claims</p>
                  <p className="visual-subtext">$12,480 at risk · 61% size-related</p>
                </div>
                <button
                  className="btn btn-primary btn-small"
                  onClick={() => posthog.capture('cta_click', { cta: 'unlock_returnshield_effect' })}
                >
                  Unlock Your ReturnShield Effect
                </button>
              </div>
              <footer>
                <p>Suggested actions:</p>
                <ul>
                  <li>Trigger size guide email pre-delivery.</li>
                  <li>Offer instant exchanges for VIP customers.</li>
                  <li>Flag manufacturing batch #784 for QA review.</li>
                </ul>
              </footer>
            </div>
          </div>
        </section>

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
              href="#features"
              className="btn btn-secondary"
              onClick={() => posthog.capture('cta_click', { cta: 'turn_returns_into_relationships' })}
            >
              Turn Returns into Relationships
            </a>
          </div>
        </section>

        <section id="stories" className="testimonials">
          {testimonials.map((story) => (
            <blockquote key={story.author}>
              <p>“{story.quote}”</p>
              <cite>
                {story.author} · {story.role}
              </cite>
            </blockquote>
          ))}
          <div className="testimonial-cta">
            <h3>Your next refund could be revenue.</h3>
            <p>Ship ReturnShield today and be the success story we feature next week.</p>
            <a className="btn btn-secondary" href="mailto:hello@returnshield.app?subject=ReturnShield%20Walkthrough">
              Schedule 15-minute walkthrough
            </a>
          </div>
        </section>

        <section id="faq" className="faq">
          <h2>Questions investors and operators ask us.</h2>
          <div className="faq-grid">
            <article>
              <h3>How fast do we see ROI?</h3>
              <p>Most brands recoup their monthly subscription with the first operational fix we surface—typically inside week one.</p>
            </article>
            <article>
              <h3>Do you replace our existing return portal?</h3>
              <p>No. ReturnShield analyzes your existing workflows, adds intelligence, and automates smart policy adjustments on top.</p>
            </article>
            <article>
              <h3>Will this work beyond Shopify?</h3>
              <p>Shopify is live today. WooCommerce, Amazon, and custom cart integrations are lined up for Stage 3—let us know your timeline.</p>
            </article>
            <article>
              <h3>Can our CX team actually use this?</h3>
              <p>Yes. The dashboard is built for non-technical operators with guided recommendations and a human support team on standby.</p>
            </article>
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

export default App
