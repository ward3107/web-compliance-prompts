# 📄 Privacy Policy Page — Deep Version

You are a legal-tech developer. Build a complete PRIVACY POLICY PAGE
that fully complies with Israel's Protection of Privacy Law (PPL),
Section 11 as amended by Amendment 13 (effective August 14, 2025),
and the PPA's July 2022 official notification guidelines.

== PROJECT INFO ==
Framework: [FRAMEWORK]
Business/website name: [BUSINESS_NAME]
Business type: [BUSINESS_TYPE]
Owner full name: [OWNER_NAME]
Business address: [BUSINESS_ADDRESS]
Privacy contact email: [CONTACT_EMAIL]
Website URL: [WEBSITE_URL]
Hosting provider + country: [HOSTING_PROVIDER]
Tools used:
  Google Analytics 4: [GA4]
  Google Ads: [GOOGLE_ADS]
  Facebook/Meta Pixel: [FB_PIXEL]
  Google Tag Manager: [GTM]
  Mailchimp: [MAILCHIMP]
  WhatsApp Business: [WHATSAPP]
  Contact form (sends email): [CONTACT_FORM]
Brand primary color: [BRAND_COLOR]

== REQUIRED STRUCTURE (all 13 sections — do not omit any) ==

SECTION 1 — INTRODUCTION & DATA CONTROLLER IDENTITY
Full business name, owner name, address, email
Date this policy was last updated: [TODAY]
Statement: "This policy is written in accordance with the
Protection of Privacy Law (PPL) 5741-1981 and Amendment 13
(effective August 14, 2025)."

SECTION 2 — WHAT DATA WE COLLECT
For each data type, state: what, how collected, and legal basis
a) Data you give us directly: Name, email, phone (via contact form or registration), Messages/inquiries
b) Data collected automatically: IP address (classified as personal data under Amendment 13), Browser type and version, Device type, Pages visited and time spent, Referring website URL
c) Data from third-party tools (list only those marked YES above)

SECTION 3 — PURPOSE AND LEGAL BASIS
For each purpose, state the legal basis (consent / legitimate interest):
- Responding to contact form submissions [legitimate interest]
- Analytics and website improvement [consent]
- Marketing and advertising [consent]
- Ensuring website security and preventing fraud [legitimate interest]

SECTION 4 — WHO RECEIVES YOUR DATA
List every recipient with their country (only tools marked YES above).
State clearly: "We do not sell your personal data to any third party."

SECTION 5 — INTERNATIONAL DATA TRANSFERS
State that some providers are in the USA. Explain the safeguard: Standard Contractual Clauses (SCC) or Privacy Shield equivalent.

SECTION 6 — DATA RETENTION PERIODS
Contact form data: 24 months or until request to delete
Analytics data: as per Google's policy (14 months default)
Marketing data: until you unsubscribe or request deletion
Server logs (IP addresses): 90 days

SECTION 7 — CONSEQUENCES OF NOT PROVIDING DATA (MANDATORY under Section 11)
"Providing your name and email in the contact form is voluntary.
However, if you do not provide them, we cannot respond to your inquiry."
"You can decline analytics and marketing cookies. The website
will still function fully — only tracking features will be disabled."

SECTION 8 — YOUR RIGHTS UNDER ISRAELI LAW
Right of access, correction, deletion, objection to direct marketing, withdraw consent.
How to exercise: email [CONTACT_EMAIL] with subject "Privacy Rights Request"
Response time: within 30 days

SECTION 9 — RIGHT TO COMPLAIN TO THE PPA
"If you believe your privacy rights have been violated, you have the
right to file a complaint with the Privacy Protection Authority (PPA):"
Address: 66 Kanfei Nesharim St., Jerusalem, Israel
Website: gov.il/en/departments/the_privacy_protection_authority

SECTION 10 — COOKIES
Explain 3 categories (Necessary, Analytics, Marketing)
Link to cookie banner to change preferences: [WEBSITE_URL]#cookie-preferences

SECTION 11 — AUTOMATED DECISION-MAKING AND AI
State: "We do not make automated decisions that significantly affect you based on your personal data."

SECTION 12 — DATA SECURITY
HTTPS/SSL encryption in transit. Access controls. Data breach procedure:
notify affected users and the PPA within 72 hours of discovery.

SECTION 13 — POLICY UPDATES
We may update this policy. Last updated date shown at top.
Material changes will be communicated via email or prominent notice.

== LANGUAGE ==
Default: [LANGUAGE] (RTL if Hebrew or Arabic). Also available: Hebrew, Arabic, English, Russian.
Language switcher at top. Each language is a complete translation.

== DESIGN ==
- Sticky table of contents sidebar (desktop)
- Each section has anchor ID for cookie banner to link to (#cookies)
- Reading time estimate at top: "~ 4 minute read"
- Last updated date prominent at very top
- Mobile: TOC collapses to dropdown
- Brand color for headings

== OUTPUT ==
privacy-policy.html (HTML) OR PrivacyPolicy.jsx + .css (React)
Comment at top: "Compliant with PPL Section 11 + Amendment 13 + PPA 2022 guidelines"

---
## ✅ Verification Checklist

- All 13 sections present. Section 7 (consequences) is specifically there.
- PPA address is listed: 66 Kanfei Nesharim St., Jerusalem
- Each third-party tool listed with their country (USA, etc.)
- Retention period for each data type is specified
- 'We do not sell your personal data' is explicitly stated
- Contact email links to correct address
- Default language renders correctly (RTL for Hebrew/Arabic)
