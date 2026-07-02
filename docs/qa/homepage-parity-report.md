# Homepage Parity QA Report

QA date: 2026-07-02

This report documents the first-pass homepage parity QA status. The Go QA helper has been added at `tools/homepage-qa/main.go`, but the local machine does not currently have `go` available in `PATH`, so `npm run qa:homepage` cannot execute until Go is installed.

## Summary

- Checks performed manually after `npm run build`: `15`
- Passed checks: `15`
- Failed checks: `0`
- Warnings: `3`
- Go helper execution: blocked locally because `go` is not installed or not available in `PATH`

## Checks Performed

- Pass: `out/index.html` exists after `npm run build`.
- Pass: homepage exported HTML no longer contains the initialization placeholder text.
- Pass: homepage exported HTML contains `TatianaSF`.
- Pass: homepage exported HTML contains `Personal Background:`.
- Pass: homepage exported HTML contains `OpenAI Codex Ambassador` and `Founder at HackathonSF`.
- Pass: homepage exported HTML contains `Golden Gate University Extension program`.
- Pass: homepage exported HTML contains `Skills and Competencies:`.
- Pass: homepage exported HTML contains `Recognition and Achievements:`.
- Pass: homepage exported HTML contains `Professional Certification`.
- Pass: homepage exported HTML contains `Presence in the media:`.
- Pass: homepage exported HTML contains `Code with Harry`.
- Pass: homepage exported HTML references `tatianasf-photo-main.jpg`.
- Pass: homepage exported HTML references `img-1249.jpg`.
- Pass: homepage exported HTML references `hubspot-inbound-sales-1024x790.png`.
- Pass: exported sitemap includes approved canonical homepage scope and excludes `/hackathon-services/`.

## Homepage Content Checks

- The homepage is no longer a placeholder.
- Phase 1 homepage sections are present: hero/profile, personal background, work, education, skills, recognition, certification, philosophy/mission, media, friends, social link, header, and footer.
- Other preserved routes remain placeholders and were not rebuilt in this step.

## Asset Reference Checks

- The main profile image uses `public/images/pages/home/tatianasf-photo-main.jpg`.
- The work/advisor image uses `public/images/pages/home/img-1249.jpg`.
- The certification image uses `public/images/pages/home/hubspot-inbound-sales-1024x790.png`.
- Additional migrated homepage assets remain available for later visual tuning, but are not all placed in the first-pass homepage to avoid inventing layout beyond the WordPress baseline screenshots.

## Sitemap Checks

- Sitemap retains only approved canonical launch-scope routes.
- `/hackathon-services/` remains excluded from sitemap.
- Future placeholder routes and legacy cleanup routes remain excluded from sitemap.

## Known Limitations

- `npm run qa:homepage` requires Go. The local environment returned `'go' is not recognized as an internal or external command, operable program or batch file.`
- Visual fidelity still requires manual review against `docs/audit/screenshots/wordpress-baseline/home-desktop.png` and `docs/audit/screenshots/wordpress-baseline/home-mobile.png`.
- One podcast title from the WordPress source was rendered in Latin characters to keep visible website text English-only.

## Recommended Next Step

Install Go or run the QA helper in an environment with Go available, then rerun `npm run qa:homepage`. After that, manually review the built homepage against the desktop and mobile WordPress baseline screenshots before approving the next page rebuild.
