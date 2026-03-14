import { cn } from '@/utils';

function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-muted/60', className)} aria-hidden />;
}

export { Skeleton };
