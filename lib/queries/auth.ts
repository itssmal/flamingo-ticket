import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSessionData, SessionData } from '@/lib/queries/session';
import { getActiveOrgId } from '@/utils/active-org';
import { SupabaseClient } from '@supabase/supabase-js';
import { ROUTES } from '@/lib/constants/routes';

type AuthContext = {
  supabase: SupabaseClient;
  session: SessionData;
  activeOrgId: string;
};

export const requireAuth = cache(async (): Promise<AuthContext> => {
  const supabase = await createClient();
  const session = await getSessionData(supabase);

  if (!session) {
    redirect(ROUTES.LOGIN);
  }

  const activeOrgId = await getActiveOrgId(session.organizations);

  if (!activeOrgId) {
    redirect(ROUTES.DASHBOARD);
  }

  return { supabase, session, activeOrgId };
});
