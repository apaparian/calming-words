import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

const errorResponse = (res: Response, data: any) => (
  NextResponse.json({ error: data.error.message }, { status: res.status })
);

const getOpt = (token: string | undefined) => ({
  method: 'GET',
  headers: { Authorization: `Bearer ${token}` },
});

export async function GET() {
  const token = (await cookies()).get('spotify_access_token')?.value;

  const resMe = await fetch('https://api.spotify.com/v1/me', getOpt(token));
  const userData = await resMe.json();
  if (!resMe.ok) return errorResponse(resMe, userData);

  const sql = neon(process.env.DATABASE_URL!);
  const resSql = await sql`
    SELECT playlist_id, track_id
    FROM user_playlist
    WHERE user_id = ${userData.id};
  `;
  if (resSql[0]) {
    const playlistId = resSql[0].playlist_id;
    const resTracks = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      getOpt(token),
    );
    const trackData = await resTracks.json();
    if (!resTracks.ok) return errorResponse(resTracks, trackData);

    const tracks = trackData.items.map((item: any) => item.track);
    const wordList = resSql[0].track_id.map((item: any) => {
      const track = tracks.find((t: any) => t.uri === item[1]);
      return { word: item[0], track };
    });
    return NextResponse.json({ playlistId, wordList });
  }
  return NextResponse.json(null);
}

const postOpt = (token: string | undefined, body?: any) => ({
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});
const playlistInfo = {
  name: 'Calming Words',
  description: 'A list of reminders on how to get you through the day',
  public: true,
};

export async function POST(req: NextRequest) {
  const token = (await cookies()).get('spotify_access_token')?.value;
  const { wordList } = await req.json();

  const resMe = await fetch('https://api.spotify.com/v1/me', getOpt(token));
  const userData = await resMe.json();
  if (!resMe.ok) errorResponse(resMe, userData);

  const resPlaylists = await fetch(
    `https://api.spotify.com/v1/users/${userData.id}/playlists`,
    postOpt(token, playlistInfo),
  );
  const playlistData = await resPlaylists.json();
  if (!resPlaylists.ok) return errorResponse(resPlaylists, playlistData);

  const trackUris = wordList.map(({ track }: any) => track?.uri).filter((uri: string) => !!uri);
  const resTracks = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistData.id}/tracks?uris=${trackUris.join(',')}`,
    postOpt(token),
  );
  const trackData = await resTracks.json();
  if (!resTracks.ok) return errorResponse(resTracks, trackData);

  const trackIds = wordList.map((el: any) => [el.word, el.track?.uri]);
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    INSERT INTO user_playlist (user_id, playlist_id, track_id)
    VALUES (${userData.id}, ${playlistData.id}, ${trackIds})
    ON CONFLICT (user_id)
    DO UPDATE SET playlist_id = ${playlistData.id}, track_id = ${trackIds}
  `;
  return NextResponse.json(playlistData);
}

export async function PUT(req: NextRequest) {
  const token = (await cookies()).get('spotify_access_token')?.value;
  const { wordList, playlistId } = await req.json();

  const resGet = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    getOpt(token),
  );
  const dataGet = await resGet.json();
  if (!resGet.ok) errorResponse(resGet, dataGet);

  const existingUris = dataGet.items.map((item: any) => item.track.uri);
  const trackUris = wordList.map(({ track }: any) => track?.uri)
    .filter((uri: string) => !!uri && !existingUris.includes(uri));

  if (trackUris.length) {
    const resPost = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?uris=${trackUris.join(',')}`,
      postOpt(token),
    );
    const dataPost = await resPost.json();
    if (!resPost.ok) errorResponse(resPost, dataPost);
  }

  const trackIds = wordList.map((el: any) => [el.word, el.track?.uri]);
  const sql = neon(process.env.DATABASE_URL!);
  await sql`
    UPDATE user_playlist
    SET track_id = ${trackIds}
    WHERE playlist_id = ${playlistId}
  `;
  return NextResponse.json({ success: true });
}
