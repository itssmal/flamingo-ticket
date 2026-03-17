'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { getMembers } from './get-members';
import type { Profile } from '@/types';

const memberKeys = {
  all: ['members'] as const,
  list: (orgId: string) => [...memberKeys.all, orgId] as const,
};

export function useMembers(orgId: string, initialData?: Array<Profile>) {
  const supabase = createClient();

  return useQuery({
    queryKey: memberKeys.list(orgId),
    queryFn: async () => {
      const result = await getMembers(supabase, orgId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    initialData,
  });
}
