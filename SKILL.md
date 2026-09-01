---
name: israeli-compliance
description: >
  Generates filled-in, ready-to-paste Cursor AI prompts for Israeli website
  legal compliance. Use this skill ANY TIME the user asks for a compliance prompt,
  legal page, cookie banner, accessibility widget, privacy policy, freelancer
  contract, terms of use, refund policy, disclaimer, e-commerce checkout,
  email marketing, GDPR layer, or client onboarding form — even if he says
  it casually (e.g. "give me the cookie banner", "I need a privacy policy prompt",
  "freelancer contract please"). Always collect variables first, then output the
  filled prompt. This skill covers all 13 prompts from the Israeli compliance
  document (Amendment 13 · IS 5568 · WCAG 2.0 AA · GTM Consent Mode v2).
---

# Israeli Website Compliance — Prompt Generator

This skill is for a freelance web developer in Israel. It turns any of these
13 compliance prompts into a fully filled-in prompt ready to paste into Cursor AI.

---

## ⚠️ Not legal advice

These prompts and the documents they generate are **templates for informational
purposes only** and do **not** constitute legal advice. Laws change and every
situation differs. Before publishing any policy, contract, disclaimer, or
accessibility statement produced with this skill, have it reviewed by a qualified
lawyer licensed in the relevant jurisdiction (Israel and/or the EU). Use at your
own risk; no warranty is provided.

---

## Workflow (follow every time)

1. **Identify the prompt** the user wants (match by name, number, or description).
2. **Ask for language** — always ask which language they want the output prompt in: Hebrew / Arabic / English / Russian.
3. **Ask for variables** — show the variable list for that specific prompt (see below). Ask all at once, grouped naturally. Mark optional fields as (optional).
4. **Read the prompt file** from `references/` (see table below).
5. **Output the filled prompt** — replace every `[BRACKET]` with the user's answers. Add the requested language to the `== LANGUAGE ==` section. Format clearly with a heading and a horizontal rule so it's easy to copy.

---

## Prompt Directory

| # | Emoji | Name | Reference File |
|---|-------|------|---------------|
| 1 | 🍪 | Cookie Banner | `references/prompt-01-cookie-banner.md` |
| 2 | 📄 | Privacy Policy | `references/prompt-02-privacy-policy.md` |
| 3 | ♿ | Accessibility Widget | `references/prompt-03-accessibility-widget.md` |
| 4 | 🌐 | Full Site WCAG Baseline | `references/prompt-04-wcag-baseline.md` |
| 5 | 📋 | Accessibility Statement | `references/prompt-05-accessibility-statement.md` |
| 6 | 📜 | Freelancer Contract | `references/prompt-06-freelancer-contract.md` |
| 7 | 📜 | Terms of Use | `references/prompt-07-terms-of-use.md` |
| 8 | 💳 | Refund & Cancellation Policy | `references/prompt-08-refund-policy.md` |
| 9 | ⚠️ | Disclaimer | `references/prompt-09-disclaimer.md` |
| 10 | 🛒 | E-Commerce Compliance | `references/prompt-10-ecommerce.md` |
| 11 | 📧 | Email Marketing | `references/prompt-11-email-marketing.md` |
| 12 | 🇪🇺 | GDPR Notice Layer | `references/prompt-12-gdpr.md` |
| 13 | 📋 | Client Onboarding Questionnaire | `references/prompt-13-onboarding.md` |

---

## Variables Per Prompt

