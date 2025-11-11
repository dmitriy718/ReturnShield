# Dashboard Walkthrough Guide

Use this guide to practice the in-app experience from start to finish. Rehearse it before demos or onboarding calls so you can narrate confidently.

---

## 1. Preparation
1. Log in to `https://app.returnshield.app`.
2. Ensure you are in **trial mode** if you want the sample data; do not activate billing for demo accounts.
3. Click **Replay guided tour** in the top-right header to reset the walkthrough.
4. Open dev tools → `localStorage` and confirm the automation form contains realistic numbers (or reset from the automation tab).

---

## 2. Guided Tour Sequence
| Step | Section Revealed | Key Talking Points | Tip That Appears |
| --- | --- | --- | --- |
| 1 | Summary metrics | “These KPIs update once your data syncs. See revenue protected, landfill diverted, ops hours returned.” | “These KPIs show how ReturnShield protects margin, landfill, and team time each month.” |
| 2 | Returnless Intelligence | “Prioritised SKU list; explain blurred state vs live data. Mention recommended actions.” | “Spot high-risk SKUs and policy moves that prevent refunds before they happen.” |
| 3 | AI Exchange Coach | “Action cards with margin-at-risk, uplift, and step-by-step actions.” | “AI Exchange Coach recommends the next exchanges to approve for maximum uplift.” |
| 4 | VIP Resolution Hub | “Queue of loyalty-rich tickets with churn risk and concierge instructions.” | “VIP Resolution Hub keeps loyalty-rich tickets front and centre for concierge action.” |
| 5 | Billing Preview | “Show plan options quickly; highlight that data unblurs after checkout.” | “Choose a plan when you’re ready to unlock live store data and automation.” |

After step 5, the quick start checklist and resource library are fully accessible—call these out before ending the tour.

---

## 3. Quick Start Checklist
- **Shopify storefront status:** Shows whether the merchant flagged they have a store.
- **Guided tour status:** “Resume guided tour” button appears until the walkthrough is completed.
- **Plan activation:** Highlights selected plan or prompts to choose one.
- Use this section to make clear what happens next after a prospect signs up.

---

## 4. Resource Library Panel
1. Mention the three links: Marketing launch kit, Operator playbook, Stripe billing checklist.
2. Explain when to send each link (after demo, onboarding, billing follow-up).
3. Encourage prospects to bookmark this panel—resources stay updated automatically.

---

## 5. Exchange Automation Tab
1. Point out that the form remembers inputs per user (local storage).
2. Demonstrate filling in new numbers, click **Generate playbook**, and show the resulting recommendations.
3. Use **Reset to defaults** to clear the form.

---

## 6. Billing Tab
1. Highlight the status banner: shows current plan or trial preview plus recommended plan.
2. Walk through each plan card:
   - Audience (“Ideal for…”)
   - Feature bullets
   - Plan badges (“Current”, “Recommended”)
3. Click a CTA to show the Stripe checkout overlay (confirm price ID in console if needed).
4. Mention `/billing/success` page and concierge option.

---

## 7. Replay & Practice
- Run the entire flow twice:
  1. Once silently to confirm UI steps.
  2. Once aloud using the demo script in `docs/demo-runbook.md`.
- Capture fresh screenshots for marketing after any UI tweak (see `docs/marketing-assets.md`).
- Keep this document open on a second monitor while presenting until the flow feels natural.

---

**Remember:** The goal of the walkthrough is to make prospects feel guided, not overwhelmed. Use the built-in tour, point to the checklist, and show exactly what unlocks after billing. The calmer and clearer you sound, the faster they’ll see ReturnShield as the obvious choice.

