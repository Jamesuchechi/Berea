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
- [ ] `bookmark` — user_id, book_id, chapter, verse_number, created_at
- [ ] `highlight` — user_id, book_id, chapter, verse_number, color, created_at (currently jammed into `user_note.highlight_color`; separate concerns — a highlight isn't always a note)
- [ ] `reading_plan` — id, slug, title, description, duration_days, kind (fixed | ai_generated | group), is_public
- [ ] `reading_plan_day` — plan_id, day_number, reading_refs (jsonb array of book/chapter ranges)
- [ ] `user_plan_progress` — user_id, plan_id, current_day, started_at, last_completed_at, streak_count
- [ ] `memorization_item` — user_id, book_id, chapter, verse_range, added_at
- [ ] `memorization_review` — item_id, reviewed_at, ease_rating, next_review_at (SM-2 fields — see Phase 6)
- [ ] `user_settings` — user_id, tradition, font_size, font_family (dyslexia toggle), theme, tts_rate, notification_prefs (jsonb)
- [ ] `reading_streak` — user_id, current_streak, longest_streak, last_active_date, timezone (needed for correct "day" boundaries — see 1.4)
- [ ] `prayer_request` — user_id (nullable if anonymous posting allowed), category, content, created_at, status (active | answered | archived)
- [ ] `prayer_comment`, `prayer_prayed_for` (the "I prayed for this" tap, not a like) — both scoped by RLS
- [ ] `community_flag` — content_type, content_id, reporter_id, reason, status (moderation queue — build this table *before* you build the UI that needs it)
- [ ] `group_plan_member` — plan_id, user_id, joined_at (for Phase 6 group reading plans)
- [ ] `ai_conversation` / `ai_message` — persist assistant history per user so context survives a session; skip this table entirely if you decide not to persist chat history, but decide explicitly rather than defaulting into it
- [ ] `diagram_definition` — id, type (lineage | timeline | map | network), data (jsonb) — diagrams should be data-driven rows, not hardcoded React arrays, so adding a new one is a content op, not a code change

### 1.2 RLS — for every table above
- [ ] Write and test the policy in the same PR that creates the table, not later
- [ ] For every user-scoped table, manually test with two accounts: Account A cannot read/update/delete Account B's rows
- [ ] For public-read tables (reading_plan, diagram_definition), confirm anon read works and write is admin-only

### 1.3 Wire the frontend to the schema (in priority order)
- [ ] **Notes** — wire `NotesView.jsx` to `user_note` (table already exists, currently unused — cheapest real win available)
- [ ] **Bookmarks/highlights** — wire to new tables
- [ ] **Reading plan progress** — wire `PlansView.jsx`
- [ ] **Memorization progress** — wire `MemorizationView.jsx`
- [ ] **Prayer wall** — wire `CommunityHubView.jsx`
- [ ] Every wire-up above needs: optimistic UI update, loading state, error state (toast or inline, not a silent console.error), and a retry path

### 1.4 Offline-first sync (per your own `ARCHITECTURE.md`, which already commits to this and isn't built)
- [ ] Local write queue (IndexedDB, not localStorage — you'll exceed localStorage's ~5MB fast once notes/highlights accumulate)
- [ ] Sync-on-reconnect logic with conflict resolution rule (last-write-wins is fine to start, but write down that it's the rule)
- [ ] Visual indicator when the app is offline and a write is queued vs. synced
- [ ] Timezone-aware streak logic — "did the user read today" must use the user's local day boundary, not server UTC, or streaks break for non-US-timezone users at midnight edge cases

---

## Phase 2 — Real Search

`searchScripture()` currently searches only the 3-chapter static floor plus whatever's already cached in localStorage. This will look broken to a real user on day one.

- [ ] Move all ingested verse text into Postgres `verse` table (this is also required for Phase 3)
- [ ] Add a `tsvector` generated column + GIN index on `verse.text` for full-text search
- [ ] Add `pg_trgm` for fuzzy/typo-tolerant matching on top of full-text
- [ ] Reference parser: detect and short-circuit queries like "John 3:16" or "jn 3:16-18" into a direct lookup instead of a text search
- [ ] Search must span: all ingested translations, all Beyond-Canon texts (once ingested — Phase 3), and the user's own notes — with results grouped/labeled by source type
- [ ] Server-side search (Postgres RPC or edge function), not client-side string matching — this also fixes the "can only find what's already cached" bug
- [ ] Pagination/ranking (ts_rank) so common words don't return an unusable wall of results

---

## Phase 3 — Beyond-Canon Content: Actually Ingest It

This is Berea's entire differentiator and currently the thinnest part of the app — most texts have 3–26 sample verses out of hundreds. Treat this as a content pipeline project, not a one-off data entry task.

### 3.1 Build the ingestion pipeline once, use it repeatedly
- [ ] Write a repeatable ingestion script (not manual copy-paste): source file → parser → chapter/verse segmentation → QA check → insert into `verse`/`translation`/`book`
- [ ] QA check compares ingested verse counts against a known reference count per book (e.g., "1 Enoch chapter 1 should have 9 verses") and flags mismatches automatically
- [ ] Store source attribution per translation row (public domain still deserves attribution — R.H. Charles, Lightfoot/ANF, etc.) — add an `attribution` field to `translation` if not already covered by `source`
- [ ] CLI or admin-only route to add a new text without a deploy, so this scales past you personally

### 3.2 Prioritized ingestion order (full text, not samples)
1. [ ] **1 Enoch** — full 108 chapters (R.H. Charles translation, public domain) — highest-demand Beyond-Canon text
2. [ ] **Jubilees** — full 50 chapters
3. [ ] **Didache** — full 16 chapters (short — good second target to prove the pipeline before tackling Enoch-scale texts)
4. [ ] **1 Clement**, **Shepherd of Hermas**, **Ignatius' epistles** — Apostolic Fathers set
5. [ ] **1–2 Esdras, 3–4 Maccabees, Prayer of Manasseh** — round out the Deuterocanon/Apocrypha set already partially in `canonMetadata.js`
6. [ ] **Meqabyan I–III** — full text, since these are Ethiopian-canon-specific and currently 1 chapter/3 verses each
7. [ ] Standard Deuterocanon (Tobit, Judith, Wisdom, Sirach, Baruch, 1–2 Maccabees) — verify these aren't already assumed-covered by a Bible API; they likely need the same local-ingestion treatment as the other Beyond-Canon texts since most Bible APIs only cover Protestant-canon books
8. [ ] Gnostic texts (if keeping the `gnostic` category in canonMetadata) — treat with extra care per 3.3 below; consider whether to launch without this category rather than half-ingest it

### 3.3 Content integrity (non-negotiable for a theological app)
- [ ] Every non-canonical text gets a persistent, unmissable UI label of its status per the user's selected tradition (e.g., "Not considered Scripture in Protestant tradition; deuterocanonical in Catholic tradition") — currently the canon-status model exists in the DB schema but isn't surfaced prominently enough in the reader UI itself
- [ ] Fill in `origin_period`/`origin_note` for all 86 books in `canonMetadata.js`, not a partial subset — this metadata is core to the app's stated purpose ("historical clarity") and right now is inconsistent in coverage
- [ ] Get an actual theological review pass (someone with cross-tradition knowledge, not just you) on labeling before public launch — mislabeling a text's canonical status in an app that explicitly positions itself as balanced/scholarly is a credibility risk worth paying for a review to avoid

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