# Hero Slider (Four-Story Panel Slide) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `index.html`'s hero (`#origin`) into a two-slide slider: slide 1 is the existing "MANTIS ORIGIN" headline (untouched), slide 2 is a new full-bleed 4-panel "story chooser" (Mantis / Elephant / Goat OG / Tunnel of Ghosts) that expands on hover/tap to cycle comic pages and reveal a "read" CTA.

**Architecture:** Pure vanilla HTML/CSS/JS, no build step, no new dependencies — matches the rest of this static site exactly. Slide 2 is a sibling `<article>` of the existing `<header>` inside `#origin`, shown/hidden via the `hidden` attribute (already a global convention in `styles.css`). Panel expand/collapse state is driven entirely by one `aria-expanded` attribute per panel, toggled by JS on `mouseenter`/`mouseleave` (mouse) or `click` (touch) — CSS only ever reads that attribute, so desktop and mobile share one styling path. The 4 panels reuse the same `<data>`/`<h3>`/`<p>`/`<a>`/`<footer>` shape already used by `#issues` cards.

**Tech Stack:** Static HTML/CSS/JS (no framework). Relies on `:has()` (already used elsewhere in `styles.css` for issue-page scoping) and SVG `feTurbulence`/`feDisplacementMap` for the hand-drawn divider.

**Testing note:** This project has no automated test suite (static HTML/CSS/JS, verified manually — see `README.md` / existing commit history). Every task below substitutes "write a failing test" with a concrete manual-verification checklist using the Browser tool against the local file (`file:///D:/Greenwich/prototype/kickershoe-html/index.html`), matching how the rest of the site has been built and verified.

---

## File Structure

- **Modify `index.html`** — add slide 2 markup (`<article>` with SVG filter defs, eyebrow label, 4-panel `<ul>`) and the `<nav>` dot-switcher as new children of `#origin`, plus one new inline `<script>` block for slider + panel behavior.
- **Modify `styles.css`** — add one new CSS section ("Hero Slider — Slide 2" + "Hero Slider — Dots") between the existing "Hero Teaser" block and the "Issues" block, including its own `@media (max-width: 720px)` and `@media (prefers-reduced-motion: reduce)` rules.

No new files. No changes to slide 1's existing markup or CSS.

---

### Task 1: Add slide 2 markup to `index.html`

**Files:**
- Modify: `index.html:81-82`

- [ ] **Step 1: Write the manual-verification checklist for this task**

Before changing anything, confirm current behavior: open `file:///D:/Greenwich/prototype/kickershoe-html/index.html` in the Browser tool. The hero shows only the "MANTIS ORIGIN" headline — no second slide, no dots. This is the baseline "fails" state we're changing.

- [ ] **Step 2: Insert the slide 2 markup**

In `index.html`, replace lines 81-82:

```html
      </header>
    </section>
```

with:

```html
      </header>

      <article hidden>
        <svg id="hero-ink-wobble-defs" aria-hidden="true" style="position:absolute;width:0;height:0">
          <filter id="hero-ink-wobble">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.06" numOctaves="2" seed="4" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        <p>// THE UNIVERSE</p>

        <ul>
          <li aria-expanded="false">
            <img src="assets/images/issue-001/1friends.webp" alt="The mantis and his frog friend hidden in the tall grass at night" />
            <data value="01">01</data>
            <footer>
              <h3>THE MANTIS ORIGIN</h3>
              <p>A shoe born from a broken leg and a quiet vow.</p>
              <a href="issue-001.html"><span>READ ISSUE 001</span><span>→</span></a>
            </footer>
          </li>
          <li aria-expanded="false">
            <img src="assets/images/issue-002/1dribble.webp" alt="A young elephant dribbling a basketball alone on a city street court at night" />
            <data value="02">02</data>
            <footer>
              <h3>THE ELEPHANT IN THE ROOM</h3>
              <p>A basketball dream, a broken hop, and the high-top that started it all.</p>
              <a href="issue-002.html"><span>READ ISSUE 002</span><span>→</span></a>
            </footer>
          </li>
          <li aria-expanded="false">
            <img src="assets/images/issue-003/1locker.webp" alt="A goat boxer sitting alone in a dim locker room, wrapping his hands" />
            <data value="03">03</data>
            <footer>
              <h3>THE GOAT OG</h3>
              <p>An undersized goat, a ring stacked against him, and the boot forged in defeat.</p>
              <a href="issue-003.html"><span>READ ISSUE 003</span><span>→</span></a>
            </footer>
          </li>
          <li aria-expanded="false">
            <img src="assets/images/covers/cover-004.webp" alt="Cover art for Tunnel of Ghosts — Issue 004, coming soon" />
            <data value="04">04</data>
            <footer>
              <h3>TUNNEL OF GHOSTS</h3>
              <p>The next chapter is still being inked.</p>
              <span>SOON</span>
            </footer>
          </li>
        </ul>
      </article>

      <nav aria-label="Hero slides">
        <button aria-current="true"><span></span><span>SLIDE 1 — ORIGIN</span></button>
        <button aria-current="false"><span></span><span>SLIDE 2 — THE UNIVERSE</span></button>
      </nav>
    </section>
```

