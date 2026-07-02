# Parity Checklist

Use this checklist after route decisions and before replacing the current WordPress site. This audit step does not complete parity.

## Page Coverage

- [x] WordPress desktop/mobile screenshot baseline captured for approved public pages.
- [x] Public WordPress image and media inventory captured for approved pages.
- [x] Asset Migration Batch 1 downloaded icons, OG images, homepage critical images, and hackathon services critical images.
- [x] Asset Migration Batch 1 file QA report and contact sheet created.
- [ ] Asset Migration Batch 1 contact sheet manually reviewed against WordPress baseline screenshots.
- [x] Homepage `/` Phase 1 parity rebuild implemented.
- [ ] Homepage `/` manually reviewed against WordPress desktop/mobile screenshots.
- [x] Hackathon services current URL `/hackathon_services/` preserved as primary route.
- [x] Hyphen alias `/hackathon-services/` documented as noindex compatibility route, not canonical.
- [x] Portfolio `/photo_portfolio/` preserved as a migration-scope route and included in sitemap.
- [x] OpenAI Codex Design Guide `/openai-codex-design-guide/` preserved as a migration-scope route and included in sitemap.
- [x] Default post `/hello-world/` kept only as a noindex legacy cleanup page and excluded from sitemap.
- [x] Category archive `/category/uncategorized/` kept only as a noindex legacy cleanup page and excluded from sitemap.
- [x] Header 404 links `/services`, `/cases`, `/media`, and `/partnership` hidden from Next.js primary navigation until content exists.
- [x] Future structure placeholders `/services/`, `/cases/`, `/media/`, and `/partnership/` are noindexed, excluded from sitemap, and not treated as completed migrations.

## Header and Footer Parity

- [x] Brand/home link matches approved behavior.
- [x] Header navigation labels match approved source labels without exposing future placeholder routes.
- [x] Header links do not expose incomplete future placeholder pages.
- [x] Footer tagline is preserved in English.
- [x] Duplicated footer `Hackathon services` link is preserved for first-pass parity.
- [x] LinkedIn contact CTA is preserved where approved.

## Homepage Parity

- [ ] Main profile image and first viewport composition manually match screenshots.
- [x] Homepage Batch 1 critical assets downloaded.
- [x] Homepage page implementation uses migrated local assets.
- [x] Biography, work, education, skills, recognition, certification, philosophy, media, and friends sections are present.
- [x] Long media list link labels and targets are carried into structured content.
- [x] Friend section labels and YouTube targets are carried into structured content.
- [ ] Images have matching crops, aspect ratios, and spacing.

## Hackathon Services Parity

- [ ] Page title and top service structure match screenshots.
- [x] Hackathon services Batch 1 critical assets downloaded.
- [ ] Hackathon services page implementation uses migrated local assets.
- [ ] Three service option sections are rebuilt.
- [ ] Event/gallery images match current order and crops.
- [ ] SlideShare deck links are preserved.
- [ ] FAQ section is rebuilt.
- [ ] Final LinkedIn inquiry CTA is preserved.

## Portfolio Parity

- [x] Portfolio route decision is approved for preservation.
- [x] Portfolio displayed assets migrated from approved inventory in Batch 2.
- [x] Portfolio Batch 2 asset QA report and contact sheet created.
- [ ] Portfolio Batch 2 assets manually reviewed against WordPress baseline screenshots.
- [ ] Image sections and heading order match screenshots.
- [ ] All retained images are migrated with correct dimensions and crops.
- [ ] Missing `alt` text is added during asset/content migration.

## OpenAI Codex Design Guide Parity

- [x] Route decision is approved for preservation.
- [x] OpenAI Codex Design Guide asset migration Batch 3 is completed.
- [x] OpenAI Codex Design Guide image mapped from approved inventory to the existing Batch 1 file.
- [x] OpenAI Codex Design Guide Batch 3 asset QA report and contact sheet created.
- [ ] OpenAI Codex Design Guide Batch 3 contact sheet manually reviewed before page rebuild.
- [ ] Main image and Google Drive CTA are preserved if retained.
- [ ] Google Drive access is manually verified.

## Desktop Parity

- [x] Homepage WordPress desktop baseline captured.
- [x] Hackathon services WordPress desktop baseline captured.
- [x] Portfolio WordPress desktop baseline captured.
- [x] OpenAI Codex Design Guide WordPress desktop baseline captured.
- [x] Legacy WordPress post and category archive desktop baselines captured.
- [ ] Next.js homepage desktop manually compared against WordPress baseline after Phase 1 rebuild.
- [ ] Next.js remaining desktop pages compared against WordPress baselines after content migration.
- [ ] 404/redirect behavior checked for old URLs.

## Mobile Parity

- [x] Homepage WordPress mobile baseline captured.
- [x] Hackathon services WordPress mobile baseline captured.
- [x] Portfolio WordPress mobile baseline captured.
- [x] OpenAI Codex Design Guide WordPress mobile baseline captured.
- [x] Legacy WordPress post and category archive mobile baselines captured.
- [ ] Homepage mobile header navigation behavior manually checked against baseline after Phase 1 rebuild.
- [ ] Homepage content width and WordPress block spacing manually checked against baseline after Phase 1 rebuild.
- [ ] Long headings and list items checked for wrapping after content migration.
- [ ] Image galleries checked for crop and order after content migration.
- [ ] CTA buttons checked for tap target size after content migration.

## URL Parity

- [ ] Current sitemap URLs are mapped.
- [x] Current header 404 URLs are intentionally hidden until content exists.
- [ ] Trailing slash behavior reviewed.
- [ ] Underscore/hyphen route behavior reviewed.
- [ ] Feed, sitemap shard, REST, login, and XML-RPC URL behavior reviewed.

## Link Parity

- [ ] Internal links checked.
- [ ] External links checked.
- [ ] LinkedIn bot-protection behavior considered during automated tests.
- [ ] `?swcfpc=1` query parameters reviewed.
- [ ] Known external issues reviewed: Majordigest returned 404; Rubic returned 403 over HTTP.

## SEO Parity

- [ ] Page titles checked.
- [ ] Meta descriptions checked.
- [ ] Canonicals checked.
- [ ] Open Graph titles/descriptions/images checked.
- [x] Favicon and site icons downloaded from approved inventory.
- [x] Open Graph/Twitter image assets downloaded from approved inventory.
- [ ] Favicon, site icon, and Open Graph metadata implementation checked in built HTML.
- [ ] Twitter card metadata checked.
- [ ] Robots rules checked.
- [ ] JSON-LD reviewed.
- [ ] Sitemap excludes unwanted starter WordPress URLs.

## Analytics Parity

- [ ] Confirm whether `GT-PBS35NC4` should be retained.
- [ ] Confirm whether a Google tag component or GTM component should be used.
- [ ] Confirm whether Komito tracking should be retained.
- [ ] Verify analytics on staging only after approved IDs are configured.
