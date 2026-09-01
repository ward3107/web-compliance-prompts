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

This repo is a **Claude Code plugin** that bundles one Agent Skill:

```
.claude-plugin/
  marketplace.json          # lets others add this repo as a plugin marketplace
  plugin.json               # plugin manifest
skills/
  israeli-compliance/
    SKILL.md                # the prompt-generator skill
    references/             # the 13 prompt templates ([BRACKET] placeholders)
```

- **`skills/israeli-compliance/SKILL.md`** — an
  [Agent Skill](https://docs.claude.com/en/docs/claude-code/skills) that drives
  the generator: it collects the needed variables, asks for the output language,
  and fills in the matching template.
- **`skills/israeli-compliance/references/`** — the 13 prompt templates.

## Install as a Claude Code plugin

In Claude Code, add this repo as a plugin marketplace, then install the plugin:

```
/plugin marketplace add ward3107/israeli-compliance-prompts
/plugin install israeli-compliance@israeli-compliance
```

Once installed, just ask naturally — e.g. *"give me the cookie banner compliance
prompt"* or *"I need the freelancer contract"* — and the skill activates, asks
for your variables and language, and outputs the filled prompt.

### Alternative: install the skill directly (no plugin)

```bash
git clone https://github.com/ward3107/israeli-compliance-prompts.git
mkdir -p ~/.claude/skills
cp -r israeli-compliance-prompts/skills/israeli-compliance ~/.claude/skills/israeli-compliance
```

### Alternative: use the prompts by hand (no Claude Code)

Open any file under `skills/israeli-compliance/references/`, copy the text,
replace the `[BRACKET]` placeholders, and paste it into Cursor, Claude, ChatGPT,
or any AI coding assistant.

## The 13 prompts

| # | Prompt | File |
|---|--------|------|
| 1 | 🍪 Cookie Banner (Consent Mode v2) | `skills/israeli-compliance/references/prompt-01-cookie-banner.md` |
| 2 | 📄 Privacy Policy (Amendment 13) | `skills/israeli-compliance/references/prompt-02-privacy-policy.md` |
| 3 | ♿ Accessibility Widget | `skills/israeli-compliance/references/prompt-03-accessibility-widget.md` |
| 4 | 🌐 Full-Site WCAG 2.0 AA Baseline | `skills/israeli-compliance/references/prompt-04-wcag-baseline.md` |
| 5 | 📋 Accessibility Statement (IS 5568) | `skills/israeli-compliance/references/prompt-05-accessibility-statement.md` |
| 6 | 📜 Freelancer Contract | `skills/israeli-compliance/references/prompt-06-freelancer-contract.md` |
| 7 | 📜 Terms of Use | `skills/israeli-compliance/references/prompt-07-terms-of-use.md` |
| 8 | 💳 Refund & Cancellation Policy | `skills/israeli-compliance/references/prompt-08-refund-policy.md` |
| 9 | ⚠️ Disclaimer | `skills/israeli-compliance/references/prompt-09-disclaimer.md` |
| 10 | 🛒 E-Commerce Compliance | `skills/israeli-compliance/references/prompt-10-ecommerce.md` |
| 11 | 📧 Email Marketing | `skills/israeli-compliance/references/prompt-11-email-marketing.md` |
| 12 | 🇪🇺 GDPR Notice Layer | `skills/israeli-compliance/references/prompt-12-gdpr.md` |
| 13 | 📋 Client Onboarding Questionnaire | `skills/israeli-compliance/references/prompt-13-onboarding.md` |

## Standards referenced

- **Amendment 13** — Israel's Privacy Protection Law (Amendment 13), effective 2025.
- **IS 5568** — Israeli accessibility standard, aligned with **WCAG 2.0 Level AA**.
- **GTM Consent Mode v2** — Google's consent signaling for Analytics/Ads.
- **GDPR** — for sites with EU visitors or customers.

## License

Released under the [MIT License](LICENSE).
