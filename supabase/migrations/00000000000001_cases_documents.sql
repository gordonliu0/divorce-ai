-- =============================================================================
-- Cases, Documents, and Line Items
-- Phase 1: Case & Document Foundation for DivorceAI
-- =============================================================================

-- ============================================================
-- Functions
-- ============================================================

CREATE FUNCTION public.set_updated_at()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE public.cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES public.users(id),
  name text NOT NULL,
  case_number text,
  jurisdiction text,
  status text NOT NULL DEFAULT 'intake'
    CHECK (status IN ('intake', 'processing', 'review', 'complete')),
  client_name text NOT NULL,
  opposing_party_name text,
  date_of_marriage date,
  date_of_separation date,
  date_of_filing date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES public.users(id),
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL,
  mime_type text NOT NULL,
  document_type text
    CHECK (document_type IN (
      'nws', 'bank_statement', 'tax_return', 'w2', '1099',
      'mortgage', 'credit_card', 'investment', 'retirement',
      'deed', 'title', 'other'
    )),
  document_type_confidence real,
  document_type_override text,
  extracted_data jsonb,
  extraction_status text
    CHECK (extraction_status IN ('processing', 'extracted', 'partial', 'failed')),
  extraction_model_id text,
  extraction_confidence real,
  raw_text text,
  institution_name text,
  account_last_four text,
  period_start date,
  period_end date,
  status text NOT NULL DEFAULT 'uploaded'
    CHECK (status IN ('uploaded', 'processing', 'extracted', 'failed')),
  page_count int,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  date date NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL
    CHECK (type IN ('credit', 'debit')),
  running_balance numeric,
  category text,
  counterparty text,
  counterparty_account text,
  source_page int,
  flag_eligible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_cases_organization_id ON public.cases(organization_id);
CREATE INDEX idx_cases_created_by ON public.cases(created_by);
CREATE INDEX idx_cases_status ON public.cases(status);

CREATE INDEX idx_documents_case_id ON public.documents(case_id);
CREATE INDEX idx_documents_document_type ON public.documents(document_type);
CREATE INDEX idx_documents_status ON public.documents(status);

CREATE INDEX idx_line_items_document_id ON public.line_items(document_id);
CREATE INDEX idx_line_items_case_id ON public.line_items(case_id);
CREATE INDEX idx_line_items_date ON public.line_items(date);
CREATE INDEX idx_line_items_amount ON public.line_items(amount);
CREATE INDEX idx_line_items_category ON public.line_items(category);

-- ============================================================
-- Updated_at triggers
-- ============================================================

CREATE TRIGGER set_cases_updated_at
  BEFORE UPDATE ON public.cases
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.line_items ENABLE ROW LEVEL SECURITY;

-- Cases: org members can CRUD
CREATE POLICY "Org members can view cases"
  ON public.cases FOR SELECT
  USING (public.user_is_org_member(organization_id));

CREATE POLICY "Org members can create cases"
  ON public.cases FOR INSERT
  WITH CHECK (public.user_is_org_member(organization_id));

CREATE POLICY "Org members can update cases"
  ON public.cases FOR UPDATE
  USING (public.user_is_org_member(organization_id));

CREATE POLICY "Org members can delete cases"
  ON public.cases FOR DELETE
  USING (public.user_is_org_member(organization_id));

-- Documents: org members can CRUD (scoped through case)
CREATE POLICY "Org members can view documents"
  ON public.documents FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = documents.case_id
    AND public.user_is_org_member(cases.organization_id)
  ));

CREATE POLICY "Org members can create documents"
  ON public.documents FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = documents.case_id
    AND public.user_is_org_member(cases.organization_id)
  ));

CREATE POLICY "Org members can update documents"
  ON public.documents FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = documents.case_id
    AND public.user_is_org_member(cases.organization_id)
  ));

CREATE POLICY "Org members can delete documents"
  ON public.documents FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = documents.case_id
    AND public.user_is_org_member(cases.organization_id)
  ));

-- Line items: org members can read (scoped through case)
CREATE POLICY "Org members can view line items"
  ON public.line_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = line_items.case_id
    AND public.user_is_org_member(cases.organization_id)
  ));

CREATE POLICY "Org members can create line items"
  ON public.line_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = line_items.case_id
    AND public.user_is_org_member(cases.organization_id)
  ));

CREATE POLICY "Org members can delete line items"
  ON public.line_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = line_items.case_id
    AND public.user_is_org_member(cases.organization_id)
  ));

-- ============================================================
-- Storage bucket
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('case-documents', 'case-documents', false);

-- Storage policies: org members can manage files in their org's path
CREATE POLICY "Org members can upload case documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'case-documents'
    AND public.user_is_org_member((storage.foldername(name))[1]::uuid)
  );

CREATE POLICY "Org members can view case documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'case-documents'
    AND public.user_is_org_member((storage.foldername(name))[1]::uuid)
  );

CREATE POLICY "Org members can delete case documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'case-documents'
    AND public.user_is_org_member((storage.foldername(name))[1]::uuid)
  );
