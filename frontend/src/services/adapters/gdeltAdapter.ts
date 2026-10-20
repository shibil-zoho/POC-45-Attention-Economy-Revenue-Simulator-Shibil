import { GDELTData } from "@/types";
import mockDataRaw from "@/data/mock_data.json";

export class GDELTFrontendAdapter {
  /**
   * Transforms raw GDELT response into normalized frontend intelligence schema.
   */
  static parseGDELTSignals(raw: any): GDELTData {
    if (!raw) {
      return (mockDataRaw as any).gdelt_signals;
    }
    return {
      source: raw.source || "GDELT Project 2.0 (Global Database of Events, Language, and Tone)",
      query: raw.query || "creator economy OR youtube OR tiktok",
      coverage_window: raw.coverage_window || "Rolling 90-Day Global News Media",
      total_global_articles_monitored: raw.total_global_articles_monitored || 842500,
      creator_rail_attention_share_pct: raw.creator_rail_attention_share_pct || 2.45,
      average_global_tone: raw.average_global_tone || -0.85,
      is_live: Boolean(raw.is_live),
      platform_media_velocity: raw.platform_media_velocity || [],
      macro_attention_signals: raw.macro_attention_signals || [],
      live_articles_sample: raw.live_articles_sample || [],
    };
  }

  static getFallbackSignals(): GDELTData {
    return (mockDataRaw as any).gdelt_signals;
  }
}
