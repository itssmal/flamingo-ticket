import { StatsCards } from '@/components/features/dashboard/stats-cards';
import { getTicketsStats } from '@/lib/queries/ticket/get-stats';
import { getRecentTickets } from '@/lib/queries/ticket/get-tickets';
import { RecentTickets } from '@/components/features/dashboard/recent-tickets';
import { requireAuth } from '@/lib/queries/auth';

export default async function DashboardPage() {
  const { supabase, activeOrgId } = await requireAuth();

  const [stats, recentTickets] = await Promise.all([
    getTicketsStats(supabase, activeOrgId),
    getRecentTickets(supabase, activeOrgId),
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
