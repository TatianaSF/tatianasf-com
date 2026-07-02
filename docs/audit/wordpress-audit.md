# WordPress Public Audit

Audit date: 2026-07-02

Source site: `https://tatianasf.com/`

Scope: public HTML, public WordPress REST responses, `robots.txt`, Rank Math sitemap files, page links, metadata, images, scripts, and visible structure. This is an audit-only document. It does not migrate content or assets.

Visual baseline screenshots: `docs/audit/screenshots/wordpress-baseline/manifest.md`

## Summary

- WordPress is running a block theme with `wp-theme-twentytwentyfive` body classes.
- Rank Math generates SEO metadata and sitemap files.
- Google Site Kit injects a Google tag loader and a Google sign-in script.
- The main sitemap index exposes 1 post, 4 pages, and 1 category archive.
- The header currently links to four 404 URLs: `/services`, `/cases`, `/media`, and `/partnership`.
- Route decision applied after audit: `/hackathon_services/` is the preserved primary Hackathon Services route.
- Route decision applied after Batch 2 QA: `/photo_portfolio/` is a preserved migration-scope route included in sitemap, with placeholder content only.
- Route decision applied after scope hardening: `/openai-codex-design-guide/` is a preserved migration-scope route included in sitemap, with placeholder content only.
- `/hackathon-services/` is not canonical; it is only a noindex compatibility route in the Next.js project.
- Launch-safe decision applied: `/services`, `/cases`, `/media`, and `/partnership` remain future structure routes only. They are hidden from primary navigation, noindexed, and excluded from sitemap.
- Launch-safe decision applied: `/hello-world/` and `/category/uncategorized/` are legacy WordPress cleanup routes only. They are noindexed and excluded from sitemap.
- Visual baseline screenshots have been captured for approved public WordPress pages at desktop `1440x1200` and mobile `390x844` viewports.
- Many visual parity images use `wp-content/uploads`; most audited gallery images have empty `alt` attributes.

## Page Inventory

| Source URL | Visible title | Purpose | In main nav | Direct Next.js route | Redirect handling | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| `https://tatianasf.com/` | `TatianaSF` | Personal homepage, biography, work history, recognition, media list, friends section | Yes | `/` | Preserve | P0 |
| `https://tatianasf.com/hackathon_services/` | `AMA Services` | Hackathon consulting/services landing page with FAQ, media gallery, and SlideShare links | Yes | `/hackathon_services/` | Preserve as primary route | P0 |
| `https://tatianasf.com/hackathon-services/` | `Page not found` | Hyphen variant, not canonical on WordPress | No | `/hackathon-services/` compatibility page only | Noindex in Next.js; optional Cloudflare 301 later | P2 |
| `https://tatianasf.com/photo_portfolio/` | `Portfolio` | Photo portfolio and image-heavy page with portrait/event/property sections | No | `/photo_portfolio/` preserved placeholder | Preserve for WordPress parity migration; included in sitemap; not content-migrated yet | P1 |
| `https://tatianasf.com/openai-codex-design-guide/` | `OpenAI Codex Design Guide` | Short page linking to an external Google Drive folder | No | `/openai-codex-design-guide/` preserved placeholder | Preserve for WordPress parity migration; included in sitemap; not content-migrated yet | P1 |
| `https://tatianasf.com/hello-world/` | `Hello world!` | Default WordPress post with comments/reply UI | Sitemap only | `/hello-world/` noindex cleanup page only | Recommend Cloudflare redirect to `/` later if needed | P3 |
| `https://tatianasf.com/category/uncategorized/` | `Category: Uncategorized` | Default WordPress category archive for the default post | Sitemap only | `/category/uncategorized/` noindex cleanup page only | Recommend Cloudflare redirect to `/` or intentional removal later | P3 |
| Author archive with email-derived slug | `Author` archive | WordPress author archive exposed through default post metadata | No | No | Review; likely redirect or exclude | P3 |
| `https://tatianasf.com/feed/` | RSS feed | WordPress RSS feed | No | Optional static feed only if needed | Review | P3 |
| `https://tatianasf.com/comments/feed/` | Comments feed | WordPress comments RSS feed | No | No runtime comments planned | Likely remove or redirect | P3 |
| `https://tatianasf.com/services` | `Page not found` | Header navigation item, currently 404 | Yes | `/services/` noindex future placeholder exists | Hidden from Next.js primary navigation; excluded from sitemap until real content exists | P2 |
| `https://tatianasf.com/cases` | `Page not found` | Header navigation item, currently 404 | Yes | `/cases/` noindex future placeholder exists | Hidden from Next.js primary navigation; excluded from sitemap until real content exists | P2 |
| `https://tatianasf.com/media` | `Page not found` | Header navigation item, currently 404 | Yes | `/media/` noindex future placeholder exists | Hidden from Next.js primary navigation; excluded from sitemap until real content exists | P2 |
| `https://tatianasf.com/partnership` | `Page not found` | Header navigation item, currently 404 | Yes | `/partnership/` noindex future placeholder exists | Hidden from Next.js primary navigation; excluded from sitemap until real content exists | P2 |

