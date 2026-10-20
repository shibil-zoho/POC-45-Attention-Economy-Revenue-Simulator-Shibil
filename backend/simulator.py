"""
Real Rails Attention Economy Simulator
Core Modeling:
- Time-to-revenue trajectory
- Ad load fatigue and session duration trade-offs
- Platform take-rate vs Creator rev-share distribution
- Sensitivity analytics
"""

import math
from typing import Dict, Any, List
from pydantic import BaseModel, Field

class SimulationParams(BaseModel):
    dau: int = Field(default=250000, description="Daily Active Users", ge=1000, le=100000000)
    session_length_mins: float = Field(default=35.0, description="Average daily session length in minutes", ge=5.0, le=240.0)
    ad_load_per_10m: float = Field(default=2.5, description="Ad impressions per 10 minutes of session", ge=0.2, le=8.0)
    cpm_usd: float = Field(default=15.0, description="Average Cost Per Mille ($)", ge=0.5, le=100.0)
    fill_rate_pct: float = Field(default=88.0, description="Ad inventory fill rate %", ge=20.0, le=100.0)
    creator_rev_share_pct: float = Field(default=55.0, description="Creator revenue share %", ge=0.0, le=95.0)
    churn_sensitivity: float = Field(default=0.18, description="Fatigue churn elasticity coefficient", ge=0.01, le=0.60)
    growth_rate_monthly_pct: float = Field(default=5.0, description="Monthly active user growth %", ge=-10.0, le=50.0)

