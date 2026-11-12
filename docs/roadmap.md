# Catz roadmap

Design reference: `docs/design/catz-design-preview.html` (run `npm run design`).

## MVP (device-only, no backend)

Built as a stack of PRs, each branch based on the previous one.

1. **Foundation**: design tokens, shadcn primitives restyled, parametric `CatAvatar`.
2. **State**: local store, plan rules, streaks, curriculum, audio engine.
3. **Onboarding**: avatar, about, traits, time, plan.
4. **Path, lesson, win**.
5. **Tabs**: clicker, journal, my cat.
6. **PWA and SEO**: manifest, icons, service worker, metadata, landing page.

Data lives in `localStorage` behind `src/lib/store.ts` (versioned). One cat per account.

## Phase 2: AI (LLM) features

Not in the MVP. The MVP data model is shaped so these can be added without a rewrite.

- **AI-personalized training journey**: the rules in `src/lib/plan.ts` become the fallback.
  An LLM proposes the next lessons from the cat profile, recent session logs and journal wins,
  constrained to lessons that exist in `src/lib/curriculum.ts`.
- **AI consultation**: ask about a behavior problem and get a kind, science-based answer.
  Medical red flags must route to "see a vet" before any training advice.
- **Needs**: accounts and sync, a server route for model calls, rate limits, and
  consent for sending the cat profile and journal text.
- **Seams already in place**: a plain-JSON, versioned store; lesson ids instead of free text;
  a pure `buildPlan(profile)` function.
