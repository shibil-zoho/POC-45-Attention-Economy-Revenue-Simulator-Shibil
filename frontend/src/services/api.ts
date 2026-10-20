import {
  SimulationParams,
  SimulationResult,
  GeoCollection,
  PlatformBenchmark,
  FunnelResult,
  CohortSets,
  PlatformSplitItem,
  GDELTData,
  PersonaExplanations,
  ContentType,
  MonetizationOverlay,
} from "@/types";
import mockDataRaw from "@/data/mock_data.json";
import { GDELTFrontendAdapter } from "./adapters/gdeltAdapter";
import { SyntheticStreamFrontendAdapter } from "./adapters/syntheticStreamAdapter";
import { FunnelFrontendAdapter } from "./adapters/funnelAdapter";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export interface DataSourceStatus {
  isLive: boolean;
  source: "LIVE_API" | "MOCK_FALLBACK";
  latencyMs: number;
  lastChecked: string;
}

export const defaultParams: SimulationParams = {
  dau: 250000,
  session_length_mins: 35.0,
  ad_load_per_10m: 2.5,
  cpm_usd: 15.0,
  fill_rate_pct: 88.0,
  creator_rev_share_pct: 55.0,
  churn_sensitivity: 0.18,
  growth_rate_monthly_pct: 5.0,
  content_type: "ALL",
  monetization_overlay: "ALL",
};

export async function fetchHealth(): Promise<DataSourceStatus> {
  const start = performance.now();
  try {
    const res = await fetch(`${API_BASE}/api/health`, {
      method: "GET",
      signal: AbortSignal.timeout(2000),
    });
    const latency = Math.round(performance.now() - start);
    if (res.ok) {
      return {
        isLive: true,
        source: "LIVE_API",
        latencyMs: latency,
        lastChecked: new Date().toLocaleTimeString(),
      };
    }
    throw new Error("API not healthy");
  } catch {
    return {
      isLive: false,
      source: "MOCK_FALLBACK",
      latencyMs: 0,
      lastChecked: new Date().toLocaleTimeString(),
    };
  }
}

