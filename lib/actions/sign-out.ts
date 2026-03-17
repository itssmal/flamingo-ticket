'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { COOKIES } from '@/lib/constants/cookies';

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete(COOKIES.ACTIVE_ORG_ID);
  redirect('/auth/login');
};
