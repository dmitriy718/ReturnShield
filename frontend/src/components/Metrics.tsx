export function Metrics() {
    const metrics = [
        {
            label: 'Return rate reduction',
            value: '23%',
            detail: 'Average drop within 60 days of activation.',
        },
        {
            label: 'Monthly revenue protected',
            value: '$48K',
            detail: 'Median revenue brands keep every month with ReturnShield.',
        },
        {
            label: 'Time to live insights',
            value: '72 hrs',
            detail: 'From install to actionable SKU-level recommendations.',
        },
    ]

    return (
        <section className="metrics" aria-label="Performance metrics">
            {metrics.map((metric) => (
                <div key={metric.label} className="metric-card">
                    <span className="metric-value">{metric.value}</span>
                    <span className="metric-label">{metric.label}</span>
                    <p>{metric.detail}</p>
                </div>
            ))}
        </section>
    )
}
