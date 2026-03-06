-- =============================================================================
-- DivorceAI Baseline Schema
-- Core multi-tenant platform: organizations, members, invitations, users
-- =============================================================================

-- ============================================================
-- Trigger functions (safe before tables — only run at runtime)
-- ============================================================

CREATE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  );
  RETURN new;
END;
$$;

CREATE FUNCTION public.normalize_invitation_email()
  RETURNS trigger
  LANGUAGE plpgsql
AS $$
BEGIN
  new.email := lower(trim(new.email));
  RETURN new;
END;
$$;

CREATE FUNCTION public.populate_invitation_denormalized_fields()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
BEGIN
  SELECT name INTO new.organization_name
  FROM public.organizations
  WHERE id = new.organization_id;

  SELECT name INTO new.invited_by_name
  FROM public.users
  WHERE id = new.invited_by_user_id;

  RETURN new;
END;
$$;

-- ============================================================
-- Tables
-- ============================================================

CREATE TABLE public.users (
  id uuid NOT NULL,
  email varchar(255) NOT NULL,
  name varchar(255),
  avatar_url text,
  onboarding_step varchar DEFAULT 'welcome',
  onboarding_completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE
);

CREATE TABLE public.organizations (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name varchar(255) NOT NULL,
  team_size varchar,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT organizations_pkey PRIMARY KEY (id)
);

CREATE TABLE public.members (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  role varchar NOT NULL,
  joined_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT members_pkey PRIMARY KEY (id),
  CONSTRAINT members_user_org_unique UNIQUE (user_id, organization_id),
  CONSTRAINT members_role_check CHECK (role IN ('owner', 'admin', 'member')),
  CONSTRAINT members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users (id) ON DELETE CASCADE,
  CONSTRAINT members_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations (id) ON DELETE CASCADE
);

CREATE TABLE public.invitations (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  organization_id uuid NOT NULL,
  email varchar NOT NULL,
  role varchar NOT NULL,
  token varchar NOT NULL,
  invited_by_user_id uuid NOT NULL,
  custom_message text,
  status varchar DEFAULT 'pending' NOT NULL,
  sent_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days') NOT NULL,
  accepted_at timestamptz,
  accepted_by_user_id uuid,
  resend_count int DEFAULT 0,
  last_resent_at timestamptz,
  organization_name text,
  invited_by_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT invitations_pkey PRIMARY KEY (id),
  CONSTRAINT invitations_token_key UNIQUE (token),
  CONSTRAINT invitations_role_check CHECK (role IN ('admin', 'member')),
  CONSTRAINT invitations_status_check CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled', 'expired')),
  CONSTRAINT invitations_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations (id) ON DELETE CASCADE,
  CONSTRAINT invitations_invited_by_user_id_fkey FOREIGN KEY (invited_by_user_id) REFERENCES public.users (id) ON DELETE SET NULL,
  CONSTRAINT invitations_accepted_by_user_id_fkey FOREIGN KEY (accepted_by_user_id) REFERENCES public.users (id) ON DELETE SET NULL
);

COMMENT ON COLUMN public.invitations.organization_name IS 'Denormalized organization name — populated automatically on insert';
COMMENT ON COLUMN public.invitations.invited_by_name IS 'Denormalized inviter name — populated automatically on insert';

-- ============================================================
-- Query functions (must come after tables they reference)
-- ============================================================

CREATE FUNCTION public.user_is_org_member(org_id uuid)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members
    WHERE organization_id = org_id
      AND user_id = auth.uid()
  );
$$;

CREATE FUNCTION public.user_org_role(org_id uuid)
  RETURNS text
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = ''
AS $$
  SELECT role
  FROM public.members
  WHERE user_id = auth.uid()
    AND organization_id = org_id
  LIMIT 1;
$$;

CREATE FUNCTION public.org_role(target_user_id uuid, org_id uuid)
  RETURNS text
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = ''
AS $$
  SELECT role
  FROM public.members
  WHERE user_id = target_user_id
    AND organization_id = org_id
  LIMIT 1;
