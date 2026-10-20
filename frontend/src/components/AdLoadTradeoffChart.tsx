"use client";

import React, { useRef } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { Download, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import html2canvas from "html2canvas";
import { TradeoffPoint, SimulationMetrics } from "@/types";

interface AdLoadTradeoffChartProps {
  data: TradeoffPoint[];
  metrics: SimulationMetrics;
  currentAdLoad: number;
}

export const AdLoadTradeoffChart: React.FC<AdLoadTradeoffChartProps> = ({
  data,
  metrics,
  currentAdLoad,
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
      link.download = `real_rails_ad_load_tradeoff_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  const peakPoint = data.find((d) => d.is_revenue_maximizing_point) || data[3];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item: TradeoffPoint = payload[0].payload;
      return (
        <div className="bg-[#0B1117] border border-[#38BDF8] p-3 rounded-lg shadow-2xl text-xs space-y-1.5 font-sans min-w-[220px]">
          <div className="font-mono text-[#38BDF8] font-bold border-b border-[#1F2937] pb-1 flex justify-between items-center">
            <span>Ad Density: {item.ad_load_per_10m} / 10m</span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                item.is_revenue_maximizing_point
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                  : item.ad_load_per_10m < (peakPoint?.ad_load_per_10m || 2.2)
                  ? "bg-blue-950 text-blue-300 border border-blue-800"
                  : "bg-rose-950 text-rose-300 border border-rose-800"
              }`}
            >
              {item.state_indicator}
            </span>
          </div>
          <div className="flex justify-between items-center text-gray-300">
            <span>Daily Gross Revenue:</span>
            <span className="font-mono font-bold text-white">
              ${item.daily_gross_revenue_usd.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-cyan-400">
            <span>Effective Session:</span>
            <span className="font-mono font-bold">
              {item.effective_session_mins} mins
            </span>
          </div>
          <div className="flex justify-between items-center text-rose-400">
            <span>Session Loss to Churn:</span>
            <span className="font-mono font-bold">-{item.session_loss_pct}%</span>
          </div>
          <div className="pt-1 border-t border-[#1F2937] flex justify-between text-[10px] text-gray-400 font-mono">
            <span>Fatigue Friction Score:</span>
            <span>{item.fatigue_risk_score} / 100</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      ref={chartRef}
      className="p-5 rounded-lg bg-[#0B1117] border border-[#1F2937] real-rails-card flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider text-rose-400 uppercase font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              AD FATIGUE & CHURN TRADE-OFF CURVE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-950/40 text-rose-300 border border-rose-800/40 font-mono">
              Laffer Curve of Attention
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight mt-0.5">
            Monetization Yield vs. Audience Retention Decay
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Demonstrates the critical inflection point where aggressive ad injection degrades session length and contracts total platform revenue.
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

      {/* Inflection Insights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded bg-[#030712] border border-blue-900/40">
          <div className="text-[10px] font-mono text-blue-400 uppercase">Zone 1: Under-Monetized</div>
          <div className="text-xs text-gray-300 mt-1">
            Ad density below <span className="font-mono text-white font-bold">2.0 / 10m</span> leaves auction liquidity uncaptured without meaningful retention gains.
          </div>
        </div>

        <div className="p-3 rounded bg-[#030712] border border-emerald-900/40 real-rails-glow-cyan">
          <div className="text-[10px] font-mono text-emerald-400 uppercase flex items-center justify-between">
            <span>Zone 2: Sweet Spot Peak</span>
            <Zap className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-xs text-gray-200 mt-1">
            Max Gross Liquidity occurs at{" "}
            <span className="font-mono text-emerald-300 font-bold">
              {peakPoint ? `${peakPoint.ad_load_per_10m} ads/10m` : "2.2 ads/10m"}
            </span>{" "}
            (${peakPoint?.daily_gross_revenue_usd.toLocaleString()}/day).
          </div>
        </div>

        <div className="p-3 rounded bg-[#030712] border border-rose-900/40">
          <div className="text-[10px] font-mono text-rose-400 uppercase">Zone 3: Fatigue Destruction</div>
          <div className="text-xs text-gray-300 mt-1">
            Beyond 3.5 ads/10m, user abandonment collapses session length by up to{" "}
            <span className="font-mono text-rose-400 font-bold">45%</span>.
          </div>
        </div>
      </div>

      {/* Recharts Composed Chart */}
      <div className="w-full h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 15, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis
              dataKey="ad_load_per_10m"
              stroke="#6B7280"
              tickLine={false}
              unit=" ads"
              tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "monospace" }}
            />
            <YAxis
              yAxisId="left"
              stroke="#6B7280"
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "monospace" }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#6B7280"
              tickLine={false}
              unit=" min"
              tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "monospace" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 10, fontSize: 11, fontFamily: "monospace" }}
            />
            
            {/* Optimal reference line */}
            {peakPoint && (
              <ReferenceLine
                x={peakPoint.ad_load_per_10m}
                stroke="#34D399"
                strokeDasharray="3 3"
                label={{
                  value: "Max Revenue Peak",
                  fill: "#34D399",
                  fontSize: 10,
                  fontFamily: "monospace",
                }}
              />
            )}

            {/* Current user slider reference line */}
            <ReferenceLine
              x={currentAdLoad}
              stroke="#38BDF8"
              strokeWidth={2}
              label={{
                value: `Current: ${currentAdLoad}`,
                fill: "#38BDF8",
                fontSize: 10,
                fontFamily: "monospace",
              }}
            />

            <Bar
              yAxisId="left"
              dataKey="daily_gross_revenue_usd"
              name="Daily Gross Revenue ($)"
              fill="#38BDF8"
              opacity={0.7}
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="effective_session_mins"
              name="Effective Session (Mins)"
              stroke="#F43F5E"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#F43F5E" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
