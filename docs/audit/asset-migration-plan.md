# Asset Migration Plan

Plan date: 2026-07-02

Source inventory:

- Human-readable inventory: `docs/audit/image-inventory.md`
- Machine-readable inventory: `docs/audit/data/wordpress-assets.json`
- Batch 1 manifest: `docs/audit/assets-migration-manifest.md`
- Batch 1 machine-readable output: `docs/audit/data/migrated-assets-batch-1.json`
- Batch 1 QA report: `docs/audit/assets-review/batch-1/asset-qa-report.md`
- Batch 1 QA data: `docs/audit/data/asset-qa-batch-1.json`
- Batch 1 contact sheet: `docs/audit/assets-review/batch-1/contact-sheet.html`
- Batch 2 machine-readable output: `docs/audit/data/migrated-assets-batch-2.json`
- Batch 2 QA report: `docs/audit/assets-review/batch-2/asset-qa-report.md`
- Batch 2 QA data: `docs/audit/data/asset-qa-batch-2.json`
- Batch 2 contact sheet: `docs/audit/assets-review/batch-2/contact-sheet.html`
- Batch 3 machine-readable output: `docs/audit/data/migrated-assets-batch-3.json`
- Batch 3 QA report: `docs/audit/assets-review/batch-3/asset-qa-report.md`
- Batch 3 QA data: `docs/audit/data/asset-qa-batch-3.json`
- Batch 3 contact sheet: `docs/audit/assets-review/batch-3/contact-sheet.html`

This plan is for future asset migration only. It does not download assets, migrate content, rebuild pages, deploy, switch DNS, or change production metadata.

## Inventory Summary

The public WordPress asset inventory found:

- Total image/media references: `462`
- Unique assets: `265`
- WordPress upload assets: `255`
- External assets: `10`
- Open Graph/Twitter image assets: `3`
- Favicon/site icon assets: `3`
- Assets used on multiple pages: `29`
- Image references missing alt text: `56`

## Recommended Public Folder Structure

Use a clean `public` structure grouped by purpose and page ownership:

```text
public/
  icons/
  og/
  images/
    profile/
    pages/
      home/
      hackathon-services/
      photo-portfolio/
      openai-codex-design-guide/
    legacy/
      emoji/
```

Suggested generated paths currently map to:

- `public/images/pages/home`: `41` assets
- `public/images/pages/hackathon-services`: `118` assets
- `public/images/pages/photo-portfolio`: `90` assets
- `public/images/pages/openai-codex-design-guide`: assets represented mostly through `public/og`
- `public/icons`: `3` assets
- `public/og`: `3` assets
- `public/images/legacy/emoji`: `10` optional WordPress emoji CDN assets

## Naming Conventions

- Use lowercase filenames.
- Replace whitespace and underscores with hyphens.
- Preserve meaningful source names when they are readable.
- Keep WordPress-generated dimensions in filenames only when the resized variant is intentionally used.
- Prefer one canonical local image per displayed image when Next.js can provide responsive sizing later.
- Avoid copying opaque cache query strings into filenames.

## Batch 1 Status

Asset Migration Batch 1 is complete.

Batch 1 downloaded and organized:

- Favicon and site icons: `3`
- Open Graph/Twitter images: `3`
- Homepage critical displayed images: `12`
- `/hackathon_services/` critical displayed images: `26`

Batch 1 totals:

- Attempted: `44`
- Downloaded: `44`
- Skipped: `0`
- Failed: `0`

Downloaded assets were saved under:

- `public/icons`
- `public/og`
- `public/images/pages/home`
- `public/images/pages/hackathon-services`

This batch does not update app pages to use the downloaded assets yet. Page content migration and visual rebuild work remain separate future steps.

## Batch 1 QA Status

Asset Migration Batch 1 QA is complete.

QA results:

- Assets checked: `44`
- Passed: `44`
- Failed: `0`
- Warnings: `0`

QA artifacts:

- Readable report: `docs/audit/assets-review/batch-1/asset-qa-report.md`
- Machine-readable data: `docs/audit/data/asset-qa-batch-1.json`
- Local visual review page: `docs/audit/assets-review/batch-1/contact-sheet.html`

The contact sheet is a manual visual review aid. It does not mean page content migration, page rebuild work, or final parity QA is complete.

## Batch 2 Status

Asset Migration Batch 2 is complete for displayed `/photo_portfolio/` visual assets.

Batch 2 selected displayed same-site WordPress upload images used by `https://tatianasf.com/photo_portfolio/`. It excluded optional WordPress emoji assets and `srcset`-only variants unless the variant was the displayed image in the inventory.

Batch 2 totals:

- Attempted: `28`
- Downloaded: `22`
- Mapped from Batch 1: `6`
- Failed: `0`

Downloaded assets were saved under:

- `public/images/pages/photo-portfolio`

Duplicate displayed images already downloaded in Batch 1 were mapped to existing local paths instead of duplicated.

Batch 2 does not update app pages to use the downloaded assets yet. Page content migration, portfolio route decisions, and visual rebuild work remain separate future steps.

## Batch 2 QA Status

Asset Migration Batch 2 QA is complete.

QA results:

- Assets checked: `28`
- Downloaded assets checked: `22`
- Mapped assets checked: `6`
- Passed: `28`
- Failed: `0`
- Warnings: `0`

QA artifacts:

- Readable report: `docs/audit/assets-review/batch-2/asset-qa-report.md`
- Machine-readable data: `docs/audit/data/asset-qa-batch-2.json`
- Local visual review page: `docs/audit/assets-review/batch-2/contact-sheet.html`

