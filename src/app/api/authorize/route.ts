import { NextResponse } from 'next/server';
import crypto from 'crypto';

const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://127.0.0.1:3000/callback';
const clientId = '36cf962a2ef4476d859c6a6531bbe96f';

export async function GET() {
  const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  };
  const sha256 = (plain: string) => crypto.createHash('sha256').update(plain).digest();
  const base64encode = (input: Buffer) => input.toString('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const codeVerifier = generateRandomString(64);
  const hashed = sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  const authParams = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: 'streaming user-modify-playback-state user-read-private user-read-email '
            + 'playlist-modify-public playlist-modify-private',
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  });

  const res = {
    auth_url: `https://accounts.spotify.com/authorize?${authParams}`,
    code_verifier: codeVerifier,
  };

  return NextResponse.json(res);
}
