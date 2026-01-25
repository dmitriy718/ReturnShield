import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { helpDocs } from "../data/helpData"
import { Search, Book, FileText, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredDocs = helpDocs.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = Array.from(new Set(helpDocs.map(doc => doc.category)))

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 md:pt-40">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight mb-6">
              How can we <span className="text-primary">help</span>?
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Search our knowledge base for guides, tutorials, and FAQs.
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input 
                className="pl-12 h-12 text-lg shadow-lg border-border/50 focus-visible:ring-primary/50" 
                placeholder="Search for answers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <Link to={`/help/${doc.slug}`} key={doc.id} className="group">
                  <Card className="h-full border-border/50 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1 bg-card">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-0">{doc.category}</Badge>
                        <span className="text-xs text-muted-foreground">{doc.readTime}</span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{doc.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base line-clamp-2">
                        {doc.description}
                      </CardDescription>
                      <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                        Read Guide <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">No results found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms or browse all articles.</p>
                <button onClick={() => setSearchQuery("")} className="mt-4 text-primary font-medium hover:underline">Clear search</button>
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div className="mt-20 text-center border-t border-border pt-12">
            <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
            <p className="text-muted-foreground mb-6">Our support team is just a click away.</p>
            <Link to="/contact">
              <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">
                Contact Support
              </div>
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
