'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateCommentSchema, createCommentSchema } from '@/lib/validations/comment';
import { ActionResult } from '@/lib/actions/auth';

export async function createComment(formData: CreateCommentSchema): Promise<ActionResult<Comment>> {
  const parsed = createCommentSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('comments')
    .insert({ ...parsed.data, author_id: user.id })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  // revalidatePath(`/tickets/${parsed.data.ticket_id}`);
  return { success: true, data };
}
