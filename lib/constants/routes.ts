export const ROUTES = {
  HOME: '/',

  // Auth
  LOGIN: '/auth/login',
  CHECK_EMAIL: '/auth/check-email',
  AUTH_CALLBACK: '/auth/callback',
  AUTH_CONFIRM: '/auth/confirm',
  AUTH_ERROR: '/auth/error',
  INVITE_CALLBACK: '/auth/invite-callback',

  // Onboarding
  ONBOARDING: '/onboarding',
  INVITE: '/invite',

  // Protected
  DASHBOARD: '/dashboard',
  TICKETS: '/tickets',
  TICKET: (id: string) => `/tickets/${id}`,
  ADMIN: '/admin',
  SETTINGS: '/settings',
} as const;
