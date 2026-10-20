export type ContentType =
  | "ALL"
  | "Short-form Video"
  | "Long-form Video"
  | "Livestream"
  | "Static / Carousel"
  | "Newsletter / Article";

export type MonetizationOverlay =
  | "ALL"
  | "ADS_ONLY"
  | "SUBSCRIPTIONS"
  | "SPONSORSHIPS"
  | "COMMERCE";

export type PersonaType = "all" | "everyday_viewers" | "builders" | "allocators";

export interface FunnelStage {
  id: string;
  stage_number: number;
  name: string;
  label: string;
  count: number;
  secondary_count?: number;
  unit: string;
  secondary_unit?: string;
  drop_off_pct: number;
  conversion_to_next_pct: number;
  metric_highlight: string;
  description: string;
  rail_mechanic: string;
  leakage_factor: string;
}

export interface FunnelResult {
  content_type: string;
  monetization_overlay: string;
  total_gross_revenue_usd: number;
  creator_payout_usd: number;
  platform_take_usd: number;
  creator_take_rate_pct: number;
  platform_take_rate_pct: number;
  effective_funnel_cpm: number;
  overall_funnel_conversion_pct: number;
  stages: FunnelStage[];
}

export interface CohortItem {
  cohort_name: string;
  creator_description?: string;
  source_description?: string;
  impression_volume: number;
  avg_watch_time_sec: number;
  ctr_pct: number;
  conversion_rate_pct: number;
  creator_take_rate_pct: number;
  platform_take_rate_pct: number;
  avg_post_yield_usd: number;
  retention_score: number;
  leverage_tier: string;
}

export interface CohortSets {
  creator_tier_cohorts: CohortItem[];
  traffic_source_cohorts: CohortItem[];
}

export interface PlatformSplitItem {
  platform: string;
  format: string;
  share_of_impressions_pct: number;
  share_of_watch_time_pct: number;
  avg_watch_sec: number;
  avg_ctr_pct: number;
  avg_conversion_rate_pct: number;
  effective_cpm_usd: number;
  creator_rev_share_pct: number;
  platform_take_rate_pct: number;
  gdelt_sentiment_tone: number;
  algorithmic_control_rating: string;
  creator_sovereignty_score: number;
}

export interface GDELTSignal {
  signal: string;
  gdelt_event_code: string;
  intensity_score: number;
  description: string;
}

export interface GDELTData {
  source: string;
  query: string;
  coverage_window: string;
  total_global_articles_monitored: number;
  creator_rail_attention_share_pct: number;
  average_global_tone: number;
  is_live: boolean;
  platform_media_velocity: {
    platform: string;
    media_volume_score: number;
    tone_score: number;
    velocity_trend: string;
    key_narrative_themes: string[];
  }[];
  macro_attention_signals: GDELTSignal[];
  live_articles_sample: {
    title: string;
    url: string;
    domain: string;
    seendate: string;
  }[];
}

export interface PersonaInsight {
  headline: string;
  body: string;
}

export interface PersonaSection {
  title: string;
  badge: string;
  tagline: string;
  insights: PersonaInsight[];
}

export interface PersonaExplanations {
  everyday_viewers: PersonaSection;
  builders: PersonaSection;
  allocators: PersonaSection;
}

export interface SyntheticPostEvent {
  post_id: string;
  data_provenance: string;
  creator_tier: string;
  platform: string;
  content_type: string;
  cohort: string;
  post_impressions: number;
  avg_watch_time_sec: number;
  total_watch_time_hours: number;
  completion_rate_pct: number;
  ctr_pct: number;
  clicks_delivered: number;
  conversion_events: number;
  conversion_rate_pct: number;
  effective_cpm_usd: number;
  gross_revenue_usd: number;
  creator_rev_share_pct: number;
  creator_payout_usd: number;
  platform_take_usd: number;
}

