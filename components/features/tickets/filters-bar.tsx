'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type { TicketFilters } from '@/types/ticket';

interface TicketFiltersBarProps {
  filters: TicketFilters;
}

export function TicketFiltersBar({ filters }: TicketFiltersBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <input
        type="search"
        placeholder="Search tickets..."
        defaultValue={filters.search}
        onChange={(e) => updateFilter('search', e.target.value)}
        className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-56"
      />

      <select
        value={filters.status ?? 'all'}
        onChange={(e) => updateFilter('status', e.target.value)}
        className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="all">All statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <select
        value={filters.priority ?? 'all'}
        onChange={(e) => updateFilter('priority', e.target.value)}
        className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="all">All priorities</option>
        <option value="urgent">Urgent</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        value={`${filters.sort_by ?? 'created_at'}_${filters.sort_order ?? 'desc'}`}
        onChange={(e) => {
          const [sort_by, sort_order] = e.target.value.split('_');
          const params = new URLSearchParams(searchParams.toString());
          params.set('sort_by', sort_by);
          params.set('sort_order', sort_order);
          router.push(`${pathname}?${params.toString()}`);
        }}
        className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="created_at_desc">Newest first</option>
        <option value="created_at_asc">Oldest first</option>
        <option value="updated_at_desc">Recently updated</option>
        <option value="priority_desc">Priority (high–low)</option>
      </select>
    </div>
  );
}