## Sitemap and Robots

| URL | Status | Notes |
| --- | --- | --- |
| `https://tatianasf.com/robots.txt` | 200 | Allows public crawling except `/wp-admin/`; references `https://tatianasf.com/sitemap_index.xml`. |
| `https://tatianasf.com/sitemap.xml` | 200 redirect/final to sitemap index | Returns the Rank Math sitemap index. |
| `https://tatianasf.com/sitemap_index.xml` | 200 | Lists `post-sitemap.xml`, `page-sitemap.xml`, and `category-sitemap.xml`. |
| `https://tatianasf.com/post-sitemap.xml` | 200 | Lists `/hello-world/`. |
| `https://tatianasf.com/page-sitemap.xml` | 200 | Lists `/`, `/photo_portfolio/`, `/hackathon_services/`, `/openai-codex-design-guide/`. |
| `https://tatianasf.com/category-sitemap.xml` | 200 | Lists `/category/uncategorized/`. |

## Navigation Audit

### Header Navigation

| Label | URL | Status | Notes |
| --- | --- | --- | --- |
| `TatianaSF` / `Home` | `/` | 200 | Main brand/home link. |
| `Hackathon services` | `/hackathon_services/` | 200 | Live canonical service page. |
| `Services` | `/services` | 404 | Header link exists but page is not published. |
| `Cases` | `/cases` | 404 | Header link exists but page is not published. |
| `Media` | `/media` | 404 | Header link exists but page is not published. |
| `Partnership` | `/partnership` | 404 | Header link exists but page is not published. |

### Footer Navigation

| Label | URL | Status | Notes |
| --- | --- | --- | --- |
| `TatianaSF` | `/` | 200 | Footer brand link. |
| `Hackathon services` | `/hackathon_services/` | 200 | Appears twice in footer navigation. |
| `contact me` | `https://www.linkedin.com/in/tatianasf/` | External | LinkedIn may return bot-protection status to automated checks. |

### CTA Links

| Source page | Label | Target | Notes |
| --- | --- | --- | --- |
| Home | `LinkedIn` / `contact me` | LinkedIn profile | Primary public contact path. |
| Hackathon services | `Contact me` / `Send an Inquiry` | LinkedIn profile | CTA should be preserved unless a new contact flow is approved later. |
| Hackathon services | `Hackathon` | Same page hash-only URL | Acts like a non-moving same-page link; review during rebuild. |

### External Links

| Area | External domains | Notes |
| --- | --- | --- |
| Home work section | `kitsf.com`, `trinityua.com`, `edu.trinityua.com`, `satsf.com`, `uateg.com`, `openaisf.com` | Many links include `?swcfpc=1`; review whether to preserve or clean cache query parameters. |
| Home media section | LinkedIn, YouTube, Hacker Dojo, Rubic, Majordigest | `majordigest.com` returned 404 in automated check; `rubic.us` returned 403 over HTTP. |
| Hackathon services | SlideShare | Six SlideShare deck links returned 200 in automated checks. |
| OpenAI Codex Design Guide | Google Drive | Redirects to Google sign-in flow for automated check; verify public access manually later. |
| Friends section | YouTube | Both displayed friend links resolve to `https://www.youtube.com/@CodeWithHarry`; review the second label-target match. |

## Content Structure Audit

### Home

- Header with brand and main navigation.
- Hero-like start with `TatianaSF` heading and primary profile image.
- Biography sections: personal background, work, education, skills, recognition, certification, philosophy/mission.
- Media/presence section with a long numbered list of public appearances and external links.
- Friends section with two YouTube-linked entries and images.
- Footer repeats brand, tagline, hackathon links, and LinkedIn contact.
- Desktop layout appears content-led with a narrow central content column and image blocks.
- Mobile behavior still needs screenshot verification in a later step.

### Hackathon Services

- Header and simplified navigation.
- Top page title `AMA Services`, followed by planning/event service copy.
- Large visual/image-led section for hackathon services.
- Three service options: full-service hackathons, facilitation/advisory, and embedded operator/contractor.
- Services/gallery section with many event photos.
- SlideShare information section with six external deck links.
- FAQ section with four questions.
- Final booking CTA linking to LinkedIn.
- Content is ready for a future parity rebuild, but should not be copied into app pages in this audit step.

