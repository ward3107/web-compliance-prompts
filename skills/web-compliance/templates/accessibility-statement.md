# 📋 Accessibility Statement Page — IS 5568

Build a complete ACCESSIBILITY STATEMENT PAGE (הצהרת נגישות)
as required by Israel's IS 5568 standard (Equal Rights for Persons
with Disabilities Law, 1998).

== PROJECT INFO ==
Framework: [FRAMEWORK]
Website name: [WEBSITE_NAME]
Business owner/coordinator name: [COORDINATOR_NAME]
Coordinator email: [COORDINATOR_EMAIL]
Coordinator phone: [COORDINATOR_PHONE]
Website URL: [WEBSITE_URL]
Last accessibility review date: [REVIEW_DATE]
WCAG compliance level: WCAG 2.0 Level AA (IS 5568)
Brand color: [BRAND_COLOR]

== REQUIRED SECTIONS ==

1. OUR COMMITMENT
"[WEBSITE_NAME] is committed to making our website accessible to all users,
including people with disabilities, in accordance with Israel's
Equal Rights for Persons with Disabilities Law (1998) and
Israeli Standard IS 5568 (based on WCAG 2.0 Level AA)."

2. COMPLIANCE LEVEL
"This website conforms to WCAG 2.0 Level AA as required by IS 5568."
Date of last accessibility review: [REVIEW_DATE]
Date of next scheduled review: [12 months from last review]

3. IMPLEMENTED ACCESSIBILITY FEATURES
List all features in use:
✓ Accessibility widget with 10 tools (font size, contrast, etc.)
✓ Skip to main content navigation link
✓ Proper heading hierarchy (H1 → H2 → H3)
✓ Alt text on all images
✓ Keyboard navigation for all interactive elements
✓ Visible focus indicators on all focusable elements
✓ Descriptive link text
✓ Visible labels on all form fields
✓ Color contrast meeting 4.5:1 minimum ratio
✓ Language attribute declared on HTML element
✓ ARIA attributes on custom interactive components
✓ No content flashing more than 3 times per second

4. KNOWN LIMITATIONS
"No known accessibility limitations at this time."

5. ACCESSIBILITY COORDINATOR CONTACT
Name: [COORDINATOR_NAME]
Role: Accessibility Coordinator
Email: [COORDINATOR_EMAIL] (clickable mailto link)
Phone: [COORDINATOR_PHONE]
Response time: Within 5 business days

6. HOW TO REPORT AN ACCESSIBILITY BARRIER
"If you encounter any accessibility barrier on our website,
please contact us at [COORDINATOR_EMAIL]. Please describe:
- The page or feature where you encountered the issue
- The type of assistive technology you use (if any)
- A description of the barrier
We will respond within 5 business days and strive to resolve
the issue as quickly as possible."

7. CONTINUOUS IMPROVEMENT
"We are committed to continuously improving the accessibility
of our website. We conduct annual accessibility audits and
implement improvements on an ongoing basis. Your feedback
helps us improve for everyone."

== DESIGN ==
Default: [LANGUAGE]. Language switcher for Hebrew, Arabic, English, Russian.
Coordinator contact in highlighted box.
Footer link back to homepage. Mobile responsive.

== LINKING REQUIREMENTS ==
This page MUST be linked from:
1. Website footer (required by IS 5568)
2. Inside the accessibility widget panel ("Accessibility Statement" link)

== ACCESSIBILITY STANDARD TARGET ==
Build to the HIGHER of the standards that apply to [JURISDICTIONS]:
- Israel (IS 5568)              -> WCAG 2.0 Level AA
- EU (EAA / EN 301 549)         -> WCAG 2.1 Level AA
- UK, US Section 508, Canada    -> WCAG 2.1 Level AA (verify per contract)

WCAG 2.1 AA is a strict superset of 2.0 AA, so building to 2.1 satisfies
IS 5568 as well. Default to 2.1 AA unless the client serves Israel only.

The 2.1 additions that matter most beyond 2.0 AA:
- 1.3.4 Orientation — do not lock to portrait or landscape
- 1.3.5 Identify Input Purpose — autocomplete attributes on personal-data fields
- 1.4.10 Reflow — usable at 320px wide with no horizontal scrolling
- 1.4.11 Non-text Contrast — 3:1 for UI components, icons and focus indicators
- 1.4.12 Text Spacing — no clipping when users override spacing
- 1.4.13 Content on Hover or Focus — dismissible, hoverable, persistent
- 2.5.1 Pointer Gestures / 2.5.2 Pointer Cancellation
- 2.5.3 Label in Name — visible label text must be in the accessible name
- 2.5.4 Motion Actuation

---
## ✅ Verification Checklist

- Page linked from footer AND from accessibility widget panel
- Coordinator email is a clickable mailto: link
- Review date is present and is not more than 12 months old
- Section 3 lists all actual features that were implemented
- Default language renders correctly (RTL for Hebrew/Arabic)
