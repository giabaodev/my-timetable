import { ACCESS_TOKEN } from '@/constants/auth';
import { PRIVATE_PATHS_NAME, PUBLIC_PATHS_NAME } from '@/constants/paths-name';
import { NextRequest, NextResponse } from 'next/server';

export function proxy(req: NextRequest): NextResponse<unknown> {
  const currentPath = req.nextUrl.pathname;

  const isPrivate = Object.values(PRIVATE_PATHS_NAME).some((path) =>
    currentPath.startsWith(path)
  );

  const isPublic = Object.values(PUBLIC_PATHS_NAME).some((path) =>
    currentPath.startsWith(path)
  );

  const token = req.cookies.get(ACCESS_TOKEN)?.value;

  if (isPublic && token) {
    return NextResponse.redirect(new URL(PRIVATE_PATHS_NAME.CALENDAR, req.url));
  }

  if (isPrivate && !token) {
    return NextResponse.redirect(new URL(PUBLIC_PATHS_NAME.LOGIN, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)'],
};
