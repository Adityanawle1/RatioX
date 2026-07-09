# RatioX — Portfolio Rebalancing Intelligence

[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E.svg?style=flat&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg?style=flat)]()

> Track drift. Restore balance. Defend your capital against hidden decay.

RatioX is a state-of-the-art portfolio management and rebalancing intelligence platform specifically engineered for self-directed investors in India. It monitors **drift**—the silent deviation of actual asset allocations from target models caused by market fluctuations—and generates tax-optimized, commission-free rebalancing plans.

---

## 🔍 The Problem

You establish a target asset allocation: **60% Equity, 30% Debt, 10% Gold**.

Over time, markets move. Equity rallies. Without purchasing any new shares, your actual allocation shifts to **75% Equity, 18% Debt, 7% Gold**. 

This is **drift**. It exposes your portfolio to risks you never signed up for and downdraws you didn't plan. Most investors only realize their portfolio has drifted during a market correction when it is already too late. Standard dashboards and brokerage accounts do not track this metric for you.

RatioX does.

---

## ✨ Features

### ⚖️ Drift Analysis Engine
- Calculates asset allocation variance in real-time across fully custom asset classes.
- Instantly alerts you when drift thresholds are breached.
- Computes portfolio health indexes, weighted cost basis, and CAGR using Internal Rate of Return (IRR) math.

### 🧠 Rebalance Intelligence
- Generates precise, tax-optimized buy/sell adjustment checklists.
- Incorporates fresh capital inflows (SIPs or lump sums) dynamically, prioritizing purchasing underweight assets first to minimize exit loads and tax events.

### 📊 Fee Audit & Wealth Drain Projection
- Audits mutual fund portfolios for hidden distributor commission kickbacks (regular vs. direct funds).
- Projects the 30-year wealth decay impact of direct vs. regular mutual fund TER (Total Expense Ratio).

### 🏦 Supported Broker Integrations
- Streamlines portfolio data ingest with parser adapters for CAMS/KFintech Consolidated Account Statements (CAS).
- Integrates cleanly with major Indian brokers including **Zerodha**, **Upstox**, and **Groww**.

### 💸 Tax Harvesting Safeguards
- Pre-calculates tax categories (LTCG vs. STCG) for every recommended transaction.
- Aligns recommendations with Indian Income Tax rules to prevent accidental short-term tax events.

### 🌐 Live Instrument Search
- Features a unified search bar parsing NSE/BSE equities, AMFI mutual funds, and ETFs.
- Resolves ticker formats natively via a secure Yahoo Finance API proxy.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, TypeScript 5
- **Styling**: Vanilla Tailwind CSS 3 + custom glassmorphic DriftWatch design system
- **State Management**: TanStack Query (React Query) v5
- **Database & Auth**: Supabase (PostgreSQL, GoTrue Auth)
- **Charts**: Recharts
- **Animations / 3D**: Three.js, React Three Fiber, Framer Motion primitives
- **Package Manager**: npm / Bun

---

## 📂 Project Structure

```
driftwatch-rebalance-main/
├── .kiro/                  # Product specifications and onboarding specs
├── migrations/             # PostgreSQL database migration scripts
├── public/                 # Static assets, fonts, and icons
├── src/
│   ├── api/                # Data access layers (Supabase CRUD & queries)
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Radix UI and custom styling primitives
│   │   ├── Nav.tsx         # Responsive header navigation
│   │   └── Globe.tsx       # Interactive 3D Canvas Globe
│   ├── context/            # AuthContext for session management
│   ├── lib/
│   │   ├── drift-engine.ts # Math formulas: drift calculation, CAGR, IRR
│   │   └── market-data.ts  # Ticker adapters for NSE/BSE and AMFI
│   ├── pages/              # Main routing views
│   │   ├── AboutUs.tsx     # Reverted typographic about page
│   │   ├── Dashboard.tsx   # Portfolio command center
│   │   ├── Onboarding.tsx  # Wizard setup for target allocations
│   │   └── TaxHarvesting.tsx # Tax-optimized harvest breakdown
│   ├── App.tsx             # Route declarations
│   └── main.tsx            # App entrypoint
├── vercel.json             # Vercel client-side routing rewrites and API proxies
└── tailwind.config.ts      # Tailwind configuration & typography rules
```

---

## 🚀 Getting Started

### Prerequisites

You will need the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher) or [Bun](https://bun.sh/)
- [npm](https://www.npmjs.com/) (usually bundled with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Adityanawle1/RatioX.git
   cd RatioX
   ```

2. **Install dependencies:**
   Using npm:
   ```bash
   npm install
   ```
   Or using Bun:
   ```bash
   bun install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory based on the `.env.example` template:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase project URL, Anon Key, and optionally, API keys for live market news.

4. **Launch the development server:**
   Using npm:
   ```bash
   npm run dev
   ```
   Or using Bun:
   ```bash
   bun dev
   ```
   The site will be available locally at `http://localhost:5173`.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 👥 Authors & Credits

- **Aditya Nawle** — Core Architecture, Mathematical Engine & Audit Log Logic
- **Sachin Jadhav** — Frontend Architecture, Broker Integrations & System Infrastructure
- **Anantha Vishwa Priya** — Contributor

---

## 📄 License

Copyright (c) 2025-2026 Aditya Nawle, Sachin Jadhav, and Anantha Vishwa Priya. All rights reserved.

This repository and its contents are public for inspection and collaborative review. Direct commercial reproduction, distribution, or unauthorized packaging of this codebase is prohibited. For details, contact the authors.
