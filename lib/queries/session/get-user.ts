import { SupabaseClient } from '@supabase/supabase-js';
import { ActionResult } from '@/types';
import { User } from '@supabase/auth-js';

export const getUser = async (supabase: SupabaseClient): Promise<ActionResult<User>> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return { success: false, error: error.message };

  return { success: true, data: user ?? undefined };
};
