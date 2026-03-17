# Flamingo Ticket

A multi-tenant client portal where technicians can manage support tickets for different client organizations. Built with
Next.js, Supabase, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components, Server Actions)
- **Language:** TypeScript (strict mode)
- **Database:** Supabase (PostgreSQL) with Row Level Security
- **Auth:** Supabase Auth (Google SSO + Magic Link)
- **Styling:** Tailwind CSS + shadcn/ui (Radix primitives)
- **Validation:** Zod
- **Client State:** TanStack Query v5

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- Google OAuth credentials (for SSO)

### 1. Clone and install

```bash
git clone <repo-url>
cd flamingo-ticket
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable                               | Description                                                                             |
|----------------------------------------|-----------------------------------------------------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`             | Your Supabase project URL                                                               |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon / publishable key                                                         |
| `SUPABASE_SECRET_KEY`                  | Supabase service role key (server-only, used for admin operations like sending invites) |
| `NEXT_PUBLIC_SITE_URL`                 | App URL — `http://localhost:3000` for local dev                                         |

All keys can be found in your Supabase dashboard under **Settings > API**.

### 3. Set up the database

Run the SQL migration files in `lib/supabase/migrations/` in order against your Supabase project:

```
001_extensions.sql     — required Postgres extensions
002_enums.sql          — user_role, ticket_status, ticket_priority
003_tables.sql         — organizations, profiles, organization_members, tickets, comments, invites
004_indexes.sql        — performance indexes
005_triggers.sql       — updated_at auto-touch triggers
006_rls_helpers.sql    — is_admin() and is_member_of() helper functions
007_rls_policies.sql   — Row Level Security policies for all tables
008_storage.sql        — storage bucket configuration
```

You can run these via the Supabase SQL Editor (Dashboard > SQL Editor) or using the Supabase CLI.

### 4. Configure Supabase Auth

1. **Google SSO:** In Supabase Dashboard > Authentication > Providers, enable Google and add your OAuth client ID and
   secret.
2. **Redirect URLs:** Add `http://localhost:3000/auth/callback` and `http://localhost:3000/auth/invite-callback` to *
   *Authentication > URL Configuration > Redirect URLs**.
3. **Site URL:** Set to `http://localhost:3000` (or your production URL).

### 5. Run the dev server

```bash
npm run dev
```

The app will be running at [http://localhost:3000](http://localhost:3000).

### Regenerating database types

If you change the database schema, regenerate the TypeScript types:

```bash
npm run gen:types
```

## Project Structure

```
app/
├── (onboarding)/            # Onboarding + invite acceptance flows
│   ├── onboarding/          # New user org setup
│   └── invite/              # Invited user name entry
├── (protected)/             # Authenticated routes (sidebar layout)
│   ├── dashboard/           # Stats overview + recent tickets
│   ├── tickets/             # Ticket list (filtering, sorting, pagination)
│   │   └── [id]/            # Ticket detail + comment thread
│   └── admin/               # Invite members + pending invites
└── auth/
    ├── (login)/login/       # Google SSO + magic link form
    ├── callback/            # OAuth PKCE code exchange
    ├── invite-callback/     # Implicit-flow invite token exchange
    ├── confirm/             # OTP verification
    └── check-email/         # Post-magic-link confirmation

components/
├── features/                # Domain-specific components
│   ├── tickets/             # TicketDetailView, TicketTable, filters, dialogs
│   ├── admin/               # InviteMemberForm, PendingInvites
│   ├── auth/                # MagicLinkLogin, GoogleLogin
│   └── onboarding/          # OnboardingForm, InviteCompleteForm
├── layout/                  # Sidebar, TopBar, OrgSelect, KeyboardShortcuts
└── ui/                      # shadcn/ui primitives (Button, Input, Select, etc.)

lib/
├── actions/                 # Server Actions (ticket CRUD, auth, invites)
├── queries/                 # Data fetching (server) + TanStack Query hooks (client)
├── supabase/                # Supabase client setup (server, client, admin, middleware)
│   └── migrations/          # SQL migration files
├── validations/             # Zod schemas
├── context/                 # React context (session)
└── constants/               # Routes, cookies

types/                       # Database types (generated) + domain types
utils/                       # Formatting helpers, config maps
```

## Design Decisions

### Authentication

Two auth methods are supported: **Google SSO** for quick sign-in and **Magic Link** for users without Google accounts.
Supabase Auth handles token management, and sessions are persisted via cookies using `@supabase/ssr`. The middleware (
`lib/supabase/proxy.ts`) refreshes the session on every request and routes unauthenticated users to login.

Invite links use a dedicated `/auth/invite-callback` client-side page. This handles Supabase's implicit auth flow, where
the session token arrives as a URL hash fragment (invisible to the server). The page reads the hash, calls
`setSession()`, then redirects to the server-rendered `/invite` page.

### Multi-tenancy

Organizations are the tenancy boundary. The `organization_members` join table links users to orgs. The active org is
stored in a cookie and resolved in middleware via `requireAuth()`, which provides `activeOrgId` to all server
components. An org switcher in the sidebar lets users with multiple memberships switch context. All data queries are
scoped to the active org.

### Row Level Security

Every table has RLS enabled with policies defined in `007_rls_policies.sql`. Two helper functions (`is_admin()` and
`is_member_of()`) keep policies readable:

- **Admins** have global access across all organizations
- **Technicians** can view and update tickets in their assigned orgs
- **Client Users** can view all tickets in their org but only update their own

This ensures data isolation at the database level, independent of application code.

### Data Fetching

Server Components fetch initial data (via the Supabase server client) and pass it as `initialData` to TanStack Query
hooks in client components. This gives us instant server-rendered pages with client-side cache management, background
revalidation, and optimistic updates — without waterfalls or loading spinners on first paint.

### Optimistic UI

**Comments** use a full optimistic update cycle: `onMutate` cancels in-flight queries, snapshots previous state, inserts
a temporary comment, and `onError` rolls back. **Ticket updates** (status, priority, assignee) also update
optimistically on the detail view.

### Error Handling

Every route segment has both a `loading.tsx` (Suspense boundary) and an `error.tsx` (error boundary). Error boundaries
log the error, display a contextual message, and offer a "Try again" button that calls Next.js's `reset()` to re-render
the segment without a full page reload.

### Role-based UI

The UI adapts based on the user's role:

- **Admins** see the full sidebar including the Admin panel, can manage all tickets, and invite members
- **Technicians** can update any ticket in their orgs but don't see the Admin panel
- **Client Users** can create tickets and view all tickets in their org, but can only edit their own

## What I'd Improve With More Time

- **More keyboard navigation** in the app overall — currently only `c` (new ticket) and `cmd+enter` (submit comment) are
  implemented
- **Real-time updates** - subscriptions for live ticket status changes and new comments
- **Invite management** — ability to revoke pending invites and resend expired ones
- **User profile page** — avatar upload, name editing, notification preferences
- **Technician organization assignment** — ability to assign technicians to specific organizations for better access
  control
- **Admin panel** — functionality to manage organizations and members
- **Bulk actions** for tickets management (e.g. bulk close, assign)
- **Dashboard chart** — visual stats on ticket volume, status distribution, assignment load, etc.
