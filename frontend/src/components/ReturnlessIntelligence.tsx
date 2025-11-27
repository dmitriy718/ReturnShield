import { useMemo } from 'react'
import type { ReturnlessInsights } from '../types'
import { formatCurrency, formatCurrencyWithCents, formatNumber } from '../utils/format'

type ReturnlessIntelligenceProps = {
    returnlessInsights: ReturnlessInsights
}

export function ReturnlessIntelligence({ returnlessInsights }: ReturnlessIntelligenceProps) {
    const averageKeepItValue = useMemo(() => {
        if (!returnlessInsights.candidates.length) {
            return 0
        }
        const totalPerSku = returnlessInsights.candidates.reduce((accumulator, candidate) => {
            if (!candidate.returnVolume30d) {
                return accumulator
            }
            return accumulator + candidate.estimatedMarginRecaptured / candidate.returnVolume30d
        }, 0)
        return totalPerSku / returnlessInsights.candidates.length
    }, [returnlessInsights])

    return (
        <section id="returnless" className="returnless">
            <header>
                <h2>Returnless refund intelligence, pre-modeled.</h2>
                <p>
                    We stack-rank every SKU by margin risk, sustainability upside, and customer delight. Returnless automation frees{' '}
                    {formatNumber(returnlessInsights.summary.manualHoursReduced, 1)} hours of CX time per month while keep-it credits
                    average {formatCurrencyWithCents(averageKeepItValue)} per approval.
                </p>
            </header>
            <div className="returnless-grid">
                {returnlessInsights.candidates.map((candidate) => (
                    <article key={candidate.sku} className="returnless-card">
                        <header>
                            <span className="returnless-sku">{candidate.sku}</span>
                            <h3>{candidate.productName}</h3>
                            <p>{candidate.reasonDriver}</p>
                        </header>
                        <div className="returnless-stats">
                            <div>
                                <span className="label">30-day returns</span>
                                <strong>{formatNumber(candidate.returnVolume30d, 0)}</strong>
                            </div>
                            <div>
                                <span className="label">Avg. COGS</span>
                                <strong>{formatCurrencyWithCents(candidate.avgUnitCost)}</strong>
                            </div>
                            <div>
                                <span className="label">Margin recaptured</span>
                                <strong>{formatCurrency(candidate.estimatedMarginRecaptured)}</strong>
                            </div>
                            <div>
                                <span className="label">Carbon prevented</span>
                                <strong>{formatNumber(candidate.carbonKgPrevented, 0)} kg</strong>
                            </div>
                            <div>
                                <span className="label">Landfill diverted</span>
                                <strong>{formatNumber(candidate.landfillLbsPrevented, 0)} lbs</strong>
                            </div>
                            <div>
                                <span className="label">Ops minutes saved</span>
                                <strong>{formatNumber(candidate.handlingMinutesReduced, 0)} min</strong>
                            </div>
                        </div>
                        <ul className="returnless-actions">
                            {candidate.recommendedActions.map((action) => (
                                <li key={action}>{action}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    )
}
