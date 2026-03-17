'use client';

import { useEffect } from 'react';
import { PageError } from '@/components/layout/page-error';

export default function TicketDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageError
      title="Failed to load ticket"
      message="This ticket could not be loaded. It may have been deleted or you may not have access."
      reset={reset}
      resetLabel="Reload ticket"
    />
  );
}
