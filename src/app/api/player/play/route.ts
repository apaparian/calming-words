import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(req: Request) {
  const { deviceId, trackUri } = await req.json();
  const token = (await cookies()).get('spotify_access_token')?.value;

  const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: [trackUri] }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to play track' }, { status: res.status });
  }

  return NextResponse.json({ success: true });
}
