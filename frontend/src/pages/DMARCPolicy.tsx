import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export default function DMARCPolicyPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 md:pt-40">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="mb-12">
            <span className="text-primary font-medium tracking-wide uppercase text-sm">Email authenticity</span>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight mt-2 mb-6">DMARC Policy</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This Domain-based Message Authentication, Reporting & Conformance (DMARC) policy outlines how ReturnShield
              protects email identity, enforces authentication alignment, and processes aggregate and forensic feedback for
              all messages sent from our domains.
            </p>
            <p className="mt-4 text-sm text-muted-foreground font-medium">Effective date: November 10, 2025</p>
          </div>

          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
            <section className="mb-12">
              <h2>1. Domains covered</h2>
              <p>
                This policy applies to outbound messages sent from the following domains and subdomains owned by ReturnShield
                Inc.: <strong>returnshield.app</strong>, <strong>returnshield.store</strong>, <strong>returnshield.io</strong>,
                <strong>returnshield.us</strong>, and <strong>returnshield.me</strong>. Marketing and product email activity is
                centralized on <code className="bg-muted px-1 py-0.5 rounded text-sm">returnshield.app</code> to simplify authentication management.
              </p>
            </section>

            <section className="mb-12">
              <h2>2. DMARC record</h2>
              <p>
                Our production DNS publishes the following DMARC resource record at <code className="bg-muted px-1 py-0.5 rounded text-sm">_dmarc.returnshield.app</code>:
              </p>
              <pre className="bg-card border border-border p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono text-foreground">
                v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-aggregate@returnshield.app; ruf=mailto:dmarc-forensics@returnshield.app; fo=1; adkim=s; aspf=s
              </pre>
              <p>
                The policy of <code className="bg-muted px-1 py-0.5 rounded text-sm">p=quarantine</code> instructs receiving mailbox providers to place messages failing
                authentication into the spam folder. We evaluate aggregate reports weekly and will transition to
                <code className="bg-muted px-1 py-0.5 rounded text-sm">p=reject</code> once we reach 100% enforcement confidence.
              </p>
            </section>

            <section className="mb-12">
              <h2>3. Alignment requirements</h2>
              <ul>
                <li>SPF alignment (<code className="bg-muted px-1 py-0.5 rounded text-sm">aspf=s</code>) requires the envelope-from domain to exactly match ReturnShield domains.</li>
                <li>DKIM alignment (<code className="bg-muted px-1 py-0.5 rounded text-sm">adkim=s</code>) requires the signing domain to match the visible From domain.</li>
                <li>Messages sent through sanctioned platforms (SendGrid, HelpScout) are configured to satisfy both alignment rules.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>4. Authorized senders</h2>
              <p>
                ReturnShield permits the following providers to send on our behalf, subject to SPF/DKIM alignment and vendor
                security reviews conducted at least annually:
              </p>
              <ul>
                <li>Transactional email: SendGrid (api.sendgrid.com)</li>
                <li>Support email: HelpScout (mailgun.org infrastructure)</li>
                <li>Marketing drips: Customer.io (SMTP relays configured with dedicated DKIM keys)</li>
              </ul>
              <p>
                Any third-party vendor must provide shared security attestations and allow us to host custom ReturnShield DKIM
                selectors. Unauthorized vendors are blocked at the DNS and email gateway layer.
              </p>
            </section>

            <section className="mb-12">
              <h2>5. Monitoring & reporting</h2>
              <ul>
                <li>
                  Aggregate reports (<code className="bg-muted px-1 py-0.5 rounded text-sm">rua</code>) are delivered to <a href="mailto:dmarc-aggregate@returnshield.app" className="text-primary hover:underline">dmarc-aggregate@returnshield.app</a> and processed via ReturnShield analytics dashboards.
                </li>
                <li>
                  Forensic failure reports (<code className="bg-muted px-1 py-0.5 rounded text-sm">ruf</code>) are routed to <a href="mailto:dmarc-forensics@returnshield.app" className="text-primary hover:underline">dmarc-forensics@returnshield.app</a> with automated triage to our security team.
                </li>
                <li>We retain report data for a minimum of 24 months to establish trendlines and respond to abuse complaints.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>6. Incident response</h2>
              <p>
                If DMARC aggregate data indicates spoofing or deliverability issues, our workflow is as follows:
              </p>
              <ol>
                <li>Validate SPF and DKIM records for the impacted sending infrastructure.</li>
                <li>Isolate any unauthorized hosts and submit removal requests to mailbox providers as required.</li>
                <li>Notify affected customers if spoofing intersects with transactional or support communications.</li>
                <li>Escalate repeated incidents to our legal and compliance teams for further enforcement action.</li>
              </ol>
            </section>

            <section className="mb-12">
              <h2>7. Contact</h2>
              <p>
                Questions regarding DMARC enforcement or spoofing reports can be directed to
                <a href="mailto:security@returnshield.app" className="text-primary hover:underline"> security@returnshield.app</a>. Please include relevant email
                headers or provider feedback to accelerate investigation.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}