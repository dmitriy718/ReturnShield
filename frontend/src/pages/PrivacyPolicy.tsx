import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/30 selection:text-primary-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 md:pt-40">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="mb-12">
            <span className="text-primary font-medium tracking-wide uppercase text-sm">Privacy first</span>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight mt-2 mb-6">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This Privacy Policy explains how ReturnShield Inc. (“ReturnShield”, “we”, “our”, or “us”) collects, uses,
              stores, and protects personal information when you visit our website, use our applications, or engage
              with our services. It also outlines the rights available to you under global privacy frameworks.
            </p>
            <p className="mt-4 text-sm text-muted-foreground font-medium">Effective date: November 10, 2025</p>
          </div>

          <div className="prose prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
            <section className="mb-12">
              <h2>1. Scope</h2>
              <p>
                This policy applies to personal information processed by ReturnShield in connection with our websites,
                web applications, integrations, and support channels (collectively the “Services”). It covers data we
                collect directly, automatically, or from third-parties on behalf of our merchant customers.
              </p>
            </section>

            <section className="mb-12">
              <h2>2. Information we collect</h2>
              <ul>
                <li>
                  <strong>Account and contact data:</strong> name, business email, phone number, company details, job title,
                  billing and shipping addresses.
                </li>
                <li>
                  <strong>Merchant data:</strong> order, return, exchange, shipment, inventory, and customer interaction data
                  ingested from commerce platforms, helpdesk systems, or integrations you authorize.
                </li>
                <li>
                  <strong>Usage and device data:</strong> IP address, browser type, device identifiers, referring URLs, session
                  metadata, pages viewed, features used, and in-app events captured via analytics tools.
                </li>
                <li>
                  <strong>Support interactions:</strong> helpdesk conversations, email threads, and AI-assist transcripts that
                  you initiate with our concierge team.
                </li>
                <li>
                  <strong>Third-party data:</strong> data provided by partners (e.g., Shopify, Stripe, HelpScout) when you
                  authorize integrations.
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>3. How we use information</h2>
              <ul>
                <li>Provide, maintain, and secure the Services.</li>
                <li>Analyze return trends, deliver insights, and power automation workflows.</li>
                <li>Process payments, send invoices, and manage subscriptions.</li>
                <li>Deliver transactional, product, and marketing communications, consistent with your preferences.</li>
                <li>Investigate fraud, abuse, or violations of our Terms.</li>
                <li>Comply with legal obligations and enforce agreements.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>4. Legal bases for processing</h2>
              <p>
                If you are located in the EEA, UK, or Switzerland, we process personal information under the following legal bases:
              </p>
              <ul>
                <li>Performance of a contract when we provide the Services.</li>
                <li>Legitimate interests in improving products, preventing fraud, and securing the Services.</li>
                <li>Compliance with legal obligations such as tax, accounting, and regulatory requirements.</li>
                <li>Consent for optional marketing communications or analytics cookies.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>5. Data retention</h2>
              <p>
                We retain personal information only as long as necessary to fulfill the purposes described in this policy,
                comply with legal obligations, resolve disputes, and enforce agreements. Specific retention periods depend on
                data type, contractual commitments, and regulatory requirements.
              </p>
            </section>

            <section className="mb-12">
              <h2>6. Sharing and disclosure</h2>
              <ul>
                <li>
                  <strong>Service providers:</strong> infrastructure, analytics, email, and support vendors who process data on
                  our behalf under confidentiality obligations.
                </li>
                <li>
                  <strong>Integration partners:</strong> platforms such as Shopify, Stripe, SendGrid, PostHog, and HelpScout
                  when you connect their services to ReturnShield.
                </li>
                <li>
                  <strong>Professional advisors:</strong> auditors, legal counsel, and consultants under confidentiality agreements.
                </li>
                <li>
                  <strong>Corporate transactions:</strong> potential buyers or investors in the context of a merger, sale, or financing.
                </li>
                <li>
                  <strong>Legal compliance:</strong> law enforcement, regulators, or other parties when required by law or to
                  protect rights, property, or safety.
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>7. International transfers</h2>
              <p>
                We may transfer personal information to countries outside your jurisdiction, including the United States.
                When we do, we rely on appropriate safeguards such as Standard Contractual Clauses and conduct transfer impact
                assessments to ensure an adequate level of protection.
              </p>
            </section>

            <section className="mb-12">
              <h2>8. Data subject rights</h2>
              <p>
                Depending on your location, you may have rights to access, correct, delete, restrict, or object to the
                processing of your personal information, as well as to data portability and to withdraw consent. You can
                exercise these rights by contacting us at <a href="mailto:privacy@returnshield.app" className="text-primary hover:underline">privacy@returnshield.app</a>. We will verify the request and respond in
                accordance with applicable law.
              </p>
            </section>

            <section className="mb-12">
              <h2>9. Your responsibilities</h2>
              <p>
                If you are a merchant using ReturnShield, you must ensure that you have provided appropriate notices and
                obtained necessary consents from your customers before sharing their data with us. You agree to forward any
                privacy inquiries you receive that relate to the Services so we can collaborate on a timely response.
              </p>
            </section>

            <section className="mb-12">
              <h2>10. Security</h2>
              <p>
                We implement administrative, technical, and physical safeguards designed to protect personal information
                against unauthorized access, alteration, or destruction. Measures include encryption in transit, network
                segmentation, role-based access controls, regular penetration testing, and incident response protocols.
              </p>
            </section>

            <section className="mb-12">
              <h2>11. Cookies and similar technologies</h2>
              <p>
                We use cookies and similar technologies to operate and improve the Services, remember preferences, measure
                campaign performance, and perform analytics. You can manage cookie preferences through browser settings or
                opt-out mechanisms provided by our analytics partners.
              </p>
            </section>

            <section className="mb-12">
              <h2>12. Marketing choices</h2>
              <p>
                You can opt out of marketing emails at any time by clicking the unsubscribe link or contacting us. Even if you
                opt out, we may still send transactional or relationship messages about your account or critical service updates.
              </p>
            </section>

            <section className="mb-12">
              <h2>13. Children</h2>
              <p>
                The Services are not directed to children under 16, and we do not knowingly collect personal information from
                children. If we learn that we have collected such information, we will delete it and take steps to prevent future collection.
              </p>
            </section>

            <section className="mb-12">
              <h2>14. Changes to this policy</h2>
              <p>
                We may update this policy to reflect changes to our practices or legal requirements. Material changes will be
                communicated via email or prominent in-app notices at least 14 days before they take effect. Continued use of
                the Services after the effective date constitutes acceptance of the revised policy.
              </p>
            </section>

            <section className="mb-12">
              <h2>15. Contact us</h2>
              <p>
                If you have questions or concerns about this Privacy Policy or wish to exercise your rights, contact us at:
              </p>
              <address className="not-italic">
                <strong>ReturnShield Privacy Office</strong><br />
                1200 Commerce Avenue, Suite 400<br />
                Austin, TX 78701 USA<br />
                <a href="mailto:privacy@returnshield.app" className="text-primary hover:underline">privacy@returnshield.app</a>
              </address>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}