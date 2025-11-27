import { Link } from 'react-router-dom'
import logoMark from '../assets/logo-mark.svg'

export function Footer() {
    const handleFooterLink = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        // Note: Original code called setNavOpen(false) here.
        // Assuming navigation closes menu or menu covers footer, so this might be redundant
        // if Header manages its own state.
        if (window.location.pathname === path) {
            event.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <footer className="footer">
            <div>
                <Link
                    to="/"
                    className="brand"
                    aria-label="ReturnShield home"
                    onClick={(event) => handleFooterLink(event, '/')}
                >
                    <img src={logoMark} alt="ReturnShield shield" className="brand-icon" />
                    <div className="brand-text">
                        <span className="brand-title">ReturnShield</span>
                        <span className="brand-tagline">Turn Your Returns Into Relationships</span>
                    </div>
                </Link>
            </div>
            <div className="footer-links">
                <a href="mailto:hello@returnshield.app">hello@returnshield.app</a>
                <Link to="/privacy" onClick={(event) => handleFooterLink(event, '/privacy')}>
                    Privacy Policy
                </Link>
                <Link to="/terms" onClick={(event) => handleFooterLink(event, '/terms')}>
                    Terms of Service
                </Link>
                <Link to="/dmarc" onClick={(event) => handleFooterLink(event, '/dmarc')}>
                    DMARC Policy
                </Link>
            </div>
        </footer>
    )
}
