# 🇪🇺 GDPR Notice Layer — Deep Version

You are a legal-tech developer. Add a GDPR COMPLIANCE LAYER to an
existing Israeli website that already has Amendment 13 compliance.
This is an ADD-ON — do not replace existing pages, only supplement them.

== PROJECT INFO ==
Framework: [FRAMEWORK]
Website name: [WEBSITE_NAME]
Shows EU prices or EU-language content: [EU_PRICES]
Ships to EU: [EU_SHIPPING]
Privacy contact email: [CONTACT_EMAIL]
Brand primary color: [BRAND_COLOR]
Existing privacy policy URL: [PRIVACY_POLICY_URL]
Cookie banner already built (Prompt 1): [COOKIE_BANNER_BUILT]

== PART 1 — EU USER DETECTION ==
Detect EU visitors via browser locale or IP geolocation.
If EU detected: show GDPR-enhanced UI (Parts 2 and 3).
If not EU: show standard Amendment 13 UI.

== PART 2 — GDPR COOKIE BANNER ENHANCEMENT ==
Add to existing cookie banner (Prompt 1 output):
'For EU users, this site processes data under GDPR.
Legal basis: Consent (Article 6(1)(a)) for analytics and marketing.'
Add 'Do Not Sell or Share My Data' toggle (Article 21 right to object).

== PART 3 — GDPR ADDENDUM TO PRIVACY POLICY ==
Add a 'For EU/EEA Residents' section with:
Legal basis for each processing activity (Article 6)
Right to data portability (Article 20) — export as JSON/CSV
Right to restrict processing (Article 18)
Right to complain to supervisory authority
International transfer safeguard: Standard Contractual Clauses (SCC)

== PART 4 — DATA SUBJECT REQUEST PORTAL ==
Simple form for EU users:
Request type: [Access / Correction / Deletion / Portability / Restriction]
Email for response
Note: 'We may ask for ID to verify your request'
Response time: 30 days (extendable to 90 days for complex requests)
Submits to [CONTACT_EMAIL] with auto-confirmation to user

== OUTPUT ==
gdpr-detection.js
gdpr-addendum.html (EU section to insert into privacy policy)
gdpr-request-form.html / React component

---
## ✅ Verification Checklist

- EU detection works (test: set browser to en-GB locale)
- GDPR banner enhancement only shows to EU-detected users
- 'Do Not Sell or Share My Data' toggle present for EU users
- Privacy Policy addendum covers Articles 6, 17, 18, 20, 21
- Data portability offers actual download (JSON or CSV)
- Data subject request form sends to correct email
- Standard Contractual Clauses mentioned for international transfers
- ⚠️ If site fully targets EU: a full GDPR audit by an EU/Israeli DPO is recommended
