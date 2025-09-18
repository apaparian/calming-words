import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const clientId = '36cf962a2ef4476d859c6a6531bbe96f';

export async function POST() {
  const refreshToken = (await cookies()).get('spotify_refresh_token')?.value;

  if (refreshToken) {
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
      return NextResponse.json({ error: 'Error updating token', status: 500 });
    }

    const data = await res.json();
    (await cookies()).set('spotify_access_token', data.access_token, {
      httpOnly: true, secure: true, path: '/', maxAge: 3600,
    });

    return NextResponse.json(data);
  }
  return NextResponse.json({ error: 'No refresh token', status: 500 });
}
