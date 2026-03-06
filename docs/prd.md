# DivorceAI - Product Requirements Document

**Version:** 0.2.0
**Status:** Draft
**Last Updated:** 2026-03-05

---

## TL;DR

An AI-powered tool for divorce lawyers that automates financial document analysis. Reduces weeks of manual review to hours.

Main Features
- parsing bank statements
- reconciling Net Worth Statements
- detecting anomalies
- generating court-ready reports. 

---

## Goals

### Business Goals

- Decrease financial document analysis time per case by 80%
- Reduce external forensic accounting costs per case by 50%+
- Enable 20% more active cases per lawyer without additional headcount

### User Goals

- Automate tedious, error-prone financial document review
- Instantly flag anomalies and potential marital waste
- Produce clear, court-ready reports
- Rapidly search and cross-reference uploaded documents

### Non-Goals (MVP)

- No client self-service upload
- No Plaid or direct financial institution integrations
- No non-US or non-English legal processes

---

## Users

### Founder Divorce Lawyer (Primary)

The tool's creator and first power user. Uses it with real clients, provides continuous feedback, and tunes analysis rules. Has admin access to modify rulesets and LLM prompts.

### Divorce Lawyer

Practicing attorneys handling complex financial analysis. Seeking to reduce costs, improve accuracy, and accelerate case prep.

### Client

Individuals undergoing divorce who provide source documents. Want the process to be as frictionless as possible.

---

## Core Workflow

```
Create Case → Upload Documents (NWS + Supporting) → Parse & Extract → Analyze → Review & Override → Generate Report
                                                                                         ↓
                                                                              Request Missing Info → Re-analyze
```

### Two-Phase Case Layout

**Intake Phase:**
- Two upload zones: Net Worth Statement + Supporting Documents
- Documents auto-tagged by type (bank statement, mortgage, W-2, etc.) with manual override
- Single "Process" button triggers both extraction and analysis
- Real-time progress via Supabase Realtime

**Review Phase:**
- Net Worth Summary with side-by-side NWS ↔ supporting doc view
- Flagged discrepancies and anomalies with step-by-step reasoning
- Reconciliation results: match / mismatch / missing
- Prioritized suggested actions (see below)

---

## Functional Requirements

### 1. Document Ingestion & Parsing (P0)

The foundation. Unstructured data → structured data, then deterministic code downstream.

- Accept: Net Worth Statement (standard US form), bank statements, mortgage docs, investment statements, credit card statements, tax returns (W-2, 1099), deeds, titles, retirement account statements
- File types: PDF, CSV, Excel, QuickBooks exports
- Single-pass LLM extraction into typed schemas per document type
- No re-running extracted data through LLM for analysis (anti-pattern)
- Verify document type and quality; feedback if unreadable
- Golden-file test harness against real documents

### 2. NWS Reconciliation (P0)

The highest-value analysis. NWS asserts assets/liabilities; supporting docs provide evidence.

- Cross-reference every NWS line item against extracted document data
- Aggregate sum + detect: match / mismatch / missing documentation
- Flag gaps in document timelines (e.g., incomplete 3-year coverage)
- Identify undisclosed or newly discovered accounts from transaction data
- All flagging derived from reconciliation logic, not separate LLM calls

### 3. Transaction Analysis & Anomaly Detection (P1)

- Flag large unexplained withdrawals, transfers, or spending beyond configurable thresholds
- Detect patterns: gambling, suspicious travel, high-value personal purchases
- Traceable reasoning for every flagged item with supporting evidence
- Attorney can annotate findings with explanations

### 4. Separate Property Verification (P2)

- Identify assets qualifying as separate property (premarital, inheritance, gifts)
- Trace commingled funds
- Require supporting documentation (e.g., account balances at date of marriage)

### 5. Prioritized Actions (P1)

AI-suggested next steps based on case state, displayed on Review page:

- Generate Report
- Draft Subpoena
- Request Discovery Documents
- Override Flags
- Request Missing Documentation

Each action scoped to what the data warrants — e.g., if reconciliation surfaces an undisclosed account, "Draft Discovery Request for [Institution]" appears automatically.

**Data pipeline:** Track which actions attorneys take, skip, and prioritize. Train prediction model to rank suggestions by case profile over time.

**Future:** Each action becomes a candidate for agentic automation. Attorney role shifts from doing the work to supervising the AI's work.

### 6. Report Generation (P1)

- Court-ready PDF and Excel exports
- Verified Net Worth Statement with documentation status
- Flagged anomalies and marital waste summary
- Separate property classification
- Redact or highlight sections before export
- White-label with firm branding

### 7. Auditability & Transparency (P0)

- Step-by-step reasoning for every flagged item
- Comprehensive audit log of all findings, calculations, and system decisions
- Exportable checklist: all assets/liabilities listed, docs cover required periods, no unexplained transfers, no undisclosed accounts, marital waste addressed

### 8. Admin Mode (P2)

