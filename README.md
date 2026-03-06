# KweliNet

**KweliNet** is Kenya's political finance transparency platform — an open-intelligence data explorer that tracks disclosed private donations to political parties, maps political actors, surfaces verified campaign violations, and contextualises the regulatory framework governing money in Kenyan politics.

> _"Kweli"_ is Swahili for _truth_. KweliNet is built on the premise that transparency is the foundation of healthy democracy.

---

## Overview

KweliNet aggregates data from public regulatory sources — primarily the Office of the Registrar of Political Parties (ORPP) — and presents it through interactive, analyst-grade visualisations. The platform is designed for journalists, civil society organisations, researchers, and engaged citizens who want to follow the money in Kenyan politics.

---

## Modules

### 1. Financial Flow (`/`)

The core donation data explorer. Tracks all private donations exceeding KES 1,000,000 declared to the ORPP under Section 31 of the Political Parties Act (PPA).

**Features:**

- Multi-select filtering by year, quarter, party, donor, and donation type
- Animated KPI counter showing filtered donation totals
- **Stacked bar chart** — quarterly donation timeline broken down by party (click-to-filter)
- **Pie chart** — party share of total donations (click-to-filter)
- **Sankey diagram** — capital flow from donor clusters to party treasuries
- **Donor cluster half-pie** — top donor breakdown (groups tail donors into "Other")
- Paginated sortable data table (sort by date or amount)
- CSV export for all charts and the full filtered dataset

### 2. Actor Matrix (`/actors`)

A comprehensive registry of elected officials and affiliated political entities.

**Features:**

- Card-based grid view of politicians with role, county, party, and risk profile
- Risk classification badges: `Critical`, `High`, `Moderate`, `Low`
- Term-limit progress bar per actor
- Detail modal showing capital networks (funding sources) and recorded allegations / audit queries
- Filter by role, county, and risk indicator
- Secure search with input sanitisation guardrail

### 3. Secure Vault (`/vault`)

An anonymous, encrypted whistleblower submission portal.

**Features:**

- Zero-trust UX with simulated Tor routing and air-gapped ledger messaging
- Autocomplete actor search (with input sanitisation)
- Drag-and-drop evidence upload (JPG, PNG, MP4, PDF; max 50 MB)
- Free-text contextual description (500-character cap, PII warning)
- Simulated end-to-end PGP encryption flow with live progress feedback
- Unique trace ID issued on successful submission

### 4. Verified Claims (`/claims`) — _Wall of Shame_

A curated registry of fact-checked, analyst-verified whistleblower evidence.

**Features:**

- Animated header statistics (verified scandal count and estimated misappropriated funds)
- Card grid with severity badges (`Critical`, `High`, `Medium`)
- Full detail modal per incident with verdict summary and metadata
- Filter by politician role; search by name or incident title
- Load-more pagination

### 5. Regulatory Context (`/regulatory`)

An interactive database of Kenya's political finance regulatory framework.

**Features:**

- Animated zoomable map centred on Kenya (via `react-simple-maps` + TopoJSON)
- Year tabs: 2016, 2018, 2023
- Category tabs: Bans on Private Income · Public Funding · Spending Regulations · Reporting & Sanctions
- Paginated Q&A table sourced from the Political Parties Act and Election Campaign Financing Act
- Data export button

### 6. Admin Hub (`/admin`) — _unlisted route_

A secure internal operations panel for KweliNet analysts, protected by Firebase Authentication.

**Features:**

- **Review Queue** — triage incoming whistleblower payloads; view AI tamper-probability scores; approve or dismiss claims
- **Post-approval pipeline** — draft and publish verified incidents to the Wall of Shame
- **Entity Management** — inject new records directly into Financial Flow, Actor Matrix, or Regulatory modules via context-aware forms

### 7. Auth Portal (`/auth`) — _unlisted route_

A secure login screen for internal analysts.

**Features:**

- Split-screen cinematic layout with financial network imagery
- Glassmorphism authentication form using Framer Motion
- Firebase Authentication integration with environment-variable configuration
- Automatic routing to Admin Hub on successful sign-in

---

## Tech Stack

| Layer       | Technology                                   |
| ----------- | -------------------------------------------- |
| Framework   | React 19 + TypeScript                        |
| Build Tool  | Vite 7                                       |
| Routing     | React Router DOM v6                          |
| Styling     | Tailwind CSS v3                              |
| Charts      | Recharts (bar, pie), custom D3 Sankey        |
| Map         | react-simple-maps + TopoJSON (Natural Earth) |
| Graph/Flow  | @xyflow/react, ReactFlow, Canvas API (Hero)  |
| Animation   | Framer Motion                                |
| Auth & DB   | Firebase (Authentication)                    |
| File Upload | react-dropzone                               |
| Icons       | Lucide React, React Icons                    |
| Crypto (UI) | node-forge (simulated encryption layer)      |
| Linting     | ESLint + typescript-eslint                   |

---

## Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm run dev

# Type-check and build for production
npm run build

# Preview the production build
npm run preview
```

The app runs at `http://localhost:5173` by default.

---

## Project Structure

```
kweliNet/
├── src/
│   ├── App.tsx              # Route definitions
│   ├── layouts/Layout.tsx   # Sidebar + mobile header shell
│   ├── lib/
│   │   └── firebase.ts      # Firebase Auth initialization
│   ├── contexts/
│   │   └── ThemeContext.tsx  # Dark / Light mode provider
│   ├── components/          # Shared reusable components
│   │   ├── SankeyChart.tsx
│   │   ├── MultiSelectDropdown.tsx
│   │   ├── AnimatedCounter.tsx
│   │   └── TypewriterText.tsx
│   ├── modules/             # Feature modules (one folder per route)
│   │   ├── Homepage/
│   │   ├── Auth/            # Admin login interface
│   │   ├── FinancialFlow/
│   │   ├── ActorMatrix/
│   │   ├── SecureVault/
│   │   ├── VerifiedClaims/
│   │   ├── Regulatory/
│   │   └── AdminHub/
│   └── data/                # Mock datasets
│       ├── mockFinancialData.ts
│       └── mockActorData.ts
└── public/                  # Static assets (logo, etc.)
```

---

## Data Sources

KweliNet currently ships with mock data closely modelled on real ORPP disclosure reports, IDEA political finance database entries, and publicly available tribunal records. Live data ingestion pipelines are in development.

- **Financial Flow data** — based on ORPP published declaration report (last updated: 28 November 2025)
- **Regulatory data** — sourced from [International IDEA Political Finance Database](https://www.idea.int/data-tools/data/political-finance-database), updated with Kenyan gazette notices and tribunal rulings
- **Contact / tips** — `investigations@kwelinet.or.ke`

---

## Disclaimer

All data presented is sourced from public regulatory filings and verified whistleblower submissions. KweliNet does not publish unverified claims. The platform explicitly excludes statutory public transfers (Political Parties Fund disbursements), informal harambee networks, and donations below the KES 1M disclosure threshold — these limitations are clearly communicated within the application.
