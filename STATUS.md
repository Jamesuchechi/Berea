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

## Phase 1 — Infrastructure & CI 🔴 NOT STARTED

No CI pipeline exists. No automated tests exist. No GitHub Actions workflows exist.

Planned: GitHub Actions for lint + type-check + secret scan (gitleaks), Supabase migration CI, and a basic Jest/Vitest test harness.

---

## Phase 2 — Notes (Persistence) 🔴 NOT STARTED

The Notes UI renders but all data is in React state only. Nothing is saved to Postgres. No RLS policies exist for notes. Page reload loses all data.

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
