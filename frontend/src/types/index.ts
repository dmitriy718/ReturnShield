export type ReturnlessCandidate = {
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

export type ReturnlessInsights = {
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

export type ReturnlessApiCandidate = {
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

export type ReturnlessApiPayload = {
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

export type ExchangeCoachAction = {
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

export type ExchangeCoachSummary = {
    period: string
    aggregateMarginAtRisk: number
    projectedExchangeUplift: number
}

export type ExchangeCoachPayload = {
    actions: ExchangeCoachAction[]
    summary: ExchangeCoachSummary
}

export type VIPQueueEntry = {
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

export type VIPQueueSummary = {
    openTickets: number
    avgHoursOpen: number
    revenueDefended: number
    opsHoursReturned: number
}

export type VIPQueuePayload = {
    queue: VIPQueueEntry[]
    summary: VIPQueueSummary
}

export type IntegrationHighlight = {
    slug: string
    name: string
    badge: string
    description: string
    ctaLabel: string
    ctaHref: string
    status?: string
}

export type ExchangeCoachApiMetrics = {
    return_volume_30d?: number
    avg_unit_cost?: number
    margin_at_risk?: number
}

export type ExchangeCoachApiAction = {
    sku?: string
    headline?: string
    description?: string
    recommended_play?: string[]
    estimated_monthly_uplift?: number
    impact_score?: number
    metrics?: ExchangeCoachApiMetrics
}

export type ExchangeCoachApiSummary = {
    period?: string
    aggregate_margin_at_risk?: number
    projected_exchange_uplift?: number
}

export type ExchangeCoachApiPayload = {
    actions?: ExchangeCoachApiAction[]
    summary?: ExchangeCoachApiSummary
}

export type VIPQueueApiEntry = {
    ticket_id?: string
    customer?: string
    loyalty_segment?: string
    ltv?: number
    order_value?: number
    return_reason?: string
    recommended_action?: string
    hours_open?: number
    predicted_churn_risk?: number
    sku?: string
}

export type VIPQueueApiSummary = {
    open_tickets?: number
    avg_hours_open?: number
    revenue_defended?: number
    ops_hours_returned?: number
}

export type VIPQueueApiPayload = {
    queue?: VIPQueueApiEntry[]
    summary?: VIPQueueApiSummary
}
