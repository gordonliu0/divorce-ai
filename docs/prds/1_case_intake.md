# PRD: Case Intake

**Status:** Draft
**Priority:** P0
**Phase:** Phase 1 — Foundation
**Author:** Gordon
**Last Updated:** 2026-03-06

---

## Idea

A case creation flow where attorneys set up a new divorce case with key metadata (parties, dates, case number). This is the container that all documents, analysis, and reports attach to. Without it, nothing else works.

## Problem: What problem is this solving?

Attorneys have no structured way to organize financial analysis by case — today it's folders on a desktop, spreadsheets, and mental tracking.

How do we know this is real and worth solving?

- Every attorney we've spoken to organizes work by case. It's the fundamental unit of their practice.
- The process doc assumes a case context at every step: "create a new case file and upload the Net Worth Statement."

## Strategic Fit: How does this fit into the bigger picture?

Cases are the top-level container in the data model (`organization → member → case → document`). Every downstream feature — upload, parsing, reconciliation, reporting — is scoped to a case. This is infrastructure, not a feature.

## Solution: What does this look like in the product?

**What's included:**
- "New Case" button on the dashboard
- Case creation form: case name, client name, opposing party name, key dates (marriage, separation, filing), jurisdiction, optional case number, notes
- Case list view on dashboard with status, client name, document count, last updated
- Case detail page that serves as the Intake → Review workspace

**Where it lives:**
- Dashboard → case list
- `/o/{orgId}/cases` — list view
- `/o/{orgId}/cases/{caseId}` — detail view (Intake phase)

**What's NOT included:**
- Case archiving or deletion
- Case sharing across organizations
- Case templates or duplication
- Client-facing case views

## Metrics

**Primary Success Metrics:**
- Cases created per attorney per week: 0 (baseline, no product yet)
- Case creation completion rate: target >95% (form should be fast, not a barrier)

**Expected Non-Impacts:**
- Onboarding completion rate: should remain unchanged
- Page load time: case list should render <1s with 100 cases