### Photo Portfolio

- Image-heavy portfolio page.
- Sections include intro, polished portrait, stage speaking, environmental portrait, interaction/candid, audience moments, items, property, and additional audience moments.
- Contains many portrait and event images; most audited image tags have empty `alt`.
- Preserved as a Next.js migration-scope route with placeholder content only.
- Batch 2 displayed assets have been migrated and QA-passed, but the page has not been rebuilt.

### OpenAI Codex Design Guide

- Short page with page title, one main image, and a Google Drive folder link.
- Preserved as a Next.js migration-scope route with placeholder content only.
- Still needs asset migration planning or a later asset batch before page rebuild work.
- Google Drive folder access should be manually verified before treating the page as launch-ready.

### Default Post and Category Archive

- `/hello-world/` is a legacy default WordPress post with comments UI and default copy.
- `/category/uncategorized/` is a legacy default archive containing the post.
- Both are public on WordPress; the post is indexed by robots metadata and included in the current WordPress sitemap.
- The Next.js project keeps minimal noindex cleanup pages for these URLs only, excludes them from sitemap, and should use Cloudflare redirects or intentional removal later if approved.

## Visual Structure Audit

Baseline screenshots were captured with `npm run screenshots:wordpress` and saved under `docs/audit/screenshots/wordpress-baseline/`.

The screenshots are for visual comparison only. They do not mean content migration is complete, and they do not replace the live WordPress site as the source of truth before production launch.

| Area | Finding |
| --- | --- |
| Theme | WordPress Twenty Twenty-Five block theme traces (`wp-theme-twentytwentyfive`). |
| Typography | `Manrope` for main text; `Fira Code` is available as a monospace preset. |
| Colors | Main presets include white/base `#FFFFFF`, contrast `#111111`, yellow accent `#FFEE58`, pink accent `#F6CFF4`, purple accent `#503AA8`, gray `#686868`, and pale base `#FBFAF3`. |
| Widths | WordPress global content size is about `645px`; wide size is about `1340px`. |
| Spacing | WordPress spacing scale uses `10px`, `20px`, `30px`, and responsive clamp values up to about `140px`. |
| Buttons | Block button defaults are pill-shaped with `9999px` radius and generous inline padding. |
| Cards/sections | Content is mostly block-based sections and image groups rather than custom cards. |
| Header | Static header with brand and simple text links; no custom app-like behavior found in HTML audit. |
| Footer | Text footer with brand, tagline, duplicated hackathon link, and LinkedIn contact. |
| Background | Mostly clean white/pale WordPress block theme surfaces. |
| Animations | No custom animation system found; WordPress block navigation script is loaded. |
| Responsive | WordPress block theme responsive behavior should be verified by screenshots later. |

## Image and Media Audit

Suggested future location: `public/images/` or `public/assets/images/`, grouped by page.

| Source URL | Appears on | Current alt | Likely purpose | Suggested future filename | Critical |
| --- | --- | --- | --- | --- | --- |
| `https://tatianasf.com/wp-content/uploads/2026/06/TatianaSF-photo-main.jpg` | Home | Empty | Main profile/hero image | `tatianasf-photo-main.jpg` | Yes |
| `https://tatianasf.com/wp-content/uploads/2026/03/Photo-in-Nov-1-2025-HackathonSF-Google-Photos-12.jpg` | Home | Empty | Event/work image | `home-hackathonsf-nov-2025.jpg` | Yes |
| `https://tatianasf.com/wp-content/uploads/2025/06/IMG_1249.jpg` | Home | `TatianaSF` | Work/education image | `home-img-1249.jpg` | Review |
| `https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260305-2353122.jpg` | Home | Empty | Recognition/media screenshot | `home-recognition-screenshot-20260305.jpg` | Review |
| `https://tatianasf.com/wp-content/uploads/2025/06/Hubspot_Inbound-sales-1024x790.png` | Home | `TatianaSF` | Certification image | `hubspot-inbound-sales.png` | Yes |
| `https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF.jpg` | Footer/global | `TatianaSF` | Logo/avatar/footer image | `tatianasf-avatar.jpg` | Yes |
| `https://tatianasf.com/wp-content/uploads/2026/03/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png` | Hackathon services and default OG image | Empty | Hackathon hero/OG image | `hackathon-services-hero.png` | Yes |
| `https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF-1024x768.jpg` | Hackathon services | Empty | Event photo | `hackathonsf-event-01.jpg` | Yes |
| `https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result07-1024x576.jpg` | Hackathon services | Empty | Event result/gallery | `hackathonsf-result-07.jpg` | Yes |
| `https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result002-1024x766.jpg` | Hackathon services | Empty | Event result/gallery | `hackathonsf-result-002.jpg` | Yes |
| `https://tatianasf.com/wp-content/uploads/2026/03/Swissnex-Mentor-Meetup-_-February-3-2026-_-Flickr.png` | Portfolio | Empty | Portfolio hero/OG image | `portfolio-swissnex-mentor-meetup.png` | Yes |
| `https://tatianasf.com/wp-content/uploads/2026/03/OpenAI-Codex-Design-Guide-small.jpg` | OpenAI Codex Design Guide | `OpenAI Codex Design Guide` | Page hero/OG image | `openai-codex-design-guide-small.jpg` | Yes if page retained |
| `https://tatianasf.com/wp-content/themes/twentytwentyfive/assets/images/404-image.webp` | 404 pages | `Small totara tree on ridge above Long Point` | WordPress theme 404 image | `404-image.webp` or replace after parity decision | Review |

