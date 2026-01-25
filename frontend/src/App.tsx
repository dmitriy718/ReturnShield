import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import { motion } from "framer-motion"
import { 
  BarChart3, 
  Zap, 
  Globe, 
  LayoutDashboard, 
  CheckCircle2, 
  RefreshCw,
  Box,
  Truck,
  ShieldCheck,
  ArrowRight
} from 'lucide-react'
import { Button } from "./components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Badge } from "./components/ui/badge"

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Aurora Background Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="px-4 py-1.5 text-sm mb-6 border-primary/20 bg-primary/5 text-primary rounded-full">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              New: AI Exchange Coach™ is live
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight leading-tight text-foreground drop-shadow-sm"
          >
            Turn Returns into <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500 animate-gradient-x">Revenue & Loyalty</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
          >
            Stop losing margin on refunds. ReturnShield automates exchanges, protects VIP customers, and recovers revenue with intelligent return routing.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 border-0" onClick={() => window.location.href = 'https://app.returnshield.app/register'}>
              Start Preventing Returns <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-background/50 backdrop-blur border-border hover:bg-background/80 hover:border-primary/50 transition-colors">
              View Live Demo
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-12 text-sm text-muted-foreground"
          >
            <p className="mb-4 font-medium uppercase tracking-wider text-xs opacity-70">Trusted by modern brands</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
               {/* Placeholders for logos */}
               <div className="flex items-center gap-2 font-bold text-lg"><Box className="h-5 w-5" /> AcmeCo</div>
               <div className="flex items-center gap-2 font-bold text-lg"><Globe className="h-5 w-5" /> GlobalStyle</div>
               <div className="flex items-center gap-2 font-bold text-lg"><Zap className="h-5 w-5" /> SwiftWear</div>
               <div className="flex items-center gap-2 font-bold text-lg"><LayoutDashboard className="h-5 w-5" /> LuxeLiving</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const FeatureCard = ({ icon: Icon, title, description, badge, delay }: { icon: any, title: string, description: string, badge?: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative h-full"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <Card className="relative h-full bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-24 h-24 text-primary transform translate-x-4 -translate-y-4" />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="mb-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 ring-1 ring-primary/20">
            <Icon className="w-6 h-6" />
          </div>
          {badge && <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-medium">{badge}</Badge>}
        </div>
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed text-muted-foreground/90">{description}</CardDescription>
      </CardHeader>
    </Card>
  </motion.div>
)

const BentoGrid = () => {
  return (
    <section id="features" className="py-24 bg-secondary/5 relative">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Built to Defend Your Margins</h2>
          <p className="text-lg text-muted-foreground">Every feature is engineered to convert refunds into revenue and protect your bottom line.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {/* Large Card */}
          <div className="md:col-span-2">
            <FeatureCard 
              icon={BarChart3}
              title="Returnless Insights"
              description="Identify high-risk SKUs and automate returnless refunds. Our AI analyzes shipping costs vs. inventory value to make the most profitable decision instantly."
              badge="Save 18% Margin"
              delay={0}
            />
          </div>
          
          {/* Small Cards */}
          <FeatureCard 
            icon={RefreshCw}
            title="Exchange Autopilot"
            description="Convert refunds into exchanges with instant credit incentives and one-click swaps."
            delay={0.1}
          />
          
          <FeatureCard 
            icon={Truck}
            title="Eco-Routing"
            description="Automatically route donations to local centers to reduce carbon footprint and shipping fees."
            delay={0.2}
          />

          <div className="md:col-span-2">
             <FeatureCard 
              icon={ShieldCheck}
              title="VIP Resolution Hub"
              description="Prioritize your best customers. High-LTV shoppers get white-glove treatment and instant resolutions, reducing churn risk by 47%."
              badge="Churn Protection"
              delay={0.3}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

const MetricsSection = () => {
  return (
    <section className="py-20 border-y border-border/50 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-border/50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-4"
          >
            <div className="text-5xl md:text-6xl font-heading font-extrabold text-foreground mb-2 tracking-tighter">23%</div>
            <p className="text-muted-foreground font-medium uppercase tracking-wide text-sm">Average Return Reduction</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-4"
          >
            <div className="text-5xl md:text-6xl font-heading font-extrabold text-foreground mb-2 tracking-tighter">$48k</div>
            <p className="text-muted-foreground font-medium uppercase tracking-wide text-sm">Monthly Revenue Protected</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-4"
          >
            <div className="text-5xl md:text-6xl font-heading font-extrabold text-foreground mb-2 tracking-tighter">72h</div>
            <p className="text-muted-foreground font-medium uppercase tracking-wide text-sm">Time to Live Insights</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

const PricingCard = ({ title, price, description, features, highlighted, cta }: any) => (
  <Card className={`relative flex flex-col h-full transition-all duration-300 ${highlighted ? 'border-primary shadow-2xl shadow-primary/10 scale-105 z-10 bg-card' : 'border-border/50 bg-card/50 hover:border-border hover:bg-card/80'}`}>
    {highlighted && (
      <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-gradient-to-r from-primary to-blue-600 px-4 py-1 text-xs font-bold text-white shadow-lg uppercase tracking-wider">
        Most Popular
      </div>
    )}
    <CardHeader>
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold tracking-tight">${price}</span>
        <span className="text-muted-foreground font-medium">/mo</span>
      </div>
      <CardDescription className="mt-2 text-base">{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-1">
      <ul className="space-y-4 text-sm">
        {features.map((feature: string) => (
          <li key={feature} className="flex items-center gap-3">
            <CheckCircle2 className={`h-5 w-5 shrink-0 ${highlighted ? 'text-primary' : 'text-muted-foreground'}`} />
            <span className="text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <div className="p-6 pt-0">
      <Button 
        className={`w-full h-12 text-base ${highlighted ? 'shadow-lg shadow-primary/20' : ''}`} 
        variant={highlighted ? "default" : "outline"} 
        size="lg"
        onClick={() => window.location.href = `https://app.returnshield.app/register?plan=${title.toLowerCase()}`}
      >
        {cta}
      </Button>
    </div>
  </Card>
)

const PricingSection = () => {
  const plans = [
    {
      title: "Launch",
      price: "29",
      description: "Essential analytics for emerging brands.",
      features: [
        "Daily return summary",
        "30-day trend analytics",
        "Basic email notifications",
        "Standard support",
        "Up to 500 returns/mo"
      ],
      cta: "Get Started"
    },
    {
      title: "Scale",
      price: "99",
      description: "Automation for growing teams.",
      features: [
        "Everything in Launch",
        "AI Exchange Coach™",
        "VIP Resolution Hub",
        "Slack alerts",
        "Unlimited automated rules",
        "Priority support"
      ],
      highlighted: true,
      cta: "Start Free Trial"
    },
    {
      title: "Elite",
      price: "249",
      description: "Enterprise-grade control & insights.",
      features: [
        "Everything in Scale",
        "Dedicated Success Manager",
        "Custom Integrations",
        "Predictive Forecasting",
        "Custom API Rate Limits",
        "24/7 Phone Support"
      ],
      cta: "Contact Sales"
    }
  ]

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/5 skew-y-3 transform origin-top-left -z-10" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground">No hidden fees. Cancel anytime. ReturnShield pays for itself in your first month.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="h-full"
            >
              <PricingCard {...plan} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      <Navbar />
      <Hero />
      <MetricsSection />
      <BentoGrid />
      <PricingSection />
      <Footer />
    </div>
  )
}

export default App