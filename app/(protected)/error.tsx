'use client';

import { useEffect } from 'react';
import { PageError } from '@/components/layout/page-error';

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <PageError reset={reset} />;
}
