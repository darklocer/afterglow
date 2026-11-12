# Afterglow

Event photo-sharing frontend: React + Vite + Tailwind + Framer Motion + Lucide.

    npm install
    npm run dev

Routes: `/`, `/events`, `/events/new`, `/events/register`, `/events/:id`,
`/events/:id/guest`, `/events/:id/moderation`, `/events/:id/display`, `/signin`.

Photos: drop your own images in `public/photos` named `<type>-1.jpg` ... `<type>-6.jpg`
(wedding, birthday, anniversary, graduation, babyshower, engagement, party, corporate,
other, festival). They take priority over the demo stock photos.

Backend swap: all server calls are in `src/api/mockApi.js`, and live updates are in
`src/api/realtime.js`. Replace those two files; the UI doesn't change.
