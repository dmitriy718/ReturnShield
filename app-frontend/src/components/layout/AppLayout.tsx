import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider'
import './AppLayout.css'

const navigation = [
  { to: '/', label: 'Overview', exact: true },
  { to: '/automation', label: 'Exchange Automation' },
  { to: '/billing', label: 'Billing' },
]

export function AppLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-brand">ReturnShield</span>
          <p className="sidebar-tagline">Keep returns profitable.</p>
        </div>
        <nav>
          <ul>
            {navigation.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.exact}
                  className={({ isActive }) => (isActive ? 'active-nav-link' : undefined)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <button type="button" onClick={logout} className="logout-button">
            Log out
          </button>
        </div>
      </aside>
      <div className="app-content">
        <header className="app-header">
          <div>
            <h1>
              {location.pathname === '/'
                ? 'Insights Overview'
                : navigation.find((item) => item.to === location.pathname)?.label ?? 'Dashboard'}
            </h1>
            <p className="app-subheading">
              Stay on top of margins, exchanges, and VIP engagements in a single workspace.
            </p>
          </div>
          <div className="app-user">
            <span className="avatar">{getInitials(user?.company_name || user?.username || 'RS')}</span>
            <div>
              <p className="user-name">{user?.company_name || 'ReturnShield operator'}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function getInitials(source: string) {
  const parts = source.split(' ').filter(Boolean)
  if (parts.length === 0) {
    return 'RS'
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

