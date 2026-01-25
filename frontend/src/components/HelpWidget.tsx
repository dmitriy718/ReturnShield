import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X, Book, Sparkles, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-72 bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="bg-primary px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-primary-foreground">Help & Updates</span>
              <button onClick={() => setIsOpen(false)} className="text-primary-foreground/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-2 space-y-1">
              <Link 
                to="/blog" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">What's New</div>
                  <div className="text-xs text-muted-foreground">Latest updates & changelog</div>
                </div>
              </Link>
              
              <Link 
                to="/help" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <Book className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">Help Center</div>
                  <div className="text-xs text-muted-foreground">Guides & documentation</div>
                </div>
              </Link>

              <Link 
                to="/contact" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium text-sm">Contact Support</div>
                  <div className="text-xs text-muted-foreground">Chat with our team</div>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-secondary text-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  )
}
