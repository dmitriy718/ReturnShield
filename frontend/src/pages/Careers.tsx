import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { ArrowRight, Code, DollarSign, HeartHandshake } from "lucide-react"

export default function CareersPage() {
  const positions = [
    {
      title: "Senior Frontend Engineer",
      department: "Engineering",
      location: "Remote / Austin, TX",
      type: "Full-time",
      icon: Code,
      description: "We are looking for a React expert to help us build the next generation of our merchant dashboard and shopper portal."
    },
    {
      title: "Enterprise Account Executive",
      department: "Sales",
      location: "New York, NY",
      type: "Full-time",
      icon: DollarSign,
      description: "Drive revenue by closing deals with mid-market and enterprise D2C brands. Experience in e-commerce SaaS required."
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      icon: HeartHandshake,
      description: "Be the trusted advisor to our merchants. Help them optimize their return settings and increase retained revenue."
    }
  ]

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 md:pt-40">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <Badge variant="secondary" className="mb-4">We're hiring!</Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight mb-6">
              Build the future of <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">commerce logistics</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Join a team of data nerds, design obsessives, and e-commerce veterans working to solve a $816 billion problem.
            </p>
          </div>

          {/* Open Positions */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Open Positions</h2>
            <div className="grid gap-6">
              {positions.map((job) => (
                <div key={job.title} className="group bg-card border border-border/50 rounded-xl p-6 hover:border-primary/30 transition-all hover:shadow-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-secondary p-3 rounded-lg text-foreground group-hover:text-primary transition-colors">
                        <job.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{job.title}</h3>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.type}</span>
                        </div>
                        <p className="mt-3 text-muted-foreground leading-relaxed max-w-xl">
                          {job.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="outline" className="w-full md:w-auto group-hover:bg-primary group-hover:text-white transition-colors">
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-8 bg-secondary/10 rounded-2xl text-center">
              <h3 className="text-xl font-bold mb-2">Don't see your role?</h3>
              <p className="text-muted-foreground mb-6">We are always looking for talented people. Send your resume to careers@returnshield.app.</p>
              <Button variant="link" className="text-primary">Email us &rarr;</Button>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
