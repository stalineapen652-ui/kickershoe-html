# JS (Motion) Toggle — Design

## Purpose

Repurpose the floating "SFX ON/OFF" button (present on all 6 pages, currently
a non-functional placeholder — no audio is wired up) into a "JS ON / JS OFF"
toggle that freezes and resumes every animation, transition, and timed
JS-driven motion on the page.

## Behavior

- Default state on every fresh page load: **JS ON**, identical to today's
  live site — nothing changes unless the button is clicked.
- Click to **JS OFF**: every animation/transition site-wide stops and holds
  at its current frame — decorative loops (spore particles, hero glitch
  flicker, pulse dots, lore ticker swirl, shoe spin/float), scroll-triggered
  reveals (about-page tile fade-ins, shoe case-file callouts, issue-page
  panel reveals), all hover transitions (button/link color changes, image
  hover-zoom), the smooth-scroll easing on anchor links, and — on
  `index.html` only — the hero's autoplay slide rotation and per-panel
  image-cycling.
- Click back to **JS ON**: everything resumes.
- No persistence (confirmed with user): the choice is not saved anywhere: a
  reload or navigating to another page always starts at JS ON again, matching
  how the SFX button already behaves today.
- This is additive to, not a replacement for, the site's existing
  `prefers-reduced-motion` OS-level support — that stays untouched and keeps
  working independently for visitors who set it at the OS level.
- The loading screen's one-time spiral-draw animation (index.html only,
  gated by `sessionStorage`) is unaffected: it always finishes before the
  toggle button exists to be clicked, and since there's no persistence, no
  prior "off" state can carry into a fresh load.

## Technical approach

### Single source of truth

The button's click handler sets/removes one attribute:
`document.documentElement.setAttribute('data-motion', 'off')` — removed
entirely to mean "on" (so the CSS selector is simply
`html[data-motion="off"]`, with nothing to override for the on-state).

### CSS: blanket kill + targeted exceptions

In `styles.css`, add one blanket rule:

```css
html[data-motion="off"] { scroll-behavior: auto !important; }
html[data-motion="off"] *,
html[data-motion="off"] *::before,
html[data-motion="off"] *::after {
  animation: none !important;
  transition: none !important;
}
```

This alone is safe for every transition site-wide (a transition has no
"resting state" risk — killing it just makes the property change instant),
and safe for most `@keyframes` animations, **except** the handful of
components whose pre-animation resting state (`opacity: 0`, a `transform`
offset, or a `clip-path` inset) is set directly on the element alongside the
animation — not produced by the keyframe's own `0%`/`from` state. For those,
killing `animation` alone would freeze them permanently invisible/offset
instead of frozen-in-place-and-visible. Confirmed by reading every
`@keyframes` use in the stylesheet; the affected selectors are:

- `#shoe aside` (opacity/transform, `shoe-aside-pop`)
- `#lore > p:first-child > svg` (`clip-path`, `lore-band-reveal`)
- `#about li img`, `#about h1`, `#about > header > p:nth-of-type(2)`,
  `#about > header > nav` (opacity/transform, `about-tile-in` /
  `about-heading-in`)
- `main:has(> a:first-child) > section:nth-of-type(2) li img`,
  `li figure`, `li figure p span` (issue-page reveal — opacity/transform is
  keyframe-only here with no separate base value, but included for
  consistency with the existing `prefers-reduced-motion` block that already
  handles this same set)

Add one more rule right after the blanket kill, restoring these to their
resolved end-state:

```css
html[data-motion="off"] #shoe aside,
html[data-motion="off"] #lore > p:first-child > svg,
html[data-motion="off"] #about li img,
html[data-motion="off"] #about h1,
html[data-motion="off"] #about > header > p:nth-of-type(2),
html[data-motion="off"] #about > header > nav,
html[data-motion="off"] main:has(> a:first-child) > section:nth-of-type(2) li img,
html[data-motion="off"] main:has(> a:first-child) > section:nth-of-type(2) li figure,
html[data-motion="off"] main:has(> a:first-child) > section:nth-of-type(2) li figure p span {
  opacity: 1 !important;
  transform: none !important;
  clip-path: none !important;
}
```

(`clip-path: none` is a no-op for the selectors that don't use it — harmless
to include on all of them rather than splitting into two rules.)

The existing `@media (prefers-reduced-motion: reduce)` blocks are left
exactly as they are — this new attribute-based rule is independent and
additive, not a replacement.

### JS: making the hero reactive

