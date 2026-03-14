import { Profile } from '@/types';
import { User } from '@supabase/auth-js';
import { getUser } from '@/lib/queries/session/get-user';
import { getProfile } from '@/lib/queries/session/get-profile';
import { SupabaseClient } from '@supabase/supabase-js';

export const getSessionData = async (supabase: SupabaseClient): Promise<{ user: User; profile: Profile } | null> => {
  const user = await getUser(supabase);

  console.log('user in query', user);

  if (!user.success || !user.data?.id) return null;

  const profile = await getProfile(supabase, user.data?.id);

  console.log('profile in query', profile);

  if (!profile.success || !profile.data?.id) return null;

  return { user: user.data, profile: profile.data };
};
