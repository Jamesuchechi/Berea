# Contributing to Berea

Thanks for wanting to contribute. Berea deals with sacred and historical texts across multiple traditions, so a couple of things matter more here than in a typical repo: **accuracy** and **respectful, honest framing** of contested material.

## Ground Rules

1. **Never present a text's canon status ambiguously.** Every scripture/apocryphal/pseudepigraphal text must carry metadata for which tradition(s) accept it as canon, its approximate historical origin, and its source. See `docs/ARCHITECTURE.md` for the schema.
2. **No copyrighted text without a license.** Public-domain sources (KJV, WEB, ASV, R.H. Charles translations, etc.) can be added freely. Anything else (ESV, NIV, modern DSS translations) requires going through the licensed API — never paste in copyrighted text directly.
3. **Cite your source.** Any content addition (translation, commentary, historical note) needs a source reference in the PR description.
4. **Framing matters.** Non-canonical/Gnostic material must be contextualized (dating, authorship consensus, why it isn't in mainstream canons) rather than presented as equivalent to accepted scripture. This isn't about taking a theological side — it's about not misleading users.

## Development Setup

```bash
git clone https://github.com/<your-username>/berea.git
cd berea
npm install
cp .env.example .env.local
npm run dev
```

## Branching & Commits

- Branch naming: `feature/<short-name>`, `fix/<short-name>`, `content/<short-name>`
- Commits: short imperative summary line (`Add genealogy diagram component`), body if needed for context
- One logical change per PR — keep content additions (new texts) separate from feature/code PRs

## Pull Request Checklist

- [ ] Code builds and lints clean (`npm run lint`)
- [ ] New content includes canon-status metadata and source citation
- [ ] No copyrighted text pasted directly into the repo/data files
- [ ] UI changes checked against the design system (see `docs/ARCHITECTURE.md`)
- [ ] PWA/offline behavior not broken (test in offline mode if you touched caching/service worker logic)

## Code Style

- React functional components + hooks
- Keep feature logic inside `src/features/<feature-name>`, shared UI in `src/components`
- Supabase queries live in `src/lib/`, not scattered inline in components

## Reporting Issues

Use GitHub Issues. For content-accuracy issues (a mislabeled canon status, wrong attribution, translation error), tag with `content` so it gets reviewed against source material before merging any fix.

## Security

Do not open a public issue for security vulnerabilities — see `SECURITY.md`.
