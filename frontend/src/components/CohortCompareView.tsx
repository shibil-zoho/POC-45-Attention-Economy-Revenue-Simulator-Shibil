"use client";

import React, { useState } from "react";
import { CohortSets, CohortItem, PersonaType } from "@/types";
import {
  Users,
  GitCompare,
  ArrowRight,
  TrendingUp,
  Percent,
  DollarSign,
  ShieldAlert,
  Sparkles,
  Layers,
  Clock,
  MousePointerClick,
  Info,
} from "lucide-react";

interface CohortCompareViewProps {
  cohorts: CohortSets;
  persona: PersonaType;
}

export const CohortCompareView: React.FC<CohortCompareViewProps> = ({
  cohorts,
  persona,
}) => {
  const [cohortMode, setCohortMode] = useState<"tiers" | "traffic">("tiers");

  const activeCohortList =
    cohortMode === "tiers"
      ? cohorts.creator_tier_cohorts
      : cohorts.traffic_source_cohorts;

  const [cohortAIndex, setCohortAIndex] = useState<number>(0);
  const [cohortBIndex, setCohortBIndex] = useState<number>(
    Math.min(activeCohortList.length - 1, 3)
  );

  const cohortA: CohortItem = activeCohortList[cohortAIndex] || activeCohortList[0];
  const cohortB: CohortItem =
    activeCohortList[cohortBIndex] || activeCohortList[1] || activeCohortList[0];

  return (
    <div className="space-y-5">
      {/* Header & Mode Switcher */}
      <div className="p-4 rounded-xl bg-[#0B1117] border border-[#1F2937] real-rails-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-[#38BDF8]" />
            <h2 className="text-sm font-bold font-mono text-white tracking-wide uppercase">
              Cohort Comparison Engine
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#818CF8]/15 text-[#818CF8] border border-[#818CF8]/30">
              Cross-Segment Intelligence
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Compare retention efficiency, click-through leverage, and platform
            rent extraction across creator tiers and traffic pipelines.
          </p>
        </div>

        {/* Dimension Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#030712] border border-[#1F2937]">
          <button
            onClick={() => {
              setCohortMode("tiers");
              setCohortAIndex(0);
              setCohortBIndex(3);
            }}
            className={`px-3 py-1 rounded text-xs font-mono transition-all ${
              cohortMode === "tiers"
                ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Creator Tiers
          </button>
          <button
            onClick={() => {
              setCohortMode("traffic");
              setCohortAIndex(0);
              setCohortBIndex(1);
            }}
            className={`px-3 py-1 rounded text-xs font-mono transition-all ${
              cohortMode === "traffic"
                ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Traffic Pipelines
          </button>
        </div>
      </div>

      {/* Cohort Selection Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-lg bg-[#0B1117] border border-[#38BDF8]/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#38BDF8] font-bold">COHORT A (Benchmark)</span>
            <span className="text-gray-400 text-[11px]">Select Target:</span>
          </div>
          <select
            value={cohortAIndex}
            onChange={(e) => setCohortAIndex(Number(e.target.value))}
            className="w-full bg-[#030712] border border-[#1F2937] text-white text-xs rounded p-2 font-mono focus:border-[#38BDF8] outline-none"
          >
            {activeCohortList.map((c, idx) => (
              <option key={c.cohort_name} value={idx}>
                {c.cohort_name} — {c.creator_description || c.source_description}
              </option>
            ))}
          </select>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0B1117] border border-[#818CF8]/40 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#818CF8] font-bold">COHORT B (Comparison)</span>
            <span className="text-gray-400 text-[11px]">Select Target:</span>
          </div>
          <select
            value={cohortBIndex}
            onChange={(e) => setCohortBIndex(Number(e.target.value))}
            className="w-full bg-[#030712] border border-[#1F2937] text-white text-xs rounded p-2 font-mono focus:border-[#818CF8] outline-none"
          >
            {activeCohortList.map((c, idx) => (
              <option key={c.cohort_name} value={idx}>
                {c.cohort_name} — {c.creator_description || c.source_description}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Cohort A Card */}
        <div className="p-5 rounded-xl bg-[#0B1117] border border-[#38BDF8]/40 real-rails-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <div>
              <div className="text-[10px] font-mono text-[#38BDF8] uppercase">
                Cohort A
              </div>
              <h3 className="text-base font-bold text-white">
                {cohortA.cohort_name}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {cohortA.creator_description || cohortA.source_description}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 text-[#38BDF8] border border-sky-800">
              {cohortA.leverage_tier}
            </span>
          </div>

          {/* Metric Tiles for A */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Impression Volume
              </div>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                {cohortA.impression_volume.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-400">Total post reach</div>
            </div>

            <div className="p-3 rounded bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Avg Watch Time
              </div>
              <div className="text-base font-bold font-mono text-[#38BDF8] mt-0.5">
                {cohortA.avg_watch_time_sec}s
              </div>
              <div className="text-[10px] text-gray-400">Viewer focus depth</div>
            </div>

            <div className="p-3 rounded bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Click-Through Rate (CTR)
              </div>
              <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
                {cohortA.ctr_pct}%
              </div>
              <div className="text-[10px] text-gray-400">Active interaction</div>
            </div>

            <div className="p-3 rounded bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Conversion Rate
              </div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                {cohortA.conversion_rate_pct}%
              </div>
              <div className="text-[10px] text-gray-400">Transaction actions</div>
            </div>
          </div>

          {/* Rev-share split */}
          <div className="p-3 rounded-lg bg-[#030712] border border-[#1F2937] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-mono">Creator Rev-Share:</span>
              <span className="font-mono font-bold text-emerald-400">
                {cohortA.creator_take_rate_pct}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-mono">Platform Rent Tax:</span>
              <span className="font-mono font-bold text-[#818CF8]">
                {cohortA.platform_take_rate_pct}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1 border-t border-[#1F2937]">
              <span className="text-gray-300 font-mono font-medium">
                Avg Post Economic Yield:
              </span>
              <span className="font-mono font-bold text-white">
                ${cohortA.avg_post_yield_usd.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Cohort B Card */}
        <div className="p-5 rounded-xl bg-[#0B1117] border border-[#818CF8]/40 real-rails-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
            <div>
              <div className="text-[10px] font-mono text-[#818CF8] uppercase">
                Cohort B
              </div>
              <h3 className="text-base font-bold text-white">
                {cohortB.cohort_name}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {cohortB.creator_description || cohortB.source_description}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-[#818CF8] border border-indigo-800">
              {cohortB.leverage_tier}
            </span>
          </div>

          {/* Metric Tiles for B */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Impression Volume
              </div>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                {cohortB.impression_volume.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-400">Total post reach</div>
            </div>

            <div className="p-3 rounded bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Avg Watch Time
              </div>
              <div className="text-base font-bold font-mono text-[#818CF8] mt-0.5">
                {cohortB.avg_watch_time_sec}s
              </div>
              <div className="text-[10px] text-gray-400">Viewer focus depth</div>
            </div>

            <div className="p-3 rounded bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Click-Through Rate (CTR)
              </div>
              <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
                {cohortB.ctr_pct}%
              </div>
              <div className="text-[10px] text-gray-400">Active interaction</div>
            </div>

            <div className="p-3 rounded bg-[#030712] border border-[#1F2937]">
              <div className="text-[10px] font-mono text-gray-400">
                Conversion Rate
              </div>
              <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                {cohortB.conversion_rate_pct}%
              </div>
              <div className="text-[10px] text-gray-400">Transaction actions</div>
            </div>
          </div>

          {/* Rev-share split */}
          <div className="p-3 rounded-lg bg-[#030712] border border-[#1F2937] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-mono">Creator Rev-Share:</span>
              <span className="font-mono font-bold text-emerald-400">
                {cohortB.creator_take_rate_pct}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400 font-mono">Platform Rent Tax:</span>
              <span className="font-mono font-bold text-[#818CF8]">
                {cohortB.platform_take_rate_pct}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1 border-t border-[#1F2937]">
              <span className="text-gray-300 font-mono font-medium">
                Avg Post Economic Yield:
              </span>
              <span className="font-mono font-bold text-white">
                ${cohortB.avg_post_yield_usd.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Delta & Ratio Analysis */}
      <div className="p-4 rounded-xl bg-[#0B1117] border border-[#1F2937] space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#38BDF8]" />
          <span className="text-xs font-mono font-bold uppercase text-white">
            Comparative Disparity Analysis (Cohort A vs Cohort B)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded bg-[#030712] border border-[#1F2937]">
            <div className="text-[10px] font-mono text-gray-400">
              Yield Ratio Multiplier
            </div>
            <div className="text-lg font-mono font-bold text-white mt-1">
              {(
                cohortA.avg_post_yield_usd /
                Math.max(1, cohortB.avg_post_yield_usd)
              ).toFixed(1)}
              x
            </div>
            <div className="text-[11px] text-gray-400">
              Cohort A yields {(cohortA.avg_post_yield_usd / Math.max(1, cohortB.avg_post_yield_usd)).toFixed(1)}x more dollars per post.
            </div>
          </div>

          <div className="p-3 rounded bg-[#030712] border border-[#1F2937]">
            <div className="text-[10px] font-mono text-gray-400">
              CTR Efficiency Delta
            </div>
            <div className="text-lg font-mono font-bold text-amber-400 mt-1">
              {(cohortA.ctr_pct - cohortB.ctr_pct).toFixed(2)}%
            </div>
            <div className="text-[11px] text-gray-400">
              {cohortA.ctr_pct >= cohortB.ctr_pct ? "Cohort A" : "Cohort B"} captures higher viewer click intent.
            </div>
          </div>

          <div className="p-3 rounded bg-[#030712] border border-[#1F2937]">
            <div className="text-[10px] font-mono text-gray-400">
              Platform Extraction Disparity
            </div>
            <div className="text-lg font-mono font-bold text-rose-400 mt-1">
              {Math.abs(cohortA.platform_take_rate_pct - cohortB.platform_take_rate_pct)}%
            </div>
            <div className="text-[11px] text-gray-400">
              Difference in platform intermediary take-rate.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
