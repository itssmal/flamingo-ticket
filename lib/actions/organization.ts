'use server';

import { cookies } from 'next/headers';
import { COOKIES } from '@/lib/constants/cookies';
import { ActionResult } from '@/types';

export const switchOrganization = async (orgId: string): Promise<ActionResult> => {
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIES.ACTIVE_ORG_ID, orgId, {
      path: '/',
      sameSite: 'lax',
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Could not set the organization' };
  }
};
