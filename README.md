# GetRight-Legal

This repository contains the static legal pages used by GetRight. The HTML files are served as standalone pages for checkout/legal compliance flows and are intended to be hosted as a simple static site (no backend required).

## Contents and usage

| File | Purpose | Used in |
| --- | --- | --- |
| `terms.html` | Terms of Service page. | Linked from the product UI and checkout flows where users must review terms. |
| `privacy.html` | Privacy Policy page. | Linked from account creation, settings, and footer legal links. |
| `declined.html` | Payment/eligibility decline notice page. | Redirect target for declined or ineligible transactions. |
| `callback.html` | Callback/redirect landing page for completion of off-site flows. | Used as a return URL for external flows (e.g., payment providers) before returning users to the app. |

## Prerequisites

- Any static file host (S3, Cloudflare Pages, Netlify, etc.).
- For local preview: Python 3 (or any local static server of your choice).

## Local preview

From the repository root, start a simple static server and open the pages in your browser:

```bash
python -m http.server 8000
```

Then visit:

- `http://localhost:8000/terms.html`
- `http://localhost:8000/privacy.html`
- `http://localhost:8000/declined.html`
- `http://localhost:8000/callback.html`

## Deployment / hosting notes

1. Upload the HTML files to your static host.
2. Ensure the files are served at stable URLs (for example, `/terms.html`, `/privacy.html`, etc.).
3. Configure any application links or redirect targets to use the hosted URLs.
4. If using a CDN or static host, set appropriate caching headers so policy updates propagate when you republish.

Because these pages are pure HTML, there is no build step. Any updates can be deployed by replacing the files on your host and invalidating caches as needed.
