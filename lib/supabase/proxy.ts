import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (
    request.nextUrl.pathname !== '/' &&
    !claims &&
    !request.nextUrl.pathname.startsWith('/auth/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  const path = request.nextUrl.pathname;

  const isAuthRoute = path.startsWith('/auth/login');
  const isOnboarding = path.startsWith('/onboarding');
  const isInvite = path.startsWith('/invite');
  const isAuthCallback = path.startsWith('/auth/callback');
  const isPublic = isAuthRoute || isAuthCallback;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → send to login
  if (!user && !isPublic && !isInvite) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Logged in on login page → go to dashboard
  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // Logged in → check if profile exists
  if (user && !isOnboarding && !isPublic && !isInvite) {
    const { data: profiles } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();

    if (!profiles) {
      const role = user.user_metadata?.role;
      const url = request.nextUrl.clone();
      // Invited user → short name form; self-signup → full onboarding
      url.pathname = role && role !== 'admin' ? '/invite' : '/onboarding';
      return NextResponse.redirect(url);
    }
  }

  // Has profile but trying to access onboarding → dashboard
  if (user && (isOnboarding || isInvite)) {
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();

    if (profile) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
