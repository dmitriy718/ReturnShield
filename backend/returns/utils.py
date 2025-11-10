from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List


@dataclass
class Recommendation:
    title: str
    description: str
    expected_impact: str
    automation_actions: List[str]


def _returnless_candidates() -> List[Dict[str, Any]]:
    return [
        {
            "sku": "RS-014",
            "product_name": "Luxe Knit Throw",
            "avg_unit_cost": 18.5,
            "return_volume_30d": 42,
            "reason_driver": "Texture / feel not as expected",
            "estimated_margin_recaptured": 1240,
            "carbon_kg_prevented": 85,
            "landfill_lbs_prevented": 180,
            "handling_minutes_reduced": 96,
            "recommended_actions": [
                "Auto-approve returnless refund with 12% exchange credit coupon.",
                "Tag SKU for donation pickup with GiveBack Box.",
            ],
        },
        {
            "sku": "RS-221",
            "product_name": "Everyday Bamboo Tee",
            "avg_unit_cost": 9.25,
            "return_volume_30d": 136,
            "reason_driver": "Fit feedback · relaxed cut",
            "estimated_margin_recaptured": 2280,
            "carbon_kg_prevented": 132,
            "landfill_lbs_prevented": 264,
            "handling_minutes_reduced": 168,
            "recommended_actions": [
                "Serve AI sizing quiz before checkout for repeat buyers.",
                "Offer returnless refund with keep-it note referencing sustainability pledge.",
            ],
        },
        {
            "sku": "RS-091",
            "product_name": "Ceramic Mood Candle",
            "avg_unit_cost": 7.4,
            "return_volume_30d": 58,
            "reason_driver": "Minor packaging blemish",
            "estimated_margin_recaptured": 940,
            "carbon_kg_prevented": 64,
            "landfill_lbs_prevented": 148,
            "handling_minutes_reduced": 72,
            "recommended_actions": [
                "Bundle blemished units for outlet flash sale.",
                "Message VIP segment with 2-for-1 rescue offer.",
            ],
        },
    ]


def build_returnless_insights() -> Dict[str, Any]:
    candidates = _returnless_candidates()

    total_margin = sum(item["estimated_margin_recaptured"] for item in candidates)
    total_carbon_tonnes = round(
        sum(item["carbon_kg_prevented"] for item in candidates) / 1000, 2
    )
    total_landfill_lbs = sum(item["landfill_lbs_prevented"] for item in candidates)
    total_minutes_saved = sum(item["handling_minutes_reduced"] for item in candidates)

    summary = {
        "period": "last_30_days",
        "annualized_margin_recovery": int(total_margin * 12),
        "carbon_tonnes_prevented": total_carbon_tonnes,
        "landfill_lbs_prevented": total_landfill_lbs,
        "manual_hours_reduced": round(total_minutes_saved / 60, 1),
    }

    playbook = [
        "Keep-it refund for sub-$15 cost of goods when reverse logistics > 65% of margin.",
        "Tag donation-ready SKUs in Shopify metafields and sync nightly with fulfillment center.",
        "Trigger SendGrid sustainability story 48h after refund to reinforce loyalty.",
        "Track impact dashboards weekly: landfill diverted, CO₂e prevented, margin recaptured.",
    ]

    return {
        "summary": summary,
        "candidates": candidates,
        "playbook": playbook,
    }


def build_exchange_coach(playbook: Dict[str, Any]) -> List[Recommendation]:
    """Derive actionable exchange plays from returnless insights."""
    candidates = playbook.get("candidates", [])
    summary = playbook.get("summary", {})

    recs: List[Recommendation] = []

    if candidates:
        top_candidate = max(candidates, key=lambda item: item.get("estimated_margin_recaptured", 0))
        recs.append(
            Recommendation(
                title=f"Promote exchanges for {top_candidate['product_name']}",
                description=(
                    f"Redirect refund intent into exchanges for {top_candidate['product_name']} with an instant "
                    f"{int(top_candidate['estimated_margin_recaptured'] // max(top_candidate['return_volume_30d'], 1))}% "
                    "bonus credit."
                ),
                expected_impact=f"Protect ≈ ${top_candidate['estimated_margin_recaptured']:.0f} this month.",
                automation_actions=[
                    "Swap refund CTA for exchange-first workflow in Shopify app embed.",
                    "Send size/fit reassurance email via SendGrid to pending returns.",
                    "Track PostHog funnel `exchange_bonus_opt_in` daily.",
                ],
            )
        )

    if summary:
        recs.append(
            Recommendation(
                title="Launch 14-day exchange sprint",
                description="Target the highest-risk SKUs and automate exchange bonus flows for the next 14 days.",
                expected_impact=f"+{summary.get('annualized_margin_recovery', 0):,} projected annualized margin saved.",
                automation_actions=[
                    "Bulk-update Shopify return reasons to enable exchange defaults.",
                    "Schedule Slack alerts for refund spikes by cohort.",
                    "Trigger returnless mode for < $15 COGS SKUs once credit issued.",
                ],
            )
        )

    recs.append(
        Recommendation(
            title="Measure coach results",
            description="Review weekly Coach summary to double down on winners and retire underperforming plays.",
            expected_impact="Sustain >20% refund-to-exchange conversion.",
            automation_actions=[
                "Subscribe to weekly PostHog cohort digest.",
                "Share highlights with CX leadership via Slack digest.",
                "Capture learnings in the ReturnShield playbook library.",
            ],
        )
    )

    return recs


