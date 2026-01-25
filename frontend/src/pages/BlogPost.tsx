import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { blogPosts } from "../data/blogData"
import { Calendar, Clock, User, ArrowLeft, Facebook, Twitter, Linkedin, Mail, Link as LinkIcon, Smartphone } from "lucide-react"
import { useParams, Link, Navigate } from "react-router-dom"
import { useState } from "react"

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = blogPosts.find(p => p.slug === slug)
  const [copied, setCopied] = useState(false)

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  const currentUrl = window.location.href
  const encodedUrl = encodeURIComponent(currentUrl)
  const encodedTitle = encodeURIComponent(post.title)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 md:pt-40">
        
        <article className="container mx-auto px-4 md:px-6 max-w-4xl">
          
          <Link to="/blog">
            <Button variant="ghost" className="mb-8 -ml-4 text-muted-foreground hover:text-foreground group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Blog
            </Button>
          </Link>

          {/* Header */}
          <div className="space-y-6 text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-0 px-4 py-1 text-sm">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-tight text-balance">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm md:text-base">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center text-primary border border-primary/10">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                    <p className="font-semibold text-foreground leading-none">{post.author}</p>
                    <p className="text-xs opacity-70">ReturnShield Team</p>
                </div>
              </div>
              <div className="w-px h-8 bg-border hidden sm:block" />
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

          {/* Featured Image */}
          <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden mb-16 shadow-2xl border border-border/50">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Sidebar / Share Buttons (Desktop) */}
              <div className="hidden lg:flex lg:col-span-1 flex-col items-center gap-4 sticky top-32 h-fit">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground vertical-text" style={{ writingMode: 'vertical-rl' }}>Share</span>
                  
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-secondary/50 text-muted-foreground hover:bg-[#1877F2] hover:text-white transition-colors" title="Share on Facebook">
                      <Facebook className="w-5 h-5" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-secondary/50 text-muted-foreground hover:bg-[#1DA1F2] hover:text-white transition-colors" title="Share on X">
                      <Twitter className="w-5 h-5" />
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-secondary/50 text-muted-foreground hover:bg-[#0A66C2] hover:text-white transition-colors" title="Share on LinkedIn">
                      <Linkedin className="w-5 h-5" />
                  </a>
                  <a href={`mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`} className="p-3 rounded-full bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-colors" title="Share via Email">
                      <Mail className="w-5 h-5" />
                  </a>
                  <button onClick={handleCopyLink} className="p-3 rounded-full bg-secondary/50 text-muted-foreground hover:bg-green-500 hover:text-white transition-colors relative" title="Copy Link">
                      <LinkIcon className="w-5 h-5" />
                      {copied && <span className="absolute left-10 top-2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">Copied!</span>}
                  </button>
              </div>

              {/* Content */}
              <div className="lg:col-span-10">
                <div className="prose prose-lg prose-invert max-w-none 
                    prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight
                    prose-p:text-muted-foreground prose-p:leading-8 prose-p:mb-6
                    prose-li:text-muted-foreground prose-li:my-2
                    prose-strong:text-foreground prose-strong:font-bold
                    prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-secondary/20 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:not-italic prose-blockquote:rounded-r-lg prose-blockquote:my-8
                    prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-border/50
                    prose-hr:border-border prose-hr:my-12
                ">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>
              </div>

              {/* Share Buttons (Mobile) */}
              <div className="lg:hidden w-full flex flex-col gap-4 mt-8 pb-8 border-b border-border">
                  <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Share this article</span>
                  <div className="flex gap-4">
                      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-secondary/50 text-muted-foreground hover:bg-[#1877F2] hover:text-white transition-colors">
                          <Facebook className="w-5 h-5" />
                      </a>
                      <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-secondary/50 text-muted-foreground hover:bg-[#1DA1F2] hover:text-white transition-colors">
                          <Twitter className="w-5 h-5" />
                      </a>
                      <a href={`sms:?body=${encodedTitle} ${encodedUrl}`} className="p-3 rounded-full bg-secondary/50 text-muted-foreground hover:bg-green-600 hover:text-white transition-colors">
                          <Smartphone className="w-5 h-5" />
                      </a>
                      <button onClick={handleCopyLink} className="p-3 rounded-full bg-secondary/50 text-muted-foreground hover:bg-primary hover:text-white transition-colors">
                          <LinkIcon className="w-5 h-5" />
                      </button>
                  </div>
              </div>

          </div>

        </article>

        {/* CTA Section */}
        <div className="container mx-auto px-4 md:px-6 mt-24">
          <div className="bg-gradient-to-br from-primary/5 to-blue-500/10 border border-primary/20 rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10">
                <h2 className="text-3xl font-heading font-bold mb-4">Ready to optimize your returns?</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join 500+ merchants using ReturnShield to turn refunds into revenue. Start your 14-day free trial today.
                </p>
                <Button size="lg" className="text-white shadow-lg shadow-primary/20 hover:shadow-primary/50 hover:scale-105 transition-all duration-300" onClick={() => window.location.href = 'https://app.returnshield.app/register'}>
                Start Free Trial
                </Button>
             </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}