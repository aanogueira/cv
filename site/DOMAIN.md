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
