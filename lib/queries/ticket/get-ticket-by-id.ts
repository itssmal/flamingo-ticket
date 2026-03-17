import { SupabaseClient } from '@supabase/supabase-js';
import type { TicketWithRelations } from '@/types/ticket';

export const TICKET_DETAIL_SELECT =
  '*, assignee:profiles!tickets_assignee_id_fkey(id, full_name, avatar_url, email), creator:profiles!tickets_creator_id_fkey(id, full_name, avatar_url, email), organizations(id, name, slug)';

export async function getTicketById(supabase: SupabaseClient, id: string): Promise<TicketWithRelations> {
  const { data, error } = await supabase.from('tickets').select(TICKET_DETAIL_SELECT).eq('id', id).single();

  if (error) throw error;

  return data as unknown as TicketWithRelations;
}
