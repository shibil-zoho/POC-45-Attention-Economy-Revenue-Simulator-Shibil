"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Globe, MapPin, ExternalLink, Sparkles, TrendingUp } from "lucide-react";
import { GeoCollection, GeoFeature } from "@/types";

// Dynamic import of Leaflet components with ssr: false
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface GlobalAttentionMapProps {
  geoData: GeoCollection | null;
}

export const GlobalAttentionMap: React.FC<GlobalAttentionMapProps> = ({
  geoData,
}) => {
  const [selectedFeature, setSelectedFeature] = useState<GeoFeature | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (geoData?.features && geoData.features.length > 0) {
      setSelectedFeature(geoData.features[0]);
    }
  }, [geoData]);

  if (!mounted) {
    return (
      <div className="w-full h-[520px] rounded-lg bg-[#0B1117] border border-[#1F2937] flex items-center justify-center text-gray-400 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#38BDF8] animate-spin" />
          <span>INITIALIZING PROFESSIONAL LEAFLET PROJECTION ENGINE...</span>
        </div>
      </div>
    );
  }

  const features = geoData?.features || [];

  return (
    <div className="p-5 rounded-lg bg-[#0B1117] border border-[#1F2937] real-rails-card flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider text-[#38BDF8] uppercase font-bold flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-[#38BDF8]" />
              GLOBAL ATTENTION RAILS (LEAFLET PROJECTION ENGINE)
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 font-mono">
              OWID + World Bank Ingestion
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white tracking-tight mt-0.5">
            Geographic Attention Arbitrage & Regional Yields
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Real geographic coordinates rendered via professional projection library. Shows screen time vs CPM liquidity by nation.
          </p>
        </div>

        {/* Global benchmarks indicator */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-[#030712] px-3 py-1.5 rounded border border-[#1F2937]">
            <span className="text-gray-400">Global Median CPM:</span>{" "}
            <span className="text-[#38BDF8] font-bold">
              ${geoData?.metadata?.global_median_cpm?.toFixed(2) || "16.40"}
            </span>
          </div>
          <div className="bg-[#030712] px-3 py-1.5 rounded border border-[#1F2937]">
            <span className="text-gray-400">Top Yield Rail:</span>{" "}
            <span className="text-emerald-400 font-bold">
              {geoData?.metadata?.highest_yield_region || "United States"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Map + Selected Region Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Leaflet Map Stage (3 cols) */}
        <div className="lg:col-span-3 h-[420px] rounded-lg overflow-hidden border border-[#1F2937] relative">
          <MapContainer
            center={[20.0, 10.0]}
            zoom={2}
            minZoom={2}
            maxZoom={8}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", background: "#030712" }}
          >
            {/* Dark cartographic tile layer */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {features.map((feat) => {
              const p = feat.properties;
              const coords: [number, number] = [feat.geometry.coordinates[1], feat.geometry.coordinates[0]];
              const isSelected = selectedFeature?.id === feat.id;

              // Size based on CPM
              const radius = Math.max(6, Math.min(22, p.avg_cpm_usd * 0.75));
              const fillColor = p.avg_cpm_usd > 18 ? "#38BDF8" : p.avg_cpm_usd > 10 ? "#818CF8" : "#F59E0B";

              return (
                <CircleMarker
                  key={feat.id}
                  center={coords}
                  radius={radius}
                  pathOptions={{
                    fillColor: fillColor,
                    fillOpacity: isSelected ? 0.9 : 0.6,
                    color: isSelected ? "#FFFFFF" : fillColor,
                    weight: isSelected ? 2.5 : 1,
                  }}
                  eventHandlers={{
                    click: () => setSelectedFeature(feat),
                  }}
                >
                  <Popup>
                    <div className="p-1 space-y-1 text-xs">
                      <div className="font-bold text-[#38BDF8] flex justify-between gap-2">
                        <span>{p.country}</span>
                        <span className="text-white">${p.avg_cpm_usd.toFixed(2)} CPM</span>
                      </div>
                      <div className="text-gray-300">
                        Screen Time: <strong>{p.daily_screen_time_mins} mins/day</strong>
                      </div>
                      <div className="text-gray-300">
                        Internet Users: <strong>{p.internet_penetration_pct}% (WB)</strong>
                      </div>
                      <div className="text-emerald-400 font-mono">
                        Yield/1k hrs: ${p.yield_per_1000_attention_hours_usd.toFixed(2)}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Selected Region Telemetry Inspector (1 col) */}
        <div className="h-[420px] rounded-lg bg-[#030712] border border-[#1F2937] p-4 flex flex-col justify-between">
          {selectedFeature ? (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#38BDF8] uppercase">
                    REGIONAL TELEMETRY
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1F2937] text-gray-300">
                    {selectedFeature.properties.region}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mt-1">
                  {selectedFeature.properties.country}
                </h4>

                <div className="mt-3 space-y-2.5">
                  <div className="p-2 rounded bg-[#0B1117] border border-[#1F2937]">
                    <div className="text-[10px] font-mono text-gray-400">Average Clearing CPM</div>
                    <div className="text-base font-bold font-mono text-white mt-0.5 flex items-baseline justify-between">
                      <span>${selectedFeature.properties.avg_cpm_usd.toFixed(2)}</span>
                      <span
                        className={`text-[10px] font-mono ${
                          selectedFeature.properties.cpm_pct_vs_median >= 0
                            ? "text-emerald-400"
                            : "text-amber-400"
                        }`}
                      >
                        {selectedFeature.properties.cpm_pct_vs_median >= 0 ? "+" : ""}
                        {selectedFeature.properties.cpm_pct_vs_median}% vs median
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-[#0B1117] border border-[#1F2937]">
                    <div className="text-[10px] font-mono text-gray-400">Daily Screen Time (OWID)</div>
                    <div className="text-sm font-bold font-mono text-[#38BDF8] mt-0.5">
                      {selectedFeature.properties.daily_screen_time_mins} mins / day
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Social Media: {selectedFeature.properties.social_media_mins} mins
                    </div>
                  </div>

                  <div className="p-2 rounded bg-[#0B1117] border border-[#1F2937]">
                    <div className="text-[10px] font-mono text-gray-400">Internet Penetration (World Bank)</div>
                    <div className="text-sm font-bold font-mono text-white mt-0.5">
                      {selectedFeature.properties.internet_penetration_pct}%
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Annual Ad Spend: ${selectedFeature.properties.digital_ad_spend_per_user_usd}/user
                    </div>
                  </div>

                  <div className="p-2 rounded bg-[#0B1117] border border-[#1F2937]">
                    <div className="text-[10px] font-mono text-gray-400">Annual Gross Yield Per User</div>
                    <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                      ${selectedFeature.properties.estimated_annual_yield_per_user_usd.toFixed(2)} / yr
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Yield/1k hrs: ${selectedFeature.properties.yield_per_1000_attention_hours_usd.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-gray-500 pt-2 border-t border-[#1F2937] flex items-center justify-between">
                <span>Coordinates:</span>
                <span>
                  {selectedFeature.geometry.coordinates[1].toFixed(2)}°N,{" "}
                  {selectedFeature.geometry.coordinates[0].toFixed(2)}°E
                </span>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-gray-500 font-mono text-center">
              Click a country node to inspect attention yield telemetry
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
