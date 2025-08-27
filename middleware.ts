// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const token = await getToken({ req });

  const isAdminRoute = url.pathname.startsWith('/admin');

  if (isAdminRoute && (!token || token.role !== 'ADMIN')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
