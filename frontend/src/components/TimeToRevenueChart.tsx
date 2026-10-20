"use client";

import React, { useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Download, Sparkles, TrendingUp, Info } from "lucide-react";
import html2canvas from "html2canvas";
import { TrajectoryPoint, SimulationMetrics } from "@/types";

interface TimeToRevenueChartProps {
  data: TrajectoryPoint[];
  metrics: SimulationMetrics;
}

export const TimeToRevenueChart: React.FC<TimeToRevenueChartProps> = ({
  data,
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
      link.download = `real_rails_time_to_revenue_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item: TrajectoryPoint = payload[0].payload;
      return (
        <div className="bg-[#0B1117] border border-[#38BDF8] p-3 rounded-lg shadow-2xl text-xs space-y-1.5 font-sans min-w-[220px]">
          <div className="font-mono text-[#38BDF8] font-bold border-b border-[#1F2937] pb-1 flex justify-between">
            <span>Month {item.month_num} Projection</span>
            <span className="text-gray-400">{item.projected_dau.toLocaleString()} DAU</span>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span>Monthly Gross Liquidity:</span>
            <span className="font-mono font-bold text-white">
              ${item.monthly_gross_revenue_usd.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-emerald-400">
            <span>Creator Pool Payout:</span>
            <span className="font-mono font-bold">
              ${item.monthly_creator_payout_usd.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-[#818CF8]">
            <span>Platform Rail Margin:</span>
            <span className="font-mono font-bold">
              ${item.monthly_platform_margin_usd.toLocaleString()}
            </span>
          </div>
          <div className="pt-1 border-t border-[#1F2937] flex justify-between text-[10px] text-gray-400 font-mono">
            <span>Attention Bandwidth:</span>
            <span>{item.monthly_attention_hours.toLocaleString()} hrs</span>
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 font-mono">
            <span>Cumulative Gross:</span>
            <span>${item.cumulative_gross_revenue_usd.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      ref={chartRef}
      className="p-5 rounded-lg bg-[#0B1117] border border-[#1F2937] real-rails-card relative flex flex-col justify-between"
    >
      {/* Chart Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider text-[#38BDF8] uppercase font-bold">
              TIME-TO-REVENUE TRAJECTORY MODEL
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 font-mono">
              12-Month Compounding
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight mt-0.5">
            Gross Liquidity vs. Creator Pool Distribution
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Dynamic growth curve showing how user attention minutes convert into ad revenue and how value splits over time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportChartAsImage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#030712] hover:bg-[#1F2937] text-gray-200 border border-[#1F2937] hover:border-[#38BDF8]/60 transition-all text-xs font-mono"
            title="Export chart as PNG"
          >
            <Download className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Export Chart</span>
          </button>
        </div>
      </div>

      {/* Intelligence KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 bg-[#030712] p-2.5 rounded border border-[#1F2937]">
        <div>
          <span className="text-[10px] font-mono text-gray-400">Month 12 Gross Run-Rate</span>
          <div className="text-sm font-bold font-mono text-white">
            ${data[data.length - 1]?.monthly_gross_revenue_usd.toLocaleString()}/mo
          </div>
        </div>
        <div>
          <span className="text-[10px] font-mono text-gray-400">12M Cumulative Revenue</span>
          <div className="text-sm font-bold font-mono text-[#38BDF8]">
            ${data[data.length - 1]?.cumulative_gross_revenue_usd.toLocaleString()}
          </div>
        </div>
        <div>
          <span className="text-[10px] font-mono text-gray-400">Annual Creator Pool</span>
          <div className="text-sm font-bold font-mono text-emerald-400">
            ${metrics.annual_creator_payout.toLocaleString()}
          </div>
        </div>
        <div>
          <span className="text-[10px] font-mono text-gray-400">Yield / 1k User Hours</span>
          <div className="text-sm font-bold font-mono text-[#818CF8]">
            ${metrics.yield_per_1000_hours_usd.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="w-full h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="creatorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="platformGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818CF8" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#818CF8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#6B7280"
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "monospace" }}
            />
            <YAxis
              stroke="#6B7280"
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "monospace" }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 10, fontSize: 11, fontFamily: "monospace" }}
            />
            <Area
              type="monotone"
              dataKey="monthly_gross_revenue_usd"
              name="Monthly Gross Revenue ($)"
              stroke="#38BDF8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#grossGradient)"
            />
            <Area
              type="monotone"
              dataKey="monthly_creator_payout_usd"
              name="Creator Payout ($)"
              stroke="#34D399"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#creatorGradient)"
            />
            <Area
              type="monotone"
              dataKey="monthly_platform_margin_usd"
              name="Platform Rail Margin ($)"
              stroke="#818CF8"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#platformGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
