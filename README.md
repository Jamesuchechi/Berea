# Berea

> "Now the Berean Jews were of more noble character... for they examined the Scriptures every day." — Acts 17:11

Berea is a Christian study app that goes beyond the standard 66-book Bible — bringing the Deuterocanon, Pseudepigrapha (Enoch, Jubilees, etc.), and early church writings into one clean, reverent, AI-assisted study experience.

It's a web app (installable as a PWA) built for people who want to go deeper than a typical Bible app allows.

## Why Berea

Most Bible apps stop at a single canon. Berea treats canon as a first-class concept instead of an assumption:

- **Today's Bible, done well** — multiple translations, fast search, offline reading
- **Beyond the standard canon** — Deuterocanon/Apocrypha, Pseudepigrapha, early church writings, clearly labeled by tradition and historical origin (never presented as "hidden" or "suppressed" — just honestly contextualized)
- **AI study assistant** — a persistent assistant available from any screen, context-aware of whatever verse/passage/note you're on
- **Study diagrams** — genealogy trees, timelines, cross-reference graphs, maps
- **Personal study tools** — notes, highlights, reading plans, audio, memorization

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React (PWA — offline support, installable) |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions) |
| AI | LLM API (assistant panel + contextual retrieval over scripture corpus) |
| Hosting | TBD (Vercel/Netlify recommended for the React/PWA frontend) |

## Project Structure

```
berea/
├── src/
│   ├── components/       # UI components
│   ├── features/         # feature modules (reader, notes, assistant, diagrams...)
│   ├── lib/               # Supabase client, AI client, helpers
│   ├── data/              # canon metadata, static public-domain texts
│   └── routes/
├── supabase/
│   ├── migrations/
│   └── functions/         # edge functions (AI proxy, search, etc.)
├── public/
│   └── manifest.json       # PWA manifest
├── docs/
│   ├── TODO.md
│   ├── CONTRIBUTING.md
│   └── ARCHITECTURE.md
└── README.md
```

## Getting Started

```bash
git clone https://github.com/<your-username>/berea.git
cd berea
npm install
cp .env.example .env.local   # fill in Supabase + AI keys
npm run dev
```

### Environment Variables

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GROQ_AI_API_KEY=
```

## Content & Licensing Note

Berea combines:
- Public-domain scripture translations (e.g. KJV, WEB, ASV) — free to use anywhere
- Licensed translations (e.g. ESV, NIV) via their official APIs — used under their terms, with required attribution
- Public-domain Apocrypha/Pseudepigrapha texts (e.g. R.H. Charles's translations) — free to use

See `docs/ARCHITECTURE.md` for the canon-status data model and `CONTRIBUTING.md` for sourcing rules before adding any new text.

## Roadmap

See [`docs/TODO.md`](./docs/TODO.md) for build phases.

## Contributing

See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## License

Code is licensed under MIT (see `LICENSE`). Scripture and historical text content follows the licensing of its original source — see the Content & Licensing note above.