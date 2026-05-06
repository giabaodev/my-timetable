import { PUBLIC_PATHS_NAME } from '@/constants/paths-name';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();

  const { searchParams } = req.nextUrl;
  const token = searchParams.get('token');
  const user = searchParams.get('user');

  if (!token || !user) {
    return NextResponse.redirect(new URL(PUBLIC_PATHS_NAME.LOGIN, req.url));
  }

  const homeUrl = new URL('/', req.url);
  homeUrl.searchParams.set('user', user);

  cookieStore.set({
    name: 'access_token',
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 604800,
    path: '/',
  });

  return NextResponse.redirect(homeUrl);
}
