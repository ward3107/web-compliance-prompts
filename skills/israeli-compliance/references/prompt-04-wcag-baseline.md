# 🌐 Full Site WCAG 2.0 AA Baseline Prompt

You are an accessibility engineer. Audit and fix this website so it
fully complies with WCAG 2.0 Level AA (IS 5568 — Israel).
A site fails IS 5568 if it misses even ONE of the 38 WCAG 2.0 AA criteria.

== SITE INFO ==
Framework: [FRAMEWORK]
Primary language: [PRIMARY_LANGUAGE]
Main colors: background [BG_COLOR] / text [TEXT_COLOR] / links [LINK_COLOR] / buttons [BUTTON_COLOR]

== LANGUAGE ==
Write every user-facing string you add or rewrite in [LANGUAGE] — skip-link
text, form labels, validation messages, ARIA labels and page titles.
If [LANGUAGE] is Hebrew or Arabic, set dir="rtl" and mirror the layout.
Also available: Hebrew, Arabic, English, Russian.

== FIXES TO IMPLEMENT (all 38 criteria, grouped by priority) ==

PERCEIVABLE
1. SKIP NAVIGATION LINK (2.4.1)
Add as first element inside <body>:
<a href="#main-content" class="skip-link">Skip to main content</a>
CSS: .skip-link { position:absolute; left:-9999px; }
.skip-link:focus { left:0; top:0; z-index:9999; background:#000; color:#fff; padding:10px; }
Add id="main-content" to your <main> element

2. ALT TEXT AUDIT (1.1.1)
Every <img> must have alt attribute:
- Informative images: alt="descriptive text"
- Decorative images: alt="" (empty string, NOT missing)
- Icon buttons: alt="[what the button does]"
- Logo: alt="[Company name] logo"

3. COLOR CONTRAST (1.4.3)
Normal text: minimum 4.5:1 contrast ratio
Large text (18pt+ or 14pt bold+): minimum 3:1
Fix any failing pairs by darkening text or lightening background

4. COLOR NOT ONLY INDICATOR (1.4.1)
Form validation errors: NOT just red border — add error icon + text
Required fields: NOT just asterisk color — add "(required)" text too
Links: NOT just different color from body text — add underline OR bold

5. TEXT RESIZE (1.4.4)
Remove any CSS that uses fixed pixel heights on text containers
Replace: height: 40px → min-height: 40px
Test: Ctrl+Plus 5 times in browser. No content clipped or hidden.

OPERABLE
6. KEYBOARD ACCESS (2.1.1)
Every interactive element must be keyboard reachable via Tab
Custom components (divs used as buttons): add tabindex="0"
and keyboard event listeners for Enter and Space

7. NO KEYBOARD TRAP (2.1.2)
Modal dialogs: user must be able to Tab through all modal content
and close via Escape. Focus must NOT reach elements behind the modal.

8. UNIQUE DESCRIPTIVE PAGE TITLES (2.4.2)
Every page: <title>[Page Name] — [Site Name]</title>

9. LOGICAL FOCUS ORDER (2.4.3)
Tab order must follow visual reading order (top-to-bottom, LTR or RTL)
Remove any tabindex values greater than 0

10. DESCRIPTIVE LINK TEXT (2.4.4)
BAD: <a href="/pricing">Click here</a>
GOOD: <a href="/pricing">View our pricing plans</a>
Fix with visually-hidden text: <span class="sr-only"> about pricing</span>

11. VISIBLE FOCUS INDICATOR (2.4.7)
NEVER use: :focus { outline: none }
Add to CSS: :focus-visible { outline: 3px solid [BUTTON_COLOR]; outline-offset: 3px; }

UNDERSTANDABLE
12. PAGE LANGUAGE (3.1.1)
Set <html lang="he"> for Hebrew, lang="ar" for Arabic, lang="en" for English, lang="ru" for Russian

13. CONSISTENT NAVIGATION (3.2.3)
Navigation menu must appear in same location on all pages

14. FORM ERROR IDENTIFICATION (3.3.1)
Error must NAME the field: "Email: please enter a valid email address"
Use aria-describedby to link input to its error message

15. VISIBLE FORM LABELS (3.3.2)
Every input needs a <label> element with for="input-id"
Placeholder text is NOT a label substitute
CSS .sr-only: { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0; }

ROBUST
16. VALID HTML (4.1.1)
No duplicate IDs on any page. All tags properly nested and closed.
Run: validator.w3.org to check

17. ARIA ON CUSTOM COMPONENTS (4.1.2)
Burger menu: role="button", aria-expanded, aria-controls
Accordion: role="button", aria-expanded on trigger; role="region", aria-labelledby on content
Tabs: role="tablist", role="tab", role="tabpanel", aria-selected
Modal: role="dialog", aria-modal="true", aria-labelledby="modal-title"

== HEADING STRUCTURE ==
One <h1> per page. Headings in order: h1 → h2 → h3 (never skip levels)
Never use headings just for visual size — use CSS classes instead

== OUTPUT ==
List every fix made with: file name, line number, what was wrong, what was fixed
If nothing needs fixing in a category: state "Pass: [criterion name]"
At end: provide a WCAG 2.0 AA Compliance Summary showing Pass/Fail for each criterion

---
## ✅ Verification Checklist

- Tab through entire page with keyboard only. You can reach every button, link, and form field.
- Inspect every <img> in DevTools. All have alt attribute (even if empty string).
- Every form input has a <label> with matching for= attribute.
- Test with WebAIM Contrast Checker: paste foreground and background hex. All pass 4.5:1.
- Validator.w3.org shows 0 errors for each page.
- <html> tag has correct lang attribute for page language.
