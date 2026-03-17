-- Performance indexes

-- profiles
CREATE INDEX idx_profiles_role
  ON public.profiles(role);

-- organization_members
CREATE INDEX idx_org_members_user_id
  ON public.organization_members(user_id);

CREATE INDEX idx_org_members_org_id
  ON public.organization_members(organization_id);

-- tickets
CREATE INDEX idx_tickets_organization_id
  ON public.tickets(organization_id);

CREATE INDEX idx_tickets_creator_id
  ON public.tickets(creator_id);

CREATE INDEX idx_tickets_assignee_id
  ON public.tickets(assignee_id);

CREATE INDEX idx_tickets_status
  ON public.tickets(status);

CREATE INDEX idx_tickets_priority
  ON public.tickets(priority);

-- DESC because most queries fetch newest first
CREATE INDEX idx_tickets_created_at
  ON public.tickets(created_at DESC);

-- Composite index for filtered ticket list queries
CREATE INDEX idx_tickets_org_status
  ON public.tickets(organization_id, status);

CREATE INDEX idx_tickets_org_priority
  ON public.tickets(organization_id, priority);

-- comments
CREATE INDEX idx_comments_ticket_id
  ON public.comments(ticket_id);

CREATE INDEX idx_comments_author_id
  ON public.comments(author_id);

CREATE INDEX idx_comments_created_at
  ON public.comments(created_at ASC);

-- invites
CREATE INDEX idx_invites_email
  ON public.invites(email);

CREATE INDEX idx_invites_organization_id
  ON public.invites(organization_id);

-- Partial index — only pending invites (most queries filter on accepted_at IS NULL)
CREATE INDEX idx_invites_pending
  ON public.invites(organization_id)
  WHERE accepted_at IS NULL;
