import { SupabaseClient } from '@supabase/supabase-js';

export const getTicketsStats = async (supabase: SupabaseClient, orgId: string) => {
  const { data: tickets } = await supabase.from('tickets').select('status, priority').eq('organization_id', orgId);

  if (!tickets) {
    return {
      total: 0,
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      by_priority: { low: 0, medium: 0, high: 0, urgent: 0 },
    };
  }

  return {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
    by_priority: {
      low: tickets.filter((t) => t.priority === 'low').length,
      medium: tickets.filter((t) => t.priority === 'medium').length,
      high: tickets.filter((t) => t.priority === 'high').length,
      urgent: tickets.filter((t) => t.priority === 'urgent').length,
    },
  };
};
