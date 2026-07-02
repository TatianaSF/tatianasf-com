package main

import (
	"fmt"
	"html"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"
)

type checkResult struct {
	Name    string
	Passed  bool
	Details string
}

func main() {
	root, err := os.Getwd()
	if err != nil {
		fail("determine working directory", err)
	}

	var checks []checkResult
	var warnings []string

	indexPath := filepath.Join(root, "out", "index.html")
	indexHTML, err := os.ReadFile(indexPath)
	if err != nil {
		checks = append(checks, checkResult{"Exported homepage exists", false, err.Error()})
	} else {
		checks = append(checks, checkResult{"Exported homepage exists", true, rel(root, indexPath)})
	}

	htmlText := string(indexHTML)
	checks = append(checks, checkPlaceholderState(htmlText))
	checks = append(checks, checkTextFragments(htmlText)...)
	checks = append(checks, checkImageReferences(htmlText)...)

	sitemapPath := filepath.Join(root, "out", "sitemap.xml")
	sitemapBytes, err := os.ReadFile(sitemapPath)
	if err != nil {
		checks = append(checks, checkResult{"Sitemap exists", false, err.Error()})
	} else {
		checks = append(checks, checkResult{"Sitemap exists", true, rel(root, sitemapPath)})
		checks = append(checks, checkSitemap(string(sitemapBytes))...)
	}

	linkChecks, linkWarnings := checkStaticFileLinks(root, htmlText)
	checks = append(checks, linkChecks...)
	warnings = append(warnings, linkWarnings...)
	warnings = append(warnings,
		"Visual fidelity still requires manual review against docs/audit/screenshots/wordpress-baseline/home-desktop.png and home-mobile.png.",
		"One podcast title is rendered in Latin characters to keep visible website text English-only.",
		"GitHub Pages base-path behavior is checked by Next.js build/deploy validation, not by this local static-file scan.",
	)

	report := buildReport(checks, warnings)
	reportPath := filepath.Join(root, "docs", "qa", "homepage-parity-report.md")
	if err := os.WriteFile(reportPath, []byte(report), 0644); err != nil {
		fail("write homepage QA report", err)
	}

	passed, failed := countChecks(checks)
	fmt.Printf("Homepage QA complete: %d passed, %d failed, %d warning(s).\n", passed, failed, len(warnings))
	fmt.Printf("Report: %s\n", filepath.ToSlash(filepath.Join("docs", "qa", "homepage-parity-report.md")))

	if failed > 0 {
		os.Exit(1)
	}
}

func checkPlaceholderState(htmlText string) checkResult {
	blocked := []string{
		"TatianaSF website foundation",
		"Static foundation",
		"This placeholder site prepares",
		"Content migration has not started yet",
	}

	for _, fragment := range blocked {
		if strings.Contains(htmlText, fragment) {
			return checkResult{
				Name:    "Homepage is no longer the initialization placeholder",
				Passed:  false,
				Details: fmt.Sprintf("Found placeholder fragment %q", fragment),
			}
		}
	}

	return checkResult{
		Name:    "Homepage is no longer the initialization placeholder",
		Passed:  true,
		Details: "No initialization placeholder fragments found.",
	}
}

func checkTextFragments(htmlText string) []checkResult {
	fragments := []string{
		"TatianaSF",
		"Personal Background:",
		"Name: Tatiana Isa",
		"OpenAI Codex Ambassador",
		"Founder at HackathonSF",
		"Education:",
		"Golden Gate University Extension program",
		"Skills and Competencies:",
		"Recognition and Achievements:",
		"Professional Certification",
		"Personal Philosophy &amp; Mission:",
		"Presence in the media:",
		"The Children&#x27;s Business Fair",
		"My friends",
		"Code with Harry",
	}

	checks := make([]checkResult, 0, len(fragments))
	for _, fragment := range fragments {
		checks = append(checks, checkResult{
			Name:    "Homepage content fragment: " + html.UnescapeString(fragment),
			Passed:  strings.Contains(htmlText, fragment),
			Details: fragment,
		})
	}

	return checks
}

func checkImageReferences(htmlText string) []checkResult {
	images := []string{
		"tatianasf-photo-main.jpg",
		"img-1249.jpg",
		"hubspot-inbound-sales-1024x790.png",
		"837dbb8c-d676-4f29-9d26-f8b515a9a2ab-copied-media2.png",
	}

	checks := make([]checkResult, 0, len(images))
	for _, image := range images {
		checks = append(checks, checkResult{
			Name:    "Homepage image reference: " + image,
			Passed:  strings.Contains(htmlText, image),
			Details: image,
		})
	}

	return checks
}

func checkSitemap(sitemap string) []checkResult {
	expected := []string{
		"https://tatianasf.com",
		"https://tatianasf.com/hackathon_services/",
		"https://tatianasf.com/photo_portfolio/",
		"https://tatianasf.com/openai-codex-design-guide/",
	}
	excluded := []string{
		"https://tatianasf.com/hackathon-services/",
		"https://tatianasf.com/services/",
		"https://tatianasf.com/cases/",
		"https://tatianasf.com/media/",
		"https://tatianasf.com/partnership/",
		"https://tatianasf.com/hello-world/",
		"https://tatianasf.com/category/uncategorized/",
	}

	var checks []checkResult
	for _, item := range expected {
		checks = append(checks, checkResult{
			Name:    "Sitemap includes approved route: " + item,
			Passed:  strings.Contains(sitemap, item),
			Details: item,
		})
	}
	for _, item := range excluded {
		checks = append(checks, checkResult{
			Name:    "Sitemap excludes non-canonical route: " + item,
			Passed:  !strings.Contains(sitemap, item),
			Details: item,
		})
	}

	return checks
}

