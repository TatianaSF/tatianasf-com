# Metadata Audit

Audit date: 2026-07-02

Source: live public HTML from `https://tatianasf.com/`.

| URL | HTTP status | Title tag | Meta description | Canonical | Robots rules | Open Graph title | Open Graph description | Open Graph image | Twitter card |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 200 | `⭐TatianaSF - ⭐TatianaSF` | `Name: Tatiana Isa` | `https://tatianasf.com/` | `index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large` | `⭐TatianaSF - ⭐TatianaSF` | Same as meta description. | `https://tatianasf.com/wp-content/uploads/2026/03/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png` | `summary_large_image` |
| `/hackathon_services/` | 200 | `AMA Services - ⭐TatianaSF` | `I can help you design it, facilitate it, or run it with your team.` | `https://tatianasf.com/hackathon_services/` | `index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large` | `AMA Services - ⭐TatianaSF` | Same as meta description. | `https://tatianasf.com/wp-content/uploads/2026/03/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png` | `summary_large_image` |
| `/photo_portfolio/` | 200 | `Portfolio - ⭐TatianaSF` | `My name is Tatiana Isa, also known as TatianaSF.` | `https://tatianasf.com/photo_portfolio/` | `index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large` | `Portfolio - ⭐TatianaSF` | Same as meta description. | `https://tatianasf.com/wp-content/uploads/2026/03/Swissnex-Mentor-Meetup-_-February-3-2026-_-Flickr.png` | `summary_large_image` |
| `/openai-codex-design-guide/` | 200 | `OpenAI Codex Design Guide - ⭐TatianaSF` | `The folder contains reference resources that describe design principles and recommended practices for building products and interfaces using OpenAI Codex.` | `https://tatianasf.com/openai-codex-design-guide/` | `index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large` | `OpenAI Codex Design Guide - ⭐TatianaSF` | Same as meta description. | `https://tatianasf.com/wp-content/uploads/2026/03/OpenAI-Codex-Design-Guide-small.jpg` | `summary_large_image` |
| `/hello-world/` | 200 | `Hello world! - ⭐TatianaSF` | `Welcome to WordPress. This is your first post. Edit or delete it, then start writing!` | `https://tatianasf.com/hello-world/` | `index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large` | `Hello world! - ⭐TatianaSF` | Same as meta description. | `https://tatianasf.com/wp-content/uploads/2026/03/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png` | `summary_large_image` |
| `/category/uncategorized/` | 200 | `Uncategorized - ⭐TatianaSF` | None found. | `https://tatianasf.com/category/uncategorized/` | `index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large` | `Uncategorized - ⭐TatianaSF` | None found. | `https://tatianasf.com/wp-content/uploads/2026/03/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png` | `summary_large_image` |
| `/services` | 404 | `Page Not Found - ⭐TatianaSF` | None found. | None found | `follow, noindex` | `Page Not Found - ⭐TatianaSF` | None found. | `https://tatianasf.com/wp-content/uploads/2026/03/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png` | `summary_large_image` |
| `/cases` | 404 | `Page Not Found - ⭐TatianaSF` | None found. | None found | `follow, noindex` | `Page Not Found - ⭐TatianaSF` | None found. | `https://tatianasf.com/wp-content/uploads/2026/03/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png` | `summary_large_image` |
| `/media` | 404 | `Page Not Found - ⭐TatianaSF` | None found. | None found | `follow, noindex` | `Page Not Found - ⭐TatianaSF` | None found. | `https://tatianasf.com/wp-content/uploads/2026/03/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png` | `summary_large_image` |
| `/partnership` | 404 | `Page Not Found - ⭐TatianaSF` | None found. | None found | `follow, noindex` | `Page Not Found - ⭐TatianaSF` | None found. | `https://tatianasf.com/wp-content/uploads/2026/03/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png` | `summary_large_image` |

## Next.js Route Metadata Decisions

| Route | Decision | Canonical metadata | Robots metadata | Sitemap |
| --- | --- | --- | --- | --- |
| `/hackathon_services/` | Primary preserved Hackathon Services route | `/hackathon_services/` | Normal page-level metadata; staging remains noindexed by environment | Included |
| `/photo_portfolio/` | Preserved migration-scope route | `/photo_portfolio/` | Placeholder metadata; staging remains noindexed by environment | Included |
| `/openai-codex-design-guide/` | Preserved migration-scope route | `/openai-codex-design-guide/` | Placeholder metadata; staging remains noindexed by environment | Included |
| `/hackathon-services/` | Compatibility alias only | `/hackathon_services/` | `noindex, nofollow` | Excluded |
| `/services/` | Future structure placeholder only | `/services/` | `noindex, nofollow` | Excluded |
| `/cases/` | Future structure placeholder only | `/cases/` | `noindex, nofollow` | Excluded |
| `/media/` | Future structure placeholder only | `/media/` | `noindex, nofollow` | Excluded |
| `/partnership/` | Future structure placeholder only | `/partnership/` | `noindex, nofollow` | Excluded |
| `/hello-world/` | Legacy WordPress cleanup page only | `/hello-world/` | `noindex, nofollow` | Excluded |
| `/category/uncategorized/` | Legacy WordPress cleanup page only | `/category/uncategorized/` | `noindex, nofollow` | Excluded |

## Favicon References

- `https://tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-32x32.jpg`
- `https://tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-192x192.jpg`
- `https://tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-180x180.jpg`

## Structured Data

Rank Math emits one JSON-LD block on audited HTML pages.

Observed object types:

- `Person`
- `Organization`
- `WebSite`
- `ImageObject`
- `WebPage`
- `Article`
- `BlogPosting` on the default post

## SEO Notes

- No `google-site-verification` meta tag was found in the audited homepage source.
- Current WordPress sitemap includes default WordPress post and category archive URLs; the Next.js sitemap excludes them and keeps noindex cleanup pages only.
- `/photo_portfolio/` and `/openai-codex-design-guide/` are preserved in Next.js sitemap scope because they are current public WordPress page-sitemap URLs. Their placeholder metadata supports future canonical parity URLs but does not copy full WordPress metadata yet.
- 404 navigation routes are correctly noindexed on WordPress, but they are linked from the header.
- Future structure routes are noindexed and hidden from the Next.js primary navigation until real content is approved.
- The future Next.js metadata should preserve final approved titles, descriptions, canonicals, Open Graph fields, robots rules, and JSON-LD where useful.
