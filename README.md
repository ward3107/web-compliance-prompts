# Israeli Compliance Prompts

AI coding prompts for **Israeli website legal compliance** — covering
**Amendment 13** to the Privacy Protection Law, the **IS 5568 / WCAG 2.0 AA**
accessibility standard, and **Google Consent Mode v2**. Each prompt is a
ready-to-fill template you paste into an AI coding assistant (Cursor, Claude,
etc.) to generate the corresponding artifact for a client site.

Output can be generated in **Hebrew, Arabic, English, or Russian**, with RTL
support where relevant.

> ## ⚠️ Not legal advice
>
> These prompts and the documents they generate are **templates for
> informational purposes only** and do **not** constitute legal advice. Laws
> change and every situation differs. Before publishing any policy, contract,
> disclaimer, or accessibility statement produced with these prompts, have it
> reviewed by a **qualified lawyer** licensed in the relevant jurisdiction
> (Israel and/or the EU). Use at your own risk; no warranty is provided.

---

## What's inside

- **`SKILL.md`** — an [Agent Skill](https://docs.claude.com/en/docs/claude-code/skills)
  definition that drives the prompt generator: it collects the needed variables,
  asks for the output language, and fills in the matching template.
- **`references/`** — the 13 prompt templates, each using `[BRACKET]`
  placeholders for values you supply.

## The 13 prompts

| # | Prompt | File |
|---|--------|------|
| 1 | 🍪 Cookie Banner (Consent Mode v2) | `references/prompt-01-cookie-banner.md` |
| 2 | 📄 Privacy Policy (Amendment 13) | `references/prompt-02-privacy-policy.md` |
| 3 | ♿ Accessibility Widget | `references/prompt-03-accessibility-widget.md` |
| 4 | 🌐 Full-Site WCAG 2.0 AA Baseline | `references/prompt-04-wcag-baseline.md` |
| 5 | 📋 Accessibility Statement (IS 5568) | `references/prompt-05-accessibility-statement.md` |
| 6 | 📜 Freelancer Contract | `references/prompt-06-freelancer-contract.md` |
| 7 | 📜 Terms of Use | `references/prompt-07-terms-of-use.md` |
| 8 | 💳 Refund & Cancellation Policy | `references/prompt-08-refund-policy.md` |
| 9 | ⚠️ Disclaimer | `references/prompt-09-disclaimer.md` |
| 10 | 🛒 E-Commerce Compliance | `references/prompt-10-ecommerce.md` |
| 11 | 📧 Email Marketing | `references/prompt-11-email-marketing.md` |
| 12 | 🇪🇺 GDPR Notice Layer | `references/prompt-12-gdpr.md` |
| 13 | 📋 Client Onboarding Questionnaire | `references/prompt-13-onboarding.md` |

## How to use

1. Pick the prompt you need from `references/`.
2. Replace every `[BRACKET]` placeholder with your real values.
3. Choose the output language (Hebrew / Arabic / English / Russian).
4. Paste the filled prompt into your AI coding assistant.
5. Review the generated output against the verification checklist included in
   each prompt — and have anything legally binding reviewed by a lawyer.

If you use Claude Code or another skill-aware assistant, `SKILL.md` can automate
steps 1–4: it prompts you for the variables and language, then emits the filled
template.

## Standards referenced

- **Amendment 13** — Israel's Privacy Protection Law (Amendment 13), effective 2025.
- **IS 5568** — Israeli accessibility standard, aligned with **WCAG 2.0 Level AA**.
- **GTM Consent Mode v2** — Google's consent signaling for Analytics/Ads.
- **GDPR** — for sites with EU visitors or customers.

## License

Released under the [MIT License](LICENSE).
