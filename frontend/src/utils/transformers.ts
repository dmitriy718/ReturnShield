import type {
    ReturnlessApiPayload,
    ReturnlessInsights,
    ReturnlessApiCandidate,
    ExchangeCoachApiPayload,
    ExchangeCoachPayload,
    ExchangeCoachApiAction,
    VIPQueueApiPayload,
    VIPQueuePayload,
    VIPQueueApiEntry,
    IntegrationHighlight,
} from '../types'
import { fallbackReturnlessInsights, fallbackCoach, fallbackVip } from '../data/defaults'
import { withUtm } from './utm'

export const transformReturnlessPayload = (payload: ReturnlessApiPayload | null | undefined): ReturnlessInsights => {
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

export const transformCoachPayload = (payload: ExchangeCoachApiPayload | null | undefined): ExchangeCoachPayload => {
    const summary = payload?.summary ?? {}
    const actions = Array.isArray(payload?.actions)
        ? payload.actions.map((item: ExchangeCoachApiAction) => ({
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

export const transformVipPayload = (payload: VIPQueueApiPayload | null | undefined): VIPQueuePayload => {
    const summary = payload?.summary ?? {}
    const queue = Array.isArray(payload?.queue)
        ? payload.queue.map((item: VIPQueueApiEntry) => ({
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

export const transformIntegrationPayload = (payload: any): IntegrationHighlight[] => {
    if (!Array.isArray(payload?.platforms)) {
        return []
    }
    return (payload.platforms as any[]).map((item) => {
        const rawSlug =
            (item?.slug as string | undefined)?.toLowerCase() ||
            (item?.name as string | undefined)?.toLowerCase().replace(/\s+/g, '-')
        const slug = rawSlug || 'platform'
        const name = (item?.name as string | undefined) ?? slug.replace('-', ' ')
        const badge =
            (item?.badge as string | undefined) ??
            (item?.status as string | undefined)?.replace(/^\w/, (ch: string) => ch.toUpperCase()) ??
            ''
        const description = (item?.description as string | undefined) ?? ''
        const ctaLabel = (item?.cta_label as string | undefined) ?? 'Learn more'
        const rawUrl =
            (item?.cta_url as string | undefined) ??
            `https://app.returnshield.app/register?platform=${slug}`
        const ctaHref = withUtm(rawUrl, `integration_${slug}`)

        return {
            slug,
            name,
            badge,
            description,
            ctaLabel,
            ctaHref,
            status: item?.status as string | undefined,
        }
    })
}
