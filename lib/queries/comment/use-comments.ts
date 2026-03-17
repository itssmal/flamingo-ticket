'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { getCommentsByTicketId } from './get-comments';
import { commentKeys } from './keys';
import { createComment } from '@/lib/actions/comment';
import type { CommentWithAuthor } from '@/types/comment';
import type { Profile } from '@/types';

export function useComments(ticketId: string, initialData?: CommentWithAuthor[]) {
  const supabase = createClient();

  return useQuery({
    queryKey: commentKeys.list(ticketId),
    queryFn: () => getCommentsByTicketId(supabase, ticketId),
    initialData,
  });
}

type AddCommentParams = {
  content: string;
  author: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'email'>;
};

export function useAddComment(ticketId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ content }: AddCommentParams) => createComment({ content, ticket_id: ticketId }),
    onMutate: async ({ content, author }) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.list(ticketId) });

      const previous = queryClient.getQueryData<CommentWithAuthor[]>(commentKeys.list(ticketId));

      const optimistic: CommentWithAuthor = {
        id: `temp-${Date.now()}`,
        content,
        ticket_id: ticketId,
        author_id: author.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author,
      };

      queryClient.setQueryData<CommentWithAuthor[]>(commentKeys.list(ticketId), (old) => [
        ...(old ?? []),
        optimistic,
      ]);

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(commentKeys.list(ticketId), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.list(ticketId) });
    },
  });
}
