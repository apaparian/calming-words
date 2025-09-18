import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(req: Request) {
  const { deviceId } = await req.json();
  const token = (await cookies()).get('spotify_access_token')?.value;

  const res = await fetch('https://api.spotify.com/v1/me/player', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ device_ids: [deviceId] }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to load player' }, { status: res.status });
  }

  return NextResponse.json({ success: true });
}
