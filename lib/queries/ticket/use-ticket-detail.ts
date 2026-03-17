'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { getTicketById } from './get-ticket-by-id';
import { ticketKeys } from './keys';
import { updateTicket } from '@/lib/actions/ticket';
import type { TicketWithRelations } from '@/types/ticket';
import type { UpdateTicketSchema } from '@/lib/validations/ticket';

export function useTicketDetail(id: string, initialData?: TicketWithRelations) {
  const supabase = createClient();

  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => getTicketById(supabase, id),
    initialData,
  });
}

export function useUpdateTicket(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTicketSchema) => updateTicket(id, data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ticketKeys.detail(id) });

      const previous = queryClient.getQueryData<TicketWithRelations>(ticketKeys.detail(id));

      queryClient.setQueryData<TicketWithRelations>(ticketKeys.detail(id), (old) => {
        if (!old) return old;
        return { ...old, ...newData, updated_at: new Date().toISOString() };
      });

      return { previous };
    },
    onError: (_err, _newData, context) => {
      if (context?.previous) {
        queryClient.setQueryData(ticketKeys.detail(id), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}
