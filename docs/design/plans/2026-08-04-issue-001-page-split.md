# Issue 001 Page Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pull the full Issue 001 comic story out of `index.html` into a new
`issue-001.html` page, leave a one-image teaser + CTA on the landing page
hero, and link the `#001` card in the Issues grid to the new page.

**Architecture:** Static HTML/CSS site, no build step, no JS framework, no
test runner. "Testing" here means: `grep` checks that stale references are
gone, and a manual visual pass in the browser preview (desktop + mobile
width) confirming both pages render and link correctly. There is no
automated test suite to hook into — do not invent one.

**Tech Stack:** Plain HTML5 + a single `styles.css` (custom properties,
CSS Grid/Flexbox), no build tooling.

---

### Task 1: Fix the broken filename

**Files:**
- Rename: `assets/issues/mantis/3rd drill.jpeg` → `assets/issues/mantis/3rd-drill.jpeg`

- [ ] **Step 1: Rename the file**

Run:
```bash
git mv "assets/issues/mantis/3rd drill.jpeg" "assets/issues/mantis/3rd-drill.jpeg"
```
Expected: file renamed, `git status` shows a rename, not a delete+add.

- [ ] **Step 2: Verify**

Run:
```bash
ls assets/issues/mantis/
```
Expected: listing includes `3rd-drill.jpeg`, no file with a space remains.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Rename mantis panel file to remove space (breaks unencoded img src)"
```

---

### Task 2: Add new CSS components to `styles.css`

**Files:**
- Modify: `styles.css` (append new rules after the existing `.scroll-hint`
  block, i.e. after line 210 `@keyframes pulse { ... }`, before the
  `.reg-mark` rules — exact insertion point doesn't matter functionally,
  but keep it grouped under a new `/* ============ Hero Teaser ============ */`
  comment block placed right after the `/* ============ Hero ============ */`
  section for readability)

- [ ] **Step 1: Add hero teaser styles**

Insert into `styles.css` (after the `.scroll-hint` / `@keyframes pulse`
rules, before `.reg-mark`):

```css
/* ============ Hero Teaser ============ */
.hero-teaser {
  margin: 40px auto 0;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.hero-teaser-frame {
  display: block;
  width: 100%;
  aspect-ratio: 1280 / 890;
  overflow: hidden;
  border: 4px solid var(--bone);
  box-shadow: 8px 8px 0 0 var(--ink), 8px 8px 0 4px var(--bone);
  background: var(--ink);
}
.hero-teaser-frame img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.5s;
}
.hero-teaser:hover .hero-teaser-frame img { transform: scale(1.06); }
.hero-teaser-cta {
  display: inline-flex; align-items: center; gap: 10px;
  border: 2px solid var(--primary);
  background: var(--primary);
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 18px; letter-spacing: 0.05em;
  padding: 10px 20px;
  transition: background 0.2s, color 0.2s;
}
.hero-teaser:hover .hero-teaser-cta { background: transparent; color: var(--primary); }
```

- [ ] **Step 2: Add issue-link (issue card anchor wrapper) style**

Insert into `styles.css` directly above the `/* ============ The Shoe ============ */`
comment (i.e. right after the existing `.issue-card h3` rule, at the end
of the `/* ============ Issues ============ */` block):

```css
.issue-link { display: block; height: 100%; }
```

- [ ] **Step 3: Add issue-intro, back-link, and comic-grid styles**

Append to the end of `styles.css` (after the final `.sound-toggle.on .dot`
rule):

```css

/* ============ Issue Page: Back Link ============ */
.back-link {
  display: inline-flex; align-items: center; gap: 8px;
  margin: 120px 32px 0;
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em;
  color: rgba(241, 236, 224, 0.6);
  transition: color 0.2s;
}
.back-link:hover { color: var(--primary); }

/* ============ Issue Page: Intro Banner ============ */
.issue-intro {
  padding: 40px 32px 60px;
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
}
.issue-intro h1 {
  margin: 20px 0;
  font-family: var(--font-display);
  font-size: clamp(48px, 10vw, 140px);
  line-height: 0.9;
  letter-spacing: 0.02em;
}
.issue-intro .issue-lede {
  max-width: 540px;
  margin: 0 auto;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(241, 236, 224, 0.8);
}
.issue-intro .issue-meta-row {
  margin-top: 20px;
  display: flex; justify-content: center; gap: 16px;
  font-size: 11px; text-transform: uppercase; letter-spacing: 0.3em;
  color: rgba(241, 236, 224, 0.7);
}
.issue-intro .issue-meta-row .status-out { color: var(--primary); }

