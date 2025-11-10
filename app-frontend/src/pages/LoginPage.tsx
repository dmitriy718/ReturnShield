import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import './AuthPages.css'

type LocationState = {
  from?: Location
}

export function LoginPage() {
  const { login } = useAuth()
  const location = useLocation()
  const state = location.state as LocationState | undefined

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login({ username: email.trim(), password })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="auth-header">
          <span className="auth-badge">ReturnShield</span>
          <h1>Sign in to your dashboard</h1>
          <p>Exchange-first analytics, automated playbooks, and VIP insights—all in one place.</p>
          {state?.from && (
            <p className="auth-note">Please sign in to continue to {state.from.pathname.replace('/', '') || 'dashboard'}.</p>
          )}
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@brand.com"
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-footer">
          New to ReturnShield? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  )
}

