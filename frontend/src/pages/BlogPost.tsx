import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { blogPosts } from "../data/blogData"
import { Calendar, Clock, User, ArrowLeft, Share2 } from "lucide-react"
import { useParams, Link, Navigate } from "react-router-dom"
import { motion } from "framer-motion"

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = blogPosts.find(p => p.slug === slug)

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 md:pt-40">
        
        {/* Progress bar could go here */}

        <article className="container mx-auto px-4 md:px-6 max-w-4xl">
          
          <Link to="/blog">
            <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Button>
          </Link>

          <div className="space-y-6 text-center mb-12">
            <Badge variant="secondary" className="mb-4">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <User className="w-4 h-4" />
                </div>
                <span className="font-medium text-foreground">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-16 shadow-2xl">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-50" />
          </div>

          <div className="prose prose-lg prose-invert max-w-none 
            prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground
            prose-p:text-muted-foreground prose-p:leading-loose
            prose-li:text-muted-foreground
            prose-strong:text-foreground prose-strong:font-bold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-primary prose-blockquote:bg-secondary/10 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r-lg
          ">
            {/* Dangerously setting HTML since we control the content in blogData.ts */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
             <div className="text-muted-foreground">
               Share this article
             </div>
             <div className="flex gap-2">
               <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(window.location.href)}>
                 <Share2 className="w-4 h-4" />
               </Button>
               {/* Add social share buttons if needed */}
             </div>
          </div>

        </article>

        {/* CTA Section */}
        <div className="container mx-auto px-4 md:px-6 mt-24">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-12 text-center max-w-4xl mx-auto">
             <h2 className="text-3xl font-heading font-bold mb-4">Ready to optimize your returns?</h2>
             <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
               Join 500+ merchants using ReturnShield to turn refunds into revenue.
             </p>
             <Button size="lg" className="text-white shadow-lg shadow-primary/20 hover:shadow-primary/50 transition-all" onClick={() => window.location.href = 'https://app.returnshield.app/register'}>
               Start Free Trial
             </Button>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}
