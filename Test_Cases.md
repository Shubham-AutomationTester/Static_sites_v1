# STUDIO-5864 - test catalog (simple Render edition)

Actual status for all rows: **Not run**. This document lists expectations, not observed crawler behavior.

Preconditions: deployed root-level site; normal crawling and indexing work (BASE-001); clean QA index per independent case; exact case URL is the only seed; no sitemap seeding; child paths are allowed and within depth/budget; actual HTTP headers configured before HDR cases. Only generated test data should be used.

Steps for each ordinary row: (1) Copy the case Start URL. (2) Run a full crawl. (3) Confirm source fetch and child discovery/fetch in logs. (4) Check exact document URLs and markers in the index. (5) Record actual output and repeat to verify consistent behavior. Repeat core META, HDR and LINK cases with Ignore robots.txt OFF and ON; outcomes should be unchanged for these allowed paths. ROBOTS-001 explicitly tests disallowed paths.

| ID | Start path | Source indexing | Child/link expectation | Note |
| --- | --- | --- | --- | --- |
| BASE-001 | `/baseline.html` | Indexed | Follow child | Control |
| META-001 | `/meta-tests/noindex.html` | Not indexed | Follow child | Required |
| META-002 | `/meta-tests/nofollow.html` | Indexed | Do not follow child | Required |
| META-003 | `/meta-tests/noindex-nofollow.html` | Not indexed | Do not follow child | Required |
| META-004 | `/meta-tests/uppercase.html` | Not indexed | Do not follow child | Required |
| META-005 | `/meta-tests/no-space-comma.html` | Not indexed | Do not follow child | Required |
| META-006 | `/meta-tests/whitespace-separated.html` | Not indexed | Do not follow child | Required |
| META-007 | `/meta-tests/mixed-spacing.html` | Not indexed | Do not follow child | Edge |
| BOT-001 | `/bot-tests/googlebot-noindex.html` | Indexed | Follow child | Required |
| BOT-002 | `/bot-tests/generic-noindex-googlebot-index.html` | Not indexed | Follow child | Required |
| BOT-003 | `/bot-tests/searchstax-specific-conditional.html` | Conditional | Conditional | Clarify UA token |
| HDR-001 | `/header-tests/x-noindex.html` | Not indexed | Follow child | Required |
| HDR-002 | `/header-tests/x-nofollow.html` | Indexed | Do not follow child | Required |
| HDR-003 | `/header-tests/x-noindex-nofollow.html` | Not indexed | Do not follow child | Required |
| HDR-004 | `/header-tests/x-uppercase.html` | Not indexed | Do not follow child | Edge |
| HDR-005 | `/header-tests/x-noindex-plus-meta-nofollow.html` | Not indexed* | Do not follow* | Clarify merge |
| LINK-001 | `/link-tests/basic.html` | Indexed | Normal yes / nofollow no | Required |
| LINK-002 | `/link-tests/case-insensitive.html` | Indexed | Do not follow | Required |
| LINK-003 | `/link-tests/multiple-rel-values.html` | Indexed | Do not follow | Required |
| LINK-004 | `/link-tests/substring-negative.html` | Indexed | Follow child | Edge |
| LINK-005 | `/link-tests/same-target-mixed-occurrences.html` | Indexed | Follow via normal occurrence | Edge |
| EDGE-001 | `/edge-tests/multiple-meta-tags.html` | Not indexed* | Do not follow* | Clarify merge |
| EDGE-002 | `/edge-tests/invalid-token-substrings.html` | Indexed | Follow child | Negative |
| EDGE-003 | `/edge-tests/empty-content.html` | Indexed | Follow child | Negative |
| EDGE-004 | `/edge-tests/missing-content.html` | Indexed | Follow child | Negative |
| EDGE-005 | `/edge-tests/meta-in-body.html` | Indexed | Follow child | Edge |
| ROBOTS-001 | `/robots-entry.html` | Entry indexed; blocked pages vary | See OFF/ON comparison | Critical interaction |
| STATE-001 | `/state-transition/page.html` | Transition probe | N/A | Clarify deletion |

Asterisks mean proposed expectations awaiting aggregation-policy confirmation. Noindex guarantees no add/update of the current page, not necessarily deletion of an already-indexed document. The STATE test uses a seeded index intentionally; do not clear it between its V1/V2/V3 stages.

## robots.txt interaction

Use `/robots-entry.html` in two clean runs. OFF: do not fetch any linked `/robots-blocked/` source or its unseeded child. ON: fetch the four blocked sources, then respect each page's meta independently. For indexable: index source and follow child. For noindex: do not index source, but follow child. For nofollow: index source, do not follow child. For noindex,nofollow: neither index source nor follow child. Children are outside the blocked directory.