- [ ] **Step 3: Verify it renders without breaking slide 1**

Reload `file:///D:/Greenwich/prototype/kickershoe-html/index.html` in the Browser tool. Expected: hero looks *identical* to before (article has `hidden`, so it's invisible) — but two small dot buttons now sit at the bottom of the hero (unstyled, plain browser buttons, since no CSS exists yet — that's expected at this point).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Add hero slide 2 markup: four-story panel list and slide dots"
```

---

### Task 2: Style slide 2 (panels, divider, dots, reveal states)

**Files:**
- Modify: `styles.css:295` (insert after the Hero Teaser block, before `/* ============ Issues ============ */`)

- [ ] **Step 1: Manual-verification checklist**

Before adding CSS: click the second dot button in the browser (with browser devtools, or temporarily remove the `hidden` attribute via the JS console: `document.querySelector('#origin > article').hidden = false`). Confirm the 4 panels currently render unstyled — full-width stacked plain list items with default image sizes, no colors, no hover behavior. This is the "before" state.

- [ ] **Step 2: Insert the CSS**

In `styles.css`, insert the following immediately before the `/* ============ Issues ============ */` comment (currently at line 297):

```css
/* ============ Hero Slider — Slide 2: Four Stories ============ */
#origin > article {
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
}

#origin > article > p {
  position: absolute;
  top: 24px; left: 32px;
  z-index: 4;
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--primary);
}

#origin > article > ul {
  list-style: none;
  display: flex;
  height: 100%;
}

#origin > article li {
  position: relative;
  flex: 1 1 0%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  background: var(--ink);
  transition: flex-grow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
#origin > article > ul:has(li[aria-expanded="true"]) li:not([aria-expanded="true"]) {
  flex: 0.5 1 0%;
}
#origin > article li[aria-expanded="true"] {
  flex: 6 1 0%;
}

#origin > article li::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(to top, var(--ink) 0%, rgba(5, 5, 5, 0.25) 45%, rgba(5, 5, 5, 0.6) 100%);
  z-index: 2;
}

#origin > article li:not(:last-child)::after {
  content: '';
  position: absolute; top: 0; right: -2px; width: 5px; height: 100%;
  z-index: 3;
  background: var(--bone);
  filter: url(#hero-ink-wobble);
}

#origin > article li img {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

#origin > article li data {
  position: absolute; top: 16px; left: 12px;
  z-index: 4;
  background: var(--primary); color: var(--ink);
  padding: 4px 8px;
  font-size: 9px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.2em;
}

#origin > article li footer {
  position: absolute; left: 0; right: 0; bottom: 0;
  z-index: 4;
  padding: 16px;
  display: flex; flex-direction: column; align-items: flex-start; gap: 10px;
}

#origin > article li footer h3 {
  font-family: var(--font-display);
  color: var(--bone);
  font-size: 13px; letter-spacing: 0.1em;
  writing-mode: vertical-rl; text-orientation: mixed;
  white-space: nowrap;
}
#origin > article li[aria-expanded="true"] footer h3 {
  writing-mode: horizontal-tb;
  font-size: clamp(22px, 3vw, 34px);
  line-height: 1.05;
}

