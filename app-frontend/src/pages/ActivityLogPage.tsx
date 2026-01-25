import { GlassCard } from '../components/ui/GlassCard'
import { Badge } from '../components/ui/badge'
import { Activity, ShoppingCart, RefreshCw, AlertTriangle } from 'lucide-react'

// Mock data for the MVP as we don't have a dedicated "events" endpoint yet
const events = [
  { id: 1, type: 'return_created', message: 'Return #1029 created by sarah@example.com', time: '2 mins ago', icon: RefreshCw, color: 'text-blue-500' },
  { id: 2, type: 'order_synced', message: 'Order #1030 synced from Shopify', time: '15 mins ago', icon: ShoppingCart, color: 'text-green-500' },
  { id: 3, type: 'rule_triggered', message: 'Auto-approved return #1028 (Under $50)', time: '1 hour ago', icon: Activity, color: 'text-purple-500' },
  { id: 4, type: 'flagged', message: 'Return #1025 flagged for manual review (High Value)', time: '3 hours ago', icon: AlertTriangle, color: 'text-yellow-500' },
  { id: 5, type: 'order_synced', message: 'Order #1029 synced from Shopify', time: '4 hours ago', icon: ShoppingCart, color: 'text-green-500' },
]

export function ActivityLogPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Activity Log</h2>
        <p className="text-muted-foreground">Recent system events, webhooks, and automation triggers.</p>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="divide-y divide-border/50">
          {events.map((event) => (
            <div key={event.id} className="p-4 flex items-start gap-4 hover:bg-muted/5 transition-colors">
              <div className={`mt-1 w-8 h-8 rounded-full bg-secondary flex items-center justify-center ${event.color}`}>
                <event.icon size={14} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-foreground">{event.message}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{event.time}</span>
                </div>
                <div className="mt-1">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{event.type}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
