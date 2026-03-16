import { SupabaseClient } from '@supabase/supabase-js';
import { ActionResult, Invite } from '@/types';

export async function getInvites(supabase: SupabaseClient, orgId: string): Promise<ActionResult<Array<Invite>>> {
  const { data, error } = await supabase
    .from('invites')
    .select()
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
