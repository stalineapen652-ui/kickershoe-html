# Semantic HTML Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `index.html`, `issue-001.html`, `styles.css`, and their inline scripts so no element uses `<div>`, `class`, or `id` (except `id` on real in-page anchor targets), while the rendered site looks and behaves exactly as it does today.

**Architecture:** One shared stylesheet (`styles.css`) styles both pages via element type, structural combinators (`>`, `:nth-of-type`, `:first-of-type`), and attribute selectors (`[href^="#"]`, `[open]`, `[aria-pressed]`) instead of classes. Purely decorative elements move into CSS `::before`/`::after`. JS state (sound toggle, form success, comic reveal) moves to `aria-pressed`, the native `hidden` attribute, and CSS scroll-driven animation instead of `classList`.

**Tech Stack:** Plain HTML5, CSS3 (incl. `animation-timeline: view()` scroll-driven animation with `@supports` fallback), vanilla JS. No test framework exists in this repo — verification is (a) automated grep checks that no `<div`, `class=`, or disallowed `id=` remain, and (b) manual visual comparison in a browser against the current deployed site.

Reference spec: `docs/superpowers/specs/2026-08-19-semantic-html-rewrite-design.md`

---

## Shared conventions (apply in every task)

- **`<mark>`** replaces every `class="accent"` span. Styled once in `styles.css`:
  ```css
  mark {
    background: none;
    color: var(--accent, #7c3aed);
  }
  ```
- **Allowed `id`s, nowhere else:** `origin`, `issues`, `shoe`, `lore`, `join` (section anchor targets only). Every other element: no `id`.
- **Decorative `aria-hidden` elements** (halftone, spores, registration marks, ticker duplication) are deleted from HTML and rebuilt with CSS on the parent semantic element.
- **Verification command** (run after every file edit):
  ```bash
  grep -nE '<div| class=| id="(?!origin|issues|shoe|lore|join|reader-email)' index.html issue-001.html
  ```
  Expected: no output (empty). Note: `reader-email` id is removed in Task 5 once the label wraps the input — after that task, drop it from the allow-list too and re-run.

---

### Task 1: `index.html` — header, nav, hero

**Files:**
- Modify: `index.html:12-74`
- Modify: `styles.css` (header/nav/hero rules — search for `.site-header`, `.brand`, `.primary-nav`, `.hero`, `.halftone`, `.spores`, `.eyebrow`, `.hero-title`, `.hero-lede`, `.hero-teaser`, `.scroll-hint`, `.reg-mark`)

- [ ] **Step 1: Rewrite the header/nav markup**

Replace lines 12-25 with:

```html
  <header>
    <a href="#origin">
      <img src="assets/logo/kickershoe-logo.png" alt="Kickershoe logo" />
      <span>KICKER<mark>SHOE</mark></span>
    </a>
    <nav aria-label="Primary">
      <a href="#origin">Origin</a>
      <a href="#issues">Issues</a>
      <a href="#shoe">The Shoe</a>
      <a href="#lore">Lore</a>
      <a href="#join">Get Issue 002</a>
    </nav>
  </header>
```

The old `.brand`, `.brand-mark`, `.brand-name`, `.nav-cta` classes are gone — Task 1 Step 3 re-targets these visually via structural selectors (`header > a`, `header > a img`, `nav a:last-child`).

- [ ] **Step 2: Rewrite the hero section markup**

Replace lines 30-74 with:

```html
    <section id="origin">
      <header>
        <p>
          ISSUE 001 — A KICKERSHOE COMIC
        </p>

        <h1>
          <span>THE</span>
          <mark data-text="MANTIS">MANTIS</mark>
          <span>ORIGIN</span>
        </h1>

        <p>
          A motion comic. A footnote in folklore. A shoe born from a broken leg
          and a quiet vow. <mark>The full story is one click away.</mark>
        </p>

        <a href="issue-001.html">
          <img src="assets/images/issue-001/1friends.webp" alt="Preview panel from Issue 001 — The Mantis Origin" />
          <span>READ ISSUE 001 <span>→</span></span>
        </a>

        <p>
          <span>SCROLL</span>
        </p>
      </header>
    </section>
```

Notes:
- The old `.halftone`, `.spores` (20 empty `<span>`s), and four `.reg-mark` corner spans are deleted — Step 3 recreates them as `#origin::before`/`::after` generated content in CSS.
- The `<span class="rule">` decorative lines flanking the eyebrow text are deleted; recreated as `#origin header > p:first-child::before/::after` in CSS.
- `.hero-teaser-frame` wrapper span removed — the `<img>` is styled directly.

- [ ] **Step 3: Update `styles.css` selectors for header/nav/hero**