def build_vip_resolution_queue() -> List[Dict[str, Any]]:
    """Generate VIP queue entries highlighting loyalty-aware actions."""
    return [
        {
            "customer": "Alicia Gomez",
            "segment": "Top 1% LTV · Apparel",
            "order_value": 286,
            "lifetime_value": 6120,
            "ticket_age_hours": 3,
            "recommended_action": "Issue instant exchange with complimentary 2-day shipping upgrade.",
        },
        {
            "customer": "Noah Chen",
            "segment": "Subscription VIP · Beauty",
            "order_value": 148,
            "lifetime_value": 3320,
            "ticket_age_hours": 5,
            "recommended_action": "Returnless refund + 10% loyalty credit, trigger concierge follow-up email.",
        },
        {
            "customer": "Harper Singh",
            "segment": "Wholesale · High repeat",
            "order_value": 812,
            "lifetime_value": 9410,
            "ticket_age_hours": 2,
            "recommended_action": "Flag CX lead, schedule live call, pre-create exchange with expedited warehouse routing.",
        },
    ]


def build_exchange_playbook(
    *,
    return_rate: float,
    exchange_rate: float,
    average_order_value: float,
    logistic_cost_per_return: float,
    top_return_reason: str,
) -> Dict[str, List[Dict[str, str]]]:
    recommendations: List[Recommendation] = []

    if exchange_rate < return_rate * 0.6:
        recommendations.append(
            Recommendation(
                title="Autopilot exchange-first window",
                description=(
                    "Push return shoppers toward an immediate exchange before presenting the refund "
                    "option. Brands doing this see 18–26% fewer refunds within 30 days."
                ),
                expected_impact=f"Recover ≈ ${(average_order_value * 0.22):.0f}/mo per 1k orders.",
                automation_actions=[
                    "Swap refund CTA with exchange CTA in portal.",
                    "Offer instant store credit bonus worth 5% of order value.",
                    "Trigger PostHog funnel to monitor exchange adoption.",
                ],
            )
        )

    if logistic_cost_per_return >= (average_order_value * 0.25):
        recommendations.append(
            Recommendation(
                title="Returnless refunds for low-margin SKUs",
                description=(
                    "If the logistics cost dominates recovered margin, flag the SKUs for returnless "
                    "refunds and dispose/donate instead."
                ),
                expected_impact="Protect margin on high-cost reverse logistics items.",
                automation_actions=[
                    "Tag eligible SKUs in Shopify metafields.",
                    "Sync policy with HelpScout macros for concierge team.",
                ],
            )
        )

    if top_return_reason.lower().startswith("size"):
        recommendations.append(
            Recommendation(
                title="Size-confidence automation",
                description=(
                    "Triggered fit guide and AI sizing email before delivery reduces size-related "
                    "returns by 12% median."
                ),
                expected_impact="Lower size-related returns by ~12% within 45 days.",
                automation_actions=[
                    "Send SendGrid drip 24h pre-delivery with fit advice.",
                    "Highlight exchange option with free size swaps.",
                ],
            )
        )

    if not recommendations:
        recommendations.append(
            Recommendation(
                title="Maintain current exchange strategy",
                description="Metrics already align with industry top quartile.",
                expected_impact="Keep monitoring PostHog dashboards weekly.",
                automation_actions=[
                    "Audit courier SLAs monthly.",
                    "Survey customers about exchange friction points.",
                ],
            )
        )

    return {
        "recommendations": [
            {
                "title": rec.title,
                "description": rec.description,
                "expected_impact": rec.expected_impact,
                "automation_actions": rec.automation_actions,
            }
            for rec in recommendations
        ]
    }

