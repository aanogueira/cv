# Custom domain: aanogueira.techquests.dev

The site is deployed to GitHub Pages by `.github/workflows/pages.yml`. `techquests.dev`
DNS is on Cloudflare, and the apex already points at GitHub Pages for the blog.

## 1. GitHub Pages settings (as code)

`scripts/pages-setup` holds the Pages configuration. Run it with:

    make pages-setup

It enables Pages with GitHub Actions as the source, sets the custom domain to
`aanogueira.techquests.dev`, and enforces HTTPS once the certificate is issued. It is safe
to re-run. It needs `gh` authenticated with admin access to the repo.

There is no `site/CNAME` file on purpose: GitHub ignores it for sites deployed by a custom
Actions workflow, so the domain is set through the API instead.

## 2. DNS record (Cloudflare, techquests.dev zone, one-time)

| Type  | Name       | Target                 | Proxy status |
|-------|------------|------------------------|--------------|
| CNAME | aanogueira | aanogueira.github.io   | DNS only     |

Keep it **DNS only** (grey cloud). GitHub has to see its own servers to issue the HTTPS
certificate; a proxied record blocks that.

## 3. Order

1. `make pages-setup` (enables Pages and sets the domain).
2. Push to `main` so the workflow deploys the site.
3. Add the DNS record above.
4. Once the certificate is issued (can take up to an hour), run `make pages-setup` again
   to enforce HTTPS.

## 4. If GitHub rejects the domain

If `techquests.dev` is a verified domain on the `techquestsdev` GitHub organization, GitHub
may refuse subdomains for repos outside that organization. Either verify the subdomain for
the `aanogueira` account (Settings, Pages, Add a domain), or move this site to a repo under
`techquestsdev`.
