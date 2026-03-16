import { ActionResult, Profile } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';

export const getProfileByUserId = async (supabase: SupabaseClient, userId: string): Promise<ActionResult<Profile>> => {
  const { data, error } = await supabase.from('profiles').select().eq('id', userId).single();

  if (error) return { success: false, error: error.message };

  return { success: true, data };
};