Notes:

- Full image migration should happen in a separate asset step.
- Many audited images need meaningful alt text during migration.
- Portfolio and hackathon pages each contain large image sets; exact crop/aspect ratios should be verified with screenshots later.

## SEO Metadata

See `docs/seo/metadata-audit.md` for page-level metadata.

General findings:

- Rank Math SEO is active.
- Main public pages have canonical URLs.
- Indexed pages use `index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large`.
- 404 navigation URLs use `follow, noindex`.
- The default post and category archive are indexed in current metadata and sitemap.
- JSON-LD exists on audited HTML pages, including `Person`, `Organization`, `WebSite`, `ImageObject`, `WebPage`, and `Article` or `BlogPosting` objects.

## Analytics and Scripts Audit

| Script or tool | Evidence | Migration decision |
| --- | --- | --- |
| Google tag via Site Kit | `https://www.googletagmanager.com/gtag/js?id=GT-PBS35NC4` | Documented only. Do not hardcode yet. Current code has a GTM component, but live site uses Google tag/gtag rather than a `GTM-` container. |
| Google Site Kit | `generator` meta reports `Site Kit by Google 1.182.0`; Google sign-in script loads from `accounts.google.com/gsi/client` | Recreate only needed analytics behavior, not Site Kit. |
| Rank Math | SEO comments and sitemap output | Recreate final metadata, sitemap, robots, and structured data in Next.js; do not carry WordPress plugin code. |
| Komito | `https://komito.net/komito.js?ver=7.0` | Review if this tracking is still required before launch. |
| Cloudflare email decode | Appears on post/archive pages | Likely not needed if no email is rendered in static site. |
| WordPress navigation module | `wp-includes/js/dist/script-modules/block-library/navigation/view.min.js` | Rebuild navigation natively in Next.js. |
| WordPress comment reply | Present on default post | Do not carry over unless comments are intentionally recreated, which conflicts with no runtime backend. |
| Emoji settings | WordPress emoji config present | Not needed in Next.js unless visual parity requires specific emoji rendering. |

No `google-site-verification` meta tag was found in the audited homepage source.

## WordPress Technical Footprint

- `WordPress 7.0` generator meta.
- `Site Kit by Google 1.182.0` generator meta.
- `Rank Math` SEO comments and sitemap endpoints.
- `wp-content/uploads` asset paths.
- `wp-content/themes/twentytwentyfive` theme assets.
- `wp-includes/blocks/*` CSS.
- WordPress block classes, including `wp-block-*`, `wp-site-blocks`, `is-layout-*`, and `has-*` utility classes.
- WordPress REST endpoints are publicly reachable at `/wp-json/`.
- `wp-login.php` is public and `xmlrpc.php` responds to POST-only XML-RPC behavior.
- `wp-admin` is disallowed in robots.

Future Next.js work should preserve public behavior and appearance, not WordPress runtime structure.

## Risks and Open Questions

- `/hackathon_services/` is now the primary preserved route in the Next.js project.
- `/hackathon-services/` remains a noindex compatibility page and should not be included in the sitemap.
- `/services`, `/cases`, `/media`, and `/partnership` are future structure pages only. They are hidden from primary navigation until content exists.
- `/hello-world/` and `/category/uncategorized/` are noindex cleanup pages only; final Cloudflare redirect or removal rules still need launch approval.
- Confirm whether `GT-PBS35NC4`, Komito, and Google sign-in behavior should be retained.
- Verify Google Drive folder access for the OpenAI Codex Design Guide page.
- `/photo_portfolio/` and `/openai-codex-design-guide/` are preserved in the launch-scope sitemap, but they remain placeholders until content migration is explicitly approved.
- Verify mobile layouts and exact visual parity with screenshots in a later step.
