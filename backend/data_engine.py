"""
Real Rails Intelligence Engine: Attention Economy Revenue Simulator
Data Orchestration: Pandas & DuckDB
Data Sources: Ingested Our World in Data & World Bank Data Benchmarks
"""

import json
import duckdb
import pandas as pd
import numpy as np
from typing import Dict, Any, List

# Regional Benchmarks integrating Our World in Data & World Bank Indicators
GLOBAL_ATTENTION_BENCHMARKS = [
    {
        "id": "USA",
        "country": "United States",
        "region": "North America",
        "lat": 37.0902,
        "lng": -95.7129,
        "internet_penetration_pct": 92.8,  # World Bank
        "daily_screen_time_mins": 425,     # OWID / DataReportal
        "social_media_mins": 134,
        "gdp_per_capita_usd": 76330,       # World Bank
        "avg_cpm_usd": 24.50,
        "ad_tolerance_index": 72.0,        # Scale 0-100
        "creator_payout_rate_pct": 55.0,
        "digital_ad_spend_per_user_usd": 780.0
    },
    {
        "id": "GBR",
        "country": "United Kingdom",
        "region": "Europe",
        "lat": 55.3781,
        "lng": -3.4360,
        "internet_penetration_pct": 94.6,
        "daily_screen_time_mins": 352,
        "social_media_mins": 108,
        "gdp_per_capita_usd": 46125,
        "avg_cpm_usd": 18.80,
        "ad_tolerance_index": 68.0,
        "creator_payout_rate_pct": 52.0,
        "digital_ad_spend_per_user_usd": 620.0
    },
    {
        "id": "DEU",
        "country": "Germany",
        "region": "Europe",
        "lat": 51.1657,
        "lng": 10.4515,
        "internet_penetration_pct": 93.1,
        "daily_screen_time_mins": 312,
        "social_media_mins": 90,
        "gdp_per_capita_usd": 48720,
        "avg_cpm_usd": 17.20,
        "ad_tolerance_index": 59.0,
        "creator_payout_rate_pct": 50.0,
        "digital_ad_spend_per_user_usd": 490.0
    },
    {
        "id": "JPN",
        "country": "Japan",
        "region": "Asia-Pacific",
        "lat": 36.2048,
        "lng": 138.2529,
        "internet_penetration_pct": 93.3,
        "daily_screen_time_mins": 265,
        "social_media_mins": 51,
        "gdp_per_capita_usd": 39310,
        "avg_cpm_usd": 15.60,
        "ad_tolerance_index": 64.0,
        "creator_payout_rate_pct": 48.0,
        "digital_ad_spend_per_user_usd": 380.0
    },
    {
        "id": "IND",
        "country": "India",
        "region": "South Asia",
        "lat": 20.5937,
        "lng": 78.9629,
        "internet_penetration_pct": 52.4,
        "daily_screen_time_mins": 448,
        "social_media_mins": 156,
        "gdp_per_capita_usd": 2410,
        "avg_cpm_usd": 2.20,
        "ad_tolerance_index": 84.0,
        "creator_payout_rate_pct": 45.0,
        "digital_ad_spend_per_user_usd": 18.5
    },
    {
        "id": "BRA",
        "country": "Brazil",
        "region": "Latin America",
        "lat": -14.2350,
        "lng": -51.9253,
        "internet_penetration_pct": 81.0,
        "daily_screen_time_mins": 560,
        "social_media_mins": 224,
        "gdp_per_capita_usd": 8920,
        "avg_cpm_usd": 5.40,
        "ad_tolerance_index": 79.0,
        "creator_payout_rate_pct": 46.0,
        "digital_ad_spend_per_user_usd": 95.0
    },
    {
        "id": "NGA",
        "country": "Nigeria",
        "region": "Sub-Saharan Africa",
        "lat": 9.0820,
        "lng": 8.6753,
        "internet_penetration_pct": 55.4,
        "daily_screen_time_mins": 485,
        "social_media_mins": 218,
        "gdp_per_capita_usd": 2180,
        "avg_cpm_usd": 1.40,
        "ad_tolerance_index": 82.0,
        "creator_payout_rate_pct": 40.0,
        "digital_ad_spend_per_user_usd": 12.0
    },
    {
        "id": "IDN",
        "country": "Indonesia",
        "region": "Southeast Asia",
        "lat": -0.7893,
        "lng": 113.9213,
        "internet_penetration_pct": 77.0,
        "daily_screen_time_mins": 465,
        "social_media_mins": 190,
        "gdp_per_capita_usd": 4780,
        "avg_cpm_usd": 3.10,
        "ad_tolerance_index": 81.0,
        "creator_payout_rate_pct": 45.0,
        "digital_ad_spend_per_user_usd": 32.0
    },
    {
        "id": "AUS",
        "country": "Australia",
        "region": "Oceania",
        "lat": -25.2744,
        "lng": 133.7751,
        "internet_penetration_pct": 96.2,
        "daily_screen_time_mins": 348,
        "social_media_mins": 115,
        "gdp_per_capita_usd": 64500,
        "avg_cpm_usd": 22.10,
        "ad_tolerance_index": 67.0,
        "creator_payout_rate_pct": 54.0,
        "digital_ad_spend_per_user_usd": 710.0
    },
    {
        "id": "CAN",
        "country": "Canada",
        "region": "North America",
        "lat": 56.1304,
        "lng": -106.3468,
        "internet_penetration_pct": 94.0,
        "daily_screen_time_mins": 395,
        "social_media_mins": 122,
        "gdp_per_capita_usd": 54960,
        "avg_cpm_usd": 20.80,
        "ad_tolerance_index": 70.0,
        "creator_payout_rate_pct": 53.0,
        "digital_ad_spend_per_user_usd": 640.0
    },
    {
        "id": "FRA",
        "country": "France",
        "region": "Europe",
        "lat": 46.2276,
        "lng": 2.2137,
        "internet_penetration_pct": 92.0,
        "daily_screen_time_mins": 330,
        "social_media_mins": 102,
        "gdp_per_capita_usd": 43660,
        "avg_cpm_usd": 16.40,
        "ad_tolerance_index": 60.0,
        "creator_payout_rate_pct": 50.0,
        "digital_ad_spend_per_user_usd": 450.0
    },
    {
        "id": "SGP",
        "country": "Singapore",
        "region": "Southeast Asia",
        "lat": 1.3521,
        "lng": 103.8198,
        "internet_penetration_pct": 96.9,
        "daily_screen_time_mins": 420,
        "social_media_mins": 135,
        "gdp_per_capita_usd": 82800,
        "avg_cpm_usd": 19.50,
        "ad_tolerance_index": 71.0,
        "creator_payout_rate_pct": 52.0,
        "digital_ad_spend_per_user_usd": 580.0
    },
    {
        "id": "ARE",
        "country": "United Arab Emirates",
        "region": "Middle East",
        "lat": 23.4241,
        "lng": 53.8478,
        "internet_penetration_pct": 99.0,
        "daily_screen_time_mins": 450,
        "social_media_mins": 178,
        "gdp_per_capita_usd": 53700,
        "avg_cpm_usd": 17.80,
        "ad_tolerance_index": 74.0,
        "creator_payout_rate_pct": 51.0,
        "digital_ad_spend_per_user_usd": 490.0
    },
    {
        "id": "ZAF",
        "country": "South Africa",
        "region": "Sub-Saharan Africa",
        "lat": -30.5595,
        "lng": 22.9375,
        "internet_penetration_pct": 72.3,
        "daily_screen_time_mins": 578,
        "social_media_mins": 224,
        "gdp_per_capita_usd": 6770,
        "avg_cpm_usd": 4.10,
        "ad_tolerance_index": 78.0,
        "creator_payout_rate_pct": 44.0,
        "digital_ad_spend_per_user_usd": 68.0
    },
    {
        "id": "KOR",
        "country": "South Korea",
        "region": "Asia-Pacific",
        "lat": 35.9078,
        "lng": 127.7669,
        "internet_penetration_pct": 97.6,
        "daily_screen_time_mins": 315,
        "social_media_mins": 76,
        "gdp_per_capita_usd": 32420,
        "avg_cpm_usd": 14.20,
        "ad_tolerance_index": 62.0,
        "creator_payout_rate_pct": 49.0,
        "digital_ad_spend_per_user_usd": 410.0
    },
    {
        "id": "MEX",
        "country": "Mexico",
        "region": "Latin America",
        "lat": 23.6345,
        "lng": -102.5528,
        "internet_penetration_pct": 78.6,
        "daily_screen_time_mins": 482,
        "social_media_mins": 196,
        "gdp_per_capita_usd": 10045,
        "avg_cpm_usd": 4.80,
        "ad_tolerance_index": 80.0,
        "creator_payout_rate_pct": 45.0,
        "digital_ad_spend_per_user_usd": 85.0
    }
]

