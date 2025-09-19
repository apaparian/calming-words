My idea for this app was to create a list of reminders, activities, thoughts that bring you joy.

You can then link a song to each, that matches it as a query.
Export the playlist to your spotify account if you like what you've built. Any changes after will add, but not remove, from that same playlist.

'Save Word' will display one word at a time, with the opportunity to play the associated song.

The app can be previewed on vercel:
[https://calming-words.vercel.app](https://calming-words.vercel.app)


## Getting Started

*** Must create a .env.local file in the root folder with the following:
- CLIENT_ID=(Your SpotifyAPI client ID)º
- REDIRECT_URI=http://127.0.0.1:(port-default=3000)/callback<!--not a link-->

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---
ºyou can ask for my credentials if I've asked you to view or test

areas of concern:
  lines 77 - 114 in containers/MainContainer.tsx
  api/token/route.ts