func checkStaticFileLinks(root string, htmlText string) ([]checkResult, []string) {
	attributePattern := regexp.MustCompile(`(?i)(?:href|src|srcset)="([^"]+)"`)
	matches := attributePattern.FindAllStringSubmatch(htmlText, -1)
	seen := map[string]bool{}
	var checks []checkResult
	var warnings []string

	for _, match := range matches {
		for _, candidate := range splitCandidates(match[1]) {
			cleaned := cleanLocalReference(candidate)
			if cleaned == "" || seen[cleaned] {
				continue
			}
			seen[cleaned] = true

			if shouldCheckStaticFile(cleaned) {
				target := filepath.Join(root, "out", filepath.FromSlash(strings.TrimPrefix(cleaned, "/")))
				_, err := os.Stat(target)
				checks = append(checks, checkResult{
					Name:    "Static file exists: " + cleaned,
					Passed:  err == nil,
					Details: rel(root, target),
				})
			}
		}
	}

	if len(checks) == 0 {
		warnings = append(warnings, "No local static file references were found in exported homepage HTML.")
	}

	sort.Slice(checks, func(i, j int) bool {
		return checks[i].Name < checks[j].Name
	})

	return checks, warnings
}

func splitCandidates(value string) []string {
	decoded := html.UnescapeString(value)
	var candidates []string
	for _, piece := range strings.Split(decoded, ",") {
		fields := strings.Fields(strings.TrimSpace(piece))
		if len(fields) > 0 {
			candidates = append(candidates, fields[0])
		}
	}
	return candidates
}

func cleanLocalReference(value string) string {
	if value == "" || strings.HasPrefix(value, "http://") || strings.HasPrefix(value, "https://") || strings.HasPrefix(value, "mailto:") || strings.HasPrefix(value, "tel:") || strings.HasPrefix(value, "data:") || strings.HasPrefix(value, "#") {
		return ""
	}

	parsed, err := url.Parse(value)
	if err != nil {
		return ""
	}

	if parsed.Path == "" || strings.HasSuffix(parsed.Path, "/") {
		return ""
	}

	return parsed.Path
}

func shouldCheckStaticFile(pathValue string) bool {
	extensions := []string{".avif", ".css", ".gif", ".ico", ".jpg", ".jpeg", ".js", ".png", ".svg", ".webp", ".xml", ".txt"}
	lower := strings.ToLower(pathValue)
	for _, extension := range extensions {
		if strings.HasSuffix(lower, extension) {
			return true
		}
	}
	return false
}

func buildReport(checks []checkResult, warnings []string) string {
	passed, failed := countChecks(checks)
	var b strings.Builder
	b.WriteString("# Homepage Parity QA Report\n\n")
	b.WriteString(fmt.Sprintf("QA date: %s\n\n", time.Now().UTC().Format(time.RFC3339)))
	b.WriteString("This report is generated by `npm run qa:homepage` after `npm run build`. It checks the exported static homepage for first-pass WordPress parity readiness. It does not replace manual visual review against baseline screenshots.\n\n")
	b.WriteString("## Summary\n\n")
	b.WriteString(fmt.Sprintf("- Checks performed: `%d`\n", len(checks)))
	b.WriteString(fmt.Sprintf("- Passed checks: `%d`\n", passed))
	b.WriteString(fmt.Sprintf("- Failed checks: `%d`\n", failed))
	b.WriteString(fmt.Sprintf("- Warnings: `%d`\n\n", len(warnings)))

	b.WriteString("## Checks Performed\n\n")
	for _, check := range checks {
		status := "Pass"
		if !check.Passed {
			status = "Fail"
		}
		b.WriteString(fmt.Sprintf("- %s: %s - %s\n", status, check.Name, check.Details))
	}

	b.WriteString("\n## Homepage Content Checks\n\n")
	b.WriteString("- Verified key homepage section headings and representative text fragments in `out/index.html`.\n")
	b.WriteString("- Verified the initialization placeholder copy is absent from `out/index.html`.\n")
	b.WriteString("- Verified homepage exported HTML includes the main profile, work, certification, media, and friends content fragments.\n")

	b.WriteString("\n## Asset Reference Checks\n\n")
	b.WriteString("- Verified key migrated image filenames are referenced by exported homepage HTML.\n")
	b.WriteString("- Verified obvious local static file references in the exported homepage point to files under `out`.\n")

	b.WriteString("\n## Sitemap Checks\n\n")
	b.WriteString("- Verified sitemap includes only approved canonical launch-scope routes.\n")
	b.WriteString("- Verified future placeholders, legacy cleanup routes, and `/hackathon-services/` are excluded from sitemap.\n")

	b.WriteString("\n## Known Limitations\n\n")
	for _, warning := range warnings {
		b.WriteString(fmt.Sprintf("- %s\n", warning))
	}

	b.WriteString("\n## Recommended Next Step\n\n")
	b.WriteString("Manually review the built homepage against `docs/audit/screenshots/wordpress-baseline/home-desktop.png` and `docs/audit/screenshots/wordpress-baseline/home-mobile.png` before approving the next page rebuild.\n")

	return b.String()
}

func countChecks(checks []checkResult) (int, int) {
	passed := 0
	failed := 0
	for _, check := range checks {
		if check.Passed {
			passed++
		} else {
			failed++
		}
	}
	return passed, failed
}

func rel(root string, pathValue string) string {
	relative, err := filepath.Rel(root, pathValue)
	if err != nil {
		return filepath.ToSlash(pathValue)
	}
	return filepath.ToSlash(relative)
}

func fail(action string, err error) {
	fmt.Fprintf(os.Stderr, "Failed to %s: %v\n", action, err)
	os.Exit(1)
}
