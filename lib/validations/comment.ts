import z from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000, 'Comment must be under 2000 characters'),
  ticket_id: z.string().uuid(),
});

export type CreateCommentSchema = z.infer<typeof createCommentSchema>;