`index.html`'s hero-slider script currently reads
`window.matchMedia('(prefers-reduced-motion: reduce)').matches` **once** into
a `reduceMotion` const at init, and only consults it when *starting* autoplay
or a panel's image-cycle. That's enough for the OS setting (fixed for the
page's lifetime) but not for a button that can be flipped mid-session.

Changes to that script:

1. Replace the `reduceMotion` const with a function
   `function motionOff() { return osReduceMotion || document.documentElement.getAttribute('data-motion') === 'off'; }`
   (renaming the matchMedia result to `osReduceMotion`), and use `motionOff()`
   in place of the old `reduceMotion` checks in `startAutoplay` and
   `startCycle`.
2. Track each panel's `stopCycle` function in an array as the `panels.forEach`
   loop builds them (currently local to each closure, not reachable from
   outside).
3. Listen for the toggle button's change:
   ```js
   document.addEventListener('kickershoe:motionchange', function (e) {
     if (e.detail.enabled) {
       startAutoplay();
     } else {
       stopAutoplay();
       stopCycles.forEach(function (fn) { fn(); });
     }
   });
   ```
   `stopCycle()` already resets the panel's image to frame 1 and clears its
   interval, so this also handles the case where a panel is mid-cycle (hovered
   or tapped open) at the moment the user switches JS off.

The button's own click handler (see below) dispatches
`document.dispatchEvent(new CustomEvent('kickershoe:motionchange', { detail: { enabled } }))`
on every click — a plain custom event on `document`, no shared module needed,
consistent with how the other inline scripts on this site stay independent
IIFEs.

### Button markup and label (all 6 pages)

Current (identical on every page):

```html
<button aria-label="Toggle ambient sound" aria-pressed="false">
  <span></span>
  <span>SFX OFF</span>
</button>
```

New:

```html
<button aria-label="Toggle animations" aria-pressed="true">
  <span></span>
  <span>JS ON</span>
</button>
```

- `aria-pressed="true"` by default (JS on), matching the "no changes unless
  clicked" behavior.
- Visible label says "JS ON"/"JS OFF" per your request; `aria-label` says
  "Toggle animations" — accurate for screen-reader users, since no
  JavaScript is actually being disabled, only visual motion.
- The existing pulsing-dot indicator CSS
  (`[aria-pressed="true"] > span:first-child { animation: pulse … }`) needs
  no changes — it already pulses only in the "on"/pressed state and sits
  still otherwise, which now maps onto "animations are running" instead of
  "sound is on."

The inline click-handler script (currently identical on all 6 pages) changes
from toggling `SFX ON`/`SFX OFF` text to toggling `JS ON`/`JS OFF`, setting/
removing `data-motion="off"` on `<html>`, and dispatching the custom event.

## Files touched

- `styles.css` — one new rule block (~20 lines), no changes to existing
  rules.
- `index.html`, `about.html`, `issue-001.html`, `issue-002.html`,
  `issue-003.html`, `404.html` — button markup + its inline script.
- `index.html` only, additionally — the hero-slider script (autoplay +
  per-panel image-cycling).

## Testing / verification plan

Manual verification in the browser preview (mobile + desktop), on
`index.html` (richest page — hero autoplay, spores, glitch, lore ticker,
shoe reveal) and spot-checked on one other page (e.g. `about.html`, whose
tile fade-ins are the trickiest exception case):

1. Load the page — confirm it looks and behaves exactly as it does today
   (JS ON by default, nothing regresses).
2. Click JS OFF — confirm: hero autoplay stops rotating, spore particles
   freeze, glitch/pulse effects stop, hovering a button/link/image no longer
   transitions (snaps instantly), the lore ticker and shoe callouts stay
   fully visible (not hidden), about-page tiles stay visible.
3. Click JS ON — confirm everything resumes, including hero autoplay
   picking back up.
4. Reload the page — confirm it resets to JS ON (no persistence).
5. Check the button's own dot indicator pulses only in the ON state.

## Explicitly out of scope

- No persistence (localStorage/sessionStorage) of the toggle choice —
  confirmed with user.
- No changes to the loading screen — always finishes before the button is
  interactive, per the "no persistence" behavior above.
- No changes to the header's scroll-position `[data-scrolled]` state
  toggle — that's a layout state, not motion; only the CSS *transition*
  between its two states is affected (already covered by the blanket
  transition kill).
- No actual ambient sound is being added — the button was already a
  non-functional placeholder; this repurposes it rather than implementing
  audio.
