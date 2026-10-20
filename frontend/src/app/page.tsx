"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { FunnelStagesView } from "@/components/FunnelStagesView";
import { CohortCompareView } from "@/components/CohortCompareView";
import { PlatformSplitView } from "@/components/PlatformSplitView";
import { TimeToRevenueChart } from "@/components/TimeToRevenueChart";
import { AdLoadTradeoffChart } from "@/components/AdLoadTradeoffChart";
import { CreatorSplitChart } from "@/components/CreatorSplitChart";
import { GlobalAttentionMap } from "@/components/GlobalAttentionMap";
import { PlatformBenchmarksTable } from "@/components/PlatformBenchmarksTable";
import {
  SimulationParams,
  SimulationResult,
  GeoCollection,
  PlatformBenchmark,
  FunnelResult,
  CohortSets,
  PlatformSplitItem,
  GDELTData,
  PersonaExplanations,
  PersonaType,
  ContentType,
  MonetizationOverlay,
} from "@/types";
import {
  defaultParams,
  simulateAttentionRevenue,
  fetchHealth,
  fetchSidebarIntelligence,
  fetchGeoAttention,
  fetchPlatformBenchmarks,
  fetchFunnel,
  fetchCohorts,
  fetchPlatformSplit,
  fetchGDELTSignals,
  fetchPersonaExplanations,
  DataSourceStatus,
  calculateLocalSimulation,
} from "@/services/api";
import { FunnelFrontendAdapter } from "@/services/adapters/funnelAdapter";
import mockDataRaw from "@/data/mock_data.json";
import {
  Layers,
  GitCompare,
  Globe,
  TrendingUp,
  AlertTriangle,
  PieChart,
  ShieldCheck,
  Sparkles,
  Radio,
} from "lucide-react";