Find every rule keyed on `.site-header`, `.brand`, `.brand-mark`, `.brand-name`, `.primary-nav`, `.nav-cta`, `.hero`, `.halftone`, `.spores`, `.hero-inner`, `.eyebrow`, `.rule`, `.hero-title`, `.line`, `.line-the`, `.line-mantis`, `.glitch`, `.line-origin`, `.hero-lede`, `.accent`, `.hero-teaser`, `.hero-teaser-frame`, `.hero-teaser-cta`, `.scroll-hint`, `.scroll-line`, `.reg-mark`, `.tl`, `.tr`, `.bl`, `.br`.

Rewrite each using this mapping (selector prefix `#origin` scopes hero-only rules so `header`/`nav`/`section > header` don't collide with other sections' headers):

| Old class selector | New selector |
|---|---|
| `.site-header` | `body > header` |
| `.brand` | `body > header > a` |
| `.brand-mark` | `body > header > a > img` |
| `.brand-name` | `body > header > a > span` |
| `.primary-nav` | `body > header > nav` |
| `.nav-cta` | `body > header > nav > a:last-child` |
| `.hero` | `#origin` |
| `.halftone` (hero) | `#origin::before` (generated background, see below) |
| `.spores` | `#origin::after` (generated radial-gradient dot field, see below) |
| `.hero-inner` | `#origin > header` |
| `.eyebrow` | `#origin > header > p:first-of-type` |
| `.rule` (both sides of eyebrow) | `#origin > header > p:first-of-type::before, #origin > header > p:first-of-type::after` |
| `.hero-title` | `#origin h1` |
| `.line`, `.line-the`, `.line-origin` | `#origin h1 span` |
| `.line-mantis`, `.glitch` | `#origin h1 mark` |
| `.hero-lede` | `#origin > header > p:nth-of-type(2)` |
| `.accent` (sitewide) | `mark` (defined once, shared convention above) |
| `.hero-teaser` | `#origin a[href="issue-001.html"]` |
| `.hero-teaser-frame` | `#origin a[href="issue-001.html"] img` (style the `img` directly; drop the wrapper-span rule) |
| `.hero-teaser-cta` | `#origin a[href="issue-001.html"] > span` |
| `.scroll-hint` | `#origin > header > p:last-of-type` |
| `.scroll-line` | `#origin > header > p:last-of-type::after` |
| `.reg-mark` + `.tl/.tr/.bl/.br` | four `#origin::before`/`::after`-adjacent corner marks — since only 2 pseudo-elements are available per element and hero already uses both for halftone/spores, wrap the 4 corner marks into a single `#origin`'s `box-shadow` (4 offset `0 0 0 <size>` shadows using `--reg-mark` custom properties) rather than pseudo-elements. Use CSS custom properties for the 4 corner positions and `background-image` with 4 `radial-gradient`/`linear-gradient` layers positioned via `background-position` (top left/top right/bottom left/bottom right) — one `background-image` can hold multiple gradients as separate layers, giving all 4 marks without extra elements. |

Keep every existing declaration (colors, sizes, animations, keyframes) — only the **selector** changes, not the visual rule bodies, except where a rule targeted an element that no longer exists (e.g. `.spores span` per-dot stagger animation — reimplement as a single `@keyframes` on the `::after` pseudo-element covering the whole field, or drop per-dot stagger if not visually critical; confirm visually in Task 6).

- [ ] **Step 4: Visual check**

Open `index.html` in a browser, compare header/nav/hero against the live site (or `git stash` the changes, screenshot, `git stash pop`, screenshot again). Confirm: logo, nav links, accent-colored "SHOE"/"MANTIS", halftone texture, spore dots, corner marks, and teaser card all look the same.

- [ ] **Step 5: Commit**

```bash
git add index.html styles.css
git commit -m "Rewrite header, nav, and hero as semantic markup"
```

---

### Task 2: `index.html` — issues section

**Files:**
- Modify: `index.html:76-130`
- Modify: `styles.css` (`.issues`, `.section-head`, `.eyebrow-sm`, `.issue-grid`, `.issue-link`, `.issue-card`, `.issue-no`, `.issue-status`, `.issue-date`)

- [ ] **Step 1: Rewrite markup**

Replace lines 77-130 with:

