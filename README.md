# TatianaSF Website Foundation

This repository is the initial technical foundation for the future static replacement of `https://tatianasf.com/`.

The current production website is still on WordPress. This repository does not migrate WordPress content yet. It only prepares the architecture, build system, deployment flow, documentation skeleton, and public safety checks for future migration work.

## Purpose

- Build a clean Next.js App Router project for a static public website.
- Prepare for a future pixel-parity migration from WordPress.
- Deploy first to a temporary GitHub Pages staging URL.
- Switch the main Cloudflare DNS only after QA approval.

## Tech Stack

- Framework: Next.js App Router
- Language: TypeScript and TSX
- Rendering: static export
- Hosting target: GitHub Pages
- Output directory: `out`
- CMS: none
- Database: none
- Runtime backend: none
- Content editing: code changes through Codex

## Local Setup

```powershell
npm ci
npm run dev
```

## Useful Commands

```powershell
npm run lint
npm run public-safety
npm run build
npm run screenshots:wordpress
npm run inventory:assets
npm run migrate:assets:batch1
npm run migrate:assets:batch2
npm run migrate:assets:batch3
npm run verify:assets:batch1
npm run verify:assets:batch2
npm run verify:assets:batch3
```

`npm run screenshots:wordpress` captures public live WordPress baseline screenshots for approved audit pages and writes a manifest to `docs/audit/screenshots/wordpress-baseline/manifest.md`.

`npm run inventory:assets` inventories public live WordPress images and media for approved audit pages, writes JSON to `docs/audit/data/wordpress-assets.json`, and writes Markdown to `docs/audit/image-inventory.md`.

`npm run migrate:assets:batch1` downloads the approved first asset batch from public WordPress asset URLs into `public/icons`, `public/og`, `public/images/pages/home`, and `public/images/pages/hackathon-services`. It writes a manifest to `docs/audit/assets-migration-manifest.md`.

`npm run migrate:assets:batch2` downloads displayed public WordPress image assets used by `/photo_portfolio/` into `public/images/pages/photo-portfolio` and maps duplicate images already covered by Batch 1. It updates `docs/audit/data/migrated-assets-batch-2.json` and `docs/audit/assets-migration-manifest.md`.

`npm run migrate:assets:batch3` reviews public WordPress image/media records used by `/openai-codex-design-guide/`, maps assets already covered by Batch 1 or Batch 2, records optional skipped assets, creates `public/images/pages/openai-codex-design-guide`, and updates `docs/audit/data/migrated-assets-batch-3.json` plus `docs/audit/assets-migration-manifest.md`.

`npm run verify:assets:batch1` verifies the downloaded Batch 1 files, writes machine-readable QA data to `docs/audit/data/asset-qa-batch-1.json`, writes a readable report to `docs/audit/assets-review/batch-1/asset-qa-report.md`, and creates a local visual contact sheet at `docs/audit/assets-review/batch-1/contact-sheet.html`.

`npm run verify:assets:batch2` verifies the downloaded and mapped Batch 2 portfolio files, writes machine-readable QA data to `docs/audit/data/asset-qa-batch-2.json`, writes a readable report to `docs/audit/assets-review/batch-2/asset-qa-report.md`, and creates a local visual contact sheet at `docs/audit/assets-review/batch-2/contact-sheet.html`.

`npm run verify:assets:batch3` verifies mapped and skipped Batch 3 OpenAI Codex Design Guide records, writes machine-readable QA data to `docs/audit/data/asset-qa-batch-3.json`, writes a readable report to `docs/audit/assets-review/batch-3/asset-qa-report.md`, and creates a local visual contact sheet at `docs/audit/assets-review/batch-3/contact-sheet.html`.

## Deployment Flow

GitHub Actions deploys the static export from `out` to GitHub Pages when changes are pushed to `main`. The workflow also supports manual `workflow_dispatch` runs.

The workflow runs:

```powershell
npm ci
npm run lint
npm run public-safety
npm run build
```

## Current Staging Deployment

- GitHub repository: `https://github.com/TatianaSF/tatianasf-com`
- Repository visibility: public
- Temporary GitHub Pages URL: `https://tatianasf.github.io/tatianasf-com/`
- Deployment source: GitHub Actions
- First staging deployment status: successful
- First deployed commit: `abb037c822911251d37bd397911c22ec501d0323`
- Workflow run: `https://github.com/TatianaSF/tatianasf-com/actions/runs/28566642514`

This staging site is a technical preview for verifying GitHub Pages, static export, routing, sitemap, robots behavior, and staging accessibility. It is not a WordPress parity rebuild.