### Prompt 1 — Cookie Banner
- Framework (HTML/CSS/JS or React)
- Website name
- Privacy policy URL
- Contact email
- Brand primary color (#HEX)
- Uses Google Analytics 4? (YES/NO)
- Uses Google Ads? (YES/NO)
- Uses Facebook/Meta Pixel? (YES/NO)
- Uses Mailchimp or email marketing? (YES/NO)
- GTM Container ID (or "not using GTM")

### Prompt 2 — Privacy Policy
- Framework
- Business/website name
- Business type (e.g. freelance web dev / e-commerce / portfolio)
- Owner full name
- Business address (street, city, Israel)
- Privacy contact email
- Website URL
- Hosting provider + country (e.g. GoDaddy / USA)
- Tools used — YES/NO for each: Google Analytics 4, Google Ads, Facebook Pixel, GTM, Mailchimp, WhatsApp Business, Contact form
- Brand primary color

### Prompt 3 — Accessibility Widget
No variables needed — the widget auto-detects brand color from the page.
Just ask for language and output the prompt as-is.

### Prompt 4 — Full Site WCAG Baseline
- Framework
- Primary language of the site (Hebrew / Arabic / English / Russian)
- Main colors: background #HEX / text #HEX / links #HEX / buttons #HEX

### Prompt 5 — Accessibility Statement
- Framework
- Website name
- Business owner / coordinator name
- Coordinator email
- Coordinator phone (optional)
- Website URL
- Last accessibility review date
- Brand primary color

### Prompt 6 — Freelancer Contract
- Contractor full name (the freelancer's name)
- Contractor address
- Tax ID / ת.ז
- Contractor business type (עוסק פטור or עוסק מורשה)
- Client business name
- Client address
- Client tax ID
- Client contact person (name + title)
- Project description (what website/app)
- Estimated delivery (weeks)
- Number of revision rounds included
- Total fee (₪)
- Payment method (Bank transfer / Bit / PayPal)
- Start date (or "within 5 days of deposit")
- Your city (for jurisdiction clause)
- Hourly rate for additional work (₪/hour)

### Prompt 7 — Terms of Use
- Framework
- Business/website name
- Business type
- Owner full name
- Business address
- Contact email
- Website URL
- Brand primary color
- Sells products or services? (YES/NO)
- Allows user accounts/registration? (YES/NO)
- Allows user-generated content? (YES/NO)

### Prompt 8 — Refund & Cancellation Policy
- Framework
- Business/website name
- Business type (freelance services / digital products / physical goods / SaaS)
- Owner full name
- Contact email
- Website URL
- Brand primary color
- Physical goods? (YES/NO)
- Digital downloads? (YES/NO)
- Software/SaaS subscriptions? (YES/NO)
- Freelance/service-based work? (YES/NO)

### Prompt 9 — Disclaimer
- Framework
- Business/website name
- Owner full name
- Contact email
- Brand primary color
- General information/blog content? (YES/NO)
- Health or medical content? (YES/NO)
- Legal information? (YES/NO)
- Financial or investment content? (YES/NO)
- Coaching / personal development? (YES/NO)
- Affiliate links or sponsored content? (YES/NO)
- AI-generated content on site? (YES/NO)

### Prompt 10 — E-Commerce Compliance
- Framework
- Shop name
- Products sold (physical / digital / services / subscriptions)
- Payment processor (Stripe / PayPlus / CardCom / Tranzila / other)
- Brand primary color
- Contact email

### Prompt 11 — Email Marketing
- Framework
- Email platform (Mailchimp / ActiveCampaign / Sendinblue / other)
- Website name
- Contact email
- Brand primary color
- Newsletter? (YES/NO)
- Promotional offers? (YES/NO)
- Product updates? (YES/NO)
- Has EU subscribers? (YES/NO)

### Prompt 12 — GDPR Notice Layer
- Framework
- Website name
- Shows EU prices or EU-language content? (YES/NO)
- Ships to EU? (YES/NO)
- Privacy contact email
- Brand primary color
- Existing privacy policy URL
- Cookie banner already built (Prompt 1 done)? (YES/NO)

### Prompt 13 — Client Onboarding Questionnaire
- Your name
- Your email
- Your website URL
- Brand color for the form (#HEX)

---

## Output Format

After collecting all answers, output the filled prompt like this:

```
---
## 🍪 Cookie Banner Prompt — Ready to paste into Cursor AI

[full filled prompt text here]

---
✅ Verification Checklist:
[checklist from the reference file]
```

Always include the verification checklist at the end so the user can check the output.
