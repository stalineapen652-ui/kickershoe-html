# About page (`about.html`)

## Purpose

Add a top-level About page that explains the KICKERSHOE concept in long-form:
a shared comic universe where invented animal characters live out fictional
origin stories for shoe designs that loosely echo real sneaker/boot lineage.
Doubles as an SEO anchor page (unique long-form content, internal links to
every issue) and a growth foundation (sitemap, structured data, social
preview tags) per user request to research how to make the site discoverable.

## Scope

- New file: `about.html`
- `styles.css` — new rules scoped to `about.html`'s own ids, reusing shared
  patterns (`#lore` reused verbatim for the disclaimer file; the generic
  section-intro-label rule already covers new section eyebrows for free)
- `sitemap.xml`, `robots.txt` — new, site root
- Every page (`index.html`, `issue-001/002/003.html`, `about.html`) gets:
  canonical `<link>`, Open Graph + Twitter Card meta, `About` added to the
  primary nav, and one JSON-LD `<script type="application/ld+json">` block
- `README.md` — mention the new page/files

## Content structure (`about.html`)

1. `#about` (hero) — full-viewport 9-tile comic-panel mosaic (art already
   published across Issues 001–003) with the `h1`/tagline overlaid on a dark
   scrim, staggered load-in animation per tile, then heading fades up. A
   small in-page `nav aria-label="On this page"` under the tagline jumps to
   the sections below (this is what justifies real `id`s on those sections,
   per the repo's own "id only as anchor target" rule).
2. `#mission` — "What We Do": the pitch, in-voice.
3. `#how-it-works` — the connective-tissue rule (today's antagonist is
   tomorrow's collaborator — the goat's rival co-designs the F50) and how
   character designs echo real shoe lineage without being it.
4. `#characters` — gallery of the three published characters (mantis,
   elephant, goat), each with a short bio and a link into their issue page.
   Real internal linking, not just decoration.
5. `#community` — invites readers to pitch a character; CTA links to the
   existing `index.html#join` newsletter form rather than duplicating it
   (matches how issue pages already link to `#join` instead of re-declaring
   it).
6. `#lore` (id reused, not duplicated markup) — "Not Affiliated" disclaimer,
   styled identically to every issue page's Lore file (ticker, file aside,
   `<dl>` of `<details>` entries) because the markup shape already matches:
   `p[aria-hidden]` ticker, `header`, `aside`, `dl`. Zero new CSS needed for
   this section.

## Hero mosaic — implementation notes

- `<ul>` of 9 `<li><img></li>` absolutely positioned behind the `<header>`,
  3×3 CSS grid, `object-fit: cover`.
- `#about::before` dark linear-gradient scrim for text legibility (own rule;
  not merged into the shared `#origin/#shoe/#join` halftone selector to
  avoid touching existing pages).
- Load-triggered (not scroll-triggered — hero is above the fold) staggered
  `@keyframes` fade+scale per tile via `:nth-child`, heading fades up after.
- `prefers-reduced-motion: reduce` block disables all of it to the settled
  end state, matching the existing comic-panel-reveal precedent.

## SEO additions (sourced from 2026 research, see prior chat turn for links)

- **Sitemap + robots.txt**: all 5 HTML pages listed; `robots.txt` points at
  the sitemap and allows all crawling.
- **Canonical tags**: one per page, absolute-path-free (site has no known
  production domain configured in-repo beyond Vercel's auto domain, so
  canonical uses a relative-safe root-relative form the user can swap to
  their final domain).
- **Open Graph / Twitter Card**: per-page title/description + `og:image`
  pointing at a real panel (not a generic banner) so shared links preview
  well on Reddit/Discord/Twitter — the single highest-leverage item from the
  research for a comic site.
- **JSON-LD**: `Organization` on `index.html`; `ComicIssue` on each issue
  page; `AboutPage` on `about.html`; `BreadcrumbList` on subpages.
- **Off-site distribution** (sitemap submission to Search Console, a mirror
  on Webtoon Canvas/Tapas, social cross-posting) is advisory-only and out of
  scope for this change — it requires accounts/actions only the user can
  take. Not building a checklist file for it unless asked.

## Out of scope

- No new image generation — hero reuses existing published panel art only.
- No duplicate newsletter form on About — links to the existing one.
- No site search, no CMS, no build-time sitemap generation — sitemap.xml is
  hand-maintained like the rest of the site, consistent with its no-tooling
  philosophy.
