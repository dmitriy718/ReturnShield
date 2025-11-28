import { API_ERROR_EVENT, type ApiErrorEventDetail } from '../lib/events'

export class ApiError extends Error {
  status: number
  detail?: string
  constructor(message: string, status: number, detail?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

const API_BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? ''

type ApiRequestOptions = {
  method?: string
  body?: BodyInit | null
  headers?: HeadersInit
  token?: string | null
}

export async function apiFetch<T = unknown>(
  path: string,
  { method = 'GET', body = null, headers, token }: ApiRequestOptions = {},
): Promise<T> {
  if (!API_BASE) {
    throw new Error('VITE_API_URL is not configured for the dashboard.')
  }

  const resolvedPath = path.startsWith('/') ? path : `/${path}`

  const initHeaders = new Headers(headers ?? {})

  if (token) {
    initHeaders.set('Authorization', `Token ${token}`)
  }

  const isJsonBody = body && !(body instanceof FormData)
  if (isJsonBody && !initHeaders.has('Content-Type')) {
    initHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE}${resolvedPath}`, {
    method,
    body,
    headers: initHeaders,
  })

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('Content-Type') ?? ''
  const isJson = contentType.includes('application/json')

  if (!response.ok) {
    let detail: string | undefined


    if (isJson) {
      try {
        const payload = await response.json()
        detail = payload?.detail ?? JSON.stringify(payload)
      } catch {
        detail = response.statusText
      }
    } else {
      detail = response.statusText
    }

    const detailPayload: ApiErrorEventDetail = {
      path: resolvedPath,
      status: response.status,
      message: detail,
    }
    emitApiError(detailPayload)

    throw new ApiError(detail ?? 'Request failed', response.status, detail)
  }

  if (!isJson) {
    return (await response.text()) as T
  }

  return (await response.json()) as T
}

function emitApiError(detail: ApiErrorEventDetail) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(API_ERROR_EVENT, { detail }))
}

export async function getIntegrationsHealth(token: string) {
  return apiFetch<import('../types').IntegrationHealth[]>('/integrations/health/', { token })
}

export async function getFeatureFlags(token: string): Promise<string[]> {
  return apiFetch<string[]>('/feature-flags/', { token })
}

export interface ReasonData {
  sku: string;
  reasons: Record<string, number>;
  total_returns: number;
}

export async function getReasonAnalytics(token: string) {
  return apiFetch<ReasonData[]>('/returns/analytics/reasons/', { token })
}

export interface CohortMetrics {
  return_rate: number;
  total_orders: number;
  total_returns: number;
}

export interface CohortData {
  new_customers: CohortMetrics;
  returning_customers: CohortMetrics;
}

export async function getCohortAnalytics(token: string) {
  return apiFetch<CohortData>('/returns/analytics/cohorts/', { token })
}

export interface ProfitabilityData {
  revenue_retained: number;
  revenue_refunded: number;
  exchange_count: number;
  refund_count: number;
  retained_percentage: number;
}

export async function getProfitabilityAnalytics(token: string) {
  return apiFetch<ProfitabilityData>('/returns/analytics/profitability/', { token })
}

// Automation
export interface AutomationRule {
  id: number;
  name: string;
  rule_type: 'APPROVE' | 'REJECT' | 'FLAG';
  trigger_field: 'TOTAL_VALUE' | 'RETURN_REASON' | 'ITEM_CONDITION';
  operator: 'eq' | 'gt' | 'lt' | 'contains';
  value: string;
  is_active: boolean;
}

export interface FraudSettings {
  flag_high_velocity: boolean;
  max_return_velocity: number;
  flag_high_value: boolean;
  high_value_threshold: number;
}

export async function getAutomationRules(token: string) {
  return apiFetch<AutomationRule[]>('/automation/rules/', { token });
}

export async function createAutomationRule(token: string, rule: Omit<AutomationRule, 'id'>) {
  return apiFetch<AutomationRule>('/automation/rules/', {
    method: 'POST',
    body: JSON.stringify(rule),
    token
  });
}

export async function deleteAutomationRule(token: string, id: number) {
  return apiFetch<void>(`/automation/rules/${id}/`, {
    method: 'DELETE',
    token
  });
}

export async function getFraudSettings(token: string) {
  return apiFetch<FraudSettings>('/automation/fraud-settings/', { token });
}

export async function updateFraudSettings(token: string, settings: FraudSettings) {
  return apiFetch<FraudSettings>('/automation/fraud-settings/', {
    method: 'PUT',
    body: JSON.stringify(settings),
    token
  });
}

