import { useState, useEffect } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/button'
import { useAuth } from '../providers/AuthProvider'
import { getCompanySettings, updateCompanySettings, type CompanySettings } from '../services/settings'
import { Loader2, Save, Store, Truck, Palette, Lock } from 'lucide-react'

export function SettingsPage() {
  const { token, user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'shipping'>('general')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [settings, setSettings] = useState<CompanySettings>({
    brand_color: '#000000',
    logo_url: '',
    return_window_days: 30,
    offer_free_shipping: true,
    restocking_fee: '0.00',
    support_email: '',
    easypost_api_key: '',
    bigcommerce_store_hash: '',
    bigcommerce_access_token: '',
    woocommerce_site_url: '',
    woocommerce_consumer_key: '',
    woocommerce_consumer_secret: ''
  })

  useEffect(() => {
    const loadSettings = async () => {
      if (!token) return
      try {
        const data = await getCompanySettings(token)
        setSettings(prev => ({ ...prev, ...data }))
      } catch (error) {
        console.error('Failed to load settings', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [token])

  const handleSave = async () => {
    if (!token) return
    setSaving(true)
    setMessage(null)
    try {
      await updateCompanySettings(token, settings)
      setMessage({ type: 'success', text: 'Settings saved successfully.' })
      // Clear sensitive fields from UI state if needed, but for now we keep them to show they are set
      // Actually, write-only fields won't be returned by the API, so reloading might clear them.
      // Let's just keep the local state.
    } catch (error) {
      console.error('Failed to save settings', error)
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const tabs = [
    { id: 'general', label: 'General & Brand', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Store },
    { id: 'shipping', label: 'Shipping', icon: Truck },
  ]

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
        <p className="text-muted-foreground">Manage your return policy, integrations, and brand appearance.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <GlassCard className="p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Brand Appearance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Brand Color</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          className="h-10 w-10 p-1 rounded border border-border bg-background cursor-pointer"
                          value={settings.brand_color}
                          onChange={e => setSettings({...settings, brand_color: e.target.value})}
                        />
                        <input 
                          type="text" 
                          className="flex-1 p-2 bg-background border border-border rounded-md uppercase"
                          value={settings.brand_color}
                          onChange={e => setSettings({...settings, brand_color: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Logo URL</label>
                      <input 
                        className="w-full p-2 bg-background border border-border rounded-md"
                        placeholder="https://example.com/logo.png"
                        value={settings.logo_url}
                        onChange={e => setSettings({...settings, logo_url: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">Return Policy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Return Window (Days)</label>
                      <input 
                        type="number"
                        className="w-full p-2 bg-background border border-border rounded-md"
                        value={settings.return_window_days}
                        onChange={e => setSettings({...settings, return_window_days: parseInt(e.target.value) || 30})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Restocking Fee ($)</label>
                      <input 
                        type="number"
                        step="0.01"
                        className="w-full p-2 bg-background border border-border rounded-md"
                        value={settings.restocking_fee}
                        onChange={e => setSettings({...settings, restocking_fee: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={settings.offer_free_shipping}
                          onChange={e => setSettings({...settings, offer_free_shipping: e.target.checked})}
                        />
                        <span className="text-sm">Offer free return shipping labels</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">Support</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Support Email</label>
                    <input 
                      type="email"
                      className="w-full p-2 bg-background border border-border rounded-md"
                      value={settings.support_email}
                      onChange={e => setSettings({...settings, support_email: e.target.value})}
                      placeholder="support@yourstore.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Shopify</h3>
                  <p className="text-sm text-muted-foreground mb-4">Shopify is connected via the official app.</p>
                  {user?.has_shopify_store ? (
                    <div className="bg-green-500/10 text-green-600 px-4 py-2 rounded-md inline-flex items-center gap-2 text-sm font-medium">
                      <Store size={14} /> Connected: {user.shopify_domain}
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-sm italic">Not connected</div>
                  )}
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">BigCommerce</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Store Hash</label>
                      <input 
                        className="w-full p-2 bg-background border border-border rounded-md"
                        value={settings.bigcommerce_store_hash}
                        onChange={e => setSettings({...settings, bigcommerce_store_hash: e.target.value})}
                        placeholder="e.g. abc12345"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Access Token</label>
                      <div className="relative">
                        <input 
                          type="password"
                          className="w-full p-2 bg-background border border-border rounded-md pr-10"
                          value={settings.bigcommerce_access_token}
                          onChange={e => setSettings({...settings, bigcommerce_access_token: e.target.value})}
                          placeholder="••••••••••••••••"
                        />
                        <Lock className="absolute right-3 top-2.5 text-muted-foreground w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">WooCommerce</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Store URL</label>
                      <input 
                        className="w-full p-2 bg-background border border-border rounded-md"
                        value={settings.woocommerce_site_url}
                        onChange={e => setSettings({...settings, woocommerce_site_url: e.target.value})}
                        placeholder="https://yourstore.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Consumer Key</label>
                      <input 
                        className="w-full p-2 bg-background border border-border rounded-md"
                        value={settings.woocommerce_consumer_key}
                        onChange={e => setSettings({...settings, woocommerce_consumer_key: e.target.value})}
                        placeholder="ck_XXXXXXXXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Consumer Secret</label>
                      <div className="relative">
                        <input 
                          type="password"
                          className="w-full p-2 bg-background border border-border rounded-md pr-10"
                          value={settings.woocommerce_consumer_secret}
                          onChange={e => setSettings({...settings, woocommerce_consumer_secret: e.target.value})}
                          placeholder="cs_XXXXXXXXXXXXXXXX"
                        />
                        <Lock className="absolute right-3 top-2.5 text-muted-foreground w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">EasyPost Integration</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    By default, we use our own EasyPost account to generate labels. If you want to use your own negotiated carrier rates, enter your API key below.
                  </p>
                  <div>
                    <label className="block text-sm font-medium mb-1">EasyPost API Key (Production)</label>
                    <div className="relative">
                      <input 
                        type="password"
                        className="w-full p-2 bg-background border border-border rounded-md pr-10"
                        value={settings.easypost_api_key}
                        onChange={e => setSettings({...settings, easypost_api_key: e.target.value})}
                        placeholder="EZAK0000000000000000000000"
                      />
                      <Lock className="absolute right-3 top-2.5 text-muted-foreground w-4 h-4" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      We encrypt this key before storing it.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-8 mt-4 border-t border-border">
              {message && (
                <span className={`text-sm font-medium ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {message.text}
                </span>
              )}
              <div className="ml-auto">
                <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
                  {saving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
