# Hero Slider: Four-Story Panel Slide — Design

## Purpose

`index.html`'s hero (`#origin`) currently shows a single static design: the
"MANTIS ORIGIN" headline and teaser. This adds a second hero slide — a
4-panel "story chooser" in the visual language of the reference mood board
(vertical color-striped panels) — and turns `#origin` into a two-slide
slider. Slide 1 (the existing headline hero) is left completely unchanged.
Slide 2 surfaces all four KICKERSHOE stories (the three published issues
plus the upcoming Issue 004) as full-height vertical panels that expand on
hover to preview cycling comic pages and a "read" CTA.

## Constraints carried from the existing codebase

- **No `div`/`class`/`id`** except pre-existing anchor ids (`#origin`,
  `#issues`, etc.) — the site was deliberately rewritten to fully semantic
  HTML (commit `582ed74`). All new markup must follow this.
- **Vanilla JS only**, in the same inline `<script>` style already used at
  the bottom of `index.html` (sound toggle, newsletter form). No build step,
  no framework.
- **`:has()` is already relied on** elsewhere (`main:has(> a:first-child)`
  scoping on issue pages), so using it here for the hover-accordion is
  consistent with the existing browser-support bar.
- **`[hidden] { display: none !important; }`** is already a global rule —
  reuse it for slide switching rather than inventing a new hide mechanism.
- Existing design tokens only: `--bg`, `--ink`, `--bone`, `--primary`,
  `--secondary`, `--gold`, `--purple`, `--font-display` (Anton),
  `--font-mono` (JetBrains Mono).

## Markup structure

```html
<section id="origin">
  <header>
    <!-- existing slide 1 content — untouched -->
  </header>

  <article hidden>
    <p>// THE UNIVERSE</p>
    <ul>
      <li>
        <img src="assets/images/issue-001/1friends.webp" alt="…">
        <data value="01">01</data>
        <h3>THE MANTIS ORIGIN</h3>
        <p>A shoe born from a broken leg and a quiet vow.</p>
        <a href="issue-001.html"><span>READ ISSUE 001</span><span>→</span></a>
      </li>
      <li>
        <img src="assets/images/issue-002/1dribble.webp" alt="…">
        <data value="02">02</data>
        <h3>THE ELEPHANT IN THE ROOM</h3>
        <p>Too big for the pitch. Too fast to ignore.</p>
        <a href="issue-002.html"><span>READ ISSUE 002</span><span>→</span></a>
      </li>
      <li>
        <img src="assets/images/issue-003/1locker.webp" alt="…">
        <data value="03">03</data>
        <h3>THE GOAT OG</h3>
        <p>Locker room legend. Undisputed. Unbothered.</p>
        <a href="issue-003.html"><span>READ ISSUE 003</span><span>→</span></a>
      </li>
      <li>
        <img src="assets/images/covers/cover-004.webp" alt="…">
        <data value="04">04</data>
        <h3>TUNNEL OF GHOSTS</h3>
        <p>The next chapter is still being inked.</p>
        <span>COMING SOON</span>
      </li>
    </ul>
  </article>

  <nav aria-label="Hero slides">
    <button aria-current="true"><span aria-hidden="true"></span><span>Slide 1</span></button>
    <button aria-current="false"><span aria-hidden="true"></span><span>Slide 2</span></button>
  </nav>
</section>
```

Notes:
- The `<article>` is a sibling of the existing `<header>`, not a wrapper
  around it — slide 1's markup and every `#origin > header ...` CSS rule
  are untouched.
- Panels reuse the same shape as `#issues` cards (`<data>`, `<h3>`, footer
  text, `<a>`), so slide 2 reads as a remix of an existing component, not a
  new visual language.
- One hidden, `aria-hidden="true"` inline `<svg>` holding the
  `feTurbulence`/`feDisplacementMap` filter definition lives at the top of
  the `<article>` (referenced by the divider's `filter:` CSS, described
  below).

## CSS behavior

- `#origin > article` is `position: absolute; inset: 0;` inside `#origin`
  (already `position: relative`), so it goes full-bleed edge-to-edge
  regardless of `#origin`'s padded/centered grid built for the headline.
