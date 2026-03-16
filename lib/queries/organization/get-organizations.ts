import { ActionResult, Organization, Profile } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';
import { COOKIES } from '@/lib/constants/cookies';

export async function getOrganizations(
  supabase: SupabaseClient,
  profile: Profile,
): Promise<ActionResult<Organization[]>> {
  const { role, id } = profile;

  // Admin sees all orgs
  if (role === 'admin') {
    const { data, error } = await supabase.from('organizations').select().order('name', { ascending: true });

    console.log('data', data);
    if (error) return { success: false, error: error.message };

    // await setDefaultActiveOrg(data[0].id);
    return { success: true, data: data ?? [] };
  }

  // Technician sees only their assigned orgs
  if (role === 'technician') {
    const { data, error } = await supabase.from('organization_members').select('organizations(*)').eq('user_id', id);

    if (error) return { success: false, error: error.message };

    console.log('technician', data);

    // const orgs = (data as Array<{ organizations: Array<Organization> }>)
    //   ?.map((row) => row.organizations)
    //   .filter(Boolean) as Organization[];
    // await setDefaultActiveOrg(data[0].organizations[0].id);

    return { success: true, data: data[0].organizations ?? [] };
  }

  const { data, error } = await supabase.from('organization_members').select('organizations(*)').eq('user_id', id);
  if (error) return { success: false, error: error.message };

  // Client user — no org switcher, return empty
  return { success: true, data: data[0].organizations ?? [] };
}
