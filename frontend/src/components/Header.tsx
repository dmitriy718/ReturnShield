import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import posthog from 'posthog-js'
import logoMark from '../assets/logo-mark.svg'
import { withUtm } from '../utils/utm'

export function Header() {
    const [navOpen, setNavOpen] = useState(false)
    const navigateInternal = useNavigate()
    // const location = useLocation()

    useEffect(() => {
        if (navOpen) {
            document.body.classList.add('no-scroll')
        } else {
            document.body.classList.remove('no-scroll')
        }
    }, [navOpen])

    const scrollToId = (id: string) => {
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const handleNavScroll = (id: string) => {
        setNavOpen(false)
        if (window.location.pathname === '/') {
            scrollToId(id)
        } else {
            navigateInternal('/', { state: { scrollTo: id } })
        }
    }

    return (
        <header className="top-nav">
            <Link to="/" className="brand" aria-label="ReturnShield home" onClick={() => setNavOpen(false)}>
                <img src={logoMark} alt="ReturnShield shield" className="brand-icon" />
                <div className="brand-text">
                    <span className="brand-title">ReturnShield</span>
                    <span className="brand-tagline">Turn Your Returns Into Relationships</span>
                </div>
            </Link>
            <button
                className={`nav-toggle ${navOpen ? 'is-open' : ''}`}
                aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'}
                onClick={() => setNavOpen((prev) => !prev)}
            >
                <span />
                <span />
                <span />
            </button>
            <nav className={`nav-links ${navOpen ? 'nav-open' : ''}`}>
                <button type="button" className="nav-link-button" onClick={() => handleNavScroll('features')}>
                    Features
                </button>
                <button type="button" className="nav-link-button" onClick={() => handleNavScroll('impact')}>
                    Impact
                </button>
                <button type="button" className="nav-link-button" onClick={() => handleNavScroll('coach')}>
                    AI Coach
                </button>
                <button type="button" className="nav-link-button" onClick={() => handleNavScroll('vip')}>
                    VIP Hub
                </button>
                <button type="button" className="nav-link-button" onClick={() => handleNavScroll('autopilot')}>
                    Exchange Autopilot
                </button>
                <button type="button" className="nav-link-button" onClick={() => handleNavScroll('integrations')}>
                    Integrations
                </button>
                <button type="button" className="nav-link-button" onClick={() => handleNavScroll('pricing')}>
                    Pricing
                </button>
                <button type="button" className="nav-link-button" onClick={() => handleNavScroll('stories')}>
                    Customer Wins
                </button>
                <button type="button" className="nav-link-button" onClick={() => handleNavScroll('faq')}>
                    FAQ
                </button>
                <div className="nav-mobile-cta">
                    <a
                        className="link-muted"
                        href={withUtm('https://app.returnshield.app/login', 'nav_mobile_login')}
                        onClick={() => setNavOpen(false)}
                    >
                        Log in
                    </a>
                    <a
                        className="btn btn-primary"
                        href={withUtm('https://app.returnshield.app/register', 'nav_mobile_primary_cta')}
                        onClick={() => {
                            setNavOpen(false)
                            posthog.capture('cta_click', { cta: 'start_preventing_returns' })
                        }}
                    >
                        Start Preventing Returns
                    </a>
                </div>
            </nav>
            <div className="nav-actions">
                <a className="link-muted" href={withUtm('https://app.returnshield.app/login', 'nav_desktop_login')}>
                    Log in
                </a>
                <a
                    className="btn btn-primary btn-trial"
                    href={withUtm('https://app.returnshield.app/register', 'nav_desktop_primary_cta')}
                    onClick={() => posthog.capture('cta_click', { cta: 'start_preventing_returns' })}
                >
                    Start Preventing Returns
                </a>
            </div>
        </header>
    )
}