#origin > article li footer p,
#origin > article li footer a,
#origin > article li footer > span {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.3s ease 0.1s, transform 0.3s ease 0.1s;
  pointer-events: none;
}
#origin > article li[aria-expanded="true"] footer p,
#origin > article li[aria-expanded="true"] footer a,
#origin > article li[aria-expanded="true"] footer > span {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
#origin > article li footer p {
  max-width: 340px;
  font-size: 13px; line-height: 1.5;
  color: rgba(241, 236, 224, 0.85);
}
#origin > article li footer a {
  display: inline-flex; align-items: center; gap: 8px;
  border: 2px solid var(--primary);
  background: var(--primary); color: var(--ink);
  font-family: var(--font-display);
  font-size: 14px; letter-spacing: 0.05em;
  padding: 8px 14px;
  transition: background 0.2s, color 0.2s;
}
#origin > article li footer a:hover { background: transparent; color: var(--primary); }
#origin > article li footer > span {
  display: inline-flex;
  border: 2px solid var(--bone);
  color: var(--bone);
  font-family: var(--font-mono);
  font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em;
  padding: 6px 12px;
}

/* ============ Hero Slider — Dots ============ */
#origin > nav {
  position: absolute; bottom: 20px; left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  display: flex; gap: 10px;
}
#origin > nav button {
  display: flex; align-items: center; gap: 8px;
  border: 2px solid rgba(241, 236, 224, 0.35);
  background: rgba(5, 5, 5, 0.6);
  color: rgba(241, 236, 224, 0.6);
  padding: 6px 12px;
  font-family: var(--font-mono);
  font-size: 9px; text-transform: uppercase; letter-spacing: 0.2em;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
#origin > nav button > span:first-child {
  display: inline-block; width: 6px; height: 6px; border-radius: 50%;
  background: rgba(241, 236, 224, 0.4);
}
#origin > nav button[aria-current="true"] { border-color: var(--primary); color: var(--bone); }
#origin > nav button[aria-current="true"] > span:first-child { background: var(--primary); }

@media (max-width: 720px) {
  #origin > article > ul { flex-direction: column; }
  #origin > article li { flex: 1 1 0%; transition: flex-grow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
  #origin > article > ul:has(li[aria-expanded="true"]) li:not([aria-expanded="true"]) { flex: 0.4 1 0%; }
  #origin > article li[aria-expanded="true"] { flex: 4 1 0%; }
  #origin > article li:not(:last-child)::after {
    top: auto; bottom: -2px; right: 0; width: 100%; height: 5px;
  }
  #origin > article li footer h3 { writing-mode: horizontal-tb; font-size: 15px; }
  #origin > article li[aria-expanded="true"] footer h3 { font-size: 22px; }
}

@media (prefers-reduced-motion: reduce) {
  #origin > article li,
  #origin > article li footer h3,
  #origin > article li footer p,
  #origin > article li footer a,
  #origin > article li footer > span,
  #origin > article li img {
    transition: none !important;
  }
}
```

- [ ] **Step 3: Verify visually**

Reload the page (article still `hidden` — toggle it off via devtools console as in Step 1 to preview, or wait until Task 3 wires up the dots). Expected once visible: 4 equal-width panels edge-to-edge, dark gradient scrim, green issue-number badges top-left, a wobbly bone-colored divider between panels, vertical story titles at the bottom of each sliver. Two dot buttons render styled (dark pill with a small dot + label) at the bottom-center. Manually toggle `aria-expanded="true"` on one `<li>` via devtools to confirm: that panel grows, its divider survives, title flips horizontal and grows, blurb + CTA fade in, siblings shrink to slivers. Check `@media (max-width: 720px)` by resizing the browser to <720px width — panels should stack vertically instead.

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "Style hero slide 2: four-story panels, ink-wobble divider, slide dots"
```

---

### Task 3: Wire up slide switching (dots + autoplay)

**Files:**
- Modify: `index.html:276` (insert new `<script>` block immediately after the existing one, before the Vercel Speed Insights comment)

- [ ] **Step 1: Manual-verification checklist**

Reload the page. Expected (current/"failing" state): clicking a dot does nothing — both `header` and `article` markup exist but there's no logic to hide one and show the other, and `aria-current` never changes.

- [ ] **Step 2: Insert the slide-switching script**

In `index.html`, insert immediately after the existing `</script>` tag (the one containing the sound-toggle and newsletter-form handlers, currently ending at line 276) and before the `<!-- Vercel Speed Insights -->` comment:

