# CV — André A. Nogueira

Senior Platform Engineer CV, built with LaTeX.

## Download

| Variant | Link |
|---------|------|
| Light | [cv.pdf](https://github.com/aanogueira/cv/releases/latest/download/cv.pdf) |
| Dark | [cv-dark.pdf](https://github.com/aanogueira/cv/releases/latest/download/cv-dark.pdf) |

## Build locally

Requires `pdflatex` (via [TeX Live](https://tug.org/texlive/) or [MacTeX](https://tug.org/mactex/)).

```sh
make        # build both cv.pdf and cv-dark.pdf
make build  # build cv.pdf only
make dark   # build cv-dark.pdf only
make clean  # remove build artifacts
make watch  # rebuild on file changes (requires fswatch)
make help   # show all targets
```

## CI/CD

A GitHub Actions workflow compiles both CV variants on every push to `main` and uploads them as release artifacts.

## Structure

```
cv.tex              # main CV source
cv-dark.tex         # dark mode wrapper
content/linkedin.md # LinkedIn profile content (kept in sync with CV)
Makefile            # build targets
```
