import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { TicketFiltersBar } from '@/components/features/tickets/filters-bar';
import { TicketTable } from '@/components/features/tickets/ticket-table';
import { ticketFiltersSchema } from '@/lib/validations/ticket';
import type { TicketFilters } from '@/types/ticket';
import { Plus } from 'lucide-react';

interface TicketsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('organization_id, role').eq('id', user.id).single();
  if (!profile) redirect('/login');

  // Parse and validate filters from URL
  const rawFilters = {
    status: searchParams.status ?? 'all',
    priority: searchParams.priority ?? 'all',
    assignee_id: searchParams.assignee_id ?? 'all',
    search: searchParams.search ?? '',
    page: searchParams.page ?? '1',
    per_page: searchParams.per_page ?? '20',
    sort_by: searchParams.sort_by ?? 'created_at',
    sort_order: searchParams.sort_order ?? 'desc',
  };

  const filters = ticketFiltersSchema.parse(rawFilters) as TicketFilters;

  // Build query
  let query = supabase
    .from('tickets')
    .select(
      '*, assignee:profiles!tickets_assignee_id_fkey(id, full_name, avatar_url, email), creator:profiles!tickets_creator_id_fkey(id, full_name, avatar_url, email)',
      { count: 'exact' },
    )
    .eq('organization_id', profile.organization_id);

  if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status);
  if (filters.priority && filters.priority !== 'all') query = query.eq('priority', filters.priority);
  if (filters.assignee_id && filters.assignee_id !== 'all') query = query.eq('assignee_id', filters.assignee_id);
  if (filters.search) query = query.ilike('title', `%${filters.search}%`);

  const page = filters.page ?? 1;
  const perPage = filters.per_page ?? 20;
  query = query
    .order(filters.sort_by ?? 'created_at', { ascending: filters.sort_order === 'asc' })
    .range((page - 1) * perPage, page * perPage - 1);

  const { data: tickets, count } = await query;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground text-sm">{count ?? 0} total tickets</p>
        </div>
        <Link
          href="/tickets/new"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Ticket
        </Link>
      </div>

      <TicketFiltersBar filters={filters} />
      <TicketTable tickets={tickets ?? []} count={count ?? 0} filters={filters} />
    </div>
  );
}
