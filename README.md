# CV — André A. Nogueira

Senior Platform Engineer CV, built with LaTeX.

## Download

| Variant | Link |
|---------|------|
| Light | [cv.pdf](https://github.com/aanogueira/cv/releases/latest/download/cv.pdf) |
| Dark | [cv-dark.pdf](https://github.com/aanogueira/cv/releases/latest/download/cv-dark.pdf) |

## Website

A one-page personal portfolio lives in [`site/`](site/) and is deployed to GitHub Pages
(`aanogueira.github.io/cv`, custom domain `aanogueira.dev` — see [`site/DOMAIN.md`](site/DOMAIN.md)).
Content is driven by [`site/data.json`](site/data.json), the source of truth for profile data.

Preview locally:

```sh
make serve   # serves site/ at http://localhost:8099 (override with PORT=…)
```

## Build locally

Requires `lualatex` (via [TeX Live](https://tug.org/texlive/) or [MacTeX](https://tug.org/mactex/)).
The CV uses the Inter font (vendored in `fonts/`) via `fontspec`, which needs LuaLaTeX.

```sh
make        # build both cv.pdf and cv-dark.pdf
make build  # build cv.pdf only
make dark   # build cv-dark.pdf only
make clean  # remove build artifacts
make watch  # rebuild on file changes (requires fswatch)
make serve  # preview the site locally
make help   # show all targets
```

## CI/CD

A GitHub Actions workflow compiles both CV variants on every push to `main` and uploads them as release artifacts.

## Structure

```
cv.tex              # main CV source
cv-dark.tex         # dark mode wrapper
content/linkedin.md # LinkedIn profile content (kept in sync with CV)
fonts/              # vendored Inter font (used via fontspec)
site/               # one-page portfolio deployed to GitHub Pages
Makefile            # build targets
```
