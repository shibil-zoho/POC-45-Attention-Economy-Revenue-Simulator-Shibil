"use client";

import React, { useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Download, PieChart as PieIcon, ShieldCheck, Users } from "lucide-react";
import html2canvas from "html2canvas";
import { CreatorTierSplit, SimulationMetrics } from "@/types";

interface CreatorSplitChartProps {
  tierSplit: CreatorTierSplit;
  metrics: SimulationMetrics;
}

export const CreatorSplitChart: React.FC<CreatorSplitChartProps> = ({
  tierSplit,
  metrics,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const exportChartAsImage = async () => {
    if (!chartRef.current) return;
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#0B1117",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `real_rails_creator_split_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const macroData = [
    {
      name: "Creator Payout Pool",
      value: metrics.annual_creator_payout,
      pct: metrics.creator_rev_share_pct,
      color: "#34D399",
    },
    {
      name: "Platform Rail Take-Rate",
      value: metrics.annual_platform_margin,
      pct: metrics.platform_take_rate_pct,
      color: "#818CF8",
    },
  ];

  const tierChartData = tierSplit.tiers.map((t) => ({
    name: t.tier_name,
    payout: t.payout_allocation_usd,
    attentionPct: t.attention_captured_pct,
    creatorPct: t.creator_share_pct,
    avgEarnings: t.avg_annual_earnings_estimate,
    leverage: t.leverage_classification,
  }));

  const COLORS = ["#38BDF8", "#818CF8", "#F59E0B", "#EC4899"];

  return (
    <div
      ref={chartRef}
      className="p-5 rounded-lg bg-[#0B1117] border border-[#1F2937] real-rails-card flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase font-bold flex items-center gap-1.5">
              <PieIcon className="w-3 h-3 text-emerald-400" />
              CREATOR VS. PLATFORM VALUE EXTRACTION
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800/40 font-mono">
              Economic Tier Hegemony
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight mt-0.5">
            Surplus Rent vs. Distributed Creator Labor
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Exposes how platform intermediaries arbitrate creator rev-shares and how attention capital concentrates across tiers.
          </p>
        </div>

        <button
          onClick={exportChartAsImage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#030712] hover:bg-[#1F2937] text-gray-200 border border-[#1F2937] hover:border-[#38BDF8]/60 transition-all text-xs font-mono"
        >
          <Download className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Export Chart</span>
        </button>
      </div>

      {/* Macro Split Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Macro Card 1: Creator Pool */}
        <div className="p-3.5 rounded bg-[#030712] border border-[#1F2937] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-emerald-400 uppercase">
              Creator Labor Pool ({metrics.creator_rev_share_pct}%)
            </div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              ${metrics.annual_creator_payout.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              Aggregated across all content creators
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-950/70 border border-emerald-600/50 flex items-center justify-center font-mono text-emerald-300 font-bold text-xs">
            {metrics.creator_rev_share_pct}%
          </div>
        </div>

        {/* Macro Card 2: Platform Take-Rate */}
        <div className="p-3.5 rounded bg-[#030712] border border-[#1F2937] flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-[#818CF8] uppercase">
              Platform Rail Take-Rate ({metrics.platform_take_rate_pct}%)
            </div>
            <div className="text-xl font-bold font-mono text-white mt-0.5">
              ${metrics.annual_platform_margin.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              Retained gross rent by network infrastructure
            </div>
          </div>
          <div className="h-10 w-10 rounded-full bg-indigo-950/70 border border-indigo-600/50 flex items-center justify-center font-mono text-indigo-300 font-bold text-xs">
            {metrics.platform_take_rate_pct}%
          </div>
        </div>
      </div>

      {/* Tier Distribution Table & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tier Chart */}
        <div className="lg:col-span-2 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tierChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#6B7280"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
              />
              <YAxis
                stroke="#6B7280"
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                tick={{ fontSize: 10, fill: "#9CA3AF", fontFamily: "monospace" }}
              />
              <Tooltip
                content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-[#0B1117] border border-[#38BDF8] p-2.5 rounded shadow-xl text-xs space-y-1 font-sans">
                        <div className="font-bold text-[#38BDF8] font-mono">{d.name}</div>
                        <div className="text-white flex justify-between gap-3">
                          <span>Total Payout:</span>
                          <span className="font-mono font-bold">${d.payout.toLocaleString()}</span>
                        </div>
                        <div className="text-gray-300 flex justify-between gap-3">
                          <span>Attention Share:</span>
                          <span className="font-mono">{d.attentionPct}%</span>
                        </div>
                        <div className="text-gray-300 flex justify-between gap-3">
                          <span>Creator Body:</span>
                          <span className="font-mono">{d.creatorPct}%</span>
                        </div>
                        <div className="text-emerald-400 flex justify-between gap-3">
                          <span>Est. Avg Annual:</span>
                          <span className="font-mono font-bold">${d.avgEarnings.toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 italic pt-1 border-t border-[#1F2937]">
                          {d.leverage}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="payout" name="Annual Payout Pool ($)" fill="#38BDF8" radius={[4, 4, 0, 0]}>
                {tierChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tier Narrative / Breakdown */}
        <div className="flex flex-col justify-between space-y-2 text-xs">
          {tierSplit.tiers.map((tier, idx) => (
            <div
              key={tier.tier_name}
              className="p-2.5 rounded bg-[#030712] border border-[#1F2937] hover:border-[#38BDF8]/40 transition-all"
            >
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  {tier.tier_name}
                </span>
                <span className="text-[#38BDF8] font-bold">
                  ${tier.payout_allocation_usd.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>{tier.creator_share_pct}% creators capture {tier.attention_captured_pct}% attention</span>
                <span className="text-emerald-400 font-mono">
                  ~${tier.avg_annual_earnings_estimate.toLocaleString()}/yr
                </span>
              </div>
              <div className="text-[10px] text-gray-400 mt-1 italic">
                {tier.leverage_classification}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
