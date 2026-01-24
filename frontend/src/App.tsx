import { motion } from "framer-motion"
import { ArrowRight, BarChart3, CheckCircle2, Globe, LayoutDashboard, ShieldCheck, Zap } from "lucide-react"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { Separator } from "./components/ui/separator"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span>ReturnShield</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#pricing" className="transition-colors hover:text-foreground">Pricing</a>
            <a href="#testimonials" className="transition-colors hover:text-foreground">Customers</a>
          </nav>
          <div className="flex items-center gap-4">
            <a href="https://app.returnshield.app/login" className="text-sm font-medium text-muted-foreground hover:text-foreground hidden sm:block">Log in</a>
            <Button onClick={() => window.location.href = 'https://app.returnshield.app/register'}>
              Start Free Trial
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-20 md:pt-32 md:pb-32 lg:pt-40 lg:pb-40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-40"></div>
          <div className="container px-4 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl space-y-6"
            >
              <Badge variant="secondary" className="px-4 py-1.5 text-sm">
                New: AI-Powered Exchange Coach
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Turn Returns into <span className="text-primary block sm:inline">Revenue</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
                Stop losing margin on refunds. ReturnShield automates exchanges, protects VIP customers, and recovers revenue with intelligent return routing.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" className="h-12 px-8 text-base" onClick={() => window.location.href = 'https://app.returnshield.app/register'}>
                  Start Preventing Returns <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  View Live Demo
                </Button>
              </div>
              <div className="pt-8 text-sm text-muted-foreground">
                <p>Trusted by 500+ Shopify Brands</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="border-y border-border/50 bg-secondary/20 py-12">
          <div className="container px-4">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <h3 className="text-4xl font-bold text-foreground">23%</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">Average Return Reduction</p>
              </div>
              <div className="text-center border-x-0 sm:border-x border-border/50">
                <h3 className="text-4xl font-bold text-foreground">$48k</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">Monthly Revenue Protected</p>
              </div>
              <div className="text-center">
                <h3 className="text-4xl font-bold text-foreground">72h</h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">Time to Live Insights</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="features" className="py-24">
          <div className="container px-4">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Platform Features</h2>
              <p className="mt-4 text-muted-foreground text-lg">Everything you need to master your post-purchase experience.</p>
            </div>
            
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <motion.div variants={item} className="lg:col-span-2">
                <Card className="h-full bg-gradient-to-br from-card to-card/50 border-border/50">
                  <CardHeader>
                    <div className="mb-2 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <CardTitle>Returnless Insights</CardTitle>
                    <CardDescription className="text-base">
                      Identify high-risk SKUs and automate returnless refunds to save on shipping and processing costs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg bg-background/50 border border-border p-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium">Margin Saved</span>
                        <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">+18%</Badge>
                      </div>
                      <div className="h-24 w-full bg-secondary/50 rounded animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="h-full border-border/50">
                  <CardHeader>
                    <div className="mb-2 w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Zap className="w-6 h-6" />
                    </div>
                    <CardTitle>Exchange Autopilot</CardTitle>
                    <CardDescription>
                      Convert refunds into exchanges automatically with instant credit incentives.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Instant credit issuance</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> One-click exchanges</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Inventory syncing</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={item}>
                <Card className="h-full border-border/50">
                  <CardHeader>
                    <div className="mb-2 w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Globe className="w-6 h-6" />
                    </div>
                    <CardTitle>Eco-Friendly Routing</CardTitle>
                    <CardDescription>
                      Calculate carbon impact and route donations to local centers.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>

              <motion.div variants={item} className="lg:col-span-2">
                <Card className="h-full border-border/50">
                  <CardHeader>
                    <div className="mb-2 w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <CardTitle>VIP Resolution Hub</CardTitle>
                    <CardDescription>
                      Prioritize your best customers with dedicated queues and white-glove handling rules.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      <Badge variant="outline" className="whitespace-nowrap">LTV {'>'} $500</Badge>
                      <Badge variant="outline" className="whitespace-nowrap">Repeat Customer</Badge>
                      <Badge variant="outline" className="whitespace-nowrap">No Previous Returns</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-secondary/10">
          <div className="container px-4">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-muted-foreground text-lg">Choose the plan that fits your volume.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Launch Plan */}
              <Card className="relative border-border/50">
                <CardHeader>
                  <CardTitle>Launch</CardTitle>
                  <div className="mt-4 flex items-baseline text-5xl font-extrabold tracking-tight">
                    $29
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                  </div>
                  <CardDescription>For emerging brands.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    {['Daily return summary', '30-day trend analytics', 'Email notifications'].map((feature) => (
                      <li key={feature} className="flex items-center text-muted-foreground">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-8 w-full" variant="outline" onClick={() => window.location.href = 'https://app.returnshield.app/register?plan=launch'}>
                    Get Started
                  </Button>
                </CardContent>
              </Card>

              {/* Scale Plan */}
              <Card className="relative border-primary shadow-lg scale-105 z-10 bg-card">
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most Popular
                </div>
                <CardHeader>
                  <CardTitle>Scale</CardTitle>
                  <div className="mt-4 flex items-baseline text-5xl font-extrabold tracking-tight">
                    $99
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                  </div>
                  <CardDescription>For growing teams.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    {['Everything in Launch', 'AI Exchange Coach', 'VIP Resolution Hub', 'Slack alerts'].map((feature) => (
                      <li key={feature} className="flex items-center text-foreground font-medium">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-8 w-full" onClick={() => window.location.href = 'https://app.returnshield.app/register?plan=scale'}>
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>

              {/* Elite Plan */}
              <Card className="relative border-border/50">
                <CardHeader>
                  <CardTitle>Elite</CardTitle>
                  <div className="mt-4 flex items-baseline text-5xl font-extrabold tracking-tight">
                    $249
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/mo</span>
                  </div>
                  <CardDescription>For high volume.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    {['Everything in Scale', 'Dedicated Strategist', 'Custom Integrations', 'Priority Support'].map((feature) => (
                      <li key={feature} className="flex items-center text-muted-foreground">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-8 w-full" variant="outline" onClick={() => window.location.href = 'https://app.returnshield.app/register?plan=elite'}>
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-12">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 font-bold text-lg">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">ReturnShield</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/privacy" className="hover:text-foreground">Privacy</a>
              <a href="/terms" className="hover:text-foreground">Terms</a>
              <a href="/dmarc" className="hover:text-foreground">DMARC</a>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2026 ReturnShield Inc.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App