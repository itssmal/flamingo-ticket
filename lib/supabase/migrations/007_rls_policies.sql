-- Row Level Security policies for all tables
-- Depends on: 006_rls_helpers.sql

ALTER TABLE public.organizations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites              ENABLE ROW LEVEL SECURITY;

-- ── organizations ─────────────────────────────────────────────
--
-- admin    → all orgs
-- others   → only orgs they are members of

CREATE POLICY "organizations_select"
  ON public.organizations FOR SELECT
  USING (
    is_admin()
    OR is_member_of(id)
  );

-- Only admins can create orgs
CREATE POLICY "organizations_insert"
  ON public.organizations FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Only admins can update orgs
CREATE POLICY "organizations_update"
  ON public.organizations FOR UPDATE
  USING (is_admin());

-- Only admins can delete orgs
CREATE POLICY "organizations_delete"
  ON public.organizations FOR DELETE
  USING (is_admin());

-- ── profiles ──────────────────────────────────────────────────
--
-- admin      → all profiles
-- others     → own profile + profiles of members in shared orgs

CREATE POLICY "profiles_select"
  ON public.profiles FOR SELECT
  USING (
    is_admin()
    OR id = auth.uid()
    OR EXISTS (
      SELECT 1
      FROM public.organization_members om1
      JOIN public.organization_members om2
        ON om1.organization_id = om2.organization_id
      WHERE om1.user_id = auth.uid()
        AND om2.user_id = profiles.id
    )
  );

-- Users insert their own profile (onboarding)
CREATE POLICY "profiles_insert"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Users update their own profile; admins update any
CREATE POLICY "profiles_update"
  ON public.profiles FOR UPDATE
  USING (
    id = auth.uid()
    OR is_admin()
  );

-- Only admins can delete profiles
CREATE POLICY "profiles_delete"
  ON public.profiles FOR DELETE
  USING (is_admin());

-- ── organization_members ──────────────────────────────────────
--
-- admin    → all memberships
-- others   → own memberships + memberships within shared orgs

CREATE POLICY "members_select"
  ON public.organization_members FOR SELECT
  USING (
    is_admin()
    OR user_id = auth.uid()
    OR is_member_of(organization_id)
  );

-- Users insert their own membership (onboarding)
-- Admins insert any membership (assigning technicians)
CREATE POLICY "members_insert"
  ON public.organization_members FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    OR is_admin()
  );

-- Only admins can remove members
CREATE POLICY "members_delete"
  ON public.organization_members FOR DELETE
  USING (is_admin());

-- ── tickets ───────────────────────────────────────────────────
--
-- admin        → all tickets
-- technician   → tickets in their orgs
-- client_user  → tickets in their org

CREATE POLICY "tickets_select"
  ON public.tickets FOR SELECT
  USING (
    is_admin()
    OR is_member_of(organization_id)
  );

-- Any member can create tickets in their org
CREATE POLICY "tickets_insert"
  ON public.tickets FOR INSERT
  TO authenticated
  WITH CHECK (
    is_admin()
    OR is_member_of(organization_id)
  );

-- admin        → any ticket
-- technician   → any ticket in their orgs
-- client_user  → only their own tickets
CREATE POLICY "tickets_update"
  ON public.tickets FOR UPDATE
  USING (
    is_admin()
    OR (
      is_member_of(organization_id)
      AND (
        creator_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.profiles
          WHERE id = auth.uid()
            AND role = 'technician'
        )
      )
    )
  );

-- Only admins can delete tickets
CREATE POLICY "tickets_delete"
  ON public.tickets FOR DELETE
  USING (is_admin());

-- ── comments ──────────────────────────────────────────────────
--
-- Mirrors ticket access — if you can see the ticket, you can see its comments

CREATE POLICY "comments_select"
  ON public.comments FOR SELECT
  USING (
    is_admin()
    OR EXISTS (
      SELECT 1
      FROM public.tickets
      WHERE tickets.id = comments.ticket_id
        AND is_member_of(tickets.organization_id)
    )
  );

-- Any member can comment on tickets in their org
CREATE POLICY "comments_insert"
  ON public.comments FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()
    AND (
      is_admin()
      OR EXISTS (
        SELECT 1
        FROM public.tickets
        WHERE tickets.id = comments.ticket_id
          AND is_member_of(tickets.organization_id)
      )
    )
  );

-- Users edit their own comments; admins edit any
CREATE POLICY "comments_update"
  ON public.comments FOR UPDATE
  USING (
    author_id = auth.uid()
    OR is_admin()
  );

-- Users delete their own comments; admins delete any
CREATE POLICY "comments_delete"
  ON public.comments FOR DELETE
  USING (
    author_id = auth.uid()
    OR is_admin()
  );

-- ── invites ───────────────────────────────────────────────────
--
-- admin    → all invites
-- others   → invites within their org (read only, so they can see pending ones)

CREATE POLICY "invites_select"
  ON public.invites FOR SELECT
  USING (
    is_admin()
    OR is_member_of(organization_id)
  );

-- Only admins can send invites
CREATE POLICY "invites_insert"
  ON public.invites FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Only admins can revoke invites
CREATE POLICY "invites_delete"
  ON public.invites FOR DELETE
  USING (is_admin());
