import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { blogPosts } from "../data/blogData"
import { Calendar, Clock, User } from "lucide-react"
import { Link } from "react-router-dom"

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 md:pt-40">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight mb-6">
              The ReturnShield <span className="text-primary">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Insights, strategies, and data-driven tactics to master the post-purchase experience.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.id} className="group h-full">
                <Card className="h-full flex flex-col overflow-hidden border-border/50 hover:border-primary/30 transition-all hover:shadow-lg bg-card">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-background/80 backdrop-blur text-foreground hover:bg-background/90">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>
                    <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <CardDescription className="line-clamp-3 mb-4 text-base">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                       <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs">
                          <User className="w-3 h-3" />
                       </div>
                       {post.author}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
