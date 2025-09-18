import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/playlists/[playlistId]'>) {
  const token = (await cookies()).get('spotify_access_token')?.value;
  const { playlistId } = await ctx.params;
  const { trackUris } = await req.json();

  const resGet = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resGet.ok) {
    return NextResponse.json({ error: 'Failed to get tracks' }, { status: resGet.status });
  }
  const dataGet = await resGet.json();

  const existingUris = dataGet.items.map((item: any) => item.track.uri);
  const newTrackUris = trackUris.filter((uri: string) => !existingUris.includes(uri));

  if (newTrackUris.length) {
    const resPost = await fetch('https://api.spotify.com/v1/playlists'
      + `/${playlistId}/tracks?uris=${newTrackUris.join(',')}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!resPost.ok) {
      return NextResponse.json({ error: 'Failed to add tracks' }, { status: resGet.status });
    }
  }
  return NextResponse.json({ success: true });
}
