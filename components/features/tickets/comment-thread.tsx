'use client';

import { useState } from 'react';
import { useSessionContext } from '@/lib/context/session-context';
import { useComments, useAddComment } from '@/lib/queries/comment/use-comments';
import { formatRelativeTime, getInitials } from '@/utils';
import type { CommentWithAuthor } from '@/types/comment';
import { Kbd } from '@/components/ui/kbd';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CommentThreadProps {
  ticketId: string;
  initialData: CommentWithAuthor[];
}

export function CommentThread({ ticketId, initialData }: CommentThreadProps) {
  const { user, profile } = useSessionContext();
  const { data: comments = [] } = useComments(ticketId, initialData);
  const { mutate: addComment, isPending, error: mutationError } = useAddComment(ticketId);

  const [content, setContent] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    addComment({
      content: content.trim(),
      author: {
        id: user.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        email: profile.email,
      },
    });

    setContent('');
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h2 className="font-semibold">
          Comments <span className="text-muted-foreground font-normal text-sm">({comments.length})</span>
        </h2>
      </div>

      <div className="divide-y">
        {comments.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">No comments yet. Be the first to respond.</p>
        ) : (
          comments.map((comment) => (
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
          <Textarea
            value={content}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
          />
          {mutationError && <p className="text-sm text-destructive">Failed to post comment. Please try again.</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={!content.trim() || isPending}>
              {isPending ? 'Posting...' : 'Post Comment'}
              <Kbd>⌘ + ⏎</Kbd>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
