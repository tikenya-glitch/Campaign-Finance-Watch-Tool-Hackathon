# UNIFIED CAMPAIGN FINANCE WATCH PRODUCT SPECIFICATION

- **Version:** 1.0  
- **Date:** 2026-04-01  
- **Prepared for:** Transparency International Kenya (TI-Kenya)  
- **Context:** Consolidated product blueprint based on the three hackathon submissions:
  - 1st place: Technetians (Knight-Watch)
  - 2nd place: Kweli Networks (KweliNet)
  - 3rd place: Kovela (kovela-kifaruWatch)

## 1. Executive Summary

This document defines a single, integrated Campaign Finance Watch platform that combines the strongest capabilities built by all three teams into one coherent product aligned to TI-Kenya hackathon goals:

1. Track political financing
2. Visualize data for public understanding
3. Monitor misuse of public resources in campaigns

The unified product blends:
- Public-facing civic reporting, inclusivity, and accessibility from Knight-Watch
- Advanced analytical intelligence and investigator workflows from KweliNet
- Automated data ingestion, compliance detection, and operational pipelines from Kovela

The result is a layered platform that serves citizens, journalists, CSOs, analysts, and regulators with different permission levels while preserving neutrality, verifiability, and public accountability.

## 2. Hackathon Alignment (TI-Kenya Requirements)

**Requirement A: Track political financing**
- Unified Financial Flow module consolidates contributions, expenditures, and party allocations.
- Automated ingestion pipelines pull disclosures and structured imports on a schedule.
- Candidate-party registry supports ongoing data maintenance.

**Requirement B: Visualize data for public understanding**
- Interactive charts: stacked bars, pies, Sankey flows, KPI counters, trends.
- County and geospatial views with filters and drill-down.
- Regulatory context explorer translates legal framework into understandable Q&A.

**Requirement C: Monitor misuse of public resources in campaigns**
- Multi-channel incident reporting (web + USSD/SMS pathways).
- Evidence upload and verification pipeline.
- Compliance engine flags overspending and high-risk patterns.
- Verified-claims publication surface for trusted public disclosures.

## 3. What Each Team Contributes to the Unified Product

### 3.1 Technetians (Knight-Watch) strengths
- Multi-language platform and localized reporting experience.
- Public misuse reporting with categories, evidence uploads, and verification statuses.
- USSD reporting flow for feature-phone users.
- Accessibility-first components (screen reader, keyboard, high contrast).
- Interactive map + heatmap exploration.
- Export endpoints and press-oriented artifacts.
- Mchango (crowdfunding) concept and payment flow foundation.

### 3.2 Kweli Networks (KweliNet) strengths
- High-fidelity financial intelligence dashboards.
- Multi-dimensional filtering (year, quarter, party, donor, donation type).
- Rich visual analytics (stacked bars, pie, Sankey, donor cluster visuals).
- Actor Matrix (role/county/risk profile registry).
- Secure Vault whistleblower interface with encrypted-submission UX.
- Verified Claims wall with severity and detailed investigative cards.
- Regulatory context module with categorized legal/policy interpretation.
- Admin workflow for triage, approval, and data provisioning.

### 3.3 Kovela (kovela-kifaruWatch) strengths
- Automation-heavy backbone via n8n workflows:
  - Scheduled contribution scraping and ingestion
  - Compliance checks with auto-alerting
  - Google Sheets bulk sync (contributions + expenditures)
  - Gazette monitoring and chunking for retrieval/knowledge enrichment
  - Daily summary generation and Slack escalation routing
  - Candidate and party onboarding webhook pipeline
- Clear operational cadence (3h, 6h, 12h, daily schedules).
- Practical data-operations design for continuous refresh.

## 4. Unified Product Vision

**Product name (working):** TI-Kenya Campaign Finance Intelligence Platform

**Core vision:**  
An integrated civic-tech and intelligence platform that turns fragmented political finance disclosures and citizen evidence into transparent, verifiable, actionable public accountability data.

