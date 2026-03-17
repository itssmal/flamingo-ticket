'use client';

import { Organization } from '@/types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCallback } from 'react';
import { switchOrganization } from '@/lib/actions/organization';
import { useRouter } from 'next/navigation';

interface Props {
  organizations: Array<Organization>;
  activeOrgId: string;
}

export const OrganizationSelect = ({ organizations, activeOrgId }: Props) => {
  const router = useRouter();

  const handleChange = useCallback(
    async (value: string) => {
      await switchOrganization(value);
      router.refresh();
    },
    [router],
  );

  return (
    <Select onValueChange={handleChange} value={activeOrgId}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Organization" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {organizations.map((org) => (
            <SelectItem value={org.id} key={org.id}>
              {org.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
