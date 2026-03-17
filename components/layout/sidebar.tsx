'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils';
import { LayoutDashboard, Users, Settings, Ticket, Building2 } from 'lucide-react';
import { useSessionContext } from '@/lib/context/session-context';
import { useMemo } from 'react';
import { OrganizationSelect } from '@/components/layout/organization-select';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/admin', label: 'Admin', icon: Users, adminOnly: true },
];

interface Props {
  activeOrgId: string;
}

export const Sidebar = ({ activeOrgId }: Props) => {
  const pathname = usePathname();
  const { profile, organizations } = useSessionContext();

  const activeOrg = useMemo(() => organizations.find((org) => org.id === activeOrgId), [organizations]);

  return (
    <aside className="w-60 flex flex-col border-r bg-card shrink-0">
      <div className="h-14 border-b flex my-auto px-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />

          {organizations.length > 1 ? (
            <OrganizationSelect organizations={organizations} activeOrgId={activeOrgId} />
          ) : (
            <div className="min-w-0">
              <p className="font-semibold truncate text-sm">{activeOrg?.name ?? 'Flamingo'}</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => {
          if (item.adminOnly && profile.role !== 'admin') return null;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
};
