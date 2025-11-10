import '../App.css'

export default function PrivacyPolicyPage() {
  return (
    <div className="page policy-page">
      <header className="policy-hero">
        <span className="tagline">Privacy first</span>
        <h1>ReturnShield Privacy Policy</h1>
        <p className="policy-lede">
          This Privacy Policy explains how ReturnShield Inc. (“ReturnShield”, “we”, “our”, or “us”) collects, uses,
          stores, and protects personal information when you visit our website, use our applications, or engage
          with our services. It also outlines the rights available to you under global privacy frameworks.
        </p>
        <p className="policy-effective">Effective date: November 10, 2025</p>
      </header>

      <section>
        <h2>1. Scope</h2>
        <p>
          This policy applies to personal information processed by ReturnShield in connection with our websites,
          web applications, integrations, and support channels (collectively the “Services”). It covers data we
          collect directly, automatically, or from third-parties on behalf of our merchant customers.
        </p>
      </section>

      <section>
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
            <strong>Support communications:</strong> content of tickets, chat logs, recordings (with notice), and
            attachments exchanged with our concierge team.
          </li>
          <li>
            <strong>Marketing data:</strong> email preferences, event participation, and campaign engagement metrics.
          </li>
          <li>
            <strong>Sensitive data:</strong> We do not intentionally collect payment card numbers or government IDs. If
            such data is provided inadvertently, we delete it promptly.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How we use information</h2>
        <p>We process personal information for the following lawful purposes:</p>
        <ul>
          <li>To provide, configure, and secure the ReturnShield platform and integrations.</li>
          <li>To analyze returns and exchanges, generate insights, and surface automation recommendations.</li>
          <li>To authenticate users, manage accounts, and deliver customer support.</li>
          <li>To send administrative notices, product updates, and marketing communications (with opt-out).</li>
          <li>To monitor performance, debug issues, and improve the functionality of our Services.</li>
          <li>To comply with legal obligations, respond to lawful requests, and enforce our agreements.</li>
        </ul>
      </section>

      <section>
        <h2>4. Legal bases for processing (EEA/UK)</h2>
        <p>
          Where the GDPR or UK GDPR applies, we rely on the following legal bases: (a) performance of a contract;
          (b) legitimate interests in operating, securing, and improving the Services; (c) compliance with legal
          obligations; and (d) consent for specific marketing or optional analytics activities.
        </p>
      </section>

      <section>
        <h2>5. How we share information</h2>
        <ul>
          <li>
            <strong>Service providers:</strong> trusted vendors that deliver hosting, analytics, communications, payment,
            and security services. Providers are bound by confidentiality and data processing agreements.
          </li>
          <li>
            <strong>Merchant-authorized integrations:</strong> Shopify, helpdesk, analytics, or fulfillment platforms
            you connect to ReturnShield. Data sharing follows your configuration and contracts with those services.
          </li>
          <li>
            <strong>Corporate transactions:</strong> if we undergo a merger, acquisition, financing, or asset sale, data
            may be transferred with appropriate safeguards.
          </li>
          <li>
            <strong>Legal disclosures:</strong> to comply with applicable law, enforce our terms, protect rights, or
            respond to lawful requests from public authorities.
          </li>
        </ul>
        <p>We do not sell personal information as defined by the CCPA/CPRA.</p>
      </section>

      <section>
        <h2>6. Cookies and similar technologies</h2>
        <p>
          We use cookies, device identifiers, and similar technologies to operate the site, remember preferences,
          perform analytics, and personalize content. You can manage cookie preferences through browser settings or
          in-app controls. Essential cookies are required for service delivery.
        </p>
      </section>

      <section>
        <h2>7. Data retention</h2>
        <p>
          We retain personal information only for as long as necessary to fulfill the purposes described in this
          policy, comply with legal obligations, resolve disputes, and enforce agreements. Merchant-provided order and
          return data is typically retained for the active subscription term plus up to 12 months, unless a shorter
          retention period is requested in writing.
        </p>
      </section>

      <section>
        <h2>8. Security</h2>
        <p>
          ReturnShield implements administrative, technical, and physical safeguards such as encryption in transit and
          at rest, access controls, audit logging, network segmentation, secure software development practices, and
          vendor due diligence. Despite efforts, no system is completely secure; users are responsible for protecting
          account credentials.
        </p>
      </section>

      <section>
        <h2>9. International data transfers</h2>
        <p>
          We operate in the United States and may transfer personal information internationally. When transferring data
          from the EEA, UK, or Switzerland, we rely on appropriate safeguards such as Standard Contractual Clauses,
          Data Privacy Framework participation (if applicable), or other legally recognized mechanisms.
        </p>
      </section>

      <section>
        <h2>10. Your privacy rights</h2>
        <ul>
          <li>
            <strong>EEA/UK residents:</strong> right of access, rectification, erasure, restriction, objection,
            portability, and the right to lodge a complaint with a Supervisory Authority.
          </li>
          <li>
            <strong>California residents:</strong> rights to know, delete, correct, opt-out of sale/share, and limit use
            of sensitive information under the CPRA. Authorized agents may submit requests on your behalf.
          </li>
          <li>
            <strong>All users:</strong> opt-out of marketing emails by using the unsubscribe link or contacting us. We
            respond to verified requests within statutory timelines.
          </li>
        </ul>
        <p>Submit privacy requests to <a href="mailto:privacy@returnshield.app">privacy@returnshield.app</a>.</p>
      </section>

      <section>
        <h2>11. Children’s privacy</h2>
        <p>
          ReturnShield does not knowingly collect data from children under 16. If we learn that personal information
          from a child has been collected, we will delete it promptly.
        </p>
      </section>

      <section>
        <h2>12. Third-party links</h2>
        <p>
          Our Services may include links to third-party sites. Their privacy practices are governed by their own
          policies; we encourage you to review them before submitting information.
        </p>
      </section>

      <section>
        <h2>13. Changes to this policy</h2>
        <p>
          We may update this privacy policy from time to time. Material changes will be communicated via in-app
          notifications or email. Continued use of the Services after the effective date constitutes acceptance of the
          revised policy.
        </p>
      </section>

      <section>
        <h2>14. Contact us</h2>
        <p>
          For questions about this policy or our privacy practices, contact:
        </p>
        <address>
          ReturnShield Inc.<br />
          1200 Commerce Avenue, Suite 400<br />
          Austin, TX 78701 USA<br />
          <a href="mailto:privacy@returnshield.app">privacy@returnshield.app</a>
        </address>
      </section>
    </div>
  )
}
