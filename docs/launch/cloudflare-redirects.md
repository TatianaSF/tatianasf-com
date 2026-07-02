# Cloudflare Redirect Rules

This document defines future production redirect decisions for the static `tatianasf.com` launch.

The Next.js project uses App Router with `output: "export"` and GitHub Pages hosting. It cannot rely on runtime redirects. Any real production `301` redirect should be configured later in Cloudflare Redirect Rules, or another static-host-compatible edge layer, only after GitHub Pages staging QA is approved.

Do not enable these rules during this documentation step. The current WordPress site should remain live until staging QA and final launch approval are complete.

## Recommended Production Redirects

| Source path | Target path | Status | Reason |
| --- | --- | --- | --- |
| `/hackathon-services/` | `/hackathon_services/` | `301` | Preserve the current WordPress canonical URL for Hackathon Services and avoid competing underscore/hyphen variants. |
| `/hello-world/` | `/` | `301` | Low-value default WordPress starter post should not be promoted as a real public page. |
| `/category/uncategorized/` | `/` | `301` | Low-value default WordPress archive should not be promoted as a real public page. |

## Routes That Should Not Redirect In Phase 1

| Path | Phase 1 behavior | Reason |
| --- | --- | --- |
| `/services/` | Keep as a noindex static future placeholder if accessible. Do not include in sitemap. Do not link from primary navigation. | Reserved for future site structure and may become a real page in Phase 2. |
| `/cases/` | Keep as a noindex static future placeholder if accessible. Do not include in sitemap. Do not link from primary navigation. | Reserved for future site structure and may become a real page in Phase 2. |
| `/media/` | Keep as a noindex static future placeholder if accessible. Do not include in sitemap. Do not link from primary navigation. | Reserved for future site structure and may become a real page in Phase 2. |
| `/partnership/` | Keep as a noindex static future placeholder if accessible. Do not include in sitemap. Do not link from primary navigation. | Reserved for future site structure and may become a real page in Phase 2. |

## Launch Verification

Before enabling redirect rules:

- GitHub Pages staging site is approved.
- Current WordPress site remains live until final DNS launch approval.
- DNS has not been changed as part of route documentation work.
- `/hackathon_services/` returns `200`.
- `/sitemap.xml` includes only launch-safe canonical URLs.
- Noindex placeholder and cleanup pages are not included in sitemap.
- Redirect rules are staged or documented but not enabled before final approval.

After enabling redirect rules during an approved production launch:

- `/hackathon-services/` returns `301` to `/hackathon_services/`.
- `/hello-world/` returns `301` to `/`.
- `/category/uncategorized/` returns `301` to `/`.
- `/hackathon_services/` still returns `200`.
- `/services/`, `/cases/`, `/media/`, and `/partnership/` remain noindex and excluded from sitemap unless they have been promoted to real content.