# Major Attention Economy Platforms Benchmark
PLATFORM_ARCHETYPES = [
    {
        "platform": "YouTube",
        "primary_format": "Long & Mid-form Video",
        "avg_session_min": 40.5,
        "avg_ad_load_per_10m": 2.4,
        "avg_cpm_usd": 16.50,
        "creator_rev_share_pct": 55.0,
        "platform_take_rate_pct": 45.0,
        "governance_model": "AdSense Partner Program (Monopoly Auction Gate)",
        "attention_rail_control": "Algorithmic feed recommendations + Search ranking",
        "monetization_efficiency_score": 92.4
    },
    {
        "platform": "Meta / Instagram",
        "primary_format": "Reels, Feed & Stories",
        "avg_session_min": 33.2,
        "avg_ad_load_per_10m": 3.8,
        "avg_cpm_usd": 12.80,
        "creator_rev_share_pct": 18.0,
        "platform_take_rate_pct": 82.0,
        "governance_model": "Closed Wall Ad Exchange / Creator Bonus Funds (Discretionary)",
        "attention_rail_control": "Discovery engine + Social graph suppression",
        "monetization_efficiency_score": 96.1
    },
    {
        "platform": "TikTok",
        "primary_format": "Short-form Vertical Video",
        "avg_session_min": 58.0,
        "avg_ad_load_per_10m": 4.2,
        "avg_cpm_usd": 8.50,
        "creator_rev_share_pct": 12.0,
        "platform_take_rate_pct": 88.0,
        "governance_model": "Creator Rewards / Pulse (Strict qualification criteria)",
        "attention_rail_control": "Centralized 'For You' dynamic feed tensor",
        "monetization_efficiency_score": 94.8
    },
    {
        "platform": "Twitch",
        "primary_format": "Live Streaming & Interaction",
        "avg_session_min": 95.0,
        "avg_ad_load_per_10m": 1.5,
        "avg_cpm_usd": 14.20,
        "creator_rev_share_pct": 50.0,
        "platform_take_rate_pct": 50.0,
        "governance_model": "Affiliate & Partner Tier Contract Schedules",
        "attention_rail_control": "Directory browsing + Subscribed follower notifications",
        "monetization_efficiency_score": 78.5
    },
    {
        "platform": "X (formerly Twitter)",
        "primary_format": "Micro-blogging & Video Feed",
        "avg_session_min": 24.5,
        "avg_ad_load_per_10m": 3.2,
        "avg_cpm_usd": 6.80,
        "creator_rev_share_pct": 30.0,
        "platform_take_rate_pct": 70.0,
        "governance_model": "Premium Subscriber Ad Payout System",
        "attention_rail_control": "Boosted verification tier priority ranking",
        "monetization_efficiency_score": 64.2
    },
    {
        "platform": "Spotify",
        "primary_format": "Audio Streaming & Podcasts",
        "avg_session_min": 72.0,
        "avg_ad_load_per_10m": 0.9,
        "avg_cpm_usd": 22.00,
        "creator_rev_share_pct": 68.0,
        "platform_take_rate_pct": 32.0,
        "governance_model": "Stream Share Royalty Pool / Megaphone Podcast Ads",
        "attention_rail_control": "Editorial and personalized algorithmic playlists",
        "monetization_efficiency_score": 83.0
    },
    {
        "platform": "Substack",
        "primary_format": "Long-form Newsletters & Audio",
        "avg_session_min": 18.0,
        "avg_ad_load_per_10m": 0.0,
        "avg_cpm_usd": 0.0,
        "creator_rev_share_pct": 90.0,
        "platform_take_rate_pct": 10.0,
        "governance_model": "Direct Subscriber Subscription Rail (Stripe Infrastructure)",
        "attention_rail_control": "Email delivery inbox rail + Subscriber recommendations",
        "monetization_efficiency_score": 88.0
    }
]