class AttentionSimulator:
    """
    Mathematical simulator for the Attention Economy Rail.
    Simulates how human attention translates into monetized auction impressions
    and how platform intermediaries extract rent vs distributing yield.
    """

    @staticmethod
    def calculate_metrics(params: SimulationParams) -> Dict[str, Any]:
        dau = params.dau
        base_mins = params.session_length_mins
        ad_load = params.ad_load_per_10m
        cpm = params.cpm_usd
        fill_rate = params.fill_rate_pct / 100.0
        creator_share = params.creator_rev_share_pct / 100.0
        sensitivity = params.churn_sensitivity

        # Ad fatigue function:
        # Optimal ad density is around 2.0-2.4 ads per 10 mins.
        # Excess density leads to session decay and churn penalty.
        optimal_threshold = 2.2
        excess_ad_load = max(0.0, ad_load - optimal_threshold)
        fatigue_penalty_pct = min(0.65, (math.exp(excess_ad_load * sensitivity) - 1.0) * 0.45)
        
        effective_session_mins = round(base_mins * (1.0 - fatigue_penalty_pct), 2)
        total_daily_attention_hours = round((dau * effective_session_mins) / 60.0, 1)

        # Impressions delivered
        ads_per_user_daily = (effective_session_mins / 10.0) * ad_load * fill_rate
        total_daily_impressions = round(dau * ads_per_user_daily, 0)

        # Revenue figures
        daily_gross_revenue = round((total_daily_impressions / 1000.0) * cpm, 2)
        daily_creator_payout = round(daily_gross_revenue * creator_share, 2)
        daily_platform_margin = round(daily_gross_revenue - daily_creator_payout, 2)

        monthly_gross_revenue = round(daily_gross_revenue * 30.4, 2)
        annual_gross_revenue = round(daily_gross_revenue * 365.25, 2)

        annual_creator_payout = round(daily_creator_payout * 365.25, 2)
        annual_platform_margin = round(daily_platform_margin * 365.25, 2)

        # Intelligence Metrics
        effective_hourly_yield = round(
            (daily_gross_revenue / total_daily_attention_hours) if total_daily_attention_hours > 0 else 0.0, 
            4
        )
        yield_per_1000_hours = round(effective_hourly_yield * 1000.0, 2)
        arpu_annual = round(annual_gross_revenue / dau, 2) if dau > 0 else 0.0
        creator_arpu_annual = round(annual_creator_payout / dau, 2) if dau > 0 else 0.0

        # Fatigue risk score (0-100)
        fatigue_risk_score = round(min(100.0, (ad_load / 5.5) * 60.0 + (fatigue_penalty_pct * 100.0)), 1)
        fatigue_status = "OPTIMAL_YIELD" if fatigue_risk_score < 35 else ("MODERATE_FRICTION" if fatigue_risk_score < 65 else "HIGH_CHURN_ZONE")

        return {
            "dau": dau,
            "session_length_mins": base_mins,
            "effective_session_mins": effective_session_mins,
            "session_time_loss_pct": round(fatigue_penalty_pct * 100, 1),
            "total_daily_attention_hours": total_daily_attention_hours,
            "total_daily_impressions": total_daily_impressions,
            "daily_gross_revenue": daily_gross_revenue,
            "daily_creator_payout": daily_creator_payout,
            "daily_platform_margin": daily_platform_margin,
            "monthly_gross_revenue": monthly_gross_revenue,
            "annual_gross_revenue": annual_gross_revenue,
            "annual_creator_payout": annual_creator_payout,
            "annual_platform_margin": annual_platform_margin,
            "effective_hourly_yield_usd": effective_hourly_yield,
            "yield_per_1000_hours_usd": yield_per_1000_hours,
            "annual_arpu_usd": arpu_annual,
            "creator_annual_arpu_usd": creator_arpu_annual,
            "fatigue_risk_score": fatigue_risk_score,
            "fatigue_status": fatigue_status,
            "creator_rev_share_pct": params.creator_rev_share_pct,
            "platform_take_rate_pct": round(100.0 - params.creator_rev_share_pct, 1)
        }

    @classmethod
    def generate_time_to_revenue_trajectory(cls, params: SimulationParams, months: int = 12) -> List[Dict[str, Any]]:
        """
        Projects monthly compounding growth:
        - Audience expansion
        - Cumulative platform revenue
        - Cumulative creator pool payouts
        - Daily attention bandwidth
        """
        base_metrics = cls.calculate_metrics(params)
        monthly_growth = params.growth_rate_monthly_pct / 100.0
        
        trajectory = []
        cumulative_gross = 0.0
        cumulative_creator = 0.0
        cumulative_platform = 0.0

        current_dau = float(params.dau)

        for m in range(1, months + 1):
            # Monthly compounding
            if m > 1:
                current_dau = current_dau * (1.0 + monthly_growth)
            
            scaled_params = params.model_copy(update={"dau": int(current_dau)})
            m_metrics = cls.calculate_metrics(scaled_params)
            
            monthly_gross = m_metrics["monthly_gross_revenue"]
            monthly_creator = round(monthly_gross * (params.creator_rev_share_pct / 100.0), 2)
            monthly_platform = round(monthly_gross - monthly_creator, 2)

            cumulative_gross += monthly_gross
            cumulative_creator += monthly_creator
            cumulative_platform += monthly_platform

            trajectory.append({
                "month": f"M{m:02d}",
                "month_num": m,
                "projected_dau": int(current_dau),
                "monthly_attention_hours": round(m_metrics["total_daily_attention_hours"] * 30.4, 0),
                "monthly_gross_revenue_usd": monthly_gross,
                "monthly_creator_payout_usd": monthly_creator,
                "monthly_platform_margin_usd": monthly_platform,
                "cumulative_gross_revenue_usd": round(cumulative_gross, 2),
                "cumulative_creator_payout_usd": round(cumulative_creator, 2),
                "cumulative_platform_margin_usd": round(cumulative_platform, 2),
                "monthly_impressions": round(m_metrics["total_daily_impressions"] * 30.4, 0)
            })

        return trajectory

    @classmethod
    def generate_ad_load_tradeoff_curve(cls, params: SimulationParams) -> List[Dict[str, Any]]:
        """
        Sweeps ad density from 0.5 to 7.5 ads per 10 minutes.
        Reveals the exact tipping point where incremental ads destroy session length
        causing total gross revenue to decline (Laffer curve of user attention).
        """
        test_densities = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0]
        results = []

        max_rev = 0.0
        optimal_density = 2.0

        # First pass to find peak
        temp_list = []
        for d in test_densities:
            sweep_params = params.model_copy(update={"ad_load_per_10m": d})
            res = cls.calculate_metrics(sweep_params)
            temp_list.append((d, res))
            if res["daily_gross_revenue"] > max_rev:
                max_rev = res["daily_gross_revenue"]
                optimal_density = d

        for d, res in temp_list:
            is_peak = (d == optimal_density)
            results.append({
                "ad_load_per_10m": d,
                "effective_session_mins": res["effective_session_mins"],
                "daily_gross_revenue_usd": res["daily_gross_revenue"],
                "daily_creator_payout_usd": res["daily_creator_payout"],
                "daily_platform_margin_usd": res["daily_platform_margin"],
                "fatigue_risk_score": res["fatigue_risk_score"],
                "session_loss_pct": res["session_time_loss_pct"],
                "is_revenue_maximizing_point": is_peak,
                "state_indicator": "Maximized Yield" if is_peak else ("Under-Monetized" if d < optimal_density else "Fatigue Destruction Zone")
            })

        return results

    @classmethod
    def generate_creator_tier_split(cls, params: SimulationParams) -> Dict[str, Any]:
        """
        Breaks down creator distribution across economic tiers:
        - Emerging Creators (Bottom 70% creators, 15% attention share)
        - Mid-Tier Creators (20% creators, 30% attention share)
        - Elite Creators (9% creators, 40% attention share)
        - Superstar Top 1% (1% creators, 15% attention share)
        """
        base_metrics = cls.calculate_metrics(params)
        annual_creator_pool = base_metrics["annual_creator_payout"]
        annual_platform_pool = base_metrics["annual_platform_margin"]

        tiers = [
            {
                "tier_name": "Emerging Long-Tail",
                "creator_share_pct": 70.0,
                "attention_captured_pct": 15.0,
                "payout_allocation_usd": round(annual_creator_pool * 0.15, 2),
                "avg_annual_earnings_estimate": round((annual_creator_pool * 0.15) / max(1, (params.dau * 0.015 * 0.70)), 2),
                "leverage_classification": "Price-Taker (No negotiating leverage)"
            },
            {
                "tier_name": "Mid-Tier Sustained",
                "creator_share_pct": 20.0,
                "attention_captured_pct": 30.0,
                "payout_allocation_usd": round(annual_creator_pool * 0.30, 2),
                "avg_annual_earnings_estimate": round((annual_creator_pool * 0.30) / max(1, (params.dau * 0.015 * 0.20)), 2),
                "leverage_classification": "Platform-Dependent (Vulnerable to algorithm changes)"
            },
            {
                "tier_name": "Top Channel Network",
                "creator_share_pct": 9.0,
                "attention_captured_pct": 40.0,
                "payout_allocation_usd": round(annual_creator_pool * 0.40, 2),
                "avg_annual_earnings_estimate": round((annual_creator_pool * 0.40) / max(1, (params.dau * 0.015 * 0.09)), 2),
                "leverage_classification": "Brand Anchor (Direct sponsor deals + rev-share)"
            },
            {
                "tier_name": "Superstar Top 1%",
                "creator_share_pct": 1.0,
                "attention_captured_pct": 15.0,
                "payout_allocation_usd": round(annual_creator_pool * 0.15, 2),
                "avg_annual_earnings_estimate": round((annual_creator_pool * 0.15) / max(1, (params.dau * 0.015 * 0.01)), 2),
                "leverage_classification": "Multi-Platform Rail Hegemony"
            }
        ]

        return {
            "total_creator_annual_payout_usd": annual_creator_pool,
            "platform_annual_take_usd": annual_platform_pool,
            "creator_rev_share_pct": params.creator_rev_share_pct,
            "platform_take_rate_pct": base_metrics["platform_take_rate_pct"],
            "tiers": tiers
        }
