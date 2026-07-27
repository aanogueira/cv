# Portfolio Site + Inter CV Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Switch the LaTeX CV to the Inter font (via LuaLaTeX) and ship a one-page, terminal-minimal personal portfolio site on GitHub Pages, driven by a single `data.json` and linking to the CV, OSS projects, and techquests.dev.

**Architecture:** Two independent workstreams in the `cv` repo. (1) CV: vendor Inter OTFs, add `fontspec`, compile with LuaLaTeX in Makefile + CI. (2) Site: static `site/` folder (no build step) where `main.js` renders `data.json` into a themed page; deployed via a GitHub Pages Actions workflow; CV linked through existing release artifacts.

**Tech Stack:** LaTeX (LuaLaTeX + fontspec), plain HTML/CSS/vanilla JS, GitHub Actions, GitHub Pages.

**Testing note:** The chosen approach is "plain HTML/CSS, no build step / no dependencies", so there is no JS test runner. Verification is done with concrete manual commands (build the PDF, serve the site locally, grep the served output) with expected results stated per step. This is the deliberate TDD-adaptation for a static, dependency-free site.

**Working branch:** `andre.nogueira/portfolio-site-and-inter-cv` (already created). Commit with `commit` (gpg-signed, `--signoff`, no co-author trailer) per user workflow.

---

## Workstream 1 — Inter font for the CV

### Task 1: Vendor the Inter fonts

**Files:**
- Create: `fonts/Inter-Regular.otf`, `fonts/Inter-Italic.otf`, `fonts/Inter-Bold.otf`, `fonts/Inter-BoldItalic.otf`, `fonts/Inter-SemiBold.otf`, `fonts/LICENSE.txt`

- [ ] **Step 1: Copy the OTFs + license into the repo**

```bash
mkdir -p fonts
cp /Users/andre.nogueira/Mollie/gitlab/mcp/mollie-doc/template/fonts/Inter-Regular.otf \
   /Users/andre.nogueira/Mollie/gitlab/mcp/mollie-doc/template/fonts/Inter-Italic.otf \
   /Users/andre.nogueira/Mollie/gitlab/mcp/mollie-doc/template/fonts/Inter-Bold.otf \
   /Users/andre.nogueira/Mollie/gitlab/mcp/mollie-doc/template/fonts/Inter-BoldItalic.otf \
   /Users/andre.nogueira/Mollie/gitlab/mcp/mollie-doc/template/fonts/Inter-SemiBold.otf \
   /Users/andre.nogueira/Mollie/gitlab/mcp/mollie-doc/template/fonts/LICENSE.txt \
   fonts/
```

- [ ] **Step 2: Verify the files landed and are not gitignored**

Run: `ls fonts/ && git check-ignore fonts/Inter-Regular.otf; echo "exit=$?"`
Expected: all 6 files listed; `git check-ignore` prints nothing and `exit=1` (i.e. NOT ignored). If it IS ignored, add `!fonts/` exception to `.gitignore`.

- [ ] **Step 3: Commit**

```bash
git add fonts/
commit -m "feat(cv): vendor Inter OTF fonts (OFL)"
```

---

### Task 2: Switch cv.tex to Inter via fontspec

**Files:**
- Modify: `cv.tex` (insert font config after the `parskip`/typography block, before `\usepackage{xcolor}` — around line 17)

- [ ] **Step 1: Add the fontspec + Inter block**

Insert immediately after line 16 (`\setlength{\parskip}{2pt}`) in `cv.tex`:

```latex

% Main font: Inter (requires LuaLaTeX/XeLaTeX — see Makefile)
\usepackage{fontspec}
\setmainfont{Inter}[
  Path = fonts/,
  Extension = .otf,
  UprightFont = *-Regular,
  ItalicFont = *-Italic,
  BoldFont = *-Bold,
  BoldItalicFont = *-BoldItalic,
]
```

- [ ] **Step 2: Build with LuaLaTeX to verify Inter loads**

