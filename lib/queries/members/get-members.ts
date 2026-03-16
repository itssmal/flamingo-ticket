import { SupabaseClient } from '@supabase/supabase-js';
import { ActionResult, Profile } from '@/types';

export async function getMembers(supabase: SupabaseClient, orgId: string): Promise<ActionResult<Array<Profile>>> {
  const { data, error } = await supabase
    .from('organization_members')
    .select('profiles(*)')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: true });

  console.log('get members', { data, error });

  if (error) {
    return { success: false, error: error.message };
  }

  const profiles = (data?.map((row) => row.profiles).filter(Boolean) ?? []) as unknown as Profile[];

  return { success: true, data: profiles };
}
