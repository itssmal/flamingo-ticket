'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { parseTicketFilters } from '@/lib/validations/ticket';
import { useTickets } from '@/lib/queries/ticket/use-tickets';
import { TicketFiltersBar } from './filters-bar';
import { TicketTable } from './ticket-table';
import type { FilteredTicketsResult } from '@/lib/queries/ticket/get-filtered-tickets';
import TicketListSkeleton from '@/components/features/tickets/ticket-list-skeleton';

interface TicketListViewProps {
  activeOrgId: string;
  initialData: FilteredTicketsResult;
}

export function TicketListView({ activeOrgId, initialData }: TicketListViewProps) {
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    return parseTicketFilters(Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  const { data, isPending, isError, isFetching } = useTickets(activeOrgId, filters, initialData);

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground text-sm">{isPending ? '\u00A0' : `${data?.count ?? 0} total tickets`}</p>

      <TicketFiltersBar filters={filters} />

      {isPending ? (
        <TicketListSkeleton />
      ) : isError ? (
        <div className="rounded-lg border bg-card p-12 text-center text-sm text-destructive">
          Something went wrong loading tickets. Please try again.
        </div>
      ) : (
        <div className={isFetching ? 'opacity-60 transition-opacity' : ''}>
          <TicketTable tickets={data.tickets} count={data.count} filters={filters} />
        </div>
      )}
    </div>
  );
}