```html
    <section id="issues">
      <header>
        <p>// THE LIBRARY</p>
        <h2>ISSUES</h2>
      </header>
      <ul>
        <li>
          <a href="issue-001.html">
            <article>
              <img src="assets/images/issue-001/1friends.webp" alt="Issue 001 cover" />
              <data value="001">#001</data>
              <mark>OUT NOW</mark>
              <footer>
                <p><time datetime="2026-04">APR 2026</time></p>
                <h3>THE MANTIS ORIGIN</h3>
              </footer>
            </article>
          </a>
        </li>
        <li>
          <article>
            <img src="assets/images/covers/cover-002.webp" alt="Issue 002 cover" />
            <data value="002">#002</data>
            <span>PRE-ORDER</span>
            <footer>
              <p><time datetime="2026-08">AUGUST 2026</time></p>
              <h3>Converse</h3>
            </footer>
          </article>
        </li>
        <li>
          <article>
            <img src="assets/images/covers/cover-003.webp" alt="Issue 003 cover" />
            <data value="003">#003</data>
            <span>TEASER</span>
            <footer>
              <p><time datetime="2026-06">JUN 2026</time></p>
              <h3>THE GOAT OG</h3>
            </footer>
          </article>
        </li>
        <li>
          <article>
            <img src="assets/images/covers/cover-004.webp" alt="Issue 004 cover" />
            <data value="004">#004</data>
            <span>SOON</span>
            <footer>
              <p><time datetime="2026-07">JUL 2026</time></p>
              <h3>TUNNEL OF GHOSTS</h3>
            </footer>
          </article>
        </li>
      </ul>
    </section>
```

Note: `<mark>OUT NOW</mark>` replaces `class="issue-status out"` (the one "live" badge, reusing the shared accent-mark convention). The other three statuses keep a plain `<span>` (their old class was just `.issue-status`, no special color) — CSS types them via `article > span` while `article > mark` gets the accent styling for free from the shared `mark` rule.

- [ ] **Step 2: Update `styles.css` selectors**

