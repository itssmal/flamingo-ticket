import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const TicketListSkeleton = () => {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="border-b bg-muted/50 px-4 py-3">
        <div className="flex gap-16">
          {['w-48', 'w-20', 'w-20', 'w-28', 'w-24'].map((w, i) => (
            <Skeleton key={i} className={`h-4 ${w}`} />
          ))}
        </div>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-16 border-b px-4 py-3 last:border-0">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
};

export default TicketListSkeleton;
