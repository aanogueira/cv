TEX = pdflatex
FLAGS = -interaction=nonstopmode

.PHONY: all build dark clean watch help

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

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) | awk -F ':.*## ' '{printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'