| Old class | New selector |
|---|---|
| `.issues` | `#issues` |
| `.section-head` (reused across sections) | `section > header:first-child` (generic — works for every section since each section's intro header is its first child) |
| `.eyebrow-sm` | `section > header:first-child > p` |
| `.issue-grid` | `#issues ul` |
| `.issue-link` | `#issues ul a` |
| `.issue-card` | `#issues article` |
| `.issue-no` | `#issues article > data` |
| `.issue-status` | `#issues article > span` |
| `.issue-status.out` | now `#issues article > mark` (covered by shared `mark` rule + any extra badge-specific padding/border kept here) |
| `.issue-date` | `#issues article footer > p` |

- [ ] **Step 3: Visual check** — compare issues grid rendering (card layout, badge colors, hover states) against current site.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Rewrite issues section as semantic markup"
```

---

### Task 3: `index.html` — the shoe section

**Files:**
- Modify: `index.html:132-167`
- Modify: `styles.css` (`.the-shoe`, `.section-lede`, `.shoe-stage`, `.panel-frame`, `.shoe-glow`, `.shoe-ring`, `.outer`, `.inner`, `.shoe-img`, `.callout`, `.pos-tl/tr/bl/br`, `.callout-label`, `.callout-desc`)

- [ ] **Step 1: Rewrite markup**

Replace lines 133-167 with:

```html
    <section id="shoe">
      <header>
        <p>// CASE FILE — OBJECT 001</p>
        <h2>THE <mark>SHOE</mark></h2>
        <p>
          Photographed under low light. Recovered from the long grass after the
          third match. Material analysis pending. <mark>Do not touch the sole.</mark>
        </p>
      </header>

      <figure>
        <img src="assets/images/shoe/mantis-shoe.webp" alt="The Mantis boot floating in green light" />

        <aside>
          <p>[01] EXOSKELETON GRIP</p>
          <p>Woven exo-mesh upper. Bites turf like mandibles.</p>
        </aside>
        <aside>
          <p>[02] AGILITY WEAVE</p>
          <p>Lateral flex panels. Twist, pivot, vanish.</p>
        </aside>
        <aside>
          <p>[03] THE MANTIS SOLE</p>
          <p>Eight-stud chitin plate. Forged from molt.</p>
        </aside>
        <aside>
          <p>[04] GOLD SUTURE</p>
          <p>Hand-stitched 24k filament. A scar that shines.</p>
        </aside>
      </figure>
    </section>
```

The `.shoe-glow` and two `.shoe-ring` spans (both `aria-hidden`, purely decorative glow/ring effects around the boot image) are deleted — recreated as `figure img::before`/`::after`... note `img` cannot have pseudo-elements or children. Instead apply the glow/ring as `box-shadow` layers and a `background` radial-gradient directly on the `<figure>` (behind the `img`, via `figure { position: relative; z-index: 0 }` + `img { position: relative; z-index: 1 }` + `figure::before`/`::after` for the glow/rings, since `figure` itself *can* take pseudo-elements).

- [ ] **Step 2: Update `styles.css` selectors**

| Old class | New selector |
|---|---|
| `.the-shoe` | `#shoe` |
| `.section-lede` | `#shoe > header > p:last-child` |
| `.shoe-stage`, `.panel-frame` (shoe instance) | `#shoe figure` |
| `.shoe-glow` | `#shoe figure::before` |
| `.shoe-ring.outer` | `#shoe figure::after` |
| `.shoe-ring.inner` | fold into the same `#shoe figure::after` via an extra `box-shadow` layer (a single pseudo-element can carry both rings as two `box-shadow` values), or use `figure > img` won't work for a 3rd layer — since only two pseudo-elements exist and 3 decorative layers are needed (glow, outer ring, inner ring), combine outer+inner ring into one `::after` using two `box-shadow` entries (comma-separated), keeping `::before` for the glow. |
| `.shoe-img` | `#shoe figure > img` |
| `.callout` | `#shoe aside` |
| `.pos-tl/.pos-tr/.pos-bl/.pos-br` | `#shoe aside:nth-of-type(1)` / `:nth-of-type(2)` / `:nth-of-type(3)` / `:nth-of-type(4)` (matches source order: tl, tr, bl, br) |
| `.callout-label` | `#shoe aside > p:first-child` |
| `.callout-desc` | `#shoe aside > p:last-child` |

- [ ] **Step 3: Visual check** — confirm glow/ring effect, callout positions (top-left/right, bottom-left/right around the boot image), and text styling match.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Rewrite shoe section as semantic markup"
```

---

### Task 4: `index.html` — lore section

**Files:**
- Modify: `index.html:169-222`
- Modify: `styles.css` (`.lore`, `.ticker`, `.lore-body`, `.lore-grid`, `.file-card`, `.signoff`, `.lore-entries`, `.entry-no`, `.entry-q`, `.entry-plus`)

- [ ] **Step 1: Rewrite markup**

Replace lines 170-222 with:

```html
    <section id="lore">
      <p aria-hidden="true">
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

      <header>
        <p>// FIELD NOTES — RESTRICTED</p>
        <h2>LORE</h2>
      </header>

      <aside>
        <header>
          <span>FILE</span>
          <span>0x14-MNTS</span>
        </header>
        <p>The following entries were recovered from a notebook left in section G of the locker room. Pages stained green. Handwriting unidentified. Reproduced without correction.</p>
        <p>— EDITOR, KICKERSHOE</p>
      </aside>

      <dl>
        <details open>
          <summary><span>ENTRY 01</span><span>WHO IS THE MANTIS?</span><span>+</span></summary>
          <p>Born in the wet grass east of the river. Smaller than his peers. Quieter. He watched football from behind a leaf for nine seasons before he ever touched a ball. He is, by all accounts, still alive.</p>
        </details>
        <details>
          <summary><span>ENTRY 02</span><span>THE BOOT'S FIRST MATCH</span><span>+</span></summary>
          <p>A back-alley five-a-side, no name on the sheet. Player wore them straight from a paper bag. Scored four. Vanished at half-time. The bag was never returned.</p>
        </details>
        <details>
          <summary><span>ENTRY 03</span><span>WHY GREEN?</span><span>+</span></summary>
          <p>Because invisibility is a kind of armour. Because the grass owes him nothing and everything. Because gold without green is just a bruise.</p>
        </details>
        <details>
          <summary><span>ENTRY 04</span><span>THE GOLD STITCHING</span><span>+</span></summary>
          <p>Filament is real. We tested it. We don't know where he gets it. He won't say.</p>
        </details>
      </dl>
    </section>
```

Notes:
- `.lore-body` and `.lore-grid` wrapping `<div>`s are removed — `#lore` becomes a `display: grid`/`flex` context directly (its immediate children are now `header`, `aside`, `dl`), same visual layout via updated selectors.
- The `entry-no`/`entry-q`/`entry-plus` spans lose their classes; they're distinguished by position (`summary > span:nth-child(1/2/3)`).

- [ ] **Step 2: Update `styles.css` selectors**

| Old class | New selector |
|---|---|
| `.lore` | `#lore` |
| `.ticker` | `#lore > p:first-child` (the marquee text) |
| `.lore-body` | remove wrapper — apply its layout rules directly to `#lore` (adjust child selectors accordingly) |
| `.section-head` (lore instance) | already covered by generic `section > header:first-child` from Task 2 |
| `.lore-grid` | remove wrapper — becomes `#lore`'s grid-template-columns applied directly, with `aside` and `dl` as the two grid items |
| `.file-card` | `#lore > aside` |
| `.signoff` | `#lore > aside > p:last-child` |
| `.lore-entries` | `#lore > dl` |
| `.entry-no` | `#lore summary > span:nth-child(1)` |
| `.entry-q` | `#lore summary > span:nth-child(2)` |
| `.entry-plus` | `#lore summary > span:nth-child(3)` |

- [ ] **Step 3: Visual check** — confirm ticker scroll animation, file-card layout, and accordion (`<details>`) open/close styling and `+` rotation still match.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Rewrite lore section as semantic markup"
```

---

### Task 5: `index.html` — join section, footer, sound toggle

**Files:**
- Modify: `index.html:224-263`
- Modify: `styles.css` (`.join`, `.join-panel`, `.join-grid`, `.join-form`, `.form-foot`, `.form-success`, `.site-footer`, `.sound-toggle`, `.dot`, `.sfx-label`)

- [ ] **Step 1: Rewrite markup**

Replace lines 225-260 with:

```html
    <section id="join">
      <article>
        <header>
          <p>// TRANSMISSION INCOMING</p>
          <h2>GET THE NEXT<br /><mark>ISSUE</mark> DROPPED<br />TO YOUR INBOX.</h2>
          <p>One email per chapter. No filler, no tracking pixels in the noscript. Just the next page of the story, the moment it's printed.</p>
        </header>

        <form>
          <label>
            READER ID — EMAIL
            <input type="email" required placeholder="agent@kickershoe.zine" />
          </label>
          <button type="submit">
            <span>SEND ME ISSUE 002</span><span>→</span>
          </button>
          <p>UNSUBSCRIBE WITH A SHED OF SKIN</p>
          <p hidden>RECEIVED. THE MANTIS HAS YOUR FREQUENCY.</p>
        </form>
      </article>
    </section>
  </main>

  <footer>
    <p>© KICKERSHOE COMICS — PRINTED IN THE GRASS</p>
    <p><span>ISSN 0042-1996</span> <mark>EST. 2026</mark></p>
  </footer>

  <button aria-label="Toggle ambient sound" aria-pressed="false">
    <span></span>
    <span>SFX OFF</span>
  </button>

  <script>
    document.querySelector('body > button[aria-label="Toggle ambient sound"]').addEventListener('click', function () {
      var pressed = this.getAttribute('aria-pressed') === 'true';
      this.setAttribute('aria-pressed', String(!pressed));
      this.querySelector('span:last-child').textContent = !pressed ? 'SFX ON' : 'SFX OFF';
    });

    document.querySelector('#join form').addEventListener('submit', function (event) {
      event.preventDefault();
      this.querySelector('p[hidden]').hidden = false;
    });
  </script>

  <!-- Vercel Speed Insights (vendored via npm run build, see scripts/build.js) -->
  <script type="module" src="assets/js/speed-insights-init.js"></script>

</body>
</html>
```

Notes:
- `id="reader-email"` / `for="reader-email"` removed — the `<label>` now wraps the `<input>`, which is a valid native association requiring no `id`.
- Inline `onsubmit=` / `onclick=` handlers (which used `classList`) are replaced with a `<script>` block using `addEventListener` and `aria-pressed`/`hidden` — no `class` anywhere.
- After this task, drop `reader-email` from the grep allow-list in the Shared Conventions section (it's fully gone now).

- [ ] **Step 2: Update `styles.css` selectors**

| Old class | New selector |
|---|---|
| `.join` | `#join` |
| `.join-panel`, `.panel-frame` (join instance) | `#join article` |
| `.join-grid` | remove wrapper — apply grid layout directly to `#join article` (children become `header`, `form`) |
| `.join-form` | `#join form` |
| `label[for]` styling | `#join form label` |
| `.form-foot` | `#join form p:not([hidden])` — or simpler: `#join form > p:nth-of-type(1)` since it's the first `<p>` after the button |
| `.form-success` | `#join form p[hidden]` for the hidden-state rule, plus a `#join form p[hidden]... ` note: browsers don't render `[hidden]` elements at all (this is stronger than the old class toggle, which is fine — same visual effect once JS clears `hidden`) |
| `.site-footer` | `body > footer` |
| `.sound-toggle` | `body > button[aria-label="Toggle ambient sound"]` |
| `.sound-toggle .dot` | `body > button[aria-label="Toggle ambient sound"] > span:first-child` |
| `.sound-toggle.on .dot` | `body > button[aria-label="Toggle ambient sound"][aria-pressed="true"] > span:first-child` |
| `.sfx-label` | `body > button[aria-label="Toggle ambient sound"] > span:last-child` |

- [ ] **Step 3: Visual + functional check** — click the sound toggle, confirm dot/label swap and `aria-pressed` flips in devtools; submit the join form, confirm the success message appears and the form-foot/success text positioning matches the old `.submitted` behavior.

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "Rewrite join section, footer, and sound toggle as semantic markup"
```

---

### Task 6: `index.html` decorative CSS pass (halftone/spores/reg-marks/rings) + full-page visual diff

**Files:**
- Modify: `styles.css` (finish the generated-content rules stubbed in Tasks 1 and 3)

- [ ] **Step 1:** Implement the `#origin::before` (halftone) and `#origin::after` (spores) generated-content rules using the existing halftone/spore visual values (colors, sizes, opacity, positions) from the pre-rewrite CSS — copy the declarations, only change the selector, per the Task 1 table.
- [ ] **Step 2:** Implement the combined glow/ring `figure::before`/`::after` rules for `#shoe` per the Task 3 table.
- [ ] **Step 3:** Implement the 4-corner registration-mark `background-image` (multi-layer gradient) on `#origin` per the Task 1 table.
- [ ] **Step 4:** Full-page visual diff: open `index.html` in a browser at the same viewport width used before starting (desktop + mobile), and compare screenshot-by-screenshot against the pre-rewrite version (`git show HEAD~5:index.html` etc., or the deployed production URL) for every section. Fix any drift.
- [ ] **Step 5: Run the grep check**

```bash
grep -nE '<div| class=' index.html
grep -noE 'id="[a-z0-9-]+"' index.html
```

Expected: first command empty; second command only lists `id="origin"`, `id="issues"`, `id="shoe"`, `id="lore"`, `id="join"`.

- [ ] **Step 6: Commit**

```bash
git add styles.css
git commit -m "Finish decorative CSS generated-content rules for index.html"
```

---

### Task 7: `issue-001.html` — header, nav, intro, back-link

**Files:**
- Modify: `issue-001.html:12-42`
- Modify: `styles.css` (`.back-link`, `.issue-intro`, `.issue-lede`, `.issue-meta-row`, `.status-out`)

- [ ] **Step 1: Rewrite markup**

Replace lines 12-42 with:

```html
  <header>
    <a href="index.html">
      <img src="assets/logo/kickershoe-logo.png" alt="Kickershoe logo" />
      <span>KICKER<mark>SHOE</mark></span>
    </a>
    <nav aria-label="Primary">
      <a href="index.html#issues">Issues</a>
      <a href="index.html#shoe">The Shoe</a>
      <a href="index.html#lore">Lore</a>
      <a href="index.html#join">Get Issue 002</a>
    </nav>
  </header>

  <main>

    <a href="index.html#issues">← BACK TO ISSUES</a>

    <section>
      <p>// ISSUE 001 — A KICKERSHOE COMIC</p>
      <h1>THE MANTIS ORIGIN</h1>
      <p>
        A motion comic. A footnote in folklore. A shoe born from a broken leg
        and a quiet vow.
      </p>
      <p>
        <time datetime="2026-04">APR 2026</time>
        <mark>OUT NOW</mark>
      </p>
    </section>
```

Header/nav here duplicate index.html's pattern — same selectors from Task 1 (`body > header`, `body > header > a`, etc.) already cover this page too since both files share `styles.css`.

- [ ] **Step 2: Update `styles.css` selectors**

| Old class | New selector |
|---|---|
| `.back-link` | `main > a:first-child` |
| `.issue-intro` | `main > section:first-of-type` |
| `.issue-lede` | `main > section:first-of-type > p:nth-of-type(1)` |
| `.issue-meta-row` | `main > section:first-of-type > p:last-child` |
| `.status-out` | now `mark` (shared rule) — drop the old separate rule if it only set the accent color; keep any extra badge-specific declarations (padding/border) scoped to `main > section:first-of-type mark` |

- [ ] **Step 3: Visual check.**

- [ ] **Step 4: Commit**

```bash
git add issue-001.html styles.css
git commit -m "Rewrite issue-001 header, nav, and intro as semantic markup"
```

---

### Task 8: `issue-001.html` — comic grid

**Files:**
- Modify: `issue-001.html:44-132`
- Modify: `styles.css` (`.comic-grid-section`, `.comic-grid`, `.comic-frame`, `.comic-frame--cut-*`, `.comic-frame--wide`, `.comic-tag`, `.comic-caption`, `.comic-caption-label`, `.word`, `.in-view`)

- [ ] **Step 1: Rewrite markup**

Replace lines 45-132 with (showing the pattern for all 10 frames — repeat with each frame's own image/alt/caption text, in the same order as today):

```html
    <section>
      <header>
        <p>// THE FULL STORY</p>
        <h2>THE COMIC</h2>
      </header>
      <ul>
        <li>
          <span>01 // Long Ago</span>
          <img src="assets/images/issue-001/1friends.webp" alt="The mantis and his frog friend hidden in the tall grass at night" />
          <figure>
            <figcaption>CAPTION — 01</figcaption>
            <p>Once, there was a MANTIS named alberto that lived in the grass with his best friend, a bill.</p>
          </figure>
        </li>
        <!-- frames 02-10 follow the same shape, each li unchanged in content, just this shape -->
      </ul>
    </section>
```

Notes:
- `<span class="comic-caption">` wrapping a label-span + `<p>` becomes a real `<figure>`/`<figcaption>` pair — `figcaption` is the exact semantic element for "CAPTION — 01", and the `<p>` is the figure's content. This is a genuine semantic upgrade (figcaption already exists for exactly this purpose) and needs no class.
- `comic-frame--cut-br/bl/tr/tl` and `comic-frame--wide` modifier classes (control which corner is visually "cut" per frame, per a fixed repeating pattern: br, bl, wide, tr, tl, br, bl, wide, tr, tl) become `li:nth-of-type(10n+1)` etc. — see the CSS mapping below.
- The `.word` span-per-word wrapping (for the word-by-word caption reveal) is generated by the inline script (Task 9), not written in the HTML source — no markup change needed here for that part.

- [ ] **Step 2: Update `styles.css` selectors**

| Old class | New selector |
|---|---|
| `.comic-grid-section` | `main > section:nth-of-type(2)` |
| `.comic-grid` | `main > section:nth-of-type(2) > ul` |
| `.comic-frame` | `main > section:nth-of-type(2) li` |
| `.comic-frame--cut-br` (frames 1, 6) | `li:nth-of-type(5n+1)` |
| `.comic-frame--cut-bl` (frames 2, 7) | `li:nth-of-type(5n+2)` |
| `.comic-frame--wide` (frames 3, 8) | `li:nth-of-type(5n+3)` |
| `.comic-frame--cut-tr` (frames 4, 9) | `li:nth-of-type(5n+4)` |
| `.comic-frame--cut-tl` (frames 5, 10) | `li:nth-of-type(5n)` |
| `.comic-tag` | `li > span:first-child` |
| `.comic-caption` | `li > figure` |
| `.comic-caption-label` | `li > figure > figcaption` |
| `.in-view` (was toggled by IntersectionObserver) | removed entirely — reveal now driven by `animation-timeline: view()` on `li`, `li img`, and `li figure`, unconditionally applied (no class gate needed since the animation itself only plays as the element scrolls into view). See Task 9. |

Verify the `nth-of-type(5n+k)` pattern against the actual current repeating sequence (`br, bl, wide, tr, tl` repeating every 5 frames, confirmed from today's markup: frames 1-5 = br,bl,wide,tr,tl; frames 6-10 = br,bl,wide,tr,tl) before finalizing — adjust the modulus/offsets if frame count or pattern changes.

- [ ] **Step 3: Visual check** — confirm each frame's cut-corner shape matches its original modifier class, and captions/tags render correctly.

- [ ] **Step 4: Commit**

```bash
git add issue-001.html styles.css
git commit -m "Rewrite comic grid as semantic markup"
```

---

### Task 9: `issue-001.html` — lore section, footer, sound toggle, and reveal scripts

**Files:**
- Modify: `issue-001.html:134-227`
- Modify: `styles.css` (add scroll-driven animation rules for the comic reveal, replacing `IntersectionObserver`)

- [ ] **Step 1: Rewrite the lore section, footer, and sound toggle** using the exact same markup shape as Task 4 (lore) and Task 5 (footer/sound toggle) — this page reuses those sections verbatim (same `id="lore"` content, same footer, same sound-toggle button/script), so copy those blocks from `index.html` after Tasks 4 and 5 are complete, keeping this page's own header/nav/intro/comic-grid untouched.

- [ ] **Step 2: Replace the comic reveal script**

Replace lines 201-221 (the caption word-splitting + `IntersectionObserver` block) with:

```html
  <script>
    document.querySelectorAll('main > section:nth-of-type(2) li figure p').forEach(function (p) {
      var words = p.textContent.trim().split(/\s+/);
      p.innerHTML = words.map(function (word, i) {
        return '<span style="--i:' + i + '">' + word + '</span>';
      }).join(' ');
    });
  </script>
```

The `IntersectionObserver` + `classList.toggle('in-view', ...)` block is deleted — the scroll-triggered reveal now happens purely in CSS (Step 3). The remaining script only does the one-time word-splitting (DOM structure, not visual state), which still has no legitimate class-free alternative since it's generating markup, not toggling a state class.

- [ ] **Step 3: Add CSS scroll-driven animation to `styles.css`**

Add (near the comic grid rules from Task 8):

```css
@supports (animation-timeline: view()) {
  main > section:nth-of-type(2) li img,
  main > section:nth-of-type(2) li figure,
  main > section:nth-of-type(2) li figure p span {
    animation-timeline: view();
    animation-range: entry 0% cover 35%;
  }

  main > section:nth-of-type(2) li img {
    animation-name: reveal-image;
  }

  main > section:nth-of-type(2) li figure {
    animation-name: reveal-caption;
  }

  main > section:nth-of-type(2) li figure p span {
    animation-name: reveal-word;
    animation-delay: calc(var(--i) * 60ms);
  }
}

@keyframes reveal-image {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes reveal-caption {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes reveal-word {
  from { opacity: 0.2; }
  to { opacity: 1; }
}
```

Port over the exact opacity/transform/timing values from the pre-rewrite `.comic-frame.in-view` / `.word` keyframes instead of the placeholder values above — this block shows the *mechanism* (scroll-timeline replacing JS class toggling); use Step 4 to confirm final values match.

The `@supports` fallback means browsers without `animation-timeline` support simply show the content without the reveal animation (no `opacity: 0` stuck state) — confirm this by checking that outside the `@supports` block, `li`, `img`, `figure`, and caption `span`s have no base `opacity: 0` left over from the old always-hidden-until-`.in-view` rule (remove that base rule; default state must be fully visible).

- [ ] **Step 4: Visual + functional check**

- Scroll through the comic grid in a Chromium-based browser (has `animation-timeline: view()` support) — confirm images fade in, then captions, then words stagger in, matching today's behavior.
- Temporarily disable JS in devtools and confirm the page (including comic captions, sound toggle inert but harmless) still renders and reads correctly.
- Test in a browser without `animation-timeline` support (or force it via devtools) — confirm content is simply visible with no animation, not stuck hidden.

- [ ] **Step 5: Run the grep check**

```bash
grep -nE '<div| class=' issue-001.html
grep -noE 'id="[a-z0-9-]+"' issue-001.html
```

Expected: first command empty; second command only lists `id="lore"` (the only in-page anchor target `issue-001.html` itself defines — `origin`/`issues`/`shoe`/`join` are targets on `index.html`, referenced from here via `index.html#...` links, not local ids).

- [ ] **Step 6: Commit**

```bash
git add issue-001.html styles.css
git commit -m "Rewrite lore/footer/sound-toggle and switch comic reveal to CSS scroll-driven animation"
```

---

### Task 10: Full-site regression pass

**Files:** none new — verification only.

- [ ] **Step 1:** Run the grep check from Task 6 and Task 9 against both files one more time in the same command:

```bash
grep -nE '<div| class=' index.html issue-001.html
grep -noE 'id="[a-z0-9-]+"' index.html issue-001.html
```

Expected: first command empty. Second command lists exactly: `origin`, `issues`, `shoe`, `lore` (index.html), `join`, and `lore` (issue-001.html) — no duplicates causing invalid duplicate-id HTML across the *same* document (each id appears once per file, which is fine — they're different documents).

- [ ] **Step 2:** Validate both HTML files with the W3C validator's local check (no network dependency — use a local validator if available, e.g. `npx html-validate index.html issue-001.html`, or manually confirm no orphaned closing tags from the rewrite).

- [ ] **Step 3:** Click through both pages end to end in a browser: nav links jump to the right sections, "Back to Issues" works, issue card links work, lore accordion opens/closes, join form shows the success message, sound toggle flips `aria-pressed` and label text, comic reveal animates on scroll.

- [ ] **Step 4:** Run `npm run build` to confirm the Speed Insights vendoring step still works untouched, and confirm `assets/js/speed-insights-init.js`'s `<script type="module">` tag is still present and unmodified in both files.

- [ ] **Step 5:** Update `README.md` if the project structure section needs any changes reflecting the new script (per standing instruction to keep README in sync) — likely no change needed here since file *names* didn't change, only their contents.

- [ ] **Step 6: Final commit** (only if Steps 1-5 required fixes):

```bash
git add -A
git commit -m "Fix regressions found in full-site semantic HTML review"
```

---

## Self-review notes

- **Spec coverage:** All 9 spec decisions are covered — id scoping (Tasks 1-9 conventions), `<mark>` for accent (Tasks 1-5, 7), decorative elements to CSS (Tasks 1, 3, 6), structural/attribute CSS selectors (every task's mapping table), `aria-pressed` sound toggle (Task 5), CSS scroll-driven reveal (Task 9), `hidden` form success (Task 5), `<time>`/`<data>` SEO upgrades (Tasks 2, 7), progressive enhancement without JS (Task 9 Step 4).
- **Known risk carried from the spec:** `nth-of-type`/positional selectors are inherently coupled to current source order — Task 8's frame-pattern table calls this out explicitly with the exact modulus to keep it correct.
- **Scope not covered here (intentionally):** no automated test suite exists for this static site; verification throughout is grep + manual visual/functional checks, matching how the existing repo already ships (no test framework in `package.json`).
