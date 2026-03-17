'use client';

import { useSessionContext } from '@/lib/context/session-context';
import { useTicketDetail, useUpdateTicket } from '@/lib/queries/ticket/use-ticket-detail';
import { formatDate, PRIORITY_CONFIG, STATUS_CONFIG, getInitials, cn } from '@/utils';
import type { TicketStatus, TicketPriority } from '@/types';
import type { TicketWithRelations } from '@/types/ticket';

interface TicketDetailViewProps {
  ticketId: string;
  initialData: TicketWithRelations;
}

export function TicketDetailView({ ticketId, initialData }: TicketDetailViewProps) {
  const { user, profile } = useSessionContext();
  const { data: ticket } = useTicketDetail(ticketId, initialData);
  const { mutate: update, isPending } = useUpdateTicket(ticketId);

  if (!ticket) return null;

  const canEdit = profile.role === 'admin' || profile.role === 'technician' || ticket.creator_id === user.id;

  function handleStatusChange(status: TicketStatus) {
    update({ status });
  }

  function handlePriorityChange(priority: TicketPriority) {
    update({ priority });
  }

  const priority = PRIORITY_CONFIG[ticket.priority];
  const status = STATUS_CONFIG[ticket.status];

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold leading-snug">{ticket.title}</h1>
          <div className="flex items-center gap-2 shrink-0">
            <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', priority.bgColor, priority.color)}>
              {priority.label}
            </span>
            <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', status.bgColor, status.color)}>
              {status.label}
            </span>
          </div>
        </div>

        {ticket.description && (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2 text-sm border-t">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Created by</p>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                {getInitials(ticket.creator?.full_name)}
              </div>
              <span>{ticket.creator?.full_name ?? ticket.creator?.email}</span>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Assigned to</p>
            {ticket.assignee ? (
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {getInitials(ticket.assignee.full_name)}
                </div>
                <span>{ticket.assignee.full_name ?? ticket.assignee.email}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Unassigned</span>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Created</p>
            <span>{formatDate(ticket.created_at)}</span>
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Updated</p>
            <span>{formatDate(ticket.updated_at)}</span>
          </div>
        </div>

        {canEdit && (
          <div className="flex gap-3 pt-2 border-t">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Status</p>
              <select
                value={ticket.status}
                disabled={isPending}
                onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                className="rounded-md border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Priority</p>
              <select
                value={ticket.priority}
                disabled={isPending}
                onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
                className="rounded-md border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
