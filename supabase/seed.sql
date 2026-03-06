-- DivorceAI seed data for local development
-- Runs after migrations during `supabase db reset`

-- Test user (login with test@divorce.ai / password)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, email_change_token_current,
  phone, phone_change, phone_change_token, recovery_token, reauthentication_token,
  raw_app_meta_data, raw_user_meta_data, is_sso_user
)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'test@divorce.ai',
  crypt('password', gen_salt('bf')),
  now(), now(), now(),
  '', '', '', '',
  '', '', '', '', '',
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Test User"}',
  false
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '{"sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "email": "test@divorce.ai"}',
  'email',
  now(), now(), now()
)
ON CONFLICT DO NOTHING;

-- Mark onboarding complete so test user goes straight to dashboard
UPDATE public.users
SET onboarding_completed_at = now()
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

-- Test organization + owner membership
INSERT INTO public.organizations (id, name, created_at, updated_at)
VALUES ('11111111-1111-1111-1111-111111111111', 'DivorceFirm', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.members (user_id, organization_id, role, joined_at, created_at, updated_at)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '11111111-1111-1111-1111-111111111111',
  'owner', now(), now(), now()
)
ON CONFLICT DO NOTHING;
