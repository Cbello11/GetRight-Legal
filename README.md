# GetRight Legal Pages

This repository contains the static legal and OAuth flow pages used by GetRight. The HTML files are meant to be hosted as-is so marketplaces and payment providers can display privacy terms or redirect users during OAuth flows.

## Files and usage
- **terms.html**: Terms of Service for GetRight. Link to this page from your storefront footer or account settings when users need to review service terms.
- **privacy.html**: Privacy Policy summarizing processors, retention, rights, security, and effective date. Link alongside the terms page anywhere a privacy disclosure is required.
- **callback.html**: OAuth callback handler for eBay. Displays the returned `code` and `state` query parameters for troubleshooting or manual token exchanges. Configure your eBay app redirect URI to this file.
- **declined.html**: Landing page when an OAuth authorization is canceled by the user. Use this as the cancellation URL for marketplaces that support a separate decline redirect.

## Prerequisites
- Git to clone this repository (or download the ZIP).
- Python 3 (for the built-in `http.server` module) to preview the pages locally.

## Local preview
1. Clone the repository and change into the directory:
   ```bash
   git clone https://example.com/GetRight-Legal.git
   cd GetRight-Legal
   ```
2. Start a simple static server (for example, on port 8000):
   ```bash
   python -m http.server 8000
   ```
3. In your browser, open any page you want to preview, such as:
   - http://localhost:8000/terms.html
   - http://localhost:8000/privacy.html
   - http://localhost:8000/callback.html?code=test-code&state=abc
   - http://localhost:8000/declined.html

## Deployment and hosting
- These files are plain HTML and can be served from any static hosting provider (e.g., GitHub Pages, Amazon S3 + CloudFront, Netlify, or your own Nginx/Apache server).
- Upload the files to the root of your static site so the URLs match the ones you register with partners (e.g., `https://yourdomain.com/callback.html`).
- When configuring OAuth apps (e.g., eBay), set the redirect/decline URLs to the hosted `callback.html` and `declined.html` locations exactly as they will appear in production. Use HTTPS in production.
- If using a CDN or cache, invalidate cached copies after updating any legal page to ensure users see the latest terms.
