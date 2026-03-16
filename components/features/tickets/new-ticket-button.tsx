'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { Kbd } from '@/components/ui/kbd';

export function NewTicketButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.push(`${ROUTES.TICKETS}?new=1`)}>
      <Plus className="h-4 w-4 mr-2" />
      New Ticket
      <Kbd data-icon="inline-end" className="translate-x-0.5">
        c
      </Kbd>
    </Button>
  );
}
