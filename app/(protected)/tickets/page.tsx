import { requireAuth } from '@/lib/queries/auth';
import { TicketListView } from '@/components/features/tickets/ticket-list-view';
import { Suspense } from 'react';
import NewTicketDialog from '@/components/features/tickets/new-ticket-dialog';
import { getMembers } from '@/lib/queries/members/get-members';
import { NewTicketButton } from '@/components/features/tickets/new-ticket-button';
import { getFilteredTickets } from '@/lib/queries/ticket/get-filtered-tickets';
import { parseTicketFilters } from '@/lib/validations/ticket';
import { Profile } from '@/types';
import { KeyboardShortcuts } from '@/components/layout/keyboard-shortcuts';

interface TicketsPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const { supabase, activeOrgId, session } = await requireAuth();
  const params = await searchParams;
  const { new: isTicketCreation, ...filterParams } = params;

  const filters = parseTicketFilters(filterParams);
  const initialData = await getFilteredTickets(supabase, activeOrgId, filters);

  let members: Array<Profile> = [];
  if (session.profile.role !== 'client_user') {
    const result = await getMembers(supabase, activeOrgId);
    members = result.success && result.data ? result.data : [];
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tickets</h1>
        <NewTicketButton />
      </div>

      <Suspense>
        <TicketListView activeOrgId={activeOrgId} initialData={initialData} />
      </Suspense>

      <NewTicketDialog open={isTicketCreation === '1'} members={members} orgId={activeOrgId} />
      <KeyboardShortcuts />
    </div>
  );
}
