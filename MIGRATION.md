# Migration Notes

This is a WordPress-to-Next.js migration project for the future static replacement of `https://tatianasf.com/`.

## Migration Phases

### Phase 1: WordPress Parity

The first migration phase will rebuild the existing WordPress website as a static Next.js site while preserving the approved current user-facing experience as closely as possible.

Expected parity areas:

- URLs
- Navigation
- Page content
- Images and media
- Internal links
- External links
- SEO metadata
- Open Graph metadata
- Analytics or tag manager setup
- Desktop and mobile visual structure

### Phase 2: Future Redesign

After parity is approved, a separate `future-redesign` branch can be used for design exploration and improvements.

## Current Status

Initialization is complete and the first public WordPress audit has been performed.

Completed so far:

- Next.js App Router project structure.
- Static export configuration.
- GitHub Pages deployment workflow.
- Public GitHub repository at `https://github.com/TatianaSF/tatianasf-com`.
- First GitHub Pages staging deployment at `https://tatianasf.github.io/tatianasf-com/`.
- Placeholder routes.
- SEO helper.
- Sitemap and robots generation.
- Google Tag Manager placeholder component.
- Documentation skeleton.
- Public safety scan.
- Public WordPress audit of pages, metadata, links, images, scripts, sitemap, robots, and WordPress traces.
- Public WordPress visual baseline screenshots for approved pages, with desktop and mobile viewport captures.
- Public WordPress image and media inventory, with an asset migration plan.
- Asset Migration Batch 1 for icons, Open Graph images, homepage critical images, and hackathon services critical images.
- Asset Migration Batch 1 QA report, machine-readable QA data, and local visual contact sheet.
- Asset Migration Batch 2 for displayed `/photo_portfolio/` public image assets.
- Asset Migration Batch 2 QA report, machine-readable QA data, and local visual contact sheet.
- Route scope hardening for `/photo_portfolio/` and `/openai-codex-design-guide/` as preserved migration-scope routes.
- Asset Migration Batch 3 for `/openai-codex-design-guide/` public asset traceability.
- Asset Migration Batch 3 QA report, machine-readable QA data, and local visual contact sheet.
- Homepage `/` WordPress parity Phase 1 rebuild using audited public content and Batch 1 homepage assets.
- Homepage parity QA helper added at `tools/homepage-qa/main.go` with report output at `docs/qa/homepage-parity-report.md`.

Content migration is only partially complete. The homepage has a first-pass parity rebuild; `/hackathon_services/`, `/photo_portfolio/`, `/openai-codex-design-guide/`, hidden future placeholders, and legacy cleanup pages have not been rebuilt with WordPress content.

## GitHub Pages Staging

The temporary staging site is deployed through GitHub Actions:

- Repository: `https://github.com/TatianaSF/tatianasf-com`
- Visibility: public
- Staging URL: `https://tatianasf.github.io/tatianasf-com/`
- Source: GitHub Actions
- Workflow run: `https://github.com/TatianaSF/tatianasf-com/actions/runs/28566642514`
- Deployed commit: `abb037c822911251d37bd397911c22ec501d0323`

The first staging deploy passed lint, public-safety, static build, artifact upload, and GitHub Pages deployment. The staging site is blocked from indexing with `noindex, nofollow` metadata and staging `robots.txt` disallows crawling.

This staging URL is only a technical preview for GitHub Pages, static export, routing, sitemap, robots, and accessibility checks. It is not WordPress parity, content migration is still incomplete, and production launch remains blocked until QA and Cloudflare steps are explicitly approved.

Cloudflare and `tatianasf.com` are not connected yet. No custom domain, DNS switch, or production redirect rules have been configured.

## Audit Findings

Published sitemap URLs discovered:

- `https://tatianasf.com/`
- `https://tatianasf.com/hackathon_services/`
- `https://tatianasf.com/photo_portfolio/`
- `https://tatianasf.com/openai-codex-design-guide/`
- `https://tatianasf.com/hello-world/`
- `https://tatianasf.com/category/uncategorized/`

Important findings:

