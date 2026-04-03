# Tech stack — hackathon top 3 and unified product

This document summarizes what each winning team built with, proposes a **unified stack** for the combined TI-Kenya product, and recommends a **scalable** architecture suitable for nationwide use.

---

## 1. Summary by team

### 1st — Technetians (`files/Knight-Watch`)

| Area | Technologies |
|------|----------------|
| **Web app** | Next.js 14, React 18, TypeScript |
| **Styling / UI** | Tailwind CSS, next-themes |
| **Backend & data** | Convex (queries, mutations, real-time backend) |
| **Auth** | NextAuth (e.g. admin credentials) |
| **i18n** | next-intl |
| **Maps** | Leaflet, react-leaflet |
| **Charts** | Recharts |
| **Forms / validation** | react-hook-form, Zod |
| **AI (optional features)** | @google/generative-ai |
| **Integrations (documented)** | Paystack (M-Pesa, cards), Africa’s Talking (USSD/SMS) |
| **Hosting** | Vercel (documented) |

**In short:** Full-stack **Next.js + Convex** civic platform with maps, dashboards, multilingual UI, and telco/payment integrations.

---

### 2nd — Kweli Networks (`files/KweliNet`)

| Area | Technologies |
|------|----------------|
| **Web app** | Vite 7, React 19, TypeScript |
| **Routing** | React Router DOM v6 |
| **Styling / motion** | Tailwind CSS, Framer Motion |
| **Charts & networks** | Recharts, D3, d3-sankey, React Flow / @xyflow/react |
| **Maps** | react-simple-maps (TopoJSON) |
| **Auth** | Firebase Authentication |
| **Uploads / crypto UX** | react-dropzone, node-forge (client-side patterns) |
| **Icons** | lucide-react, react-icons |

**In short:** **Vite + React SPA** focused on analyst-grade visualizations, actor registry, secure vault UX, and Firebase-backed admin auth.

---

### 3rd — Kovela (`files/kovela-kifaruWatch`)

| Area | Technologies |
|------|----------------|
| **Application platform** | Frappe custom app (Python ≥3.10), installed via **bench** |
| **Tooling** | pre-commit, Ruff, ESLint, Prettier, pyupgrade |
| **Automation (fixtures)** | **n8n** workflows: scheduled HTTP ingestion, compliance alerts, Google Sheets sync, Slack reporting, Replicate embeddings for document chunks, webhooks for onboarding |

**In short:** **Frappe/Python** app plus **n8n** pipelines for ingestion, compliance checks, and operational reporting—not a separate React SPA in this repo.

---

## 2. Recommended unified stack (table)

Use one primary web stack and keep orchestration separate so ingestion scales without coupling to the UI.

| Layer | Recommended choice | Role |
|-------|---------------------|------|
| **Frontend** | **Next.js** (App Router) + **TypeScript** + **Tailwind CSS** | One national web app: public dashboards, reporting, admin. Aligns with Knight-Watch; KweliNet charts/maps can be ported as components. |
| **API / business logic** | **Next.js Route Handlers** + **server actions** (or small **Node** services where needed) | Auth, webhooks (Paystack, Africa’s Talking), exports, rate limits. |
| **Primary database** | **PostgreSQL** (managed, e.g. Neon, Supabase, RDS, or Cloud SQL) | Durable relational data at national scale: contributions, reports, audit logs, RBAC. Use **Prisma** or **Drizzle** for schema and migrations. |
| **Caching / sessions** | **Redis** (e.g. Upstash, ElastiCache) | Sessions, rate limiting, USSD session state, hot dashboard aggregates. |
| **Object storage** | **S3-compatible** (e.g. R2, S3, GCS) | Evidence photos/videos, large exports, press kits. |
| **Background jobs** | **Queue** (e.g. BullMQ + Redis, or Cloud Tasks / SQS) + workers | Heavy exports, PDF generation, batch ingestion, notification fan-out. |
| **Orchestration / ETL** | **n8n** (managed or self-hosted) or **Temporal** for stricter workflows | Kovela-style schedules: scrape/sync, compliance runs, Slack digests—without blocking the main app. |
| **Auth** | **NextAuth.js (Auth.js)** or **Clerk** / **Supabase Auth** | Staff/admin; keep anonymous reporting flows separate with strict data minimization. |
| **Maps** | **MapLibre** or **Leaflet** + vector tiles | National map + county drill-down; avoid vendor lock-in where possible. |
| **Charts** | **Recharts** + **D3** (Sankey/networks where needed) | Matches both Knight-Watch and KweliNet patterns. |
| **i18n** | **next-intl** (or equivalent) | English, Kiswahili, extensible locales. |
| **Payments** | **Paystack** | M-Pesa and cards for donations (if product retains Mchango). |
| **USSD / SMS** | **Africa’s Talking** (or equivalent MNO aggregator) | Feature-phone reporting at national scale. |
| **Hosting** | **Vercel** (frontend) + **managed Postgres/Redis** OR **Kubernetes** later | Start simple; scale DB and workers independently. |
| **Observability** | OpenTelemetry, **structured logs**, error tracking (e.g. Sentry), uptime checks | Required for nationwide reliability and incident response. |

**Note:** The hackathon used **Convex** (Knight-Watch) and **Firebase** (KweliNet). For **long-term national scale**, a **single managed Postgres** as the system of record plus **Redis** and **object storage** is the usual pattern. You can still ship an MVP on **Convex** if time-to-market matters, then migrate relational entities to Postgres when volumes and compliance requirements grow.

---

## 3. Scalable stack recommendation (nationwide product)

For a product used **across Kenya**, optimize for **latency**, **reliability**, **cost**, and **clear data ownership**:

1. **Edge-cached static assets** — Use a CDN (built into Vercel or CloudFront/Cloudflare) so pages load fast on mobile networks nationwide.
2. **Regional API** — Deploy API/workers in **Africa** (e.g. `af-south-1` or nearest supported region) to reduce RTT; keep DB in the same region as the app when possible.
3. **Postgres for core data** — Strong consistency, reporting queries, and compliance-friendly backups and point-in-time recovery.
4. **Async everything heavy** — Ingestion, large CSV/PDF exports, and bulk notifications must run in **workers**, not in HTTP request cycles.
5. **Rate limiting & abuse controls** — Redis-backed limits on report submission and public exports; CAPTCHA or equivalent on forms.
6. **File pipeline** — Virus scan / MIME validation, size caps, private buckets, signed URLs for evidence.
7. **Observability & SLOs** — Define uptime and p95 latency targets; alert on errors and queue backlog.

**Minimal “scale-ready” combo:** **Next.js + Postgres + Redis + S3-compatible storage + queue + n8n (or workers) + observability**. That merges the best of all three teams: Knight-Watch’s product surface, KweliNet’s analytics depth, and Kovela’s automation—on an architecture that can grow with national adoption.
