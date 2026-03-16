'use server';

import { Organization, Profile } from '@/types';
import { User } from '@supabase/auth-js';
import { getUser } from '@/lib/queries/session/get-user';
import { getProfileByUserId } from '@/lib/queries/session/get-profile-by-user-id';
import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';
import { getOrganizations } from '@/lib/queries/organization/get-organizations';
import { cookies } from 'next/headers';
import { COOKIES } from '@/lib/constants/cookies';

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

  console.log('organizations', organizations);

  if (!organizations.success || !organizations.data) return null;

  return { user: user.data, profile: profile.data, organizations: organizations.data };
});

export const ensureOrganization = async (availableOrganizations: Array<Organization>): Promise<string> => {
  const cookieStore = await cookies();
  const orgIdCookie = cookieStore.get(COOKIES.ACTIVE_ORG_ID)?.value;

  if (!orgIdCookie) {
    const defaultOrgId = availableOrganizations?.[0]?.id;
    cookieStore.set(COOKIES.ACTIVE_ORG_ID, defaultOrgId);
    return defaultOrgId;
  }

  return orgIdCookie;
};