- The current canonical hackathon services URL uses an underscore: `/hackathon_services/`.
- Route decision applied: `/hackathon_services/` is now the primary preserved Next.js route.
- `/hackathon-services/` is retained only as a noindex compatibility route and is not canonical.
- Header links to `/services`, `/cases`, `/media`, and `/partnership` currently return 404 on WordPress.
- The Next.js project keeps `/services/`, `/cases/`, `/media/`, and `/partnership/` as noindex future structure placeholders, not completed WordPress migrations.
- Future structure placeholders are hidden from primary navigation and excluded from sitemap until real content is approved.
- The default WordPress post `/hello-world/` and category archive are public and indexed on WordPress.
- The Next.js project keeps `/hello-world/` and `/category/uncategorized/` only as noindex legacy cleanup pages excluded from sitemap.
- Many images are loaded from `wp-content/uploads` and need a separate asset migration plan.
- Many gallery images have empty `alt` text.
- The asset inventory found `462` image/media references and `265` unique assets across approved public WordPress pages.
- The inventory found `56` image references with missing alt text.
- Rank Math controls SEO output and sitemap files.
- Google Site Kit injects the live Google tag loader.
- Live analytics uses a public Google tag ID (`GT-PBS35NC4`) rather than a `GTM-` container ID.
- Komito tracking is present and needs confirmation before launch.
- WordPress REST, login, and XML-RPC endpoints are public WordPress footprints that should disappear after the static launch.

## Screenshot Baseline

Visual baseline screenshots are saved in `docs/audit/screenshots/wordpress-baseline/`.

The screenshot manifest is `docs/audit/screenshots/wordpress-baseline/manifest.md`.

Captured pages:

- `https://tatianasf.com/`
- `https://tatianasf.com/hackathon_services/`
- `https://tatianasf.com/photo_portfolio/`
- `https://tatianasf.com/openai-codex-design-guide/`
- `https://tatianasf.com/hello-world/`
- `https://tatianasf.com/category/uncategorized/`

Each page has desktop `1440x1200` and mobile `390x844` full-page screenshots. These screenshots are a visual baseline only and do not mean content migration is complete.

## Asset Inventory

The asset inventory is saved in:

- `docs/audit/image-inventory.md`
- `docs/audit/data/wordpress-assets.json`
- `docs/audit/asset-migration-plan.md`

The inventory covers approved public WordPress pages only. It records images, `srcset` variants, discoverable background images, Open Graph images, site icons, linked media files, approximate file sizes when available, alt text status, duplicate usage, and suggested future local paths.

Asset Migration Batch 1 downloaded `44` public WordPress image assets:

- `3` favicon/site icon assets
- `3` Open Graph/Twitter image assets
- `12` homepage critical displayed image assets
- `26` `/hackathon_services/` critical displayed image assets

Batch 1 files are organized under `public/icons`, `public/og`, `public/images/pages/home`, and `public/images/pages/hackathon-services`.

Batch 1 QA has verified `44` of `44` downloaded files:

- QA report: `docs/audit/assets-review/batch-1/asset-qa-report.md`
- Machine-readable QA data: `docs/audit/data/asset-qa-batch-1.json`
- Visual contact sheet: `docs/audit/assets-review/batch-1/contact-sheet.html`

Batch 1 does not mean page content migration is complete. App pages have not been rebuilt to use these assets yet.

Asset Migration Batch 2 downloaded and mapped displayed `/photo_portfolio/` image assets:

- Attempted: `28`
- Downloaded: `22`
- Mapped from Batch 1: `6`
- Failed: `0`
- Target folder: `public/images/pages/photo-portfolio`
- Machine-readable output: `docs/audit/data/migrated-assets-batch-2.json`

Batch 2 QA has verified `28` of `28` downloaded or mapped files:

- QA report: `docs/audit/assets-review/batch-2/asset-qa-report.md`
- Machine-readable QA data: `docs/audit/data/asset-qa-batch-2.json`
- Visual contact sheet: `docs/audit/assets-review/batch-2/contact-sheet.html`

Batch 2 does not mean page content migration is complete. The portfolio page has not been rebuilt in the App Router.

Asset Migration Batch 3 reviewed and mapped `/openai-codex-design-guide/` image/media records:

- Attempted: `11`
- Downloaded: `0`
- Mapped from Batch 1: `4`
- Mapped from Batch 2: `1`
- Skipped: `6`
- Failed: `0`
- Target folder: `public/images/pages/openai-codex-design-guide`
- Machine-readable output: `docs/audit/data/migrated-assets-batch-3.json`

Batch 3 mapped the OpenAI Codex Design Guide image to `public/og/openai-codex-design-guide-small.jpg`, mapped shared existing assets from earlier batches, and skipped optional emoji or unneeded `srcset`-only variants. Batch 3 does not mean page content migration is complete. The OpenAI Codex Design Guide page has not been rebuilt in the App Router.

Batch 3 QA has verified `11` of `11` mapped or skipped records:

