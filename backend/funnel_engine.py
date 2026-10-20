"""
Creator Distribution Funnel Engine
Rail Category: Distribution & Demand
Provides ETL transformations and mathematical modeling for:
- Funnel Stages (Impressions -> Watch Time -> CTR -> Conversions -> Economic Yield)
- Cohort Comparison
- Platform Split
- Content Type Filtering
- Monetization Overlays
- Multi-persona explanation copy (Everyday Viewers, Builders, Allocators)
"""

import math
from typing import Dict, Any, List, Optional
import pandas as pd
from adapters.synthetic_stream_adapter import SyntheticStreamAdapter

class CreatorFunnelEngine:
    """
    Core analytics and modeling engine for Creator Distribution Funnel.
    """

    @classmethod
    def get_funnel_stages(
        cls,
        base_dau: int = 250000,
        cpm: float = 15.0,
        content_type: str = "ALL",
        monetization_overlay: str = "ALL"
    ) -> Dict[str, Any]:
        """
        Calculates the 5-stage distribution funnel with stage-to-stage transition metrics.
        """
        # Multipliers based on content type
        ct_mult = {
            "ALL": {"imp": 1.0, "watch_sec": 48.0, "ctr": 2.8, "conv": 2.1, "cpm_adj": 1.0},
            "Short-form Video": {"imp": 2.4, "watch_sec": 32.0, "ctr": 2.1, "conv": 1.4, "cpm_adj": 0.75},
            "Long-form Video": {"imp": 0.65, "watch_sec": 580.0, "ctr": 4.5, "conv": 2.8, "cpm_adj": 1.45},
            "Livestream": {"imp": 0.35, "watch_sec": 2400.0, "ctr": 1.2, "conv": 3.6, "cpm_adj": 1.20},
            "Static / Carousel": {"imp": 1.3, "watch_sec": 14.0, "ctr": 1.8, "conv": 1.5, "cpm_adj": 0.65},
            "Newsletter / Article": {"imp": 0.25, "watch_sec": 210.0, "ctr": 6.8, "conv": 5.2, "cpm_adj": 1.85}
        }.get(content_type, {"imp": 1.0, "watch_sec": 48.0, "ctr": 2.8, "conv": 2.1, "cpm_adj": 1.0})

        # Stage 1: Post Impressions (Discovery)
        stage1_impressions = int(base_dau * 4.2 * ct_mult["imp"])

        # Stage 2: Engaged Watch Time (Attention Retention)
        # 42% of impressions pass 3-second attention threshold
        watch_retention_pct = 42.5 if content_type != "Short-form Video" else 58.0
        engaged_views = int(stage1_impressions * (watch_retention_pct / 100.0))
        avg_watch_time_sec = ct_mult["watch_sec"]
        total_watch_hours = round((engaged_views * avg_watch_time_sec) / 3600.0, 1)

        # Stage 3: Click-Through Rate (CTR) / Interaction
        ctr_pct = ct_mult["ctr"]
        clicks = int(engaged_views * (ctr_pct / 100.0))

        # Stage 4: Conversion Events (Action / Fan Monetization)
        conv_rate_pct = ct_mult["conv"]
        conversions = int(clicks * (conv_rate_pct / 100.0))

        # Stage 5: Economic Yield & Split
        effective_cpm = cpm * ct_mult["cpm_adj"]
        ad_revenue = (stage1_impressions / 1000.0) * effective_cpm
        
        # Monetization stream contributions
        sub_revenue = conversions * 8.50  # Average monthly subscription value
        sponsorship_revenue = (stage1_impressions / 1000.0) * 12.00
        commerce_revenue = conversions * 24.00

        if monetization_overlay == "ADS_ONLY":
            gross_revenue = ad_revenue
            creator_share_pct = 52.0
        elif monetization_overlay == "SUBSCRIPTIONS":
            gross_revenue = sub_revenue
            creator_share_pct = 85.0
        elif monetization_overlay == "SPONSORSHIPS":
            gross_revenue = sponsorship_revenue
            creator_share_pct = 90.0
        elif monetization_overlay == "COMMERCE":
            gross_revenue = commerce_revenue
            creator_share_pct = 70.0
        else:  # ALL
            gross_revenue = ad_revenue + sub_revenue + sponsorship_revenue + commerce_revenue
            creator_share_pct = 58.0

        creator_payout = round(gross_revenue * (creator_share_pct / 100.0), 2)
        platform_rent = round(gross_revenue - creator_payout, 2)

        stages = [
            {
                "id": "stage_1_impressions",
                "stage_number": 1,
                "name": "Post Impressions",
                "label": "Algorithmic Discovery",
                "count": stage1_impressions,
                "unit": "Impressions",
                "drop_off_pct": 0.0,
                "conversion_to_next_pct": round(watch_retention_pct, 1),
                "metric_highlight": f"{stage1_impressions:,.0f} Total Eyeballs",
                "description": "Total post appearances rendered in algorithmic user feeds across platforms.",
                "rail_mechanic": "Gatekept by recommendation vectors and private ad auction bid density.",
                "leakage_factor": "95% of creator posts never clear the initial feed threshold."
            },
            {
                "id": "stage_2_watch_time",
                "stage_number": 2,
                "name": "Engaged Watch Time",
                "label": "Attention Retention",
                "count": engaged_views,
                "secondary_count": total_watch_hours,
                "unit": "Engaged Views",
                "secondary_unit": "Hours of Focus",
                "drop_off_pct": round(100.0 - watch_retention_pct, 1),
                "conversion_to_next_pct": round(ctr_pct, 1),
                "metric_highlight": f"{total_watch_hours:,.0f}h Attention ({avg_watch_time_sec}s avg)",
                "description": "Users who maintained focus beyond 3 seconds and consumed meaningful narrative bandwidth.",
                "rail_mechanic": "Platform algorithmic ranking rewards completion rate over creator compensation.",
                "leakage_factor": f"{100.0 - watch_retention_pct:.1f}% scroll away within the first 2 seconds."
            },
            {
                "id": "stage_3_ctr",
                "stage_number": 3,
                "name": "Click-Through (CTR)",
                "label": "Direct Interaction",
                "count": clicks,
                "unit": "Clicks / Tap-throughs",
                "drop_off_pct": round(100.0 - ctr_pct, 1),
                "conversion_to_next_pct": round(conv_rate_pct, 1),
                "metric_highlight": f"{clicks:,.0f} Clicks ({ctr_pct}% CTR)",
                "description": "Active user intent expressed via link clicks, bio navigation, or profile visits.",
                "rail_mechanic": "Walled gardens actively penalize external links that bleed attention off-platform.",
                "leakage_factor": "External link suppression reduces reach by up to 60% on Meta and X."
            },
            {
                "id": "stage_4_conversions",
                "stage_number": 4,
                "name": "Conversion Events",
                "label": "High-Intent Actions",
                "count": conversions,
                "unit": "Conversions",
                "drop_off_pct": round(100.0 - conv_rate_pct, 1),
                "conversion_to_next_pct": 100.0,
                "metric_highlight": f"{conversions:,.0f} Actions ({conv_rate_pct}% Conv)",
                "description": "Completed transactions: paid memberships, digital product sales, or sponsored lead signups.",
                "rail_mechanic": "Conversion events build direct creator equity vs ephemeral platform engagement.",
                "leakage_factor": "Payment processors and app store duopolies extract 15-30% in-app fees."
            },
            {
                "id": "stage_5_monetization",
                "stage_number": 5,
                "name": "Economic Gross Yield",
                "label": "Liquid Value Realization",
                "count": round(gross_revenue, 2),
                "secondary_count": creator_payout,
                "unit": "USD Gross Liquidity",
                "secondary_unit": "USD Creator Payout",
                "drop_off_pct": round(100.0 - creator_share_pct, 1),
                "conversion_to_next_pct": 100.0,
                "metric_highlight": f"${gross_revenue:,.0f} Gross (${creator_payout:,.0f} to Creator)",
                "description": "Total financial yield generated from attention auctioned and creator equity realized.",
                "rail_mechanic": "Intermediary rent extraction sets the ceiling on creator career sustainability.",
                "leakage_factor": f"${platform_rent:,.0f} ({100.0 - creator_share_pct:.0f}%) retained as platform intermediary rent."
            }
        ]

        return {
            "content_type": content_type,
            "monetization_overlay": monetization_overlay,
            "total_gross_revenue_usd": round(gross_revenue, 2),
            "creator_payout_usd": round(creator_payout, 2),
            "platform_take_usd": round(platform_rent, 2),
            "creator_take_rate_pct": creator_share_pct,
            "platform_take_rate_pct": round(100.0 - creator_share_pct, 1),
            "effective_funnel_cpm": round(effective_cpm, 2),
            "overall_funnel_conversion_pct": round((conversions / stage1_impressions) * 100.0, 4) if stage1_impressions > 0 else 0,
            "stages": stages
        }

    @classmethod
    def get_cohort_comparison(cls) -> Dict[str, Any]:
        """
        Generates comparative analytics across Creator Cohorts and Traffic Cohorts.
        """
        cohort_sets = {
            "creator_tier_cohorts": [
                {
                    "cohort_name": "Superstar Top 1%",
                    "creator_description": "Over 1M followers; institutional production studios",
                    "impression_volume": 4200000,
                    "avg_watch_time_sec": 380,
                    "ctr_pct": 4.8,
                    "conversion_rate_pct": 3.4,
                    "creator_take_rate_pct": 72.0,
                    "platform_take_rate_pct": 28.0,
                    "avg_post_yield_usd": 12850.0,
                    "retention_score": 94,
                    "leverage_tier": "Dominant Leverage"
                },
                {
                    "cohort_name": "Top Network 5%",
                    "creator_description": "250k - 1M followers; full-time professional creators",
                    "impression_volume": 850000,
                    "avg_watch_time_sec": 240,
                    "ctr_pct": 3.6,
                    "conversion_rate_pct": 2.2,
                    "creator_take_rate_pct": 55.0,
                    "platform_take_rate_pct": 45.0,
                    "avg_post_yield_usd": 2450.0,
                    "retention_score": 78,
                    "leverage_tier": "Moderate Leverage"
                },
                {
                    "cohort_name": "Mid-Tier 20%",
                    "creator_description": "10k - 250k followers; niche authority & high community trust",
                    "impression_volume": 140000,
                    "avg_watch_time_sec": 160,
                    "ctr_pct": 3.2,
                    "conversion_rate_pct": 1.9,
                    "creator_take_rate_pct": 45.0,
                    "platform_take_rate_pct": 55.0,
                    "avg_post_yield_usd": 480.0,
                    "retention_score": 62,
                    "leverage_tier": "Low Leverage"
                },
                {
                    "cohort_name": "Emerging Long-Tail 74%",
                    "creator_description": "Under 10k followers; supply feedstock for algorithmic mills",
                    "impression_volume": 8500,
                    "avg_watch_time_sec": 42,
                    "ctr_pct": 1.8,
                    "conversion_rate_pct": 0.8,
                    "creator_take_rate_pct": 20.0,
                    "platform_take_rate_pct": 80.0,
                    "avg_post_yield_usd": 14.50,
                    "retention_score": 28,
                    "leverage_tier": "Zero Leverage"
                }
            ],
            "traffic_source_cohorts": [
                {
                    "cohort_name": "Organic Community",
                    "source_description": "Direct subscribers, notifications, and word of mouth",
                    "impression_volume": 320000,
                    "avg_watch_time_sec": 320,
                    "ctr_pct": 6.2,
                    "conversion_rate_pct": 4.1,
                    "creator_take_rate_pct": 85.0,
                    "platform_take_rate_pct": 15.0,
                    "avg_post_yield_usd": 3820.0,
                    "retention_score": 96,
                    "leverage_tier": "Creator-Owned Rail"
                },
                {
                    "cohort_name": "Algorithmic Recommended",
                    "source_description": "FYP / Home feed discovery pushed by black-box tensor",
                    "impression_volume": 2100000,
                    "avg_watch_time_sec": 48,
                    "ctr_pct": 2.2,
                    "conversion_rate_pct": 1.1,
                    "creator_take_rate_pct": 35.0,
                    "platform_take_rate_pct": 65.0,
                    "avg_post_yield_usd": 1940.0,
                    "retention_score": 45,
                    "leverage_tier": "Platform Captive"
                },
                {
                    "cohort_name": "Paid / Boosted Feeds",
                    "source_description": "Creator or brand paid ad units to purchase attention",
                    "impression_volume": 980000,
                    "avg_watch_time_sec": 26,
                    "ctr_pct": 3.4,
                    "conversion_rate_pct": 1.8,
                    "creator_take_rate_pct": 15.0,
                    "platform_take_rate_pct": 85.0,
                    "avg_post_yield_usd": 890.0,
                    "retention_score": 38,
                    "leverage_tier": "Platform Pure Extraction"
                }
            ]
        }
        return cohort_sets

    @classmethod
    def get_platform_split(cls) -> List[Dict[str, Any]]:
        """
        Detailed platform breakdown along the distribution funnel.
        """
        return [
            {
                "platform": "YouTube",
                "format": "Long & Short Video",
                "share_of_impressions_pct": 34.5,
                "share_of_watch_time_pct": 52.8,
                "avg_watch_sec": 480,
                "avg_ctr_pct": 4.2,
                "avg_conversion_rate_pct": 2.6,
                "effective_cpm_usd": 16.50,
                "creator_rev_share_pct": 55.0,
                "platform_take_rate_pct": 45.0,
                "gdelt_sentiment_tone": +1.2,
                "algorithmic_control_rating": "High (Search & Suggestion)",
                "creator_sovereignty_score": 68
            },
            {
                "platform": "TikTok",
                "format": "Vertical Shortform",
                "share_of_impressions_pct": 28.2,
                "share_of_watch_time_pct": 18.4,
                "avg_watch_sec": 34,
                "avg_ctr_pct": 2.1,
                "avg_conversion_rate_pct": 1.3,
                "effective_cpm_usd": 8.50,
                "creator_rev_share_pct": 12.0,
                "platform_take_rate_pct": 88.0,
                "gdelt_sentiment_tone": -2.4,
                "algorithmic_control_rating": "Extreme (Centralized FYP)",
                "creator_sovereignty_score": 18
            },
            {
                "platform": "Meta / Instagram",
                "format": "Reels & Stories",
                "share_of_impressions_pct": 22.4,
                "share_of_watch_time_pct": 14.6,
                "avg_watch_sec": 28,
                "avg_ctr_pct": 1.8,
                "avg_conversion_rate_pct": 1.6,
                "effective_cpm_usd": 12.80,
                "creator_rev_share_pct": 18.0,
                "platform_take_rate_pct": 82.0,
                "gdelt_sentiment_tone": -1.1,
                "algorithmic_control_rating": "High (Closed Auction Wall)",
                "creator_sovereignty_score": 24
            },
            {
                "platform": "Twitch",
                "format": "Interactive Live Streaming",
                "share_of_impressions_pct": 6.8,
                "share_of_watch_time_pct": 11.2,
                "avg_watch_sec": 2100,
                "avg_ctr_pct": 1.2,
                "avg_conversion_rate_pct": 3.8,
                "effective_cpm_usd": 14.20,
                "creator_rev_share_pct": 50.0,
                "platform_take_rate_pct": 50.0,
                "gdelt_sentiment_tone": -3.1,
                "algorithmic_control_rating": "Moderate (Directory Browse)",
                "creator_sovereignty_score": 58
            },
            {
                "platform": "X / Twitter",
                "format": "Microblog & Short Clips",
                "share_of_impressions_pct": 5.4,
                "share_of_watch_time_pct": 1.8,
                "avg_watch_sec": 18,
                "avg_ctr_pct": 1.5,
                "avg_conversion_rate_pct": 1.2,
                "effective_cpm_usd": 7.20,
                "creator_rev_share_pct": 25.0,
                "platform_take_rate_pct": 75.0,
                "gdelt_sentiment_tone": -4.2,
                "algorithmic_control_rating": "High (Algorithmic 'For You')",
                "creator_sovereignty_score": 38
            },
            {
                "platform": "Substack",
                "format": "Longform Articles & Podcasts",
                "share_of_impressions_pct": 2.7,
                "share_of_watch_time_pct": 1.2,
                "avg_watch_sec": 340,
                "avg_ctr_pct": 6.8,
                "avg_conversion_rate_pct": 5.8,
                "effective_cpm_usd": 28.00,
                "creator_rev_share_pct": 90.0,
                "platform_take_rate_pct": 10.0,
                "gdelt_sentiment_tone": +3.8,
                "algorithmic_control_rating": "Minimal (Direct Email Rail)",
                "creator_sovereignty_score": 92
            }
        ]

    @classmethod
    def get_persona_explanations(cls) -> Dict[str, Any]:
        """
        Provides tailored explanation copy for everyday viewers, builders, and allocators.
        """
        return {
            "everyday_viewers": {
                "title": "For Everyday Viewers",
                "badge": "Attention Donor Perspective",
                "tagline": "How your scroll time is financialized and extracted.",
                "insights": [
                    {
                        "headline": "You Are the Liquidity Provider",
                        "body": "Every second you linger on a short-form clip, the platform's auction engine bids out your attention to 20+ ad exchanges in under 150 milliseconds."
                    },
                    {
                        "headline": "Where Your Value Goes",
                        "body": "On platforms like TikTok and Instagram, less than 18% of the revenue generated by your viewing goes to the creator who made the video. The rest is retained as platform intermediary rent."
                    },
                    {
                        "headline": "Ad Fatigue & Friction",
                        "body": "Platforms test your ad tolerance constantly. Once ad density exceeds 2.5 ads per 10 minutes, viewer session duration collapses by over 22% due to fatigue."
                    }
                ]
            },
            "builders": {
                "title": "For Builders & Creators",
                "badge": "Product & Distribution Perspective",
                "tagline": "Engineering conversion funnels that survive algorithmic gatekeepers.",
                "insights": [
                    {
                        "headline": "The Walled Garden Tax",
                        "body": "Platforms deliberately suppress posts containing outbound links (up to 60% reach penalty). Builders must design multi-stage funnels (e.g. pinned comments, bio links, direct newsletters) to convert ephemeral viewers into owned subscribers."
                    },
                    {
                        "headline": "Watch Time vs CTR Optimization",
                        "body": "Optimizing purely for algorithmic watch time creates high impressions but zero equity. Sustainable creator businesses require balancing high-CTR hooks with off-rail conversion mechanisms (Stripe, Substack, Shopify)."
                    },
                    {
                        "headline": "Monetization Stack Diversification",
                        "body": "Ad rev-share alone yields only $1.50-$18.00 CPM. Layering direct fan memberships and sponsorship overlays multiplies creator hourly yield by 4.2x."
                    }
                ]
            },
            "allocators": {
                "title": "For Allocators & Investors",
                "badge": "Capital & Infrastructure Perspective",
                "tagline": "Evaluating platform take-rates, network lock-in, and creator economics.",
                "insights": [
                    {
                        "headline": "Heft of Platform Rents",
                        "body": "Distribution monopolies (Meta, ByteDance, Alphabet) command 45%-88% gross margins on creator attention rails because they control both the identity graph and the auction clearinghouse."
                    },
                    {
                        "headline": "Power Law & Churn Vulnerability",
                        "body": "The top 1% of creators generate 72% of platform gross yield. When platforms reduce rev-share (e.g. Twitch 50/50 sub split), superstar creator defection accelerates audience churn to competing rails."
                    },
                    {
                        "headline": "The Direct-to-Fan Opportunity",
                        "body": "Infrastructure rails that reduce take-rates from 80% to 10% (like Substack or decentralized creator rails) unlock massive LTV/CAC advantages for creators, creating fertile ground for capital allocation."
                    }
                ]
            }
        }
