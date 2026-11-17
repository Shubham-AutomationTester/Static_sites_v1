# JWU Event 404 Mimic Site — Static Edition

A fully static crawler QA fixture that preserves the original page layout, event metadata, JSON-LD, styling, and intentionally broken links. No Node.js runtime, `server.js`, `package.json`, or build step is needed.

## Files
- `index.html`: original event-page HTML (unchanged)
- `styles.css`: original styles (unchanged)
- `404.html`: original custom error page (unchanged)
- `robots.txt`: original crawl policy (unchanged)

## Behavior

- `/` and `/index.html` serve the event page with HTTP 200.
- Every link under `/broken/` intentionally targets a **nonexistent file**. These paths must return a real HTTP 404, not a 200 SPA fallback or redirect.
- The `404.html` file is the custom 404 page on hosts that support it, including GitHub Pages.
- JSON-LD, canonical link, event content, internal links, and visual UI are unchanged.

## Deploy on GitHub Pages (recommended)
1. Upload these files to the root of a GitHub repository (or set the Pages publishing folder accordingly).
2. Open repository **Settings > Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the appropriate branch and `/ (root)` folder; save.
5. Visit the GitHub Pages URL. The site needs no build command.

## Deploy on Render as Static Site
1. Create **New > Static Site** from the repository.
2. Build command: leave blank if permitted, or `echo 'Static site ready'`.
3. Publish directory: `.` (repository root).
4. Do **not** configure a catch-all rewrite to `/index.html`.
5. Verify missing paths return HTTP 404. Static hosts vary in whether they display `404.html` automatically.

## Local preview
In the directory containing `index.html`, run:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`. The basic Python preview server returns 404 for missing files, though its error-page appearance is not necessarily `404.html`.

## Verify crawler status codes after deployment

```bash
curl -s -o /dev/null -w '%{http_code}\n' 'https://YOUR-HOST/'
curl -s -o /dev/null -w '%{http_code}\n' 'https://YOUR-HOST/broken/event/details'
curl -s -o /dev/null -w '%{http_code}\n' 'https://YOUR-HOST/broken/document/alumni-guide.pdf'
```

Expected: `200`, `404`, `404`.

> QA warning: Do not add `/broken/` resources or host rewrites that return HTTP 200 for unknown paths. The original Node server explicitly enforced 404 for every `/broken/*`; static hosting relies on the host's missing-file response. Also preserve the original canonical URL pointing at a broken route when comparing crawler behavior.
