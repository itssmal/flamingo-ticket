'use client';

import { useEffect } from 'react';
import { PageError } from '@/components/layout/page-error';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <PageError title="Failed to load admin panel" reset={reset} />;
}
