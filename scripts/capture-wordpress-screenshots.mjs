import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDir = path.join(
  process.cwd(),
  "docs",
  "audit",
  "screenshots",
  "wordpress-baseline"
);

const pages = [
  {
    label: "Home",
    url: "https://tatianasf.com/",
    slug: "home"
  },
  {
    label: "Hackathon Services",
    url: "https://tatianasf.com/hackathon_services/",
    slug: "hackathon-services"
  },
  {
    label: "Photo Portfolio",
    url: "https://tatianasf.com/photo_portfolio/",
    slug: "photo-portfolio"
  },
  {
    label: "OpenAI Codex Design Guide",
    url: "https://tatianasf.com/openai-codex-design-guide/",
    slug: "openai-codex-design-guide"
  },
  {
    label: "Legacy WordPress Post",
    url: "https://tatianasf.com/hello-world/",
    slug: "hello-world"
  },
  {
    label: "Legacy Category Archive",
    url: "https://tatianasf.com/category/uncategorized/",
    slug: "category-uncategorized"
  }
];

const viewports = [
  {
    type: "desktop",
    width: 1440,
    height: 1200,
    isMobile: false
  },
  {
    type: "mobile",
    width: 390,
    height: 844,
    isMobile: true
  }
];

await mkdir(outputDir, { recursive: true });

const capturedAt = new Date().toISOString();
const browser = await chromium.launch();
const manifestRows = [];
let failures = 0;

try {
  for (const target of pages) {
    for (const viewport of viewports) {
      const filename = `${target.slug}-${viewport.type}.png`;
      const targetPath = path.join(outputDir, filename);
      const context = await browser.newContext({
        viewport: {
          width: viewport.width,
          height: viewport.height
        },
        deviceScaleFactor: 1,
        isMobile: viewport.isMobile
      });
      const page = await context.newPage();

      try {
        const response = await page.goto(target.url, {
          waitUntil: "domcontentloaded",
          timeout: 45000
        });
        await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
        await page.waitForTimeout(1500);

        const status = response?.status() ?? "unknown";
        const finalUrl = page.url();
        const notes = [];

        if (finalUrl !== target.url) {
          notes.push(`Final URL: ${finalUrl}`);
        }

        if (typeof status === "number" && status >= 400) {
          notes.push(`HTTP status ${status}`);
        }

        await page.screenshot({
          path: targetPath,
          fullPage: true
        });

        manifestRows.push({
          url: target.url,
          filename,
          viewport: viewport.type,
          size: `${viewport.width}x${viewport.height}`,
          status: "captured",
          notes: notes.length > 0 ? notes.join("; ") : "Full-page screenshot captured."
        });
      } catch (error) {
        failures += 1;
        manifestRows.push({
          url: target.url,
          filename,
          viewport: viewport.type,
          size: `${viewport.width}x${viewport.height}`,
          status: "failed",
          notes: error instanceof Error ? error.message : String(error)
        });
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}

await writeFile(path.join(outputDir, "manifest.md"), buildManifest(capturedAt, manifestRows));

if (failures > 0) {
  throw new Error(`Failed to capture ${failures} WordPress baseline screenshot(s).`);
}

console.log(`Captured ${manifestRows.length} WordPress baseline screenshots.`);
console.log(`Manifest written to ${path.join(outputDir, "manifest.md")}`);

function buildManifest(capturedAt, rows) {
  const lines = [
    "# WordPress Baseline Screenshot Manifest",
    "",
    `Screenshot date: ${capturedAt}`,
    "",
    "Source: public live WordPress pages at `https://tatianasf.com/`.",
    "",
    "These screenshots are a visual baseline only. They do not mean content migration is complete. Use them later for page-by-page visual parity comparison against the static Next.js migration.",
    "",
    "| Source URL | Target filename | Viewport type | Viewport size | Capture status | Notes |",
    "| --- | --- | --- | --- | --- | --- |"
  ];

  for (const row of rows) {
    lines.push(
      `| \`${row.url}\` | \`${row.filename}\` | ${row.viewport} | ${row.size} | ${row.status} | ${escapeTableCell(row.notes)} |`
    );
  }

  lines.push(
    "",
    "WordPress remains the source of truth until production launch approval. Screenshots were captured without authenticated sessions, cookies, or private WordPress views."
  );

  return `${lines.join("\n")}\n`;
}

function escapeTableCell(value) {
  return value.replaceAll("|", "\\|").replaceAll("\n", " ");
}
