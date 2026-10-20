import { FunnelResult, FunnelStage, ContentType, MonetizationOverlay } from "@/types";

export class FunnelFrontendAdapter {
  static calculateFunnel(
    dau: number = 250000,
    cpm: number = 15.0,
    contentType: ContentType = "ALL",
    monetizationOverlay: MonetizationOverlay = "ALL"
  ): FunnelResult {
    const ctMult: Record<string, { imp: number; watchSec: number; ctr: number; conv: number; cpmAdj: number }> = {
      ALL: { imp: 1.0, watchSec: 48.0, ctr: 2.8, conv: 2.1, cpmAdj: 1.0 },
      "Short-form Video": { imp: 2.4, watchSec: 32.0, ctr: 2.1, conv: 1.4, cpmAdj: 0.75 },
      "Long-form Video": { imp: 0.65, watchSec: 580.0, ctr: 4.5, conv: 2.8, cpmAdj: 1.45 },
      Livestream: { imp: 0.35, watchSec: 2400.0, ctr: 1.2, conv: 3.6, cpmAdj: 1.20 },
      "Static / Carousel": { imp: 1.3, watchSec: 14.0, ctr: 1.8, conv: 1.5, cpmAdj: 0.65 },
      "Newsletter / Article": { imp: 0.25, watchSec: 210.0, ctr: 6.8, conv: 5.2, cpmAdj: 1.85 },
    };

    const cfg = ctMult[contentType] || ctMult["ALL"];

    // Stage 1: Post Impressions
    const stage1Impressions = Math.round(dau * 4.2 * cfg.imp);

    // Stage 2: Engaged Watch Time
    const watchRetentionPct = contentType === "Short-form Video" ? 58.0 : 42.5;
    const engagedViews = Math.round(stage1Impressions * (watchRetentionPct / 100.0));
    const avgWatchTimeSec = cfg.watchSec;
    const totalWatchHours = Number(((engagedViews * avgWatchTimeSec) / 3600.0).toFixed(1));

    // Stage 3: Click-Through Rate
    const ctrPct = cfg.ctr;
    const clicks = Math.round(engagedViews * (ctrPct / 100.0));

    // Stage 4: Conversion Events
    const convRatePct = cfg.conv;
    const conversions = Math.round(clicks * (convRatePct / 100.0));

    // Stage 5: Monetization
    const effectiveCpm = Number((cpm * cfg.cpmAdj).toFixed(2));
    const adRevenue = (stage1Impressions / 1000.0) * effectiveCpm;
    const subRevenue = conversions * 8.50;
    const sponsorshipRevenue = (stage1Impressions / 1000.0) * 12.00;
    const commerceRevenue = conversions * 24.00;

    let grossRevenue = 0;
    let creatorSharePct = 55.0;

    switch (monetizationOverlay) {
      case "ADS_ONLY":
        grossRevenue = adRevenue;
        creatorSharePct = 52.0;
        break;
      case "SUBSCRIPTIONS":
        grossRevenue = subRevenue;
        creatorSharePct = 85.0;
        break;
      case "SPONSORSHIPS":
        grossRevenue = sponsorshipRevenue;
        creatorSharePct = 90.0;
        break;
      case "COMMERCE":
        grossRevenue = commerceRevenue;
        creatorSharePct = 70.0;
        break;
      default:
        grossRevenue = adRevenue + subRevenue + sponsorshipRevenue + commerceRevenue;
        creatorSharePct = 58.0;
        break;
    }

    const creatorPayout = Number((grossRevenue * (creatorSharePct / 100.0)).toFixed(2));
    const platformTake = Number((grossRevenue - creatorPayout).toFixed(2));

    const stages: FunnelStage[] = [
      {
        id: "stage_1_impressions",
        stage_number: 1,
        name: "Post Impressions",
        label: "Algorithmic Discovery",
        count: stage1Impressions,
        unit: "Impressions",
        drop_off_pct: 0.0,
        conversion_to_next_pct: watchRetentionPct,
        metric_highlight: `${stage1Impressions.toLocaleString()} Eyeballs`,
        description: "Total post appearances rendered in algorithmic user feeds across platforms.",
        rail_mechanic: "Gatekept by recommendation vectors and private ad auction bid density.",
        leakage_factor: "95% of creator posts never clear the initial feed discovery threshold.",
      },
      {
        id: "stage_2_watch_time",
        stage_number: 2,
        name: "Engaged Watch Time",
        label: "Attention Retention",
        count: engagedViews,
        secondary_count: totalWatchHours,
        unit: "Engaged Views",
        secondary_unit: "Hours of Focus",
        drop_off_pct: Number((100.0 - watchRetentionPct).toFixed(1)),
        conversion_to_next_pct: ctrPct,
        metric_highlight: `${totalWatchHours.toLocaleString()}h (${avgWatchTimeSec}s avg)`,
        description: "Users who maintained focus beyond 3 seconds and consumed meaningful narrative bandwidth.",
        rail_mechanic: "Platform algorithmic ranking rewards completion rate over creator compensation.",
        leakage_factor: `${(100.0 - watchRetentionPct).toFixed(1)}% scroll away within the first 2 seconds.`,
      },
      {
        id: "stage_3_ctr",
        stage_number: 3,
        name: "Click-Through (CTR)",
        label: "Direct Interaction",
        count: clicks,
        unit: "Clicks / Tap-throughs",
        drop_off_pct: Number((100.0 - ctrPct).toFixed(1)),
        conversion_to_next_pct: convRatePct,
        metric_highlight: `${clicks.toLocaleString()} Clicks (${ctrPct}% CTR)`,
        description: "Active user intent expressed via link clicks, bio navigation, or profile visits.",
        rail_mechanic: "Walled gardens actively penalize external links that bleed attention off-platform.",
        leakage_factor: "External link suppression reduces reach by up to 60% on Meta and X.",
      },
      {
        id: "stage_4_conversions",
        stage_number: 4,
        name: "Conversion Events",
        label: "High-Intent Actions",
        count: conversions,
        unit: "Conversions",
        drop_off_pct: Number((100.0 - convRatePct).toFixed(1)),
        conversion_to_next_pct: 100.0,
        metric_highlight: `${conversions.toLocaleString()} Actions (${convRatePct}% Conv)`,
        description: "Completed transactions: paid memberships, digital product sales, or sponsored lead signups.",
        rail_mechanic: "Conversion events build direct creator equity vs ephemeral platform engagement.",
        leakage_factor: "Payment processors and app store duopolies extract 15-30% in-app fees.",
      },
      {
        id: "stage_5_monetization",
        stage_number: 5,
        name: "Economic Gross Yield",
        label: "Liquid Value Realization",
        count: Math.round(grossRevenue),
        secondary_count: Math.round(creatorPayout),
        unit: "USD Gross Liquidity",
        secondary_unit: "USD Creator Payout",
        drop_off_pct: Number((100.0 - creatorSharePct).toFixed(1)),
        conversion_to_next_pct: 100.0,
        metric_highlight: `$${Math.round(grossRevenue).toLocaleString()} ($${Math.round(creatorPayout).toLocaleString()} Creator)`,
        description: "Total financial yield generated from attention auctioned and creator equity realized.",
        rail_mechanic: "Intermediary rent extraction sets the ceiling on creator career sustainability.",
        leakage_factor: `$${Math.round(platformTake).toLocaleString()} (${(100.0 - creatorSharePct).toFixed(0)}%) retained as platform intermediary rent.`,
      },
    ];

    return {
      content_type: contentType,
      monetization_overlay: monetizationOverlay,
      total_gross_revenue_usd: Math.round(grossRevenue),
      creator_payout_usd: Math.round(creatorPayout),
      platform_take_usd: Math.round(platformTake),
      creator_take_rate_pct: creatorSharePct,
      platform_take_rate_pct: Number((100.0 - creatorSharePct).toFixed(1)),
      effective_funnel_cpm: effectiveCpm,
      overall_funnel_conversion_pct: stage1Impressions > 0 ? Number(((conversions / stage1Impressions) * 100.0).toFixed(4)) : 0,
      stages,
    };
  }
}
