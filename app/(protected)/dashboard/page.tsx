import { StatsCards } from '@/components/features/dashboard/stats-cards';
import { createClient } from '@/lib/supabase/server';
import { getTicketsStats } from '@/lib/queries/ticket/get-stats';
import { getSessionData } from '@/lib/queries/session';
import { redirect } from 'next/navigation';
import { getRecentTickets } from '@/lib/queries/ticket/get-tickets';
import { RecentTickets } from '@/components/features/dashboard/recent-tickets';

export default async function DashboardPage() {
  const supabase = await createClient();
  const session = await getSessionData(supabase);

  if (!session) {
    redirect('/auth/login');
  }

  const [stats, recentTickets] = await Promise.all([
    getTicketsStats(supabase, session.profile.organization_id),
    getRecentTickets(supabase, session.profile.organization_id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your tickets</p>
      </div>

      {stats.success && stats.data && <StatsCards stats={stats.data} />}
      {recentTickets.success && recentTickets.data && <RecentTickets tickets={recentTickets.data} />}
    </div>
  );
}
