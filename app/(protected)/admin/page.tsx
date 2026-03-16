import { redirect } from 'next/navigation';
import { InviteMemberForm } from '@/components/features/admin/invite-member-form';
import { formatDate } from '@/utils';
import type { Metadata } from 'next';
import { getMembers } from '@/lib/queries/members/get-members';
import { getInvites } from '@/lib/queries/invites/get-invites';
import { requireAuth } from '@/lib/queries/auth';
import { PendingInvites } from '@/components/features/admin/pending-invites';

export const metadata: Metadata = { title: 'Admin – Flamingo' };

export default async function AdminPage() {
  const { supabase, session, activeOrgId } = await requireAuth();

  if (session.profile.role !== 'admin') {
    redirect('/dashboard');
  }

  const [membersResult, invitesResult] = await Promise.all([
    getMembers(supabase, activeOrgId),
    getInvites(supabase, activeOrgId),
  ]);

  const pendingInvites = invitesResult.success ? (invitesResult?.data ?? []).filter((i) => !i.accepted_at) : [];
  const members = membersResult.success ? (membersResult.data ?? []) : [];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground text-sm">Manage members and invitations</p>
      </div>

      {/* Invite form */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Invite a member</h2>
        <InviteMemberForm activeOrgId={activeOrgId} />
      </div>

      {pendingInvites.length > 0 && <PendingInvites pendingInvites={pendingInvites} />}

      {/* Members list */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">
            Members <span className="text-muted-foreground font-normal text-sm">({members?.length ?? 0})</span>
          </h2>
        </div>
        <div className="divide-y">
          {(members ?? []).map((member) => (
            <div key={member.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{member.full_name ?? member.email}</p>
                <p className="text-muted-foreground text-xs">{member.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Joined {formatDate(member.created_at)}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium
                  ${
                    member.role === 'admin'
                      ? 'bg-primary/10 text-primary'
                      : member.role === 'technician'
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {member.role.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
