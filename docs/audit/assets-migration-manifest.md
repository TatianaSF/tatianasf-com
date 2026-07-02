# Assets Migration Manifest

This manifest records downloaded, mapped, and intentionally skipped public WordPress assets for future visual parity work. It does not indicate that page content migration is complete.

## Asset Migration Batch 1

Migration date: 2026-07-02T01:46:39.795Z

Source inventory file: `docs/audit/data/wordpress-assets.json`

### Summary

- Total assets attempted: `44`
- Total assets downloaded: `44`
- Total assets mapped: `0`
- Total assets skipped: `0`
- Total assets failed: `0`

### Category Counts

- icon: `3`
- open-graph: `3`
- homepage: `12`
- hackathon-services: `26`

### Selection Logic

- Favicon and site icon assets from the public inventory.
- Open Graph and Twitter image assets from the public inventory.
- Displayed homepage image assets marked critical in the inventory.
- Displayed `/hackathon_services/` image assets marked critical in the inventory.
- `srcset`-only variants were not downloaded in this batch unless they were also the displayed image or an OG/icon asset.

### Asset Records

| Original WordPress URL | New local path | Page usage | Category | Criticality | Status | Source batch | Content type | Bytes | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-180x180.jpg](https://tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-180x180.jpg) | `public/icons/cropped-tatianasf-283x300-1-180x180.jpg` | 6 page(s) | icon | critical | downloaded |  | image/jpeg | 19180 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-192x192.jpg](https://tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-192x192.jpg) | `public/icons/cropped-tatianasf-283x300-1-192x192.jpg` | 6 page(s) | icon | critical | downloaded |  | image/jpeg | 19766 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-32x32.jpg](https://tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-32x32.jpg) | `public/icons/cropped-tatianasf-283x300-1-32x32.jpg` | 6 page(s) | icon | critical | downloaded |  | image/jpeg | 10880 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png](https://tatianasf.com/wp-content/uploads/2026/03/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png) | `public/og/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png` | 4 page(s) | open-graph | critical | downloaded |  | image/png | 188565 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/OpenAI-Codex-Design-Guide-small.jpg](https://tatianasf.com/wp-content/uploads/2026/03/OpenAI-Codex-Design-Guide-small.jpg) | `public/og/openai-codex-design-guide-small.jpg` | 1 page(s) | open-graph | critical | downloaded |  | image/jpeg | 1529 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Swissnex-Mentor-Meetup-_-February-3-2026-_-Flickr.png](https://tatianasf.com/wp-content/uploads/2026/03/Swissnex-Mentor-Meetup-_-February-3-2026-_-Flickr.png) | `public/og/swissnex-mentor-meetup-february-3-2026-flickr.png` | 1 page(s) | open-graph | critical | downloaded |  | image/png | 1585576 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/06/Hubspot_Inbound-sales-1024x790.png](https://tatianasf.com/wp-content/uploads/2025/06/Hubspot_Inbound-sales-1024x790.png) | `public/images/pages/home/hubspot-inbound-sales-1024x790.png` | 1 page(s) | homepage | critical | downloaded |  | image/png | 44884 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/06/IMG_1249.jpg](https://tatianasf.com/wp-content/uploads/2025/06/IMG_1249.jpg) | `public/images/pages/home/img-1249.jpg` | 1 page(s) | homepage | critical | downloaded |  | image/jpeg | 119063 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/IMG_20260311_231122_941.jpg](https://tatianasf.com/wp-content/uploads/2026/03/IMG_20260311_231122_941.jpg) | `public/images/pages/home/img-20260311-231122-941.jpg` | 1 page(s) | homepage | critical | downloaded |  | image/jpeg | 468504 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Photo-in-Nov-1-2025-HackathonSF-Google-Photos-12-1536x1154.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Photo-in-Nov-1-2025-HackathonSF-Google-Photos-12-1536x1154.jpg) | `public/images/pages/home/photo-in-nov-1-2025-hackathonsf-google-photos-12-1536x1154.jpg` | 1 page(s) | homepage | critical | downloaded |  | image/jpeg | 307559 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260303-105831-1.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260303-105831-1.jpg) | `public/images/pages/home/screenshot-20260303-105831-1.jpg` | 1 page(s) | homepage | critical | downloaded |  | image/jpeg | 86622 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260303-105849.png](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260303-105849.png) | `public/images/pages/home/screenshot-20260303-105849.png` | 1 page(s) | homepage | critical | downloaded |  | image/png | 2018844 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260305-2353122-768x357.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260305-2353122-768x357.jpg) | `public/images/pages/home/screenshot-20260305-2353122-768x357.jpg` | 1 page(s) | homepage | critical | downloaded |  | image/jpeg | 49103 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/06/tatianasf-01.jpg](https://tatianasf.com/wp-content/uploads/2025/06/tatianasf-01.jpg) | `public/images/pages/home/tatianasf-01.jpg` | 1 page(s) | homepage | critical | downloaded |  | image/jpeg | 540054 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/06/tatianasf-02.jpg](https://tatianasf.com/wp-content/uploads/2025/06/tatianasf-02.jpg) | `public/images/pages/home/tatianasf-02.jpg` | 1 page(s) | homepage | critical | downloaded |  | image/jpeg | 314617 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/06/tatianasf-04.jpg](https://tatianasf.com/wp-content/uploads/2025/06/tatianasf-04.jpg) | `public/images/pages/home/tatianasf-04.jpg` | 1 page(s) | homepage | critical | downloaded |  | image/jpeg | 224008 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/06/tatianasf-08-1.jpg](https://tatianasf.com/wp-content/uploads/2025/06/tatianasf-08-1.jpg) | `public/images/pages/home/tatianasf-08-1.jpg` | 1 page(s) | homepage | critical | downloaded |  | image/jpeg | 271860 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/06/TatianaSF-photo-main.jpg](https://tatianasf.com/wp-content/uploads/2026/06/TatianaSF-photo-main.jpg) | `public/images/pages/home/tatianasf-photo-main.jpg` | 1 page(s) | homepage | critical | downloaded |  | image/jpeg | 179016 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/%F0%9F%92%B2010%F0%9F%92%B2-Tsf-Additional-Services-Infographic_20260329_164804_0000-691x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/%F0%9F%92%B2010%F0%9F%92%B2-Tsf-Additional-Services-Infographic_20260329_164804_0000-691x1024.jpg) | `public/images/pages/hackathon-services/010-tsf-additional-services-infographic-20260329-164804-0000-691x1024.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 76763 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/20250714_144816-COLLAGE-1-1024x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/20250714_144816-COLLAGE-1-1024x1024.jpg) | `public/images/pages/hackathon-services/20250714-144816-collage-1-1024x1024.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 238165 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2-1536x864.png](https://tatianasf.com/wp-content/uploads/2026/03/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2-1536x864.png) | `public/images/pages/hackathon-services/837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2-1536x864.png` | 1 page(s) | hackathon-services | critical | downloaded |  | image/png | 212101 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/DSC_0758-1024x683.jpg](https://tatianasf.com/wp-content/uploads/2026/03/DSC_0758-1024x683.jpg) | `public/images/pages/hackathon-services/dsc-0758-1024x683.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 112919 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/IMG_0271-1152x1536.jpg](https://tatianasf.com/wp-content/uploads/2026/03/IMG_0271-1152x1536.jpg) | `public/images/pages/hackathon-services/img-0271-1152x1536.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 265296 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/IMG_0334-1024x768.jpg](https://tatianasf.com/wp-content/uploads/2026/03/IMG_0334-1024x768.jpg) | `public/images/pages/hackathon-services/img-0334-1024x768.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 172766 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/IMG_20260311_231122_941-1-768x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/IMG_20260311_231122_941-1-768x1024.jpg) | `public/images/pages/hackathon-services/img-20260311-231122-941-1-768x1024.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 102811 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/IMG_2510.CR3_-1024x683.jpg](https://tatianasf.com/wp-content/uploads/2026/03/IMG_2510.CR3_-1024x683.jpg) | `public/images/pages/hackathon-services/img-2510.cr3-1024x683.jpg` | 2 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 134306 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/PXL_20251011_214038899-1024x576.jpg](https://tatianasf.com/wp-content/uploads/2026/03/PXL_20251011_214038899-1024x576.jpg) | `public/images/pages/hackathon-services/pxl-20251011-214038899-1024x576.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 143493 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/PXL_20251101_192718499-1024x576.jpg](https://tatianasf.com/wp-content/uploads/2026/03/PXL_20251101_192718499-1024x576.jpg) | `public/images/pages/hackathon-services/pxl-20251101-192718499-1024x576.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 116928 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/PXL_20251101_202939209-1024x576.jpg](https://tatianasf.com/wp-content/uploads/2026/03/PXL_20251101_202939209-1024x576.jpg) | `public/images/pages/hackathon-services/pxl-20251101-202939209-1024x576.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 133553 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/PXL_20251101_202959847-1024x576.jpg](https://tatianasf.com/wp-content/uploads/2026/03/PXL_20251101_202959847-1024x576.jpg) | `public/images/pages/hackathon-services/pxl-20251101-202959847-1024x576.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 136224 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/PXL_20251101_203111876-576x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/PXL_20251101_203111876-576x1024.jpg) | `public/images/pages/hackathon-services/pxl-20251101-203111876-576x1024.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 86344 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20251112-122315.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20251112-122315.jpg) | `public/images/pages/hackathon-services/screenshot-20251112-122315.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 103426 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20251112-122332-768x968.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20251112-122332-768x968.jpg) | `public/images/pages/hackathon-services/screenshot-20251112-122332-768x968.jpg` | 2 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 160577 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20251112-122332-812x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20251112-122332-812x1024.jpg) | `public/images/pages/hackathon-services/screenshot-20251112-122332-812x1024.jpg` | 2 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 174619 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20251112-122358.png](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20251112-122358.png) | `public/images/pages/hackathon-services/screenshot-20251112-122358.png` | 1 page(s) | hackathon-services | critical | downloaded |  | image/png | 1307028 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-170641-1024x764.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-170641-1024x764.jpg) | `public/images/pages/hackathon-services/screenshot-20260323-170641-1024x764.jpg` | 2 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 94283 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-170641-300x224.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-170641-300x224.jpg) | `public/images/pages/hackathon-services/screenshot-20260323-170641-300x224.jpg` | 2 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 22120 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-171027-756x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-171027-756x1024.jpg) | `public/images/pages/hackathon-services/screenshot-20260323-171027-756x1024.jpg` | 2 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 123743 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF-1024x768.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF-1024x768.jpg) | `public/images/pages/hackathon-services/tatianasf-hackathonsf-1024x768.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 174139 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result002-1024x766.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result002-1024x766.jpg) | `public/images/pages/hackathon-services/tatianasf-hackathonsf-result002-1024x766.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 187445 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result03-1024x662.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result03-1024x662.jpg) | `public/images/pages/hackathon-services/tatianasf-hackathonsf-result03-1024x662.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 157502 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result05y-1024x576.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result05y-1024x576.jpg) | `public/images/pages/hackathon-services/tatianasf-hackathonsf-result05y-1024x576.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 108334 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result06-1024x576.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result06-1024x576.jpg) | `public/images/pages/hackathon-services/tatianasf-hackathonsf-result06-1024x576.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 125147 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result07-1024x576.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result07-1024x576.jpg) | `public/images/pages/hackathon-services/tatianasf-hackathonsf-result07-1024x576.jpg` | 1 page(s) | hackathon-services | critical | downloaded |  | image/jpeg | 117447 | Downloaded from public WordPress asset URL. |

## Asset Migration Batch 2

Migration date: 2026-07-02T03:47:43.642Z

Source inventory file: `docs/audit/data/wordpress-assets.json`
Source page: `https://tatianasf.com/photo_portfolio/`
Target folder: `public/images/pages/photo-portfolio`

### Summary

- Total assets attempted: `28`
- Total assets downloaded: `22`
- Total assets mapped: `6`
- Total assets skipped: `0`
- Total assets failed: `0`
- Duplicate mappings from Batch 1: `6`

### Category Counts

- photo-portfolio: `28`

### Selection Logic

- Displayed same-site WordPress upload images used by `https://tatianasf.com/photo_portfolio/`, including assets marked `review` when they are displayed in the page body.
- `srcset`-only variants were not downloaded unless the variant was the displayed image in the inventory.
- Assets already downloaded in Batch 1 were mapped to their existing local paths instead of downloaded again.
- External WordPress emoji assets were excluded because they are optional and not required for portfolio visual asset migration.

### Asset Records

| Original WordPress URL | New local path | Page usage | Category | Criticality | Status | Source batch | Content type | Bytes | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [tatianasf.com/wp-content/uploads/2026/03/file_000000001e5071fd9e0f4e4ad09b9cbf-683x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/file_000000001e5071fd9e0f4e4ad09b9cbf-683x1024.jpg) | `public/images/pages/photo-portfolio/file-000000001e5071fd9e0f4e4ad09b9cbf-683x1024.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 99295 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/file_0000000066c071fdb585484c0a5d3130-1-683x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/file_0000000066c071fdb585484c0a5d3130-1-683x1024.jpg) | `public/images/pages/photo-portfolio/file-0000000066c071fdb585484c0a5d3130-1-683x1024.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 46350 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/file_00000000a84871f8bfbb24671e751631-683x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/file_00000000a84871f8bfbb24671e751631-683x1024.jpg) | `public/images/pages/photo-portfolio/file-00000000a84871f8bfbb24671e751631-683x1024.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 80394 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/file_00000000c73071f8b8cb6bae88183328-683x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/file_00000000c73071f8b8cb6bae88183328-683x1024.jpg) | `public/images/pages/photo-portfolio/file-00000000c73071f8b8cb6bae88183328-683x1024.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 53042 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/frty-300x201.png](https://tatianasf.com/wp-content/uploads/2026/03/frty-300x201.png) | `public/images/pages/photo-portfolio/frty-300x201.png` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/png | 97396 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/IMG_0193-300x225.jpg](https://tatianasf.com/wp-content/uploads/2026/03/IMG_0193-300x225.jpg) | `public/images/pages/photo-portfolio/img-0193-300x225.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 31980 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/IMG_2510.CR3_-1024x683.jpg](https://tatianasf.com/wp-content/uploads/2026/03/IMG_2510.CR3_-1024x683.jpg) | `public/images/pages/hackathon-services/img-2510.cr3-1024x683.jpg` | 2 page(s) | photo-portfolio | critical | mapped-existing |  | image/jpeg | 134306 | Mapped to existing Batch 1 file to avoid a duplicate download. |
| [tatianasf.com/wp-content/uploads/2026/03/IMG_2510.CR3_-scaled.jpg](https://tatianasf.com/wp-content/uploads/2026/03/IMG_2510.CR3_-scaled.jpg) | `public/images/pages/photo-portfolio/img-2510.cr3-scaled.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 570492 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Photography-TatianaSF-01-683x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Photography-TatianaSF-01-683x1024.jpg) | `public/images/pages/photo-portfolio/photography-tatianasf-01-683x1024.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 86278 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Photography-TatianaSF-02-683x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Photography-TatianaSF-02-683x1024.jpg) | `public/images/pages/photo-portfolio/photography-tatianasf-02-683x1024.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 49761 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/PN-2.png](https://tatianasf.com/wp-content/uploads/2026/03/PN-2.png) | `public/images/pages/photo-portfolio/pn-2.png` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/png | 964014 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/04/prop-1.jpg](https://tatianasf.com/wp-content/uploads/2026/04/prop-1.jpg) | `public/images/pages/photo-portfolio/prop-1.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 259170 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/04/prop-2-576x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/04/prop-2-576x1024.jpg) | `public/images/pages/photo-portfolio/prop-2-576x1024.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 133751 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/04/prop-3-638x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/04/prop-3-638x1024.jpg) | `public/images/pages/photo-portfolio/prop-3-638x1024.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 147650 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/PXL_20240406_231008876-scaled.jpg](https://tatianasf.com/wp-content/uploads/2026/03/PXL_20240406_231008876-scaled.jpg) | `public/images/pages/photo-portfolio/pxl-20240406-231008876-scaled.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 851848 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/PXL_20260111_194742330-576x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/PXL_20260111_194742330-576x1024.jpg) | `public/images/pages/photo-portfolio/pxl-20260111-194742330-576x1024.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 112568 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20251112-122332-768x968.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20251112-122332-768x968.jpg) | `public/images/pages/hackathon-services/screenshot-20251112-122332-768x968.jpg` | 2 page(s) | photo-portfolio | critical | mapped-existing |  | image/jpeg | 160577 | Mapped to existing Batch 1 file to avoid a duplicate download. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20251112-122332-812x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20251112-122332-812x1024.jpg) | `public/images/pages/hackathon-services/screenshot-20251112-122332-812x1024.jpg` | 2 page(s) | photo-portfolio | critical | mapped-existing |  | image/jpeg | 174619 | Mapped to existing Batch 1 file to avoid a duplicate download. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-161418-690x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-161418-690x1024.jpg) | `public/images/pages/photo-portfolio/screenshot-20260323-161418-690x1024.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 80882 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-170641-1024x764.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-170641-1024x764.jpg) | `public/images/pages/hackathon-services/screenshot-20260323-170641-1024x764.jpg` | 2 page(s) | photo-portfolio | critical | mapped-existing |  | image/jpeg | 94283 | Mapped to existing Batch 1 file to avoid a duplicate download. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-170641-300x224.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-170641-300x224.jpg) | `public/images/pages/hackathon-services/screenshot-20260323-170641-300x224.jpg` | 2 page(s) | photo-portfolio | critical | mapped-existing |  | image/jpeg | 22120 | Mapped to existing Batch 1 file to avoid a duplicate download. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-170756.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-170756.jpg) | `public/images/pages/photo-portfolio/screenshot-20260323-170756.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 229544 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-170955-740x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-170955-740x1024.jpg) | `public/images/pages/photo-portfolio/screenshot-20260323-170955-740x1024.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 127192 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-171027-756x1024.jpg](https://tatianasf.com/wp-content/uploads/2026/03/Screenshot_20260323-171027-756x1024.jpg) | `public/images/pages/hackathon-services/screenshot-20260323-171027-756x1024.jpg` | 2 page(s) | photo-portfolio | critical | mapped-existing |  | image/jpeg | 123743 | Mapped to existing Batch 1 file to avoid a duplicate download. |
| [tatianasf.com/wp-content/uploads/2026/03/Swissnex-Mentor-Meetup-_-February-3-2026-_-Flickr-1536x977.png](https://tatianasf.com/wp-content/uploads/2026/03/Swissnex-Mentor-Meetup-_-February-3-2026-_-Flickr-1536x977.png) | `public/images/pages/photo-portfolio/swissnex-mentor-meetup-february-3-2026-flickr-1536x977.png` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/png | 1248456 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result002-1-300x225.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result002-1-300x225.jpg) | `public/images/pages/photo-portfolio/tatianasf-hackathonsf-result002-1-300x225.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 31508 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result01y-300x225.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF_HackathonSF_result01y-300x225.jpg) | `public/images/pages/photo-portfolio/tatianasf-hackathonsf-result01y-300x225.jpg` | 1 page(s) | photo-portfolio | critical | downloaded |  | image/jpeg | 42020 | Downloaded from public WordPress asset URL. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF.jpg) | `public/images/pages/photo-portfolio/tatianasf.jpg` | 6 page(s) | photo-portfolio | review | downloaded |  | image/jpeg | 148108 | Downloaded from public WordPress asset URL. |

## Asset Migration Batch 3

Migration date: 2026-07-02T04:45:15.642Z

Source inventory file: `docs/audit/data/wordpress-assets.json`
Source page: `https://tatianasf.com/openai-codex-design-guide/`
Target folder: `public/images/pages/openai-codex-design-guide`

### Summary

- Total assets attempted: `11`
- Total assets downloaded: `0`
- Total assets mapped: `5`
- Total assets skipped: `6`
- Total assets failed: `0`
- Duplicate mappings from Batch 1: `4`
- Duplicate mappings from Batch 2: `1`

### Category Counts

- optional-emoji: `2`
- site-icon: `3`
- srcset-variant: `4`
- openai-codex-design-guide: `2`

### Selection Logic

- All inventory records used by `https://tatianasf.com/openai-codex-design-guide/` were reviewed for traceability.
- The OpenAI Codex Design Guide image, site icons, and shared displayed image were mapped from earlier batches instead of duplicated.
- External WordPress emoji assets were recorded as skipped because they are optional and not required for page visual asset migration.
- `srcset`-only variants were recorded as skipped unless future implementation proves that a specific responsive source is needed.

### Asset Records

| Original WordPress URL | New local path | Page usage | Category | Criticality | Status | Source batch | Content type | Bytes | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [s.w.org/images/core/emoji/17.0.2/svg/1f495.svg](https://s.w.org/images/core/emoji/17.0.2/svg/1f495.svg) | `public/images/legacy/emoji/1f495.svg` | 6 page(s) | optional-emoji | optional | skipped |  | image/svg+xml | 0 | Skipped optional external WordPress emoji asset; native text rendering is sufficient unless exact emoji image parity is later required. |
| [s.w.org/images/core/emoji/17.0.2/svg/2b50.svg](https://s.w.org/images/core/emoji/17.0.2/svg/2b50.svg) | `public/images/legacy/emoji/2b50.svg` | 6 page(s) | optional-emoji | optional | skipped |  | image/svg+xml | 0 | Skipped optional external WordPress emoji asset; native text rendering is sufficient unless exact emoji image parity is later required. |
| [tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-180x180.jpg](https://tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-180x180.jpg) | `public/icons/cropped-tatianasf-283x300-1-180x180.jpg` | 6 page(s) | site-icon | critical | mapped-existing | Batch 1 | image/jpeg | 19180 | Mapped to existing Batch 1 file to avoid a duplicate download. |
| [tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-192x192.jpg](https://tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-192x192.jpg) | `public/icons/cropped-tatianasf-283x300-1-192x192.jpg` | 6 page(s) | site-icon | critical | mapped-existing | Batch 1 | image/jpeg | 19766 | Mapped to existing Batch 1 file to avoid a duplicate download. |
| [tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-32x32.jpg](https://tatianasf.com/wp-content/uploads/2025/11/cropped-TatianaSF-283x300-1-32x32.jpg) | `public/icons/cropped-tatianasf-283x300-1-32x32.jpg` | 6 page(s) | site-icon | critical | mapped-existing | Batch 1 | image/jpeg | 10880 | Mapped to existing Batch 1 file to avoid a duplicate download. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF-283x300.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF-283x300.jpg) | `public/images/pages/hackathon-services/tatianasf-283x300.jpg` | 6 page(s) | srcset-variant | review | skipped |  | image/jpeg | 0 | Skipped srcset-only variant; not needed for the Batch 3 displayed visual asset set. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF-50x53.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF-50x53.jpg) | `public/images/pages/hackathon-services/tatianasf-50x53.jpg` | 6 page(s) | srcset-variant | review | skipped |  | image/jpeg | 0 | Skipped srcset-only variant; not needed for the Batch 3 displayed visual asset set. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF-768x813.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF-768x813.jpg) | `public/images/pages/hackathon-services/tatianasf-768x813.jpg` | 6 page(s) | srcset-variant | review | skipped |  | image/jpeg | 0 | Skipped srcset-only variant; not needed for the Batch 3 displayed visual asset set. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF-967x1024.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF-967x1024.jpg) | `public/images/pages/hackathon-services/tatianasf-967x1024.jpg` | 6 page(s) | srcset-variant | review | skipped |  | image/jpeg | 0 | Skipped srcset-only variant; not needed for the Batch 3 displayed visual asset set. |
| [tatianasf.com/wp-content/uploads/2025/11/TatianaSF.jpg](https://tatianasf.com/wp-content/uploads/2025/11/TatianaSF.jpg) | `public/images/pages/photo-portfolio/tatianasf.jpg` | 6 page(s) | openai-codex-design-guide | review | mapped-existing | Batch 2 | image/jpeg | 148108 | Mapped to existing Batch 2 file to avoid a duplicate download. |
| [tatianasf.com/wp-content/uploads/2026/03/OpenAI-Codex-Design-Guide-small.jpg](https://tatianasf.com/wp-content/uploads/2026/03/OpenAI-Codex-Design-Guide-small.jpg) | `public/og/openai-codex-design-guide-small.jpg` | 1 page(s) | openai-codex-design-guide | critical | mapped-existing | Batch 1 | image/jpeg | 1529 | Mapped to existing Batch 1 file to avoid a duplicate download. |

## Verification Notes

- Each downloaded file was fetched from a public HTTPS same-site WordPress asset URL.
- WordPress admin, login, REST API, XML-RPC, feed, sitemap, and robots URLs are blocked by the migration scripts.
- Each saved file is checked for non-zero size and rejected if it appears to be an HTML error page.
- Mapped duplicate files are checked locally before being recorded.
- Optional WordPress emoji assets and unneeded `srcset`-only variants can be recorded as skipped for traceability.
- The batches are intentionally limited; page components are not updated to use these assets yet.