/* ============ Issue Page: Comic Grid ============ */
.comic-grid-section {
  padding: 60px 32px 100px;
  max-width: 1500px;
  margin: 0 auto;
}
.comic-grid {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}
.comic-frame {
  position: relative;
  aspect-ratio: 1280 / 890;
  overflow: hidden;
  border: 4px solid var(--bone);
  box-shadow: 8px 8px 0 0 var(--ink), 8px 8px 0 4px var(--bone);
  background: var(--ink);
}
.comic-frame img { width: 100%; height: 100%; object-fit: cover; }
.comic-frame .comic-tag {
  position: absolute; top: 12px; left: 12px;
  background: rgba(5,5,5,0.75);
  border-left: 4px solid var(--primary);
  padding: 4px 10px;
  font-family: var(--font-mono);
  font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em;
  backdrop-filter: blur(4px);
  z-index: 2;
}
@media (max-width: 720px) {
  .comic-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Verify no syntax errors**

Run:
```bash
grep -c "^}" styles.css
grep -c "{" styles.css
```
Expected: the two counts are close/equal (every rule opened is closed) —
this is a sanity check, not exact validation. Open `styles.css` in the
browser preview later (Task 5) as the real check.

- [ ] **Step 5: Commit**

```bash
git add styles.css
git commit -m "Add hero-teaser, issue-intro, back-link, and comic-grid styles"
```

---

### Task 3: Update `index.html`

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace the hero-inner block's lede/scroll-hint area**

Find this block (around `index.html:52-60`):

```html
        <p class="hero-lede">
          A motion comic. A footnote in folklore. A shoe born from a broken leg
          and a quiet vow. <span class="accent">Scroll to read.</span>
        </p>

        <p class="scroll-hint">
          <span>SCROLL</span>
          <span class="scroll-line"></span>
        </p>
```

Replace it with:

```html
        <p class="hero-lede">
          A motion comic. A footnote in folklore. A shoe born from a broken leg
          and a quiet vow. <span class="accent">The full story is one click away.</span>
        </p>

        <a class="hero-teaser" href="issue-001.html">
          <span class="hero-teaser-frame">
            <img src="assets/issues/mantis/1friends.jpeg" alt="Preview panel from Issue 001 — The Mantis Origin" />
          </span>
          <span class="hero-teaser-cta">READ ISSUE 001 <span>→</span></span>
        </a>

        <p class="scroll-hint">
          <span>SCROLL</span>
          <span class="scroll-line"></span>
        </p>
```

- [ ] **Step 2: Delete the 7 comic panel articles**

Delete the entire block from the `<!-- ============ COMIC PANELS ============ -->`
comment through the closing `</article>` of `panel-07` (this spans from the
comic-panels comment down to just before the
`<!-- ============ ISSUES ============ -->` comment). After Step 1's edit
this block starts a few lines below and looks like:

```html
    <!-- ============ COMIC PANELS ============ -->
    <article class="panel align-left" id="panel-01">
      ...
    </article>

    <article class="panel align-right" id="panel-02">
      ...
    </article>

    <article class="panel align-left" id="panel-03">
      ...
    </article>

    <article class="panel align-right" id="panel-04">
      ...
    </article>

    <article class="panel align-left" id="panel-05">
      ...
    </article>

    <article class="panel align-center" id="panel-06">
      ...
    </article>

    <article class="panel align-center" id="panel-07">
      ...
      <footer class="panel-cta">
        ...
      </footer>
    </article>

```

Delete this whole block, leaving `<main>` going directly from the closing
`</section>` of `#origin.hero` to the `<!-- ============ ISSUES ============ -->`
comment.

- [ ] **Step 3: Update the #001 issue card to link out and use real art**

Find (around what is now roughly `index.html:195-205` after Step 2's
deletion):

```html
        <li>
          <article class="issue-card">
            <img src="assets/panel-1-kid.jpg" alt="Issue 001 cover" />
            <span class="issue-no">#001</span>
            <span class="issue-status out">OUT NOW</span>
            <footer>
              <p class="issue-date">APR 2026</p>
              <h3>THE MANTIS ORIGIN</h3>
            </footer>
          </article>
        </li>
```

Replace with:

```html
        <li>
          <a class="issue-link" href="issue-001.html">
            <article class="issue-card">
              <img src="assets/issues/mantis/1friends.jpeg" alt="Issue 001 cover" />
              <span class="issue-no">#001</span>
              <span class="issue-status out">OUT NOW</span>
              <footer>
                <p class="issue-date">APR 2026</p>
                <h3>THE MANTIS ORIGIN</h3>
              </footer>
            </article>
          </a>
        </li>
```

- [ ] **Step 4: Verify the panel articles and old cover image are gone**

Run:
```bash
grep -n "panel-01\|panel-02\|panel-03\|panel-04\|panel-05\|panel-06\|panel-07\|panel-1-kid.jpg" index.html
```
Expected: no output (no matches).

Run:
```bash
grep -n "hero-teaser\|issue-001.html" index.html
```
Expected: 3 matches — the `hero-teaser` anchor, the `hero-teaser-frame`
class, and the `href="issue-001.html"` on the issue card link (the hero
teaser's own `href="issue-001.html"` plus the issue card's makes 2 href
matches, plus the class name matches — exact count isn't critical, just
confirm both links are present).

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Replace inline Issue 001 story with hero teaser, link issue card to issue-001.html"
```

---

### Task 4: Create `issue-001.html`

**Files:**
- Create: `issue-001.html`

- [ ] **Step 1: Read the Lore section source**

Run:
```bash
grep -n "id=\"lore\" class=\"lore\"" index.html
```
Note the line number — you'll copy that entire `<section id="lore"
class="lore"> ... </section>` block (in the current `index.html`, before
Task 3's edits shifted line numbers, this was lines 280-332; re-check with
the grep result since Task 3 removed ~120 lines above it). Copy that
section's full markup verbatim for use in Step 2.

- [ ] **Step 2: Create the file**

Create `issue-001.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KICKERSHOE — Issue 001: The Mantis Origin</title>
  <meta name="description" content="Read the full motion comic: a praying mantis, a broken leg, and the football boot that became a legend. Born from the ground up." />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

  <!-- ============ HEADER ============ -->
  <header class="site-header">
    <a class="brand" href="index.html">
      <span class="brand-mark">K</span>
      <span class="brand-name">KICKER<span class="accent">SHOE</span></span>
    </a>
    <nav class="primary-nav" aria-label="Primary">
      <a href="index.html#issues">Issues</a>
      <a href="index.html#shoe">The Shoe</a>
      <a href="index.html#lore">Lore</a>
      <a class="nav-cta" href="index.html#join">Get Issue 002</a>
    </nav>
  </header>

  <main>

    <a class="back-link" href="index.html#issues">← BACK TO ISSUES</a>

    <!-- ============ ISSUE INTRO ============ -->
    <section class="issue-intro">
      <p class="eyebrow-sm">// ISSUE 001 — A KICKERSHOE COMIC</p>
      <h1>THE MANTIS ORIGIN</h1>
      <p class="issue-lede">
        A motion comic. A footnote in folklore. A shoe born from a broken leg
        and a quiet vow.
      </p>
      <p class="issue-meta-row">
        <span>APR 2026</span>
        <span class="status-out">OUT NOW</span>
      </p>
    </section>

    <!-- ============ COMIC GRID ============ -->
    <section class="comic-grid-section">
      <header class="section-head">
        <p class="eyebrow-sm">// THE FULL STORY</p>
        <h2>THE COMIC</h2>
      </header>
      <ul class="comic-grid">
        <li class="comic-frame">
          <span class="comic-tag">PANEL 01</span>
          <img src="assets/issues/mantis/1friends.jpeg" alt="Issue 001 panel 1" />
        </li>
        <li class="comic-frame">
          <span class="comic-tag">PANEL 02</span>
          <img src="assets/issues/mantis/2drill.jpeg" alt="Issue 001 panel 2" />
        </li>
        <li class="comic-frame">
          <span class="comic-tag">PANEL 03</span>
          <img src="assets/issues/mantis/3rd-drill.jpeg" alt="Issue 001 panel 3" />
        </li>
        <li class="comic-frame">
          <span class="comic-tag">PANEL 04</span>
          <img src="assets/issues/mantis/4scientist.jpeg" alt="Issue 001 panel 4" />
        </li>
        <li class="comic-frame">
          <span class="comic-tag">PANEL 05</span>
          <img src="assets/issues/mantis/5map.jpeg" alt="Issue 001 panel 5" />
        </li>
        <li class="comic-frame">
          <span class="comic-tag">PANEL 06</span>
          <img src="assets/issues/mantis/6shoe.jpeg" alt="Issue 001 panel 6" />
        </li>
        <li class="comic-frame">
          <span class="comic-tag">PANEL 07</span>
          <img src="assets/issues/mantis/7ground.jpeg" alt="Issue 001 panel 7" />
        </li>
        <li class="comic-frame">
          <span class="comic-tag">PANEL 08</span>
          <img src="assets/issues/mantis/8reference.jpeg" alt="Issue 001 panel 8" />
        </li>
        <li class="comic-frame">
          <span class="comic-tag">PANEL 09</span>
          <img src="assets/issues/mantis/9backside.jpeg" alt="Issue 001 panel 9" />
        </li>
        <li class="comic-frame">
          <span class="comic-tag">PANEL 10</span>
          <img src="assets/issues/mantis/10climax.jpeg" alt="Issue 001 panel 10" />
        </li>
      </ul>
    </section>

    <!-- ============ LORE ============ -->
    <section id="lore" class="lore">
      <div class="ticker" aria-hidden="true">
        <p>
          CLASSIFIED // MANTIS FILE 0x14 ◆
          FIRST SIGHTING — JUNGLE PITCH 7 ◆
          SUBJECT: GREEN, QUIET, LIMPING ◆
          RUMOURED COLLAB — LEGENDS UNNAMED ◆
          DO NOT REPRODUCE WITHOUT PERMISSION ◆
          STITCHING DETECTED IN MOLTED HUSK ◆
          CLASSIFIED // MANTIS FILE 0x14 ◆
          FIRST SIGHTING — JUNGLE PITCH 7 ◆
          SUBJECT: GREEN, QUIET, LIMPING ◆
          RUMOURED COLLAB — LEGENDS UNNAMED ◆
        </p>
      </div>

      <div class="lore-body">
        <header class="section-head">
          <p class="eyebrow-sm">// FIELD NOTES — RESTRICTED</p>
          <h2>LORE</h2>
        </header>

        <div class="lore-grid">
          <aside class="file-card">
            <header>
              <span>FILE</span>
              <span>0x14-MNTS</span>
            </header>
            <p>The following entries were recovered from a notebook left in section G of the locker room. Pages stained green. Handwriting unidentified. Reproduced without correction.</p>
            <p class="signoff">— EDITOR, KICKERSHOE</p>
          </aside>

          <dl class="lore-entries">
            <details open>
              <summary><span class="entry-no">ENTRY 01</span><span class="entry-q">WHO IS THE MANTIS?</span><span class="entry-plus">+</span></summary>
              <p>Born in the wet grass east of the river. Smaller than his peers. Quieter. He watched football from behind a leaf for nine seasons before he ever touched a ball. He is, by all accounts, still alive.</p>
            </details>
            <details>
              <summary><span class="entry-no">ENTRY 02</span><span class="entry-q">THE BOOT'S FIRST MATCH</span><span class="entry-plus">+</span></summary>
              <p>A back-alley five-a-side, no name on the sheet. Player wore them straight from a paper bag. Scored four. Vanished at half-time. The bag was never returned.</p>
            </details>
            <details>
              <summary><span class="entry-no">ENTRY 03</span><span class="entry-q">WHY GREEN?</span><span class="entry-plus">+</span></summary>
              <p>Because invisibility is a kind of armour. Because the grass owes him nothing and everything. Because gold without green is just a bruise.</p>
            </details>
            <details>
              <summary><span class="entry-no">ENTRY 04</span><span class="entry-q">THE GOLD STITCHING</span><span class="entry-plus">+</span></summary>
              <p>Filament is real. We tested it. We don't know where he gets it. He won't say.</p>
            </details>
          </dl>
        </div>
      </div>
    </section>

  </main>

  <footer class="site-footer">
    <p>© KICKERSHOE COMICS — PRINTED IN THE GRASS</p>
    <p><span>ISSN 0042-1996</span> <span class="accent">EST. 2026</span></p>
  </footer>

  <button class="sound-toggle" aria-label="Toggle ambient sound" onclick="this.classList.toggle('on'); this.querySelector('.sfx-label').textContent = this.classList.contains('on') ? 'SFX ON' : 'SFX OFF';">
    <span class="dot"></span>
    <span class="sfx-label">SFX OFF</span>
  </button>

  <!-- Vercel Speed Insights (static-site snippet) -->
  <script>
    window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/speed-insights/script.js"></script>

</body>
</html>
```

- [ ] **Step 3: Verify all 10 images are referenced and the renamed file matches**

Run:
```bash
grep -c "assets/issues/mantis/" issue-001.html
grep -n "3rd-drill.jpeg\|3rd drill.jpeg" issue-001.html
```
Expected: first command outputs `10` (hero uses 1 more but that's in
`index.html`, not this file — this file alone should show 10 `<img>` refs
inside `.comic-grid`, i.e. the count of `assets/issues/mantis/` occurrences
in this file is 10). Second command shows only `3rd-drill.jpeg` (hyphen,
matching Task 1's rename), never the space variant.

- [ ] **Step 4: Commit**

```bash
git add issue-001.html
git commit -m "Add issue-001.html with full comic grid, lore, and footer"
```

---

### Task 5: Manual verification in the browser preview

**Files:** none (verification only)

- [ ] **Step 1: Open the landing page**

Open `index.html` in the browser preview tool. Confirm:
- Hero section renders with title/animation as before.
- Below the hero lede, a single framed teaser image (`1friends.jpeg`) and a
  "READ ISSUE 001 →" button appear.
- No 7-panel comic-strip scroll section appears between the hero and the
  Issues grid.

- [ ] **Step 2: Click through from the hero teaser**

Click the hero teaser (image or button). Confirm it navigates to
`issue-001.html` and the page loads without a broken-image icon for any of
the 10 comic panels.

- [ ] **Step 3: Click through from the Issues grid**

Go back to `index.html`, scroll to `#issues`, click the `#001 THE MANTIS
ORIGIN` card. Confirm it navigates to `issue-001.html`. Confirm cards
`#002`–`#004` are NOT clickable links (hovering shows no pointer-cursor
navigation change beyond the existing card hover animation, and clicking
does nothing).

