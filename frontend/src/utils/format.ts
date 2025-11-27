export const formatCurrency = (value: number) =>
    value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const formatCurrencyWithCents = (value: number) =>
    value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    })

export const formatPercent = (value: number, digits = 0) => `${(value * 100).toFixed(digits)}%`

export const formatNumber = (value: number, digits = 0) =>
    value.toLocaleString('en-US', { maximumFractionDigits: digits })

export const formatHours = (value: number) => `${value.toFixed(1)} hrs`
