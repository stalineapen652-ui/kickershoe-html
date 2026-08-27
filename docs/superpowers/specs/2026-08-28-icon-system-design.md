# Site-wide Icon System — Design

## Purpose

Add a small set of hand-drawn, single-stroke icon marks (in the site's own
palette) next to nav links, section eyebrow labels, issue/panel number
badges, and the footer across every page — approved live via the
brainstorming visual companion (icon style + in-context placement + size).

## Style (approved)

- Single continuous stroke per icon, `fill: none; stroke: currentColor;
  stroke-width: 2.6; stroke-linecap/linejoin: round`, `viewBox="0 0 64 64"`.
- Hand-drawn wobble via the same SVG `feTurbulence`/`feDisplacementMap`
  technique already used for the hero-slider divider
  (`assets` — see `#hero-ink-wobble` in `index.html`), applied as
  `filter: url(#icon-wobble)` in CSS rather than baked into each path.
- A small `var(--primary)`-filled accent dot on some icons (echoes the
  reference image's dot accents), `opacity: 0.6` at rest.
- Hover: stroke draws itself in (`stroke-dasharray`/`stroke-dashoffset`
  transition) and the accent dot pulses — only where the icon sits inside
  an already-interactive element (nav links, CTA); static placements
  (eyebrows, footer) render fully drawn, no hover animation, since
  they're not interactive.
- Sizes (approved at 1:1 with real site type scale): 22px next to nav
  links and eyebrow labels, 16px inside issue/panel number badges, 20px
  in the footer.

## Icon set (8 marks, shared meaning across the whole site)

| id | represents | path (viewBox 0 0 64 64) | dot |
|---|---|---|---|
| `icon-boot` | the shoe / physical object | `M14 44 Q14 30 22 24 Q28 19 36 22 Q46 26 48 36 Q49 42 44 44 L16 44 Q13 44 14 40 Z` | (40,30) |
| `icon-issue` | an issue / book / document | `M16 18 H48 V38 Q48 42 44 42 H28 L20 50 V42 H20 Q16 42 16 38 Z` | (32,29) |
| `icon-motion` | motion comic / play | `M22 16 L22 48 L46 32 Z` | (32,32) |
| `icon-impact` | mission / bold statement | `M34 14 L20 36 H30 L26 50 L46 26 H36 Z` | (32,16) |
| `icon-lore` | notes / how-it-works / fine print | `M16 24 H48 M16 32 H48 M16 40 H40` | (20,18) |
| `icon-legend` | universe / cast / origin | `M32 18 L36 28 L47 28 L38 35 L41 46 L32 39 L23 46 L26 35 L17 28 L28 28 Z` | none |
| `icon-reader` | about / the reader | `M16 32 Q24 20 32 32 Q40 44 48 32` | (32,32) |
| `icon-signal` | newsletter / community / broadcast | `M20 20 Q32 14 44 20 Q50 32 44 44 Q32 50 20 44 Q14 32 20 20 Z M32 26 V38 M26 32 H38` | none |

## Implementation approach

Each HTML page defines one hidden `<svg>` **sprite** (`<symbol id="icon-…">`
per icon, plus the shared `<filter id="icon-wobble">`) once, placed right
after `<body>` — mirroring how header/footer/script markup is already
duplicated per-page in this project (no shared-include mechanism exists).
Every usage site then references an icon with:

```html
<svg class="icon-mark" aria-hidden="true"><use href="#icon-boot"></use></svg>
```

`aria-hidden="true"` on every instance — these are decorative accents next
to text that already says the same thing, not information conveyed only
through the icon.

## Placement map (which page, which section, which icon)

**`index.html`**
- Primary nav: Origin→`legend`, Issues→`issue`, The Shoe→`boot`, Lore→`lore`, About→`reader`, Get Issue 003→`motion`
- `#origin` slide 1 eyebrow ("ISSUE 001 — A KICKERSHOE COMIC") → `motion`
- `#origin` slide 2 eyebrow ("// THE UNIVERSE") → `legend`
- `#origin` slide 2 panel `<data>` badges (01–04) → `issue`
- `#issues` eyebrow ("// THE LIBRARY") → `issue`
- `#issues` card `<data>` badges (#001–#004) → `issue`
- `#shoe` eyebrow ("// CASE FILE — OBJECT 001") → `boot`
- `#lore` eyebrow ("// FIELD NOTES — RESTRICTED") → `lore`
- `#join` eyebrow ("// TRANSMISSION INCOMING") → `signal`
- Footer (both lines) → `boot` (copyright line), `legend` (EST. 2026 line)

**`about.html`**
- Primary nav: same mapping as `index.html`
- On-page quick nav (Mission/How It Works/Characters/Community/Not Affiliated) → `impact`, `lore`, `legend`, `signal`, `lore`
- `#about` eyebrow ("// ABOUT KICKERSHOE") → `reader`
- `#mission` eyebrow ("// WHAT WE DO") → `impact`
- `#how-it-works` eyebrow ("// HOW THE LORE WORKS") → `lore`
- `#characters` eyebrow ("// THE CAST") → `legend`
- `#community` eyebrow ("// JOIN THE ROSTER") → `signal`
- `#lore` (fine-print section, same id reused for a different section than index.html's) eyebrow ("// THE FINE PRINT") → `issue`
- Footer → same as `index.html`

**`issue-001.html` / `issue-002.html` / `issue-003.html`**
- Primary nav: same mapping (no "Origin" link on these pages — matches
  existing nav, which omits it)
- Intro eyebrow ("// ISSUE 00X — A KICKERSHOE COMIC") → `motion`
- Footer → same as `index.html`

## Explicitly out of scope

- The sound-toggle button's decorative dot stays as-is — it's a
  functional on/off indicator, not a decorative accent, and isn't part of
  the approved mockup.
- The "← BACK TO ISSUES" links keep their plain arrow — already reads
  clearly, wasn't part of the approved placements.
- No per-character icons (mantis/elephant/goat silhouettes) — the
  approved reference was a generic icon-mark language, not character
  portraiture; that would be a separate, larger illustration task.
