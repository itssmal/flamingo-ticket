'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { createComment } from '@/lib/actions/comment';
import { formatRelativeTime, getInitials } from '@/utils';
import type { CommentWithAuthor } from '@/types/comment';

interface CommentThreadProps {
  comments: CommentWithAuthor[];
  ticketId: string;
  currentUserId: string;
}

export function CommentThread({ comments, ticketId, currentUserId }: CommentThreadProps) {
  const [content, setContent] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [optimisticComments, addOptimisticComment] = useOptimistic(comments, (state, newComment: CommentWithAuthor) => [
    ...state,
    newComment,
  ]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    const tempComment: CommentWithAuthor = {
      id: `temp-${Date.now()}`,
      content: content.trim(),
      ticket_id: ticketId,
      author_id: currentUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: { id: currentUserId, full_name: 'You', avatar_url: null, email: '' },
    };

    setContent('');
    setError(null);

    startTransition(async () => {
      addOptimisticComment(tempComment);
      const result = await createComment({ content: tempComment.content, ticket_id: ticketId });
      if (!result.success) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h2 className="font-semibold">
          Comments <span className="text-muted-foreground font-normal text-sm">({optimisticComments.length})</span>
        </h2>
      </div>

      <div className="divide-y">
        {optimisticComments.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">No comments yet. Be the first to respond.</p>
        ) : (
          optimisticComments.map((comment) => (
            <div key={comment.id} className="p-4 flex gap-3">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                {getInitials(comment.author?.full_name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {comment.author?.full_name ?? comment.author?.email ?? 'Unknown'}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(comment.created_at)}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!content.trim() || isPending}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
