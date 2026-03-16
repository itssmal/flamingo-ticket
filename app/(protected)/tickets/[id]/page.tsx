import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { TicketDetailView } from '@/components/features/tickets/ticket-detail';
import { CommentThread } from '@/components/features/tickets/comment-thread';
import type { Metadata } from 'next';
import { requireAuth } from '@/lib/queries/auth';

interface TicketPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: TicketPageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;
  const { data } = await supabase.from('tickets').select('title').eq('id', id).single();
  return { title: data ? `${data.title} – Flamingo` : 'Ticket' };
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { supabase, session } = await requireAuth();
  const { id } = await params;

  const [{ data: ticket }, { data: comments }] = await Promise.all([
    supabase
      .from('tickets')
      .select(
        '*, assignee:profiles!tickets_assignee_id_fkey(id, full_name, avatar_url, email), creator:profiles!tickets_creator_id_fkey(id, full_name, avatar_url, email), organizations(id, name, slug)',
      )
      .eq('id', id)
      .single(),
    supabase
      .from('comments')
      .select('*, author:profiles(id, full_name, avatar_url, email)')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true }),
  ]);

  if (!ticket) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <TicketDetailView ticket={ticket} currentUserId={session.user.id} userRole={session.profile.role} />
      <CommentThread comments={comments ?? []} ticketId={ticket.id} currentUserId={session.user.id} />
    </div>
  );
}
