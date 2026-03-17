'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type { TicketFilters } from '@/types/ticket';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  const updateSort = useCallback(
    (value: string) => {
      const [sort_by, sort_order] = value.split('_');
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort_by', sort_by);
      params.set('sort_order', sort_order);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Input
        type="search"
        placeholder="Search tickets..."
        defaultValue={filters.search}
        onChange={(e) => updateFilter('search', e.target.value)}
        className="w-56"
      />

      <Select value={filters.status ?? 'all'} onValueChange={(v) => updateFilter('status', v)}>
        <SelectTrigger className="w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.priority ?? 'all'} onValueChange={(v) => updateFilter('priority', v)}>
        <SelectTrigger className="w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={`${filters.sort_by ?? 'created_at'}_${filters.sort_order ?? 'desc'}`}
        onValueChange={updateSort}
      >
        <SelectTrigger className="w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at_desc">Newest first</SelectItem>
          <SelectItem value="created_at_asc">Oldest first</SelectItem>
          <SelectItem value="updated_at_desc">Recently updated</SelectItem>
          <SelectItem value="priority_desc">Priority (high–low)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
