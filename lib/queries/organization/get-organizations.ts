import { ActionResult, Organization, Profile } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';

export async function getOrganizations(
  supabase: SupabaseClient,
  profile: Profile,
): Promise<ActionResult<Organization[]>> {
  const { role, id } = profile;

  // Admin sees all orgs
  if (role === 'admin') {
    const { data, error } = await supabase.from('organizations').select().order('name', { ascending: true });

    if (error) return { success: false, error: error.message };

    return { success: true, data: data ?? [] };
  }

  // Technician sees only their assigned orgs
  if (role === 'technician') {
    const { data, error } = await supabase.from('organization_members').select('organizations(*)').eq('user_id', id);

    if (error) return { success: false, error: error.message };

    const orgs = ((data as unknown as Array<{ organizations: Organization }>)
      ?.map((row) => row.organizations)
      .filter(Boolean) ?? []) as Organization[];

    return { success: true, data: orgs ?? [] };
  }

  const { data, error } = await supabase.from('organization_members').select('organizations(*)').eq('user_id', id);

  const orgs = ((data as unknown as Array<{ organizations: Organization }>)
    ?.map((row) => row.organizations)
    .filter(Boolean) ?? []) as Organization[];

  if (error) return { success: false, error: error.message };

  // Client user — no org switcher, return empty
  return { success: true, data: orgs ?? [] };
}
