# Phased Schema Implementation

---

## Current State (v0.1.0)

```
organizations
  ├── members (user ↔ org, role: owner/admin/member)
  └── invitations (pending invites)

users (auth + onboarding state)
```

---

## Phase 1: Case & Document Foundation (v0.2.0)

Add `cases` and `documents` tables. This is the minimum to support document upload, classification, and the Intake → Review workflow.

### New Tables

#### `cases`

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| organization_id | uuid FK → organizations | tenant scoping |
| created_by | uuid FK → users | attorney who created |
| name | text | e.g., "Smith v. Smith" |
| case_number | text | optional, court-assigned |
| jurisdiction | text | nullable, e.g., "NY", "CA" — determines applicable law |
| status | text | `intake`, `processing`, `review`, `complete` |
| client_name | text | the firm's client |
| opposing_party_name | text | |
| date_of_marriage | date | nullable, for commencement value |
| date_of_separation | date | nullable |
| date_of_filing | date | nullable |
| notes | text | free-form attorney notes |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `documents`

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| case_id | uuid FK → cases | |
| uploaded_by | uuid FK → users | |
| file_name | text | original filename |
| file_path | text | Supabase Storage path |
| file_size | bigint | bytes |
| mime_type | text | application/pdf, text/csv, etc. |
| document_type | text | `nws`, `bank_statement`, `tax_return`, `w2`, `1099`, `mortgage`, `credit_card`, `investment`, `retirement`, `deed`, `title`, `other` |
| document_type_confidence | real | 0-1, from classifier |
| document_type_override | text | nullable, attorney manual override |
| extracted_data | jsonb | nullable, typed per document_type — header/summary fields (institution, account, balances, etc.). Validated at app layer. Prototyping format until shapes stabilize, then promote to typed tables per document type. |
| extraction_status | text | nullable, `processing`, `extracted`, `partial`, `failed` |
| extraction_model_id | text | nullable, which LLM produced the extraction |
| extraction_confidence | real | nullable, 0-1 overall extraction confidence |
| raw_text | text | nullable, OCR / parsed text for full-text search |
| institution_name | text | nullable, e.g., "Chase", "Fidelity" |
| account_last_four | text | nullable |
| period_start | date | nullable, statement period |
| period_end | date | nullable |
| status | text | `uploaded`, `processing`, `extracted`, `failed` |
| page_count | int | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

#### `line_items`

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| document_id | uuid FK → documents | |
| case_id | uuid FK → cases | denormalized for direct querying |
| date | date | transaction/entry date |
| description | text | raw description from document |
| amount | numeric | positive = credit, negative = debit |
| type | text | `credit`, `debit` |
| running_balance | numeric | nullable, if available on statement |
| category | text | nullable, auto-categorized (e.g., `transfer`, `payroll`, `purchase`) |
| counterparty | text | nullable, extracted recipient/sender |
| counterparty_account | text | nullable, destination account number if visible |
| source_page | int | nullable, page number in original document |
| flag_eligible | boolean | default true, whether this item should be considered for anomaly detection |
| created_at | timestamptz | |

*`line_items` is a first-class table because it's the join target for reconciliation (NWS entries ↔ line items across all documents) and the query surface for anomaly detection. Same shape regardless of source document type.*

### RLS Policies

- Cases: members of the organization can CRUD
- Documents: members of the organization can CRUD (scoped through case → organization)
- Line items: members of the organization can read (scoped through document → case → organization)

### Storage

- Supabase Storage bucket: `case-documents`
- Path convention: `{org_id}/{case_id}/{document_id}/{filename}`
- RLS on storage bucket scoped to organization membership

### Indexes

- `cases(organization_id)`
- `cases(created_by)`
- `cases(status)`
- `documents(case_id)`
- `documents(document_type)`
- `documents(status)`
- `line_items(document_id)`
- `line_items(case_id)`
- `line_items(date)`
- `line_items(amount)`
- `line_items(category)`

### Schema Evolution Note

`extracted_data` (JSONB on `documents`) is intentionally unstructured for now. As we learn the true shape of each document type from Matt's feedback and real cases, individual document types will be promoted to their own typed tables (e.g., `bank_statement_data`, `w2_data`, `tax_return_data`) joined 1:1 back to `documents`. The JSONB column serves as the prototyping layer — iterate fast, migrate when shapes stabilize.

---

## Phase 2: Analysis & Flags (v0.3.0)

#### `analyses`

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| case_id | uuid FK → cases | |
| analysis_type | text | `reconciliation`, `anomaly`, `waste`, `timeline_gap`, `undisclosed_account` |
| status | text | `running`, `complete`, `failed` |
| summary | jsonb | structured results |
| created_at | timestamptz | |

#### `flags`

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| analysis_id | uuid FK → analyses | |
| case_id | uuid FK → cases | for direct querying |
| line_item_id | uuid FK → line_items | nullable, the specific line item that triggered this flag |
| flag_type | text | `mismatch`, `missing_doc`, `large_transaction`, `undisclosed_account`, `marital_waste`, `timeline_gap` |
| severity | text | `info`, `warning`, `critical` |
| title | text | human-readable summary |
| description | text | detailed explanation |
| reasoning | jsonb | step-by-step audit trail |
| source_documents | uuid[] | document IDs that informed this flag |
| nws_line_item | text | nullable, which NWS entry this relates to |
| amount | numeric | nullable, dollar amount if relevant |
| status | text | `pending_review`, `approved`, `dismissed`, `modified` |
| reviewed_by | uuid FK → users | nullable |
| review_note | text | nullable, attorney's annotation |
| reviewed_at | timestamptz | nullable |
| created_at | timestamptz | |

---

## Phase 3: Actions & Reports (v0.4.0)

#### `suggested_actions`

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| case_id | uuid FK → cases | |
| flag_id | uuid FK → flags | nullable, the flag that triggered this |
| action_type | text | `request_documents`, `draft_subpoena`, `draft_discovery`, `generate_report`, `override_flag` |
| title | text | |
| description | text | |
| parameters | jsonb | structured data for execution |
| status | text | `suggested`, `accepted`, `dismissed`, `completed` |
| completed_by | uuid FK → users | nullable |
| completed_at | timestamptz | nullable |
| created_at | timestamptz | |

#### `reports`

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| case_id | uuid FK → cases | |
| report_type | text | `verified_nws`, `anomaly_summary`, `full_analysis` |
| generated_by | uuid FK → users | |
| file_path | text | Supabase Storage path to PDF/Excel |
| status | text | `generating`, `draft`, `approved`, `exported` |
| approved_by | uuid FK → users | nullable |
| approved_at | timestamptz | nullable |
| created_at | timestamptz | |

---

## Migration Strategy

Each phase is an additive migration — no destructive changes to existing tables. Phase 1 is the only blocker for the demo. Phases 2-3 can be iterated on as the features they support are built.

`extracted_data` JSONB → typed tables per document type is a non-breaking promotion: add the new table, backfill from JSONB, update app layer reads, then drop the JSONB column. No data loss, no downtime.
