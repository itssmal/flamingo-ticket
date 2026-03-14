'use client';

import { createContext, useContext } from 'react';
import type { Profile, Organization } from '@/types';
import { User } from '@supabase/auth-js';

type SessionContextValue = {
  user: User;
  profile: Profile;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children, value }: { children: React.ReactNode; value: SessionContextValue }) {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionContext(): SessionContextValue {
  const ctx = useContext(SessionContext);

  if (!ctx) throw new Error('useUser must be used within SessionProvider');
  return ctx;
}
