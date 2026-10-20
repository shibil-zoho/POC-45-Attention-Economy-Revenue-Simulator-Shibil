"use client";

import React, { useState } from "react";
import {
  FunnelResult,
  FunnelStage,
  ContentType,
  MonetizationOverlay,
  PersonaType,
} from "@/types";
import {
  Eye,
  Clock,
  MousePointerClick,
  CheckCircle2,
  DollarSign,
  ArrowDown,
  Info,
  ShieldAlert,
  Sparkles,
  Layers,
  Filter,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface FunnelStagesViewProps {
  funnel: FunnelResult;
  contentType: ContentType;
  monetizationOverlay: MonetizationOverlay;
  persona: PersonaType;
  onContentTypeChange: (ct: ContentType) => void;
  onMonetizationChange: (mo: MonetizationOverlay) => void;
}

const STAGE_ICONS = [Eye, Clock, MousePointerClick, CheckCircle2, DollarSign];
const STAGE_COLORS = [
  { border: "#38BDF8", bg: "rgba(56, 189, 248, 0.15)", text: "#38BDF8" },
  { border: "#818CF8", bg: "rgba(129, 140, 248, 0.15)", text: "#818CF8" },
  { border: "#F59E0B", bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B" },
  { border: "#10B981", bg: "rgba(16, 185, 129, 0.15)", text: "#10B981" },
  { border: "#EC4899", bg: "rgba(236, 72, 153, 0.15)", text: "#EC4899" },
];

export const FunnelStagesView: React.FC<FunnelStagesViewProps> = ({
  funnel,
  contentType,
  monetizationOverlay,
  persona,
  onContentTypeChange,
  onMonetizationChange,
}) => {
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(0);
  const selectedStage: FunnelStage = funnel.stages[selectedStageIndex];
  const Icon = STAGE_ICONS[selectedStageIndex] || Eye;

  const contentTypes: ContentType[] = [
    "ALL",
    "Short-form Video",
    "Long-form Video",
    "Livestream",
    "Static / Carousel",
    "Newsletter / Article",
  ];

  const monetizationOptions: { id: MonetizationOverlay; label: string }[] = [
    { id: "ALL", label: "Full Blended Monetization" },
    { id: "ADS_ONLY", label: "Ad-Share CPM Only" },
    { id: "SUBSCRIPTIONS", label: "Subscriptions / Memberships" },
    { id: "SPONSORSHIPS", label: "Brand Sponsorships" },
    { id: "COMMERCE", label: "Commerce / Affiliates" },
  ];

  return (
    <div className="space-y-5">
      {/* Funnel Controls Bar */}
      <div className="p-4 rounded-xl bg-[#0B1117] border border-[#1F2937] real-rails-card">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1F2937]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Creator Distribution Funnel Stages
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30">
              Distribution & Demand Rail
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-gray-400">Overall Funnel Conversion:</span>
            <span className="text-emerald-400 font-bold">
              {funnel.overall_funnel_conversion_pct}%
            </span>
          </div>
        </div>

        {/* Content Type Filter Tabs */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-gray-400 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#38BDF8]" />
            Content Type:
          </span>
          {contentTypes.map((ct) => (
            <button
              key={ct}
              onClick={() => onContentTypeChange(ct)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                contentType === ct
                  ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                  : "bg-[#030712] text-gray-300 hover:text-white border border-[#1F2937]"
              }`}
            >
              {ct}
            </button>
          ))}
        </div>

        {/* Monetization Overlay Selector */}
        <div className="mt-3 pt-3 border-t border-[#1F2937]/80 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-gray-400 mr-2 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-400" />
            Monetization Overlay:
          </span>
          {monetizationOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onMonetizationChange(opt.id)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                monetizationOverlay === opt.id
                  ? "bg-emerald-500 text-[#030712] font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                  : "bg-[#030712] text-gray-300 hover:text-white border border-[#1F2937]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Funnel Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Funnel Progression Column (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {funnel.stages.map((stage, idx) => {
            const isSelected = selectedStageIndex === idx;
            const StageIcon = STAGE_ICONS[idx] || Eye;
            const colorCfg = STAGE_COLORS[idx];
            // Width decreases progressively to create physical funnel silhouette
            const widthPct = Math.max(52, 100 - idx * 11);

            return (
              <React.Fragment key={stage.id}>
                <div
                  onClick={() => setSelectedStageIndex(idx)}
                  className={`mx-auto p-4 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-[#0B1117] shadow-xl scale-[1.01]"
                      : "bg-[#0B1117]/60 hover:bg-[#0B1117] opacity-90 hover:opacity-100"
                  }`}
                  style={{
                    width: `${widthPct}%`,
                    borderColor: isSelected ? colorCfg.border : "#1F2937",
                    boxShadow: isSelected
                      ? `0 0 18px ${colorCfg.bg}`
                      : "none",
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: colorCfg.bg,
                          borderColor: colorCfg.border,
                        }}
                      >
                        <StageIcon
                          className="w-3.5 h-3.5"
                          style={{ color: colorCfg.text }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase text-gray-400">
                            Stage {stage.stage_number}
                          </span>
                          <span
                            className="text-xs font-mono font-bold"
                            style={{ color: colorCfg.text }}
                          >
                            {stage.name}
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-300 font-sans">
                          {stage.label}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-white">
                        {stage.metric_highlight}
                      </div>
                      <div className="text-[10px] font-mono text-gray-400">
                        {stage.unit}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar visual */}
                  <div className="w-full bg-[#030712] h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(12, 100 - idx * 18)}%`,
                        backgroundColor: colorCfg.text,
                      }}
                    />
                  </div>
                </div>

                {/* Drop-off transition indicator between stages */}
                {idx < funnel.stages.length - 1 && (
                  <div className="flex items-center justify-center gap-2 py-0.5">
                    <div className="h-3 w-[1px] bg-[#1F2937]" />
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0B1117] border border-rose-900/50 text-[10px] font-mono text-rose-400">
                      <TrendingDown className="w-3 h-3 text-rose-400" />
                      <span>-{funnel.stages[idx + 1].drop_off_pct}% Drop-off</span>
                      <span className="text-gray-500">|</span>
                      <span className="text-emerald-400">
                        {stage.conversion_to_next_pct}% Pass-through
                      </span>
                    </div>
                    <div className="h-3 w-[1px] bg-[#1F2937]" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right Inspector & Persona Lens Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Stage Deep Dive Card */}
          <div className="p-5 rounded-xl bg-[#0B1117] border border-[#1F2937] real-rails-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center border"
                  style={{
                    backgroundColor: STAGE_COLORS[selectedStageIndex].bg,
                    borderColor: STAGE_COLORS[selectedStageIndex].border,
                  }}
                >
                  <Icon
                    className="w-3.5 h-3.5"
                    style={{ color: STAGE_COLORS[selectedStageIndex].text }}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-gray-400">
                    Stage Inspector
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {selectedStage.name}
                  </h3>
                </div>
              </div>

              <span
                className="text-[10px] font-mono px-2 py-0.5 rounded border"
                style={{
                  color: STAGE_COLORS[selectedStageIndex].text,
                  borderColor: STAGE_COLORS[selectedStageIndex].border,
                  backgroundColor: STAGE_COLORS[selectedStageIndex].bg,
                }}
              >
                Stage {selectedStage.stage_number} of 5
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              {selectedStage.description}
            </p>

            {/* Key Mechanics */}
            <div className="space-y-2 pt-1">
              <div className="p-3 rounded-lg bg-[#030712] border border-[#1F2937] space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#38BDF8]" />
                  Distribution Rail Mechanic
                </div>
                <div className="text-xs text-gray-200 font-sans">
                  {selectedStage.rail_mechanic}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#030712] border border-[#1F2937] space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                  Intermediary Leakage & Friction
                </div>
                <div className="text-xs text-gray-300 font-sans">
                  {selectedStage.leakage_factor}
                </div>
              </div>
            </div>

            {/* Stage Economics Highlight if Stage 5 */}
            {selectedStage.stage_number === 5 && (
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-emerald-400 font-mono font-medium">
                    Creator Payout Share:
                  </span>
                  <span className="font-mono font-bold text-white">
                    ${funnel.creator_payout_usd.toLocaleString()} (
                    {funnel.creator_take_rate_pct}%)
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-indigo-400 font-mono font-medium">
                    Platform Intermediary Rent:
                  </span>
                  <span className="font-mono font-bold text-white">
                    ${funnel.platform_take_usd.toLocaleString()} (
                    {funnel.platform_take_rate_pct}%)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Persona Explanation Lens Box */}
          <div className="p-4 rounded-xl bg-[#0B1117] border border-[#1F2937] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#818CF8] flex items-center gap-1">
                <Info className="w-3 h-3 text-[#818CF8]" />
                Audience Lens Perspective
              </span>
              <span className="text-[10px] font-mono text-gray-400 capitalize">
                {persona.replace("_", " ")}
              </span>
            </div>

            <div className="text-xs text-gray-300 font-sans leading-relaxed">
              {persona === "everyday_viewers" && (
                <div>
                  <strong className="text-white">Viewer Takeaway:</strong> As you
                  scroll through feeds, your attention is converted into bid
                  auctions. For every $100 generated from your screen time,
                  the platform retains up to ${funnel.platform_take_rate_pct} in
                  rent while creators fight for the remainder.
                </div>
              )}
              {persona === "builders" && (
                <div>
                  <strong className="text-white">Builder Takeaway:</strong> Notice
                  the drop-off between Stage 2 and Stage 3. To escape
                  algorithmic dependency, builders must craft external off-ramps
                  (email capture, direct communities) before platform rent
                  erodes creator margins.
                </div>
              )}
              {persona === "allocators" && (
                <div>
                  <strong className="text-white">Allocator Takeaway:</strong> The
                  distribution rail exhibits classic natural monopoly traits:
                  zero-marginal-cost impression delivery yielding 45%-88% gross
                  margins for platform aggregators.
                </div>
              )}
              {persona === "all" && (
                <div>
                  <strong className="text-white">Unified Thesis:</strong> The
                  creator distribution funnel demonstrates how digital attention
                  bandwidth is captured, frictionally filtered, and extracted
                  by platform intermediaries before returning yield to content
                  producers.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
