"""
FastAPI Backend for Real Rails: Creator Distribution Funnel
Rail Category: Distribution & Demand
Data Ingestion: GDELT 2.0 (Global Database of Events, Language, and Tone),
                Our World in Data (OWID), World Bank Data Indicators
Event Feed: Statistically-calibrated synthetic post impressions, watch time, CTR, and conversions
"""

import io
from fastapi import FastAPI, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import pandas as pd

from data_engine import engine
from simulator import SimulationParams, AttentionSimulator
from adapters.gdelt_adapter import GDELTAdapter
from adapters.synthetic_stream_adapter import SyntheticStreamAdapter
from funnel_engine import CreatorFunnelEngine

app = FastAPI(
    title="Real Rails Intelligence: Creator Distribution Funnel",
    version="2.0.0",
    description="Simulates creator distribution funnels, algorithmic gates, and platform intermediary rent vs creator payouts."
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "rail_id": "POC-45-Creator-Distribution-Funnel",
        "rail_title": "Creator Distribution Funnel",
        "rail_category": "Distribution & Demand",
        "protocol": "Real Rails Master Protocol v2.0",
        "ingested_sources": ["GDELT 2.0", "Our World in Data", "World Bank"],
        "synthetic_feed": "Post impressions, watch time, CTR, conversion events"
    }

@app.get("/api/metadata")
def get_metadata():
    return {
        "project_id": "POC-45",
        "project_title": "Creator Distribution Funnel",
        "rail_category": "Distribution & Demand",
        "theme": "High-end Fintech / Distribution Intelligence Terminal",
        "primary_data_sources": [
            "GDELT Project 2.0 (Global Database of Events, Language, and Tone - media attention velocity & tone)",
            "Our World in Data (Daily Screen Time, Social Media Usage per Capita)",
            "World Bank Data (Internet Penetration, Digital Ad Spend per user)"
        ],
        "synthetic_parameters": [
            "Synthetic post impressions (lognormal distributed)",
            "Engaged watch time & completion rates",
            "Click-through rate (CTR) & interaction friction",
            "Downstream conversion events (memberships, sponsorships, commerce)",
            "Monetization overlays & platform take-rate tax"
        ],
        "version": "2.0.0"
    }

@app.get("/api/gdelt-signals")
def get_gdelt_signals():
    """
    Returns global media coverage, attention velocity, and tone scores from GDELT 2.0.
    """
    return GDELTAdapter.fetch_creator_economy_signals()

@app.get("/api/funnel")
def get_funnel(
    dau: int = Query(default=250000, ge=1000, le=10000000),
    cpm: float = Query(default=15.0, ge=0.5, le=100.0),
    content_type: str = Query(default="ALL"),
    monetization_overlay: str = Query(default="ALL")
):
    """
    Calculates the 5-stage distribution funnel with drop-offs and yield.
    """
    return CreatorFunnelEngine.get_funnel_stages(
        base_dau=dau,
        cpm=cpm,
        content_type=content_type,
        monetization_overlay=monetization_overlay
    )

@app.get("/api/cohorts")
def get_cohorts():
    """
    Returns side-by-side comparative cohorts (Creator Tiers and Traffic Sources).
    """
    return CreatorFunnelEngine.get_cohort_comparison()

@app.get("/api/platform-split")
def get_platform_split():
    """
    Returns platform split with GDELT sentiment tone and algorithmic gate ratings.
    """
    return {
        "platforms": CreatorFunnelEngine.get_platform_split()
    }

@app.get("/api/personas")
def get_persona_explanations():
    """
    Returns tailored explanation copy for everyday viewers, builders, and allocators.
    """
    return CreatorFunnelEngine.get_persona_explanations()

