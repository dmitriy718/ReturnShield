export const API_ERROR_EVENT = 'returnshield:api-error'

export type ApiErrorEventDetail = {
  path: string
  status: number
  message?: string
}

