import { useEffect, useState } from "react"
import { ArrowUpRight, BarChart3, Clock, DollarSign, Package } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { useAuth } from "../providers/AuthProvider"
import { fetchReturnlessInsights, fetchExchangeCoach, fetchVIPResolution } from "../services/api" // Assuming these exist or I need to mock/fix them if they rely on old types

export function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    revenueSaved: 12450,
    returnRate: 18.2,
    activeReturns: 42,
    exchangeRate: 34
  })

  // Placeholder for real data fetching logic
  useEffect(() => {
    // In a real scenario, we'd fetch dashboard stats here
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your return performance and automated actions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Saved</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenueSaved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center inline-flex gap-1">
                +12% <ArrowUpRight className="h-3 w-3" />
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.returnRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">-2.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Returns</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReturns}</div>
            <p className="text-xs text-muted-foreground">
              +4 since yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exchange Rate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.exchangeRate}%</div>
            <p className="text-xs text-muted-foreground">
              Target: 40%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Returns</CardTitle>
            <CardDescription>Latest return requests requiring attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Order #10{20 + i}</p>
                      <p className="text-xs text-muted-foreground">Fit issue • Refund requested</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={i % 2 === 0 ? "secondary" : "outline"}>
                      {i % 2 === 0 ? "Automated" : "Pending"}
                    </Badge>
                    <span className="text-sm font-bold">-$42.00</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Exchange Coach</CardTitle>
            <CardDescription>AI-driven recommendations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold text-sm mb-1">Increase Exchange Bonus</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Raising the instant credit bonus to 15% for "Size" returns could capture $2.4k more revenue.
                </p>
                <Badge>High Impact</Badge>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <h4 className="font-semibold text-sm mb-1">VIP Fast-Track</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Enable auto-approval for Gold tier customers to reduce churn risk.
                </p>
                <Badge variant="secondary">Medium Impact</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}