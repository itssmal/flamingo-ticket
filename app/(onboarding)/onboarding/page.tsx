import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { OnboardingForm } from '@/components/features/onboarding/onboarding-form';
import type { Metadata } from 'next';
import { ROUTES } from '@/lib/constants/routes';

export const metadata: Metadata = { title: 'Set up your organization – Flamingo' };

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.LOGIN);

  return (
    <div className="w-full max-w-lg space-y-8">
      <div className="text-center space-y-2">
        <div className="text-5xl">🦩</div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome to Flamingo</h1>
        <p className="text-muted-foreground">Let&apos;s get your organization set up. This only takes a minute.</p>
      </div>
      <OnboardingForm
        defaultEmail={user.email ?? ''}
        defaultName={user.user_metadata?.full_name ?? user.user_metadata?.name ?? ''}
      />
    </div>
  );
}
