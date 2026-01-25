import { apiFetch } from './api'

export interface CompanySettings {
  brand_color: string
  logo_url: string
  return_window_days: number
  offer_free_shipping: boolean
  restocking_fee: string
  support_email: string
  easypost_api_key?: string
  bigcommerce_store_hash?: string
  bigcommerce_access_token?: string
  woocommerce_site_url?: string
  woocommerce_consumer_key?: string
  woocommerce_consumer_secret?: string
}

export async function getCompanySettings(token: string) {
  return apiFetch<CompanySettings>('/core/settings/', { token })
}

export async function updateCompanySettings(token: string, settings: Partial<CompanySettings>) {
  return apiFetch<CompanySettings>('/core/settings/', {
    method: 'PATCH',
    body: JSON.stringify(settings),
    token
  })
}
