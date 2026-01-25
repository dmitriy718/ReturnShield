import { useState } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/button'
import { Copy, Check } from 'lucide-react'

export function PolicyGeneratorPage() {
  const [settings, setSettings] = useState({
    companyName: '',
    returnWindow: '30',
    freeShipping: true,
    restockingFee: '0',
    email: '',
  })
  const [generated, setGenerated] = useState('')
  const [copied, setCopied] = useState(false)

  const generatePolicy = () => {
    const text = `
# Return Policy for ${settings.companyName || '[Company Name]'}

**Last updated: ${new Date().toLocaleDateString()}**

At ${settings.companyName || '[Company Name]'}, we want you to be completely satisfied with your purchase. If you are not, we are here to help.

## Returns
You have ${settings.returnWindow} days from the date of delivery to initiate a return. To be eligible for a return, your item must be unused, in the same condition that you received it, and in the original packaging.

## Shipping
${settings.freeShipping 
  ? 'We provide free return shipping labels for all eligible returns.' 
  : 'You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.'}

${parseInt(settings.restockingFee) > 0 
  ? `## Restocking Fee
A restocking fee of $${settings.restockingFee} will be deducted from your refund amount to cover processing and handling.` 
  : ''}

## Exchanges
The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item. We also offer instant exchanges through our return portal.

## Refunds
Once your return is received and inspected, we will notify you if the refund was approved or rejected. If approved, you’ll be automatically refunded on your original payment method within 10 business days.

## Contact Us
If you have any questions about this policy, please contact us at ${settings.email || '[Email Address]'}. 
    `.trim()
    setGenerated(text)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Policy Generator</h2>
        <p className="text-muted-foreground">Create a professional return policy tailored to your brand settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <GlassCard className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input 
                  className="w-full p-2 bg-background border border-border rounded-md"
                  value={settings.companyName}
                  onChange={e => setSettings({...settings, companyName: e.target.value})}
                  placeholder="Acme Inc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Return Window (Days)</label>
                <select 
                  className="w-full p-2 bg-background border border-border rounded-md"
                  value={settings.returnWindow}
                  onChange={e => setSettings({...settings, returnWindow: e.target.value})}
                >
                  <option value="14">14 Days</option>
                  <option value="30">30 Days</option>
                  <option value="60">60 Days</option>
                  <option value="90">90 Days</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Restocking Fee ($)</label>
                <input 
                  type="number"
                  className="w-full p-2 bg-background border border-border rounded-md"
                  value={settings.restockingFee}
                  onChange={e => setSettings({...settings, restockingFee: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Support Email</label>
                <input 
                  type="email"
                  className="w-full p-2 bg-background border border-border rounded-md"
                  value={settings.email}
                  onChange={e => setSettings({...settings, email: e.target.value})}
                  placeholder="support@example.com"
                />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="shipping"
                  checked={settings.freeShipping}
                  onChange={e => setSettings({...settings, freeShipping: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <label htmlFor="shipping" className="text-sm">We offer free return shipping</label>
              </div>
              
              <Button onClick={generatePolicy} className="w-full">Generate Policy</Button>
            </div>
          </GlassCard>
        </div>

        <div>
          <GlassCard className="h-full min-h-[500px] relative flex flex-col">
            <div className="p-4 border-b border-border/50 flex justify-between items-center">
              <span className="font-semibold">Preview</span>
              {generated && (
                <button onClick={copyToClipboard} className="text-sm flex items-center gap-1 text-primary hover:text-primary/80">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy Text'}
                </button>
              )}
            </div>
            <div className="p-6 flex-1 bg-muted/20 whitespace-pre-wrap font-mono text-sm overflow-auto">
              {generated || <span className="text-muted-foreground italic">Fill out the form to generate your policy...</span>}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