export async function fetchFunnel(
  dau: number = 250000,
  cpm: number = 15.0,
  contentType: ContentType = "ALL",
  monetizationOverlay: MonetizationOverlay = "ALL"
): Promise<FunnelResult> {
  try {
    const res = await fetch(
      `${API_BASE}/api/funnel?dau=${dau}&cpm=${cpm}&content_type=${encodeURIComponent(
        contentType
      )}&monetization_overlay=${encodeURIComponent(monetizationOverlay)}`,
      { signal: AbortSignal.timeout(2500) }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch {}
  return FunnelFrontendAdapter.calculateFunnel(dau, cpm, contentType, monetizationOverlay);
}

export async function fetchCohorts(): Promise<CohortSets> {
  try {
    const res = await fetch(`${API_BASE}/api/cohorts`, {
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}
  return (mockDataRaw as any).cohorts;
}

export async function fetchPlatformSplit(): Promise<PlatformSplitItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/platform-split`, {
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      const data = await res.json();
      return data.platforms;
    }
  } catch {}
  return (mockDataRaw as any).platform_split;
}

export async function fetchGDELTSignals(): Promise<GDELTData> {
  try {
    const res = await fetch(`${API_BASE}/api/gdelt-signals`, {
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      const data = await res.json();
      return GDELTFrontendAdapter.parseGDELTSignals(data);
    }
  } catch {}
  return GDELTFrontendAdapter.getFallbackSignals();
}

export async function fetchPersonaExplanations(): Promise<PersonaExplanations> {
  try {
    const res = await fetch(`${API_BASE}/api/personas`, {
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}
  return (mockDataRaw as any).personas;
}

export async function fetchSidebarIntelligence(
  contentType: ContentType = "ALL",
  monetizationOverlay: MonetizationOverlay = "ALL"
): Promise<any> {
  try {
    const res = await fetch(
      `${API_BASE}/api/sidebar?content_type=${encodeURIComponent(
        contentType
      )}&monetization_overlay=${encodeURIComponent(monetizationOverlay)}`,
      { signal: AbortSignal.timeout(2500) }
    );
    if (res.ok) {
      return await res.json();
    }
  } catch {}
  return (mockDataRaw as any).sidebar;
}

export async function fetchGeoAttention(): Promise<GeoCollection> {
  try {
    const res = await fetch(`${API_BASE}/api/geo-attention`, {
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}
  return (mockDataRaw as any).geojson;
}

export async function fetchPlatformBenchmarks(): Promise<PlatformBenchmark[]> {
  try {
    const res = await fetch(`${API_BASE}/api/platform-benchmarks`, {
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      const data = await res.json();
      return data.platforms;
    }
  } catch {}
  return (mockDataRaw as any).platforms;
}

export async function simulateAttentionRevenue(
  params: SimulationParams
): Promise<SimulationResult> {
  try {
    const res = await fetch(`${API_BASE}/api/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {}
  return calculateLocalSimulation(params);
}

export function calculateLocalSimulation(params: SimulationParams): SimulationResult {
  const dau = params.dau;
  const baseMins = params.session_length_mins;
  const adLoad = params.ad_load_per_10m;
  const cpm = params.cpm_usd;
  const fillRate = params.fill_rate_pct / 100.0;
  const creatorShare = params.creator_rev_share_pct / 100.0;
  const sensitivity = params.churn_sensitivity;

  const optimalThreshold = 2.2;
  const excess = Math.max(0, adLoad - optimalThreshold);
  const fatiguePenaltyPct = Math.min(0.65, (Math.exp(excess * sensitivity) - 1.0) * 0.45);
  const effectiveSessionMins = Number((baseMins * (1.0 - fatiguePenaltyPct)).toFixed(2));
  const totalDailyAttentionHours = Number(((dau * effectiveSessionMins) / 60.0).toFixed(1));

  const adsPerUser = (effectiveSessionMins / 10.0) * adLoad * fillRate;
  const totalDailyImpressions = Math.round(dau * adsPerUser);

  const dailyGross = Number(((totalDailyImpressions / 1000.0) * cpm).toFixed(2));
  const dailyCreator = Number((dailyGross * creatorShare).toFixed(2));
  const dailyPlatform = Number((dailyGross - dailyCreator).toFixed(2));

  const monthlyGross = Number((dailyGross * 30.4).toFixed(2));
  const annualGross = Number((dailyGross * 365.25).toFixed(2));
  const annualCreator = Number((dailyCreator * 365.25).toFixed(2));
  const annualPlatform = Number((dailyPlatform * 365.25).toFixed(2));

  const effectiveHourlyYield =
    totalDailyAttentionHours > 0 ? Number((dailyGross / totalDailyAttentionHours).toFixed(4)) : 0;
  const yieldPer1000Hours = Number((effectiveHourlyYield * 1000.0).toFixed(2));
  const annualArpu = dau > 0 ? Number((annualGross / dau).toFixed(2)) : 0;
  const creatorAnnualArpu = dau > 0 ? Number((annualCreator / dau).toFixed(2)) : 0;

  const fatigueScore = Math.min(
    100.0,
    Number(((adLoad / 5.5) * 60.0 + fatiguePenaltyPct * 100.0).toFixed(1))
  );
  const fatigueStatus =
    fatigueScore < 35
      ? "OPTIMAL_YIELD"
      : fatigueScore < 65
      ? "MODERATE_FRICTION"
      : "HIGH_CHURN_ZONE";

  const metrics = {
    dau,
    session_length_mins: baseMins,
    effective_session_mins: effectiveSessionMins,
    session_time_loss_pct: Number((fatiguePenaltyPct * 100).toFixed(1)),
    total_daily_attention_hours: totalDailyAttentionHours,
    total_daily_impressions: totalDailyImpressions,
    daily_gross_revenue: dailyGross,
    daily_creator_payout: dailyCreator,
    daily_platform_margin: dailyPlatform,
    monthly_gross_revenue: monthlyGross,
    annual_gross_revenue: annualGross,
    annual_creator_payout: annualCreator,
    annual_platform_margin: annualPlatform,
    effective_hourly_yield_usd: effectiveHourlyYield,
    yield_per_1000_hours_usd: yieldPer1000Hours,
    annual_arpu_usd: annualArpu,
    creator_annual_arpu_usd: creatorAnnualArpu,
    fatigue_risk_score: fatigueScore,
    fatigue_status: fatigueStatus as any,
    creator_rev_share_pct: params.creator_rev_share_pct,
    platform_take_rate_pct: Number((100.0 - params.creator_rev_share_pct).toFixed(1)),
  };

  // Trajectory 12 months
  const trajectory = [];
  let cumGross = 0;
  let cumCreator = 0;
  let cumPlatform = 0;
  let currentDau = dau;
  const growth = params.growth_rate_monthly_pct / 100.0;

  for (let m = 1; m <= 12; m++) {
    if (m > 1) currentDau = currentDau * (1.0 + growth);
    const mDailyImpressions = currentDau * adsPerUser;
    const mDailyGross = (mDailyImpressions / 1000.0) * cpm;
    const mGross = Number((mDailyGross * 30.4).toFixed(2));
    const mCreator = Number((mGross * creatorShare).toFixed(2));
    const mPlatform = Number((mGross - mCreator).toFixed(2));
    cumGross += mGross;
    cumCreator += mCreator;
    cumPlatform += mPlatform;

    trajectory.push({
      month: `M${String(m).padStart(2, "0")}`,
      month_num: m,
      projected_dau: Math.round(currentDau),
      monthly_attention_hours: Math.round(((currentDau * effectiveSessionMins) / 60.0) * 30.4),
      monthly_gross_revenue_usd: mGross,
      monthly_creator_payout_usd: mCreator,
      monthly_platform_margin_usd: mPlatform,
      cumulative_gross_revenue_usd: Number(cumGross.toFixed(2)),
      cumulative_creator_payout_usd: Number(cumCreator.toFixed(2)),
      cumulative_platform_margin_usd: Number(cumPlatform.toFixed(2)),
      monthly_impressions: Math.round(mDailyImpressions * 30.4),
    });
  }

  // Tradeoff curve
  const tradeoffDensities = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0];
  let maxRev = 0;
  let optD = 2.0;
  const prelim = tradeoffDensities.map((d) => {
    const ex = Math.max(0, d - optimalThreshold);
    const pen = Math.min(0.65, (Math.exp(ex * sensitivity) - 1.0) * 0.45);
    const effMins = baseMins * (1.0 - pen);
    const imps = dau * (effMins / 10.0) * d * fillRate;
    const gross = (imps / 1000.0) * cpm;
    if (gross > maxRev) {
      maxRev = gross;
      optD = d;
    }
    return { d, effMins, pen, gross };
  });

  const tradeoff_curve = prelim.map(({ d, effMins, pen, gross }) => {
    const creatorP = gross * creatorShare;
    const platformP = gross - creatorP;
    const fScore = Math.min(100.0, (d / 5.5) * 60.0 + pen * 100.0);
    return {
      ad_load_per_10m: d,
      effective_session_mins: Number(effMins.toFixed(2)),
      daily_gross_revenue_usd: Math.round(gross),
      daily_creator_payout_usd: Math.round(creatorP),
      daily_platform_margin_usd: Math.round(platformP),
      fatigue_risk_score: Number(fScore.toFixed(1)),
      session_loss_pct: Number((pen * 100).toFixed(1)),
      is_revenue_maximizing_point: d === optD,
      state_indicator:
        d === optD
          ? "OPTIMAL_REVENUE_MAX"
          : d < optD
          ? "UNDER_MONETIZED_HEADROOM"
          : "HIGH_ATTRITION_LOSS",
    };
  });

  const tier_split = {
    total_creator_annual_payout_usd: annualCreator,
    platform_annual_take_usd: annualPlatform,
    creator_rev_share_pct: params.creator_rev_share_pct,
    platform_take_rate_pct: Number((100.0 - params.creator_rev_share_pct).toFixed(1)),
    tiers: [
      {
        tier_name: "Superstar Top 1%",
        creator_share_pct: 1.0,
        attention_captured_pct: 68.0,
        payout_allocation_usd: Math.round(annualCreator * 0.72),
        avg_annual_earnings_estimate: Math.round((annualCreator * 0.72) / (dau * 0.001 * 0.01)),
        leverage_classification: "Dominant Monopoly Leverage",
      },
      {
        tier_name: "Top Network 5%",
        creator_share_pct: 5.0,
        attention_captured_pct: 21.0,
        payout_allocation_usd: Math.round(annualCreator * 0.18),
        avg_annual_earnings_estimate: Math.round((annualCreator * 0.18) / (dau * 0.001 * 0.05)),
        leverage_classification: "Full-Time Institutional Creator",
      },
      {
        tier_name: "Mid-Tier 20%",
        creator_share_pct: 20.0,
        attention_captured_pct: 8.0,
        payout_allocation_usd: Math.round(annualCreator * 0.075),
        avg_annual_earnings_estimate: Math.round((annualCreator * 0.075) / (dau * 0.001 * 0.2)),
        leverage_classification: "Side-Hustle / Niche Community Authority",
      },
      {
        tier_name: "Emerging Long-Tail 74%",
        creator_share_pct: 74.0,
        attention_captured_pct: 3.0,
        payout_allocation_usd: Math.round(annualCreator * 0.025),
        avg_annual_earnings_estimate: Math.round((annualCreator * 0.025) / (dau * 0.001 * 0.74)),
        leverage_classification: "Zero Leverage / Algorithmic Feedstock",
      },
    ],
  };

  return {
    params,
    metrics,
    trajectory,
    tradeoff_curve,
    tier_split,
  };
}

export async function downloadSampleDataBlob(
  format: "csv" | "json"
): Promise<{ blob: Blob; filename: string }> {
  try {
    const res = await fetch(`${API_BASE}/api/sample-data?format=${format}`);
    if (res.ok) {
      const blob = await res.blob();
      return {
        blob,
        filename: `creator_distribution_funnel_sample_data.${format}`,
      };
    }
  } catch {}

  // Instant offline client fallback
  const events = SyntheticStreamFrontendAdapter.generateEvents(300);
  const content =
    format === "csv"
      ? SyntheticStreamFrontendAdapter.toCSV(events)
      : JSON.stringify(events, null, 2);
  const blob = new Blob([content], {
    type: format === "csv" ? "text/csv" : "application/json",
  });
  return {
    blob,
    filename: `creator_distribution_funnel_sample_data.${format}`,
  };
}
