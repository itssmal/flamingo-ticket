-- Core table definitions

-- Organizations (tenants)
CREATE TABLE public.organizations
(
    id         UUID PRIMARY KEY     DEFAULT uuid_generate_v4(),
    name       TEXT        NOT NULL,
    slug       TEXT        NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User profiles — extends auth.users
CREATE TABLE public.profiles
(
    id         UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    email      TEXT        NOT NULL,
    full_name  TEXT,
    avatar_url TEXT,
    role       user_role   NOT NULL DEFAULT 'client_user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Org membership — who belongs to which org
-- admin has no rows here (global access via role)
-- technician has one row per assigned org
-- client_user has exactly one row
CREATE TABLE public.organization_members
(
    user_id         UUID        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    organization_id UUID        NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, organization_id)
);

-- Support tickets
CREATE TABLE public.tickets
(
    id              UUID PRIMARY KEY         DEFAULT uuid_generate_v4(),
    title           TEXT            NOT NULL,
    description     TEXT,
    status          ticket_status   NOT NULL DEFAULT 'open',
    priority        ticket_priority NOT NULL DEFAULT 'medium',
    organization_id UUID            NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
    creator_id      UUID            NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    assignee_id     UUID            REFERENCES public.profiles (id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Ticket comments
CREATE TABLE public.comments
(
    id         UUID PRIMARY KEY     DEFAULT uuid_generate_v4(),
    content    TEXT        NOT NULL,
    ticket_id  UUID        NOT NULL REFERENCES public.tickets (id) ON DELETE CASCADE,
    author_id  UUID        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pending invites sent by admins
CREATE TABLE public.invites
(
    id              UUID PRIMARY KEY     DEFAULT uuid_generate_v4(),
    email           TEXT        NOT NULL,
    role            user_role   NOT NULL DEFAULT 'client_user',
    organization_id UUID        NOT NULL REFERENCES public.organizations (id) ON DELETE CASCADE,
    invited_by      UUID        NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    accepted_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
