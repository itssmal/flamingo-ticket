import { SupabaseClient } from '@supabase/supabase-js';
import type { TicketFilters, TicketWithRelations } from '@/types/ticket';

export type FilteredTicketsResult = {
  tickets: TicketWithRelations[];
  count: number;
};

const TICKET_SELECT =
  '*, assignee:profiles!tickets_assignee_id_fkey(id, full_name, avatar_url, email), creator:profiles!tickets_creator_id_fkey(id, full_name, avatar_url, email)';

export async function getFilteredTickets(
  supabase: SupabaseClient,
  orgId: string,
  filters: TicketFilters,
): Promise<FilteredTicketsResult> {
  let query = supabase
    .from('tickets')
    .select(TICKET_SELECT, { count: 'exact' })
    .eq('organization_id', orgId);

  if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status);
  if (filters.priority && filters.priority !== 'all') query = query.eq('priority', filters.priority);
  if (filters.assignee_id && filters.assignee_id !== 'all') query = query.eq('assignee_id', filters.assignee_id);
  if (filters.search) query = query.ilike('title', `%${filters.search}%`);

  const page = filters.page ?? 1;
  const perPage = filters.per_page ?? 20;

  const { data, count, error } = await query
    .order(filters.sort_by ?? 'created_at', { ascending: filters.sort_order === 'asc' })
    .range((page - 1) * perPage, page * perPage - 1);

  if (error) throw error;

  return { tickets: data ?? [], count: count ?? 0 };
}
