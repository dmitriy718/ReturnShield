export interface HelpDoc {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  content: string;
}

export const helpDocs: HelpDoc[] = [
  {
    id: "1",
    slug: "getting-started-installation",
    title: "Installing ReturnShield on Shopify",
    description: "A step-by-step guide to connecting your Shopify store to ReturnShield.",
    category: "Getting Started",
    readTime: "3 min read",
    content: `
      <h2>Installation Guide</h2>
      <p>Integrating ReturnShield with your Shopify store is a seamless process that takes less than 5 minutes. Follow these steps to get started:</p>
      
      <ol>
        <li>Log in to your <strong>Shopify Admin</strong> dashboard.</li>
        <li>Navigate to the <strong>Shopify App Store</strong> and search for "ReturnShield".</li>
        <li>Click <strong>Add App</strong>. You will be redirected to the permissions page.</li>
        <li>Review the requested permissions (Orders, Products, Customers) and click <strong>Install app</strong>.</li>
      </ol>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
        <strong>Note:</strong> We require read access to orders to process returns and write access to inventory to restock items automatically.
      </div>

      <h3>Post-Installation Setup</h3>
      <p>Once installed, you will be directed to the ReturnShield Onboarding Wizard. Here you will:</p>
      <ul>
        <li>Set your return window (e.g., 30 days).</li>
        <li>Configure your shipping carrier (USPS, UPS, FedEx).</li>
        <li>Upload your logo for the shopper portal.</li>
      </ul>
    `
  },
  {
    id: "2",
    slug: "configuring-return-rules",
    title: "Configuring Automated Return Rules",
    description: "Learn how to set up logic to auto-approve or reject returns based on conditions.",
    category: "Configuration",
    readTime: "4 min read",
    content: `
      <h2>Why Automate?</h2>
      <p>Automation saves your support team hours of manual review. ReturnShield allows you to build "If/Then" logic flows for every return request.</p>

      <h3>Creating a New Rule</h3>
      <ol>
        <li>Go to <strong>Settings > Return Rules</strong>.</li>
        <li>Click <strong>Create Rule</strong>.</li>
        <li>Select a <strong>Condition</strong> (e.g., "Return Reason is 'Damaged'").</li>
        <li>Select an <strong>Action</strong> (e.g., "Require Photo Upload").</li>
      </ol>

      <h3>Common Examples</h3>
      <ul>
        <li><strong>Low Value Items:</strong> If Item Price < $15, Issue Refund immediately (Keep Item).</li>
        <li><strong>Final Sale:</strong> If Product Tag contains "Final Sale", Reject Return.</li>
        <li><strong>High Risk:</strong> If Customer Return Rate > 20%, Require Manual Review.</li>
      </ul>
    `
  },
  {
    id: "3",
    slug: "setting-up-instant-exchanges",
    title: "Enabling Instant Exchanges",
    description: "Allow customers to get their new item before returning the old one.",
    category: "Features",
    readTime: "5 min read",
    content: `
      <h2>What are Instant Exchanges?</h2>
      <p>Instant Exchanges place a temporary hold on the customer's credit card for the value of the new item. We ship the new item immediately. Once the old item is scanned by the carrier, the hold is released.</p>

      <h3>How to Enable</h3>
      <ol>
        <li>Navigate to <strong>Settings > Exchanges</strong>.</li>
        <li>Toggle <strong>Enable Instant Exchanges</strong> to ON.</li>
        <li>Connect your Stripe account (required for processing holds).</li>
        <li>Set the <strong>Hold Duration</strong> (default is 7 days).</li>
      </ol>

      <p>If the customer does not return the original item within the window, the hold is captured as a charge.</p>
    `
  },
  {
    id: "4",
    slug: "customizing-shopper-portal",
    title: "Customizing the Shopper Portal",
    description: "Make the return experience feel like a native part of your brand.",
    category: "Branding",
    readTime: "3 min read",
    content: `
      <h2>Brand Consistency</h2>
      <p>Your return portal is a touchpoint. It should look and feel like your website.</p>

      <h3>Customization Options</h3>
      <ul>
        <li><strong>Logo:</strong> Upload a transparent PNG (max height 100px).</li>
        <li><strong>Colors:</strong> Set your Primary Color (buttons) and Background Color.</li>
        <li><strong>Custom CSS:</strong> (Elite Plan only) Inject custom CSS for full control.</li>
        <li><strong>Domain:</strong> Set up a custom domain (e.g., returns.yourbrand.com).</li>
      </ul>

      <h3>Editing Text</h3>
      <p>You can also customize all customer-facing text, including the "Start Return" button and success messages, under <strong>Settings > Localization</strong>.</p>
    `
  },
  {
    id: "5",
    slug: "understanding-analytics",
    title: "Understanding Your Analytics Dashboard",
    description: "A deep dive into the metrics that matter for reverse logistics.",
    category: "Analytics",
    readTime: "5 min read",
    content: `
      <h2>The Overview Tab</h2>
      <p>The main dashboard gives you a health check of your returns.</p>
      <ul>
        <li><strong>Return Rate:</strong> (Total Returns / Total Orders) %. Target: < 15% for apparel.</li>
        <li><strong>Refunded Revenue:</strong> Total $ value refunded.</li>
        <li><strong>Retained Revenue:</strong> Value saved via Exchanges or Store Credit.</li>
      </ul>

      <h2>Deep Dives</h2>
      <h3>SKU Analysis</h3>
      <p>See which products are returned most often and why. Use this to identify manufacturing defects or sizing inconsistencies.</p>

      <h3>Customer Analysis</h3>
      <p>Identify your "VIP" customers (high spend, low returns) and "Serial Returners" (high returns).</p>
    `
  },
  {
    id: "6",
    slug: "connecting-carriers",
    title: "Connecting Shipping Carriers",
    description: "How to link your FedEx, UPS, or USPS accounts.",
    category: "Shipping",
    readTime: "4 min read",
    content: `
      <h2>Carrier Integrations</h2>
      <p>ReturnShield can generate labels automatically using our discounted rates, or you can plug in your own carrier accounts to use your negotiated rates.</p>

      <h3>Adding a Carrier Account</h3>
      <ol>
        <li>Go to <strong>Settings > Shipping</strong>.</li>
        <li>Click <strong>Connect Carrier</strong>.</li>
        <li>Select your provider (e.g., UPS).</li>
        <li>Enter your Account Number and API Credentials.</li>
      </ol>

      <p>Once connected, you can set rules for which carrier to use based on package weight or destination.</p>
    `
  },
  {
    id: "7",
    slug: "managing-refunds",
    title: "Processing Refunds and Store Credit",
    description: "Manual and automated ways to issue money back to customers.",
    category: "Operations",
    readTime: "3 min read",
    content: `
      <h2>Issuing a Refund</h2>
      <p>Most refunds are automated based on carrier scans. However, you can manually override any return.</p>

      <ol>
        <li>Open the <strong>Return Request</strong> details page.</li>
        <li>Click <strong>Issue Refund</strong> in the top right.</li>
        <li>Select "Original Payment Method" or "Store Credit".</li>
        <li>Confirm the amount (you can deduct shipping/restocking fees here).</li>
      </ol>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
        <strong>Warning:</strong> Refunds to credit cards can take 5-10 business days to appear on the customer's statement. Store credit is instant.
      </div>
    `
  },
  {
    id: "8",
    slug: "api-reference-intro",
    title: "Introduction to the ReturnShield API",
    description: "For developers: How to programmatically manage returns.",
    category: "Developers",
    readTime: "5 min read",
    content: `
      <h2>API Overview</h2>
      <p>The ReturnShield API is RESTful and uses standard HTTP response codes. All requests must be authenticated using an API Key.</p>

      <h3>Authentication</h3>
      <pre><code>Authorization: Bearer YOUR_API_KEY</code></pre>

      <h3>Key Endpoints</h3>
      <ul>
        <li><code>GET /api/v1/returns</code>: List all returns.</li>
        <li><code>POST /api/v1/returns</code>: Create a return programmatically.</li>
        <li><code>GET /api/v1/analytics/sku</code>: Fetch SKU performance data.</li>
      </ul>

      <p>View the full Swagger documentation at <a href="https://api.returnshield.app/docs" class="text-primary underline">api.returnshield.app/docs</a>.</p>
    `
  },
  {
    id: "9",
    slug: "email-notifications",
    title: "Customizing Email Notifications",
    description: "Edit the transactional emails sent to customers during the return process.",
    category: "Communications",
    readTime: "3 min read",
    content: `
      <h2>The Loop</h2>
      <p>Communication reduces anxiety. We send emails at key stages:</p>
      <ul>
        <li><strong>Return Requested:</strong> Confirmation of receipt.</li>
        <li><strong>Label Created:</strong> Contains the PDF label or QR code.</li>
        <li><strong>In Transit:</strong> "We see it's on the way!"</li>
        <li><strong>Refund Issued:</strong> Confirmation of funds released.</li>
      </ul>

      <h3>Editing Templates</h3>
      <p>Go to <strong>Settings > Notifications</strong>. You can use our visual editor to change colors and logos, or switch to HTML mode for full control.</p>
    `
  },
  {
    id: "10",
    slug: "handling-international-returns",
    title: "Handling International Returns",
    description: "Best practices for cross-border reverse logistics.",
    category: "Shipping",
    readTime: "4 min read",
    content: `
      <h2>The Challenge</h2>
      <p>International returns involve customs forms and higher shipping costs. Often, it is not profitable to return the item.</p>

      <h3>Green Returns for International</h3>
      <p>We recommend setting a rule: <strong>If Country is not US, Offer Refund for Donation</strong>. This avoids the $40+ shipping fee and customs headache.</p>

      <h3>Generating Commercial Invoices</h3>
      <p>If you must return the item, ReturnShield automatically generates the commercial invoice required by customs. Ensure the HS Codes on your Shopify products are accurate to prevent delays at the border.</p>
    `
  }
];