export default function CreatorDistributionDashboard() {
  const [params, setParams] = useState<SimulationParams>(defaultParams);
  const [persona, setPersona] = useState<PersonaType>("all");
  const [contentType, setContentType] = useState<ContentType>("ALL");
  const [monetizationOverlay, setMonetizationOverlay] =
    useState<MonetizationOverlay>("ALL");

  const [simResult, setSimResult] = useState<SimulationResult>(() =>
    calculateLocalSimulation(defaultParams)
  );
  const [funnelData, setFunnelData] = useState<FunnelResult>(() =>
    FunnelFrontendAdapter.calculateFunnel(
      defaultParams.dau,
      defaultParams.cpm_usd,
      "ALL",
      "ALL"
    )
  );
  const [cohortsData, setCohortsData] = useState<CohortSets>(
    () => (mockDataRaw as any).cohorts
  );
  const [platformSplitData, setPlatformSplitData] = useState<
    PlatformSplitItem[]
  >(() => (mockDataRaw as any).platform_split);
  const [gdeltData, setGdeltData] = useState<GDELTData | null>(
    () => (mockDataRaw as any).gdelt_signals
  );
  const [personasData, setPersonasData] = useState<PersonaExplanations | null>(
    () => (mockDataRaw as any).personas
  );
  const [sidebarData, setSidebarData] = useState<any>(null);
  const [geoData, setGeoData] = useState<GeoCollection | null>(null);
  const [benchmarks, setBenchmarks] = useState<PlatformBenchmark[]>([]);

  const [status, setStatus] = useState<DataSourceStatus>({
    isLive: false,
    source: "LIVE_API",
    latencyMs: 0,
    lastChecked: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<
    | "funnel_stages"
    | "cohort_compare"
    | "platform_split"
    | "time_to_revenue"
    | "tradeoff"
    | "creator_split"
    | "geo_map"
  >("funnel_stages");

  // Initial load
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    const healthStatus = await fetchHealth();
    setStatus(healthStatus);

    const [
      sidebar,
      geo,
      benchmarkData,
      initialSim,
      initialFunnel,
      cohorts,
      platSplit,
      gdelt,
      personas,
    ] = await Promise.all([
      fetchSidebarIntelligence(contentType, monetizationOverlay),
      fetchGeoAttention(),
      fetchPlatformBenchmarks(),
      simulateAttentionRevenue(params),
      fetchFunnel(params.dau, params.cpm_usd, contentType, monetizationOverlay),
      fetchCohorts(),
      fetchPlatformSplit(),
      fetchGDELTSignals(),
      fetchPersonaExplanations(),
    ]);

    setSidebarData(sidebar);
    setGeoData(geo);
    setBenchmarks(benchmarkData);
    setSimResult(initialSim);
    setFunnelData(initialFunnel);
    setCohortsData(cohorts);
    setPlatformSplitData(platSplit);
    setGdeltData(gdelt);
    setPersonasData(personas);
    setIsLoading(false);
  }, [contentType, monetizationOverlay, params]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Reactive simulation recalculation without full page refresh
  const handleParamChange = async (newParam: Partial<SimulationParams>) => {
    const updated = { ...params, ...newParam };
    setParams(updated);

    // Instant local calculations for 60fps responsiveness
    const localRes = calculateLocalSimulation(updated);
    setSimResult(localRes);

    const localFunnel = FunnelFrontendAdapter.calculateFunnel(
      updated.dau,
      updated.cpm_usd,
      contentType,
      monetizationOverlay
    );
    setFunnelData(localFunnel);

    // Live API update if available
    if (status.isLive) {
      try {
        const liveSim = await simulateAttentionRevenue(updated);
        setSimResult(liveSim);
        const liveFunnel = await fetchFunnel(
          updated.dau,
          updated.cpm_usd,
          contentType,
          monetizationOverlay
        );
        setFunnelData(liveFunnel);
      } catch {}
    }
  };

  const handleContentTypeChange = (ct: ContentType) => {
    setContentType(ct);
    const updatedFunnel = FunnelFrontendAdapter.calculateFunnel(
      params.dau,
      params.cpm_usd,
      ct,
      monetizationOverlay
    );
    setFunnelData(updatedFunnel);
  };

  const handleMonetizationChange = (mo: MonetizationOverlay) => {
    setMonetizationOverlay(mo);
    const updatedFunnel = FunnelFrontendAdapter.calculateFunnel(
      params.dau,
      params.cpm_usd,
      contentType,
      mo
    );
    setFunnelData(updatedFunnel);
  };

  const handleReset = () => {
    setContentType("ALL");
    setMonetizationOverlay("ALL");
    handleParamChange(defaultParams);
  };

  return (
    <div className="h-screen w-screen bg-[#030712] text-gray-100 flex flex-col font-sans overflow-hidden">
      {/* Top Header Bar */}
      <Header
        status={status}
        persona={persona}
        onPersonaChange={setPersona}
        onRefresh={loadInitialData}
        isLoading={isLoading}
      />

      {/* Main 2-Column Layout: Main Stage (70%) + Sidebar (30%) strictly */}
      <main className="flex-1 flex flex-col lg:flex-row w-full h-[calc(100vh-57px)] overflow-hidden">
        {/* Main Stage (70% width) */}
        <section
          id="main-stage"
          style={{ width: "70%", flexBasis: "70%" }}
          className="w-full lg:w-[70%] h-full overflow-y-auto p-4 md:p-6 space-y-5 bg-[#030712]"
        >
          {/* Main Stage Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1F2937]">
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0B1117] border border-[#1F2937] overflow-x-auto max-w-full">
              {/* Required Feature 1: Funnel Stages */}
              <button
                onClick={() => setActiveTab("funnel_stages")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium font-mono transition-all ${
                  activeTab === "funnel_stages"
                    ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Funnel Stages</span>
              </button>

              {/* Required Feature 2: Cohort Compare */}
              <button
                onClick={() => setActiveTab("cohort_compare")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium font-mono transition-all ${
                  activeTab === "cohort_compare"
                    ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Cohort Compare</span>
              </button>

              {/* Required Feature 3: Platform Split */}
              <button
                onClick={() => setActiveTab("platform_split")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium font-mono transition-all ${
                  activeTab === "platform_split"
                    ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Platform Split</span>
              </button>

              {/* Time to Revenue Model */}
              <button
                onClick={() => setActiveTab("time_to_revenue")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium font-mono transition-all ${
                  activeTab === "time_to_revenue"
                    ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Time-to-Revenue</span>
              </button>

              {/* Ad Load Tradeoff */}
              <button
                onClick={() => setActiveTab("tradeoff")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium font-mono transition-all ${
                  activeTab === "tradeoff"
                    ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Ad Load Trade-off</span>
              </button>

              {/* Creator Split */}
              <button
                onClick={() => setActiveTab("creator_split")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium font-mono transition-all ${
                  activeTab === "creator_split"
                    ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>Creator Tiers</span>
              </button>

              {/* Global Attention Map */}
              <button
                onClick={() => setActiveTab("geo_map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium font-mono transition-all ${
                  activeTab === "geo_map"
                    ? "bg-[#38BDF8] text-[#030712] font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Global Rails</span>
              </button>
            </div>

            {/* Quick Live Telemetry Strip */}
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400 bg-[#0B1117] px-3 py-1.5 rounded-lg border border-[#1F2937]">
              <span className="text-[#38BDF8] font-bold">
                ${funnelData.total_gross_revenue_usd.toLocaleString()}
              </span>
              <span>/ Day Yield</span>
              <span className="text-gray-600">|</span>
              <span className="text-emerald-400 font-bold">
                {funnelData.stages[0]?.count.toLocaleString()}
              </span>
              <span>Imps</span>
            </div>
          </div>

          {/* Active Visualizer Tab Stage */}
          <div className="space-y-6">
            {activeTab === "funnel_stages" && (
              <FunnelStagesView
                funnel={funnelData}
                contentType={contentType}
                monetizationOverlay={monetizationOverlay}
                persona={persona}
                onContentTypeChange={handleContentTypeChange}
                onMonetizationChange={handleMonetizationChange}
              />
            )}

            {activeTab === "cohort_compare" && (
              <CohortCompareView cohorts={cohortsData} persona={persona} />
            )}

            {activeTab === "platform_split" && (
              <PlatformSplitView
                platforms={platformSplitData}
                gdelt={gdeltData}
                persona={persona}
              />
            )}

            {activeTab === "time_to_revenue" && (
              <TimeToRevenueChart
                data={simResult.trajectory}
                metrics={simResult.metrics}
              />
            )}

            {activeTab === "tradeoff" && (
              <AdLoadTradeoffChart
                data={simResult.tradeoff_curve}
                metrics={simResult.metrics}
                currentAdLoad={params.ad_load_per_10m}
              />
            )}

            {activeTab === "creator_split" && (
              <CreatorSplitChart
                tierSplit={simResult.tier_split}
                metrics={simResult.metrics}
              />
            )}

            {activeTab === "geo_map" && (
              <GlobalAttentionMap geoData={geoData} />
            )}
          </div>

          {/* Secondary Telemetry Strip: Attention Economy & Power Law Audit */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#0B1117] border border-[#1F2937] real-rails-card">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>Effective Attention ARPU</span>
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              </div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                ${simResult.metrics.annual_arpu_usd.toFixed(2)}
                <span className="text-xs text-gray-400 font-sans font-normal">
                  {" "}
                  / user / yr
                </span>
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                Creator share: $
                {simResult.metrics.creator_annual_arpu_usd.toFixed(2)} / user
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1117] border border-[#1F2937] real-rails-card">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>Audience Fatigue Risk</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    simResult.metrics.fatigue_risk_score < 35
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : simResult.metrics.fatigue_risk_score < 65
                      ? "bg-amber-950 text-amber-400 border border-amber-800"
                      : "bg-rose-950 text-rose-400 border border-rose-800"
                  }`}
                >
                  {simResult.metrics.fatigue_status}
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                {simResult.metrics.fatigue_risk_score}
                <span className="text-xs text-gray-400 font-sans font-normal">
                  {" "}
                  / 100 Index
                </span>
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                Session retention loss: -
                {simResult.metrics.session_time_loss_pct}%
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1117] border border-[#1F2937] real-rails-card">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span>Intermediary Rent Extracted</span>
                <span className="text-[10px] font-mono text-[#818CF8] bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800">
                  {simResult.metrics.platform_take_rate_pct}% Take
                </span>
              </div>
              <div className="text-xl font-bold font-mono text-white mt-1">
                ${simResult.metrics.annual_platform_margin.toLocaleString()}
                <span className="text-xs text-gray-400 font-sans font-normal">
                  {" "}
                  Gross Rent
                </span>
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                Net margin retained by distribution platform
              </div>
            </div>
          </div>
        </section>

        {/* Intelligence Sidebar (Strict 30% Width) */}
        <Sidebar
          sidebarData={sidebarData}
          params={params}
          metrics={simResult.metrics}
          persona={persona}
          personasData={personasData}
          onParamChange={handleParamChange}
          onReset={handleReset}
        />
      </main>
    </div>
  );
}