## Source and child marker map

Parent files do not contain their children's full markers, preventing token-only checks from accidentally finding the parent. Confirm exact document URL as well.

| Case | Source marker | Child path and marker |
| --- | --- | --- |
| BASE-001 | `QA5864_BASE001_PARENT` | `/targets/base001-child.html` / `QA5864_BASE001_CHILD` |
| META-001 | `QA5864_META001_PARENT` | `/targets/meta001-child.html` / `QA5864_META001_CHILD` |
| META-002 | `QA5864_META002_PARENT` | `/targets/meta002-child.html` / `QA5864_META002_CHILD` |
| META-003 | `QA5864_META003_PARENT` | `/targets/meta003-child.html` / `QA5864_META003_CHILD` |
| META-004 | `QA5864_META004_PARENT` | `/targets/meta004-child.html` / `QA5864_META004_CHILD` |
| META-005 | `QA5864_META005_PARENT` | `/targets/meta005-child.html` / `QA5864_META005_CHILD` |
| META-006 | `QA5864_META006_PARENT` | `/targets/meta006-child.html` / `QA5864_META006_CHILD` |
| META-007 | `QA5864_META007_PARENT` | `/targets/meta007-child.html` / `QA5864_META007_CHILD` |
| BOT-001 | `QA5864_BOT001_PARENT` | `/targets/bot001-child.html` / `QA5864_BOT001_CHILD` |
| BOT-002 | `QA5864_BOT002_PARENT` | `/targets/bot002-child.html` / `QA5864_BOT002_CHILD` |
| BOT-003 | `QA5864_BOT003_PARENT` | `/targets/bot003-child.html` / `QA5864_BOT003_CHILD` |
| HDR-001 | `QA5864_HDR001_PARENT` | `/targets/hdr001-child.html` / `QA5864_HDR001_CHILD` |
| HDR-002 | `QA5864_HDR002_PARENT` | `/targets/hdr002-child.html` / `QA5864_HDR002_CHILD` |
| HDR-003 | `QA5864_HDR003_PARENT` | `/targets/hdr003-child.html` / `QA5864_HDR003_CHILD` |
| HDR-004 | `QA5864_HDR004_PARENT` | `/targets/hdr004-child.html` / `QA5864_HDR004_CHILD` |
| HDR-005 | `QA5864_HDR005_PARENT` | `/targets/hdr005-child.html` / `QA5864_HDR005_CHILD` |
| LINK-001 | `QA5864_LINK001_PARENT` | `/targets/link001-child-1.html` / `QA5864_LINK001_CHILD1`<br>`/targets/link001-child-2.html` / `QA5864_LINK001_CHILD2` |
| LINK-002 | `QA5864_LINK002_PARENT` | `/targets/link002-child.html` / `QA5864_LINK002_CHILD` |
| LINK-003 | `QA5864_LINK003_PARENT` | `/targets/link003-child.html` / `QA5864_LINK003_CHILD` |
| LINK-004 | `QA5864_LINK004_PARENT` | `/targets/link004-child.html` / `QA5864_LINK004_CHILD` |
| LINK-005 | `QA5864_LINK005_PARENT` | `/targets/link005-child.html` / `QA5864_LINK005_CHILD` |
| EDGE-001 | `QA5864_EDGE001_PARENT` | `/targets/edge001-child.html` / `QA5864_EDGE001_CHILD` |
| EDGE-002 | `QA5864_EDGE002_PARENT` | `/targets/edge002-child.html` / `QA5864_EDGE002_CHILD` |
| EDGE-003 | `QA5864_EDGE003_PARENT` | `/targets/edge003-child.html` / `QA5864_EDGE003_CHILD` |
| EDGE-004 | `QA5864_EDGE004_PARENT` | `/targets/edge004-child.html` / `QA5864_EDGE004_CHILD` |
| EDGE-005 | `QA5864_EDGE005_PARENT` | `/targets/edge005-child.html` / `QA5864_EDGE005_CHILD` |
| ROBOTS-001 | `QA5864_ROBOTS001_PARENT` | `/robots-blocked/indexable.html` / `See robots page`<br>`/robots-blocked/noindex.html` / `See robots page`<br>`/robots-blocked/nofollow.html` / `See robots page`<br>`/robots-blocked/noindex-nofollow.html` / `See robots page` |
| STATE-001 | `QA5864_STATE001_V1` | None |
