import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Mail, MapPin, MessageSquare } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 md:pt-40">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Contact Info */}
            <div>
              <span className="text-primary font-medium tracking-wide uppercase text-sm">Get in touch</span>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight mt-2 mb-6">Let's talk about your returns strategy.</h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-12">
                Whether you have a question about features, pricing, or need a demo, our team is ready to answer all your questions.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Chat with us</h3>
                    <p className="text-muted-foreground mb-2">Our friendly team is here to help.</p>
                    <a href="mailto:hello@returnshield.app" className="text-primary hover:underline font-medium">hello@returnshield.app</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Visit us</h3>
                    <p className="text-muted-foreground mb-2">Come say hello at our office headquarters.</p>
                    <p className="text-foreground font-medium">1200 Commerce Avenue, Suite 400<br/>Austin, TX 78701</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Support</h3>
                    <p className="text-muted-foreground mb-2">Existing customer? Get priority support.</p>
                    <a href="mailto:support@returnshield.app" className="text-primary hover:underline font-medium">support@returnshield.app</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">First name</label>
                    <Input id="first-name" placeholder="Jane" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Last name</label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                  <Input id="email" placeholder="jane@company.com" type="email" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Message</label>
                  <Textarea id="message" placeholder="Tell us about your needs..." className="min-h-[120px]" />
                </div>
                <Button className="w-full text-white" size="lg">Send Message</Button>
              </form>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
