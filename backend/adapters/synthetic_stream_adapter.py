"""
Synthetic Post Event Stream Adapter for Creator Distribution Funnel
Rail Category: Distribution & Demand
Generates well-labeled, statistically-calibrated event-level feeds:
- Post Impressions
- Watch Time (hours & average seconds)
- Click-Through Rate (CTR)
- Conversion Events
- Platform & Content Type Splits
- Monetization Breakdown
"""

import random
import pandas as pd
import numpy as np
from typing import Dict, Any, List

PLATFORMS = [
    {"name": "YouTube", "base_cpm": 16.5, "rev_share": 55.0, "avg_ctr": 4.2, "content_types": ["Long-form Video", "Short-form Video", "Livestream"]},
    {"name": "TikTok", "base_cpm": 8.5, "rev_share": 12.0, "avg_ctr": 2.1, "content_types": ["Short-form Video", "Livestream"]},
    {"name": "Meta / Instagram", "base_cpm": 12.8, "rev_share": 18.0, "avg_ctr": 1.8, "content_types": ["Short-form Video", "Static / Carousel"]},
    {"name": "Twitch", "base_cpm": 14.2, "rev_share": 50.0, "avg_ctr": 1.2, "content_types": ["Livestream"]},
    {"name": "X / Twitter", "base_cpm": 7.2, "rev_share": 25.0, "avg_ctr": 1.5, "content_types": ["Static / Carousel", "Short-form Video", "Newsletter / Article"]},
    {"name": "Substack", "base_cpm": 28.0, "rev_share": 90.0, "avg_ctr": 6.8, "content_types": ["Newsletter / Article"]}
]

CREATOR_TIERS = [
    {"tier": "Superstar (1M+)", "weight": 0.03, "imp_range": (350000, 2500000), "watch_mult": 1.35, "conv_rate": 0.032},
    {"tier": "Top Creator (250k-1M)", "weight": 0.12, "imp_range": (80000, 450000), "watch_mult": 1.15, "conv_rate": 0.024},
    {"tier": "Mid-Tier (10k-250k)", "weight": 0.35, "imp_range": (15000, 95000), "watch_mult": 1.0, "conv_rate": 0.018},
    {"tier": "Emerging (<10k)", "weight": 0.50, "imp_range": (1200, 18000), "watch_mult": 0.85, "conv_rate": 0.012}
]

CONTENT_TYPE_SPECS = {
    "Short-form Video": {"avg_duration_sec": 32.0, "base_completion_rate": 0.65, "cpm_factor": 0.75},
    "Long-form Video": {"avg_duration_sec": 620.0, "base_completion_rate": 0.38, "cpm_factor": 1.40},
    "Livestream": {"avg_duration_sec": 3800.0, "base_completion_rate": 0.22, "cpm_factor": 1.10},
    "Static / Carousel": {"avg_duration_sec": 14.0, "base_completion_rate": 0.78, "cpm_factor": 0.60},
    "Newsletter / Article": {"avg_duration_sec": 210.0, "base_completion_rate": 0.52, "cpm_factor": 1.80}
}

COHORTS = ["Organic Reach", "Algorithmic Recommended", "Paid / Boosted"]

class SyntheticStreamAdapter:
    """
    Generates synthetic event streams with labeled provenance
    satisfying the Real Rails Distribution & Demand specification.
    """

    @classmethod
    def generate_events(cls, n_samples: int = 500, seed: int = 42) -> pd.DataFrame:
        random.seed(seed)
        np.random.seed(seed)
        
        tier_choices = [t["tier"] for t in CREATOR_TIERS]
        tier_weights = [t["weight"] for t in CREATOR_TIERS]
        tier_lookup = {t["tier"]: t for t in CREATOR_TIERS}

        records = []
        for i in range(1, n_samples + 1):
            tier_name = random.choices(tier_choices, weights=tier_weights)[0]
            tier_info = tier_lookup[tier_name]

            platform_info = random.choice(PLATFORMS)
            platform_name = platform_info["name"]
            content_type = random.choice(platform_info["content_types"])
            content_spec = CONTENT_TYPE_SPECS[content_type]
            cohort = random.choice(COHORTS)

            # 1. Post Impressions
            low_imp, high_imp = tier_info["imp_range"]
            impressions = int(np.random.lognormal(mean=np.log((low_imp + high_imp)/2.0), sigma=0.55))
            impressions = max(500, min(impressions, 4000000))

            # 2. Watch Time & Retention
            avg_watch_sec = round(content_spec["avg_duration_sec"] * random.uniform(0.7, 1.25) * tier_info["watch_mult"], 1)
            total_watch_hours = round((impressions * avg_watch_sec) / 3600.0, 2)
            completion_rate = round(min(0.95, max(0.10, content_spec["base_completion_rate"] * random.uniform(0.85, 1.15))), 3)

            # 3. CTR (Click-Through Rate)
            base_ctr = platform_info["avg_ctr"]
            if cohort == "Paid / Boosted":
                base_ctr *= 1.3
            elif cohort == "Organic Reach":
                base_ctr *= 1.15
            ctr_pct = round(max(0.4, np.random.normal(base_ctr, 0.75)), 2)
            clicks = int(round(impressions * (ctr_pct / 100.0)))

            # 4. Conversion Events
            conv_rate = round(tier_info["conv_rate"] * (1.2 if content_type == "Newsletter / Article" else 1.0) * random.uniform(0.75, 1.3), 4)
            conversions = int(round(clicks * conv_rate))

            # 5. Economics (CPM, Gross, Creator Payout, Platform Take)
            effective_cpm = round(platform_info["base_cpm"] * content_spec["cpm_factor"] * random.uniform(0.85, 1.2), 2)
            gross_revenue = round((impressions / 1000.0) * effective_cpm + (conversions * 2.50), 2)
            rev_share_pct = platform_info["rev_share"]
            creator_payout = round(gross_revenue * (rev_share_pct / 100.0), 2)
            platform_take = round(gross_revenue - creator_payout, 2)

            records.append({
                "post_id": f"POST-2026-{10000 + i}",
                "data_provenance": "SYNTHETIC_CALIBRATED_EVENT_STREAM",
                "creator_tier": tier_name,
                "platform": platform_name,
                "content_type": content_type,
                "cohort": cohort,
                "post_impressions": impressions,
                "avg_watch_time_sec": avg_watch_sec,
                "total_watch_time_hours": total_watch_hours,
                "completion_rate_pct": round(completion_rate * 100, 1),
                "ctr_pct": ctr_pct,
                "clicks_delivered": clicks,
                "conversion_events": conversions,
                "conversion_rate_pct": round(conv_rate * 100, 2),
                "effective_cpm_usd": effective_cpm,
                "gross_revenue_usd": gross_revenue,
                "creator_rev_share_pct": rev_share_pct,
                "creator_payout_usd": creator_payout,
                "platform_take_usd": platform_take
            })

        return pd.DataFrame(records)
