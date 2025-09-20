import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

const clientId = process.env.CLIENT_ID!;
const redirectUri = process.env.REDIRECT_URI!;
const isProduction = process.env.NODE_ENV === 'production';

const accessTokenExpiry = 3600;
const refreshTokenAgeExpiry = 30 * 24 * 3600;

export async function GET() {
  const token = (await cookies()).get('spotify_access_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Token not found' }, { status: 500 });
  }
  return NextResponse.json({ access_token: token });
}

export async function POST(req: NextRequest) {
  const { verifier, code } = await req.json();

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      redirect_uri: redirectUri,
      code_verifier: verifier,
      code,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to get token' }, { status: res.status });
  }
  const data = await res.json();

  (await cookies()).set('spotify_access_token', data.access_token, {
    httpOnly: true, secure: isProduction, path: '/', maxAge: accessTokenExpiry,
  });
  (await cookies()).set('spotify_refresh_token', data.refresh_token, {
    httpOnly: true, secure: isProduction, path: '/', maxAge: refreshTokenAgeExpiry,
  });

  return NextResponse.json(data);
}

export async function PUT() {
  const refreshToken = (await cookies()).get('spotify_refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token', status: 500 });
  }
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  });
  if (!res.ok) {
    return NextResponse.json({ error: 'Error updating token', status: res.status });
  }
  const data = await res.json();

  (await cookies()).set('spotify_access_token', data.access_token, {
    httpOnly: true, secure: isProduction, path: '/', maxAge: accessTokenExpiry,
  });
  (await cookies()).set('spotify_refresh_token', data.refresh_token, {
    httpOnly: true, secure: isProduction, path: '/', maxAge: refreshTokenAgeExpiry,
  });

  return NextResponse.json({ success: true });
}
