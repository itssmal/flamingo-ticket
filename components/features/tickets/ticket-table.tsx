import Link from 'next/link';
import type { TicketWithRelations, TicketFilters } from '@/types/ticket';
import { formatRelativeTime, PRIORITY_CONFIG, STATUS_CONFIG, cn } from '@/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TicketTableProps {
  tickets: TicketWithRelations[];
  count: number;
  filters: TicketFilters;
}

export function TicketTable({ tickets, count, filters }: TicketTableProps) {
  const page = filters.page ?? 1;
  const perPage = filters.per_page ?? 20;
  const totalPages = Math.ceil(count / perPage);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-card overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-sm">
            No tickets found. Try adjusting your filters.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left font-medium text-muted-foreground px-4 py-3">Title</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden sm:table-cell">Priority</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden md:table-cell">Status</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden lg:table-cell">Assignee</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-3 hidden xl:table-cell">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tickets.map((ticket) => {
                const priority = PRIORITY_CONFIG[ticket.priority];
                const status = STATUS_CONFIG[ticket.status];
                return (
                  <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="font-medium hover:text-primary transition-colors line-clamp-1"
                      >
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className={cn('text-xs font-medium px-2 py-0.5 rounded-full', priority.bgColor, priority.color)}
                      >
                        {priority.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className={cn('text-xs font-medium px-2 py-0.5 rounded-full', status.bgColor, status.color)}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                      {ticket.assignee?.full_name ?? ticket.assignee?.email ?? '—'}
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell text-muted-foreground">
                      {formatRelativeTime(ticket.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, count)} of {count}
          </p>
          <div className="flex gap-1">
            <Link
              href={`?page=${page - 1}`}
              aria-disabled={page <= 1}
              className={cn(
                'rounded-md border p-1.5 hover:bg-muted transition-colors',
                page <= 1 && 'pointer-events-none opacity-50',
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <Link
              href={`?page=${page + 1}`}
              aria-disabled={page >= totalPages}
              className={cn(
                'rounded-md border p-1.5 hover:bg-muted transition-colors',
                page >= totalPages && 'pointer-events-none opacity-50',
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