- `#origin > article > ul` is `display: flex; height: 100%;` with each
  `<li>` `flex: 1 1 0%; transition: flex-grow .5s cubic-bezier(...)`.
  `#origin > article:has(li:hover) li:not(:hover) { flex: 0.5 1 0%; }`
  grows the hovered panel and shrinks the rest to slivers (not full
  takeover) — matches the approved "accordion" behavior.
- Divider: `li:not(:last-child)::after` — a thin `background: var(--bone)`
  sliver on the trailing edge, `filter: url(#hero-ink-wobble)` for the
  hand-drawn scratch look. Pure pseudo-element, no extra markup.
- Panel `<img>` is full-bleed cover with a bottom gradient scrim (same
  gradient math as `#issues article::after`). Title/blurb/CTA are
  positioned at the bottom, `opacity: 0` by default, revealed via the same
  `:hover` (or `[aria-expanded="true"]` on mobile) state as the flex-grow.
- 4th panel's `<span>COMING SOON</span>` is styled like the `#issues`
  `SOON` badge already used for issue 004's card — visual continuity, not
  a new "coming soon" treatment.
- `@media (max-width: 720px)`: `#origin > article > ul` switches to
  `flex-direction: column`, panels become stacked full-width bands (same
  breakpoint the rest of the site already uses).
- `@media (prefers-reduced-motion: reduce)`: autoplay and the image-cycle
  `setInterval` are disabled in JS (see below); panels still expand on
  hover/tap and show their first image, just without animation/cycling.

## JS behavior (one inline `<script>`, same file, same style as existing)

1. **Slide switching** — toggles the `hidden` attribute between `header`
   and `article`, flips `aria-current` on the two `nav > button`s.
   `setInterval` auto-advances every ~7s; paused on `#origin` `mouseenter`
   / resumed on `mouseleave`; skipped entirely if
   `matchMedia('(prefers-reduced-motion: reduce)').matches`. Clicking a dot
   jumps directly and resets the autoplay timer. Manual dot clicks always
   work regardless of reduced-motion.
2. **Panel image cycling (desktop hover)** — a hardcoded per-panel array of
   2–3 image paths (already-existing comic page images from each issue's
   folder; the 4th panel's array has just its one cover, so no interval is
   set for it). On `li` `mouseenter`, `setInterval(~2100ms)` picks a random
   index (avoiding immediate repeat) and swaps the panel's single `<img
   src>`, cross-fading via the existing `img { transition: opacity .3s }`.
   `mouseleave` clears the interval and resets to the first image.
3. **Mobile tap-to-expand (≤720px)** — a `click` handler on each `li`
   toggles `aria-expanded`; expanding starts the same image-cycle interval
   and reveals the CTA/blurb, matching desktop hover behavior. Tapping the
   `<a>` inside navigates normally (click doesn't get intercepted there).

## Accessibility

- Inactive slide is `hidden` (removed from a11y tree + tab order), not
  merely visually hidden.
- Dots are real `<button>` elements with `aria-current="true"/"false"`.
- Mobile-expanded panels carry `aria-expanded`.
- Reduced-motion respected for both autoplay and image cycling.

## Testing

No automated test suite exists in this static-HTML project (consistent
with how the rest of the site has been verified). Manual verification via
the browser preview:
- Both slides render; dots switch between them; autoplay advances and
  pauses on hover; reduced-motion disables autoplay.
- Each of the 4 panels: hover grows it and shrinks the others to slivers,
  images cycle every ~2.1s, title/blurb/CTA reveal, divider wobble renders
  correctly between panels.
- 4th panel shows the static cover + "COMING SOON" tag, no cycling.
- At ≤720px: panels stack vertically; tapping a panel expands it in place
  and starts cycling; the `<a>` inside still navigates on tap.

## Out of scope

- No changes to slide 1's markup, styles, or content.
- No new images — reuses existing comic page assets already in
  `assets/images/issue-00{1,2,3}/` and `assets/images/covers/cover-004.webp`.
- No CMS/data-driven panel content — the 4 panels are hardcoded, matching
  how `#issues` is already hardcoded.
