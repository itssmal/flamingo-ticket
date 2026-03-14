import { SupabaseClient } from '@supabase/supabase-js';
import { ActionResult } from '@/types';
import { TicketStats } from '@/types/ticket';

export const getTicketsStats = async (supabase: SupabaseClient, orgId: string): Promise<ActionResult<TicketStats>> => {
  const { data: tickets } = await supabase.from('tickets').select('status, priority').eq('organization_id', orgId);

  return {
    success: true,
    data: {
      total: tickets?.length || 0,
      open: tickets?.filter((t) => t.status === 'open').length || 0,
      in_progress: tickets?.filter((t) => t.status === 'in_progress').length || 0,
      resolved: tickets?.filter((t) => t.status === 'resolved').length || 0,
      closed: tickets?.filter((t) => t.status === 'closed').length || 0,
      by_priority: {
        low: tickets?.filter((t) => t.priority === 'low').length || 0,
        medium: tickets?.filter((t) => t.priority === 'medium').length || 0,
        high: tickets?.filter((t) => t.priority === 'high').length || 0,
        urgent: tickets?.filter((t) => t.priority === 'urgent').length || 0,
      },
    },
  };
};
