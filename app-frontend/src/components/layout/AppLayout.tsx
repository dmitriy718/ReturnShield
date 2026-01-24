import { Outlet, Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Settings, CreditCard, LogOut, ShieldCheck, Activity, Plug } from "lucide-react"
import { useAuth } from "../../providers/AuthProvider"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"

export function AppLayout() {
  const { logout, user } = useAuth()
  const location = useLocation()

  const navItems = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/automation", label: "Automation", icon: Activity },
    { href: "/integrations/health", label: "Integrations", icon: Plug },
    { href: "/billing", label: "Billing", icon: CreditCard },
  ]

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-border bg-card/50 md:flex">
        <div className="flex h-16 items-center px-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span>ReturnShield</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
              {user?.company_name?.[0] || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">{user?.company_name || "Company"}</span>
              <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b border-border/50 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span>ReturnShield</span>
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}