$$;

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_members_organization_id ON public.members (organization_id);
CREATE INDEX idx_members_user_id ON public.members (user_id);
CREATE INDEX idx_members_role ON public.members (role);

CREATE INDEX idx_invitations_email ON public.invitations (email);
CREATE INDEX idx_invitations_email_pending ON public.invitations (email, status) WHERE status = 'pending';
CREATE INDEX idx_invitations_expires_at ON public.invitations (expires_at);
CREATE INDEX idx_invitations_organization_id ON public.invitations (organization_id);
CREATE INDEX idx_invitations_status ON public.invitations (status);
CREATE INDEX idx_invitations_token ON public.invitations (token);

-- ============================================================
-- Triggers
-- ============================================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER normalize_invitation_email_trigger
  BEFORE INSERT OR UPDATE OF email ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.normalize_invitation_email();

CREATE TRIGGER populate_invitation_fields
  BEFORE INSERT ON public.invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.populate_invitation_denormalized_fields();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- users
CREATE POLICY "Allow system inserts on users"
  ON public.users FOR INSERT
  TO service_role, postgres
  WITH CHECK (true);

CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Members can read other members user data"
  ON public.users FOR SELECT
  USING (
    id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.members m1
      JOIN public.members m2 ON m1.organization_id = m2.organization_id
      WHERE m1.user_id = auth.uid() AND m2.user_id = users.id
    )
  );

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- organizations
CREATE POLICY "Authenticated users can create organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Members can read their organizations"
  ON public.organizations FOR SELECT
  TO authenticated
  USING (public.user_is_org_member(id));

CREATE POLICY "Owners and admins can update organizations"
  ON public.organizations FOR UPDATE
  USING (public.user_org_role(id) IN ('owner', 'admin'));

CREATE POLICY "Owners can delete organizations"
  ON public.organizations FOR DELETE
  USING (public.user_org_role(id) = 'owner');

-- members
CREATE POLICY "Members can read org memberships"
  ON public.members FOR SELECT
  USING (public.user_is_org_member(organization_id));

CREATE POLICY "Owners and admins can update other members roles"
  ON public.members FOR UPDATE
  USING (
    user_id <> auth.uid()
    AND public.user_org_role(organization_id) IN ('owner', 'admin')
  );

CREATE POLICY "Owners can update their own membership for demotion"
  ON public.members FOR UPDATE
  USING (public.user_org_role(organization_id) = 'owner');

CREATE POLICY "Owners and admins can remove members"
  ON public.members FOR DELETE
  USING (
    user_id <> auth.uid()
    AND (
      public.user_org_role(organization_id) = 'owner'
      OR (
        public.user_org_role(organization_id) = 'admin'
        AND public.org_role(user_id, organization_id) = 'member'
      )
    )
    AND (
      (SELECT count(*) FROM public.members m2
       WHERE m2.organization_id = members.organization_id
         AND m2.role = 'owner') > 1
      OR role <> 'owner'
    )
  );

-- invitations
CREATE POLICY "Members can read org invitations"
  ON public.invitations FOR SELECT
  USING (public.user_is_org_member(organization_id));

CREATE POLICY "Users can read invitations sent to their email"
  ON public.invitations FOR SELECT
  USING (email = (SELECT u.email FROM public.users u WHERE u.id = auth.uid()));

CREATE POLICY "Owners and admins can send invitations"
  ON public.invitations FOR INSERT
  WITH CHECK (public.user_org_role(organization_id) IN ('owner', 'admin'));

CREATE POLICY "Owners and admins can manage invitations"
  ON public.invitations FOR UPDATE
  USING (public.user_org_role(organization_id) IN ('owner', 'admin'));

CREATE POLICY "Owners and admins can delete invitations"
  ON public.invitations FOR DELETE
  USING (public.user_org_role(organization_id) IN ('owner', 'admin'));
