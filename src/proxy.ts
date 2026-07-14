import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the user has a session token cookie (checking both dev and secure prod names)
  const sessionToken = 
    request.cookies.get('better-auth.session_token') || 
    request.cookies.get('__Secure-better-auth.session_token');

  // Paths that require authentication:
  // 1. Dashboard and all its subpaths
  // 2. Job details page (/jobs/[id]) but not the list page (/jobs)
  const isDashboard = pathname.startsWith('/dashboard');
  const isJobDetails = pathname.startsWith('/jobs/') && pathname !== '/jobs';

  if ((isDashboard || isJobDetails) && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/jobs/:path*',
  ],
};