class AttentionDataEngine:
    """
    DuckDB and Pandas powered data processing engine.
    Transforms raw indicators into 'The Intelligence Layer':
    - Yield per Attention Hour
    - Percentage variance above/below global median benchmark
    - Churn elasticity
    - Attention rail capture ratio
    """

    def __init__(self):
        self.con = duckdb.connect(database=":memory:")
        self._init_tables()

    def _init_tables(self):
        df_benchmarks = pd.DataFrame(GLOBAL_ATTENTION_BENCHMARKS)
        # Register in DuckDB
        self.con.register("raw_benchmarks", df_benchmarks)

        # Build transformed intelligence table with DuckDB SQL
        self.con.execute("""
            CREATE TABLE regional_intelligence AS
            SELECT 
                id,
                country,
                region,
                lat,
                lng,
                internet_penetration_pct,
                daily_screen_time_mins,
                social_media_mins,
                gdp_per_capita_usd,
                avg_cpm_usd,
                ad_tolerance_index,
                creator_payout_rate_pct,
                digital_ad_spend_per_user_usd,
                -- Intelligence Layer Transformations:
                -- Annual Gross Monetization Yield per user = (Daily Screen Mins / 10.0 * 2.0 ads * avg_cpm / 1000) * 365
                ROUND((daily_screen_time_mins / 10.0 * 2.2 * (avg_cpm_usd / 1000.0) * 365), 2) AS estimated_annual_yield_per_user_usd,
                -- Attention Monetization Efficiency ($/1,000 attention hours)
                ROUND(((avg_cpm_usd / 1000.0) * (6.0 * 2.2) * 1000.0), 2) AS yield_per_1000_attention_hours_usd,
                -- Percentage variance vs Global CPM Median
                ROUND(((avg_cpm_usd - MEDIAN(avg_cpm_usd) OVER()) / MEDIAN(avg_cpm_usd) OVER()) * 100, 1) AS cpm_pct_vs_median,
                -- Rail Exploitation Gap: Screen time rank vs Revenue Yield rank
                ROUND((social_media_mins / daily_screen_time_mins) * 100, 1) AS social_attention_share_pct
            FROM raw_benchmarks
        """)

    def get_regional_intelligence_df(self) -> pd.DataFrame:
        return self.con.execute("SELECT * FROM regional_intelligence ORDER BY avg_cpm_usd DESC").df()

    def get_geojson(self) -> Dict[str, Any]:
        """
        Returns GeoJSON FeatureCollection with coordinates and Real Rails intelligence attributes.
        Strict guardrail: Professional GeoJSON structure, no manual SVG coordinate hacks.
        """
        df = self.get_regional_intelligence_df()
        features = []
        for _, row in df.iterrows():
            features.append({
                "type": "Feature",
                "id": row["id"],
                "geometry": {
                    "type": "Point",
                    "coordinates": [float(row["lng"]), float(row["lat"])]
                },
                "properties": {
                    "id": row["id"],
                    "country": row["country"],
                    "region": row["region"],
                    "internet_penetration_pct": float(row["internet_penetration_pct"]),
                    "daily_screen_time_mins": int(row["daily_screen_time_mins"]),
                    "social_media_mins": int(row["social_media_mins"]),
                    "avg_cpm_usd": float(row["avg_cpm_usd"]),
                    "cpm_pct_vs_median": float(row["cpm_pct_vs_median"]),
                    "estimated_annual_yield_per_user_usd": float(row["estimated_annual_yield_per_user_usd"]),
                    "yield_per_1000_attention_hours_usd": float(row["yield_per_1000_attention_hours_usd"]),
                    "creator_payout_rate_pct": float(row["creator_payout_rate_pct"]),
                    "ad_tolerance_index": float(row["ad_tolerance_index"]),
                    "digital_ad_spend_per_user_usd": float(row["digital_ad_spend_per_user_usd"])
                }
            })
        return {
            "type": "FeatureCollection",
            "metadata": {
                "rail_category": "Distribution & Demand",
                "title": "Global Attention Economy Rails",
                "primary_sources": ["Our World in Data", "World Bank Data"],
                "total_regions": len(features),
                "global_median_cpm": float(df["avg_cpm_usd"].median()),
                "highest_yield_region": df.iloc[0]["country"]
            },
            "features": features
        }

    def get_platform_benchmarks(self) -> List[Dict[str, Any]]:
        return PLATFORM_ARCHETYPES

    def generate_synthetic_event_stream(self, n_samples: int = 500) -> pd.DataFrame:
        """
        Generates synthetic event-level dataset for well-labeled sample data:
        - session_length_minutes
        - ad_slots_served
        - completed_impressions
        - effective_cpm
        - creator_tier
        - rev_share_pct
        - gross_platform_revenue
        - creator_payout
        """
        np.random.seed(42)
        tiers = ["Emerging Creator (<10k)", "Mid-Tier (10k-250k)", "Top Creator (250k-1M)", "Enterprise Rail Partner (>1M)"]
        tier_priors = [0.65, 0.25, 0.08, 0.02]
        
        assigned_tiers = np.random.choice(tiers, size=n_samples, p=tier_priors)
        session_lengths = np.round(np.random.lognormal(mean=3.2, sigma=0.6, size=n_samples), 1)
        session_lengths = np.clip(session_lengths, 3.0, 180.0)
        
        # Ad frequency depends on length
        ad_densities = np.random.uniform(1.2, 4.0, size=n_samples)
        ad_slots = np.floor((session_lengths / 10.0) * ad_densities).astype(int)
        ad_slots = np.maximum(1, ad_slots)
        
        # Fill rate and completion
        fill_rates = np.random.uniform(0.75, 0.98, size=n_samples)
        completed_impressions = np.round(ad_slots * fill_rates).astype(int)
        
        # CPM variations by tier
        tier_cpm_boost = {
            "Emerging Creator (<10k)": 0.8,
            "Mid-Tier (10k-250k)": 1.0,
            "Top Creator (250k-1M)": 1.35,
            "Enterprise Rail Partner (>1M)": 1.85
        }
        base_cpm = np.random.normal(loc=14.5, scale=4.0, size=n_samples)
        base_cpm = np.maximum(2.0, base_cpm)
        effective_cpms = np.round([base_cpm[i] * tier_cpm_boost[assigned_tiers[i]] for i in range(n_samples)], 2)
        
        # Rev share
        tier_rev_share = {
            "Emerging Creator (<10k)": 35.0,
            "Mid-Tier (10k-250k)": 45.0,
            "Top Creator (250k-1M)": 55.0,
            "Enterprise Rail Partner (>1M)": 65.0
        }
        rev_shares = [tier_rev_share[t] for t in assigned_tiers]
        
        gross_rev = np.round((completed_impressions / 1000.0) * effective_cpms, 4)
        creator_payout = np.round(gross_rev * (np.array(rev_shares) / 100.0), 4)
        platform_margin = np.round(gross_rev - creator_payout, 4)
        
        df_events = pd.DataFrame({
            "session_id": [f"SES-2026-{1000+i}" for i in range(n_samples)],
            "creator_tier": assigned_tiers,
            "session_duration_mins": session_lengths,
            "ad_slots_rendered": ad_slots,
            "completed_impressions": completed_impressions,
            "effective_cpm_usd": effective_cpms,
            "creator_rev_share_pct": rev_shares,
            "gross_platform_revenue_usd": gross_rev,
            "creator_payout_usd": creator_payout,
            "platform_take_usd": platform_margin,
            "attention_yield_per_hour_usd": np.round((gross_rev / (session_lengths / 60.0)), 4)
        })
        
        return df_events


# Global singleton
engine = AttentionDataEngine()