```html
  <script>
    (function () {
      var origin = document.querySelector('#origin');
      var slides = [origin.querySelector(':scope > header'), origin.querySelector(':scope > article')];
      var dots = origin.querySelectorAll(':scope > nav button');
      var current = 0;
      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var autoplayTimer = null;

      function showSlide(index) {
        slides.forEach(function (slide, i) { slide.hidden = i !== index; });
        dots.forEach(function (dot, i) { dot.setAttribute('aria-current', String(i === index)); });
        current = index;
      }

      function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
      }

      function startAutoplay() {
        if (reduceMotion) return;
        stopAutoplay();
        autoplayTimer = setInterval(function () {
          showSlide((current + 1) % slides.length);
        }, 7000);
      }

      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
          showSlide(i);
          startAutoplay();
        });
      });

      origin.addEventListener('mouseenter', stopAutoplay);
      origin.addEventListener('mouseleave', startAutoplay);

      showSlide(0);
      startAutoplay();
    })();
  </script>
```

- [ ] **Step 3: Verify manually**

Reload `file:///D:/Greenwich/prototype/kickershoe-html/index.html` in the Browser tool.
- Expected: slide 1 shows initially. Clicking the second dot switches to the 4-panel slide instantly, and its `aria-current` becomes `"true"` (inspect via `read_page` or devtools) while the first dot's becomes `"false"`.
- Wait ~7 seconds without touching the page: it should auto-advance to the other slide.
- Hover anywhere over the hero: confirm (via a longer wait) that auto-advance pauses while hovered, and resumes after moving the mouse away.
- In devtools, run `window.matchMedia('(prefers-reduced-motion: reduce)').matches` to confirm it reads `false` normally; this can't be easily toggled live, so just confirm the `reduceMotion` guard exists in the code (already covered by review, not a runtime check).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Wire up hero slide switching: dots, autoplay, pause-on-hover"
```

---

### Task 4: Wire up panel expand/collapse + comic-image cycling

**Files:**
- Modify: `index.html` (extend the `<script>` block added in Task 3, same file, immediately before its closing `})();`)

- [ ] **Step 1: Manual-verification checklist**

Switch to slide 2 in the browser (click the second dot). Expected (current/"failing" state): hovering or clicking a panel does nothing — `aria-expanded` never changes, so every panel stays a static sliver with the vertical title only.

- [ ] **Step 2: Insert the panel-cycling script**

In `index.html`, insert this code immediately before the final `})();` of the `<script>` block added in Task 3 (i.e., right after the `startAutoplay();` call at the end):

```javascript
      var panelImages = [
        ['assets/images/issue-001/1friends.webp', 'assets/images/issue-001/6shoe.webp', 'assets/images/issue-001/9backside.webp'],
        ['assets/images/issue-002/1dribble.webp', 'assets/images/issue-002/5spring-shoe.webp', 'assets/images/issue-002/8world.webp'],
        ['assets/images/issue-003/1locker.webp', 'assets/images/issue-003/8victory.webp', 'assets/images/issue-003/12f50.webp'],
        ['assets/images/covers/cover-004.webp']
      ];
      var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      var panels = origin.querySelectorAll(':scope > article > ul > li');

      panels.forEach(function (li, i) {
        var img = li.querySelector('img');
        var imgs = panelImages[i];
        var cycleTimer = null;
        var lastIndex = 0;

        function startCycle() {
          if (reduceMotion || imgs.length < 2) return;
          cycleTimer = setInterval(function () {
            var next = lastIndex;
            while (next === lastIndex) next = Math.floor(Math.random() * imgs.length);
            lastIndex = next;
            img.style.opacity = 0;
            setTimeout(function () {
              img.src = imgs[next];
              img.style.opacity = 1;
            }, 300);
          }, 2100);
        }

        function stopCycle() {
          clearInterval(cycleTimer);
          lastIndex = 0;
          img.src = imgs[0];
          img.style.opacity = 1;
        }

        function expand() {
          panels.forEach(function (other) { other.setAttribute('aria-expanded', 'false'); });
          li.setAttribute('aria-expanded', 'true');
          startCycle();
        }

        function collapse() {
          li.setAttribute('aria-expanded', 'false');
          stopCycle();
        }

        if (canHover) {
          li.addEventListener('mouseenter', expand);
          li.addEventListener('mouseleave', collapse);
        } else {
          li.addEventListener('click', function (event) {
            if (event.target.closest('a')) return;
            if (li.getAttribute('aria-expanded') === 'true') {
              collapse();
            } else {
              expand();
            }
          });
        }
      });
