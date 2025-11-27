import type { ExchangeCoachPayload } from '../types'
import { formatCurrency, formatCurrencyWithCents, formatNumber } from '../utils/format'

type ExchangeCoachSectionProps = {
    coachData: ExchangeCoachPayload
}

export function ExchangeCoachSection({ coachData }: ExchangeCoachSectionProps) {
    return (
        <section id="coach" className="coach">
            <header>
                <h2>AI Exchange Coach™</h2>
                <p>
                    Automate the next best exchange-saving move. {formatCurrency(coachData.summary.aggregateMarginAtRisk)} in
                    margin is protected while the Coach unlocks {formatCurrencyWithCents(coachData.summary.projectedExchangeUplift)}
                    in monthly uplift.
                </p>
            </header>
            <div className="coach-metrics">
                <div>
                    <span className="label">Period</span>
                    <strong>{coachData.summary.period.split('_').join(' ')}</strong>
                </div>
                <div>
                    <span className="label">Actions live</span>
                    <strong>{coachData.actions.length}</strong>
                </div>
                <div>
                    <span className="label">Projected uplift</span>
                    <strong>{formatCurrencyWithCents(coachData.summary.projectedExchangeUplift)}</strong>
                </div>
            </div>
            <div className="coach-grid">
                {coachData.actions.map((item) => (
                    <article key={`${item.sku}-${item.headline}`} className="coach-card">
                        <header>
                            <span className="coach-sku">{item.sku}</span>
                            <h3>{item.headline}</h3>
                        </header>
                        <p>{item.description}</p>
                        <div className="coach-stats">
                            <div>
                                <span className="label">30-day returns</span>
                                <strong>{formatNumber(item.metrics.returnVolume30d, 0)}</strong>
                            </div>
                            <div>
                                <span className="label">Margin at risk</span>
                                <strong>{formatCurrency(item.metrics.marginAtRisk)}</strong>
                            </div>
                            <div>
                                <span className="label">Exchange uplift</span>
                                <strong>{formatCurrencyWithCents(item.estimatedMonthlyUplift)}</strong>
                            </div>
                        </div>
                        <ul className="coach-actions">
                            {item.recommendedPlay.map((action) => (
                                <li key={action}>{action}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    )
}
