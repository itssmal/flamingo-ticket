import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSessionData, SessionData } from '@/lib/queries/session';
import { getActiveOrgId } from '@/utils/active-org';
import { SupabaseClient } from '@supabase/supabase-js';

type AuthContext = {
  supabase: SupabaseClient;
  session: SessionData;
  activeOrgId: string;
};

export const requireAuth = cache(async (): Promise<AuthContext> => {
  const supabase = await createClient();
  const session = await getSessionData(supabase);

  if (!session) {
    redirect('/auth/login');
  }

  const activeOrgId = await getActiveOrgId(session.organizations);

  if (!activeOrgId) {
    redirect('/dashboard');
  }

  return { supabase, session, activeOrgId };
});
