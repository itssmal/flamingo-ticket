import { SupabaseClient } from '@supabase/supabase-js';
import { ActionResult, Profile } from '@/types';

export async function getMembers(supabase: SupabaseClient, orgId: string): Promise<ActionResult<Array<Profile>>> {
  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('organization_id', orgId)
    .order('created_at', { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
