# 📋 Client Onboarding Questionnaire — Deep Version

You are a senior web developer. Build a professional CLIENT ONBOARDING
QUESTIONNAIRE as a standalone page I send to new clients.
It collects everything needed to build their site AND determines
which compliance pages they legally require.

== MY INFO (pre-fill in the form header) ==
My name: [YOUR_NAME]
My email: [YOUR_EMAIL]
My website: [YOUR_WEBSITE_URL]
Brand color for the form: [BRAND_COLOR]

== SECTION 1 — BUSINESS BASICS ==
Business/website name (required)
Business type: dropdown [freelancer / small business / startup / NGO / other]
Owner full name (required)
Business address: street, city, Israel (required)
Email (required) + Phone (optional)
Website URL (if existing) or desired URL
Languages for the site: multi-select [Hebrew / Arabic / English / Russian]

== SECTION 2 — DESIGN & BRAND ==
Logo file upload (PNG, SVG, JPG)
Brand primary color: color picker + hex input
Brand secondary color: color picker + hex input
Preferred style: radio [minimal / modern / classic / bold / other]
Reference websites they like (up to 3 URL inputs)
Colors or styles to AVOID: text field

== SECTION 3 — SITE FEATURES ==
Checkboxes — select all that apply:
Contact form
Google Analytics / tracking
Facebook / Meta Pixel
Google Ads
Mailchimp or email newsletter
Online store / payments
User accounts / registration
Blog or news section
Multilingual content
Booking or appointment system
Chat widget (WhatsApp, Intercom, etc.)
EU visitors expected
Health / legal / financial / coaching content
Affiliate links or sponsored content

== SECTION 4 — COMPLIANCE DETAILS ==
Auto-show these based on Section 3 checkboxes:
If analytics/pixel: 'GTM container ID?' [YES: show input / NO]
If payments: 'Payment processor?' [PayPlus/CardCom/Tranzila/Stripe/other]
If newsletter: 'Email platform?' [Mailchimp/ActiveCampaign/other]
Hosting provider and country: text input

== SECTION 5 — PROJECT SCOPE & TIMELINE ==
Project type: radio [new site / redesign / add features to existing]
Number of pages: dropdown [1-3 / 4-8 / 9-15 / 15+]
Desired launch date: date picker
Budget range: [₪2,000-5,000 / ₪5,000-10,000 / ₪10,000-20,000 / ₪20,000+]
Will you provide content (text + images)? [YES / NO — need copywriting]
Additional notes: large text area

== SMART COMPLIANCE SUMMARY (auto-generated on submit) ==
Based on Section 3 answers, show which prompts are needed:
Prompt 1 (Cookie Banner) — if analytics/pixel selected
Prompt 2 (Privacy Policy) — always required
Prompt 3 (Accessibility Widget) — always required
Prompt 4 (WCAG Baseline) — always required
Prompt 5 (Accessibility Statement) — always required
Prompt 6 (Freelancer Contract) — always required
Prompt 7 (Terms of Use) — always required
Prompt 8 (Refund Policy) — if payments selected
Prompt 9 (Disclaimer) — if health/legal/financial/affiliate selected
Prompt 10 (E-commerce Flow) — if online store selected
Prompt 11 (Email Marketing) — if newsletter selected
Prompt 12 (GDPR Layer) — if EU visitors selected

== ON SUBMIT ==
Show: 'Thank you! I'll review your answers and be in touch within 24 hours.'
Send form data to: [YOUR_EMAIL]
Subject: 'New Client Inquiry — [Business Name]'
Send client auto-reply confirming receipt

== DESIGN ==
Multi-step form (one section per step) with progress bar
Mobile responsive. [LANGUAGE] default with language toggle.
Professional branding (your name + color) in the header.

== OUTPUT ==
onboarding-form.html OR OnboardingForm.jsx + .css

---
## ✅ Verification Checklist

- All 5 sections present and logically ordered
- Section 3 checkboxes correctly trigger conditional questions in Section 4
- Smart Compliance Summary shows correct prompts based on Section 3 selections
- Form sends email to your address with correct subject line format
- Client receives auto-reply confirmation immediately on submit
- Progress bar shows current step and total steps
- Default language renders correctly (RTL for Hebrew/Arabic)
- Logo upload accepts PNG, SVG, and JPG formats
