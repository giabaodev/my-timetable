import { PUBLIC_PATHS_NAME } from '@/constants/paths-name';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const token = searchParams.get('token');
  const user = searchParams.get('user');

  if (!token || !user) {
    return NextResponse.redirect(new URL(PUBLIC_PATHS_NAME.LOGIN, req.url));
  }

  const homeUrl = new URL('/', req.url);
  homeUrl.searchParams.set('user', user);

  const response = NextResponse.redirect(homeUrl);

  response.cookies.set('access_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 604800,
    path: '/',
  });

  return response;
}
