# Architecture

This doc covers the pieces that other docs (`README.md`, `CONTRIBUTING.md`) reference but don't define: the canon-status data model, the AI context-passing interface, and the offline strategy. Expect this to grow as Phase 1+ decisions get made — treat it as living, not final.

## Stack

- **Frontend**: React (Vite), PWA via `vite-plugin-pwa`
- **Backend**: Supabase — Postgres, Auth, Storage, Edge Functions
- **AI**: LLM API called via a Supabase Edge Function (never expose the raw API key client-side)

## Canon-status data model

The core differentiator of Berea is that canon isn't a fixed list — it's per-tradition. Every text needs metadata describing where it stands.

```
book
  id
  slug                 e.g. "enoch", "john", "tobit"
  title
  category             enum: canonical | deuterocanon | pseudepigrapha |
                        early_church_writing | gnostic
  origin_period         e.g. "2nd century BC", "1st century AD"
  origin_note           short historical context (authorship consensus, dating)

canon_membership
  book_id               → book.id
  tradition              enum: protestant | catholic | orthodox | ethiopian
  accepted_as_scripture  boolean
  canonical_order        integer, nullable (order within that tradition's Bible)

translation
  id
  book_id               → book.id  (translations are per-book, not global)
  code                   e.g. "KJV", "ESV", "charles-1913"
  license                enum: public_domain | licensed_api
  source                 attribution string

verse
  id
  translation_id         → translation.id
  chapter
  verse_number
  text

user_note
  id
  user_id                → auth.users.id (Supabase Auth)
  book_id, chapter, verse_number   (anchors the note to a reference, not a translation)
  content
  highlight_color        nullable
```

Row-Level Security: `user_note` must be scoped so a user can only read/write their own rows — this is the first RLS policy to write, before any UI touches notes.

## AI context-passing interface

The assistant panel is a single shared surface (see UI decisions in chat history) fed by both direct chat input and contextual triggers from other screens. Every request to the AI Edge Function should carry a consistent context object:

```
{
  book: string,
  chapter: number,
  verse: number | null,
  translation: string,
  tradition: string,          // user's set tradition, drives how contested
                               // questions get framed
  trigger: "chat" | "explain_verse" | "cross_references" | "expand_note",
  userInput: string | null    // null for one-click triggers like "find cross-references"
}
```

Keep this shape stable — every new contextual entry point (diagrams, reading plans, etc.) should produce the same object rather than inventing its own request format.

## Bible text providers & caching (multi-provider strategy)

Multiple keys to the *same* provider don't prevent downtime — if a provider's infrastructure is down, more keys to it don't help. Real resilience comes from a provider mix plus a caching strategy that respects each provider's actual terms (which differ per provider — verify current limits before building against them).

**Primary stack for Phase 1 — no keys required:**

| Provider | License terms | Caching allowed |
|---|---|---|
| KJV / WEB / ASV (public domain) | None needed | **Permanent bulk ingest**, self-hosted, zero external dependency — the guaranteed-available floor |
| Free Use Bible API (AO Lab) | No key, no rate limit, commercial use allowed | Effectively unrestricted — **permanently cacheable**. Covers 1,250+ translations including WEB, NET, Berean Standard Bible |

This pair alone gets Berea to launch with zero API keys, no non-commercial restriction, and a translation library well beyond a typical MVP.

**Optional later additions — only worth it for named translations (NIV, ESV, NKJV) people specifically expect:**

| Provider | License terms | Caching allowed |
|---|---|---|
| API.Bible | Free tier = non-commercial only, 3 licensed translations + open-access set | Cache allowed but capped at <500 consecutive verses, refresh every ≤14 days — not a permanent copy |
| ESV API | Free tier = non-commercial only | Hard cap: cannot locally store more than 500 verses or half a book, ever |
| NET Bible (labs.bible.org) | No key required | Full text via API — verify current caching terms before bulk storage; largely superseded by Free Use Bible API's inclusion of NET |

Because API.Bible and ESV both gate their free tier behind "non-commercial," adding them later means revisiting licensing the moment Berea monetizes (ads, subscriptions) — one more reason to treat them as optional rather than foundational.

Given this, the resilience pattern is: **public-domain + Free Use Bible API form the permanent, always-available core** (both bulk-ingestible); **API.Bible/ESV, if added later, are short-TTL cached per passage** rather than stored permanently, with automatic fallback to the core set if either is briefly unavailable.

## Offline strategy

Not everything can be offline — draw the line explicitly per feature so the service worker caching strategy stays intentional rather than accidental:

| Feature | Offline behavior |
|---|---|
| Default translation (KJV or WEB) | Fully cached, available offline — part of the permanent core per the table above |
| Free Use Bible API translations | Cached same as default translation — permanently cacheable, part of the core |
| Licensed translations (API.Bible/ESV), if added later | Cached short-term per each provider's limit, not bulk-available offline |
| Apocrypha / Pseudepigrapha (public domain) | Cached same as default translation — it's static data |
| User notes/highlights | Read from local cache, writes queued and synced on reconnect |
| AI assistant | Online-only — show a clear "requires connection" state, don't fake a response |
| Audio | Download-on-demand per chapter, not bulk-cached |
| Diagrams | Cached as static assets once rendered |

## Open questions

- Realtime (prayer wall, community features in Phase 6) — Supabase Realtime vs polling, not yet decided
- Audio source — TTS vs licensed audio Bible provider, not yet decided
- Whether Berea will ever monetize (affects API.Bible/ESV licensing terms) — not yet decided