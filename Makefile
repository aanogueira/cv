TEX = lualatex
FLAGS = -interaction=nonstopmode
PORT ?= 8099

.PHONY: all build dark clean watch serve pages-setup linkedin linkedin-check help

all: build dark ## Default: build both light and dark PDFs

build: cv.tex ## Compile cv.pdf
	$(TEX) $(FLAGS) cv.tex

dark: cv.tex cv-dark.tex ## Compile cv-dark.pdf
	$(TEX) $(FLAGS) cv-dark.tex

clean: ## Remove build artifacts
	rm -f *.aux *.log *.out *.pdf *.dvi

watch: ## Rebuild on file changes (requires fswatch)
	@echo "Watching for changes..."
	fswatch -o cv.tex cv-dark.tex | xargs -n1 -I{} make all

serve: ## Preview the site locally (PORT=8099): make serve
	@echo "Serving site at http://localhost:$(PORT) (Ctrl-C to stop)"
	@cd site && python3 -m http.server $(PORT)

pages-setup: ## Configure GitHub Pages (source, custom domain, HTTPS)
	@scripts/pages-setup

linkedin: ## Copy LinkedIn fields to the clipboard one by one
	@scripts/linkedin walk

linkedin-check: ## Check LinkedIn field lengths
	@scripts/linkedin check

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) | awk -F ':.*## ' '{printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'
