"use client";

import React from "react";
import { Activity, ShieldCheck, Database, Radio, RefreshCw, Eye, Wrench, PieChart } from "lucide-react";
import { DataSourceStatus } from "@/services/api";
import { PersonaType } from "@/types";

interface HeaderProps {
  status: DataSourceStatus;
  persona: PersonaType;
  onPersonaChange: (p: PersonaType) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  persona,
  onPersonaChange,
  onRefresh,
  isLoading,
}) => {
  return (
    <header className="w-full bg-[#030712] border-b border-[#1F2937] px-5 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
      {/* Brand & Rail Taxonomy */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-[#0B1117] border border-[#38BDF8]/40 flex items-center justify-center real-rails-glow-cyan">
            <Radio className="h-4 w-4 text-[#38BDF8] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#38BDF8] uppercase">
                REAL RAILS INTELLIGENCE
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#1F2937] text-gray-300 font-mono">
                POC-45
              </span>
            </div>
            <h1 className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
              Creator Distribution Funnel
            </h1>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 pl-3.5 border-l border-[#1F2937]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
            Rail:
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#818CF8]/15 text-[#818CF8] border border-[#818CF8]/30 flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8]" />
            Distribution & Demand
          </span>
        </div>
      </div>

      {/* Audience Lens Switcher (Everyday Viewers, Builders, Allocators) */}
      <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0B1117] border border-[#1F2937]">
        <span className="text-[10px] font-mono uppercase text-gray-400 px-2 hidden sm:inline">
          Audience Lens:
        </span>
        <button
          onClick={() => onPersonaChange("all")}
          className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
            persona === "all"
              ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_8px_rgba(56,189,248,0.3)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          All
        </button>
        <button
          onClick={() => onPersonaChange("everyday_viewers")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all ${
            persona === "everyday_viewers"
              ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_8px_rgba(56,189,248,0.3)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Eye className="w-3 h-3" />
          <span>Viewers</span>
        </button>
        <button
          onClick={() => onPersonaChange("builders")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all ${
            persona === "builders"
              ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_8px_rgba(56,189,248,0.3)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Wrench className="w-3 h-3" />
          <span>Builders</span>
        </button>
        <button
          onClick={() => onPersonaChange("allocators")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all ${
            persona === "allocators"
              ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_8px_rgba(56,189,248,0.3)]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <PieChart className="w-3 h-3" />
          <span>Allocators</span>
        </button>
      </div>

      {/* Primary Data Sources & Pipeline Status */}
      <div className="flex items-center gap-3">
        <div className="hidden xl:flex items-center gap-2 text-xs text-gray-400 bg-[#0B1117] px-3 py-1 rounded border border-[#1F2937]">
          <Database className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-mono text-[11px]">Sources:</span>
          <span className="text-gray-200 font-medium font-mono text-[11px]">
            GDELT 2.0 • OWID • World Bank
          </span>
        </div>

        {/* Live Engine vs Mock Fallback Badge */}
        <div className="flex items-center gap-2 bg-[#0B1117] px-2.5 py-1 rounded border border-[#1F2937]">
          <span
            className={`w-2 h-2 rounded-full ${
              status.isLive
                ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                : "bg-amber-400 shadow-[0_0_8px_#fbbf24]"
            }`}
          />
          <span className="text-[11px] font-mono uppercase text-gray-300">
            {status.source === "LIVE_API"
              ? "Live FastAPI Rail"
              : "Offline Fallback"}
          </span>
          {status.isLive && (
            <span className="text-[10px] font-mono text-emerald-400">
              {status.latencyMs}ms
            </span>
          )}
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          title="Sync Simulation State"
          className="p-1.5 rounded bg-[#0B1117] border border-[#1F2937] hover:border-[#38BDF8]/60 text-gray-300 hover:text-[#38BDF8] transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin text-[#38BDF8]" : ""}`}
          />
        </button>
      </div>
    </header>
  );
};
