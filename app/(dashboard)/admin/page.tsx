import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
// import { InviteMemberForm } from "@/components/admin/invite-member-form";
import { formatDate } from '@/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin – Flamingo' };

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role, organization_id').eq('id', user.id).single();

  if (!profile || profile.role !== 'admin') redirect('/dashboard');

  const [{ data: members }, { data: invites }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, email, role, created_at')
      .eq('organization_id', profile.organization_id)
      .order('created_at', { ascending: true }),
    supabase
      .from('invites')
      .select('id, email, role, accepted_at, created_at')
      .eq('organization_id', profile.organization_id)
      .order('created_at', { ascending: false }),
  ]);

  const pendingInvites = (invites ?? []).filter((i) => !i.accepted_at);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground text-sm">Manage members and invitations</p>
      </div>

      {/* Invite form */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Invite a member</h2>
        {/*<InviteMemberForm />*/}
      </div>

      {/* Pending invites */}
      {pendingInvites.length > 0 && (
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
      )}

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
