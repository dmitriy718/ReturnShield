import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import './AuthPages.css'

export function RegisterPage() {
  const { register } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [hasShopifyStore, setHasShopifyStore] = useState<'yes' | 'no' | ''>('')
  const [shopifyDomain, setShopifyDomain] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const normalizedHasStore = hasShopifyStore === 'yes'
      await register({
        email: email.trim(),
        password,
        companyName: companyName.trim(),
        hasShopifyStore: normalizedHasStore,
        shopifyDomain: shopifyDomain.trim(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="auth-header">
          <span className="auth-badge">ReturnShield</span>
          <h1>Create your ReturnShield account</h1>
          <p>Start converting refunds to exchanges and keep VIP customers delighted.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Work email</span>
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
              autoComplete="new-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a strong password"
            />
          </label>

          <label>
            <span>Company name</span>
            <input
              type="text"
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="Acme Studios"
              required
            />
          </label>

          <fieldset className="auth-fieldset">
            <legend>Do you currently run a Shopify store?</legend>
            <label className="auth-radio">
              <input
                type="radio"
                name="has_shopify_store"
                value="yes"
                checked={hasShopifyStore === 'yes'}
                onChange={() => setHasShopifyStore('yes')}
                required
              />
              <span>Yes, I operate a Shopify storefront</span>
            </label>
            <label className="auth-radio">
              <input
                type="radio"
                name="has_shopify_store"
                value="no"
                checked={hasShopifyStore === 'no'}
                onChange={() => {
                  setHasShopifyStore('no')
                  setShopifyDomain('')
                }}
                required
              />
              <span>No, I’m validating workflows first</span>
            </label>
          </fieldset>

          <label className={hasShopifyStore === 'yes' ? '' : 'input-disabled'}>
            <span>Primary Shopify domain</span>
            <input
              type="text"
              value={shopifyDomain}
              onChange={(event) => setShopifyDomain(event.target.value)}
              placeholder="brand.myshopify.com"
              required={hasShopifyStore === 'yes'}
              disabled={hasShopifyStore !== 'yes'}
            />
            <small>
              We’ll blur live metrics until billing is active. If you’re exploring without a store, we’ll guide you with
              sample data.
            </small>
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={submitting || hasShopifyStore === ''}
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

