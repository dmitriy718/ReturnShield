import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { helpDocs } from "../data/helpData"
import { Clock, ArrowLeft, BookOpen, ThumbsUp, ThumbsDown } from "lucide-react"
import { useParams, Link, Navigate } from "react-router-dom"

export default function HelpDocPage() {
  const { slug } = useParams()
  const doc = helpDocs.find(d => d.slug === slug)

  if (!doc) {
    return <Navigate to="/help" replace />
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 md:pt-40">
        
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <Link to="/help">
            <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Help Center
            </Button>
          </Link>

          <article>
            <div className="mb-10 pb-10 border-b border-border">
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="outline" className="text-muted-foreground border-border">{doc.category}</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{doc.readTime}</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-heading font-extrabold tracking-tight mb-4">
                {doc.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {doc.description}
              </p>
            </div>

            <div className="prose prose-lg prose-invert max-w-none 
              prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground
              prose-p:text-muted-foreground prose-p:leading-8
              prose-li:text-muted-foreground
              prose-strong:text-foreground prose-strong:font-bold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-code:bg-secondary/50 prose-code:rounded prose-code:px-1 prose-code:text-primary
              prose-pre:bg-secondary/10 prose-pre:border prose-pre:border-border
            ">
               <div dangerouslySetInnerHTML={{ __html: doc.content }} />
            </div>

            <div className="mt-16 pt-8 border-t border-border">
              <h3 className="text-lg font-bold mb-4">Was this article helpful?</h3>
              <div className="flex gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <ThumbsUp className="w-4 h-4" /> Yes
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <ThumbsDown className="w-4 h-4" /> No
                </Button>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  )
}
