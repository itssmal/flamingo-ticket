'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { getFilteredTickets, type FilteredTicketsResult } from './get-filtered-tickets';
import { ticketKeys } from './keys';
import type { TicketFilters } from '@/types/ticket';

export function useTickets(orgId: string, filters: TicketFilters, initialData?: FilteredTicketsResult) {
  const supabase = createClient();

  return useQuery({
    queryKey: ticketKeys.list(orgId, filters),
    queryFn: () => getFilteredTickets(supabase, orgId, filters),
    initialData,
    placeholderData: keepPreviousData,
  });
}
