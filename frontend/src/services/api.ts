import {
    transformReturnlessPayload,
    transformCoachPayload,
    transformVipPayload,
    transformIntegrationPayload,
} from '../utils/transformers'
import type { ReturnlessInsights, ExchangeCoachPayload, VIPQueuePayload, IntegrationHighlight } from '../types'

const apiBaseUrl = ((import.meta.env.VITE_API_URL as string | undefined) || '').replace(/\/$/, '')

export async function fetchReturnlessInsights(signal?: AbortSignal): Promise<ReturnlessInsights | null> {
    if (!apiBaseUrl) return null
    const response = await fetch(`${apiBaseUrl}/returns/returnless-insights/`, { signal })
    if (!response.ok) throw new Error(`Returnless insights request failed with status ${response.status}`)
    const payload = await response.json()
    return transformReturnlessPayload(payload)
}

export async function fetchExchangeCoach(signal?: AbortSignal): Promise<ExchangeCoachPayload | null> {
    if (!apiBaseUrl) return null
    const response = await fetch(`${apiBaseUrl}/returns/exchange-coach/`, { signal })
    if (!response.ok) throw new Error(`Exchange coach request failed with status ${response.status}`)
    const payload = await response.json()
    return transformCoachPayload(payload)
}

export async function fetchVIPResolution(signal?: AbortSignal): Promise<VIPQueuePayload | null> {
    if (!apiBaseUrl) return null
    const response = await fetch(`${apiBaseUrl}/returns/vip-resolution/`, { signal })
    if (!response.ok) throw new Error(`VIP resolution request failed with status ${response.status}`)
    const payload = await response.json()
    return transformVipPayload(payload)
}

export async function fetchIntegrationStatus(signal?: AbortSignal): Promise<IntegrationHighlight[] | null> {
    if (!apiBaseUrl) return null
    const response = await fetch(`${apiBaseUrl}/platforms/status/`, { signal })
    if (!response.ok) throw new Error(`Integration status request failed with status ${response.status}`)
    const payload = await response.json()
    return transformIntegrationPayload(payload)
}

export async function createCheckoutSession(planKey: string, priceId: string): Promise<{ checkout_url?: string }> {
    const response = await fetch(`${apiBaseUrl}/billing/create-checkout-session/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planKey, price_id: priceId }),
    })

    if (!response.ok) {
        throw new Error(`Checkout initiation failed with status ${response.status}`)
    }

    return response.json()
}
