import { useEffect, useState } from "react"
import { ArrowUpRight, BarChart3, Clock, DollarSign, Package, AlertCircle } from "lucide-react"
import { useAuth } from "../providers/AuthProvider"
import { getProfitabilityAnalytics, type ProfitabilityData } from "../services/api"
import { GlassCard } from "../components/ui/GlassCard"
import { Badge } from "../components/ui/badge"
import { Link } from "react-router-dom"

export function DashboardPage() {
  const { user, token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<ProfitabilityData>({
    revenue_retained: 0,
    revenue_refunded: 0,
    exchange_count: 0,
    refund_count: 0,
    retained_percentage: 0
  })

  // Mock data for demo purposes if no store is connected
  const mockStats = {
    revenue_retained: 12450,
    revenue_refunded: 4500,
    exchange_count: 34,
    refund_count: 12,
    retained_percentage: 73
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return
      
      // If user has no store connected, use mock data
      if (!user?.has_shopify_store && user?.store_platform === 'none') {
        setStats(mockStats)
        setLoading(false)
        return
      }

      try {
        const data = await getProfitabilityAnalytics(token)
        // If API returns all zeros (empty state), fall back to defaults or show empty
        if (data) {
            setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error)
        // Fallback to empty stats on error
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [token, user])

  return (
    <div className="space-y-8 p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your return performance and automated actions.</p>
        </div>
        
        {(!user?.has_shopify_store && user?.store_platform === 'none') && (
           <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-600">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">Viewing demo data. <Link to="/setup" className="underline hover:text-yellow-700">Connect your store</Link> to see real stats.</span>
           </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Revenue Saved</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">${stats.revenue_retained.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500 flex items-center inline-flex gap-1">
                +12% <ArrowUpRight className="h-3 w-3" />
              </span>{" "}
              from last month
            </p>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Return Rate</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{stats.exchange_count > 0 ? '18.2' : '0'}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">-2.1%</span> from last month
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Active Returns</h3>
            <Package className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{stats.refund_count + stats.exchange_count}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requires attention
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Retained Revenue</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{stats.retained_percentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: 40%
            </p>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
            <GlassCard className="h-full">
                <div className="p-6 border-b border-border/50">
                    <h3 className="font-bold text-lg">Recent Returns</h3>
                    <p className="text-sm text-muted-foreground">Latest return requests requiring attention.</p>
                </div>
                <div className="p-6">
                    <div className="space-y-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Package className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                            <p className="text-sm font-medium text-foreground">Order #10{20 + i}</p>
                            <p className="text-xs text-muted-foreground">Fit issue • Refund requested</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant={i % 2 === 0 ? "secondary" : "outline"} className={i % 2 === 0 ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0" : ""}>
                            {i % 2 === 0 ? "Automated" : "Pending"}
                            </Badge>
                            <span className="text-sm font-bold text-foreground">-$42.00</span>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
            </GlassCard>
        </div>

        <div className="col-span-3">
            <GlassCard className="h-full">
                <div className="p-6 border-b border-border/50">
                    <h3 className="font-bold text-lg">Exchange Coach</h3>
                    <p className="text-sm text-muted-foreground">AI-driven recommendations.</p>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                    <div className="rounded-xl border border-border/50 bg-background/50 p-4 hover:border-primary/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm">Increase Exchange Bonus</h4>
                            <Badge className="bg-primary/10 text-primary border-0">High Impact</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                        Raising the instant credit bonus to 15% for "Size" returns could capture $2.4k more revenue based on your current return volume.
                        </p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-background/50 p-4 hover:border-primary/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-sm">VIP Fast-Track</h4>
                            <Badge variant="secondary">Medium Impact</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                        Enable auto-approval for Gold tier customers. You have 42 returns pending from high-LTV customers.
                        </p>
                    </div>
                    </div>
                </div>
            </GlassCard>
        </div>
      </div>
    </div>
  )
}