- Founder access to modify rulesets, thresholds, and LLM prompts
- Can use native LLM sandbox (e.g., OpenAI Playground) or in-app interface
- Log and audit all rule logic changes

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js + TypeScript | SSG for marketing/docs, SSR for app, type safety across stack |
| Database | Supabase (PostgreSQL) | Managed hosting, Auth, Storage, Realtime, RLS, SOC 2 Type 2 |
| Auth | Supabase Auth | Role-based, multi-tenant |
| Storage | Supabase Storage | Encrypted document storage |
| Task Queue | Celery / In-DB queue | Job persistence, retry, progress tracking; path to dedicated parsing microservice |
| AI/LLM | Python FastAPI backend | Single-pass extraction; consider LangChain / Vercel AI SDK for model hot-swap |
| Deployment | Vercel (frontend) | CI/CD, preview deployments |
| Realtime | Supabase Realtime | Processing progress updates |

### Data Model (Multi-tenant)

```
Firm (Organization) → Attorney (Member) → Case → Document → Extracted Data
                                              ↓
                                         Analysis → Flags → Actions → Reports
```

---

## Architecture Principles

1. **Parse once, analyze deterministically.** LLM extracts structured data from documents. All downstream analysis (reconciliation, flagging, aggregation) uses deterministic code against typed schemas.

2. **Typed document schemas.** Each document type (W-2, 1099, bank statement, etc.) has a defined TypeScript/Python schema. Extraction targets these schemas. No untyped JSON blobs flowing through the system.

3. **Actions as agent hooks.** Suggested actions are structured data, not UI-only. Each action has a type, parameters, and execution path — today attorney-initiated, tomorrow AI-automated.

4. **Auditability by default.** Every system decision, flag, and calculation has a traceable reasoning chain. This is a legal tool; transparency is non-negotiable.

---

## Success Metrics

### User-Centric

- Registered firms and attorneys (6-month target)
- Cases analyzed per user per month
- Time saved per case (self-reported + automated tracking)
- User satisfaction (NPS)

### Technical

- System uptime: 99.9%+
- Document parsing success rate: 95%+ without manual intervention
- AI-flagged anomaly accuracy: <2% manual correction rate
- Processing time: <5 minutes for standard case file

### Business

- MRR (per-case or per-firm billing)
- Client acquisition cost and conversion rates
- Reduction in 3rd-party forensic accounting costs

---

## Phased Roadmap

### Phase 1: Foundation (Weeks 1-2, ~20 hrs) ✅

Next.js/TypeScript scaffold with Supabase (Auth, DB, Storage). Multi-tenant schema (organization → member → case → document). CI/CD. Role-based auth.

### Phase 2: Document Ingestion & Parsing (Weeks 3-4, ~20 hrs)

Top 5 document types with typed schemas. Single-pass LLM extraction. Golden-file test harness. Async task queue for processing.

*Can be parallelized with Phase 3 if domain expert assists with document schemas.*

### Phase 3: NWS Reconciliation (Weeks 5-6, ~20 hrs)

Deterministic cross-reference: NWS line items ↔ extracted documents. Automated flagging derived from reconciliation. Attorney-facing flag UI.

### Phase 4: UI/UX (Weeks 7-8, ~20 hrs)

Two-phase case layout: Intake → Review. NW summary, flags, reconciliation views. Suggested actions scaffolding. Real-time processing progress.

### Phase 5: Iteration (Week 8+, ongoing)

Tighten feedback loop with beta users. Prioritize from real usage: which reports, which patterns, which documents. Build useful abstractions. Roadmap agent capabilities.

**Total: ~8 weeks / ~80 hrs to minimal MVP, then continuous iteration.**

---

## Design Language

- Professional, legal-industry aesthetic — subdued colors, premium feel
- "Institutional modern" — clean, authoritative, trustworthy
- Accessibility: clear contrasts, keyboard navigation
- Responsive: laptop and desktop primary, tablet secondary
- Minimal friction: bulk uploads, auto-tagging, progress at-a-glance

---

## Backlog

- **Client → Attorney document handoff** — structured flow for clients to submit documents to their attorney's case (not self-service, but defined UX)
- **Commencement value analysis** — verify asset/liability values at marriage date, separation date, and filing date; flag discrepancies across timeframes
- **Re-analysis loop** — after attorney requests missing info and client provides additional docs, re-run extraction and analysis with delta awareness
- **Cross-document search & filtering** — rapid retrieval and cross-reference across all uploaded documents by transaction, asset, account, or keyword
- **Document error handling UX** — structured guidance when documents are unreadable, incomplete, or low-quality (retry prompts, quality indicators)
- **Onboarding wizard** — first-time attorney experience guiding through first case creation and document upload
- **Data residency & compliance** — US-based data residency, encryption at rest and in transit, explicit consent flows for sensitive financial data storage
- **Manual override & annotation** — attorney can override AI flags, annotate findings, and add inline case notes before export
- **Multi-attorney collaboration** — multiple lawyers per firm on the same case with scoped permissions and shared visibility
- **Processing notifications** — notify attorneys on stage completion during document parsing and analysis
- **Report redaction** — attorney can redact or highlight specific sections before generating PDF export
- **Document checklist** — auto-generated checklist of required document types per case, checked off as uploads match, showing gaps at a glance
- **Timeline coverage map** — visual timeline per account showing which months are covered vs missing across the required 3-year period
- **Client document request generator** — one-click templated email requesting missing document types, pre-filled from checklist gaps
- **Bulk extraction dashboard** — batch upload and extract 30+ documents with progress tracking and results as they complete
- **NWS digital form** — structured digital input form matching the standard NWS format so assertion data is typed before reconciliation
