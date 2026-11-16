# CV — André A. Nogueira

Senior Platform Engineer CV, built with LaTeX.

## Download

| Variant | Link |
|---------|------|
| Light | [cv.pdf](https://github.com/aanogueira/cv/releases/latest/download/cv.pdf) |
| Dark | [cv-dark.pdf](https://github.com/aanogueira/cv/releases/latest/download/cv-dark.pdf) |

## Website

A one-page links page lives in [`site/`](site/) and is deployed to GitHub Pages at
`aanogueira.techquests.dev` (DNS setup in [`site/DOMAIN.md`](site/DOMAIN.md)).
Content is driven by [`site/data.json`](site/data.json).

Preview locally:

```sh
make serve   # serves site/ at http://localhost:8099 (override with PORT=…)
```

## LinkedIn

[`content/linkedin.md`](content/linkedin.md) holds the LinkedIn profile text and is kept in sync with the CV.
LinkedIn has no self-serve API for editing profile sections, so syncing is copy and paste:

```sh
make linkedin        # copy each field to the clipboard in order; paste, then press Enter
make linkedin-check  # fail if a field exceeds LinkedIn's length limits
scripts/linkedin list          # every field with its length
scripts/linkedin copy about    # copy a single field (headline, about, mollie, mollie-skills, ...)
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
make linkedin  # copy LinkedIn fields to the clipboard
make help   # show all targets
```

## CI/CD

A GitHub Actions workflow compiles both CV variants on every push to `main` and uploads them as release artifacts.

## Structure

```
cv.tex              # main CV source
cv-dark.tex         # dark mode wrapper
content/linkedin.md # LinkedIn profile content (kept in sync with CV)
scripts/linkedin    # LinkedIn copy helper (see LinkedIn section)
fonts/              # vendored Inter font (used via fontspec)
site/               # links page deployed to GitHub Pages
Makefile            # build targets
```
