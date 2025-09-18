import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const token = (await cookies()).get('spotify_access_token')?.value;

  const findPlaylist = async (offset = 0): Promise<any> => {
    const res = await fetch(`https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=50`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to get playlists' }, { status: res.status });
    }

    const data = await res.json();
    const playlist = data.items?.find((item: any) => item.name === 'Calming Words');
    if (!playlist && data.items.length === 50 && offset <= 100) {
      return findPlaylist(offset + 50);
    }
    return playlist;
  };
  const data = await findPlaylist();

  return NextResponse.json(data || null);
}
