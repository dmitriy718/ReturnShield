import { useState, useMemo } from 'react'
import type { ChangeEvent } from 'react'
import posthog from 'posthog-js'
import { formatCurrency, formatPercent } from '../utils/format'

type RoiPreset = {
    label: string
    description: string
    monthlyOrders: number
    averageOrderValue: number
    returnRate: number
}

export function RoiCalculator() {
    const [monthlyOrders, setMonthlyOrders] = useState<number>(350)
    const [averageOrderValue, setAverageOrderValue] = useState<number>(92)
    const [returnRate, setReturnRate] = useState<number>(0.17)

    const roiPresets: RoiPreset[] = [
        {
            label: 'DTC Apparel',
            description: 'Higher return rates driven by fit feedback.',
            monthlyOrders: 780,
            averageOrderValue: 82,
            returnRate: 0.26,
        },
        {
            label: 'Beauty & Wellness',
            description: 'Subscription refills focused on loyalty retention.',
            monthlyOrders: 430,
            averageOrderValue: 64,
            returnRate: 0.18,
        },
        {
            label: 'Home Goods',
            description: 'Bulkier SKUs with costly reverse logistics.',
            monthlyOrders: 210,
            averageOrderValue: 118,
            returnRate: 0.14,
        },
    ]

    const roiMetrics = useMemo(() => {
        const projectedReduction = 0.23
        const exchangeCaptureRate = 0.42
        const monthlyGrossSales = monthlyOrders * averageOrderValue
        const currentReturnLoss = monthlyGrossSales * returnRate
        const refundsPrevented = currentReturnLoss * projectedReduction
        const exchangeRevenue = monthlyOrders * returnRate * exchangeCaptureRate * averageOrderValue
        const totalReclaimed = refundsPrevented + exchangeRevenue
        const returnRateAfter = Math.max(returnRate * (1 - projectedReduction), 0)
        const roiMultiple = totalReclaimed / 100
        return {
            monthlyGrossSales,
            currentReturnLoss,
            refundsPrevented,
            exchangeRevenue,
            totalReclaimed,
            returnRateAfter,
            roiMultiple,
            projectedReduction,
            exchangeCaptureRate,
        }
    }, [averageOrderValue, monthlyOrders, returnRate])

    const handleApplyRoiPreset = (preset: RoiPreset) => {
        setMonthlyOrders(preset.monthlyOrders)
        setAverageOrderValue(preset.averageOrderValue)
        setReturnRate(preset.returnRate)
        posthog.capture('roi_preset_applied', { preset: preset.label })
    }

    const handleMonthlyOrdersChange = (event: ChangeEvent<HTMLInputElement>) => {
        const next = Number(event.target.value)
        if (!Number.isNaN(next)) {
            setMonthlyOrders(Math.max(0, Math.min(2000, Math.round(next))))
        }
    }

    const handleAverageOrderValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        const next = Number(event.target.value)
        if (!Number.isNaN(next)) {
            setAverageOrderValue(Math.max(0, Math.min(500, Math.round(next))))
        }
    }

    const handleReturnRateChange = (event: ChangeEvent<HTMLInputElement>) => {
        const next = Number(event.target.value)
        if (!Number.isNaN(next)) {
            setReturnRate(Math.max(0, Math.min(0.5, next)))
        }
    }

    return (
        <section className="roi-calculator" aria-label="ReturnShield ROI forecaster">
            <div className="roi-header">
                <h2>Forecast your ReturnShield revenue impact</h2>
                <p>
                    Adjust the levers below to see how exchange-first automation prevents refunds and keeps more revenue in play.
                    We model against live operator benchmarks from the ReturnShield beta cohort.
                </p>
            </div>
            <div className="roi-layout">
                <form className="roi-form" aria-label="ROI assumptions">
                    <div className="roi-presets" role="group" aria-label="Industry presets">
                        {roiPresets.map((preset) => {
                            const isActive =
                                preset.monthlyOrders === monthlyOrders &&
                                preset.averageOrderValue === averageOrderValue &&
                                Math.abs(preset.returnRate - returnRate) < 0.0001
                            return (
                                <button
                                    key={preset.label}
                                    type="button"
                                    className={`roi-preset ${isActive ? 'is-active' : ''}`}
                                    onClick={() => handleApplyRoiPreset(preset)}
                                    aria-pressed={isActive}
                                >
                                    <span className="preset-label">{preset.label}</span>
                                    <span className="preset-description">{preset.description}</span>
                                </button>
                            )
                        })}
                    </div>
                    <label>
                        <span>Monthly orders</span>
                        <input
                            type="number"
                            min={0}
                            max={2000}
                            step={10}
                            value={monthlyOrders}
                            onChange={handleMonthlyOrdersChange}
                            inputMode="numeric"
                        />
                    </label>
                    <label>
                        <span>Average order value</span>
                        <div className="input-prefix">
                            <span className="prefix">$</span>
                            <input
                                type="number"
                                min={0}
                                max={500}
                                step={1}
                                value={averageOrderValue}
                                onChange={handleAverageOrderValueChange}
                                inputMode="decimal"
                            />
                        </div>
                    </label>
                    <label className="range-field">
                        <span>Current return rate</span>
                        <div className="range-meta">{formatPercent(returnRate, 0)}</div>
                        <input
                            type="range"
                            min={0}
                            max={0.5}
                            step={0.01}
                            value={returnRate}
                            onChange={handleReturnRateChange}
                            aria-valuemin={0}
                            aria-valuemax={0.5}
                            aria-valuenow={returnRate}
                        />
                    </label>
                    <p className="roi-footnote">
                        Benchmarks: {formatPercent(roiMetrics.projectedReduction, 0)} average return-rate reduction,{' '}
                        {formatPercent(roiMetrics.exchangeCaptureRate, 0)} of refunded orders converted to exchanges when ReturnShield
                        playbooks are live.
                    </p>
                </form>
                <div className="roi-results" aria-label="Projected ROI outcomes">
                    <article className="roi-card">
                        <span className="label">Monthly gross sales</span>
                        <strong>{formatCurrency(roiMetrics.monthlyGrossSales)}</strong>
                    </article>
                    <article className="roi-card">
                        <span className="label">Current monthly refund leakage</span>
                        <strong>{formatCurrency(roiMetrics.currentReturnLoss)}</strong>
                    </article>
                    <article className="roi-card">
                        <span className="label">Refunds prevented</span>
                        <strong>{formatCurrency(roiMetrics.refundsPrevented)}</strong>
                    </article>
                    <article className="roi-card">
                        <span className="label">Exchange-driven revenue retained</span>
                        <strong>{formatCurrency(roiMetrics.exchangeRevenue)}</strong>
                    </article>
                    <article className="roi-card">
                        <span className="label">Projected return rate after 60 days</span>
                        <strong>{formatPercent(roiMetrics.returnRateAfter, 1)}</strong>
                    </article>
                    <article className="roi-card roi-highlight">
                        <span className="label">Monthly revenue protected</span>
                        <strong>{formatCurrency(roiMetrics.totalReclaimed)}</strong>
                        <small>{roiMetrics.roiMultiple.toFixed(1)}× subscription ROI</small>
                    </article>
                </div>
            </div>
        </section>
    )
}
