import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const token = (await cookies()).get('spotify_access_token')?.value;
  const { trackUris } = await req.json();

  const resGet = await fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resGet.ok) {
    return NextResponse.json({ error: 'Failed to get user data' }, { status: resGet.status });
  }
  const dataGet = await resGet.json();

  const resUsers = await fetch(`https://api.spotify.com/v1/users/${dataGet.id}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'Application/json',
    },
    body: JSON.stringify({
      name: 'Calming Words',
      description: 'A list of reminders on how to get you through the day',
      public: true,
    }),
  });
  if (!resUsers.ok) {
    return NextResponse.json({ error: 'Failed to create playlist' }, { status: resUsers.status });
  }
  const dataUsers = await resUsers.json();

  const resPlaylists = await fetch('https://api.spotify.com/v1/playlists'
    + `/${dataUsers.id}/tracks?uris=${trackUris.join(',')}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!resPlaylists.ok) {
    return NextResponse.json({ error: 'Failed to add tracks' }, { status: resPlaylists.status });
  }

  return NextResponse.json(dataUsers);
}
