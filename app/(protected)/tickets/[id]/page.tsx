import { notFound } from 'next/navigation';
import { TicketDetailView } from '@/components/features/tickets/ticket-detail';
import { CommentThread } from '@/components/features/tickets/comment-thread';
import type { Metadata } from 'next';
import { requireAuth } from '@/lib/queries/auth';
import { getTicketById } from '@/lib/queries/ticket/get-ticket-by-id';
import { getCommentsByTicketId } from '@/lib/queries/comment/get-comments';
import { getMembers } from '@/lib/queries/members/get-members';
import { createClient } from '@/lib/supabase/server';

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
  const { supabase, activeOrgId } = await requireAuth();
  const { id } = await params;

  const [ticket, comments, membersResult] = await Promise.all([
    getTicketById(supabase, id).catch(() => null),
    getCommentsByTicketId(supabase, id),
    getMembers(supabase, activeOrgId),
  ]);

  if (!ticket) notFound();

  const members = membersResult.success ? membersResult.data : [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <TicketDetailView ticketId={id} initialData={ticket} initialMembers={members} />
      <CommentThread ticketId={id} initialData={comments} />
    </div>
  );
}
