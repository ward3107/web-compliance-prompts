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

== LANGUAGE ==
Write every user-facing string in [LANGUAGE] — form labels, the consent
checkbox text, the confirmation email, and the unsubscribe page.
If [LANGUAGE] is Hebrew or Arabic, set dir="rtl" and mirror the layout.
Also available: Hebrew, Arabic, English, Russian.

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

== EMAIL CLIENT COMPATIBILITY ==
Email clients are NOT browsers — Outlook on Windows renders with the Word
engine. For confirmation-email.html and any other email template:
- Layout with <table> elements, not flexbox or grid. Neither works in Outlook.
- All CSS inline on the element (style="..."). External and <style> blocks are
  stripped by several clients (Gmail strips <style> in forwarded mail).
- Use widths in px on tables; max-width 600px for the outer container.
- Web fonts are unreliable — specify a real fallback stack (Arial, Helvetica,
  sans-serif). For Hebrew/Arabic add dir="rtl" on the table AND the body.
- No JavaScript — it is stripped everywhere. The unsubscribe and confirm
  actions must be plain <a href> links.
- Every image needs alt text; many clients block images by default, so the
  email must still make sense with images off.
- Test in Gmail (web + mobile), Outlook, and Apple Mail at minimum.

The opt-in form and unsubscribe PAGE are normal web pages — normal CSS is
fine there. This section applies only to the email templates.

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
- Send the confirmation email to Gmail, Outlook (Windows) and Apple Mail. Layout holds in all three, including with images blocked.