The contact sheet is a manual visual review aid. It does not mean page content migration, page rebuild work, or final parity QA is complete.

## Batch 3 Status

Asset Migration Batch 3 is complete for `/openai-codex-design-guide/` asset traceability.

Batch 3 reviewed all public image/media records used by `https://tatianasf.com/openai-codex-design-guide/`. No new files were downloaded because the page's required visual assets were already covered by earlier batches.

Batch 3 totals:

- Attempted: `11`
- Downloaded: `0`
- Mapped from Batch 1: `4`
- Mapped from Batch 2: `1`
- Skipped: `6`
- Failed: `0`

Mapped assets:

- OpenAI Codex Design Guide image: `public/og/openai-codex-design-guide-small.jpg`
- Shared displayed profile image: `public/images/pages/photo-portfolio/tatianasf.jpg`
- Site icons: `public/icons`

Skipped assets:

- Optional WordPress emoji assets from `s.w.org`.
- `srcset`-only `TatianaSF` variants not needed for this displayed visual asset batch.

Target folder created for future page-owned files:

- `public/images/pages/openai-codex-design-guide`

Batch 3 does not update app pages to use the mapped assets yet. Page content migration, OpenAI Codex Design Guide rebuild work, and final visual parity QA remain separate future steps.

## Batch 3 QA Status

Asset Migration Batch 3 QA is complete.

QA results:

- Records checked: `11`
- Mapped assets checked: `5`
- Skipped assets checked: `6`
- Downloaded assets checked: `0`
- Passed: `11`
- Failed: `0`
- Warnings: `0`

QA artifacts:

- Readable report: `docs/audit/assets-review/batch-3/asset-qa-report.md`
- Machine-readable data: `docs/audit/data/asset-qa-batch-3.json`
- Local visual review page: `docs/audit/assets-review/batch-3/contact-sheet.html`

The contact sheet is a manual visual review aid. It does not mean page content migration, page rebuild work, Google Drive access review, or final parity QA is complete.

## Migration Priority

### Priority 1: Global and SEO-Critical Assets

Completed in Batch 1:

- Site icons from current favicon/apple-touch-icon references into `public/icons`.
- Current Open Graph/Twitter images into `public/og`.
- Initial homepage and hackathon services visual assets for future parity work.

### Priority 2: Homepage Visual Parity Assets

Migrate homepage profile, work, recognition, certification, media, and friend-section images after page content structure is approved.

The homepage has high visual-parity value because it is the primary canonical route and the main public entry point.

### Priority 3: Hackathon Services Assets

Migrate hackathon hero, event/gallery, service, SlideShare-adjacent, and CTA-supporting images after `/hackathon_services/` content migration begins.

This route is canonical and included in the sitemap, so its visual assets should be migrated before any production parity claim.

### Priority 4: Photo Portfolio Assets

Displayed portfolio assets have been migrated in Batch 2 for future parity work.

Remaining portfolio work should include manual Batch 2 contact-sheet review and page implementation only after content migration is explicitly approved. `/photo_portfolio/` is now a preserved migration-scope route in the sitemap, but it remains placeholder content.

### Priority 5: OpenAI Codex Design Guide Asset

The `/openai-codex-design-guide/` route is now preserved in migration scope and included in the sitemap as a placeholder route.

Batch 3 has mapped the OpenAI Codex Design Guide image from Batch 1 and the shared displayed profile image from Batch 2. Also manually verify the linked Google Drive folder access before treating the page as launch-ready.

## Optional and Legacy Assets

- WordPress emoji CDN assets from `s.w.org` are optional. Prefer native text emoji rendering unless exact WordPress emoji image parity is required.
- `/hello-world/` and `/category/uncategorized/` assets are legacy cleanup only. Do not prioritize them unless final launch behavior requires a visible noindex cleanup page.
- WordPress theme 404 imagery should be reviewed only if a parity 404 page is approved.

## Remaining Asset Batches

Recommended next batch:

1. Review the Batch 2 contact sheet against the WordPress baseline screenshots before approving page rebuild work.
2. Migrate any missing homepage, hackathon, or portfolio `srcset` variants only when page implementation proves they are needed.
3. Review the Batch 3 QA report and contact sheet before rebuilding `/openai-codex-design-guide/`.
4. Migrate legacy cleanup assets only if the noindex cleanup pages need visible parity before Cloudflare redirects are enabled.

## Alt Text Plan

The inventory found `56` image references missing alt text.

During content migration:

- Do not blindly preserve empty WordPress `alt` values.
- Add meaningful `alt` text for content images.
- Use empty `alt=""` only for decorative images.
- Review duplicated assets once and reuse approved alt text where the usage context is the same.

## Verification After Asset Migration

After future asset migration:

1. Confirm each migrated file exists under the planned `public` path.
2. Confirm page components use local asset paths, not `wp-content/uploads` URLs.
3. Compare migrated pages against `docs/audit/screenshots/wordpress-baseline/`.
4. Check desktop and mobile image crops, aspect ratios, and spacing.
5. Verify Open Graph and favicon output in built HTML.
6. Run `npm run lint`, `npm run public-safety`, and `npm run build`.
7. Run a link/asset check on the static export to confirm no missing local files.

## Risks and Unknowns

- The live WordPress site can change after this inventory date.
- Some file sizes were unavailable from `HEAD` requests.
- WordPress `srcset` variants may include more local files than the static Next.js site needs.
- Large portfolio images should be reviewed for compression and responsive sizing before copying.
- External emoji assets should not be migrated unless visual parity requires them.
- Open Graph images and metadata should not be changed in production until content parity is approved.
