import { SupabaseClient } from '@supabase/supabase-js';
import { ActionResult } from '@/types';
import { TicketWithRelations } from '@/types/ticket';

export const getRecentTickets = async (
  supabase: SupabaseClient,
  orgId: string,
): Promise<ActionResult<Array<TicketWithRelations>>> => {
  const { data, error } = await supabase
    .from('tickets')
    .select(
      '*, assignee:profiles!tickets_assignee_id_fkey(id, full_name, avatar_url, email), creator:profiles!tickets_creator_id_fkey(id, full_name, avatar_url, email)',
    )
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) return { success: false, error: error.message };

  return { success: true, data };
};
