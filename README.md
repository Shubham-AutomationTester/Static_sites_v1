# Robots Test Lab - simple Render site

The website is already built. No Blueprint, render.yaml, server, package manager, database, or environment variable is required.

## Deploy using your existing Render Static Site

1. Extract the ZIP. Upload its CONTENTS to the root of your connected GitHub repository. Keep the included test folders intact. GitHub should show `index.html` immediately at the top level. Do not upload just the ZIP or place everything under another outer folder.
2. In Render, keep the service type **Static Site** and set:

| Setting | Value |
| --- | --- |
| Branch | main |
| Root Directory | Leave blank |
| Build Command | `echo "No build required"` |
| Publish Directory | `.` |

3. Save and choose **Manual Deploy > Deploy latest commit**. Wait for Live, then open the URL on your service page.

If the original site still lives in a `site/` folder, these new files go at repository root; the Publish Directory for this edition is a single dot. Do not change or delete unrelated repository files. Avoid catch-all rewrites; every test page exists as a real file.

## Start testing

Open the homepage, choose a case, then press **Copy URL**. Paste that URL into the crawler Start URL and run a full crawl with a clean QA index. Do not crawl from the dashboard, seed child targets, or enable sitemap discovery. Ensure crawl depth, URL rules and budgets allow the child paths. Start with BASE-001 to prove basic crawling works.

The dashboard initially shows six starter cases; choose **All 28** for the full catalog. Every page displays its expected outcomes. Match exact document URLs when checking the index. Queue/fetch assertions need crawler logs; index absence is not proof of no fetch. For nofollow targets, a clean index and isolated seed are essential. The manual result form saves only in your browser; it never marks a crawler test passed automatically.

## HTTP header tests - five one-time Render settings

Everything except actual X-Robots-Tag delivery is in the files. A static HTML page cannot create a real HTTP response header. In the existing Render Static Site, open **HTTP Headers**, add the rows below, and save. Do not use a global `/*` rule. There is no need to create another service.

| Path | Header name | Value |
| --- | --- | --- |
| `/header-tests/x-noindex.html` | `X-Robots-Tag` | `noindex` |
| `/header-tests/x-nofollow.html` | `X-Robots-Tag` | `nofollow` |
| `/header-tests/x-noindex-nofollow.html` | `X-Robots-Tag` | `noindex, nofollow` |
| `/header-tests/x-uppercase.html` | `X-Robots-Tag` | `NOINDEX, NOFOLLOW` |
| `/header-tests/x-noindex-plus-meta-nofollow.html` | `X-Robots-Tag` | `noindex` |

On the deployed homepage, expand **HTTP header setup** and click **Check HTTP setup**. It checks real GET responses and confirms that the control/child are not accidentally restricted. This verifies hosting setup only, not SearchStax behavior. The first three rows cover the basic header cases; the other two cover uppercase and header/meta combination. Header tests are blocked until their real response headers are correct.

## Edges and clarification probes

The suite keeps uppercase/spacing variations, per-link rel tokens, unrelated bots, invalid/empty/missing meta content, body-only meta, robots.txt ON/OFF, and same-URL state changes. SearchStax-specific matching, multi-tag/header aggregation, positive directives and existing-index deletion need an engineering-confirmed policy. Such cases are labeled **Confirm behavior** instead of inventing a pass criterion. For the SearchStax bot probe, `searchstax` is only a placeholder until its exact supported meta name is confirmed.

For STATE-001, edit only the real head meta tag and the `id="page-marker"` value in `state-transition/page.html`, then commit and redeploy the SAME URL. The page provides the V1/V2/V3 sequence without any scripts.

## Package layout

`index.html` is at the top level. `styles.css` and `app.js` provide the interface. The test folders contain static HTML fixtures. `robots.txt` blocks only `/robots-blocked/`. `Test_Cases.md` is the matrix; `test-data.json` records paths and markers. No sitemap is included intentionally. Each independent case has its own child targets. Targets have no outgoing anchors or robots directives.

## Verification and limits

The files can be checked locally, but they have NOT been deployed to your Render account and no SearchStax crawl has been executed by this package. All actual results start as Not run. Local file previews do not provide HTTP response headers. LocalStorage records do not sync between browsers or domains; copy evidence to your QA system for long-term records.

Render supports free static sites; its account bandwidth and pipeline usage limits still apply. Check your workspace usage rather than assuming unlimited hosting.

Official Render references (checked 2026-09-19):
- https://render.com/docs/static-sites
- https://render.com/docs/static-site-headers
- https://render.com/docs/your-first-deploy
- https://render.com/docs/deploys
