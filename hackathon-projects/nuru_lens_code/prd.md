Below is a **clear, Cursor-friendly Product Requirements Document (PRD)**.
It is written so an AI coding assistant (like **Cursor**) can **understand the system architecture and generate code systematically**.

The PRD focuses on:

* Clear scope (important for hackathons)
* Technical architecture
* Data models
* APIs
* Features
* Success criteria

You can paste this directly into Cursor as `PRD.md`.

---

# NuruLens Product Requirements Document (PRD)

## 1. Project Overview

**Product Name:** NuruLens
**Type:** Campaign Finance Transparency Platform
**Platform:** Web Application
**Framework:** Next.js Full Stack

NuruLens is a web-based platform designed to improve transparency in political campaign financing in Kenya.

The platform enables citizens, journalists, and oversight institutions to track campaign funding, monitor compliance with legal spending limits, and identify suspicious financial patterns through automated analytics.

The system provides verified financial records, candidate transparency profiles, public dashboards, and automated compliance monitoring.

---

# 2. Problem Statement

Campaign finance in Kenya lacks transparent, accessible monitoring systems.

Current issues include:

* Limited public visibility into campaign funding
* Difficult-to-access financial declarations
* No real-time monitoring of campaign spending
* Weak enforcement of spending limits
* Lack of automated tools to detect financial irregularities

NuruLens addresses these gaps by creating a centralized platform that combines verified financial data, analytics, and public dashboards.

---

# 3. Goals and Objectives

### Primary Goal

Create a working prototype that demonstrates how technology can improve transparency and oversight in campaign financing.

### Objectives

The system should:

* Store and manage campaign finance data
* Provide searchable candidate finance profiles
* Visualize funding and spending patterns
* Automatically check compliance with spending limits
* Detect suspicious financial patterns
* Provide alerts for irregular activity

---

# 4. Target Users

### Citizens

View candidate funding sources and spending behavior.

### Journalists

Investigate campaign finance patterns.

### Civil Society Organizations

Monitor campaign finance compliance.

### Oversight Institutions

Use analytics tools to identify violations.

### Political Candidates

Publicly demonstrate transparency.

---

# 5. Core Features

## 5.1 Candidate Transparency Profiles

Each candidate has a public profile displaying:

* Candidate name
* Political party
* Constituency
* Total funds raised
* Total funds spent
* Spending limit
* Funding breakdown
* Transparency score
* Compliance status

---

## 5.2 Campaign Finance Database

The platform stores structured campaign finance data including:

* Candidates
* Donations
* Spending records
* Compliance alerts
* Transparency scores

The system will use simulated data for the hackathon prototype.

---

## 5.3 Transparency Leaderboard

A ranking system that compares candidates based on:

* Total funds raised
* Spending behavior
* Compliance with legal limits
* Transparency score

Users can filter by:

* Constituency
* County
* National level

---

## 5.4 Compliance Monitoring Engine

Automated checks for campaign finance rules.

Compliance checks include:

* Spending limit violations
* Missing financial disclosures
* Unusual donation spikes
* Repeated donations from single sources

Alerts are generated when violations are detected.

---

## 5.5 Watchdog Alerts Dashboard

Displays financial irregularities detected by the system.

Example alerts:

* Overspending beyond legal limit
* Suspicious donation spikes
* Clustered donations from the same source

Each alert includes:

* Candidate
* Alert type
* Severity level
* Timestamp

---

## 5.6 Data Visualization Dashboard

Interactive charts showing:

* Funding trends
* Spending breakdown
* Candidate comparisons
* Donation timelines

Libraries recommended:

* Recharts
* Chart.js

---

# 6. System Architecture

The platform consists of three major systems:

### 1. Frontend Interface

Built with Next.js React components.

Responsibilities:

* User interface
* Dashboards
* Data visualization
* Candidate pages

---

### 2. Backend API Layer

Built using Next.js API routes.

Responsibilities:

* Database queries
* Data management
* API endpoints
* Communication with analytics engine

---

### 3. Compliance & Analytics Engine

Responsible for automated monitoring.

Functions include:

* Compliance checks
* Transparency scoring
* Anomaly detection
* Alert generation

---

# 7. Technical Stack

Frontend:

* Next.js
* React
* TailwindCSS
* Recharts or Chart.js

Backend:

* Next.js API routes
* Node.js

Database:

* SQLite (for hackathon prototype)
* Prisma ORM

Analytics:

* Custom TypeScript modules

---

# 8. Project Structure

```
nurulens
│
├── app
│   ├── page.tsx
│   ├── candidates
│   ├── leaderboard
│   ├── dashboard
│   └── alerts
│
├── components
│   ├── charts
│   ├── candidate
│   └── ui
│
├── backend
│   ├── services
│   └── controllers
│
├── analytics
│   ├── complianceChecker.ts
│   ├── anomalyDetector.ts
│   ├── scoringEngine.ts
│
├── database
│   ├── schema.prisma
│   └── seed.ts
│
├── lib
│   └── helpers
```

---

# 9. Database Schema

### Candidate

```
id
name
party
constituency
county
```

---

### CampaignFinance

```
id
candidate_id
total_raised
total_spent
spending_limit
last_updated
```

---

### Donations

```
id
candidate_id
donor_name
amount
date
source
```

---

### Alerts

```
id
candidate_id
alert_type
severity
created_at
```

---

### TransparencyScores

```
candidate_id
score
last_calculated
```

---

# 10. API Endpoints

### Get Candidates

```
GET /api/candidates
```

Returns list of all candidates.

---

### Get Candidate Profile

```
GET /api/candidate/:id
```

Returns detailed finance data for a candidate.

---

### Get Leaderboard

```
GET /api/leaderboard
```

Returns candidate rankings.

---

### Get Alerts

```
GET /api/alerts
```

Returns detected compliance alerts.

---

### Get Analytics

```
GET /api/analytics
```

Returns transparency scores and analysis.

---

# 11. Compliance Logic (Prototype)

Example compliance rule:

### Overspending Detection

```
if total_spent > spending_limit:
    createAlert("Overspending")
```

---

### Donation Spike Detection

If donation volume increases rapidly within a short period.

---

### Transparency Score

Score calculation:

```
Transparency Score =
40% disclosure completeness
30% spending compliance
20% reporting timeliness
10% anomaly penalties
```

---

# 12. MVP Scope for Hackathon

The MVP should include:

* Candidate profiles
* Campaign finance database
* Leaderboard
* Compliance checks
* Alerts dashboard
* Data visualization charts

The system will use simulated campaign finance data.

---

# 13. Success Criteria

The prototype is successful if it demonstrates:

* Clear campaign finance tracking
* Automated compliance monitoring
* Transparent candidate comparisons
* Data visualization of political finance
* Detection of financial irregularities

---

# 14. Future Expansion

Future versions could include:

* Integration with official IEBC finance data
* M-Pesa transaction verification
* Machine learning anomaly detection
* Historical election finance analysis
* Political party funding tracking

---

If you want, I can also generate a **Cursor Superprompt** that will make Cursor **generate 70–80% of the NuruLens codebase automatically** (pages, database, APIs, analytics engine) in one shot.
