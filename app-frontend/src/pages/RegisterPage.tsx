import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'
import type { StorePlatform } from '../types'
import './AuthPages.css'

export function RegisterPage() {
  const { register } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [storePlatform, setStorePlatform] = useState<StorePlatform>('shopify')
  const [storeDomain, setStoreDomain] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const requiresDomain = storePlatform !== 'none'
      const trimmedDomain = storeDomain.trim()
      if (requiresDomain && !trimmedDomain) {
        setError('Please provide your storefront domain or URL.')
        setSubmitting(false)
        return
      }
      await register({
        email: email.trim(),
        password,
        companyName: companyName.trim(),
        storePlatform,
        storeDomain: trimmedDomain,
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
            <legend>Where do you manage your storefront today?</legend>
            <label className="auth-radio">
              <input
                type="radio"
                name="store_platform"
                value="shopify"
                checked={storePlatform === 'shopify'}
                onChange={() => setStorePlatform('shopify')}
              />
              <span>Shopify</span>
            </label>
            <label className="auth-radio">
              <input
                type="radio"
                name="store_platform"
                value="bigcommerce"
                checked={storePlatform === 'bigcommerce'}
                onChange={() => setStorePlatform('bigcommerce')}
              />
              <span>BigCommerce</span>
            </label>
            <label className="auth-radio">
              <input
                type="radio"
                name="store_platform"
                value="woocommerce"
                checked={storePlatform === 'woocommerce'}
                onChange={() => setStorePlatform('woocommerce')}
              />
              <span>WooCommerce</span>
            </label>
            <label className="auth-radio">
              <input
                type="radio"
                name="store_platform"
                value="none"
                checked={storePlatform === 'none'}
                onChange={() => {
                  setStorePlatform('none')
                  setStoreDomain('')
                }}
              />
              <span>Not yet connected</span>
            </label>
          </fieldset>

          <label className={storePlatform === 'none' ? 'input-disabled' : ''}>
            <span>
              {storePlatform === 'shopify'
                ? 'Shopify domain'
                : storePlatform === 'bigcommerce'
                ? 'BigCommerce store domain'
                : storePlatform === 'woocommerce'
                ? 'WooCommerce site URL'
                : 'Storefront domain'}
            </span>
            <input
              type="text"
              value={storeDomain}
              onChange={(event) => setStoreDomain(event.target.value)}
              placeholder={
                storePlatform === 'shopify'
                  ? 'brand.myshopify.com'
                  : storePlatform === 'bigcommerce'
                  ? 'store.example.com'
                  : storePlatform === 'woocommerce'
                  ? 'https://store.example.com'
                  : 'Provide when you connect your store'
              }
              required={storePlatform !== 'none'}
              disabled={storePlatform === 'none'}
            />
            <small>
              We’ll blur live metrics until billing is active. If you’re exploring without a store, choose “Not yet
              connected” and you can add your platform later in Integrations.
            </small>
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={submitting}
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

