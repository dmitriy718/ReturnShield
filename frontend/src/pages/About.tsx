import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { motion } from "framer-motion"
import { ShieldCheck, Users, Globe, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 md:pt-40">
        {/* Hero Section */}
        <div className="container mx-auto px-4 md:px-6 mb-24">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight mb-6">
                We're fixing the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">broken loop</span> of e-commerce.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                ReturnShield was born from a simple observation: Returns shouldn't be the end of a relationship. They should be a new beginning.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Mission Stats */}
        <div className="bg-secondary/5 border-y border-border/50 py-16 mb-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">1M+</div>
                <div className="text-muted-foreground font-medium">Returns Processed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">$50M+</div>
                <div className="text-muted-foreground font-medium">Revenue Saved</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-muted-foreground font-medium">Happy Merchants</div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="container mx-auto px-4 md:px-6 mb-24 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-heading font-bold">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                In 2023, our founders ran a D2C apparel brand. They realized that while getting an order out the door was automated and slick, handling a return was a nightmare of emails, spreadsheets, and lost inventory.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                They built an internal tool to automate exchanges and route returns. It worked so well that other founders started asking for it. ReturnShield was born to give every merchant the power to turn returns into a competitive advantage.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-3xl p-8 h-80 flex items-center justify-center">
               <ShieldCheck className="w-32 h-32 text-primary/40" />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="container mx-auto px-4 md:px-6 mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide every feature we build.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border/50 p-8 rounded-2xl hover:border-primary/30 transition-colors">
              <Users className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Customer Obsession</h3>
              <p className="text-muted-foreground">We build for the end-consumer first. If they are happy, the merchant wins.</p>
            </div>
            <div className="bg-card border border-border/50 p-8 rounded-2xl hover:border-primary/30 transition-colors">
              <Target className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Data Over Intuition</h3>
              <p className="text-muted-foreground">We don't guess. We use millions of data points to optimize every return decision.</p>
            </div>
            <div className="bg-card border border-border/50 p-8 rounded-2xl hover:border-primary/30 transition-colors">
              <Globe className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Sustainable Commerce</h3>
              <p className="text-muted-foreground">We believe the future of retail must be circular and eco-friendly.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