```

- [ ] **Step 3: Verify manually**

Reload, switch to slide 2.
- **Desktop (default browser viewport, hover-capable):** hover panel 1 (Mantis). Expected: it grows to dominant width, siblings shrink to slivers, title flips horizontal, blurb + "READ ISSUE 001 →" CTA fade in, and the image visibly swaps to a different Mantis page roughly every ~2.1s. Move the mouse to panel 2: panel 1 collapses back to a sliver (image resets to `1friends.webp`), panel 2 takes over the same way. Hover panel 4 (Tunnel of Ghosts): it expands and shows the "SOON" tag, but the image never changes (only one image in its array).
- Click the "READ ISSUE 001 →" link while panel 1 is expanded: confirm it navigates to `issue-001.html` (use `navigate` back afterward, or check the link's `href` via `read_page` instead of actually following it, to avoid leaving the test page).
- **Mobile:** use `resize_window` (preset `mobile`) and reload. Panels should now be stacked full-width bands. Tap panel 1: it should expand downward (per the `max-width: 720px` height rule from Task 2), start cycling, and reveal its CTA. Tap panel 2: panel 1 collapses, panel 2 expands. Reset the viewport with `resize_window` preset `desktop` afterward.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Wire up hero panel expand/collapse and comic-image cycling"
```

---

### Task 5: Full cross-breakpoint QA pass

**Files:** none (verification only)

- [ ] **Step 1: Desktop pass**

Open `file:///D:/Greenwich/prototype/kickershoe-html/index.html` at default desktop size. Walk through: slide 1 loads and looks unchanged from before this feature existed; dots switch slides; autoplay advances after ~7s and pauses on hover; each of the 4 panels expands on hover with correct title/blurb/CTA and image cycling at the ~2.1s pace approved during design; the ink-wobble divider is visible and survives panel resizing; panel 4 shows "SOON" and a static image.

- [ ] **Step 2: Mobile pass**

`resize_window` to `mobile` preset, reload. Confirm: slide 1 still renders correctly at mobile width (unchanged, pre-existing behavior — just a regression check). Switch to slide 2: panels are stacked vertically; tapping one expands it in place, cycles images, reveals the CTA link which is tappable; tapping a different panel collapses the first and expands the new one.

- [ ] **Step 3: Reduced-motion pass**

`resize_window` back to `desktop` preset. Set `colorScheme` aside — instead, in the Browser tool, there's no direct reduced-motion emulation tool listed; approximate by reading the JS/CSS: confirm via `javascript_tool` (`javascript_exec`) that running `window.matchMedia('(prefers-reduced-motion: reduce)').matches` returns `false` under normal settings (expected, since the OS-level setting isn't on) — this confirms the guard code path exists and is wired to the correct media query string (typo-checked against `styles.css`'s existing reduced-motion blocks), rather than exercising the reduced-motion behavior live.

- [ ] **Step 4: Final commit (if any QA fixes were needed)**

If Steps 1-3 surfaced any visual issues (overlapping text, divider misalignment, spacing), fix them directly in `styles.css` and commit:

```bash
git add styles.css
git commit -m "Polish hero slide 2 spacing after cross-breakpoint QA"
```

If no fixes were needed, this task requires no commit — just confirm all prior commits are in place with `git log --oneline -6`.

---

## Self-Review Notes

- **Spec coverage:** slide 1 untouched (Task 1 only adds siblings) ✓; 4 panels mapped to the 3 issues + issue 004 ✓; accordion hover-grow behavior via `:has()` ✓; random image cycling ~2s+ pace ✓; CTA / "SOON" tag on hover ✓; ink-scratch divider via SVG filter ✓; dots + autoplay + pause-on-hover ✓; mobile stacking + tap-to-expand ✓; minimal eyebrow-only copy on slide 2 ✓; reduced-motion disables autoplay and cycling ✓.
- **Type/selector consistency:** `aria-expanded` is the single source of truth read by both CSS (`li[aria-expanded="true"]`) and JS (`expand()`/`collapse()`) — no divergent naming across tasks. `panelImages` array order (Task 4) matches panel order in the markup (Task 1) exactly issue-001 → 002 → 003 → cover-004.
- **No placeholders:** every step has complete, runnable code — no "add appropriate styling" or "TBD" left anywhere.
