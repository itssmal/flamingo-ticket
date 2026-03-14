import { Profile } from '@/types';
import { User } from '@supabase/auth-js';
import { getUser } from '@/lib/queries/session/get-user';
import { getProfile } from '@/lib/queries/session/get-profile';
import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getSessionData = cache(
  async (supabase: SupabaseClient): Promise<{ user: User; profile: Profile } | null> => {
    const user = await getUser(supabase);

    if (!user.success || !user.data?.id) return null;

    const profile = await getProfile(supabase, user.data?.id);

    if (!profile.success || !profile.data?.id) return null;

    return { user: user.data, profile: profile.data };
  },
);
