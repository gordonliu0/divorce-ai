# PRD: Document Viewer with Extraction Preview

**Status:** Draft
**Priority:** P0
**Phase:** Phase 2 — Document Ingestion & Parsing
**Author:** Gordon
**Last Updated:** 2026-03-06

---

## Idea

A side-by-side view showing the original PDF on the left and extracted structured data on the right. Every extracted field links back to the source page. This is how attorneys verify the AI's work and build trust in the system — the bridge between Tier 1 automation and Tier 2 human review.

## Problem: What problem is this solving?

Attorneys won't trust AI-extracted data unless they can verify it against the source document. Without a verification interface, they'd have to manually open each PDF and cross-check against the structured output — defeating the purpose of automation.

How do we know this is real and worth solving?

- Trust is the #1 adoption barrier for AI in legal. Every attorney will ask: "how do I know it got this right?"
- The controllability framework requires a verification layer for Tier 1 capabilities to graduate. This is that layer.

## Strategic Fit: How does this fit into the bigger picture?

This is the trust-building interface. It makes the "parse once, analyze deterministically" principle tangible — attorneys can see exactly what was extracted and where it came from. It also generates the data signal for graduation: when attorneys stop checking and start trusting, we know extraction quality is sufficient to reduce oversight.

## Solution: What does this look like in the product?

**What's included:**
- Split-pane view triggered by clicking any document on the case page
- **Left pane:** PDF viewer with page-by-page navigation (page thumbnails, zoom, scroll)
- **Right pane:** Structured data cards, layout varies by document type:
  - Bank statement: header (institution, account, period, balances) + transaction table
  - W-2: field grid matching the W-2 form layout
  - Tax return: section summaries with expandable details
  - Mortgage: key terms card
  - Credit card: similar to bank statement
- Source linking: each extracted field/row has a "p.3" badge that scrolls the PDF to that page
- Confidence indicators: fields with low extraction confidence highlighted for review
- Document status bar: extraction status, model used, processing time

**Where it lives:**
- Case detail page → click any document → viewer opens (modal or full-page, TBD)
- Also accessible from future Review phase when drilling into flagged items

**What's NOT included:**
- Inline editing of extracted data (attorney can't modify extracted fields directly — corrections happen at the analysis/flag level)
- Annotation or highlighting on the PDF itself
- Multi-document comparison view
- Text search within the PDF
- Download/export of extracted data independently

## Metrics

**Primary Success Metrics:**
- Viewer open rate: what % of uploaded documents do attorneys actually inspect?
- Time spent in viewer per document: tracking baseline (expect decrease over time as trust builds)
- Source link click rate: how often do attorneys verify against the PDF?

**Expected Non-Impacts:**
- Extraction accuracy: viewer is read-only, should not affect extraction quality
- Upload flow: viewer is accessed post-extraction, should not slow intake
