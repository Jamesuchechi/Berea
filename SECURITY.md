# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Berea (e.g. an auth bypass, exposed Supabase key, RLS misconfiguration, AI prompt-injection issue in the assistant, etc.), please **do not open a public GitHub issue**.

Instead, report it privately to: `<security-contact-email-to-add>`

Please include:
- A description of the vulnerability and its potential impact
- Steps to reproduce
- Any relevant logs or screenshots

We'll acknowledge reports as quickly as possible and keep you updated as it's addressed.

## Scope

Particular areas of concern for this project:
- Supabase Row-Level Security policies (user notes/bookmarks must never be readable across accounts)
- AI assistant endpoints (rate limiting, prompt injection, API key exposure)
- PWA/service worker (cache poisoning, stale-content risks)
- Third-party translation API keys (must never be exposed client-side)

## Supported Versions

As the project is pre-1.0, only the `main` branch is actively supported for security fixes.
