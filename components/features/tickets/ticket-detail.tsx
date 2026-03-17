'use client';

import { useSessionContext } from '@/lib/context/session-context';
import { useTicketDetail, useUpdateTicket } from '@/lib/queries/ticket/use-ticket-detail';
import { useMembers } from '@/lib/queries/members/use-members';
import { formatDate, PRIORITY_CONFIG, STATUS_CONFIG, cn } from '@/utils';
import type { TicketStatus, TicketPriority, Profile } from '@/types';
import type { TicketWithRelations } from '@/types/ticket';
import { UserBadge } from '@/components/ui/user-badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssigneeSelect } from '@/components/features/tickets/assignee-select';

interface TicketDetailViewProps {
  ticketId: string;
  initialData: TicketWithRelations;
  initialMembers?: Array<Profile>;
}

export function TicketDetailView({ ticketId, initialData, initialMembers }: TicketDetailViewProps) {
  const { user, profile } = useSessionContext();
  const { data: ticket } = useTicketDetail(ticketId, initialData);
  const { data: members = [] } = useMembers(ticket?.organization_id ?? '', initialMembers);
  const { mutate: update, isPending } = useUpdateTicket(ticketId);

  if (!ticket) return null;

  const canEdit = profile.role === 'admin' || profile.role === 'technician' || ticket.creator_id === user.id;

  const handleStatusChange = (status: TicketStatus) => {
    update({ status });
  };

  const handlePriorityChange = (priority: TicketPriority) => {
    update({ priority });
  };

  const handleAssigneeChange = (assigneeId: string | null) => {
    update({ assignee_id: assigneeId });
  };

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
            <UserBadge {...ticket.creator} />
          </div>

          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Assigned to</p>
            {canEdit ? (
              <AssigneeSelect
                options={members}
                field={{
                  value: ticket.assignee_id,
                  name: 'ticket-assignee',
                  onChange: handleAssigneeChange,
                }}
              />
            ) : ticket.assignee ? (
              <UserBadge {...ticket.assignee} />
            ) : (
              <span className="text-muted-foreground text-sm">Unassigned</span>
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
              <Select value={ticket.status} onValueChange={handleStatusChange} disabled={isPending}>
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Priority</p>
              <Select value={ticket.priority} onValueChange={handlePriorityChange} disabled={isPending}>
                <SelectTrigger size="sm" className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