- QA report: `docs/audit/assets-review/batch-3/asset-qa-report.md`
- Machine-readable QA data: `docs/audit/data/asset-qa-batch-3.json`
- Visual contact sheet: `docs/audit/assets-review/batch-3/contact-sheet.html`

Batch 3 QA does not mean page content migration is complete. The OpenAI Codex Design Guide page has not been rebuilt in the App Router, and Google Drive access still requires manual review.

## Homepage Parity Phase 1

The homepage `/` is no longer an initialization placeholder. It has been rebuilt as the first WordPress parity page using the public WordPress audit, baseline screenshots, extracted public homepage text, and migrated Batch 1 homepage assets.

Homepage sections now represented in `app/page.tsx`:

- Header and approved primary navigation.
- Hero/profile area with the main TatianaSF image.
- Personal background.
- Work.
- Education.
- Skills and competencies.
- Recognition and achievements.
- Professional certification.
- Personal philosophy and mission.
- Presence in the media.
- Friends links.
- Footer with brand, tagline, hackathon links, and LinkedIn contact.

Structured homepage content lives in `content/home.ts`. Reusable home components live under `components/home`.

Homepage metadata now uses the audited WordPress homepage description `Name: Tatiana Isa`, canonical `/`, and the audited Open Graph image already migrated into `public/og`.

Homepage QA:

- QA helper: `tools/homepage-qa/main.go`
- NPM command: `npm run qa:homepage`
- Report: `docs/qa/homepage-parity-report.md`

The local environment does not currently have Go available in `PATH`, so `npm run qa:homepage` is blocked locally until Go is installed. Manual static checks against `out/index.html` passed after `npm run build`; manual visual review against the WordPress desktop and mobile screenshots is still required.

## Preserved Migration-Scope Routes

The current Next.js sitemap preserves these canonical launch-scope routes:

- `/`
- `/hackathon_services/`
- `/photo_portfolio/`
- `/openai-codex-design-guide/`

`/photo_portfolio/` and `/openai-codex-design-guide/` exist as safe placeholder routes only. They are preserved for SEO and future WordPress parity migration, but their WordPress content has not been copied into App Router pages. `/hackathon_services/` also remains a preserved placeholder until its own rebuild is explicitly approved.

`/photo_portfolio/` has Batch 2 displayed assets migrated and QA-passed. `/openai-codex-design-guide/` has Batch 3 asset mapping and QA complete, but it still needs Google Drive access review and page rebuild approval before any parity claim.

## Unknowns and Decisions Needed

- Whether to retain, redirect, or drop `/photo_portfolio/` and `/openai-codex-design-guide/`.
- Whether to retain Komito tracking.
- Whether Google Drive access for the OpenAI Codex Design Guide page is intentionally public.
- Exact desktop/mobile visual parity still needs screenshot-based QA.

## Future Cloudflare Redirects

Runtime redirects are not implemented in Next.js because this project uses static export and GitHub Pages.

After GitHub Pages staging QA and final launch approval, production redirects should be handled with Cloudflare Redirect Rules:

- `/hackathon-services/` -> `/hackathon_services/` with `301`.
- `/hello-world/` -> `/` with `301`.
- `/category/uncategorized/` -> `/` with `301`.

Phase 1 should not redirect `/services/`, `/cases/`, `/media/`, or `/partnership/`. They remain noindex static future structure placeholders, excluded from sitemap and hidden from primary navigation, unless a later removal decision is approved.

See `docs/launch/cloudflare-redirects.md` for the full launch redirect checklist.

## Recommended Next Migration Step

Before continuing page rebuild work:

1. Keep Cloudflare redirect rules documented but disabled until GitHub Pages staging QA and final launch approval.
2. Install Go or use an environment with Go available, then run `npm run qa:homepage`.
3. Manually review the rebuilt homepage against `home-desktop.png` and `home-mobile.png`.
4. Review the Batch 2 contact sheet before any `/photo_portfolio/` rebuild.
5. Review the Batch 3 QA contact sheet before rebuilding the OpenAI Codex Design Guide route.
6. Convert the next approved public page content into structured page components only after explicit approval.
7. Decide whether analytics should use a Google tag component, the existing GTM component, or both.

## Not Included Yet

- WordPress content migration into app pages other than the first-pass homepage.
- Full asset migration for remaining WordPress images and media.
- Metadata implementation in code.
- Redirect implementation.
- DNS switch.
- Production custom-domain deployment.
- Final launch approval.
