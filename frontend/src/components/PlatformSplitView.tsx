"use client";

import React, { useState } from "react";
import { PlatformSplitItem, GDELTData, PersonaType } from "@/types";
import {
  Layers,
  Globe,
  Radio,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Percent,
  Sparkles,
  Info,
  DollarSign,
  AlertCircle,
} from "lucide-react";

interface PlatformSplitViewProps {
  platforms: PlatformSplitItem[];
  gdelt: GDELTData | null;
  persona: PersonaType;
}

export const PlatformSplitView: React.FC<PlatformSplitViewProps> = ({
  platforms,
  gdelt,
  persona,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>(
    platforms[0]?.platform || "YouTube"
  );

  const active =
    platforms.find((p) => p.platform === selectedPlatform) || platforms[0];

  const gdeltPlatformMeta = gdelt?.platform_media_velocity.find(
    (g) => g.platform.toLowerCase().includes(active.platform.toLowerCase()) ||
           active.platform.toLowerCase().includes(g.platform.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Top Banner with GDELT Ingestion Notice */}
      <div className="p-4 rounded-xl bg-[#0B1117] border border-[#1F2937] real-rails-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#38BDF8] animate-pulse" />
            <h2 className="text-sm font-bold font-mono text-white tracking-wide uppercase">
              Platform Distribution Split & Hegemony Matrix
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800">
              Ingested Source: GDELT 2.0
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Telemetry auditing market share of impression auctions, viewer watch
            time, algorithmic friction, and global news media sentiment (GDELT).
          </p>
        </div>

        {gdelt && (
          <div className="flex items-center gap-3 text-xs font-mono bg-[#030712] px-3 py-1.5 rounded-lg border border-[#1F2937]">
            <span className="text-gray-400">GDELT Global Tone:</span>
            <span
              className={`font-bold ${
                gdelt.average_global_tone >= 0
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {gdelt.average_global_tone > 0 ? "+" : ""}
              {gdelt.average_global_tone}
            </span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">Articles Monitored:</span>
            <span className="text-white font-bold">
              {gdelt.total_global_articles_monitored.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Platform Selection Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {platforms.map((p) => {
          const isSelected = p.platform === selectedPlatform;
          return (
            <button
              key={p.platform}
              onClick={() => setSelectedPlatform(p.platform)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-[#0B1117] border-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.25)] scale-[1.02]"
                  : "bg-[#0B1117]/60 border-[#1F2937] hover:border-gray-700 hover:bg-[#0B1117]"
              }`}
            >
              <div className="text-[10px] font-mono text-gray-400">
                {p.format}
              </div>
              <div className="text-sm font-bold font-mono text-white mt-0.5 truncate">
                {p.platform}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-mono">
                <span className="text-gray-400">Take-Rate:</span>
                <span
                  className={
                    p.platform_take_rate_pct > 70
                      ? "text-rose-400 font-bold"
                      : p.platform_take_rate_pct > 40
                      ? "text-amber-400 font-bold"
                      : "text-emerald-400 font-bold"
                  }
                >
                  {p.platform_take_rate_pct}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Card on Active Platform */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Key Platform Funnel Metrics (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#0B1117] border border-[#1F2937] real-rails-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <div>
              <div className="text-[10px] font-mono uppercase text-[#38BDF8]">
                Distribution Rail Operator
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {active.platform}
                <span className="text-xs font-normal text-gray-400 font-sans">
                  ({active.format})
                </span>
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-gray-400 block">
                Creator Sovereignty
              </span>
              <span
                className={`text-sm font-mono font-bold ${
                  active.creator_sovereignty_score > 70
                    ? "text-emerald-400"
                    : active.creator_sovereignty_score > 35
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {active.creator_sovereignty_score} / 100 Index
              </span>
            </div>
          </div>

          {/* 6 Key Grid Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Share of Impressions
              </div>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                {active.share_of_impressions_pct}%
              </div>
              <div className="text-[10px] text-gray-400">Discovery reach</div>
            </div>

            <div className="p-3 rounded-lg bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Share of Watch Time
              </div>
              <div className="text-base font-bold font-mono text-[#38BDF8] mt-0.5">
                {active.share_of_watch_time_pct}%
              </div>
              <div className="text-[10px] text-gray-400">Attention bandwidth</div>
            </div>

            <div className="p-3 rounded-lg bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Avg Session Watch
              </div>
              <div className="text-base font-bold font-mono text-indigo-400 mt-0.5">
                {active.avg_watch_sec}s
              </div>
              <div className="text-[10px] text-gray-400">Focus duration</div>
            </div>

            <div className="p-3 rounded-lg bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Average CTR
              </div>
              <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
                {active.avg_ctr_pct}%
              </div>
              <div className="text-[10px] text-gray-400">Link interaction</div>
            </div>

            <div className="p-3 rounded-lg bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Effective Auction CPM
              </div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                ${active.effective_cpm_usd.toFixed(2)}
              </div>
              <div className="text-[10px] text-gray-400">Ad clearing price</div>
            </div>

            <div className="p-3 rounded-lg bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Downstream Conversion
              </div>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                {active.avg_conversion_rate_pct}%
              </div>
              <div className="text-[10px] text-gray-400">Transaction rate</div>
            </div>
          </div>

          {/* Rev Share Split Bar */}
          <div className="p-3.5 rounded-lg bg-[#030712] border border-[#1F2937] space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-emerald-400 font-bold">
                Creator Rev-Share: {active.creator_rev_share_pct}%
              </span>
              <span className="text-[#818CF8] font-bold">
                Platform Intermediary Take: {active.platform_take_rate_pct}%
              </span>
            </div>
            <div className="w-full bg-[#1F2937] h-2 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${active.creator_rev_share_pct}%` }}
                className="bg-emerald-400 h-full"
              />
              <div
                style={{ width: `${active.platform_take_rate_pct}%` }}
                className="bg-[#818CF8] h-full"
              />
            </div>
          </div>
        </div>

        {/* Right Column: GDELT Signals & Algorithmic Hegemony (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* GDELT Signal Inspector Card */}
          <div className="p-5 rounded-xl bg-[#0B1117] border border-[#1F2937] real-rails-card space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1F2937]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-bold uppercase text-white">
                  GDELT 2.0 Ingested Media Tone
                </span>
              </div>
              {gdeltPlatformMeta && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    gdeltPlatformMeta.tone_score >= 0
                      ? "bg-emerald-950/60 text-emerald-300 border-emerald-800"
                      : "bg-rose-950/60 text-rose-300 border-rose-800"
                  }`}
                >
                  Tone: {gdeltPlatformMeta.tone_score > 0 ? "+" : ""}
                  {gdeltPlatformMeta.tone_score}
                </span>
              )}
            </div>

            {gdeltPlatformMeta ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">Media Attention Velocity:</span>
                  <span className="font-mono text-[#38BDF8] font-bold">
                    {gdeltPlatformMeta.velocity_trend}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span className="text-gray-400">Volume Index:</span>
                  <span className="font-mono text-white font-bold">
                    {gdeltPlatformMeta.media_volume_score} / 100
                  </span>
                </div>

                <div className="pt-2 border-t border-[#1F2937]">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">
                    Dominant News Narrative Themes:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {gdeltPlatformMeta.key_narrative_themes.map((theme) => (
                      <span
                        key={theme}
                        className="text-[10px] font-sans px-2 py-0.5 rounded bg-[#030712] border border-[#1F2937] text-gray-300"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400">
                Global media signals aggregated from GDELT rolling monitoring window.
              </p>
            )}
          </div>

          {/* Algorithmic Control Assessment */}
          <div className="p-4 rounded-xl bg-[#0B1117] border border-[#1F2937] space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Algorithmic Governance Vector
            </div>
            <div className="text-xs text-white font-mono font-bold">
              {active.algorithmic_control_rating}
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              {active.platform === "TikTok" &&
                "Content reach is almost exclusively dictated by the centralized ByteDance recommendation model with zero audience subscription guarantees."}
              {active.platform === "YouTube" &&
                "Hybrid model balancing subscriber notifications and homepage discovery, offering standard 55% AdSense rev-share."}
              {active.platform === "Meta / Instagram" &&
                "Closed ad network where social graphs are throttled to induce creator spend on paid boosts."}
              {active.platform === "Twitch" &&
                "Live directory browse with high audience loyalty but restrictive 50/50 subscription splits."}
              {active.platform === "X / Twitter" &&
                "Algorithmic feed push with discretionary ad-revenue payouts requiring active subscription tier."}
              {active.platform === "Substack" &&
                "Direct email distribution rail without algorithmic feeds; creator retains 90% of gross subscription value."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
