# PRD: Document Upload & Classification

**Status:** Draft
**Priority:** P0
**Phase:** Phase 2 — Document Ingestion & Parsing
**Author:** Gordon
**Last Updated:** 2026-03-06

---

## Idea

Drag-and-drop document upload within a case, with automatic classification of each document by type (bank statement, W-2, mortgage, etc.). Attorneys upload a stack of PDFs and instantly see what the system thinks each one is, with the ability to override.

## Problem: What problem is this solving?

Attorneys receive 50-200+ pages of financial documents per case and must manually sort, label, and organize them before any analysis can begin. This is tedious, error-prone, and eats hours before the real work starts.

How do we know this is real and worth solving?

- Process doc Phase 2 lists 10+ document categories that must be collected and organized per case.
- Document sorting is the first step in every case — it blocks everything downstream.

## Strategic Fit: How does this fit into the bigger picture?

Classification is a Tier 1 (fully automated) capability — low risk, high wow factor. It's the first moment the attorney sees the AI working. Getting this right builds trust for Tier 2 features (reconciliation, flagging). It also populates the `documents` table that the entire extraction and analysis pipeline reads from.

## Solution: What does this look like in the product?

**What's included:**
- Two upload zones on the case Intake page:
  - **Net Worth Statement** — single file upload (special treatment, this is the assertion)
  - **Supporting Documents** — multi-file drag & drop
- Per-document display: filename, page count, file size, upload status
- Auto-classification with confidence badge: `bank_statement (94%)`, `w2 (87%)`
- Classification override dropdown per document
- Document type enum: `nws`, `bank_statement`, `tax_return`, `w2`, `1099`, `mortgage`, `credit_card`, `investment`, `retirement`, `deed`, `title`, `other`
- File stored in Supabase Storage at `{org_id}/{case_id}/{document_id}/{filename}`

**Classification approach (MVP):**
1. Filename heuristics — pattern matching for common naming conventions, confidence 0.6-0.8
2. First-page LLM scan — send page 1 as image to Claude, classify from enum, confidence from model

**Where it lives:**
- Case detail page → Intake tab
- Upload triggers immediately on drop, classification runs async

**What's NOT included:**
- Bulk re-classification
- Duplicate document detection
- Document version history
- Client-initiated uploads
- Non-PDF formats in MVP (CSV, Excel, QuickBooks deferred)

## Metrics

**Primary Success Metrics:**
- Classification accuracy (auto vs. attorney override rate): target >85% correct without override
- Upload-to-classified time: target <10s per document
- Documents uploaded per case: tracking baseline

**Expected Non-Impacts:**
- Case creation rate: upload flow should not slow down case setup
- Storage costs: monitor but not a success metric at this stage
