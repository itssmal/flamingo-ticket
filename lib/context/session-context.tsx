'use client';

import { createContext, useContext } from 'react';
import { SessionData } from '@/lib/queries/session';

const SessionContext = createContext<SessionData | null>(null);

export function SessionProvider({ children, value }: { children: React.ReactNode; value: SessionData }) {
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSessionContext(): SessionData {
  const ctx = useContext(SessionContext);

  if (!ctx) throw new Error('useUser must be used within SessionProvider');
  return ctx;
}
