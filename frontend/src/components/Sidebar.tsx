"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Download,
  Sliders,
  DollarSign,
  Clock,
  Users,
  ShieldAlert,
  Layers,
  Sparkles,
  TrendingUp,
  Percent,
  Flame,
  FileSpreadsheet,
  FileCode,
  Radio,
  Eye,
  Wrench,
  PieChart,
  CheckCircle,
} from "lucide-react";
import {
  SimulationParams,
  SimulationMetrics,
  ContentType,
  MonetizationOverlay,
  PersonaType,
  PersonaExplanations,
} from "@/types";
import { downloadSampleDataBlob } from "@/services/api";

interface SidebarProps {
  sidebarData: any;
  params: SimulationParams;
  metrics: SimulationMetrics;
  persona: PersonaType;
  personasData: PersonaExplanations | null;
  onParamChange: (newParams: Partial<SimulationParams>) => void;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarData,
  params,
  metrics,
  persona,
  personasData,
  onParamChange,
  onReset,
}) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (format: "csv" | "json") => {
    setDownloading(format);
    try {
      const { blob, filename } = await downloadSampleDataBlob(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error", err);
    } finally {
      setDownloading(null);
    }
  };

  const applyArchetype = (archetype: string) => {
    switch (archetype) {
      case "tiktok":
        onParamChange({
          session_length_mins: 58.0,
          ad_load_per_10m: 4.2,
          cpm_usd: 8.5,
          creator_rev_share_pct: 12.0,
          churn_sensitivity: 0.14,
          content_type: "Short-form Video",
        });
        break;
      case "youtube":
        onParamChange({
          session_length_mins: 40.5,
          ad_load_per_10m: 2.4,
          cpm_usd: 16.5,
          creator_rev_share_pct: 55.0,
          churn_sensitivity: 0.18,
          content_type: "Long-form Video",
        });
        break;
      case "twitch":
        onParamChange({
          session_length_mins: 95.0,
          ad_load_per_10m: 1.5,
          cpm_usd: 14.2,
          creator_rev_share_pct: 50.0,
          churn_sensitivity: 0.22,
          content_type: "Livestream",
        });
        break;
      case "substack":
        onParamChange({
          session_length_mins: 25.0,
          ad_load_per_10m: 0.5,
          cpm_usd: 28.0,
          creator_rev_share_pct: 90.0,
          churn_sensitivity: 0.08,
          content_type: "Newsletter / Article",
          monetization_overlay: "SUBSCRIPTIONS",
        });
        break;
    }
  };

  const activePersonaCopy =
    persona !== "all" && personasData ? personasData[persona] : null;

  return (
    <aside
      id="intelligence-sidebar"
      style={{ width: "30%", flexBasis: "30%" }}
      className="w-full lg:w-[30%] h-full flex flex-col bg-[#030712] border-l border-[#1F2937] overflow-y-auto shrink-0 select-none pb-12"
    >
      {/* SECTION A: Title & High-level Metric */}
      <div className="p-5 border-b border-[#1F2937] bg-[#0B1117]/80">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#38BDF8] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
            SECTION A // DISTRIBUTION RAIL YIELD
          </span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
            ACTIVE
          </span>
        </div>

        <h2 className="text-sm font-semibold text-white tracking-tight">
          Creator Distribution Funnel
        </h2>
        <div className="text-[11px] font-mono text-gray-400 mt-0.5">
          Rail Category: Distribution & Demand
        </div>

        {/* Hero High-Level Metric Card */}
        <div className="mt-3 p-3.5 rounded-lg bg-[#030712] border border-[#1F2937] relative overflow-hidden group hover:border-[#38BDF8]/50 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#38BDF8]/5 rounded-full blur-xl pointer-events-none" />

          <div className="text-[11px] font-mono text-gray-400 flex items-center justify-between">
            <span>Annualized Gross Rail Liquidity</span>
            <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
              Active Yield
            </span>
          </div>

          <div className="text-2xl font-bold font-mono text-white mt-1 tracking-tight flex items-baseline gap-1.5">
            ${metrics.annual_gross_revenue.toLocaleString()}
            <span className="text-xs font-normal text-gray-400 font-sans">
              USD/yr
            </span>
          </div>

          <div className="mt-2 pt-2 border-t border-[#1F2937]/80 flex items-center justify-between text-xs">
            <span className="text-gray-400">Attention Efficiency:</span>
            <span className="text-[#38BDF8] font-mono font-medium">
              ${metrics.yield_per_1000_hours_usd.toFixed(2)} / 1k hrs
            </span>
          </div>
        </div>

        {/* 4 High-Level Metric Tiles */}
        <div className="grid grid-cols-2 gap-2 mt-2.5">
          <div className="p-2.5 rounded bg-[#030712] border border-[#1F2937]">
            <div className="text-[10px] font-mono text-gray-400">
              Daily Attention Hours
            </div>
            <div className="text-sm font-bold font-mono text-white mt-0.5">
              {metrics.total_daily_attention_hours.toLocaleString()}h
            </div>
            <div className="text-[10px] text-gray-400">
              {metrics.dau.toLocaleString()} DAU
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#030712] border border-[#1F2937]">
            <div className="text-[10px] font-mono text-gray-400">
              Effective Hourly Yield
            </div>
            <div className="text-sm font-bold font-mono text-[#38BDF8] mt-0.5">
              ${metrics.effective_hourly_yield_usd.toFixed(3)}
            </div>
            <div className="text-[10px] text-gray-400">Per observer hour</div>
          </div>

          <div className="p-2.5 rounded bg-[#030712] border border-[#1F2937]">
            <div className="text-[10px] font-mono text-gray-400">
              Creator Payout Pool
            </div>
            <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
              ${metrics.annual_creator_payout.toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-400">
              {metrics.creator_rev_share_pct}% rev-share
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#030712] border border-[#1F2937]">
            <div className="text-[10px] font-mono text-gray-400">
              Platform Take Rent
            </div>
            <div className="text-sm font-bold font-mono text-[#818CF8] mt-0.5">
              ${metrics.annual_platform_margin.toLocaleString()}
            </div>
            <div className="text-[10px] text-gray-400">
              {metrics.platform_take_rate_pct}% margin
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: Why This Matters (Dedicated copy for everyday viewers, builders, allocators) */}
      <div className="p-5 border-b border-[#1F2937]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#818CF8] flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-[#818CF8]" />
            SECTION B // WHY THIS MATTERS
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#818CF8]/20 text-[#818CF8] border border-[#818CF8]/40 font-mono">
            Rail Thesis
          </span>
        </div>

        <h3 className="text-xs font-semibold text-white uppercase tracking-wide mb-1.5">
          Infrastructure Context
        </h3>

        {/* Tailored Persona Copy */}
        {activePersonaCopy ? (
          <div className="space-y-2 mt-2">
            <div className="text-xs font-semibold text-[#38BDF8]">
              {activePersonaCopy.title} — {activePersonaCopy.tagline}
            </div>
            <div className="space-y-2">
              {activePersonaCopy.insights.map((ins, i) => (
                <div
                  key={i}
                  className="bg-[#0B1117] p-2.5 rounded border border-[#1F2937] text-[11px] text-gray-300 space-y-0.5"
                >
                  <strong className="text-white block font-mono text-[10px] uppercase tracking-wide">
                    {ins.headline}
                  </strong>
                  <p className="font-sans leading-relaxed text-gray-300">
                    {ins.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              Human attention is the ultimate scarce bandwidth of the digital
              age. Unlike traditional physical rails (freight, power grids), the
              attention rail converts human focus directly into financial
              liquidity via high-frequency programmatic ad auctions.
            </p>

            <div className="mt-3 space-y-2">
              <div className="flex items-start gap-2 text-[11px] text-gray-300 bg-[#0B1117] p-2 rounded border border-[#1F2937]">
                <Eye className="w-3.5 h-3.5 text-[#38BDF8] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Everyday Viewers:</strong> Your
                  scroll time is financialized in real-time auctions where
                  platforms take up to 88% of the economic value.
                </span>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-300 bg-[#0B1117] p-2 rounded border border-[#1F2937]">
                <Wrench className="w-3.5 h-3.5 text-[#818CF8] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Builders:</strong> Bypassing
                  algorithmic throttles requires multi-stage funnels with high
                  direct CTR and off-platform owned conversions.
                </span>
              </div>

              <div className="flex items-start gap-2 text-[11px] text-gray-300 bg-[#0B1117] p-2 rounded border border-[#1F2937]">
                <PieChart className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Allocators:</strong> Capital
                  leverage sits with platform gatekeepers commanding 45-88%
                  take-rates over captive creator labor.
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION C: Who Controls the Rail (Governance context & GDELT signals) */}
      <div className="p-5 border-b border-[#1F2937] bg-[#0B1117]/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            SECTION C // WHO CONTROLS THE RAIL
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 font-mono">
            Hegemony
          </span>
        </div>

        <h3 className="text-xs font-semibold text-white uppercase tracking-wide mb-1.5">
          Institutional Governance
        </h3>

        <blockquote className="p-2.5 rounded bg-[#030712] border-l-2 border-[#38BDF8] border-y border-r border-[#1F2937] text-xs text-gray-200 leading-relaxed italic mb-3">
          &ldquo;Platforms control the distribution of attention, turning users’
          time and impressions into revenue while determining how earnings and
          economic power are shared with creators.&rdquo;
        </blockquote>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] bg-[#030712] p-2 rounded border border-[#1F2937]">
            <span className="text-gray-300 font-medium">
              Algorithmic Gatekeepers
            </span>
            <span className="text-[10px] font-mono text-rose-400 bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-800/40">
              Absolute Leverage
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] bg-[#030712] p-2 rounded border border-[#1F2937]">
            <span className="text-gray-300 font-medium">
              Private Ad Exchange Auctions
            </span>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-800/40">
              Pricing Monopoly
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] bg-[#030712] p-2 rounded border border-[#1F2937]">
            <span className="text-gray-300 font-medium">
              Unilateral Rev-Share Contracts
            </span>
            <span className="text-[10px] font-mono text-[#38BDF8] bg-sky-950/50 px-1.5 py-0.5 rounded border border-sky-800/40">
              Zero Creator Say
            </span>
          </div>
        </div>
      </div>

      {/* SECTION D: Functional Sensitivity Filters & Presets */}
      <div className="p-5 border-b border-[#1F2937]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#38BDF8] flex items-center gap-1.5">
            <Sliders className="w-3 h-3 text-[#38BDF8]" />
            SECTION D // SENSITIVITY FILTERS
          </span>
          <button
            onClick={onReset}
            className="text-[10px] font-mono text-gray-400 hover:text-white underline"
          >
            Reset Defaults
          </button>
        </div>

        {/* Archetype Quick Buttons */}
        <div className="mb-4">
          <div className="text-[11px] text-gray-400 mb-1.5 font-mono">
            Platform Presets:
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => applyArchetype("youtube")}
              className="text-[11px] font-medium py-1 px-2 rounded bg-[#0B1117] hover:bg-[#1F2937] text-gray-200 border border-[#1F2937] hover:border-[#38BDF8]/60 transition-all text-left flex items-center justify-between"
            >
              <span>YouTube Longform</span>
              <span className="text-[9px] text-[#38BDF8] font-mono">55%</span>
            </button>
            <button
              onClick={() => applyArchetype("tiktok")}
              className="text-[11px] font-medium py-1 px-2 rounded bg-[#0B1117] hover:bg-[#1F2937] text-gray-200 border border-[#1F2937] hover:border-[#38BDF8]/60 transition-all text-left flex items-center justify-between"
            >
              <span>TikTok Shortform</span>
              <span className="text-[9px] text-amber-400 font-mono">12%</span>
            </button>
            <button
              onClick={() => applyArchetype("twitch")}
              className="text-[11px] font-medium py-1 px-2 rounded bg-[#0B1117] hover:bg-[#1F2937] text-gray-200 border border-[#1F2937] hover:border-[#38BDF8]/60 transition-all text-left flex items-center justify-between"
            >
              <span>Twitch Live</span>
              <span className="text-[9px] text-indigo-400 font-mono">50%</span>
            </button>
            <button
              onClick={() => applyArchetype("substack")}
              className="text-[11px] font-medium py-1 px-2 rounded bg-[#0B1117] hover:bg-[#1F2937] text-gray-200 border border-[#1F2937] hover:border-[#38BDF8]/60 transition-all text-left flex items-center justify-between"
            >
              <span>Substack Letter</span>
              <span className="text-[9px] text-emerald-400 font-mono">90%</span>
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          {/* Slider 1: Audience Scale (DAU) */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span
                className="text-gray-300 font-medium flex items-center gap-1"
                title="Total active daily user nodes generating attention volume."
              >
                <Users className="w-3.5 h-3.5 text-gray-400" />
                Audience Scale (DAU)
              </span>
              <span className="font-mono text-[#38BDF8] font-bold">
                {params.dau.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="25000"
              max="5000000"
              step="25000"
              value={params.dau}
              onChange={(e) => onParamChange({ dau: Number(e.target.value) })}
              className="w-full cursor-pointer accent-[#38BDF8]"
            />
            <div className="text-[10px] text-gray-400 mt-0.5">
              Total active users in the distribution network.
            </div>
          </div>

          {/* Slider 2: Daily Session Length */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span
                className="text-gray-300 font-medium flex items-center gap-1"
                title="Average time spent per user per day consuming feed content."
              >
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                Daily Session Length
              </span>
              <span className="font-mono text-[#38BDF8] font-bold">
                {params.session_length_mins} mins
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              step="1"
              value={params.session_length_mins}
              onChange={(e) =>
                onParamChange({ session_length_mins: Number(e.target.value) })
              }
              className="w-full cursor-pointer accent-[#38BDF8]"
            />
            <div className="text-[10px] text-gray-400 mt-0.5">
              Effective session after ad fatigue: {metrics.effective_session_mins}m
            </div>
          </div>

          {/* Slider 3: Ad Density */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span
                className="text-gray-300 font-medium flex items-center gap-1"
                title="Sponsored impression units served per 10 minutes."
              >
                <Flame className="w-3.5 h-3.5 text-gray-400" />
                Ad Density (Ads / 10m)
              </span>
              <span className="font-mono text-[#38BDF8] font-bold">
                {params.ad_load_per_10m}
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.1"
              value={params.ad_load_per_10m}
              onChange={(e) =>
                onParamChange({ ad_load_per_10m: Number(e.target.value) })
              }
              className="w-full cursor-pointer accent-[#38BDF8]"
            />
            <div className="text-[10px] text-gray-400 mt-0.5">
              Fatigue Status:{" "}
              <span
                className={
                  metrics.fatigue_risk_score < 35
                    ? "text-emerald-400"
                    : metrics.fatigue_risk_score < 65
                    ? "text-amber-400"
                    : "text-rose-400"
                }
              >
                {metrics.fatigue_status}
              </span>
            </div>
          </div>

          {/* Slider 4: Auction CPM */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span
                className="text-gray-300 font-medium flex items-center gap-1"
                title="Clearing cost per 1,000 completed impressions."
              >
                <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                Auction CPM ($)
              </span>
              <span className="font-mono text-[#38BDF8] font-bold">
                ${params.cpm_usd.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="50.0"
              step="0.5"
              value={params.cpm_usd}
              onChange={(e) =>
                onParamChange({ cpm_usd: Number(e.target.value) })
              }
              className="w-full cursor-pointer accent-[#38BDF8]"
            />
            <div className="text-[10px] text-gray-400 mt-0.5">
              Average advertiser clearing auction price.
            </div>
          </div>

          {/* Slider 5: Creator Rev-Share % */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span
                className="text-gray-300 font-medium flex items-center gap-1"
                title="Percentage of gross revenue distributed to content creators."
              >
                <Percent className="w-3.5 h-3.5 text-gray-400" />
                Creator Rev-Share (%)
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {params.creator_rev_share_pct}%
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              step="5"
              value={params.creator_rev_share_pct}
              onChange={(e) =>
                onParamChange({ creator_rev_share_pct: Number(e.target.value) })
              }
              className="w-full cursor-pointer accent-emerald-400"
            />
            <div className="text-[10px] text-gray-400 mt-0.5">
              Platform intermediary retention: {metrics.platform_take_rate_pct}%
            </div>
          </div>
        </div>
      </div>

      {/* SECTION E: Download Sample Data (Synthetic Post Impressions, Watch Time, CTR, Conversions) */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
            <Download className="w-3 h-3 text-emerald-400" />
            SECTION E // DOWNLOAD SAMPLE DATA
          </span>
          <span className="text-[10px] font-mono text-gray-400">CSV & JSON</span>
        </div>

        <h3 className="text-xs font-semibold text-white uppercase tracking-wide mb-1">
          Export Calibrated Post Stream
        </h3>
        <p className="text-xs text-gray-400 leading-relaxed font-sans mb-3">
          Download synthetic event feed calibrated with post impressions, watch
          time, CTR, and conversion events across creator tiers.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleDownload("csv")}
            disabled={downloading !== null}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#0B1117] hover:bg-[#1F2937] text-white border border-[#1F2937] hover:border-[#38BDF8]/60 text-xs font-mono transition-all disabled:opacity-50"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{downloading === "csv" ? "Exporting..." : "Export CSV"}</span>
          </button>

          <button
            onClick={() => handleDownload("json")}
            disabled={downloading !== null}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#0B1117] hover:bg-[#1F2937] text-white border border-[#1F2937] hover:border-[#38BDF8]/60 text-xs font-mono transition-all disabled:opacity-50"
          >
            <FileCode className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>{downloading === "json" ? "Exporting..." : "Export JSON"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
