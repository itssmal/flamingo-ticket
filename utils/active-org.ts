import { cookies } from 'next/headers';
import { COOKIES } from '@/lib/constants/cookies';
import { Organization } from '@/types';

export const getActiveOrgId = async (organizations: Array<Organization>): Promise<string | null> => {
  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(COOKIES.ACTIVE_ORG_ID)?.value;

  if (fromCookie) return fromCookie;
  return organizations[0]?.id ?? null;
};
