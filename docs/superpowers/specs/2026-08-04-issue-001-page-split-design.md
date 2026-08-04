# Issue 001 Page Split — Design

## Context

`index.html` currently contains the entire Issue 001 story inline: the animated
`#origin.hero` intro section immediately followed by 7 full-viewport comic
panels (`article.panel`, ids `panel-01`..`panel-07`), each with one image and
a caption. A new set of 10 story images was added at
`assets/issues/mantis/`, all a consistent 1280×890px ("procreate display
size"), numbered by the user in intended reading order via filename prefix:

```
1friends.jpeg  2drill.jpeg  3rd drill.jpeg  4scientist.jpeg  5map.jpeg
6shoe.jpeg     7ground.jpeg 8reference.jpeg 9backside.jpeg   10climax.jpeg
```

These 10 images don't map 1:1 to the old 7-beat caption text (Kid, Fall,
Betrayal, Vow, Creation, Legend, Recognition), so the old per-panel captions
are dropped rather than force-matched.

Goal: pull the full story out of the landing page into its own Issue 001
page, leave a teaser on the landing page, and link the `#001` card in the
Issues grid to the new page.

## File changes

- **Rename** `assets/issues/mantis/3rd drill.jpeg` → `3rd-drill.jpeg`
  (space in filename breaks unencoded `<img src>` URLs).
- **New file** `issue-001.html` at project root (sits next to `index.html`,
  reuses `styles.css` and `assets/` with the same relative paths).
- **Edit** `index.html` (see below).
- **Edit** `styles.css` — add new component styles, no removals of existing
  rules used elsewhere (`.hero`, `.issue-grid`, `.lore`, `.site-footer`,
  etc. stay as-is and are reused/duplicated, not rewritten).

## Landing page (`index.html`) changes

1. **Hero stays.** `#origin.hero` keeps its title animation, lede, halftone,
   spores, reg-marks — unchanged.
2. **Teaser replaces the scroll-hint's role.** Below `.hero-lede`, add a
   `.hero-teaser` block:
   - One image, `assets/issues/mantis/1friends.jpeg`, framed like a comic
     panel (reuses `.panel-frame` styling conventions).
   - A button/link, `READ ISSUE 001 →`, styled consistently with existing
     CTA patterns (e.g. `.nav-cta` / `.join-form button` treatment).
   - Both the image and the button link to `issue-001.html`.
   - The existing `.scroll-hint` ("SCROLL") stays below the teaser, now
     pointing toward the Issues grid section rather than inline panels.
3. **Remove all 7 `<article class="panel">` blocks** (`panel-01`..`panel-07`)
   from the DOM entirely.
4. **Issues grid**: wrap the `#001 THE MANTIS ORIGIN` `<article
   class="issue-card">` in `<a href="issue-001.html" class="issue-link">`.
   Change its cover `<img>` from `assets/panel-1-kid.jpg` to
   `assets/issues/mantis/1friends.jpeg`. Cards `#002`–`#004` are left
   exactly as-is (no href — those issues have no page yet).
5. **Lore, Shoe, Join, Footer sections**: unchanged.
6. **Nav**: unchanged — `#origin`, `#issues`, `#shoe`, `#lore`, `#join`
   anchors all still resolve on the landing page.

## New page (`issue-001.html`)

Structure, top to bottom:

1. `<head>`: same as `index.html` but title `KICKERSHOE — Issue 001: The
   Mantis Origin` and same meta description pattern, links `styles.css`.
2. `<header class="site-header">`: same markup as `index.html`, except nav
   links point back to the landing page's sections: `index.html#issues`,
   `index.html#shoe`, `index.html#lore`, `index.html#join`; brand mark links
   to `index.html`.
3. A small `← BACK TO ISSUES` link (new `.back-link` style) near the top of
   `<main>`, linking to `index.html#issues`.
4. `.issue-intro` section — a lighter, static (non-animated) banner: eyebrow
   ("ISSUE 001 — A KICKERSHOE COMIC"), title "THE MANTIS ORIGIN", issue meta
   row (APR 2026 / OUT NOW), reusing the hero's lede copy currently in
   `index.html` ("A motion comic. A footnote in folklore...").
5. `.comic-grid-section` — heading + `<ul class="comic-grid">`:
   - All 10 images in numeric filename order:
     `1friends, 2drill, 3rd-drill, 4scientist, 5map, 6shoe, 7ground,
     8reference, 9backside, 10climax`.
   - 2 images per row on desktop/tablet, 1 column under the existing
     720px mobile breakpoint.
   - Each grid cell (`.comic-frame`) is a fixed-aspect-ratio frame
     (`aspect-ratio: 1280 / 890`, matching the procreate export size) with
     `object-fit: cover`, bordered/boxed like `.panel-frame`.
   - Each frame is tagged `PANEL 01`..`PANEL 10` (plain sequence tag, no
     invented per-image caption text, since filenames don't map to a
     specific story beat).
6. `.lore` section — **duplicated verbatim** from `index.html` (same file
   card + accordion entries).
7. `<footer class="site-footer">` — same markup as `index.html`.
8. Sound-toggle button and Vercel speed-insights script — same as
   `index.html`, for visual/behavioral parity.

## CSS additions (`styles.css`)

- `.hero-teaser`: layout for the single teaser image + CTA button under the
  hero lede.
- `.issue-intro`: static banner styling for the issue page header (smaller
  than `.hero`, no viewport-height sizing, no entrance animations).
- `.comic-grid`, `.comic-frame`: 2-column responsive grid
  (`grid-template-columns: repeat(2, 1fr)`, collapsing to 1 column at
  `max-width: 720px`), fixed `aspect-ratio: 1280 / 890` frames, `object-fit:
  cover`, reusing the site's bordered/box-shadow "panel-frame" visual
  language for consistency.
- `.back-link`: small back-navigation element, consistent with existing
  `eyebrow-sm` / mono-uppercase text conventions.

## Out of scope

- No changes to `.the-shoe`, `.join`, header/footer markup beyond what's
  described above.
- No new captions invented for the 10 comic-grid images.
- Issues #002–#004 are not linked to any page (they don't have one).
- Old unused images (`assets/panel-2-fall.jpg` etc.) are left in place,
  just no longer referenced by the landing page panels.
