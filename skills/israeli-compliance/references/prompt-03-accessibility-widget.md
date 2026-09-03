# ♿ Accessibility Widget — Deep Version

You are a senior frontend accessibility engineer. Build a complete
ACCESSIBILITY WIDGET that complies with Israel's IS 5568 standard and
WCAG 2.0 AA. The widget itself must be fully accessible.

== PROJECT INFO ==
Framework: HTML/CSS/JS (plain, no dependencies, works on any project)
Widget position: bottom, inset-inline-end (bottom-right in LTR, bottom-left in RTL)
Brand color: AUTO-DETECT from the page (scan buttons, links, headers, nav for the first colorful computed color; fallback to #2563EB)

== TRIGGER BUTTON ICON ==
Use the official international accessibility SVG icon (the dynamic wheelchair user symbol) as the trigger button icon. Do NOT use text or emoji. Embed the SVG inline inside the button. The SVG should be white on the brand-colored background. The icon should be clean, recognizable, and sized at 28x28px inside the 52x52px button.

Use this exact SVG path for the accessibility icon:
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="28" height="28" aria-hidden="true" focusable="false">
  <circle cx="12" cy="3" r="2"/>
  <path d="M19 13h-4l-2-5H9a2 2 0 0 0-2 2v1h2v-1h2.5l2 5H17l1 4h2l-1-5zM9 17.5A3.5 3.5 0 1 1 5.5 14H7v-2H5.5A5.5 5.5 0 1 0 11 17.5H9z"/>
</svg>

== DISMISS BUTTON ==
Do NOT place a separate rectangular "Hide widget" button below the trigger. Instead, place a small "× Hide" button INSIDE the panel footer area, styled as a subtle text link (not a rectangle). On click: sessionStorage.setItem('a11yDismissed', '1') then close everything. On page init: if sessionStorage.getItem('a11yDismissed') === '1', skip rendering the widget entirely.

== BRAND COLOR AUTO-DETECTION ==
On init, scan these selectors in order: button:not([class*="a11y"]), a, header, nav, .btn, [class*="btn"], [class*="button"], [class*="primary"], [class*="brand"], h1, h2
For each element check getComputedStyle backgroundColor then color. Convert to hex.
Skip near-black (lightness < 0.1), near-white (lightness > 0.92), and near-grey (saturation < 0.25).
Use the first colorful result.
Inject into CSS variables: --a11y-brand: [detected color] --a11y-brand-dark: [detected color darkened by 25%]

== TRIGGER BUTTON ==
- Fixed position at the bottom inset-inline-end corner, 52x52px circular button.
  Use inset-inline-end, NOT right, so the widget mirrors correctly on RTL (Hebrew/Arabic) sites.
  The panel must anchor to the same side as the trigger.
- Background: color-mix(in srgb, var(--a11y-brand) 50%, transparent) — becomes solid on hover/focus
- Smooth box-shadow pulse animation on idle to draw attention
- role="button", aria-expanded="false/true", aria-controls="a11y-panel"
- aria-label="Open accessibility tools" / "Close accessibility tools"
- Min 44x44px touch target

== PANEL ==
- id="a11y-panel", role="dialog", aria-modal="true", aria-labelledby="a11y-panel-title"
- Panel title: <h2 id="a11y-panel-title">כלי נגישות / Accessibility</h2>
- Close button (×) inside panel header top-right corner: id="a11y-close", styled as a round icon button, NOT a rectangle. aria-label="Close accessibility panel"
- On Escape key or outside click: close panel, return focus to trigger button
- Link at bottom: "Accessibility Statement" → /accessibility-statement
- Below that: a subtle small "× Hide widget for this session" text link (the dismiss button)
- Tab key must cycle only within the panel when open (focus trap). Shift+Tab cycles backwards.

== WCAG COMPLIANCE FOR THE WIDGET ITSELF ==
1.4.3: All text in panel has 4.5:1 contrast ratio minimum
2.1.1: Fully keyboard operable (Tab, Enter, Space)
2.1.2: NO keyboard trap — Escape closes panel and returns focus to trigger
2.4.3: Focus moves to first element inside panel on open; returns to trigger on close
2.4.7: Visible focus ring on every interactive element (3px solid brand color, never suppress)
4.1.2: Every button has role="button", aria-label, aria-pressed. Panel has role="dialog", aria-modal="true", aria-labelledby="a11y-panel-title"

== ARIA LIVE REGION ==
Include a visually-hidden <div id="a11y-live" aria-live="polite" aria-atomic="true">
Update this div with announcements when any feature is toggled.

== THE 10 FEATURES (all required, all must actually work) ==

FEATURE 1 — FONT SIZE CONTROL
Show percentage (50%–200%), NOT px. A− button: aria-label="Decrease font size" A+ button: aria-label="Increase font size"
MIN=50, MAX=200, STEP=10. Default starting value: fontPercent = 100
actualPx = (fontPercent / 100) * 16
document.documentElement.style.setProperty('--base-font-size', actualPx + 'px')
Disable A− at 50, disable A+ at 200. Announce: "Text size set to [X] percent"

FEATURE 2 — HIGH CONTRAST
Adds class "a11y-contrast" to <body>
body.a11y-contrast { background:#000!important; color:#FFFF00!important; }
body.a11y-contrast a { color:#00FFFF!important; }
body.a11y-contrast * { border-color:#FFFF00!important; }
Panel itself must remain readable in contrast mode.
Announce: "High contrast mode enabled/disabled"

FEATURE 3 — GRAYSCALE
Adds class "a11y-gray" to <html>
html.a11y-gray { filter: grayscale(100%); }
Announce: "Grayscale mode enabled/disabled"

FEATURE 4 — UNDERLINE LINKS
Adds class "a11y-links" to <body>
body.a11y-links a { text-decoration:underline!important; }
Announce: "Underline links enabled/disabled"

FEATURE 5 — READABLE FONT
Adds class "a11y-font" to <body>
body.a11y-font, body.a11y-font * { font-family: Arial, Helvetica, sans-serif !important; }
Announce: "Readable font enabled/disabled"

FEATURE 6 — LETTER SPACING
Adds class "a11y-spacing" to <body>
body.a11y-spacing, body.a11y-spacing * { letter-spacing: 0.15em !important; }
Announce: "Letter spacing enabled/disabled"

FEATURE 7 — LINE HEIGHT
Adds class "a11y-lh" to <body>
body.a11y-lh p, body.a11y-lh li, body.a11y-lh span { line-height: 2.0 !important; }
Announce: "Increased line height enabled/disabled"

FEATURE 8 — PAUSE ANIMATIONS
Injects <style id="a11y-no-anim">:
*, *::before, *::after { animation-play-state:paused!important; transition-duration:0.001ms!important; }
On toggle off: remove the style tag.
Announce: "Pause animations enabled/disabled"

FEATURE 9 — HIGHLIGHT ON HOVER/FOCUS
Adds class "a11y-highlight" to <body>
body.a11y-highlight *:hover, body.a11y-highlight *:focus { outline:3px solid var(--a11y-brand)!important; outline-offset:2px!important; }
Exclude widget itself from this effect.
Announce: "Highlight on hover and focus enabled/disabled"

FEATURE 10 — RESET ALL
Removes all a11y classes from <html> and <body>, removes all injected style tags,
resets --base-font-size to 16px, sets fontPercent back to 100, sets all aria-pressed to false,
clears localStorage key "a11ySettings", updates all UI elements to reflect default state.
Announce: "All accessibility settings have been reset"

== PERSISTENCE ==
Save to localStorage key "a11ySettings" as JSON:
{ fontPercent:100, contrast:false, grayscale:false, links:false, font:false, spacing:false, lineHeight:false, noAnim:false, highlight:false }
On page load: read and re-apply all settings BEFORE page renders using DOMContentLoaded.

== STATE MANAGEMENT ==
Use a single state object as source of truth. Every toggle mutates state, then calls applyState(state) and saveState(state). Never update the DOM directly without going through applyState.

== OUTPUT ==
Two files: accessibility-widget.js and accessibility-widget.css
Wrap all JS in an IIFE so zero globals are leaked.
Comment every feature clearly in the code.
At the top of the JS file show how to add to any page as a comment:
<link rel="stylesheet" href="accessibility-widget.css">
<script src="accessibility-widget.js" defer></script>

Default language for panel text: [LANGUAGE]

---
## ✅ Deep Verification Checklist

- Open widget. Press Escape — panel closes, focus returns to ♿ button
- Tab into panel. Tab through all 10 buttons — none trap focus
- Enable High Contrast. Use DevTools to check: body.a11y-contrast background is #000
- Enable feature. Check aria-pressed='true' in DevTools DOM
- Use a screen reader (or NVDA if Windows). Toggle a feature — hears announcement
- Enable all features. Reload page. All features restored immediately.
- Font Size A+ six times. Reaches 28px. A+ becomes disabled (no more increase).
