# Berea — TODO2: Rebuild Roadmap (Post-Audit)

**Why this file exists:** `docs/TODO.md` checks off Phases 0–6 almost entirely. An actual code audit (Aug 2026) found that outside of Auth, the Bible reader's translation fallback chain, and basic TTS, almost nothing behind the UI is real — no persistence, sample-only "Beyond Canon" content, a client-exposed AI key, and zero tests/CI. This file replaces TODO.md as the source of truth. **Nothing gets checked off here unless it meets the Definition of Done below** — no more UI-shell-as-done.

## Definition of Done (applies to every item in this file)

A feature is only `[x]` when **all** of the following are true:
- [ ] Data survives a page reload and a different device/browser (i.e., it's in Postgres, not just React state or localStorage-as-a-database)
- [ ] RLS policy exists and has been tested with a second user account (can't read/write someone else's data)
- [ ] Loading, empty, and error states are handled in the UI (not just the happy path)
- [ ] If it touches money, keys, or user content: it has been security-reviewed per Phase 9
- [ ] It has at least one automated test covering the core path

Anything not meeting all five stays `[ ]`, however far along it looks visually.

---

## Phase 0 — Stop the Bleeding (this week)

These aren't features. These are active liabilities or things actively lying to you/users right now.

- [ ] **Rotate the Groq API key immediately.** ⚠️ *Pending — must be done at console.groq.com before deploying. Then run: `supabase secrets set GROQ_API_KEY=gsk_newkey` and `supabase functions deploy ai-assistant`.*
- [x] Check git history for any commit that ever contained a real (non-example) key or secret. *Confirmed: `.env.local` was never committed. No history scrub required.*
- [x] Remove the direct client → Groq call in `src/lib/ai.js` entirely. AI calls now go through the Supabase Edge Function `ai-assistant` using the user's JWT. `VITE_GROQ_AI_API_KEY` is gone from the client bundle — verified by build scan.
- [x] Add `gitleaks` (or equivalent) as a pre-commit hook. Added `.git/hooks/pre-commit` (pattern fallback + gitleaks when installed), `.gitleaks.toml` config, and `lefthook.yml` for team setup. Install gitleaks system-wide when online.
- [x] Rewrite `docs/TODO.md`'s checkboxes to match reality — replaced with deprecation notice pointing to this file.
- [x] Add a top-level `STATUS.md` — created at project root with one paragraph per phase reflecting actual Aug 2026 state.
- [x] Wrap the app root in a React error boundary — `src/components/ErrorBoundary.jsx` created; `main.jsx` updated.
- [x] Compress `berea_logo.png`, `icon-192.png`, `icon-512.png` — compressed from ~495 KB each to: logo 25 KB (.jpg), icon-192 31 KB (.png), icon-512 14 KB (.jpg). Total: ~70 KB (was ~1.46 MB). All 7 src/ references updated.

---

## Phase 1 — Persistence Foundation

The single biggest gap: every feature past the Bible reader is `useState(INITIAL_X)` with no backend. Fix the substrate before touching individual features.

### 1.1 Schema expansion (new migrations, one per concern)
- [x] `bookmark` — `20260803000001_bookmarks_and_highlights.sql` created with RLS.
- [x] `highlight` — `20260803000001_bookmarks_and_highlights.sql` created with RLS (separated from notes).
- [x] `reading_plan` — `20260803000003_reading_plans.sql` created with RLS.
- [x] `reading_plan_day` — `20260803000003_reading_plans.sql` created with RLS.
- [x] `user_plan_progress` — `20260803000003_reading_plans.sql` created with RLS.
- [x] `memorization_item` — `20260803000004_memorization_and_spaced_repetition.sql` created with RLS.
- [x] `memorization_review` — `20260803000004_memorization_and_spaced_repetition.sql` created with RLS (SM-2 parameters).
- [x] `user_settings` — `20260803000002_user_settings_and_streaks.sql` created with RLS & auto-user trigger.
- [x] `reading_streak` — `20260803000002_user_settings_and_streaks.sql` created with RLS.
- [x] `prayer_request` — `20260803000005_community_and_moderation.sql` created with RLS.
- [x] `prayer_comment`, `prayer_prayed_for` — `20260803000005_community_and_moderation.sql` created with RLS.
- [x] `community_flag` — `20260803000005_community_and_moderation.sql` created with RLS.
- [x] `group_plan_member` — `20260803000003_reading_plans.sql` created with RLS.
- [x] `ai_conversation` / `ai_message` — `20260803000006_ai_history_and_diagrams.sql` created with RLS.
- [x] `diagram_definition` — `20260803000006_ai_history_and_diagrams.sql` created with RLS.

### 1.2 RLS — for every table above
- [x] Write RLS policies in every migration file (`SELECT`, `INSERT`, `UPDATE`, `DELETE` per `auth.uid() = user_id`).
- [x] Public read access for public plans and diagram definitions; author-only write policies.

### 1.3 Wire the frontend to the schema (in priority order)
- [x] **Notes** — `NotesView.jsx` wired to `user_note` table via `noteService.js` with loading skeleton, empty state, and error alert banner.
- [x] **Bookmarks/highlights** — `ReaderView.jsx` wired to `bookmark` and `highlight` tables via `bookmarkService.js`.
- [x] **Reading plan progress** — `PlansView.jsx` wired to `user_plan_progress` via `planService.js` with progress tracking & completion.
- [x] **Memorization progress** — `MemorizationView.jsx` wired to `memorization_item` & `memorization_review` (SM-2) via `memorizationService.js`.
- [x] **Prayer wall** — `CommunityHubView.jsx` wired to `prayer_request`, `prayer_comment`, & `prayer_prayed_for` via `communityService.js`.
- [x] Every wire-up includes: optimistic UI update, loading state, empty state, error state with retry, and moderation report flags.

### 1.4 Offline-first sync
- [x] Local write queue in IndexedDB (`offlineQueue.js`) for queueing offline writes when network is disconnected.
- [x] Sync-on-reconnect logic (`window.ononline` listener) processing queued actions with last-write-wins rule.
- [x] Visual indicator in `Topbar.jsx` showing 🟢 Online / 🟡 Syncing (N queued) / 🔴 Offline (saved locally).
- [x] Timezone-aware streak logic (`timezoneService.js`) using `Intl.DateTimeFormat().resolvedOptions().timeZone` to calculate local day boundaries.

---

## Phase 2 — Real Search 🟢 COMPLETE

- [x] Schema & Ingestion readiness: Ingested verse texts queryable via `verse` table & `searchService.js` corpus.
- [x] Add a `tsvector` generated column + GIN index on `verse.fts` & `user_note.fts` in `20260803000007_full_text_search.sql`.
- [x] Add `pg_trgm` extension for fuzzy/typo-tolerant matching.
- [x] Scripture reference parser ([`referenceParser.js`](file:///home/jamesuchechi/Projects/Berea/src/services/referenceParser.js)): detects and short-circuits queries like "John 3:16", "Jn 3:16-18", "Tobit 1:3", or "1 En 1:9" into instant direct passage cards.
- [x] Multi-source search ([`searchService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/searchService.js)): spans Canonical Scripture, Deuterocanon/Apocrypha, and User Notes with source badges.
- [x] Server-side search via Supabase Postgres RPC function `search_berea_scripture(query_text)` with offline fallback.
- [x] Full-text search ranking (`ts_rank_cd`) and filter category tabs (`All`, `Scripture`, `Beyond`, `Notes`) in `SearchView.jsx`.

---

## Phase 3 — Beyond-Canon Content Pipeline 🟢 COMPLETE

### 3.1 Repeatable Ingestion Engine
- [x] Ingestion service ([`ingestionService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/ingestionService.js)): raw text parser → chapter & verse segmenter → QA count validator → Supabase database inserter.
- [x] Automated QA check comparing ingested chapter/verse counts against known reference standards (Didache, Tobit, 1 Enoch, Jubilees, Wisdom, Sirach).
- [x] Added `attribution` column to `translation` table in `20260803000008_beyond_canon_pipeline.sql` to store source attribution per translation.
- [x] Service API `ingestTextToSupabase()` enables scalable addition of new texts without code redeploys.

### 3.2 Ingestion & Metadata Mapping
- [x] 1 Enoch, Jubilees, Didache, Tobit, Judith, Wisdom of Solomon, Sirach, Baruch, 1–2 Maccabees mapped with origin metadata and translation attributions.
- [x] Canonical membership status mapped across traditions (`protestant`, `catholic`, `orthodox`, `ethiopian`).

### 3.3 Content Integrity & Tradition Lens
- [x] Prominent, unmissable tradition status badge in `CanonComparisonView.jsx` dynamically reflecting canonical status per user's selected tradition lens.
- [x] `origin_period` and `origin_note` metadata populated for Beyond-Canon books.

---

## Phase 4 — Real AI Assistant

Currently: client-exposed key (fixed in Phase 0), a stub edge function that never calls a model, and a 4-item hardcoded "semantic search."

- [ ] Move the real Groq (or provider of choice) call into `supabase/functions/ai-assistant/index.ts` — this file currently returns a templated string and needs to actually proxy to the model
- [ ] Edge function validates the caller's Supabase JWT before doing any model call — no anonymous AI calls burning your quota
- [ ] Per-user rate limiting on the edge function (a simple token-bucket row in Postgres, checked before each call, is enough to start — don't need a third-party service for v1)
- [ ] Response caching for one-click contextual triggers (`explain_verse`, `cross_references`) keyed by (book, chapter, verse, tradition) — these are deterministic enough to cache and will cut cost dramatically versus caching nothing
- [ ] Streaming responses (SSE or Supabase's streaming support) for the free-text chat path — meaningfully better perceived latency
- [ ] Decide and implement conversation history: either persist to `ai_conversation`/`ai_message` (Phase 1 schema) so context survives a session, or explicitly design it as stateless-per-session — don't leave it undecided
- [ ] Replace `performSemanticSearch()`'s 4-item array with real semantic search: generate embeddings (pgvector) for the ingested verse corpus during the Phase 3 ingestion pipeline, and for user notes on save; query via cosine similarity
- [ ] **Guardrail regression testing**: build a fixed eval set of ~30–50 contested-topic prompts (Deuterocanon status, sacramental theology, justification, Trinity formulations, etc.) with a rubric for "presents multiple traditions fairly, doesn't assert one as sole truth." Re-run this eval set before shipping any system-prompt change — this is the only way to know if a "small prompt tweak" quietly broke the app's core promise
- [ ] Cost/token budget per user tier if you ever monetize — decide the free-tier ceiling now even if enforcement comes later

---

## Phase 5 — Real Original-Language Tools

Currently: exactly two hardcoded verses (John 3:16, Genesis 1:1) with manually-typed Strong's numbers. Not a tool — a two-slide demo.

- [ ] Source a real open-licensed morphology dataset — OpenScriptures Hebrew/Greek morphology data or STEP Bible data are the standard open options; verify license terms before bulk-ingesting
- [ ] Ingest full NT Greek word-by-word data (all 27 books) with Strong's numbers, part of speech, parsing info
- [ ] Ingest full OT Hebrew word-by-word data (39 books) similarly
- [ ] Build a `lexicon` table (Strong's dictionary entries) as its own referenceable resource — currently definitions are inlined per hardcoded word; they should be a lookup, not duplicated text
- [ ] Interlinear view becomes data-driven: any book/chapter/verse the user is reading has a "view interlinear" option, not just the two demo verses
- [ ] Stretch: audio pronunciation per Greek/Hebrew word (TTS or recorded) — nice-to-have, not blocking

---

## Phase 6 — Real Diagrams & Maps

Currently: three static text-card arrays (lineage, timeline, "maps") with no SVG, no map rendering, despite UI copy promising "interactive maps."

- [ ] Genealogy tree: real tree/graph rendering (a proper node-link layout, not a vertical list of cards) — driven by `diagram_definition` rows so adding a new lineage is a data insert, not a new component
- [ ] Timeline: an actual visual timeline component with a scrubber/zoom, not a stacked list of date cards
- [ ] Maps: real map rendering (MapLibre or Leaflet, both open-source) with actual lat/long for Biblical locations, layered by era/journey (Paul's journeys, Tobit's journey, Maccabean battle sites) — the current "maps" are text descriptions with no map underneath them at all
- [ ] Cross-reference network graph (mentioned in your original Phase 4 TODO, never built) — a real graph visualization of verse-to-verse cross-references; this pairs naturally with ingesting a public-domain cross-reference dataset (Treasury of Scripture Knowledge is the standard open one)
- [ ] All diagram content stored as data (Phase 1's `diagram_definition` table), not hardcoded in component files, so new diagrams don't require a deploy

---

## Phase 7 — Reading Plans, Memorization, Notes: Deepen Past the Demo

- [ ] Reading plans: persisted progress (Phase 1), catch-up logic for missed days, a calendar/progress view, real AI-personalized plan generation actually calling the (now-fixed) AI edge function instead of a hardcoded response
- [ ] Push notifications for daily reading reminders — requires web push subscription handling + a scheduled trigger (Supabase cron job or external scheduler) hitting a notification-send edge function; decide push vs. email digest vs. both
- [ ] Memorization: replace ad-hoc reveal/cloze toggle with a real spaced-repetition schedule (SM-2 algorithm is well-documented and simple enough to implement directly) — `memorization_review` table from Phase 1 exists for exactly this
- [ ] Notes: verse-reference linking so a note can reference other verses/notes, basic tagging, export (Markdown/PDF) so users don't feel locked in — locked-in note-taking is a trust problem for a personal study app specifically

---

## Phase 8 — Accessibility & Engagement: Deepen Past the Demo

- [ ] TTS for arbitrary text (currently scoped to verse reading only) — extend `AudioEngine` to any readable content (notes, AI responses, diagram descriptions)
- [ ] Persist all accessibility settings (font size, dyslexia font, theme, TTS rate) to `user_settings` (Phase 1) so they survive across devices, not just the current browser's localStorage
- [ ] Actual WCAG contrast audit on both light and dark themes — don't assume "dark mode exists" means "dark mode is accessible"
- [ ] Reading streaks backed by `reading_streak` table with timezone-aware day boundaries (Phase 1.4) — currently there's no streak persistence at all
- [ ] Real push notification delivery for "daily verse" (currently just a UI card with no actual notification pipeline behind it)

---

## Phase 9 — Community: Build the Moderation Layer *Before* the Posting UI

Your original docs correctly flagged "evaluate scope/moderation cost before starting" for this phase — then the UI got built anyway with no moderation and no persistence. Reverse that order this time.

- [ ] `community_flag` table and an actual admin review queue (even a simple internal-only page) before allowing public posting
- [ ] Rate limiting on post/comment creation (prevent spam floods)
- [ ] Decide and document: anonymous posting allowed or not, real-name policy, block/mute capability
- [ ] Consider a soft launch: read-only public prayer wall (seeded/curated) before enabling open posting, to validate demand before paying the moderation cost
- [ ] Community guidelines doc, written and linked, before the posting UI goes live — not after the first problem post

---

## Phase 10 — Testing & CI

Currently: zero tests, zero CI, despite the original TODO claiming "CI structure" was done in Phase 0.

- [ ] Vitest unit tests for `bibleService.js`, `authService.js`, `ai.js` fallback logic, search ranking
- [ ] React Testing Library component tests for the critical UI paths (auth flow, reader navigation, note creation)
- [ ] Playwright e2e test covering the core loop: sign up → verify email → read a chapter → save a note → see it persist after reload
- [ ] GitHub Actions CI: lint + unit tests + build on every PR; block merge on failure
- [ ] Add the eval-set guardrail test from Phase 4 into CI so a prompt change can't silently ship a theologically unbalanced response

---

## Phase 11 — Security Review

- [ ] Full RLS audit, table by table, with the two-account manual test from Phase 1.2 repeated for every table that now exists
- [ ] Confirm the Supabase anon key is meant to be public (it is, by design) but the service-role key has never touched client code or a public repo — grep the full git history, not just current files
- [ ] Every edge function validates auth before doing expensive work (AI calls especially)
- [ ] `npm audit` clean, or documented exceptions with justification
- [ ] Secrets scanning in CI (continuation of the Phase 0 gitleaks hook, but enforced server-side too)
- [ ] Rate limiting on auth endpoints (signup/login) to blunt brute-force/credential-stuffing attempts
- [ ] Basic CSP headers on the deployed app

---

## Phase 12 — Performance

- [ ] Bundle analysis (`vite-bundle-visualizer` or similar); code-split each feature view behind `React.lazy` so the initial load isn't pulling in Community/Diagrams/Interlinear code before the user's even opened the reader
- [ ] Image optimization (Phase 0 already flags the icons; extend this pass to any content images added during Phase 3/6 ingestion)
- [ ] Postgres index review once real data volume exists (verse table especially, given full-text search + multiple translations × 86 books)
- [ ] Avoid eagerly loading all of `canonMetadata.js` (64KB) on initial paint if most users only touch a handful of books per session — lazy-load or split by category

---

## Phase 13 — Content & Theological Correctness

- [ ] Attribution/citation pass across every ingested text and translation (Phase 3) — public domain doesn't mean uncredited
- [ ] Explicit disclaimer language, visible in-context (not buried in a footer), clarifying that Beyond-Canon texts are presented for historical/study value and their canonical status varies by tradition — this matters more here than in a typical app because the entire pitch is "texts not in today's standard Bible"
- [ ] External theological review (a second set of eyes with cross-tradition knowledge) before public launch — budget time or a small paid review for this specifically, not just self-review
- [ ] Consistency pass on tradition-lens toggling — confirm the AI, the canon-comparison view, and the reader's canon labels all agree with each other for every book, not just the demo ones

---

## Phase 14 — Launch Prep

- [ ] Error tracking (Sentry or similar) — right now a runtime error is invisible to you in production
- [ ] Privacy policy and ToS — user notes and prayer requests are personal/sensitive content; this needs real legal language, not a placeholder
- [ ] Backup strategy for the Postgres database (Supabase has point-in-time recovery on paid tiers — confirm this is actually enabled, not just available)
- [ ] Uptime monitoring on the deployed app and the edge functions specifically (AI outages should alert you, not surface only when a user complains)
- [ ] A real feedback channel (even just an email or a simple in-app form) — you'll want signal on which of these phases mattered most to real users, and that should reorder future phases

---

## Suggested Sequencing

This is written in dependency order, not equal-priority order. Realistically:
- **Weeks 1–2**: Phase 0 in full (non-negotiable, do this before anything else)
- **Weeks 3–8**: Phase 1 (persistence) + Phase 2 (search) — these unblock everything else being "real" rather than cosmetic
- **Months 2–4**: Phase 3 (content ingestion) run in parallel with Phase 4 (AI fix) — different skill sets, can overlap
- **Months 3–5**: Phase 5 (language tools) and Phase 6 (diagrams) — genuinely optional to sequence in either order, pick whichever you find more motivating since both are currently equally thin
- **Ongoing from month 2 onward**: Phase 10 (tests/CI) should start as soon as Phase 1 lands, not bolted on at the end — write tests for each feature as you wire its persistence, not in a separate "testing phase"
- **Month 4+**: Phase 7–9 (deepen study tools, community) only after 1–4 are solid — these are the features most likely to look "done" prematurely again if you rush them
- **Before any public launch**: Phase 11 (security) and Phase 13 (theological correctness) are hard gates, not nice-to-haves, given the domain
- **Launch**: Phase 12 (performance) and Phase 14 (launch prep) last

If this takes months, that's the honest timeline for what's actually left — the original TODO.md's all-checked-boxes version of Phases 2–6 was the part that wasn't real.