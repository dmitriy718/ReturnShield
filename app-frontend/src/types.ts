export type OnboardingStage = 'connect' | 'sync' | 'insights' | 'complete'

export type StorePlatform = 'none' | 'shopify' | 'bigcommerce' | 'woocommerce'

export type User = {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  company_name: string
  has_shopify_store: boolean
  shopify_domain: string
  store_platform: StorePlatform
  store_domain: string
  stripe_customer_id: string
  onboarding_stage: OnboardingStage
  subscription_status: 'trial' | 'launch' | 'scale' | 'elite'
  has_completed_walkthrough: boolean
}

export type PlatformStatus = {
  slug: string
  name: string
  status: string
  badge: string
  description: string
  cta_label: string
  cta_url: string
}

export type PlatformStatusResponse = {
  platforms: PlatformStatus[]
}

export type ReturnlessCandidate = {
  sku: string
  product_name: string
  avg_unit_cost: number
  return_volume_30d: number
  reason_driver: string
  estimated_margin_recaptured: number
  carbon_kg_prevented: number
  landfill_lbs_prevented: number
  handling_minutes_reduced: number
  recommended_actions: string[]
}

export type ReturnlessSummary = {
  period: string
  annualized_margin_recovery: number
  carbon_tonnes_prevented: number
  landfill_lbs_prevented: number
  manual_hours_reduced: number
}

export type ReturnlessInsights = {
  summary: ReturnlessSummary
  candidates: ReturnlessCandidate[]
  playbook: string[]
}

export type ExchangeCoachAction = {
  sku: string
  headline: string
  description: string
  recommended_play: string[]
  estimated_monthly_uplift: number
  impact_score: number
  metrics: {
    return_volume_30d: number
    avg_unit_cost: number
    margin_at_risk: number
  }
}

export type ExchangeCoachPayload = {
  actions: ExchangeCoachAction[]
  summary: {
    period: string
    aggregate_margin_at_risk: number
    projected_exchange_uplift: number
  }
}

export type VipQueueEntry = {
  ticket_id: string
  customer: string
  loyalty_segment: string
  ltv: number
  order_value: number
  return_reason: string
  recommended_action: string
  hours_open: number
  predicted_churn_risk: number
  sku: string
}

export type VipQueuePayload = {
  queue: VipQueueEntry[]
  summary: {
    open_tickets: number
    avg_hours_open: number
    revenue_defended: number
    ops_hours_returned: number
  }
}

export type ExchangePlaybookRecommendation = {
  title: string
  description: string
  expected_impact: string
  automation_actions: string[]
}

export type ExchangePlaybookResponse = {
  recommendations: ExchangePlaybookRecommendation[]
  quick_wins?: ExchangePlaybookRecommendation[]
}