@app.get("/api/sidebar")
def get_sidebar_intelligence(
    content_type: str = Query(default="ALL"),
    monetization_overlay: str = Query(default="ALL")
):
    """
    Supplies the exact 30% Intelligence Sidebar protocol for Creator Distribution Funnel.
    """
    funnel = CreatorFunnelEngine.get_funnel_stages(
        base_dau=250000,
        cpm=15.0,
        content_type=content_type,
        monetization_overlay=monetization_overlay
    )
    personas = CreatorFunnelEngine.get_persona_explanations()
    gdelt = GDELTAdapter.fetch_creator_economy_signals()

    return {
        "section_a": {
            "title": "Creator Distribution Funnel",
            "rail_category": "Distribution & Demand",
            "headline_metric": {
                "label": "Annualized Gross Rail Liquidity",
                "value": f"${funnel['total_gross_revenue_usd'] * 365.25:,.0f}",
                "unit": "USD / Year",
                "sub_metric": f"{funnel['creator_take_rate_pct']}% Creator Share vs {funnel['platform_take_rate_pct']}% Intermediary Rent",
                "trend": "+8.4% YoY Media Attention (GDELT Index)"
            },
            "kpis": [
                {
                    "label": "Top-Funnel Post Impressions",
                    "value": f"{funnel['stages'][0]['count']:,}",
                    "context": "Discovery Eyeballs Delivered"
                },
                {
                    "label": "Engaged Watch Time",
                    "value": f"{funnel['stages'][1]['secondary_count']:,} hrs",
                    "context": "Aggregate Viewer Attention"
                },
                {
                    "label": "Click-Through Yield",
                    "value": f"{funnel['stages'][2]['count']:,} Clicks",
                    "context": f"{funnel['stages'][2]['conversion_to_next_pct']}% Avg CTR"
                },
                {
                    "label": "Downstream Conversions",
                    "value": f"{funnel['stages'][3]['count']:,}",
                    "context": "Creator Equity Realized"
                }
            ]
        },
        "section_b": {
            "title": "Why This Matters",
            "badge": "Distribution & Demand Thesis",
            "content": (
                "The creator distribution funnel is the modern economic conduit converting human "
                "seconds and neurological focus directly into financial liquidity. "
                "Unlike physical supply chains, this digital rail is governed by opaque recommendation algorithms "
                "and private ad auctions that extract high rents before creators receive any yield."
            ),
            "personas": personas,
            "key_takeaways": [
                "Attention Latency: Beyond 2.5 ads/10m, session retention drops precipitously.",
                "Walled Gardens: Platforms penalize external link CTR by up to 60% to trap audiences.",
                "Power Law: 72% of total platform yield is concentrated in the top 1% creator tier."
            ]
        },
        "section_c": {
            "title": "Who Controls the Rail",
            "badge": "Governance & Institutional Leverage",
            "quote": "Platforms control the distribution of attention, turning users’ time and impressions into revenue while determining how earnings and economic power are shared with creators.",
            "governance_vectors": [
                {
                    "institution": "Algorithmic Gatekeepers",
                    "mechanism": "Opaque feed recommendation vectors dictate content velocity and impression discovery.",
                    "power_level": "Absolute Monopoly",
                    "impact": "Decides which creator posts receive reach or suffer shadow suppression."
                },
                {
                    "institution": "Private Ad Exchange Auctions",
                    "mechanism": "Second-price and header bidding exchanges set clearing CPMs with zero publisher transparency.",
                    "power_level": "High Extraction",
                    "impact": "Captures 45% to 88% of advertiser spend before payout."
                },
                {
                    "institution": "Creator Terms of Service Contracts",
                    "mechanism": "Unilateral rev-share adjustments without collective bargaining.",
                    "power_level": "Contractual Hegemony",
                    "impact": "Platforms can cut creator payouts overnight (e.g. TikTok Creator Fund, Twitch 50/50 sub split)."
                }
            ],
            "gdelt_signals": gdelt["macro_attention_signals"]
        },
        "section_d": {
            "title": "Funnel Sensitivity Controls",
            "content_types": ["ALL", "Short-form Video", "Long-form Video", "Livestream", "Static / Carousel", "Newsletter / Article"],
            "monetization_overlays": ["ALL", "ADS_ONLY", "SUBSCRIPTIONS", "SPONSORSHIPS", "COMMERCE"]
        },
        "section_e": {
            "title": "Download Sample Data",
            "action_label": "Export Calibrated Event Stream",
            "description": "Download 500-sample event feed of synthetic post impressions, watch time, CTR, and conversions.",
            "download_formats": ["CSV", "JSON"]
        }
    }

@app.get("/api/geo-attention")
def get_geo_attention():
    return engine.get_geojson()

@app.get("/api/platform-benchmarks")
def get_platform_benchmarks():
    return {
        "platforms": engine.get_platform_benchmarks()
    }

@app.post("/api/simulate")
def run_simulation(params: SimulationParams):
    metrics = AttentionSimulator.calculate_metrics(params)
    trajectory = AttentionSimulator.generate_time_to_revenue_trajectory(params, months=12)
    tradeoff_curve = AttentionSimulator.generate_ad_load_tradeoff_curve(params)
    tier_split = AttentionSimulator.generate_creator_tier_split(params)

    return {
        "params": params.model_dump(),
        "metrics": metrics,
        "trajectory": trajectory,
        "tradeoff_curve": tradeoff_curve,
        "tier_split": tier_split
    }

@app.get("/api/sample-data")
def download_sample_data(format: str = Query(default="json", pattern="^(json|csv)$")):
    """
    Generates synthetic event-level dataset of post impressions, watch time, CTR, and conversion events.
    """
    df = SyntheticStreamAdapter.generate_events(n_samples=500)
    
    if format == "csv":
        output = io.StringIO()
        df.to_csv(output, index=False)
        output.seek(0)
        return StreamingResponse(
            io.BytesIO(output.getvalue().encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=creator_distribution_funnel_sample_data.csv"}
        )
    else:
        return Response(
            content=df.to_json(orient="records", indent=2),
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=creator_distribution_funnel_sample_data.json"}
        )

@app.get("/api/mock-fallback")
def get_mock_fallback_data():
    """
    Full offline backup payload satisfying the Real Rails Zero-Downtime Rule.
    """
    default_sim_params = SimulationParams()
    return {
        "metadata": get_metadata(),
        "sidebar": get_sidebar_intelligence(),
        "funnel": CreatorFunnelEngine.get_funnel_stages(),
        "cohorts": CreatorFunnelEngine.get_cohort_comparison(),
        "platform_split": CreatorFunnelEngine.get_platform_split(),
        "personas": CreatorFunnelEngine.get_persona_explanations(),
        "gdelt_signals": GDELTAdapter.fetch_creator_economy_signals(),
        "geojson": engine.get_geojson(),
        "platforms": engine.get_platform_benchmarks(),
        "default_simulation": {
            "metrics": AttentionSimulator.calculate_metrics(default_sim_params),
            "trajectory": AttentionSimulator.generate_time_to_revenue_trajectory(default_sim_params),
            "tradeoff_curve": AttentionSimulator.generate_ad_load_tradeoff_curve(default_sim_params),
            "tier_split": AttentionSimulator.generate_creator_tier_split(default_sim_params)
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
