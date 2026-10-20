# POC-45: Creator Distribution Funnel
### Real Rails Intelligence Library | Rail Category: Distribution & Demand

This repository implements the production-style demo **'Creator Distribution Funnel'** for the Real Rails Intelligence Library. It models and audits the core attention rail—**Distribution & Demand**—simulating how post impressions, viewer watch time, CTR interactions, and conversion events translate into gross platform liquidity, and evaluating how platform intermediaries extract rent vs. distribute yields to content creators.

---

## 🏛️ Architecture Overview

- **Core Rail**: Distribution & Demand.
- **Data Ingestion**:
  - **GDELT Project 2.0**: Global Database of Events, Language, and Tone tracking media attention volume, tone scores, and coverage velocity.
  - **Our World in Data (OWID)**: Daily Screen Time, Social Media Usage per capita.
  - **World Bank Data**: Internet Penetration, Digital Ad Spend per user.
  - **Synthetic Calibrated Feed**: Well-labeled event stream with **post impressions, watch time (hours & seconds), CTR, and conversion events**.

- **Backend (Python FastAPI + DuckDB + Pandas)**:
  - Reusable adapters:
    - `adapters/gdelt_adapter.py`: GDELT 2.0 ETL & media velocity signals.
    - `adapters/synthetic_stream_adapter.py`: Calibrated event-stream generation.
  - Engines:
    - `funnel_engine.py`: 5-Stage Distribution Funnel, Cohort Comparison, Platform Split, Multi-Persona Copy.
    - `data_engine.py`: GeoJSON global attention rails and regional benchmarks.
    - `simulator.py`: Mathematical 12-month compounding trajectory and ad load fatigue curves.
  - Endpoints:
    - `GET /api/health` - Telemetry health probe
    - `GET /api/metadata` - Lineage and protocol parameters
    - `GET /api/funnel` - 5-Stage Funnel with drop-offs, conversions, and monetization overlays
    - `GET /api/cohorts` - Side-by-side Creator Tier & Traffic Pipeline cohort comparisons
    - `GET /api/platform-split` - Platform split with GDELT sentiment tone and algorithmic gate ratings
    - `GET /api/gdelt-signals` - Ingested GDELT media attention volume, velocity, and tone
    - `GET /api/personas` - Tailored explanation copy for Everyday Viewers, Builders, and Allocators
    - `GET /api/sidebar` - Structured feed for the 30% Intelligence Sidebar (Sections A, B, C, D, E)
    - `GET /api/sample-data` - Downloadable synthetic event dataset (CSV & JSON)
    - `GET /api/mock-fallback` - Zero-downtime offline fallback cache

- **Frontend (Next.js 16 + TypeScript + Tailwind CSS)**:
  - Visual identity: Obsidian Black `#030712`, Deep Navy cards `#0B1117`, Electric Cyan `#38BDF8`, Indigo `#818CF8`.
  - Reusable data adapters:
    - `services/adapters/gdeltAdapter.ts`
    - `services/adapters/syntheticStreamAdapter.ts`
    - `services/adapters/funnelAdapter.ts`
  - Required Features:
    1. **Funnel Stages (`FunnelStagesView.tsx`)**: 5-stage funnel visualizer (Post Impressions → Engaged Watch Time → CTR → Conversion Events → Economic Gross Yield) with drop-off % chips, transition mechanics, and leakage analysis.
    2. **Cohort Compare (`CohortCompareView.tsx`)**: Side-by-side comparative analysis across Creator Tiers (Superstar, Top Network, Mid-Tier, Emerging) and Traffic Pipelines (Organic, Algorithmic, Paid) with disparity multipliers.
    3. **Platform Split (`PlatformSplitView.tsx`)**: Market share breakdown across YouTube, TikTok, Meta / Instagram, Twitch, X, and Substack with GDELT tone indicators and creator sovereignty ratings.
    4. **Content Type Filters**: Multi-select filter bar (Short-form Video, Long-form Video, Livestream, Static / Carousel, Newsletter / Article).
    5. **Monetization Overlays**: Toggles for Ad-Share (CPM), Subscriptions / Memberships, Brand Sponsorships, Commerce / Affiliates, and Platform Rent Tax.
    6. **'Why this matters' Panel**: Tailored infrastructure copy for Everyday Viewers, Builders, and Allocators.
    7. **'Who controls the rail' Panel**: Institutional power matrix auditing algorithmic gatekeepers, ad auction clearinghouses, and unilateral contracts.
    8. **Audience Lens Selector**: Persona switcher in the header for Viewers, Builders, Allocators, or Unified View.
    9. **Downloadable Sample Data**: One-click CSV and JSON export of calibrated synthetic post events.

---

## 🚀 Running Locally

### 1. Start the FastAPI Backend
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API runs at: `http://127.0.0.1:8000`  
Docs: `http://127.0.0.1:8000/docs`

### 2. Start the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
Dashboard opens at: `http://localhost:3000`

---

## 🛡️ Guardrails & Compliance Checklist
- [x] Background is `#030712` (Obsidian Black).
- [x] Sidebar occupies exactly 30% width (`flexBasis: 30%`).
- [x] Main stage occupies 70% width (`flexBasis: 70%`).
- [x] Ingests GDELT 2.0 with live endpoint and robust offline fallback.
- [x] Well-labeled synthetic event feed: post impressions, watch time, CTR, conversion events.
- [x] Funnel stages with drop-off rates and leak mechanics.
- [x] Cohort comparison with Creator Tiers and Traffic Pipelines.
- [x] Platform split with GDELT sentiment tone and algorithmic gate ratings.
- [x] Content type filters and monetization overlays.
- [x] 'Why this matters' panel with tailored copy for viewers, builders, allocators.
- [x] 'Who controls the rail' panel with institutional governance vectors.
- [x] Sample data downloadable in CSV and JSON formats.
