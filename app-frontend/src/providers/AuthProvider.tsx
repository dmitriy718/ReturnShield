/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { apiFetch, ApiError } from '../services/api'
import type { OnboardingStage, StorePlatform, User } from '../types'
import { identifyPosthogUser, resetPosthogUser } from '../lib/posthog'

type AuthState = {
  user: User | null
  token: string | null
  loading: boolean
  login: (credentials: { username: string; password: string }) => Promise<void>
  register: (payload: {
    email: string
    password: string
    companyName: string
    storePlatform: StorePlatform
    storeDomain: string
  }) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  updateOnboarding: (stage: OnboardingStage) => Promise<void>
  completeWalkthrough: (completed: boolean) => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const TOKEN_STORAGE_KEY = 'returnshield_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  })
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const loadUser = useCallback(
    async (nextToken: string | null) => {
      if (!nextToken) {
        setUser(null)
        resetPosthogUser()
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const profile = await apiFetch<User>('/accounts/me/', {
          method: 'GET',
          token: nextToken,
        })
        setUser(profile)
        identifyPosthogUser(profile.id.toString(), {
          email: profile.email,
          company_name: profile.company_name,
          store_platform: profile.store_platform,
          store_domain: profile.store_domain,
          onboarding_stage: profile.onboarding_stage,
          subscription_status: profile.subscription_status,
          has_shopify_store: profile.has_shopify_store,
        })
      } catch (error) {
        console.error('Failed to fetch profile', error)
        setToken(null)
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        resetPosthogUser()
      } finally {
        setLoading(false)
      }
    },
    [setUser],
  )

  useEffect(() => {
    void loadUser(token)
  }, [token, loadUser])

  const handleLogin = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      try {
        const response = await apiFetch<{ token: string }>('/accounts/login/', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        })
        setToken(response.token)
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token)
        await loadUser(response.token)
      } catch (error) {
        if (error instanceof ApiError && error.detail) {
          throw new Error(error.detail)
        }
        throw new Error('Unable to log in. Please check your credentials.')
      }
    },
    [loadUser],
  )

  const handleRegister = useCallback(
    async ({
      email,
      password,
      companyName,
      storePlatform,
      storeDomain,
    }: {
      email: string
      password: string
      companyName: string
      storePlatform: StorePlatform
      storeDomain: string
    }) => {
      try {
        const payload = await apiFetch<{ token: string; username: string }>('/accounts/register/', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            company_name: companyName,
            store_platform: storePlatform,
            store_domain: storeDomain,
            has_shopify_store: storePlatform === 'shopify',
            shopify_domain: storePlatform === 'shopify' ? storeDomain : '',
            username: email,
          }),
        })
        setToken(payload.token)
        localStorage.setItem(TOKEN_STORAGE_KEY, payload.token)
        await loadUser(payload.token)
      } catch (error) {
        if (error instanceof ApiError && error.detail) {
          throw new Error(error.detail)
        }
        throw new Error('Unable to complete registration. Please try again.')
      }
    },
    [loadUser],
  )

  const handleLogout = useCallback(() => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    resetPosthogUser()
  }, [])

  const refreshUser = useCallback(async () => {
    await loadUser(token)
  }, [loadUser, token])

  const updateOnboarding = useCallback(
    async (stage: OnboardingStage) => {
      if (!token) {
        throw new Error('You must be signed in to update onboarding progress.')
      }
      await apiFetch('/accounts/onboarding/', {
        method: 'POST',
        body: JSON.stringify({ stage }),
        token,
      })
      await loadUser(token)
    },
    [token, loadUser],
  )

  const completeWalkthrough = useCallback(
    async (completed: boolean) => {
      if (!token) {
        throw new Error('You must be signed in to update walkthrough status.')
      }
      await apiFetch('/accounts/walkthrough/', {
        method: 'POST',
        body: JSON.stringify({ completed }),
        token,
      })
      await loadUser(token)
    },
    [token, loadUser],
  )

  const value = useMemo<AuthState>(
    () => ({
      user,
      token,
      loading,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      refreshUser,
      updateOnboarding,
      completeWalkthrough,
    }),
    [
      user,
      token,
      loading,
      handleLogin,
      handleRegister,
      handleLogout,
      refreshUser,
      updateOnboarding,
      completeWalkthrough,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

