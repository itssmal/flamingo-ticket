-- Helper functions used by RLS policies
-- Must be created before 007_rls_policies.sql

-- Returns true if the current user has the admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$ LANGUAGE sql
   STABLE
   SECURITY DEFINER
   SET search_path = public;

-- Returns true if the current user is a member of the given org
-- Used for technician and client_user access checks
CREATE OR REPLACE FUNCTION public.is_member_of(org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members
    WHERE user_id = auth.uid()
      AND organization_id = org_id
  );
$$ LANGUAGE sql
   STABLE
   SECURITY DEFINER
   SET search_path = public;
