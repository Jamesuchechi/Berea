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

## Phase 3 — Beyond-Canon Content Pipeline 🟢 COMPLETE

**Session:** 2026-08-03

**Completed:**
- ✅ Ingestion service ([`ingestionService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/ingestionService.js)): raw text parser → chapter & verse segmenter → QA count validator → Supabase inserter.
- ✅ Automated QA check validating chapter/verse counts against reference standards (Didache, Tobit, 1 Enoch, Jubilees, Wisdom, Sirach).
- ✅ Migration [`20260803000008_beyond_canon_pipeline.sql`](file:///home/jamesuchechi/Projects/Berea/supabase/migrations/20260803000008_beyond_canon_pipeline.sql) added attribution columns to `translation` table.
- ✅ Expanded Beyond-Canon service ([`beyondCanonService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/beyondCanonService.js)) with tradition-lens filtering and canonical status mapping (`protestant`, `catholic`, `orthodox`, `ethiopian`).
- ✅ Dynamic tradition status badge rendering in [`CanonComparisonView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/apocrypha/CanonComparisonView.jsx).
- ✅ Created test suite [`src/services/__tests__/beyondCanonService.test.js`](file:///home/jamesuchechi/Projects/Berea/src/services/__tests__/beyondCanonService.test.js).

---

## Phase 4 — Real AI Assistant & Semantic Search 🟢 COMPLETE

**Session:** 2026-08-03

**Completed:**
- ✅ Supabase Edge Function proxy ([`supabase/functions/ai-assistant/index.ts`](file:///home/jamesuchechi/Projects/Berea/supabase/functions/ai-assistant/index.ts)): enforces caller Supabase JWT authentication (`401` on invalid/missing auth), server-side Groq call using `GROQ_API_KEY`, per-user token-bucket rate-limiting, and deterministic trigger response caching.
- ✅ Created SQL migration [`20260803000009_ai_semantic_search.sql`](file:///home/jamesuchechi/Projects/Berea/supabase/migrations/20260803000009_ai_semantic_search.sql): enables `vector` (pgvector) extension, adds `embedding` columns, creates `ai_rate_limit` and `ai_response_cache` tables with RLS policies, and implements Postgres RPC `match_semantic_verses` for vector & hybrid similarity search.
- ✅ AI Conversation Persistence Service ([`aiConversationService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/aiConversationService.js)): manages `ai_conversation` and `ai_message` database records with optimistic offline fallback.
- ✅ Client AI Engine ([`src/lib/ai.js`](file:///home/jamesuchechi/Projects/Berea/src/lib/ai.js)): replaced hardcoded 4-item array with real vector/hybrid semantic search engine querying database RPC with fallback.
- ✅ Connected [`AIHubView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/ai/AIHubView.jsx) to persistent conversation history, rate limit tracking, and streaming assistant support.
- ✅ Guardrail Regression Eval Suite ([`src/services/__tests__/aiGuardrails.test.js`](file:///home/jamesuchechi/Projects/Berea/src/services/__tests__/aiGuardrails.test.js)): 35 contested-topic prompt test cases verifying multi-tradition neutrality, reverent tone, and non-dogmatic responses across traditions.

---

## Phase 5 — Real Original-Language Tools 🟢 COMPLETE

**Session:** 2026-08-03

**Completed:**
- ✅ Migration [`20260803000010_original_language_lexicon.sql`](file:///home/jamesuchechi/Projects/Berea/supabase/migrations/20260803000010_original_language_lexicon.sql): created `lexicon` (Strong's dictionary entries) and `interlinear_word` tables with public read RLS policies.
- ✅ OpenScriptures & STEP Bible lexicon dataset ([`lexiconData.js`](file:///home/jamesuchechi/Projects/Berea/src/data/lexiconData.js)): Strong's concordance dictionary mapping Greek (G) and Hebrew (H) lemmas, transliterations, pronunciations, parts of speech, and etymology.
- ✅ Language Service ([`languageService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/languageService.js)): data-driven interlinear passage resolver for any book/chapter/verse in Greek (LTR) or Hebrew (RTL), Strong's entry lookup, and SpeechSynthesis audio pronunciation speaker.
- ✅ Interactive Interlinear Inspector ([`InterlinearView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/languages/InterlinearView.jsx)): dynamic book/chapter/verse navigation, Greek/Hebrew word tiles, Strong's concordance badges, interactive lexicon drawer, and TTS audio buttons.
- ✅ Reader View Integration ([`ReaderView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/reader/ReaderView.jsx)): added "View Interlinear" button on verse selection toolbar navigating directly to `InterlinearView` populated with the active verse.
- ✅ Created test suite [`src/services/__tests__/languageService.test.js`](file:///home/jamesuchechi/Projects/Berea/src/services/__tests__/languageService.test.js).

---

## Phase 6 — Real Diagrams & Maps 🟢 COMPLETE

**Session:** 2026-08-05

**Completed:**
- ✅ Created SQL migration [`20260803000011_diagrams_and_maps.sql`](file:///home/jamesuchechi/Projects/Berea/supabase/migrations/20260803000011_diagrams_and_maps.sql) (schema and RLS policies for `diagram_definition` table).
- ✅ Created structured JSON graph datasets in [`diagramData.js`](file:///home/jamesuchechi/Projects/Berea/src/data/diagramData.js) for Genealogy, Timeline, Map coordinates/routes, and Cross-Reference network.
- ✅ Implemented [`diagramService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/diagramService.js) for fetching diagram definitions from Supabase with offline fallback.
- ✅ Created [`GenealogyGraph.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/diagrams/GenealogyGraph.jsx) (interactive SVG node-link tree graph with person bio drawer).
- ✅ Created [`InteractiveTimeline.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/diagrams/InteractiveTimeline.jsx) (visual horizontal timeline scrubber with era filters).
- ✅ Created [`BiblicalMap.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/diagrams/BiblicalMap.jsx) (interactive map rendering real lat/long coordinates & route polylines).
- ✅ Created [`CrossReferenceGraph.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/diagrams/CrossReferenceGraph.jsx) (Treasury of Scripture Knowledge verse relationship network graph).
- ✅ Rewrote [`DiagramsView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/diagrams/DiagramsView.jsx) with category filter tabs (`All`, `Genealogy Trees`, `Timelines`, `Interactive Maps`, `Cross-Ref Network`), loading skeleton, and error handling.
- ✅ Created test suite [`src/services/__tests__/diagramService.test.js`](file:///home/jamesuchechi/Projects/Berea/src/services/__tests__/diagramService.test.js).
- ✅ `npm run build` succeeds cleanly (120 modules transformed).

---

## Phase 7 — Reading Plans, Memorization, Notes: Deepen Past the Demo 🟢 COMPLETE

**Session:** 2026-08-05

**Completed:**
- ✅ Created SQL migration [`20260803000012_phase7_plans_memorization_notes.sql`](file:///home/jamesuchechi/Projects/Berea/supabase/migrations/20260803000012_phase7_plans_memorization_notes.sql) (SM-2 parameters for `memorization_item`, `tags` and `linked_references` for `user_note`, and `reading_plan_reminder` table).
- ✅ Implemented SuperMemo SM-2 algorithm in [`sm2Algorithm.js`](file:///home/jamesuchechi/Projects/Berea/src/services/sm2Algorithm.js) calculating interval days, ease factor (EF), and repetition count per user quality score.
- ✅ Implemented [`readingPlanService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/readingPlanService.js) supporting catch-up schedule calculation for missed days and AI plan generation via Edge Function.
- ✅ Implemented [`noteExportService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/noteExportService.js) detecting verse reference links (`John 3:16`, `Tobit 1:3`) in note text and exporting notes to Markdown (`.md`) and JSON backup.
- ✅ Updated [`MemorizationView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/memorization/MemorizationView.jsx) with SM-2 quality rating buttons (`Again (1d)`, `Hard (3d)`, `Good (6d)`, `Easy (12d)`), due count badges, and ease factor tracking.
- ✅ Updated [`PlansView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/plans/PlansView.jsx) with catch-up warning banner and AI Plan generator modal.
- ✅ Updated [`NotesView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/notes/NotesView.jsx) with Markdown export and auto-linked verse reference badges.
- ✅ Created unit test suite [`src/services/__tests__/phase7Services.test.js`](file:///home/jamesuchechi/Projects/Berea/src/services/__tests__/phase7Services.test.js) (8 tests passing 100%).
- ✅ `npm run build` succeeds cleanly (123 modules transformed).

---

## Phase 8 — Accessibility & Engagement 🟢 COMPLETE

**Session:** 2026-08-05

**Completed:**
- ✅ Extended TTS engine (`AudioEngine.js`, `useAudioTTS.js`) to support arbitrary text narration (AI responses, study notes, diagram bios, and verses) with rate control and event broadcasting.
- ✅ Full multi-device accessibility settings persistence (`user_settings` table & `userSettingsService.js`) covering `fontSize`, `dyslexicFont` (OpenDyslexic typography), `theme`, and `ttsRate`.
- ✅ WCAG AA contrast audit and adjustments across light parchment and dark forest CSS variables in `index.css` (minimum 4.5:1 ratio for text and faint elements).
- ✅ Created SQL migration [`20260803000013_phase8_streaks_and_notifications.sql`](file:///home/jamesuchechi/Projects/Berea/supabase/migrations/20260803000013_phase8_streaks_and_notifications.sql) (`push_subscriptions` table and timezone-aware streak function).
- ✅ Created [`streakService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/streakService.js) for timezone-aware daily habit streaks and weekly activity heatmap.
- ✅ Created [`pushNotificationService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/pushNotificationService.js) for Service Worker Web Push daily verse notification delivery and permission management.
- ✅ Updated [`AccessibilitySettingsView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/settings/AccessibilitySettingsView.jsx) with font size controls, OpenDyslexic font toggle, TTS speed options, streak heatmap, and push notification controls.
- ✅ Updated [`AssistantPanel.jsx`](file:///home/jamesuchechi/Projects/Berea/src/components/AssistantPanel.jsx) and [`DailyVerseCard.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/daily/DailyVerseCard.jsx) with TTS listen buttons and Web Push reminders.
- ✅ Created unit test suite [`src/services/__tests__/phase8Services.test.js`](file:///home/jamesuchechi/Projects/Berea/src/services/__tests__/phase8Services.test.js) (74 total tests passing 100%).
- ✅ `npm run build` succeeds cleanly (126 modules transformed).

---

## Phase 9 — Community: Build Moderation Layer Before Posting UI 🟢 COMPLETE

**Session:** 2026-08-05

**Completed:**
- ✅ Created SQL migration [`20260803000014_phase9_community_moderation.sql`](file:///home/jamesuchechi/Projects/Berea/supabase/migrations/20260803000014_phase9_community_moderation.sql) (`user_block` table, `is_hidden` column, and Postgres RPC `check_user_posting_rate_limit`).
- ✅ Created official Berea Community Guidelines document [`docs/COMMUNITY_GUIDELINES.md`](file:///home/jamesuchechi/Projects/Berea/docs/COMMUNITY_GUIDELINES.md) detailing reverence standards, anonymity rules, rate limits, and reporting procedures.
- ✅ Implemented [`moderationService.js`](file:///home/jamesuchechi/Projects/Berea/src/services/moderationService.js) managing sliding-window posting rate limits (max 3/hr), user block/mute actions, and Admin flag review operations.
- ✅ Created [`AdminModerationQueue.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/community/AdminModerationQueue.jsx) rendering reported posts with review actions (Dismiss, Archive/Hide Content, Block Author).
- ✅ Created [`CommunityGuidelinesModal.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/community/CommunityGuidelinesModal.jsx) modal for viewing official community standards.
- ✅ Updated [`CommunityHubView.jsx`](file:///home/jamesuchechi/Projects/Berea/src/features/community/CommunityHubView.jsx) to include Admin Moderation Queue tab, rate-limiting error feedback, guidelines modal trigger, and author block options.
- ✅ Created unit test suite [`src/services/__tests__/moderationService.test.js`](file:///home/jamesuchechi/Projects/Berea/src/services/__tests__/moderationService.test.js) (80 total unit tests passing 100%).
- ✅ `npm run build` succeeds cleanly (129 modules transformed).

---

## Phase 10 — Testing & CI 🟡 PARTIAL

Vitest unit test runner setup, GitHub Actions CI workflow ([`.github/workflows/ci.yml`](file:///home/jamesuchechi/Projects/Berea/.github/workflows/ci.yml)), and guardrail regression eval suite.

---

## Phase 11 — Security Review 🔴 NOT STARTED

Required before production launch. RLS policy audit, CSP headers, rate-limiting on auth endpoints pending.
