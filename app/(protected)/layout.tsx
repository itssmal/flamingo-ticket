import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/topbar';
import { createClient } from '@/lib/supabase/server';
import { getSessionData } from '@/lib/queries/session';
import { redirect } from 'next/navigation';
import { SessionProvider } from '@/lib/context/session-context';
import { Suspense } from 'react';
import LayoutLoading from '@/components/layout/layout-loading';
import { getActiveOrgId } from '@/utils/active-org';

async function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const sessionData = await getSessionData(supabase);

  if (!sessionData) {
    redirect('/auth/login');
  }

  const activeOrgId = await getActiveOrgId(sessionData.organizations);

  if (!activeOrgId) {
    redirect('/auth/login');
  }

  return (
    <SessionProvider value={sessionData}>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar activeOrgId={activeOrgId} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LayoutLoading />}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
