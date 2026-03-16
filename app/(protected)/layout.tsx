import { Sidebar } from '@/components/layout/sidebar';
import { TopBar } from '@/components/layout/topbar';
import { SessionProvider } from '@/lib/context/session-context';
import { Suspense } from 'react';
import LayoutLoading from '@/components/layout/layout-loading';
import { requireAuth } from '@/lib/queries/auth';

async function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { session, activeOrgId } = await requireAuth();

  return (
    <SessionProvider value={session}>
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