- [ ] **Step 4: Verify the comic grid layout on `issue-001.html`**

At desktop width, confirm the 10 panels render 2-per-row in reading order
(`1friends` → `10climax`), each frame the same size (locked to the
1280:890 ratio, no stretching/distortion). Resize the browser preview to
mobile width (< 720px) and confirm it collapses to 1 column.

- [ ] **Step 5: Verify Lore section and footer parity**

On `issue-001.html`, confirm the Lore accordion (4 entries) and the
footer render identically in style/content to the landing page's Lore and
footer.

- [ ] **Step 6: Verify back-navigation**

Click "← BACK TO ISSUES" on `issue-001.html`. Confirm it returns to
`index.html` scrolled to the Issues grid. Click the "K KICKERSHOE" brand
mark on `issue-001.html`. Confirm it returns to `index.html` (top of
page).

No commit for this task — it's a verification pass. If any check fails,
fix the relevant file from Task 2/3/4 and re-verify before moving on.

---

### Task 6: Final check and cleanup commit (if needed)

**Files:** any touched above, only if Task 5 surfaced fixes

- [ ] **Step 1: Re-run the grep checks from Tasks 3 and 4**

```bash
grep -n "panel-1-kid.jpg\|panel-01\|panel-07" index.html
grep -c "assets/issues/mantis/" issue-001.html
```
Expected: first command has no output; second outputs `10`.

- [ ] **Step 2: Check git status is clean**

```bash
git status
```
Expected: working tree clean (everything committed in Tasks 1–4), or only
whitespace/line-ending noise from the environment (already seen with
`docs/design/specs/...` — that's a pre-existing LF/CRLF warning, not
new work).

- [ ] **Step 3: If Task 5 required fixes, commit them**

```bash
git add -A
git commit -m "Fix issues found during manual verification of Issue 001 page split"
```

(Skip this step entirely if Task 5 found no issues.)
