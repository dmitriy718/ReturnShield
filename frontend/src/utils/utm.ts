export function withUtm(
  url: string,
  content: string,
  {
    source = 'returnshield.app',
    medium = 'website',
    campaign = 'primary',
  }: { source?: string; medium?: string; campaign?: string } = {},
): string {
  try {
    const target = new URL(url)
    const params = target.searchParams

    if (!params.has('utm_source')) {
      params.set('utm_source', source)
    }
    if (!params.has('utm_medium')) {
      params.set('utm_medium', medium)
    }
    if (!params.has('utm_campaign')) {
      params.set('utm_campaign', campaign)
    }

    params.set('utm_content', content)

    target.search = params.toString()
    return target.toString()
  } catch (error) {
    console.warn('Failed to apply UTM parameters', { url, error })
    return url
  }
}


