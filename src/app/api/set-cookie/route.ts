import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const response = NextResponse.json({ success: true });

  response.cookies.set('access_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 604800,
    path: '/',
  });

  return response;
}
