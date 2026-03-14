'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils';
import { LayoutDashboard, Users, Settings, Ticket } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { useSessionContext } from '@/lib/context/session-context';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/admin', label: 'Admin', icon: Users, adminOnly: true },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { profile } = useSessionContext();

  return (
    <aside className="w-60 flex flex-col border-r bg-card shrink-0">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦩</span>
          <div className="min-w-0">
            {/*<p className="font-semibold truncate text-sm">{profile.organizations?.name ?? 'Flamingo'}</p>*/}
            <p className="font-semibold truncate text-sm">Flamingo</p>
            <p className="text-xs text-muted-foreground capitalize">{profile.role.replace('_', ' ')}</p>
          </div>
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

      <ThemeSwitcher />

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
