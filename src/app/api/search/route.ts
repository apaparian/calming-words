import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  const token = (await cookies()).get('spotify_access_token')?.value;

  const res = await fetch(
    'https://api.spotify.com/v1/search'
    + `?q=${q}&type=track&market=US&include_external=audio`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to search tracks' }, { status: res.status });
  }

  const data = await res.json();

  return NextResponse.json(data);
}
