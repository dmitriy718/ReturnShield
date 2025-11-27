import { useMemo } from 'react'
import posthog from 'posthog-js'
import type { ReturnlessInsights } from '../types'
import { formatCurrency, formatNumber } from '../utils/format'

type ImpactSectionProps = {
    returnlessInsights: ReturnlessInsights
}

export function ImpactSection({ returnlessInsights }: ImpactSectionProps) {
    const sustainabilityCards = useMemo(() => {
        const { summary } = returnlessInsights
        return [
            {
                label: 'Annualized margin recovered',
                value: formatCurrency(summary.annualizedMarginRecovery),
                detail: 'Projected savings from automated returnless authorizations.',
            },
            {
                label: 'Carbon emissions prevented',
                value: `${formatNumber(summary.carbonTonnesPrevented, 2)} t CO₂e`,
                detail: `Equivalent to avoiding ~${formatNumber(Math.round(summary.carbonTonnesPrevented * 1130))} last-mile deliveries.`,
            },
            {
                label: 'Landfill diverted',
                value: `${formatNumber(summary.landfillLbsPrevented, 0)} lbs`,
                detail: 'Kept out of landfill through donations and keep-it policies.',
            },
            {
                label: 'Team hours returned',
                value: `${formatNumber(summary.manualHoursReduced, 1)} hrs`,
                detail: 'Saved per month by skipping inspections and repacking.',
            },
        ]
    }, [returnlessInsights])

    const successStories = [
        {
            headline: 'Scaled apparel brand cut refunds by 26% in 60 days.',
            detail: 'AI Exchange Coach automated exchange-first flows across four high-risk SKUs.',
            cta: 'See apparel playbook',
            href: '/exchange-automation',
        },
        {
            headline: 'Subscription beauty merchant recovered $94K in Q2.',
            detail: 'VIP Resolution Hub prioritized top 5% customers and automated keep-it credits.',
            cta: 'Book a concierge review',
            href: 'https://app.returnshield.app/register?plan=scale&utm_source=success_story_scale', // Hardcoded UTM for now or use withUtm if imported
        },
        {
            headline: 'Lifestyle retailer diverted 18K lbs from landfill.',
            detail: 'Returnless Impact Lab benchmarks guided donation + returnless decisions.',
            cta: 'Explore sustainability impact',
            href: '#impact',
        },
    ]

    return (
        <section id="impact" className="impact">
            <header>
                <span className="tagline">Sustainability impact</span>
                <h2>Returnless refunds that protect margins and the planet.</h2>
                <p>
                    ReturnShield pinpoints low-value items where reverse logistics erodes margin. Keep-it refunds, donation routing,
                    and automated storytelling prevented{' '}
                    {formatNumber(returnlessInsights.summary.landfillLbsPrevented, 0)} lbs of landfill waste and saved{' '}
                    {formatCurrency(returnlessInsights.summary.annualizedMarginRecovery)} in annualized margin with just{' '}
                    {returnlessInsights.candidates.length} SKUs in the pilot set.
                </p>
            </header>
            <div className="impact-grid">
                {sustainabilityCards.map((card) => (
                    <article key={card.label} className="impact-card">
                        <span className="impact-value">{card.value}</span>
                        <span className="impact-label">{card.label}</span>
                        <p>{card.detail}</p>
                    </article>
                ))}
            </div>
            <div className="success-tiles">
                {successStories.map((story) => (
                    <article key={story.headline}>
                        <h3>{story.headline}</h3>
                        <p>{story.detail}</p>
                        <a
                            href={story.href}
                            className="text-link"
                            onClick={() => posthog.capture('cta_click', { cta: 'success_story', headline: story.headline })}
                        >
                            {story.cta}
                        </a>
                    </article>
                ))}
            </div>
            <aside className="impact-timeline">
                <h3>Playbook moves live this week</h3>
                <ul>
                    {returnlessInsights.playbook.map((step) => (
                        <li key={step}>{step}</li>
                    ))}
                </ul>
            </aside>
        </section>
    )
}
