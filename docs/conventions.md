# Conventions

Source of truth for how code is written in this repo. `AGENTS.md` only points here.

## UI

- Build on the shadcn primitives in `src/components/ui`. They are owned code, restyled to the Catz look (chunky press depth, rounded, springy).
- Add a new primitive with `./node_modules/.bin/shadcn add <name>`, then restyle it to match.
- Match the clickable reference: `docs/design/catz-design-preview.html` (`npm run design`).
- Dark text on orange and mint buttons. White fails contrast on those colors.

## Design tokens

- Defined in `src/app/globals.css`. shadcn semantic variables map onto them.
- Use semantic classes (`bg-ginger`, `bg-mint`, `text-ink-2`, `font-display`), not raw hex.
- Dark mode follows `prefers-color-scheme`. There is no class toggle.

## Cat avatar

- Data and palette math: `src/lib/cat.ts` (pure, testable).
- Server-safe SVG: `src/components/cat/cat-avatar.tsx`.
- Interactive wrapper (tap to hop and meow): `src/components/cat/cat-mascot.tsx`.
- Animation classes live in `globals.css` (`.cat-*`).

## Checks

Run before every push: `npm run lint`, `npm run build`, `npm test`.

## Git

- One feature per branch, each PR based on the previous branch (stacked), first one on `main`.
- Roadmap and PR order: `docs/roadmap.md`.
