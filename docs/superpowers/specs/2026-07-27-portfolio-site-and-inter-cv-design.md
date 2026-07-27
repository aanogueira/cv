# Design: Personal Portfolio Site + Inter Font CV

Date: 2026-07-27
Repo: `cv` (github.com/aanogueira/cv)
Status: Approved (design), pending implementation plan

## Overview

Two independent workstreams delivered in one repo:

1. **Inter font for the CV** — switch the existing LaTeX CV from its default font to
   Inter, which requires moving the compiler from `pdflatex` to LuaLaTeX.
2. **Personal portfolio site** — a one-page, terminal/dev-minimal static site hosted on
   GitHub Pages that acts as a central hub linking to the CV, OSS projects, and
   branded content (techquests.dev blog + upcoming YouTube). Eventually served from
   the custom domain `aanogueira.dev`.

This repo remains the **source of truth for data about André**. The site is driven by
a single structured `data.json`.

### Decisions (from brainstorming)

- Site tech: **plain HTML/CSS + a little JS**, no build step.
- Data model: **a structured data file (`data.json`) drives the site**; CV LaTeX stays
  hand-authored (not generated from the data file — that was explicitly rejected as
  over-engineering that risks the polished CV).
- Scope: **both workstreams** in one plan; they don't conflict.
- Domain: `aanogueira.dev` **not yet registered**; ship on the github.io URL first,
  wire the custom domain when it's live.
- Theming: **light + dark toggle**, matching the CV palette.
- Visual direction: **Terminal / dev minimalism** (validated via a full-page mockup).

## Workstream 1 — Inter font for the CV

### Current state

- `cv.tex` — main CV, `\documentclass[a4paper,10pt]{article}`, uses `titlesec`,
  `xcolor`, `hyperref`, `fontawesome5`, `enumitem`. Light/dark handled via a
  `\darkmode` conditional and `\definecolor`.
- `cv-dark.tex` — one-liner: `\def\darkmode{}\input{cv.tex}`.
- `Makefile` — `TEX = pdflatex`, targets `build`, `dark`, `all`, `clean`, `watch`.
- `.github/workflows/build.yml` — builds both PDFs with `xu-cheng/latex-action@v4`
  and publishes them to a `latest` GitHub release.

### Why the compiler must change

`pdflatex` cannot load `.otf` (or `.ttf`) fonts directly. Using Inter requires
`fontspec`, which only works under **LuaLaTeX** or **XeLaTeX**. We choose **LuaLaTeX**
(actively maintained default for fontspec, good `fontawesome5` support).

### Changes

1. **Vendor the fonts.** Create `fonts/` and copy the Inter OTFs from
   `/Users/andre.nogueira/Mollie/gitlab/mcp/mollie-doc/template/fonts`:
   `Inter-Regular.otf`, `Inter-Italic.otf`, `Inter-Bold.otf`, `Inter-BoldItalic.otf`,
   `Inter-SemiBold.otf`, plus `LICENSE.txt` (Inter is OFL — the license must ship).
   Vendoring makes the repo self-contained so CI can build without a system font.

2. **`cv.tex`** — add `\usepackage{fontspec}` and configure Inter as the main font
   using the vendored files with an explicit `Path`, e.g.:

   ```latex
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

   (`SemiBold` available for headings if we want it later.) Everything else — geometry,
   colors, `titlesec` formatting, content — is unchanged.

3. **`.gitignore`** — the `*.otf`/`fonts/` must NOT be ignored (currently only build
   artifacts are ignored, so no change expected — verify).

4. **`Makefile`** — `TEX = lualatex`. Keep `FLAGS = -interaction=nonstopmode`.
   Targets otherwise unchanged.

5. **`.github/workflows/build.yml`** — configure `xu-cheng/latex-action@v4` to compile
   with LuaLaTeX (e.g. `latexmk_use_lualatex: true`, or set the compiler explicitly).
   Both `cv.tex` and `cv-dark.tex` build; release publishing unchanged.

6. **`cv-dark.tex`** — no change (still wraps `cv.tex`).

### Verification (Workstream 1)

- `make all` locally produces `cv.pdf` and `cv-dark.pdf` rendered in Inter.
- No new overfull `\hbox` warnings introduced by the metric change (Inter is wider than
  Computer Modern in places — check the header line and dense bullets; adjust
  `\tolerance`/spacing only if something visibly breaks).
- Dark variant colors intact.
- CI green: both PDFs attached to the `latest` release.

## Workstream 2 — Personal portfolio site

### Repo structure

```
site/
  index.html      # static shell; SEO + Open-Graph meta live here in <head>
  styles.css      # terminal aesthetic; light/dark via CSS custom properties
  main.js         # theme toggle (localStorage) + renders body sections from data.json
  data.json       # SINGLE SOURCE OF TRUTH: profile, links, projects, experience, writing
  assets/
    fonts/        # self-hosted Inter woff2 (official web build, not the print OTFs)
    favicon.svg
    og-image.png
  CNAME           # "aanogueira.dev" — added when the domain is registered
