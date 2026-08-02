# Berea — Build Roadmap

Phases are sequential but not strictly blocking — some later-phase items can start early if convenient.

## Key decision: Bible API providers & caching strategy

Multiple keys to the same provider don't prevent downtime — a provider outage affects all keys to it equally. Real resilience comes from a provider mix plus respecting each provider's actual caching terms (see `ARCHITECTURE.md` for the full breakdown).

**Primary stack — launches with zero API keys:**
- **Public domain (KJV/WEB/ASV)** — bulk-ingested once into Postgres, permanently available, zero external dependency.
- **Free Use Bible API (AO Lab)** — no key, no rate limit, commercial use allowed, permanently cacheable. Covers 1,250+ translations including WEB, NET, Berean Standard Bible. This is now the primary source for translation breadth.

**Optional later additions — only for named translations (NIV, ESV, NKJV) people specifically expect:**
- **API.Bible** (1 key if added) — cache capped at <500 consecutive verses, refreshed every ≤14 days.
- **ESV API** (1 key if added) — hard cap of 500 verses/half a book locally stored, ever.
- Both gate their free tier behind non-commercial use — revisit licensing with both if Berea monetizes and these are in use.

If a licensed provider (if added later) is briefly unavailable, the app falls back to the public-domain + Free Use Bible API core rather than erroring — this is the actual downtime protection, not extra keys.

## Phase 0 — Foundation
- [x] Repo setup (React + Vite, ESLint/Prettier, CI structure)
- [x] Supabase project structure (Auth, Postgres, Storage, Edge Functions)
- [x] PWA scaffold (manifest.json, service worker, install prompt, splash screen for install/hydration state)
- [x] Public landing page (marketing, unauthenticated, SEO-friendly — separate from the in-app splash/loading state)
- [x] Design system tokens (typography, color, spacing — "very clean" UI direction)
- [x] `.env.example`, deployment target chosen

## Phase 1 — MVP: Bible Core
- [ ] App shell splash/loading state during session + data hydration (distinct from the public landing page)
- [ ] Canon-status data model (see `ARCHITECTURE.md`)
- [ ] Ingest public-domain translations (KJV, WEB) as permanent static data — the always-available floor
- [ ] Integrate Free Use Bible API for translation breadth (no key required, permanently cacheable)
- [ ] (Optional, later) API.Bible integration for named licensed translations, short-TTL cache per provider limits
- [ ] (Optional, later) ESV API integration if ESV specifically is wanted, same short-TTL caching constraint
- [ ] Fallback logic: any optional licensed translation unavailable → serve public-domain/Free Use Bible API translation instead of erroring
- [ ] Reader UI: book/chapter/verse navigation, translation switcher
- [ ] Search (keyword, Postgres full-text)
- [ ] Auth (Supabase Auth — email + at least one OAuth provider)
- [ ] Bookmarks + basic notes (tied to verse reference)
- [ ] Offline caching of at least one default translation

## Phase 2 — Beyond Canon
- [ ] Ingest Deuterocanon/Apocrypha (public domain sources)
- [ ] Ingest Pseudepigrapha (Enoch, Jubilees, etc. — R.H. Charles translations)
- [ ] Canon comparison view (Protestant/Catholic/Orthodox/Ethiopian)
- [ ] Denominational lens toggle (user sets tradition, content adapts)
- [ ] Early church writings (Didache, Clement, Ignatius)

## Phase 3 — AI Assistant
- [ ] Persistent assistant panel (available from any screen)
- [ ] Context-passing interface (current book/chapter/verse/translation/tradition/note → AI request)
- [ ] Contextual triggers (explain verse, find cross-references, expand note) feed into assistant panel
- [ ] Semantic search across canon + apocrypha + notes
- [ ] Guardrails for contested theological questions (present multiple traditions' views rather than asserting one)

## Phase 4 — Study Tools
- [ ] Audio Bible (TTS or licensed audio source)
- [ ] Reading plans (fixed: 365-day, Lent, topical; AI-personalized plan generation)
- [ ] Diagrams: genealogy trees, timelines, cross-reference network graph, interactive maps
- [ ] Original language tools: interlinear Greek/Hebrew, Strong's numbers, lexicon lookup

## Phase 5 — Engagement & Accessibility
- [ ] Memorization mode (spaced repetition)
- [ ] Daily verse + notifications
- [ ] Accessibility: text-to-speech for any text, adjustable font/size, dyslexia-friendly font option, dark mode
- [ ] Reading streaks / habit tracking

## Phase 6 — Community (later phase — evaluate scope/moderation cost before starting)
- [ ] Prayer wall
- [ ] Group reading plans
- [ ] Comments/discussion with moderation tooling

## Phase 7 — Hardening & Launch
- [ ] Offline strategy audit (what's cached vs online-only)
- [ ] Performance pass (bundle size, query performance)
- [ ] Security review (RLS policies, API key exposure, rate limiting on AI endpoints)
- [ ] Analytics
- [ ] Launch