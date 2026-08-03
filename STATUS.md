# Berea — Actual Status (as of Aug 2026)

> Update this file at the end of every work session, in every PR.
> "Update STATUS.md" is part of the Definition of Done for all phases.
> See [`docs/TODO2.md`](./docs/TODO2.md) for the full rebuild roadmap and Definition of Done.

---

## Phase 0 — Stop the Bleeding 🟡 MOSTLY COMPLETE

**Session:** 2026-08-03

**Completed:**
- ✅ `src/lib/ai.js` — direct Groq client call removed entirely. `VITE_GROQ_AI_API_KEY` deleted from codebase. Verified absent in the built bundle.
- ✅ `supabase/functions/ai-assistant/index.ts` — upgraded from stub to real Groq proxy. Reads `GROQ_API_KEY` from Supabase secrets (server env). Validates JWT before calling Groq. Graceful fallback if secret not set.
- ✅ `.env.example` — `VITE_GROQ_AI_API_KEY` removed. Documents the correct `supabase secrets set` pattern.
- ✅ `src/components/ErrorBoundary.jsx` created; `src/main.jsx` wraps `<App />` in it.
- ✅ `docs/TODO.md` deprecated — points to `docs/TODO2.md`.
- ✅ `STATUS.md` created (this file).
- ✅ Images compressed: logo 25 KB, icon-192 31 KB, icon-512 14 KB (was ~495 KB each, ~1.46 MB total → ~70 KB total). All 7 src/ references updated.
- ✅ `.git/hooks/pre-commit` — gitleaks hook installed (pattern-based fallback active until gitleaks binary is installed).
- ✅ `.gitleaks.toml` and `lefthook.yml` committed for team reproducibility.
- ✅ `npm run build` passes cleanly.

**Remaining (manual action required):**
- ⚠️ **Rotate the Groq API key** at [console.groq.com](https://console.groq.com). The old key (`gsk_RHnwQnk...`) is burned.
  Then: `supabase secrets set GROQ_API_KEY=gsk_your_new_key`
  Then: `supabase functions deploy ai-assistant`
- ⚠️ Install `gitleaks` system-wide for full secret scanning: https://github.com/gitleaks/gitleaks#installing
- ⚠️ `lefthook` install pending network access: `npm install --save-dev lefthook && npx lefthook install`

---

## Phase 1 — Persistence Foundation, Schema Wiring & Offline Sync 🟢 COMPLETE

**Session:** 2026-08-03

**Completed:**
- ✅ Created 6 modular, production-ready SQL migration files in `supabase/migrations/` (`20260803000001` through `20260803000006`).
- ✅ Implemented IndexedDB offline queue manager ([`offlineQueue.js`](file:///home/jamesuchechi/Projects/Berea/src/services/offlineQueue.js)) for offline write queueing and automatic sync-on-reconnect with last-write-wins resolution.
- ✅ Implemented timezone-aware streak tracking ([`timezoneService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/timezoneService.js)) using user local day boundaries.
- ✅ Added live network & sync status badge indicator to [`Topbar.jsx`](file:///home/jamesuchechi/Projects/Berea/src/components/Topbar.jsx) (🟢 Online / 🟡 Syncing (N queued) / 🔴 Offline).
- ✅ Created domain services: [`noteService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/noteService.js), [`planService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/planService.js), [`memorizationService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/memorizationService.js), [`communityService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/communityService.js), [`bookmarkService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/bookmarkService.js), and [`userSettingsService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/userSettingsService.js).
- ✅ Wired frontend feature views:
  - [`NotesView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/notes/NotesView.jsx) (wired to `user_note`, loading skeleton, empty state, error/retry banner).
  - [`ReaderView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/reader/ReaderView.jsx) (wired to `bookmark` and `highlight` tables).
  - [`PlansView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/plans/PlansView.jsx) (wired to `user_plan_progress` & `reading_plan`).
  - [`MemorizationView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/memorization/MemorizationView.jsx) (wired to `memorization_item` & SM-2 review logging).
  - [`CommunityHubView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/community/CommunityHubView.jsx) (wired to `prayer_request`, prayed-for taps, and moderation reporting).
- ✅ Vitest automated test suite & GitHub Actions CI ([`.github/workflows/ci.yml`](file:///home/jamesuchechi/Projects/Berea/.github/workflows/ci.yml)).
- ✅ `npm run build` succeeds cleanly (108 modules transformed).

---

## Phase 2 — Real Search 🟢 COMPLETE

**Session:** 2026-08-03

**Completed:**
- ✅ Created SQL migration [`20260803000007_full_text_search.sql`](file:///home/jamesuchechi/Projects/Berea/supabase/migrations/20260803000007_full_text_search.sql) (adds `tsvector` generated columns, GIN indexes, `pg_trgm` fuzzy matching extension, and `search_berea_scripture` Postgres RPC ranking function).
- ✅ Created Scripture Reference Parser ([`referenceParser.js`](file:///home/jamesuchechi/Projects/Berea/src/services/referenceParser.js)) with book abbreviation normalization (`Jn`, `Tob`, `Wis`, `1 En`, `Did`) and range parsing (`Jn 3:16-18`).
- ✅ Created Multi-Source Search Engine ([`searchService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/searchService.js)) spanning Canon, Deuterocanon, Pseudepigrapha, Early Church writings, and User Notes with source badges.
- ✅ Rewrote [`SearchView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/search/SearchView.jsx) with instant scripture reference card matching, category filter tabs (`All`, `Scripture`, `Beyond`, `Notes`), loading skeleton, and empty state.
- ✅ Created test suite [`src/services/__tests__/referenceParser.test.js`](file:///home/jamesuchechi/Projects/Berea/src/services/__tests__/referenceParser.test.js).
- ✅ `npm run build` succeeds cleanly (110 modules transformed).

---

## Phase 3 — AI Proxy & Semantic Search 🟡 PARTIAL

- Edge Function skeleton exists (`supabase/functions/ai-assistant/`).
- Now correctly calls Groq server-side with JWT auth (Phase 0 fix).
- Semantic search is still a hardcoded 4-item array in `src/lib/ai.js`.
- No pgvector, no real search. Phase 3 deliverable.

---

## Phase 4 — Reading Plans 🔴 NOT STARTED

Plans UI exists but data is in-memory only. No Postgres table, no RLS, no progress persistence.

---

## Phase 5 — Beyond Canon / Apocrypha 🔴 NOT STARTED

Sample content only — a handful of hardcoded strings. No real texts loaded, no source attribution, no canon-boundary data model.

---

## Phase 6 — Interlinear / Languages 🔴 NOT STARTED

UI shell exists. No actual Greek/Hebrew data pipeline. No morphology database connected.

---

## Phase 7 — Memorization 🔴 NOT STARTED

UI shell exists. No spaced-repetition logic, no persistence, no scheduling.

---

## Phase 8 — Community Hub 🔴 NOT STARTED

UI shell exists. No real-time features, no Postgres data, no moderation.

---

## Phase 9 — Security Review & Hardening 🔴 NOT STARTED

Required before any production launch touching money, user content, or private data.

---

## Phase 10 — PWA / Performance 🟡 PARTIAL

- PWA manifest and service worker config exist via `vite-plugin-pwa`.
- Icons are uncompressed (~495 KB each) — degrades first load significantly. Phase 0 fix pending.
- Lighthouse score not yet measured against baselines.