Cloudflare and `tatianasf.com` are not connected to this repository yet. Do not add a custom domain, switch DNS, or replace the live WordPress site until QA and Cloudflare launch steps are approved.

## Staging-First Launch Strategy

1. Deploy this repository to the temporary GitHub Pages URL.
2. Complete WordPress audit, screenshot capture, URL mapping, metadata review, and visual parity QA in later steps.
3. Confirm sitemap, robots rules, analytics, Open Graph previews, and Search Console readiness.
4. Switch Cloudflare DNS for `tatianasf.com` to GitHub Pages only after QA approval.
5. Keep a rollback plan until the new static site is fully verified.

## WordPress Status

WordPress is not used as a CMS, backend, PHP runtime, or database in this new project. The current WordPress website remains the source for future audit and parity work, but no WordPress content has been migrated in this initialization step.

Baseline screenshots of approved public WordPress pages are saved in `docs/audit/screenshots/wordpress-baseline/`. They are visual references only and do not mean content migration is complete.

Image and media inventory docs are saved in `docs/audit/image-inventory.md` and `docs/audit/asset-migration-plan.md`. They are planning references only and do not mean assets have been migrated.

Asset Migration Batch 1 has downloaded selected high-priority public assets for future visual parity. App pages still do not use migrated WordPress content or images.

Asset Migration Batch 1 QA is documented in `docs/audit/assets-review/batch-1/asset-qa-report.md`. The contact sheet is for human visual review only and does not mean page rebuild work is complete.

Asset Migration Batch 2 has downloaded displayed `/photo_portfolio/` public image assets into `public/images/pages/photo-portfolio` and mapped already-migrated duplicates from Batch 1. App pages still do not use migrated WordPress content or images.

Asset Migration Batch 2 QA is documented in `docs/audit/assets-review/batch-2/asset-qa-report.md`. The contact sheet is for human visual review only and does not mean page rebuild work is complete.

Asset Migration Batch 3 has reviewed `/openai-codex-design-guide/` public image/media records, mapped the required existing files from Batch 1 and Batch 2, skipped optional emoji and unneeded `srcset` variants, and created `public/images/pages/openai-codex-design-guide` for future page-owned files. App pages still do not use migrated WordPress content or images.

Asset Migration Batch 3 QA is documented in `docs/audit/assets-review/batch-3/asset-qa-report.md`. The contact sheet is for human visual review only and does not mean page rebuild work is complete.

## Environment Variables

```text
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_SITE_URL=https://tatianasf.com
NEXT_PUBLIC_BASE_PATH=
```

`NEXT_PUBLIC_GTM_ID` is optional. The Google Tag Manager component renders nothing when it is not set.

For GitHub Pages project staging, the workflow sets:

```text
NEXT_PUBLIC_SITE_URL=https://<owner>.github.io/tatianasf-com
NEXT_PUBLIC_BASE_PATH=/tatianasf-com
```

For the future production custom domain, use:

```text
NEXT_PUBLIC_SITE_URL=https://tatianasf.com
NEXT_PUBLIC_BASE_PATH=
```

## Route Decisions

- `/hackathon_services/` preserves the current WordPress canonical URL and is the primary Hackathon Services route.
- `/photo_portfolio/` preserves the current WordPress portfolio URL as a migration-scope route. It is included in the sitemap but remains placeholder content until WordPress parity work is approved.
- `/openai-codex-design-guide/` preserves the current WordPress design guide URL as a migration-scope route. It is included in the sitemap but remains placeholder content until WordPress parity work is approved.
- `/hackathon-services/` is only a noindex compatibility page and is excluded from the sitemap.
- `/services/`, `/cases/`, `/media/`, and `/partnership/` are noindex future structure placeholders. They are hidden from primary navigation and excluded from the sitemap until real content is approved.
- `/hello-world/` and `/category/uncategorized/` are noindex legacy WordPress cleanup pages. They are excluded from the sitemap and should not be promoted.
- Runtime redirects are not used because this project targets static export and GitHub Pages. Final 301 behavior should be handled later with Cloudflare Redirect Rules or another static-host-compatible mechanism.

The primary navigation intentionally exposes only the currently approved navigation route. Preserved placeholder routes remain accessible and sitemap-visible without being promoted in the header until content parity is built.

## Future Cloudflare Redirects

Future production redirect decisions are documented in `docs/launch/cloudflare-redirects.md`.

Recommended rules after staging QA and final launch approval:

- `/hackathon-services/` -> `/hackathon_services/` with `301`.
- `/hello-world/` -> `/` with `301`.
- `/category/uncategorized/` -> `/` with `301`.

Do not enable redirect rules, switch DNS, or replace the current WordPress site until GitHub Pages staging QA is approved.
