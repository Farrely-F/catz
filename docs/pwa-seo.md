# PWA and SEO

Source of truth for how installability, offline use and search metadata work.

## Config

- `NEXT_PUBLIC_SITE_URL` sets canonical, Open Graph and sitemap URLs. Defaults to `http://localhost:3000`.
  **Set it when deploying.** See `.env.example`.

## Installable

- `src/app/manifest.ts` serves `/manifest.webmanifest`. `start_url` is `/app`, display `standalone`.
- Icons come from one mark, `src/lib/brand.ts`. Regenerate everything with `npm run icons`
  (writes `public/icons/*`, `src/app/icon.svg`, `src/app/apple-icon.png`, `src/app/favicon.ico`).
- A maskable icon keeps the mark inside the safe zone.
- `src/lib/install-prompt.ts` captures `beforeinstallprompt` on every page (imported by the root `PwaRegister`),
  because Chrome fires it once, early. `InstallCard` (My cat tab) reads it, and shows Add to Home Screen steps on iOS.

## Offline

- `public/sw.js` is registered by `PwaRegister`, **production only** (it would fight hot reload).
- Strategy: `/_next/static/*` cache-first, navigations network-first then cache then `/offline`.
- After install the page sends `WARM` with every app route. The worker caches the HTML and the
  static assets it references, so the whole app opens offline after one visit.
- Bump `VERSION` in `sw.js` to drop old caches. `/sw.js` is served with `no-cache` (see `next.config.ts`).
- All user data is in `localStorage`, so offline needs nothing else.

## SEO

- `/` is a static, indexable landing page with `SoftwareApplication` and `FAQPage` JSON-LD.
- `/app/*`, `/onboarding/*` and `/offline` are `noindex` and disallowed in `robots.txt`. Only `/` is in the sitemap.
- Title template `%s · Catz`, Open Graph and Twitter cards, generated social image (`opengraph-image.tsx`),
  `themeColor` per color scheme, Apple web app tags.

## Not verified yet

- Install on a real iOS or Android device, and Lighthouse PWA scoring on a deployed HTTPS URL.
- Service worker behavior across a deploy that changes asset hashes.
