from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List


@dataclass
class Recommendation:
    title: str
    description: str
    expected_impact: str
    automation_actions: List[str]


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

