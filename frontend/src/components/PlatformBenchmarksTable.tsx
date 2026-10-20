"use client";

import React, { useState } from "react";
import { PlatformBenchmark } from "@/types";
import { ShieldCheck, Search, ArrowUpDown, ExternalLink } from "lucide-react";

interface PlatformBenchmarksTableProps {
  platforms: PlatformBenchmark[];
}

export const PlatformBenchmarksTable: React.FC<PlatformBenchmarksTableProps> = ({
  platforms,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof PlatformBenchmark>("creator_rev_share_pct");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = platforms.filter(
    (p) =>
      p.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.primary_format.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];
    if (typeof valA === "number" && typeof valB === "number") {
      return sortAsc ? valA - valB : valB - valA;
    }
    return sortAsc
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const toggleSort = (col: keyof PlatformBenchmark) => {
    if (sortBy === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(col);
      setSortAsc(false);
    }
  };

  return (
    <div className="p-5 rounded-lg bg-[#0B1117] border border-[#1F2937] real-rails-card flex flex-col justify-between">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider text-[#818CF8] uppercase font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[#818CF8]" />
              INSTITUTIONAL PLATFORM BENCHMARKS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#818CF8]/15 text-[#818CF8] border border-[#818CF8]/30 font-mono">
              Attention Rail Hegemony Matrix
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight mt-0.5">
            Comparative Take-Rates, CPMs & Governance Vectors
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Auditing how algorithmic gatekeepers extract economic rents from user screen time and creator output.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search platforms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded bg-[#030712] border border-[#1F2937] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#38BDF8]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-[#1F2937]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#030712] text-gray-400 font-mono text-[11px] border-b border-[#1F2937]">
            <tr>
              <th
                onClick={() => toggleSort("platform")}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-white"
              >
                Platform
              </th>
              <th className="py-2.5 px-3 font-semibold">Primary Format</th>
              <th
                onClick={() => toggleSort("avg_session_min")}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-white"
              >
                Session (min)
              </th>
              <th
                onClick={() => toggleSort("avg_cpm_usd")}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-white"
              >
                Clearing CPM
              </th>
              <th
                onClick={() => toggleSort("creator_rev_share_pct")}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-white"
              >
                Creator Share
              </th>
              <th
                onClick={() => toggleSort("platform_take_rate_pct")}
                className="py-2.5 px-3 font-semibold cursor-pointer hover:text-white"
              >
                Platform Take
              </th>
              <th className="py-2.5 px-3 font-semibold">Governance & Rail Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F2937]">
            {sorted.map((item) => (
              <tr
                key={item.platform}
                className="hover:bg-[#030712]/60 transition-colors group"
              >
                <td className="py-2.5 px-3 font-semibold text-white font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                  {item.platform}
                </td>
                <td className="py-2.5 px-3 text-gray-300">{item.primary_format}</td>
                <td className="py-2.5 px-3 font-mono text-gray-200">
                  {item.avg_session_min}m
                </td>
                <td className="py-2.5 px-3 font-mono text-[#38BDF8] font-bold">
                  ${item.avg_cpm_usd.toFixed(2)}
                </td>
                <td className="py-2.5 px-3 font-mono">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.creator_rev_share_pct >= 50
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                        : item.creator_rev_share_pct >= 25
                        ? "bg-amber-950 text-amber-300 border border-amber-800/50"
                        : "bg-rose-950 text-rose-300 border border-rose-800/50"
                    }`}
                  >
                    {item.creator_rev_share_pct}%
                  </span>
                </td>
                <td className="py-2.5 px-3 font-mono">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.platform_take_rate_pct > 70
                        ? "bg-rose-950 text-rose-300 border border-rose-800/50"
                        : "bg-indigo-950 text-indigo-300 border border-indigo-800/50"
                    }`}
                  >
                    {item.platform_take_rate_pct}%
                  </span>
                </td>
                <td className="py-2.5 px-3 text-gray-400 text-[11px] max-w-[280px]">
                  <div className="text-gray-200 font-medium">{item.governance_model}</div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {item.attention_rail_control}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
