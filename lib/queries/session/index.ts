'use server';

import { Organization, Profile } from '@/types';
import { User } from '@supabase/auth-js';
import { getUser } from '@/lib/queries/session/get-user';
import { getProfileByUserId } from '@/lib/queries/session/get-profile-by-user-id';
import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';
import { getOrganizations } from '@/lib/queries/organization/get-organizations';

export type SessionData = {
  user: User;
  profile: Profile;
  organizations: Array<Organization>;
};

export const getSessionData = cache(async (supabase: SupabaseClient): Promise<SessionData | null> => {
  const user = await getUser(supabase);

  if (!user.success || !user.data?.id) return null;

  const profile = await getProfileByUserId(supabase, user.data?.id);

  if (!profile.success || !profile.data) return null;

  const organizations = await getOrganizations(supabase, profile.data);

  if (!organizations.success || !organizations.data) return null;

  return { user: user.data, profile: profile.data, organizations: organizations.data };
});
