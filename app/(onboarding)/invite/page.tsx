import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { InviteCompleteForm } from '@/components/features/onboarding/invite-complete-form';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Complete your account – Flamingo' };

export default async function InvitePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const role = user.user_metadata?.role;
  const organizationId = user.user_metadata?.organization_id;

  // If no invite metadata, this is a stale/invalid link
  if (!role || !organizationId) {
    redirect('/auth/login?error=invalid_invite');
  }

  // Fetch org name to show a friendly welcome
  const { data: org } = await supabase.from('organizations').select('name, logo_url').eq('id', organizationId).single();

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center space-y-3">
        {org?.logo_url ? (
          <img src={org.logo_url} alt={org.name} className="h-12 w-12 rounded-lg object-cover mx-auto" />
        ) : (
          <div className="text-5xl">🦩</div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">You&apos;re invited!</h1>
          <p className="text-muted-foreground mt-1">
            You&apos;ve been added to <strong>{org?.name ?? 'an organization'}</strong> as a{' '}
            <span className="capitalize">{role.replace('_', ' ')}</span>.
          </p>
        </div>
      </div>
      <InviteCompleteForm
        defaultEmail={user.email ?? ''}
        defaultName={user.user_metadata?.full_name ?? user.user_metadata?.name ?? ''}
      />
    </div>
  );
}