Run: `lualatex -interaction=nonstopmode cv.tex >/dev/null; echo "exit=$?"`
Expected: `exit=0` and `cv.pdf` regenerated. (If `lualatex` is missing locally, this task's verification defers to Task 3/CI — note it and continue.)

- [ ] **Step 3: Confirm the PDF embeds Inter**

Run: `pdffonts cv.pdf | grep -i inter`
Expected: one or more lines mentioning `Inter` (embedded `yes`). If `pdffonts` is unavailable, open `cv.pdf` and visually confirm the sans-serif changed.

- [ ] **Step 4: Commit**

```bash
git add cv.tex
commit -m "feat(cv): use Inter via fontspec"
```

---

### Task 3: Switch the Makefile to LuaLaTeX

**Files:**
- Modify: `Makefile:1`

- [ ] **Step 1: Change the compiler**

Change line 1 of `Makefile` from:

```make
TEX = pdflatex
```

to:

```make
TEX = lualatex
```

(Leave `FLAGS = -interaction=nonstopmode` and all targets unchanged.)

- [ ] **Step 2: Clean build both variants**

Run: `make clean && make all; echo "exit=$?"`
Expected: `exit=0`; both `cv.pdf` and `cv-dark.pdf` produced.

- [ ] **Step 3: Check for new overfull boxes introduced by Inter's metrics**

Run: `grep -c "Overfull \\\\hbox" cv.log`
Expected: `0` ideally. If > 0, inspect the offending lines (header contact row and dense bullets are the usual suspects); fix by minor spacing/`\tolerance` tweaks only. Do not alter content.

- [ ] **Step 4: Commit**

```bash
git add Makefile
commit -m "build(cv): compile with lualatex for fontspec"
```

---

### Task 4: Switch CI to LuaLaTeX

**Files:**
- Modify: `.github/workflows/build.yml:16-24` (the two `latex-action` steps)

- [ ] **Step 1: Tell latex-action to use LuaLaTeX**

For BOTH build steps (`Build cv.pdf` and `Build cv-dark.pdf`), add `latexmk_use_lualatex: true` under `with:`. The two steps become:

```yaml
      - name: Build cv.pdf
        uses: xu-cheng/latex-action@v4
        with:
          root_file: cv.tex
          latexmk_use_lualatex: true

      - name: Build cv-dark.pdf
        uses: xu-cheng/latex-action@v4
        with:
          root_file: cv-dark.tex
          latexmk_use_lualatex: true
```

- [ ] **Step 2: Verify YAML is valid**

Run: `python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/build.yml')); print('ok')"`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/build.yml
commit -m "ci(cv): build PDFs with lualatex"
```

(CI itself is verified after the branch is pushed and the workflow runs — checked at handoff time, not blocking this task.)

---

## Workstream 2 — Personal portfolio site

### Task 5: Create the data source of truth (`data.json`)

**Files:**
- Create: `site/data.json`

- [ ] **Step 1: Write `site/data.json`**

```json
{
  "profile": {
    "name": "André A. Nogueira",
    "role": "Senior Platform Engineer",
    "location": "Lisbon, Portugal",
    "tagline": "I make infrastructure invisible — self-service platforms at scale.",
    "about": "Platform engineering leader with 6+ years building developer-centric infrastructure at scale. Promoted twice in under two years at Mollie, where I own the internal cloud platform behind 1000+ Kubernetes clusters and 500+ engineers. Upstream Terraform GCP contributor. Go, Rust & TypeScript."
  },
  "links": [
    { "label": "CV (light)", "href": "https://github.com/aanogueira/cv/releases/latest/download/cv.pdf" },
    { "label": "CV (dark)", "href": "https://github.com/aanogueira/cv/releases/latest/download/cv-dark.pdf" },
    { "label": "github", "href": "https://github.com/aanogueira" },
    { "label": "linkedin", "href": "https://linkedin.com/in/aanogueira" },
    { "label": "techquests.dev", "href": "https://techquests.dev" },
    { "label": "youtube (soon)", "href": "https://techquests.dev", "muted": true },
    { "label": "email", "href": "mailto:aanogueira@protonmail.com" }
  ],
  "projects": [
    { "name": "houndr", "stack": "Rust", "desc": "Trigram-based code-search engine with sub-millisecond search and zero-copy mmap indexing.", "href": "https://github.com/aanogueira" },
    { "name": "Code Search", "stack": "Go, Next.js", "desc": "Self-hosted platform for searching across repositories with bulk find-and-replace and automated PR creation.", "href": "https://github.com/aanogueira" },
    { "name": "git-context", "stack": "Go", "desc": "CLI to switch between multiple Git identities and configurations. 93%+ test coverage.", "href": "https://github.com/aanogueira" },
    { "name": "howto", "stack": "Go", "desc": "AI-powered shell command assistant (OpenAI, Anthropic, Gemini, DeepSeek).", "href": "https://github.com/aanogueira" },
    { "name": "crontab-guru", "stack": "Go, Bubble Tea", "desc": "TUI for creating and validating cron expressions with real-time feedback.", "href": "https://github.com/aanogueira" },
    { "name": "HashPad", "stack": "JS, Web Crypto", "desc": "Zero-knowledge encrypted notepad stored entirely in the URL hash. No backend.", "href": "https://github.com/aanogueira" }
  ],
  "writing": {
    "blurb": "Technical blog and (soon) YouTube channel — deep dives on platform engineering, Go, Rust, and infrastructure.",
    "blog": { "label": "techquests.dev", "href": "https://techquests.dev" },
    "youtube": { "label": "YouTube (soon)", "href": "https://techquests.dev" }
  },
  "experience": [
    { "company": "Mollie", "role": "Senior Platform Engineer", "years": "2023 – Present" },
    { "company": "SteelEye", "role": "Site Reliability Engineer", "years": "2021 – 2023" },
    { "company": "Truphone", "role": "DevSecOps Engineer", "years": "2020 – 2021" },
    { "company": "La Redoute", "role": "DevOps Engineer", "years": "2019 – 2020" }
  ],
  "cvUrl": "https://github.com/aanogueira/cv/releases/latest/download/cv.pdf",
  "sourceUrl": "https://github.com/aanogueira/cv"
}
```

> Note for the implementer: project `href`s point at the GitHub profile as a safe default. André can later replace each with the exact repo URL — no code change needed, it's pure data.

- [ ] **Step 2: Validate JSON**

Run: `python3 -c "import json; json.load(open('site/data.json')); print('ok')"`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add site/data.json
commit -m "feat(site): add data.json source of truth"
```

---

### Task 6: Create the HTML shell with SEO/OG meta

**Files:**
- Create: `site/index.html`

- [ ] **Step 1: Write `site/index.html`**

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>André A. Nogueira — Senior Platform Engineer</title>
  <meta name="description" content="André A. Nogueira — Senior Platform Engineer in Lisbon. Platforms at scale, open-source tools in Go & Rust, and writing at techquests.dev.">
  <meta name="author" content="André A. Nogueira">

  <!-- Open Graph / Twitter -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="André A. Nogueira — Senior Platform Engineer">
  <meta property="og:description" content="Platforms at scale, open-source tools in Go & Rust, and writing at techquests.dev.">
  <meta property="og:url" content="https://aanogueira.dev">
  <meta property="og:image" content="https://aanogueira.dev/assets/og-image.png">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <button id="theme-toggle" class="theme-toggle" aria-label="Toggle color theme" type="button">◐</button>

  <main id="app" class="wrap">
    <noscript>
      <p>This page renders from <code>data.json</code> with JavaScript.
      Meanwhile: <a href="https://github.com/aanogueira/cv/releases/latest/download/cv.pdf">download the CV</a>,
      or visit <a href="https://github.com/aanogueira">GitHub</a> and
      <a href="https://techquests.dev">techquests.dev</a>.</p>
    </noscript>
  </main>

  <script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify the static meta is present (SEO works pre-JS)**

Run: `grep -c 'og:title' site/index.html`
Expected: `1`

- [ ] **Step 3: Commit**

```bash
git add site/index.html
commit -m "feat(site): HTML shell with SEO/OG meta and noscript fallback"
```

---

### Task 7: Create the stylesheet (terminal aesthetic + themes)

**Files:**
- Create: `site/styles.css`

- [ ] **Step 1: Write `site/styles.css`**

```css
@font-face {
  font-family: "Inter";
  src: url("assets/fonts/InterVariable.woff2") format("woff2");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Inter";
  src: url("assets/fonts/InterVariable-Italic.woff2") format("woff2");
  font-weight: 100 900;
  font-style: italic;
  font-display: swap;
}

:root {
  --mono: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace;
  --sans: "Inter", system-ui, -apple-system, sans-serif;
}
html[data-theme="dark"] {
  --bg: #0d0f12;  --bg2: #05070a; --fg: #c9d1d9; --fg-strong: #e6edf3;
  --muted: #5b6673; --accent: #8cc5cf; --rule: #20262e; --cursor: #3fb950;
}
html[data-theme="light"] {
  --bg: #ffffff; --bg2: #f6f8fa; --fg: #1f2328; --fg-strong: #000000;
  --muted: #6e7781; --accent: #0645ad; --rule: #d0d7de; --cursor: #1a7f37;
}

* { box-sizing: border-box; }
body {
  margin: 0; background: var(--bg); color: var(--fg);
  font-family: var(--sans); line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.wrap { max-width: 720px; margin: 0 auto; padding: 48px 24px 64px; }

.theme-toggle {
  position: fixed; top: 16px; right: 16px; z-index: 10;
  background: var(--bg2); color: var(--fg); border: 1px solid var(--rule);
  border-radius: 8px; width: 40px; height: 40px; font-size: 18px; cursor: pointer;
}
.theme-toggle:hover { color: var(--accent); border-color: var(--accent); }

.prompt { font-family: var(--mono); color: var(--muted); font-size: 13px; margin-bottom: 20px; }
.prompt .cursor { color: var(--cursor); }

h1 { font-size: 30px; font-weight: 700; margin: 0; color: var(--fg-strong); letter-spacing: -0.01em; }
.role { color: var(--accent); font-size: 15px; margin-top: 4px; }
.loc { color: var(--muted); font-family: var(--mono); font-size: 13px; margin-top: 2px; }
.tag { color: var(--fg); margin-top: 16px; font-size: 15px; }

.links { display: flex; flex-wrap: wrap; gap: 10px 18px; margin-top: 20px; font-family: var(--mono); font-size: 13.5px; }
.links a { color: var(--accent); text-decoration: none; }
.links a:hover { text-decoration: underline; }
.links a.muted { color: var(--muted); cursor: default; pointer-events: auto; }

.sec { font-family: var(--mono); color: var(--muted); font-size: 13px; text-transform: lowercase;
  letter-spacing: 0.06em; margin: 40px 0 16px; border-bottom: 1px solid var(--rule); padding-bottom: 8px; }

.project { margin-bottom: 16px; }
.project .name { color: var(--fg-strong); font-weight: 600; }
.project a.name:hover { color: var(--accent); }
.project .stack { color: var(--muted); font-family: var(--mono); font-size: 12px; }
.project .desc { color: var(--fg); font-size: 14px; margin-top: 3px; }

.exp { display: flex; justify-content: space-between; gap: 12px; font-size: 14.5px; margin: 8px 0; }
.exp .co { color: var(--fg-strong); }
.exp .co .r { color: var(--muted); }
.exp .yr { color: var(--muted); font-family: var(--mono); font-size: 13px; white-space: nowrap; }
.cv-link { font-size: 13px; margin-top: 12px; font-family: var(--mono); }

.foot { margin-top: 48px; border-top: 1px solid var(--rule); padding-top: 16px;
  color: var(--muted); font-family: var(--mono); font-size: 12px; }
.foot a { color: var(--accent); text-decoration: none; }

@media (max-width: 480px) {
  .wrap { padding: 32px 18px 48px; }
  h1 { font-size: 25px; }
  .exp { flex-direction: column; gap: 0; }
}
```

- [ ] **Step 2: Verify CSS references match asset paths used later**

Run: `grep -o 'assets/fonts/[A-Za-z-]*\.woff2' site/styles.css`
Expected: `assets/fonts/InterVariable.woff2` and `assets/fonts/InterVariable-Italic.woff2` (these exact files are added in Task 9).

- [ ] **Step 3: Commit**

```bash
git add site/styles.css
commit -m "feat(site): terminal-minimal stylesheet with light/dark themes"
```

---

### Task 8: Create the renderer + theme toggle (`main.js`)

**Files:**
- Create: `site/main.js`

- [ ] **Step 1: Write `site/main.js`**

```javascript
// Renders the page from data.json (single source of truth) and handles theming.

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

function section(title) {
  return el("div", "sec", "# " + title);
}

function render(data) {
  const app = document.getElementById("app");
  app.innerHTML = "";
  const p = data.profile;

  app.appendChild(el("div", "prompt", '~ $ whoami<span class="cursor">▊</span>'));
  app.appendChild(el("h1", null, p.name));
  app.appendChild(el("div", "role", p.role));
  app.appendChild(el("div", "loc", p.location));
  app.appendChild(el("div", "tag", "// " + p.tagline));

  // Links
  const links = el("div", "links");
  data.links.forEach((l) => {
    const a = el("a", l.muted ? "muted" : null, l.label);
    a.href = l.href;
    if (!l.muted) { a.target = "_blank"; a.rel = "noopener"; }
    links.appendChild(a);
  });
  app.appendChild(links);

  // About
  app.appendChild(section("about"));
  app.appendChild(el("div", "tag", p.about));

  // Selected work
  app.appendChild(section("selected work"));
  data.projects.forEach((pr) => {
    const wrap = el("div", "project");
    const name = pr.href ? el("a", "name") : el("span", "name");
    name.textContent = pr.name;
    if (pr.href) { name.href = pr.href; name.target = "_blank"; name.rel = "noopener"; }
    wrap.appendChild(name);
    wrap.appendChild(el("span", "stack", " · " + pr.stack));
    wrap.appendChild(el("div", "desc", pr.desc));
    app.appendChild(wrap);
  });

  // Writing & video
  app.appendChild(section("writing & video"));
  const w = data.writing;
  const wline = el("div", "tag");
  const blog = el("a"); blog.href = w.blog.href; blog.textContent = w.blog.label;
  blog.target = "_blank"; blog.rel = "noopener"; blog.style.color = "var(--accent)";
  wline.appendChild(blog);
  wline.appendChild(document.createTextNode(" — " + w.blurb));
  app.appendChild(wline);

  // Experience
  app.appendChild(section("experience"));
  data.experience.forEach((e) => {
    const row = el("div", "exp");
    row.appendChild(el("span", "co", e.company + ' <span class="r">— ' + e.role + "</span>"));
    row.appendChild(el("span", "yr", e.years));
    app.appendChild(row);
  });
  const cv = el("div", "cv-link");
  const cva = el("a"); cva.href = data.cvUrl; cva.textContent = "→ full history in the CV";
  cva.target = "_blank"; cva.rel = "noopener"; cva.style.color = "var(--accent)";
  cv.appendChild(cva);
  app.appendChild(cv);

  // Footer
  const year = new Date().getFullYear();
  const foot = el("div", "foot");
  foot.innerHTML = "© " + year + " André Nogueira · built with plain HTML/CSS · ";
  const src = el("a"); src.href = data.sourceUrl; src.textContent = "source";
  src.target = "_blank"; src.rel = "noopener";
  foot.appendChild(src);
  app.appendChild(foot);
}

// Theme
function initTheme() {
  const saved = localStorage.getItem("theme");
  const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-theme", saved || (sysDark ? "dark" : "light"));
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
}

initTheme();
fetch("data.json")
  .then((r) => r.json())
  .then(render)
  .catch((e) => {
    document.getElementById("app").innerHTML =
      '<p>Failed to load content. <a href="https://github.com/aanogueira">GitHub</a></p>';
    console.error(e);
  });
```

- [ ] **Step 2: Commit**

```bash
git add site/main.js
commit -m "feat(site): render page from data.json + theme toggle"
```

---

### Task 9: Add web fonts + favicon + OG image

**Files:**
- Create: `site/assets/fonts/InterVariable.woff2`, `site/assets/fonts/InterVariable-Italic.woff2`, `site/assets/favicon.svg`, `site/assets/og-image.png`

- [ ] **Step 1: Download the official Inter web fonts (woff2, not the print OTFs)**

```bash
mkdir -p site/assets/fonts
INTER=https://github.com/rsms/inter/raw/master/docs/font-files
curl -fsSL "$INTER/InterVariable.woff2" -o site/assets/fonts/InterVariable.woff2
curl -fsSL "$INTER/InterVariable-Italic.woff2" -o site/assets/fonts/InterVariable-Italic.woff2
```

Verify: `file site/assets/fonts/*.woff2`
Expected: both reported as `Web Open Font Format (Version 2)`. If the URL 404s (upstream path moved), download the latest Inter release zip from https://github.com/rsms/inter/releases and copy `InterVariable.woff2` + `InterVariable-Italic.woff2` from `web/` into `site/assets/fonts/`.

- [ ] **Step 2: Create a monogram favicon**

Write `site/assets/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0d0f12"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-family="ui-monospace, monospace" font-size="30" font-weight="700"
        fill="#8cc5cf">a</text>
</svg>
```

- [ ] **Step 3: Provide an OG image**

Create a 1200×630 PNG at `site/assets/og-image.png`. Minimal approach — render the favicon SVG to PNG if `rsvg-convert`/ImageMagick is available:

```bash
# Option A (if rsvg-convert present):
rsvg-convert -w 1200 -h 630 --background-color '#0d0f12' site/assets/favicon.svg -o site/assets/og-image.png 2>/dev/null || \
echo "No SVG rasterizer — create site/assets/og-image.png manually (1200x630)."
```

If no rasterizer is available, create a simple 1200×630 PNG (dark background, name + role text) by any means and save it to that path. The site works without it; only social-preview cards are affected.

Verify: `test -f site/assets/og-image.png && echo present`
Expected: `present`

- [ ] **Step 4: Commit**

```bash
git add site/assets/
commit -m "feat(site): self-hosted Inter woff2, favicon, OG image"
```

---

### Task 10: Local end-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Serve the site**

```bash
cd site && python3 -m http.server 8099 >/dev/null 2>&1 &
SERVER_PID=$!
sleep 1
```

- [ ] **Step 2: Confirm the page and data load**

Run: `curl -fsS http://localhost:8099/ | grep -c 'og:title'` then `curl -fsS http://localhost:8099/data.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d['projects']),'projects')"`
Expected: `1`, then `6 projects`.

- [ ] **Step 3: Confirm fonts and assets are reachable**

Run: `for f in styles.css main.js assets/fonts/InterVariable.woff2 assets/favicon.svg; do curl -fsS -o /dev/null -w "%{http_code} $f\n" http://localhost:8099/$f; done`
Expected: `200` for each.

- [ ] **Step 4: Manual browser check**

Open `http://localhost:8099/` in a browser and confirm: all six sections render; theme toggle flips light/dark and survives a reload; CV/GitHub/LinkedIn/techquests.dev/email links work; layout holds at a narrow (mobile) width.

- [ ] **Step 5: Stop the server**

```bash
kill $SERVER_PID
```

No commit (verification only).

---

### Task 11: GitHub Pages deploy workflow

**Files:**
- Create: `.github/workflows/pages.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: Deploy site

on:
  push:
    branches: [main]
    paths:
      - "site/**"
      - ".github/workflows/pages.yml"
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v6
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: site
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Validate YAML**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/pages.yml')); print('ok')"`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/pages.yml
commit -m "ci(site): deploy site/ to GitHub Pages"
```

> After merge to `main`: in the repo settings, set **Pages → Source: GitHub Actions** (one-time). The workflow then publishes to `https://aanogueira.github.io/cv`.

---

### Task 12: Document domain setup (deferred, no purchase yet)

**Files:**
- Create: `site/DOMAIN.md`

- [ ] **Step 1: Write the domain runbook**

```markdown
# Custom domain: aanogueira.dev

Not registered yet. When you register it, do the following.

## 1. Add the CNAME file
Create `site/CNAME` containing exactly:

    aanogueira.dev

Commit and push. (The Pages workflow copies `site/` verbatim, so `CNAME` ships with it.)

## 2. DNS records at the registrar
Apex `A` records → GitHub Pages:

    185.199.108.153
    185.199.109.153
    185.199.110.153
    185.199.111.153

Apex `AAAA` records:

    2606:50c0:8000::153
    2606:50c0:8001::153
    2606:50c0:8002::153
    2606:50c0:8003::153

`www` `CNAME` → `aanogueira.github.io`

> Reconfirm current IPs at https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site before relying on them.

## 3. Repo settings
Settings → Pages → Custom domain = `aanogueira.dev` → Save. Wait for the DNS check,
then enable **Enforce HTTPS** once the certificate provisions.

## 4. Update absolute URLs
In `site/index.html`, the `og:url`/`og:image` already point at `https://aanogueira.dev` —
no change needed once the domain is live.
```

- [ ] **Step 2: Commit**

```bash
git add site/DOMAIN.md
commit -m "docs(site): custom domain (aanogueira.dev) setup runbook"
```

---

### Task 13: Update README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a Website section and note the font/compiler change**

Append to `README.md` (after the Download table) a Website section, and update the Build section to mention LuaLaTeX:

```markdown
## Website

A one-page personal portfolio lives in [`site/`](site/) and is deployed to GitHub Pages
(`aanogueira.github.io/cv`, custom domain `aanogueira.dev` — see [`site/DOMAIN.md`](site/DOMAIN.md)).
Content is driven by [`site/data.json`](site/data.json), the source of truth for profile data.

Preview locally:

```sh
cd site && python3 -m http.server 8099   # then open http://localhost:8099
```
```

And in the Build section, change the `pdflatex` requirement note to:

```markdown
Requires `lualatex` (via [TeX Live](https://tug.org/texlive/) or [MacTeX](https://tug.org/mactex/)).
The CV uses the Inter font (vendored in `fonts/`) via `fontspec`, which needs LuaLaTeX.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
commit -m "docs: document website and LuaLaTeX/Inter build"
```

---

## Self-Review

**Spec coverage:**
- Inter font + LuaLaTeX → Tasks 1–4 ✓
- Vendored OTFs + OFL license → Task 1 ✓
- `site/` structure, `data.json` source of truth → Tasks 5–8 ✓
- Terminal-minimal design, section set/order (hero/about/work/writing/experience/footer) → Tasks 6–8 ✓
- Light/dark toggle with CV palette → Tasks 7–8 ✓
- Self-hosted Inter woff2 (not OTFs) + system mono → Tasks 7, 9 ✓
- CV linked via release artifacts (decoupled) → Task 5 (`links`, `cvUrl`) ✓
- SEO/OG static in `<head>` + noscript fallback → Task 6 ✓
- GitHub Pages Actions deploy → Task 11 ✓
- Domain deferred, CNAME + DNS documented → Task 12 ✓
- README/docs → Task 13 ✓
- Out-of-scope items (no CV generation, no build toolchain) respected ✓

**Placeholder scan:** No TBD/TODO steps; every code step includes full content. The only "fill later" items are pure *data* (project repo URLs) and the optional OG image, both with concrete safe defaults and explicit fallback commands — not plan gaps.

**Type/name consistency:** `data.json` keys (`profile`, `links`, `projects`, `experience`, `writing`, `cvUrl`, `sourceUrl`, and per-item `label/href/muted`, `name/stack/desc/href`, `company/role/years`, `writing.blog.label/href`, `writing.blurb`) all match their consumption in `main.js`. CSS classes emitted by `main.js` (`prompt`, `cursor`, `role`, `loc`, `tag`, `links`, `muted`, `sec`, `project`, `name`, `stack`, `desc`, `exp`, `co`, `r`, `yr`, `cv-link`, `foot`) all exist in `styles.css`. Font filenames (`InterVariable.woff2`, `InterVariable-Italic.woff2`) match between `styles.css` (Task 7) and the download step (Task 9).
