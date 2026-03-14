import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NewTicketForm } from '@/components/features/tickets/new-ticket-form';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'New Ticket – Flamingo' };

export default async function NewTicketPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('organization_id, role').eq('id', user.id).single();
  if (!profile) redirect('/login');

  // Load org members for assignee selector (only visible to admin/technician)
  let members = null;
  if (profile.role !== 'client_user') {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('organization_id', profile.organization_id)
      .in('role', ['admin', 'technician']);
    members = data;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New Ticket</h1>
        <p className="text-muted-foreground text-sm">Create a new support ticket</p>
      </div>
      <NewTicketForm members={members} />
    </div>
  );
}
