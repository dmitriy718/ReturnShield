import posthog from 'posthog-js'
import type { IntegrationHighlight } from '../types'

type IntegrationsProps = {
    integrationHighlights: IntegrationHighlight[]
}

export function Integrations({ integrationHighlights }: IntegrationsProps) {
    return (
        <section id="integrations" className="integrations">
            <header>
                <span className="tagline">Connect your stack</span>
                <h2>Integrations purpose-built for return-heavy brands.</h2>
                <p>
                    ReturnShield meets you where your orders already live. Activate connectors, sync historical returns, and keep
                    policies aligned across channels.
                </p>
            </header>
            <div className="integration-grid">
                {integrationHighlights.map((integration) => (
                    <article key={integration.name} className="integration-card">
                        <header>
                            <span className="integration-badge">{integration.badge}</span>
                            <h3>{integration.name}</h3>
                        </header>
                        <p>{integration.description}</p>
                        <a
                            className="btn btn-outline integration-cta"
                            href={integration.ctaHref}
                            onClick={() => posthog.capture('cta_click', { cta: 'integration_cta', integration: integration.name })}
                        >
                            {integration.ctaLabel}
                        </a>
                    </article>
                ))}
            </div>
        </section>
    )
}
