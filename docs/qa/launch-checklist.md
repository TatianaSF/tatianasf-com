# Launch Checklist

Use this checklist before moving `tatianasf.com` from WordPress to GitHub Pages. DNS must not be switched until QA is approved.

## GitHub Pages Staging

- [ ] GitHub Pages is enabled for this repository.
- [ ] Deployment from `main` succeeds.
- [ ] Temporary GitHub Pages URL loads.
- [ ] Static assets load under the staging base path.
- [ ] Staging pages are noindexed.

## Build Success

- [ ] `npm ci` succeeds.
- [ ] `npm run lint` succeeds.
- [ ] `npm run public-safety` succeeds.
- [ ] `npm run build` succeeds.

## Sitemap

- [ ] `/sitemap.xml` is generated.
- [x] Expected launch-safe canonical routes are limited to `/`, `/hackathon_services/`, `/photo_portfolio/`, and `/openai-codex-design-guide/`.
- [x] Unwanted WordPress starter URLs are excluded from sitemap and represented only by noindex cleanup pages.
- [ ] Old Rank Math sitemap shard URLs are handled or allowed to 404 intentionally.
- [ ] Production URLs are correct before final launch.

## Robots

- [ ] `/robots.txt` is generated.
- [ ] Staging robots behavior is reviewed.
- [ ] Production robots behavior is reviewed.
- [ ] `wp-admin` rules are no longer needed after static launch.

## Analytics

- [ ] Confirm whether live Google tag `GT-PBS35NC4` should be retained.
- [ ] Confirm whether the implementation should use Google tag/gtag, GTM, or both.
- [ ] Confirm whether Komito tracking should be retained.
- [ ] Do not configure analytics IDs until approved for staging.
- [ ] Analytics firing is verified on staging after configuration.

## Search Console Verification

- [ ] Verification method is selected.
- [ ] No current `google-site-verification` meta tag was found during audit; add one only if needed.
- [ ] Verification file or tag is added if needed.
- [ ] Production property is verified after DNS switch.

## Open Graph Previews

- [ ] Homepage Open Graph image checked.
- [ ] Hackathon services Open Graph image checked.
- [ ] Portfolio Open Graph image checked if retained.
- [ ] OpenAI Codex Design Guide Open Graph image checked if retained.
- [ ] Social preview tools checked.

## URL and Redirect Readiness

- [x] `/hackathon_services/` approved as primary preserved route.
- [x] `/photo_portfolio/` approved as preserved migration-scope route, included in sitemap, and not added to primary navigation yet.
- [x] `/openai-codex-design-guide/` approved as preserved migration-scope route, included in sitemap, and not added to primary navigation yet.
- [x] `/hackathon-services/` marked as noindex compatibility route and excluded from sitemap.
- [x] Future Cloudflare `301` from `/hackathon-services/` to `/hackathon_services/` documented.
- [x] `/services`, `/cases`, `/media`, and `/partnership` kept as noindex future placeholders, hidden from primary navigation, and excluded from sitemap.
- [x] `/hello-world/` kept as a noindex legacy cleanup page, excluded from sitemap, with future Cloudflare `301` to `/` documented.
- [x] `/category/uncategorized/` kept as a noindex legacy cleanup page, excluded from sitemap, with future Cloudflare `301` to `/` documented.
- [ ] Cloudflare redirect rules for compatibility and legacy cleanup URLs approved for production launch.
- [ ] Feed URL behavior approved.
- [ ] WordPress REST/login/XML-RPC endpoint behavior approved after static launch.

## Cloudflare Redirect Rules

- [x] Redirect strategy documented in `docs/launch/cloudflare-redirects.md`.
- [ ] Confirm redirect rules are not enabled before final launch approval.
- [ ] Confirm `/hackathon-services/` redirects to `/hackathon_services/` with `301` during approved production launch.
- [ ] Confirm `/hello-world/` redirects to `/` with `301` during approved production launch.
- [ ] Confirm `/category/uncategorized/` redirects to `/` with `301` during approved production launch.
- [ ] Confirm `/hackathon_services/` returns `200` after redirect rules are enabled.
- [ ] Confirm sitemap includes only launch-safe canonical URLs.
- [ ] Confirm noindex placeholder pages are not in sitemap.
- [ ] Confirm `/services/`, `/cases/`, `/media/`, and `/partnership/` are not redirected in Phase 1 unless a later removal decision is approved.

## External Dependency Risks

- [ ] LinkedIn CTA behavior manually checked.
- [ ] Google Drive folder access manually checked.
- [ ] SlideShare links manually checked.
- [ ] Majordigest 404 link reviewed.
- [ ] Rubic HTTP 403 link reviewed.
- [ ] Cache query parameters such as `?swcfpc=1` reviewed.

## Cloudflare DNS Readiness

- [ ] Current DNS records documented.
- [ ] GitHub Pages target records prepared.
- [ ] TTL and rollback plan reviewed.
- [ ] DNS switch approved.

## HTTPS

- [ ] GitHub Pages HTTPS is active.
- [ ] Custom domain certificate is issued.
- [ ] Mixed content checks pass.
- [ ] External `http://` links are reviewed.

## Rollback Plan

- [ ] Previous Cloudflare DNS records documented.
- [ ] WordPress origin remains available until launch is approved.
- [ ] Rollback owner and steps are documented.
