import type { ReturnlessInsights, ExchangeCoachPayload, VIPQueuePayload, IntegrationHighlight } from '../types'
import { withUtm } from '../utils/utm'

export const stripePriceLookup: Record<'launch' | 'scale' | 'elite', string> = {
    launch: (import.meta.env.VITE_STRIPE_PRICE_LAUNCH as string | undefined) ?? '',
    scale: (import.meta.env.VITE_STRIPE_PRICE_SCALE as string | undefined) ?? '',
    elite: (import.meta.env.VITE_STRIPE_PRICE_ELITE as string | undefined) ?? '',
}

export const fallbackReturnlessInsights: ReturnlessInsights = {
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

export const fallbackCoach: ExchangeCoachPayload = {
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

export const fallbackVip: VIPQueuePayload = {
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

export const DEFAULT_INTEGRATION_HIGHLIGHTS: IntegrationHighlight[] = [
    {
        slug: 'shopify',
        name: 'Shopify',
        badge: 'Available now',
        description:
            'Native app install with Shopify OAuth, nightly order sync, and instant policy automation.',
        ctaLabel: 'Install Shopify connector',
        ctaHref: withUtm('https://app.returnshield.app/register?platform=shopify', 'integration_shopify'),
    },
    {
        slug: 'bigcommerce',
        name: 'BigCommerce',
        badge: 'Beta access',
        description:
            'Returns webhook automation, order ingestion, and VIP queue tagging for pilot merchants.',
        ctaLabel: 'Join BigCommerce beta',
        ctaHref: withUtm('https://app.returnshield.app/register?platform=bigcommerce', 'integration_bigcommerce'),
    },
    {
        slug: 'woocommerce',
        name: 'WooCommerce',
        badge: 'Pilot waitlist',
        description:
            'Secure REST API integration with scheduled syncs and bespoke messaging playbooks for Woo retailers.',
        ctaLabel: 'Request WooCommerce pilot',
        ctaHref: withUtm('https://app.returnshield.app/register?platform=woocommerce', 'integration_woocommerce'),
    },
]
