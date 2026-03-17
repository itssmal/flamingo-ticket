'use client';

import { LogOut } from 'lucide-react';
import { signOut } from '@/lib/actions/sign-out';
import { getInitials } from '@/utils';
import { useSessionContext } from '@/lib/context/session-context';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function TopBar() {
  const { profile } = useSessionContext();

  return (
    <header className="h-14 border-b bg-card flex items-center justify-end gap-2 px-4 shrink-0">
      <ThemeSwitcher />

      <div className="flex items-center gap-2 pl-2 border-l">
        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
          {getInitials(profile.full_name)}
        </div>
        <div className="hidden sm:block text-sm">
          <p className="font-medium leading-none">{profile.full_name ?? profile.email}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{profile.email}</p>
        </div>
        <form
          action={async () => {
            await signOut();
          }}
        >
          <button
            type="submit"
            className="ml-2 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </header>
  );
}
