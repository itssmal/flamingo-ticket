import React from 'react';
import { Invite } from '@/types';
import { formatDate } from '@/utils';

type Props = {
  pendingInvites: Array<Invite>;
};

export function PendingInvites({ pendingInvites }: Props) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Pending invites</h2>
      </div>
      <div className="divide-y">
        {pendingInvites.map((invite) => (
          <div key={invite.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p className="font-medium">{invite.email}</p>
              <p className="text-muted-foreground text-xs">Sent {formatDate(invite.created_at)}</p>
            </div>
            <span className="text-xs bg-muted px-2 py-0.5 rounded-full capitalize">
              {invite.role.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
