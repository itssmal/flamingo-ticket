"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { getInitials } from "@/lib/utils";
import type { Profile } from "@/types";

interface TopBarProps {
  profile: Profile;
}

export function TopBar({ profile }: TopBarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 border-b bg-card flex items-center justify-end gap-2 px-4 shrink-0">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="flex items-center gap-2 pl-2 border-l">
        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
          {getInitials(profile.full_name)}
        </div>
        <div className="hidden sm:block text-sm">
          <p className="font-medium leading-none">{profile.full_name ?? profile.email}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{profile.email}</p>
        </div>
        <form action={signOut}>
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
