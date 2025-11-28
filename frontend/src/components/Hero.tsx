
import posthog from 'posthog-js'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import { withUtm } from '../utils/utm'
import { formatCurrency, formatNumber, formatHours } from '../utils/format'

type HeroProps = {
    liveImpact: {
        revenueProtectedQuarter: number
        landfillDiverted: number
        hoursReturned: number
    }
}

export function Hero({ liveImpact }: HeroProps) {
    return (
        <section className="hero">
            <div className="hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="badge badge-accent mb-4">
                        <ShieldCheck size={14} className="mr-1" />
                        Stop losing money on returns
                    </span>
                    <h1 className="text-gradient">
                        Return insights that <br /> actually make sense.
                    </h1>
                    <p className="hero-subtitle">
                        ReturnShield turns messy return data into revenue-saving actions. Detect operational leaks, automate smarter policies, and prove the ROI of every fulfillment decision.
                    </p>
                </motion.div>

                <motion.div
                    className="impact-ticker glass-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div>
                        <span className="ticker-label">Revenue protected (90 days)</span>
                        <strong className="text-gradient-accent">{formatCurrency(liveImpact.revenueProtectedQuarter)}</strong>
                    </div>
                    <div>
                        <span className="ticker-label">Landfill diverted</span>
                        <strong>{formatNumber(liveImpact.landfillDiverted, 0)} lbs</strong>
                    </div>
                    <div>
                        <span className="ticker-label">CX hours returned</span>
                        <strong>{formatHours(liveImpact.hoursReturned)}</strong>
                    </div>
                </motion.div>

                <motion.div
                    className="hero-cta"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <a
                        className="btn btn-primary"
                        href={withUtm('https://app.returnshield.app/register', 'hero_primary_cta')}
                        onClick={() => posthog.capture('cta_click', { cta: 'start_preventing_returns' })}
                    >
                        Start Preventing Returns <ArrowRight size={18} />
                    </a>
                    <a
                        className="btn btn-secondary"
                        href="#features"
                        onClick={() => posthog.capture('cta_click', { cta: 'see_the_why' })}
                    >
                        See the Why Behind Returns
                    </a>
                </motion.div>

                <motion.div
                    className="hero-proof"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <div className="glass-card p-4">
                        <strong className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            Built for Shopify brands
                        </strong>
                        <p>Connect, sync, and act in under 72 hours.</p>
                    </div>
                    <div className="glass-card p-4">
                        <strong className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-emerald-400" />
                            Convert returns, not customers
                        </strong>
                        <p>Exchange-first automation keeps loyal buyers.</p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
