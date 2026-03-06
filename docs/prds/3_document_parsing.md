# PRD: Document Parsing & Extraction

**Status:** Draft
**Priority:** P0
**Phase:** Phase 2 — Document Ingestion & Parsing
**Author:** Gordon
**Last Updated:** 2026-03-06

---

## Idea

Single-pass LLM extraction that converts uploaded financial documents into typed, structured data. Each document type has a defined schema. The extracted data becomes the foundation for all downstream analysis — reconciliation, flagging, and reporting run against structured data, not raw documents.

## Problem: What problem is this solving?

Attorneys and paralegals manually read every page of every financial document, transcribing numbers into spreadsheets or mental notes. This is where the bulk of the 20-40 hours per case is spent — not on legal judgment, but on data entry from PDFs.

How do we know this is real and worth solving?

- Process doc Phases 1-3 are entirely dependent on having structured financial data extracted from documents.
- The existing codebase anti-pattern (re-running extracted JSON through LLM for analysis) proves the extraction layer is the critical path — get it right once and everything downstream becomes deterministic.

## Strategic Fit: How does this fit into the bigger picture?

This is the core architectural principle: **parse once, analyze deterministically.** Every feature after this — reconciliation, anomaly detection, marital waste, reporting — consumes structured data, not raw text. The quality of extraction directly determines the quality of everything else. This is also Tier 1 (fully automated) with Tier 2 review via the Document Viewer (PRD #4).

## Solution: What does this look like in the product?

**What's included:**

Typed extraction schemas for MVP document types:

1. **Bank Statement** — institution, account type, account last four, period, opening/closing balance, transactions (date, description, amount, type, running balance)
2. **W-2** — employer, employee, wages, federal/state tax withheld, Social Security/Medicare
3. **Tax Return (1040)** — filing status, AGI, taxable income, total tax, refund/amount owed, schedule summaries
4. **Mortgage Statement** — lender, property address, principal balance, monthly payment, interest rate, escrow
5. **Credit Card Statement** — issuer, account last four, period, opening/closing balance, minimum payment, transactions

Extraction pipeline:
- Triggered after document classification
- Send full document (all pages as images) to Claude with schema-specific prompt
- Return typed JSON validated against TypeScript schema
- Store in `extractions` table with confidence score, model ID, processing time
- Status tracking: `processing` → `extracted` → `failed`

**Where it lives:**
- Runs async after upload + classification
- Results surfaced in Document Viewer (PRD #4)
- Status visible on Intake page per document

**What's NOT included:**
- OCR preprocessing (Claude handles images directly in MVP)
- Extraction editing/correction UI (attorney uses override at the analysis level, not extraction level)
- Schema versioning or migration tooling (manual for now)
- Batch re-extraction
- Documents beyond the top 5 types

## Metrics

**Primary Success Metrics:**
- Field-level extraction accuracy: target >90% on golden test files
- Extraction success rate: target >95% of uploads produce valid structured output
- Processing time: target <30s per document

**Expected Non-Impacts:**
- Upload speed: extraction is async, should not block the upload UX
- Classification accuracy: extraction depends on classification but should not affect it
