# Berea — Future Ideas Backlog

**Status: not scheduled.** These are features that never appeared in `README.md`, `ARCHITECTURE.md`, `TODO.md`, or `TODO2.md` — surfaced separately so they don't bloat the core rebuild roadmap. **Do not start any of these before `TODO2.md` is complete.** TODO2 fixes the foundation (persistence, real content, security, real AI); building on top of that foundation before it's solid just creates more of the same UI-shell debt this backlog exists to avoid repeating.

When you're ready to pull from this list, treat each item the same way TODO2 treats its phases — it only counts as done when it meets TODO2's Definition of Done (survives reload, RLS tested, has loading/error states, security-reviewed if it touches keys/money/user content, has a test).

---

## Content & Study Depth

- [ ] **Commentary layer** — public-domain commentaries (Matthew Henry, Jamieson-Fausset-Brown, Adam Clarke) as a companion pane per verse. Cross-tradition framing matters here too: where commentaries disagree, that's a feature of Berea's positioning, not a bug to hide.
- [ ] **Full concordance / word study** — every occurrence of a given word across the whole ingested corpus. Distinct from the Strong's lexicon lookup in TODO2 Phase 5, which is per-word-in-a-verse, not per-occurrence-across-scripture.
- [ ] **Creeds & councils library** — Nicene Creed, Apostles' Creed, Chalcedonian Definition, and the major church councils, with historical context. Fits the "beyond the standard Bible" pitch as directly as Enoch or Jubilees do, and is currently absent entirely.
- [ ] **Harmony of the Gospels** — synchronized side-by-side view of parallel accounts of the same event across Matthew/Mark/Luke/John.
- [ ] **Topical/thematic index** — browse by doctrine or theme (grace, suffering, prayer) instead of only by book/chapter.
- [ ] **Manuscript/textual variant viewer** — surfacing where major manuscripts (e.g. Codex Sinaiticus) differ. Advanced/scholarly-tier feature — nice-to-have, not core.

## Personal & Family Tools

- [ ] **Private prayer journal with answered-prayer tracking** — distinct from the public Community prayer wall (TODO2 Phase 9); a purely personal, never-shared version with its own history/timeline.
- [ ] **Family/group devotional mode** — shared reading plan for a household, a kid-friendly reading-level toggle, printable worksheets.
- [ ] **Onboarding flow — tradition-selection quiz.** Flagging this one as higher priority than the rest of this list: the AI context object and the entire canon-status model (both already designed in `ARCHITECTURE.md`) depend on a user's `tradition` being set, but no doc anywhere defines how or when a user actually picks one. Worth pulling forward even if the rest of this backlog waits.
- [ ] **Import tool** — bring notes/highlights over from YouVersion, Logos, or Olive Tree, to lower switching cost from an incumbent app.

## Community, Beyond the Prayer Wall

- [ ] **Private study groups** — shared notes and discussion visible only to an invited group; a different (easier) moderation profile than the fully public wall in TODO2 Phase 9.
- [ ] **User-submitted reading plans** — a light "plans marketplace"; start curated (pastors/creators submit, you approve) rather than fully open-upload.
- [ ] **Comparative-canon mini-game** — "which traditions accept this book?" — turns the core differentiator into something shareable and fun rather than purely reference material.

## Growth & Retention

- [ ] **Shareable verse-art / quote cards** — generate an image of a verse for social sharing. A real acquisition channel for Bible apps specifically; currently not mentioned anywhere.
- [ ] **Weekly email/notification digest** — reading progress, notes taken, streak recap.
- [ ] **Public API for the canon-status dataset** — once Phase 3 content ingestion (TODO2) is real, Berea sits on a genuinely unique per-tradition canon dataset. A read-only public API for other Christian dev projects is a differentiator and a possible goodwill/monetization angle nobody's discussed yet.

## Business & Compliance

*(Currently absent from every doc — worth deciding the shape of these even before building them.)*

- [ ] **Monetization model decision** — subscription, donation-based, or free indefinitely. No doc anywhere states this, and it directly affects the ESV/API.Bible licensing question already left open in `ARCHITECTURE.md` ("whether Berea will ever monetize"). Deciding this earlier avoids re-litigating licensing later.
- [ ] **GDPR-style data export / full account deletion** — given notes and prayer requests are personal content, "download my data" and "delete my account and everything in it" should exist before any real public launch.
- [ ] **Admin/CMS dashboard** — an internal tool for content ingestion (TODO2 Phase 3), moderation queue review (TODO2 Phase 9), and basic user support — instead of doing all of this via raw database access. Becomes necessary the moment those two phases are real, not before.

---

## How to use this file

1. Finish `TODO2.md` first, in full, including its testing/security/theological-review phases.
2. Come back here and re-prioritize — some of these will matter more or less once real users are actually using the app; don't schedule this list purely from today's guesses.
3. Promote items into a numbered phase (like TODO2's structure) only when you're actually about to start them — keep this file as a loose backlog, not a second roadmap competing with TODO2.