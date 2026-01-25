import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Menu, X } from 'lucide-react'
import { Button } from "./ui/button"

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-border/50 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          ReturnShield
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/#features" className="text-sm font-medium text-muted-foreground hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-300">Features</a>
          <a href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-300">How it Works</a>
          <a href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-300">Pricing</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="https://app.returnshield.app/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Log in</a>
          <Button onClick={() => window.location.href = 'https://app.returnshield.app/register'} className="text-white shadow-lg shadow-primary/20 hover:shadow-primary/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-300">
            Start Free Trial
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <a href="/#features" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="/#how-it-works" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>How it Works</a>
              <a href="/#pricing" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <div className="h-px bg-border my-2" />
              <a href="https://app.returnshield.app/login" className="text-lg font-medium">Log in</a>
              <Button className="w-full" onClick={() => window.location.href = 'https://app.returnshield.app/register'}>Start Free Trial</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
