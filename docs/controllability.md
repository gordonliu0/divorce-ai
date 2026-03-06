# Controllability Philosophy

**Principle:** Every AI capability starts with maximum human oversight and graduates toward automation as trust is earned through usage data.

---

## Three Tiers

### Tier 1: Fully Automated (no human review required)

These are deterministic or near-deterministic tasks where errors are low-cost and easily corrected.

- **Document classification** — identify document type (bank statement, W-2, 1099, mortgage, etc.) on upload
- **Data extraction** — parse structured fields from documents into typed schemas
- **Timeline gap detection** — flag missing months/years in account coverage
- **Document quality check** — flag unreadable, blurry, or password-protected files
- **NWS field mapping** — map NWS line items to standard categories

*Graduation path: these start automated because the cost of a misclassification is a quick manual override, not a legal error.*

### Tier 2: AI + Human Review (AI suggests, attorney approves)

These involve judgment where AI adds speed but the attorney must validate before acting.

- **NWS reconciliation** — match NWS entries to supporting docs, surface mismatches
- **Anomaly flagging** — large transactions, unexplained transfers, spending patterns
- **Marital waste detection** — gambling, suspicious travel, high-value personal purchases
- **Undisclosed account detection** — recipient accounts in transactions not listed on NWS
- **Commencement value verification** — flag discrepancies at marriage/separation/filing dates
- **Suggested next actions** — "Request 3-year history for [account]", "Draft discovery request"

*Graduation path: as attorneys consistently accept suggestions without modification, individual suggestion types can be promoted to auto-execute with notification (Tier 1.5). Track accept/reject/modify rates per action type.*

### Tier 3: Human Only (AI cannot perform)

These require legal judgment, client interaction, or court authority.

- **Separate property classification** — legal determination, jurisdiction-specific
- **Report approval and signing** — attorney must review before anything goes to court
- **Client communication** — requesting missing docs, interviewing about flagged items
- **Settlement strategy** — how to use findings in negotiation
- **Court filings** — only bar-licensed attorneys can file
- **Override decisions** — attorney marks a flag as reviewed/dismissed with reasoning

*Graduation path: some of these (like drafting client communication) can eventually move to Tier 2 as templates, but the attorney always sends.*

---

## Graduation Framework

```
Tier 3 (Human Only)
  ↓  AI drafts, human executes
Tier 2 (AI + Human Review)
  ↓  Track accept rate > 95% over 50+ instances
Tier 1.5 (Auto-execute + Notify)
  ↓  Track override rate < 1% over 200+ instances
Tier 1 (Fully Automated)
```

**Key metric:** Per-action-type accept/reject/modify rate. This is the data pipeline that enables graduation. Every attorney interaction is a training signal.

---

## UI Implications

- Tier 1: Results shown inline, no approval step. Override always available.
- Tier 2: Results shown with "Approve / Modify / Dismiss" controls. Cannot proceed to report without review.
- Tier 3: Empty state with prompt — "Attorney action required: [description]"

---

## Trust Building (for Matt's meeting)

The pitch: "Nothing goes to court without your eyes on it. The tool does the grunt work, you make the calls. Over time, as you trust specific capabilities, you can let the system handle more autonomously."

This maps directly to the attorney trust question: they verify by reviewing AI suggestions against source documents, and they control the graduation pace.
