# 📧 Email Marketing Compliance — Deep Version

You are a senior frontend developer. Build a COMPLIANT EMAIL MARKETING
OPT-IN SYSTEM satisfying Israel's Computer Law 5755-1995
and GDPR Article 6 (for EU contacts).

== PROJECT INFO ==
Framework: [FRAMEWORK]
Email platform: [EMAIL_PLATFORM]
Website name: [WEBSITE_NAME]
Contact email: [CONTACT_EMAIL]
Brand primary color: [BRAND_COLOR]
Newsletter: [NEWSLETTER]
Promotional offers: [PROMO_OFFERS]
Product updates: [PRODUCT_UPDATES]
Has EU subscribers: [EU_SUBSCRIBERS]

== OPT-IN FORM ==
Fields: Email (required), First name (optional)
Consent checkbox (mandatory, unchecked by default):
'I agree to receive [list name] from [WEBSITE_NAME]. I can unsubscribe anytime.'
Separate checkboxes for each list type if multiple selected above.
Do NOT pre-tick any checkbox. Ever.

== DOUBLE OPT-IN FLOW ==
On submit: send confirmation email with verify link
Subject: 'Please confirm your subscription — [WEBSITE_NAME]'
Only add to list AFTER confirmation click.
Store: email, signup timestamp, IP, confirmation timestamp

== UNSUBSCRIBE REQUIREMENTS ==
Every marketing email must have a ONE-CLICK unsubscribe link.
Clicking: immediately remove from list, show confirmation page.
Do NOT ask 'why are you unsubscribing?' BEFORE completing the action.
Process unsubscribes within 10 business days (Israeli law).

== IF EU SUBSCRIBERS == (include only if EU_SUBSCRIBERS = YES)
Add GDPR consent language: 'Legal basis: Consent (Article 6(1)(a) GDPR)'
Include right to withdraw consent and right to data portability.

== OUTPUT ==
opt-in-form.html / React component
confirmation-email.html (inline CSS)
unsubscribe-page.html / React component

---
## ✅ Verification Checklist

- Consent checkbox is unchecked by default with specific list-name language
- Separate checkboxes used for each different list type
- Double opt-in confirmation email sent before adding to list
- Consent record stores: email, timestamp, IP, source, confirmation time
- Unsubscribe is one-click and takes effect immediately
- Unsubscribe does NOT ask reason BEFORE completing the action
- GDPR section present only if EU subscribers = YES
- ⚠️ Transactional emails do not need marketing consent — keep those lists separate
