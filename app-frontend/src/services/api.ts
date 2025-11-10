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
      } catch (parseError) {
        detail = response.statusText
      }
    } else {
      detail = response.statusText
    }
    throw new ApiError(detail ?? 'Request failed', response.status, detail)
  }

  if (!isJson) {
    return (await response.text()) as T
  }

  return (await response.json()) as T
}