**Primary users:**
- Citizens and voters
- Journalists and media researchers
- Civil society investigators and policy advocates
- TI-Kenya analysts and verification teams
- Partner institutions supporting anti-corruption work

## 5. Unified Feature Architecture

### 5.1 Public Civic Layer (open access)
- Homepage and plain-language explainers
- Financial Flow dashboard (high-level filters + charts)
- Incident map and trend views
- Verified claims explorer
- Regulatory context explorer
- Public export (safe, rate-limited)
- Language switching (English + Kiswahili + extensible vernacular set)
- Accessibility controls and WCAG-compliant UI patterns

### 5.2 Citizen Reporting Layer
- Web report submission with evidence uploads
- USSD reporting flow for low-connectivity users
- SMS reporting pathway (recommended to implement fully in unified product)
- Anonymous submission option + privacy warning copy
- Report categorization:
  - vote buying
  - illegal donations
  - misuse of public resources
  - undeclared spending
  - bribery
  - other

### 5.3 Intelligence & Analyst Layer (restricted)
- Actor Matrix with role/county/entity context
- Secure Vault intake for sensitive whistleblower payloads
- Verification queue and moderation tools
- AI-assisted tamper/risk indicators (advisory only, never final decision)
- Internal notes, approval workflow, and publish controls
- Entity provisioning for candidates, parties, and regulatory entries

### 5.4 Automation & DataOps Layer
- Scheduled ingestion from trusted structured and semi-structured sources
- Compliance rules engine:
  - overspending detection
  - threshold warnings
  - low compliance score detection
- Daily reporting to operations channels
- Candidate/party onboarding via webhook for fast updates
- Bulk sync tooling for partner-provided spreadsheets

### 5.5 Governance & Trust Layer
- Verification states: submitted, under review, verified, unverified, needs more info
- Audit trail of status changes
- Neutral language policy (avoid defamatory conclusions)
- Source-linked claims (where possible)
- Role-based access control for sensitive functions

## 6. Consolidated Module Blueprint

### Module 1: Financial Transparency Explorer
**Combines:**
- Knight-Watch dashboard/transparency/trends concepts
- KweliNet Financial Flow analytics
- Kovela ingestion + compliance feeds

**Key capabilities:**
- Multi-filter explorer (time, party, donor, type, geography)
- KPI cards (raised, spent, alerts, actors)
- Stacked timeline bars + pie share + Sankey donor-to-recipient flow
- Download current filtered dataset

### Module 2: Campaign Misuse Reporting and Monitoring
**Combines:**
- Knight-Watch report form + map + USSD
- KweliNet Secure Vault + Verified Claims
- Kovela alert automation

**Key capabilities:**
- Citizen evidence submission (web/USSD/SMS)
- Moderated review and verification
- Public map + claims wall for verified incidents
- Escalation alerts for critical anomalies

### Module 3: Political Actors and Networks
**Combines:**
- KweliNet Actor Matrix + detail modal + risk labels
- Knight-Watch party/candidate transparency pages
- Kovela onboarding pipeline

**Key capabilities:**
- Searchable actor registry
- County and role filters
- Party affiliation and donor/expenditure context
- Profile-level compliance summary

### Module 4: Regulatory Intelligence and Legal Education
**Combines:**
- Knight-Watch legal explainers and timelines
- KweliNet regulatory categorization and map context
- Kovela gazette document ingestion for updates

**Key capabilities:**
- Searchable legal Q&A by category and year
- Plain-language explainer cards
- Linked notices and historical regulatory shifts
- Exportable references for journalists and CSOs

### Module 5: Administrative Command Center
**Combines:**
- KweliNet Admin Hub and Auth portal patterns
- Knight-Watch admin/report export controls
- Kovela ops reports + Slack escalation patterns

**Key capabilities:**
- Intake queue management
- Claim verification and publishing
- Dataset/entity update forms
- Daily summary snapshots and operational alerts

## 7. Prioritized Unified MVP (Phase 1)

