import Link from 'next/link';
import type { TicketWithRelations } from '@/types/ticket';
import { formatRelativeTime, PRIORITY_CONFIG, STATUS_CONFIG } from '@/utils';
import { cn } from '@/lib/utils';

interface RecentTicketsProps {
  tickets: TicketWithRelations[];
}

export function RecentTickets({ tickets }: RecentTicketsProps) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">Recent Tickets</h2>
        <Link href="/tickets" className="text-sm text-primary hover:underline">
          View all →
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm">
          No tickets yet.{' '}
          <Link href="/tickets?new=1" className="text-primary hover:underline">
            Create one
          </Link>
        </div>
      ) : (
        <div className="divide-y">
          {tickets.map((ticket) => {
            const priority = PRIORITY_CONFIG[ticket.priority];
            const status = STATUS_CONFIG[ticket.status];
            return (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{ticket.title}</p>
                  <p className="text-sm text-muted-foreground">{formatRelativeTime(ticket.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={cn('text-xs font-medium px-2 py-0.5 rounded-full', priority.bgColor, priority.color)}
                  >
                    {priority.label}
                  </span>
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', status.bgColor, status.color)}>
                    {status.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
