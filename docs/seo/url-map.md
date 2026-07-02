# URL Map

Audit date: 2026-07-02

Default migration rule: preserve current public URLs whenever practical. Redirects should be introduced only after an explicit route decision.

| Current WordPress URL | Proposed Next.js URL | Status | Priority | Redirect needed | Notes |
| --- | --- | --- | --- | --- | --- |
| `https://tatianasf.com/` | `/` | preserve | P0 | No | Homepage is indexed and canonical. |
| `https://tatianasf.com/hackathon_services/` | `/hackathon_services/` | preserve | P0 | No | Current canonical service URL; now the primary Next.js route. |
| `https://tatianasf.com/hackathon-services/` | `/hackathon-services/` | noindex | P2 | Future Cloudflare `301` to `/hackathon_services/` | Hyphen version currently returns 404 on WordPress. In Next.js it remains only as a noindex compatibility page with canonical metadata pointing to `/hackathon_services/`; production launch should redirect it at Cloudflare after staging approval. |
| `https://tatianasf.com/services` | `/services/` | noindex | P2 | No runtime redirect | Future structure placeholder only. Hidden from primary navigation, excluded from sitemap, and not a completed migration. |
| `https://tatianasf.com/services/` | `/services/` | noindex | P2 | No runtime redirect | Slash variant also returns 404 on WordPress. Static route remains reserved for future architecture only. |
| `https://tatianasf.com/cases` | `/cases/` | noindex | P2 | No runtime redirect | Future structure placeholder only. Hidden from primary navigation, excluded from sitemap, and not a completed migration. |
| `https://tatianasf.com/cases/` | `/cases/` | noindex | P2 | No runtime redirect | Slash variant also returns 404 on WordPress. Static route remains reserved for future architecture only. |
| `https://tatianasf.com/media` | `/media/` | noindex | P2 | No runtime redirect | Future structure placeholder only. Hidden from primary navigation, excluded from sitemap, and not a completed migration. |
| `https://tatianasf.com/media/` | `/media/` | noindex | P2 | No runtime redirect | Slash variant also returns 404 on WordPress. Static route remains reserved for future architecture only. |
| `https://tatianasf.com/partnership` | `/partnership/` | noindex | P2 | No runtime redirect | Future structure placeholder only. Hidden from primary navigation, excluded from sitemap, and not a completed migration. |
| `https://tatianasf.com/partnership/` | `/partnership/` | noindex | P2 | No runtime redirect | Slash variant also returns 404 on WordPress. Static route remains reserved for future architecture only. |
| `https://tatianasf.com/photo_portfolio/` | `/photo_portfolio/` | preserve | P1 | No | Published page in page sitemap. Preserved as a migration-scope route for SEO and future WordPress parity; content is not migrated yet. |
| `https://tatianasf.com/openai-codex-design-guide/` | `/openai-codex-design-guide/` | preserve | P1 | No | Published page in page sitemap with Google Drive CTA. Preserved as a migration-scope route; content and final access checks are not migrated yet. |
| `https://tatianasf.com/hello-world/` | `/hello-world/` | noindex | P3 | Future Cloudflare `301` to `/` | Legacy low-value WordPress default post. Static noindex cleanup page exists only to avoid promoting starter content before launch. |
| `https://tatianasf.com/category/uncategorized/` | `/category/uncategorized/` | noindex | P3 | Future Cloudflare `301` to `/` | Legacy WordPress archive. Static noindex cleanup page exists only to avoid promoting starter archive content before launch. |
| Author archive with email-derived slug | TBD | review | P3 | Likely yes | Public author archive discovered from post metadata; exact slug intentionally omitted from docs. |
| `https://tatianasf.com/feed/` | Optional static feed | review | P3 | TBD | WordPress RSS feed is public. Static site can omit or recreate only if useful. |
| `https://tatianasf.com/comments/feed/` | TBD | review | P3 | Likely yes | Comments feed is public but no runtime comments are planned. |
| `https://tatianasf.com/sitemap_index.xml` | `/sitemap.xml` | redirect | P2 | Yes | Current Rank Math sitemap index URL should redirect or be replaced by future sitemap strategy. |
| `https://tatianasf.com/post-sitemap.xml` | `/sitemap.xml` | redirect | P3 | Yes | WordPress sitemap shard should not remain as-is. |
| `https://tatianasf.com/page-sitemap.xml` | `/sitemap.xml` | redirect | P3 | Yes | WordPress sitemap shard should not remain as-is. |
| `https://tatianasf.com/category-sitemap.xml` | `/sitemap.xml` | redirect | P3 | Yes | WordPress sitemap shard should not remain as-is. |
| `https://tatianasf.com/wp-json/` | None | ignore | P3 | Optional 404 or redirect | WordPress REST endpoint should disappear after static launch. |
| `https://tatianasf.com/wp-login.php` | None | ignore | P3 | Optional 404 or redirect | WordPress login should disappear after static launch. |
| `https://tatianasf.com/xmlrpc.php` | None | ignore | P3 | Optional 404 or redirect | WordPress XML-RPC should disappear after static launch. |

## Route Decisions Needed Before Migration

- `/hackathon_services/` is the canonical preserved Hackathon Services route.
- `/photo_portfolio/` is a preserved migration-scope route. Batch 2 assets have been migrated and QA-passed, but page content has not been migrated yet.
- `/openai-codex-design-guide/` is a preserved migration-scope route. It still needs asset migration planning or a later asset batch before page rebuild work.
- `/hackathon-services/` is not canonical and is excluded from sitemap; production launch should use a Cloudflare `301` to `/hackathon_services/` after staging approval.
- `/services/`, `/cases/`, `/media/`, and `/partnership/` remain future structure routes only. They are noindexed, hidden from primary navigation, and excluded from sitemap until real content is approved.
- `/hello-world/` and `/category/uncategorized/` are legacy WordPress cleanup routes. They are noindexed, excluded from sitemap, should not be promoted, and should redirect to `/` through Cloudflare during an approved production launch.
- Use Cloudflare Redirect Rules or another static-host-compatible mechanism for any final 301 redirects; this static export project must not rely on runtime redirects.

See `docs/launch/cloudflare-redirects.md` for the launch redirect rule set.

## Launch-Scope Sitemap Routes

The current preserved canonical launch-scope routes are:

- `/`
- `/hackathon_services/`
- `/photo_portfolio/`
- `/openai-codex-design-guide/`

The routes above are accessible and included in the sitemap. `/photo_portfolio/` and `/openai-codex-design-guide/` are placeholders reserved for future WordPress parity migration and should not be treated as completed page migrations.
