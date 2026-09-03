# Jurisdiction packs

Each `<code>.yaml` file describes **which laws apply in one jurisdiction** —
separately from the `templates/`, which describe **what to build**. The skill
composes them: `template × jurisdiction(s) → filled prompt`.

This split is what lets one `cookie-banner` template serve Israel, the EU and
California without forking it three times.

## Adding a pack

Copy the shape of `eu.yaml`. Required top-level keys:

| Key | Meaning |
|---|---|
| `jurisdiction` | Short code (`il`, `eu`, `us-ca`, `uk`) |
| `name` | Human-readable name |
| `last_reviewed` | ISO date the legal content was last checked |
| `needs_legal_review` | `true` until a qualified lawyer has signed off |
| `frameworks` | List of statutes/standards (see below) |
| `consent_model` | `opt_in` or `opt_out` — drives banner behaviour |
| `rtl` | Whether the primary language is right-to-left |

Each entry in `frameworks` needs at minimum a `name`, what it `governs`, and a
**`citation`** — a URL to the actual statute or standard.

## Rules

1. **No requirement without a citation.** If you cannot link the source, do not
   ship the requirement.
2. **Mark what you have not verified.** Use `verified: false` and, where the
   doubt is specific, a `needs_verification:` note explaining exactly what to
   check. An honest "unverified" is far better than a confident wrong citation.
3. **Date everything.** `last_reviewed` older than 12 months should be treated
   as stale — `scripts/validate.py` warns about this.
4. **Record conflicts.** When one jurisdiction's rule contradicts another's,
   add a `conflicts:` entry. Multi-market sites depend on these being surfaced
   rather than silently resolved.
5. **Never widen scope silently.** Adding a jurisdiction means someone will
   ship a site trusting it. Depth beats breadth.

## Status

| Pack | Coverage | Legal review |
|---|---|---|
| `il.yaml` | PPL + Amendment 13, IS 5568, accessibility, spam, contracts | ❌ Not yet reviewed |
| `eu.yaml` | GDPR, ePrivacy, EAA / EN 301 549, Web Accessibility Directive | ❌ Not yet reviewed |

Planned next: `us-ca` (CCPA/CPRA), `uk` (UK GDPR + PECR).

> These packs are structured references, not legal advice. Every pack must be
> reviewed by a lawyer qualified in that jurisdiction before it is relied on.
