import type { TicketStats } from '@/types/ticket';
import { cn } from '@/lib/utils';

interface StatsCardsProps {
  stats: TicketStats;
}

const statItems = (stats: TicketStats) => [
  {
    label: 'Open',
    value: stats.open,
  },
  {
    label: 'In Progress',
    value: stats.in_progress,
  },
  {
    label: 'Resolved',
    value: stats.resolved,
  },
  {
    label: 'Urgent',
    value: stats.by_priority.urgent,
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="rounded-lg border p-4 max-w-64 bg-muted">
      <div className="flex justify-between items-end">
        <p className="text-lg">Total</p>
        <p className={cn('text-3xl font-bold')}>{stats.total}</p>
      </div>

      {statItems(stats).map((item) => (
        <div key={item.label} className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className={cn('font-bold text-muted-foreground')}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
