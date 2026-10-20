import { SyntheticPostEvent } from "@/types";

export class SyntheticStreamFrontendAdapter {
  private static platforms = [
    { name: "YouTube", baseCpm: 16.5, revShare: 55.0, avgCtr: 4.2, contentTypes: ["Long-form Video", "Short-form Video", "Livestream"] },
    { name: "TikTok", baseCpm: 8.5, revShare: 12.0, avgCtr: 2.1, contentTypes: ["Short-form Video", "Livestream"] },
    { name: "Meta / Instagram", baseCpm: 12.8, revShare: 18.0, avgCtr: 1.8, contentTypes: ["Short-form Video", "Static / Carousel"] },
    { name: "Twitch", baseCpm: 14.2, revShare: 50.0, avgCtr: 1.2, contentTypes: ["Livestream"] },
    { name: "X / Twitter", baseCpm: 7.2, revShare: 25.0, avgCtr: 1.5, contentTypes: ["Static / Carousel", "Short-form Video", "Newsletter / Article"] },
    { name: "Substack", baseCpm: 28.0, revShare: 90.0, avgCtr: 6.8, contentTypes: ["Newsletter / Article"] }
  ];

  private static creatorTiers = [
    { tier: "Superstar (1M+)", weight: 0.04, minImp: 350000, maxImp: 2500000, watchMult: 1.35, convRate: 0.032 },
    { tier: "Top Creator (250k-1M)", weight: 0.12, minImp: 80000, maxImp: 450000, watchMult: 1.15, convRate: 0.024 },
    { tier: "Mid-Tier (10k-250k)", weight: 0.34, minImp: 15000, maxImp: 95000, watchMult: 1.0, convRate: 0.018 },
    { tier: "Emerging (<10k)", weight: 0.50, minImp: 1200, maxImp: 18000, watchMult: 0.85, convRate: 0.012 }
  ];

  private static contentTypeSpecs: Record<string, { durationSec: number; completionRate: number; cpmFactor: number }> = {
    "Short-form Video": { durationSec: 32.0, completionRate: 0.65, cpmFactor: 0.75 },
    "Long-form Video": { durationSec: 620.0, completionRate: 0.38, cpmFactor: 1.40 },
    "Livestream": { durationSec: 3800.0, completionRate: 0.22, cpmFactor: 1.10 },
    "Static / Carousel": { durationSec: 14.0, completionRate: 0.78, cpmFactor: 0.60 },
    "Newsletter / Article": { durationSec: 210.0, completionRate: 0.52, cpmFactor: 1.80 }
  };

  private static cohorts = ["Organic Reach", "Algorithmic Recommended", "Paid / Boosted"];

  /**
   * Generates a statistically-sound dataset of synthetic post events.
   */
  static generateEvents(count: number = 250): SyntheticPostEvent[] {
    const events: SyntheticPostEvent[] = [];

    for (let i = 1; i <= count; i++) {
      // Pick tier
      const rTier = Math.random();
      let cumulative = 0;
      let tier = this.creatorTiers[this.creatorTiers.length - 1];
      for (const t of this.creatorTiers) {
        cumulative += t.weight;
        if (rTier <= cumulative) {
          tier = t;
          break;
        }
      }

      // Pick platform & content type
      const platform = this.platforms[Math.floor(Math.random() * this.platforms.length)];
      const contentType = platform.contentTypes[Math.floor(Math.random() * platform.contentTypes.length)];
      const spec = this.contentTypeSpecs[contentType];
      const cohort = this.cohorts[Math.floor(Math.random() * this.cohorts.length)];

      // 1. Post Impressions
      const impressions = Math.round(tier.minImp + Math.random() * (tier.maxImp - tier.minImp));

      // 2. Watch Time
      const avgWatchSec = Number((spec.durationSec * (0.8 + Math.random() * 0.4) * tier.watchMult).toFixed(1));
      const totalWatchHours = Number(((impressions * avgWatchSec) / 3600.0).toFixed(2));
      const completionRate = Number((Math.min(95, Math.max(10, spec.completionRate * 100 * (0.9 + Math.random() * 0.2)))).toFixed(1));

      // 3. CTR
      let ctrMult = 1.0;
      if (cohort === "Paid / Boosted") ctrMult = 1.3;
      if (cohort === "Organic Reach") ctrMult = 1.15;
      const ctrPct = Number((Math.max(0.4, (platform.avgCtr * ctrMult) + (Math.random() - 0.5) * 1.2)).toFixed(2));
      const clicks = Math.round(impressions * (ctrPct / 100.0));

      // 4. Conversion Events
      const convRatePct = Number((tier.convRate * 100 * (contentType === "Newsletter / Article" ? 1.25 : 1.0) * (0.8 + Math.random() * 0.4)).toFixed(2));
      const conversions = Math.round(clicks * (convRatePct / 100.0));

      // 5. Monetization
      const effectiveCpm = Number((platform.baseCpm * spec.cpmFactor * (0.9 + Math.random() * 0.25)).toFixed(2));
      const grossRevenue = Number(((impressions / 1000.0) * effectiveCpm + conversions * 2.5).toFixed(2));
      const creatorRevShare = platform.revShare;
      const creatorPayout = Number((grossRevenue * (creatorRevShare / 100.0)).toFixed(2));
      const platformTake = Number((grossRevenue - creatorPayout).toFixed(2));

      events.push({
        post_id: `POST-2026-${10000 + i}`,
        data_provenance: "SYNTHETIC_CALIBRATED_EVENT_STREAM",
        creator_tier: tier.tier,
        platform: platform.name,
        content_type: contentType,
        cohort,
        post_impressions: impressions,
        avg_watch_time_sec: avgWatchSec,
        total_watch_time_hours: totalWatchHours,
        completion_rate_pct: completionRate,
        ctr_pct: ctrPct,
        clicks_delivered: clicks,
        conversion_events: conversions,
        conversion_rate_pct: convRatePct,
        effective_cpm_usd: effectiveCpm,
        gross_revenue_usd: grossRevenue,
        creator_rev_share_pct: creatorRevShare,
        creator_payout_usd: creatorPayout,
        platform_take_usd: platformTake,
      });
    }

    return events;
  }

  /**
   * Converts events array to CSV string.
   */
  static toCSV(events: SyntheticPostEvent[]): string {
    if (!events.length) return "";
    const headers = Object.keys(events[0]).join(",");
    const rows = events.map(e => Object.values(e).map(val => typeof val === "string" ? `"${val}"` : val).join(","));
    return [headers, ...rows].join("\n");
  }
}
