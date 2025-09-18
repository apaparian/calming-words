'use client';

import { useEffect } from 'react';

function CallbackPage() {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      window.opener.postMessage({ type: 'SPOTIFY_AUTH_CODE', code }, '*');
      window.close();
    }
  }, []);

  return <div>Authenticating with Spotify...</div>;
}

export default CallbackPage;
