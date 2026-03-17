import { SupabaseClient } from '@supabase/supabase-js';
import type { CommentWithAuthor } from '@/types/comment';

const COMMENT_SELECT = '*, author:profiles(id, full_name, avatar_url, email)';

export async function getCommentsByTicketId(
  supabase: SupabaseClient,
  ticketId: string,
): Promise<CommentWithAuthor[]> {
  const { data, error } = await supabase
    .from('comments')
    .select(COMMENT_SELECT)
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data ?? []) as unknown as CommentWithAuthor[];
}
