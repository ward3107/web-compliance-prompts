# 🍪 Cookie Banner — Deep Version

You are a senior frontend developer. Build a PRODUCTION-READY COOKIE
CONSENT BANNER that integrates with Google Tag Manager Consent Mode v2
and complies with the consent rules of [JURISDICTIONS].

== LEGAL BASIS BY JURISDICTION ==
Read the requirements from the matching jurisdictions/*.yaml pack. In short:
- Israel: Privacy Protection Law + Amendment 13 (in force 14 Aug 2025).
  Opt-in — explicit, granular, documented consent.
- EU/EEA: the banner is required by the ePrivacy Directive 2002/58/EC
  Article 5(3) — NOT by the GDPR. Article 5(3) demands prior informed consent
  before storing or accessing ANY information on the device, cookies or not
  (localStorage, fingerprinting and SDK identifiers all count). The GDPR then
  defines what valid consent is (Art. 4(11) and Art. 7). Strictly necessary
  storage is exempt. Reject must be as easy as Accept.
- California (CCPA/CPRA): opt-OUT model — show a "Do Not Sell or Share My
  Personal Information" control rather than a prior-consent gate.

If the site serves several of these, detect the visitor's region and apply the
STRICTER model to them: opt-in for EU/Israel visitors, opt-out control for
California. Never apply opt-out globally — that breaches ePrivacy.

== PROJECT INFO ==
Framework: [FRAMEWORK]
Website name: [WEBSITE_NAME]
Privacy policy URL: [PRIVACY_POLICY_URL]
Contact email: [CONTACT_EMAIL]
Brand primary color: [BRAND_COLOR]
Uses Google Analytics 4? [GA4]
Uses Google Ads? [GOOGLE_ADS]
Uses Facebook/Meta Pixel? [FB_PIXEL]
Uses Mailchimp or email marketing? [MAILCHIMP]
GTM Container ID: [GTM_ID]

== BROWSER SUPPORT ==
Target the current versions of Chrome, Edge, Safari, Firefox, Samsung Internet
and Opera, on desktop and mobile. Note there are only three engines: Blink
(Chrome, Edge, Opera, Samsung Internet), WebKit (Safari, and every browser on
iOS) and Gecko (Firefox) — so test one browser per engine.

Rules:
- Progressive enhancement: never let a newer CSS feature be the ONLY declaration
  for something load-bearing (a background, a position, a size). Declare a widely
  supported fallback first, then the enhanced version on the next line.
- Do not rely on color-mix(), :has(), @container, popover or <dialog> unless you
  also provide a fallback that works without them.
- Safe to use without fallback: CSS custom properties, flexbox, grid,
  :focus-visible, inset-inline-*, localStorage/sessionStorage, filter.
- Test keyboard and screen-reader behaviour on both a Blink and a WebKit browser.

== CONSENT MODE V2 INTEGRATION ==
Before GTM loads, inject this default consent state in <head>:
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 2000
});

When user accepts/saves preferences, call:
gtag('consent', 'update', {
  analytics_storage: analyticsAccepted ? 'granted' : 'denied',
  ad_storage: marketingAccepted ? 'granted' : 'denied',
  ad_user_data: marketingAccepted ? 'granted' : 'denied',
  ad_personalization: marketingAccepted ? 'granted' : 'denied'
});

AND push to dataLayer for GTM tag triggers:
window.dataLayer.push({
  event: 'cookie_consent_update',
  consent_analytics: analyticsAccepted,
  consent_marketing: marketingAccepted
});
(Facebook Pixel in GTM fires on this event when consent_marketing=true)

== IF USER PREVIOUSLY CONSENTED (page reload) ==
On page load: read localStorage 'cookieConsent' key.
If it exists AND is not expired (check timestamp < 12 months):
  Immediately call gtag('consent','update') with saved values
  Do NOT show banner again
If expired or not found: show banner, all defaults denied

== AMENDMENT 13 CONSENT REQUIREMENTS ==
- EXPLICIT: user must click a button — no implied consent
- GRANULAR: 3 separate toggles (Necessary, Analytics, Marketing)
- DOCUMENTED: save to localStorage with:
  { version: "1.0", analytics: bool, marketing: bool,
    timestamp: ISO string, language: "he", expires: 12 months from now }
- INFORMED: each category explains what it collects and who receives it
- Necessary cookies: always ON, locked, cannot toggle
  Explain: "Required for the site to function. No personal data shared."
- Analytics: OFF by default
  Explain: "Google Analytics — page views, session duration. Data sent to
  Google servers. No personally identifiable data. Used to improve the site."
- Marketing: OFF by default
  Explain: "Facebook Pixel, Google Ads — used to show you relevant ads.
  Data shared with Meta and Google for ad targeting and conversion tracking."

== 4 LANGUAGES ==
All text in [LANGUAGE] as the default language, plus Hebrew (he, RTL), Arabic (ar, RTL),
English (en, LTR), Russian (ru, LTR).
Auto-detect from navigator.language. Show language switcher (2-letter codes).
RTL: flip entire banner direction with dir attribute and CSS.

== UI ==
- Fixed bottom, full width, high z-index
- Accept All / Reject All / Customize buttons
- Customize: expand panel with 3 toggle switches + descriptions
- Save Preferences button in expanded panel
- Link to privacy policy page
- Mobile responsive — stack buttons on small screens
- Keyboard accessible: Tab, Enter, Space work on all buttons
- ARIA: role="dialog", aria-label="Cookie consent", aria-live="polite"

== OUTPUT ==
Add clear code comment at top:
"Cookie Consent — Amendment 13 compliant — GTM Consent Mode v2
Signals: analytics_storage, ad_storage, ad_user_data, ad_personalization
Built: [TODAY'S DATE]"

If HTML/CSS/JS: cookie-banner.html + cookie-banner.css + cookie-banner.js
If React: CookieBanner.jsx + CookieBanner.css + show App.jsx import
Show the 3-line GTM head snippet placement separately.

---
## ✅ Deep Verification Checklist

- Open browser DevTools → Console. On page load, type: dataLayer — find object with consent defaults all 'denied'
- Click Accept All. Type dataLayer again — find consent update with analytics/ad signals all 'granted'
- Reload page. Consent banner does NOT appear. DevTools → dataLayer shows consent restored from localStorage
- Wait 13 months simulation: change localStorage timestamp to 13 months ago, reload. Banner reappears.
- Switch to Hebrew/Arabic. Layout flips RTL. Language choice saved to localStorage.
- Click Reject All. Only Necessary = true in localStorage. All 4 GTM signals = 'denied'.
- Tab through with keyboard only. All 3 toggles and all 3 buttons focusable with visible focus ring.
- Open the banner in one Blink browser (Chrome/Samsung Internet), one WebKit (Safari/any iOS browser) and Firefox. Buttons, toggles and RTL layout look correct in all three.
