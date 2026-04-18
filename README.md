# RatioX — Portfolio Rebalancing Intelligence

> Track drift. Restore balance. Invest with discipline.

RatioX is a portfolio management and rebalancing intelligence platform for self-directed investors in India. It monitors *drift*, the silent deviation of your actual asset allocation from your intended target caused by market movements, and generates actionable rebalancing plans to bring your portfolio back in line.

---

## The Problem

You set a target allocation: 60% equity, 30% debt, 10% gold.

Markets move. Equity runs up. Without touching a single holding, your portfolio has shifted to 75% equity — carrying risk you never agreed to, and exposing you to a drawdown you never planned for.

This is **drift**. It happens to every portfolio. Most investors only notice it during a crash, when it is already too late. No broker tracks it for you. No dashboard warns you.

RatioX does.

---

## Features

**Drift Analysis Engine**
Calculates the gap between your current and target allocation in real time across fully customizable asset classes. The moment drift crosses your threshold, RatioX flags it.

**Rebalance Intelligence**
Generates a precise list of buy and sell orders to restore your target allocation. Accounts for fresh capital inflows (SIP or lumpsum) to minimize unnecessary selling and reduce transaction costs.

**Tax Harvesting Guard**
Every rebalancing suggestion is pre-tagged with its tax classification — Long Term Capital Gain (LTCG) or Short Term Capital Gain (STCG) — before you act. Built for Indian tax rules so you never trigger an avoidable short-term tax event.

**Portfolio Health Score**
A composite metric that quantifies overall portfolio health at a glance, backed by a custom financial math library handling weighted average cost basis, drift percentage, and CAGR via Internal Rate of Return methodology.

**Universal Instrument Search**
Search and add live instruments across NSE and BSE equities, mutual funds via AMFI, and ETFs from a single search bar. Handles Indian market specifics like NSE/BSE ticker suffixes natively via a Yahoo Finance proxy.

**Immersive Dashboard**
A high-fidelity interface with a Three.js canvas globe, Recharts allocation charts, and a custom DriftWatch design system. Designed to feel like a professional-grade tool.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Vite 5 + React 18 + TypeScript 6 |
| Styling | Tailwind CSS 3 + custom DriftWatch design system |
| UI Components | Shadcn/UI (Radix Primitives) |
| State and Data Fetching | TanStack Query (React Query) |
| Backend and Auth | Supabase (PostgreSQL + GoTrue Auth) |
| Charts | Recharts |
| 3D Graphics | Three.js + React Three Fiber |
| Market Data | Yahoo Finance API (via Vite proxy) + AMFI API |
| Forms | React Hook Form + Zod |
| Fonts | Space Grotesk, Outfit, IBM Plex Mono |
| Utilities | date-fns, Lucide React, Papaparse |
| Testing | Vitest + Playwright |

---

## Project Structure

```
src/
├── api/
│   └── portfolio.ts         # Portfolio CRUD and Supabase data layer
├── components/
│   ├── Globe.tsx            # Three.js canvas globe
│   ├── Hero.tsx             # Landing page hero
│   └── ui/                  # Shadcn component library
├── context/
│   └── AuthContext.tsx      # Auth state and session management
├── lib/
│   ├── drift-engine.ts      # Core math: drift %, health score, CAGR/IRR
│   └── market-data.ts       # NSE/BSE and AMFI market data adapters
├── pages/
│   ├── Index.tsx            # Landing page
│   ├── Dashboard.tsx        # Portfolio command center
│   ├── Onboarding.tsx       # Portfolio setup wizard
│   ├── LearnDrift.tsx       # Educational content on drift
│   └── TaxHarvesting.tsx    # LTCG/STCG breakdown per trade
└── main.tsx
```

---

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/onboarding` | 2-step setup: name your portfolio and define target allocations |
| `/dashboard` | Live drift tracking, health score, positions ledger, rebalance plan |
| `/dashboard/tax-harvesting` | Tax implication breakdown per suggested trade |
| `/learn-drift` | Explainer on how drift works and why it matters |


## Authors

**Aditya Nawle** 

**Anantha Vishwa Priya**

---

## License

Copyright (c) 2025 Aditya Nawle and Anantha Vishwa Priya. All rights reserved.

This repository and all of its contents are proprietary and confidential. No part of this codebase may be reproduced, copied, modified, merged, published, distributed, sublicensed, or sold in any form, by any means, without explicit prior written permission from both authors.

Unauthorized use of this code is strictly prohibited.