```

### Page sections (validated via mockup)

1. **Hero** — name, role (Senior Platform Engineer), location (Lisbon, Portugal),
   tagline ("making infrastructure invisible"), and quick links: CV (light), CV (dark),
   GitHub, LinkedIn, techquests.dev, YouTube (marked "soon"), email.
2. **# about** — condensed bio (~2–3 lines, derived from `content/linkedin.md`).
3. **# selected work** — 6 OSS projects: houndr, Code Search, git-context, howto,
   crontab-guru, HashPad (name · stack · one-line description each).
4. **# writing & video** — techquests.dev blog + upcoming YouTube channel (branded
   content; the personal site links out to it).
5. **# experience** — compact 4-role list (Mollie, SteelEye, Truphone, La Redoute) with
   year ranges → "full history in the CV".
6. **Footer** — copyright, "built with plain HTML/CSS", link to repo source.

### Data flow

- `data.json` holds all content as structured data (profile object; arrays for
  `links`, `projects`, `experience`, `writing`).
- `main.js` fetches `data.json` and renders each section into the DOM.
- **SEO / link-sharing**: the critical `<title>`, meta description, and Open-Graph /
  Twitter-card tags are hardcoded static in `index.html <head>` so shared links render
  correctly even before JS executes. (Accepted tradeoff of client-side rendering for a
  personal page; no build step per the chosen approach.)

### CV integration

The site links to the existing release artifacts:
`https://github.com/aanogueira/cv/releases/latest/download/cv.pdf` and `…/cv-dark.pdf`.
This keeps the site deploy fully decoupled from the CV build — the CV workflow keeps
publishing PDFs; the site just references them.

### Theming

- CSS custom properties for all colors; two themes.
- Default follows `prefers-color-scheme`; a manual toggle persists the choice in
  `localStorage`.
- Palette aligned with the CV: light accent `#0645AD`; dark bg `#121416`, fg `#e0e0e0`,
  accent `#8cc5cf`, rule `#4f5663`.

### Fonts (site)

- Self-hosted **Inter woff2** (official web build downloaded from the Inter GitHub
  release — NOT the print OTFs, which are heavy and not web-optimized) in
  `site/assets/fonts/`, referenced via `@font-face`. No third-party CDN (privacy + no
  external dependency).
- A system monospace stack (`ui-monospace, "SF Mono", Menlo, monospace`) for the
  terminal accents (prompts, section markers).

### Deployment

- New workflow `.github/workflows/pages.yml`: on push to `main`, upload `site/` as a
  Pages artifact and deploy via `actions/deploy-pages` (GitHub Pages via Actions —
  cleanly serves from a subfolder, unlike the branch/`/docs` restriction).
- GitHub Pages must be enabled with "Source: GitHub Actions" (one-time repo setting).
- Interim URL: `https://aanogueira.github.io/cv`.

### Custom domain (`aanogueira.dev`)

Not yet registered. When it is:

- Add `site/CNAME` containing `aanogueira.dev`.
- DNS records to set at the registrar:
  - Apex `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
    `185.199.111.153`
  - Apex `AAAA` → `2606:50c0:8000::153`, `2606:50c0:8001::153`,
    `2606:50c0:8002::153`, `2606:50c0:8003::153`
  - `www` `CNAME` → `aanogueira.github.io`
- Enable "Enforce HTTPS" in repo Pages settings once the cert provisions.

(Exact GitHub Pages IPs to be reconfirmed against GitHub docs at implementation time.)

### Verification (Workstream 2)

- Serve locally (`python3 -m http.server` in `site/`) and confirm:
  - all sections render from `data.json`;
  - theme toggle works and persists across reload;
  - every link resolves (CV light/dark, GitHub, LinkedIn, techquests.dev, email);
  - responsive down to mobile widths;
  - `<head>` meta/OG tags present in the served HTML.
- After merge: Pages workflow deploys; `aanogueira.github.io/cv` loads.

## Out of scope (YAGNI)

- Generating the LaTeX CV from `data.json` (explicitly rejected).
- Multi-page site / blog engine on the personal domain (blog stays on techquests.dev).
- Any Node/JS build toolchain.
- Analytics, contact forms, or a CMS.

## File-change summary

New:
- `fonts/Inter-*.otf`, `fonts/LICENSE.txt`
- `site/index.html`, `site/styles.css`, `site/main.js`, `site/data.json`
- `site/assets/fonts/*.woff2`, `site/assets/favicon.svg`, `site/assets/og-image.png`
- `.github/workflows/pages.yml`
- (later) `site/CNAME`

Modified:
- `cv.tex` (fontspec + Inter)
- `Makefile` (`TEX = lualatex`)
- `.github/workflows/build.yml` (LuaLaTeX)
- `README.md` (document the site + font change)