export interface SimulationParams {
  dau: number;
  session_length_mins: number;
  ad_load_per_10m: number;
  cpm_usd: number;
  fill_rate_pct: number;
  creator_rev_share_pct: number;
  churn_sensitivity: number;
  growth_rate_monthly_pct: number;
  content_type?: ContentType;
  monetization_overlay?: MonetizationOverlay;
}

export interface SimulationMetrics {
  dau: number;
  session_length_mins: number;
  effective_session_mins: number;
  session_time_loss_pct: number;
  total_daily_attention_hours: number;
  total_daily_impressions: number;
  daily_gross_revenue: number;
  daily_creator_payout: number;
  daily_platform_margin: number;
  monthly_gross_revenue: number;
  annual_gross_revenue: number;
  annual_creator_payout: number;
  annual_platform_margin: number;
  effective_hourly_yield_usd: number;
  yield_per_1000_hours_usd: number;
  annual_arpu_usd: number;
  creator_annual_arpu_usd: number;
  fatigue_risk_score: number;
  fatigue_status: "OPTIMAL_YIELD" | "MODERATE_FRICTION" | "HIGH_CHURN_ZONE";
  creator_rev_share_pct: number;
  platform_take_rate_pct: number;
}

export interface TrajectoryPoint {
  month: string;
  month_num: number;
  projected_dau: number;
  monthly_attention_hours: number;
  monthly_gross_revenue_usd: number;
  monthly_creator_payout_usd: number;
  monthly_platform_margin_usd: number;
  cumulative_gross_revenue_usd: number;
  cumulative_creator_payout_usd: number;
  cumulative_platform_margin_usd: number;
  monthly_impressions: number;
}

export interface TradeoffPoint {
  ad_load_per_10m: number;
  effective_session_mins: number;
  daily_gross_revenue_usd: number;
  daily_creator_payout_usd: number;
  daily_platform_margin_usd: number;
  fatigue_risk_score: number;
  session_loss_pct: number;
  is_revenue_maximizing_point: boolean;
  state_indicator: string;
}

export interface CreatorTier {
  tier_name: string;
  creator_share_pct: number;
  attention_captured_pct: number;
  payout_allocation_usd: number;
  avg_annual_earnings_estimate: number;
  leverage_classification: string;
}

export interface CreatorTierSplit {
  total_creator_annual_payout_usd: number;
  platform_annual_take_usd: number;
  creator_rev_share_pct: number;
  platform_take_rate_pct: number;
  tiers: CreatorTier[];
}

export interface SimulationResult {
  params: SimulationParams;
  metrics: SimulationMetrics;
  trajectory: TrajectoryPoint[];
  tradeoff_curve: TradeoffPoint[];
  tier_split: CreatorTierSplit;
}

export interface GeoFeatureProperty {
  id: string;
  country: string;
  region: string;
  internet_penetration_pct: number;
  daily_screen_time_mins: number;
  social_media_mins: number;
  avg_cpm_usd: number;
  cpm_pct_vs_median: number;
  estimated_annual_yield_per_user_usd: number;
  yield_per_1000_attention_hours_usd: number;
  creator_payout_rate_pct: number;
  ad_tolerance_index: number;
  digital_ad_spend_per_user_usd: number;
}

export interface GeoFeature {
  type: string;
  id: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: GeoFeatureProperty;
}

export interface GeoCollection {
  type: string;
  metadata: {
    rail_category: string;
    title: string;
    primary_sources: string[];
    total_regions: number;
    global_median_cpm: number;
    highest_yield_region: string;
  };
  features: GeoFeature[];
}

export interface PlatformBenchmark {
  platform: string;
  primary_format: string;
  avg_session_min: number;
  avg_ad_load_per_10m: number;
  avg_cpm_usd: number;
  creator_rev_share_pct: number;
  platform_take_rate_pct: number;
  governance_model: string;
  attention_rail_control: string;
  monetization_efficiency_score: number;
}
