import type { VIPQueuePayload } from '../types'
import { formatCurrency, formatCurrencyWithCents, formatHours, formatPercent } from '../utils/format'

type VIPResolutionHubProps = {
    vipData: VIPQueuePayload
}

export function VIPResolutionHub({ vipData }: VIPResolutionHubProps) {
    return (
        <section id="vip" className="vip">
            <header>
                <h2>VIP Resolution Hub</h2>
                <p>
                    Resolve loyalty-rich tickets first, blend returnless refunds with concierge touches, and defend{' '}
                    {formatCurrencyWithCents(vipData.summary.revenueDefended)} in repeat revenue this quarter.
                </p>
            </header>
            <div className="vip-metrics-row">
                <div>
                    <span className="label">Open VIP tickets</span>
                    <strong>{vipData.summary.openTickets}</strong>
                </div>
                <div>
                    <span className="label">Avg. hours open</span>
                    <strong>{formatHours(vipData.summary.avgHoursOpen)}</strong>
                </div>
                <div>
                    <span className="label">Ops hours returned</span>
                    <strong>{formatHours(vipData.summary.opsHoursReturned)}</strong>
                </div>
            </div>
            <div className="vip-grid">
                {vipData.queue.map((entry) => (
                    <article key={entry.ticketId} className="vip-card">
                        <div className="vip-header">
                            <h3>{entry.customer}</h3>
                            <span>{entry.loyaltySegment}</span>
                        </div>
                        <dl className="vip-stats">
                            <div>
                                <dt>Ticket ID</dt>
                                <dd>{entry.ticketId}</dd>
                            </div>
                            <div>
                                <dt>Order value</dt>
                                <dd>{formatCurrency(entry.orderValue)}</dd>
                            </div>
                            <div>
                                <dt>LTV</dt>
                                <dd>{formatCurrency(entry.ltv)}</dd>
                            </div>
                            <div>
                                <dt>Churn risk</dt>
                                <dd>{formatPercent(entry.predictedChurnRisk / 100, 1)}</dd>
                            </div>
                            <div>
                                <dt>Hours open</dt>
                                <dd>{formatHours(entry.hoursOpen)}</dd>
                            </div>
                        </dl>
                        <p className="vip-return-reason">{entry.returnReason}</p>
                        <p className="vip-action">{entry.recommendedAction}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}
