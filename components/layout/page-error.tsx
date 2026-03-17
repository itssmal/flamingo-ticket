import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';

interface PageErrorProps {
  title?: string;
  message?: string;
  reset?: () => void;
  resetLabel?: string;
}

export function PageError({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  reset,
  resetLabel = 'Try again',
}: PageErrorProps) {
  return (
    <div
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 animate-in fade-in duration-300"
      role="alert"
    >
      <span className="text-5xl select-none" aria-hidden>
        🦩
      </span>
      <div className="text-center space-y-1">
        <h2 className="font-semibold text-base">{title}</h2>
        <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      </div>
      <div className="flex gap-2">
        {reset && (
          <Button variant="outline" size="sm" onClick={reset}>
            {resetLabel}
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <Link href={ROUTES.DASHBOARD}>Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