- P1. Public dashboard and filters
- P2. Web report intake + evidence upload
- P3. USSD reporting integration
- P4. Verification queue (basic states + publish verified claims)
- P5. Core visualizations (bar + pie + Sankey + map)
- P6. Scheduled ingestion (one source + one bulk import path)
- P7. Compliance alerts (overspend + near-limit)
- P8. Basic export for press/research (CSV/JSON)

**Phase 1 objective:**  
Deliver a reliable, demonstrable transparency platform with end-to-end flow:  
`ingest -> analyze -> report/verify -> publish -> export`

## 8. Phase 2 Enhancements

- Full SMS conversational parser and acknowledgments
- Richer multilingual support (additional Kenyan languages)
- Advanced provenance metadata and evidence redaction controls
- Public API documentation for researchers
- Embeddable widgets for media organizations
- Expanded legal doc retrieval and semantic search
- Improved anti-abuse controls and anomaly scoring

## 9. Data Model (Unified, High Level)

**Core entities:**
- Party
- Candidate
- Contribution
- Expenditure
- IncidentReport
- EvidenceAsset
- VerificationAction
- ViolationAlert
- RegulatoryRecord
- DocumentChunk (for indexed legal/public documents)
- User/AdminRole

**Key relationships:**
- Party has many candidates
- Candidate has many contributions/expenditures/reports/alerts
- IncidentReport has many evidence assets and verification actions
- RegulatoryRecord can link to reports/alerts for legal context

## 10. Trust, Safety, and Ethics Requirements

**Mandatory principles:**
- Neutral language for public-facing allegations
- Clear separation between unverified and verified information
- Human-in-the-loop verification before publication
- Privacy-preserving handling of whistleblower submissions
- Evidence access restricted by role
- Input sanitization across all user text/search/upload metadata

**Operational safeguards:**
- Audit log for admin changes and status transitions
- Rate limiting on submission and export endpoints
- File type and size validation for uploads
- CSV injection protections on downloadable exports

## 11. Recommended Technical Direction

**Frontend:**
- Keep modern web UX patterns from Knight-Watch/KweliNet.
- Preserve accessibility, responsive design, and language switching baseline.

**Backend:**
- Standardize around one primary backend/data store for maintainability.
- Keep pipeline orchestrations (Kovela-style scheduled jobs) as ingestion layer.

**DataOps:**
- Maintain modular ingestion connectors:
  1. API scrape/pull
  2. Spreadsheet sync
  3. Gazette/legal notice crawler
  4. Manual admin import fallback

**Analytics:**
- Maintain cross-filter visualizations and derived KPIs.
- Separate public analytics from internal risk/compliance analytics.

## 12. Implementation Roadmap (Product + Delivery)

**Sprint 1 (2 weeks)**
- Finalize canonical data schema
- Implement ingestion baseline + one dashboard view
- Stand up report intake + verification statuses

**Sprint 2 (2 weeks)**
- Add map + claims wall + actor matrix
- Integrate compliance alerts
- Add admin queue + publish controls

**Sprint 3 (2 weeks)**
- Add USSD/SMS production-hardening
- Add exports + press toolkit
- Improve multilingual and accessibility coverage

**Sprint 4 (2 weeks)**
- Add legal intelligence and document indexing
- Add performance hardening and monitoring
- Conduct UAT with TI-Kenya policy and investigations teams

## 13. How This Unified Product Scores Against Hackathon Criteria

**Relevance (30/30 target)**
- Directly addresses all three challenge outcomes: tracking, visualization, misuse monitoring.

**Quality (20/20 target)**
- Builds from already demonstrated modules with clear operational workflows.

**Viability (30/30 target)**
- Phased delivery, modular architecture, and practical ingestion pipelines support scale.

**Novelty (20/20 target)**
- Combines civic reporting, intelligence analytics, and automation pipelines in one product.

## 14. Final Product Statement

The unified platform should be positioned as:

> "Kenya's public-interest campaign finance transparency and accountability platform that combines citizen reporting, financial intelligence, and automated compliance monitoring to help the public and oversight actors follow political money responsibly."

This consolidated design is fully aligned to TI-Kenya's stated hackathon purpose and is feasible to implement incrementally using the strongest proven components from all three winning submissions.

