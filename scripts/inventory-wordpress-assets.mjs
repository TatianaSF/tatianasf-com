import { chromium } from "playwright";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const pages = [
  { label: "Home", url: "https://tatianasf.com/", slug: "home" },
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

const dataDir = path.join(process.cwd(), "docs", "audit", "data");
const inventoryPath = path.join(process.cwd(), "docs", "audit", "image-inventory.md");
const jsonPath = path.join(dataDir, "wordpress-assets.json");
const migratedBatch1Path = path.join(dataDir, "migrated-assets-batch-1.json");
const migratedBatch2Path = path.join(dataDir, "migrated-assets-batch-2.json");
const migratedBatch3Path = path.join(dataDir, "migrated-assets-batch-3.json");
const assetQaBatch2Path = path.join(dataDir, "asset-qa-batch-2.json");

await mkdir(dataDir, { recursive: true });

const browser = await chromium.launch();
const rawReferences = [];

try {
  for (const sourcePage of pages) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1200 },
      deviceScaleFactor: 1
    });
    const page = await context.newPage();

    try {
      const response = await page.goto(sourcePage.url, {
        waitUntil: "domcontentloaded",
        timeout: 45000
      });
      await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});

      const references = await page.evaluate(() => {
        const mediaExtensionPattern =
          /\.(?:avif|gif|jpe?g|m4a|mov|mp3|mp4|pdf|png|svg|webm|webp|wav)(?:[?#].*)?$/i;

        function absoluteUrl(value) {
          try {
            return new URL(value, document.baseURI).href;
          } catch {
            return "";
          }
        }

        function parseSrcset(srcset) {
          if (!srcset) {
            return [];
          }

          return srcset
            .split(",")
            .map((candidate) => candidate.trim().split(/\s+/)[0])
            .filter(Boolean)
            .map(absoluteUrl)
            .filter(Boolean);
        }

        function urlsFromCss(value) {
          return [...value.matchAll(/url\((['"]?)(.*?)\1\)/gi)]
            .map((match) => absoluteUrl(match[2]))
            .filter((url) => url && !url.startsWith("data:"));
        }

        function nearbyHeading(element) {
          let current = element;
          for (let depth = 0; current && depth < 5; depth += 1) {
            const heading = current.querySelector?.("h1,h2,h3,h4,h5,h6");
            if (heading?.textContent?.trim()) {
              return heading.textContent.trim().replace(/\s+/g, " ");
            }
            current = current.parentElement;
          }

          const headings = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
          const before = headings
            .filter((heading) => heading.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING)
            .at(-1);
          return before?.textContent?.trim().replace(/\s+/g, " ") || "";
        }

        const items = [];

        for (const image of document.querySelectorAll("img")) {
          const src = absoluteUrl(image.currentSrc || image.getAttribute("src") || "");
          const srcsetUrls = parseSrcset(image.getAttribute("srcset"));

          if (src) {
            items.push({
              url: src,
              kind: "img",
              alt: image.getAttribute("alt") ?? "",
              width: image.getAttribute("width") || String(image.naturalWidth || ""),
              height: image.getAttribute("height") || String(image.naturalHeight || ""),
              context: nearbyHeading(image)
            });
          }

          for (const variantUrl of srcsetUrls) {
            items.push({
              url: variantUrl,
              kind: "srcset variant",
              alt: image.getAttribute("alt") ?? "",
              width: "",
              height: "",
              context: nearbyHeading(image)
            });
          }
        }

        for (const meta of document.querySelectorAll(
          'meta[property="og:image"], meta[property="og:image:secure_url"], meta[name="twitter:image"]'
        )) {
          const url = absoluteUrl(meta.getAttribute("content") || "");
          if (url) {
            items.push({
              url,
              kind: meta.getAttribute("property") || meta.getAttribute("name") || "meta image",
              alt: "",
              width: "",
              height: "",
              context: "Document metadata"
            });
          }
        }

        for (const icon of document.querySelectorAll('link[rel*="icon"], link[rel="apple-touch-icon"]')) {
          const url = absoluteUrl(icon.getAttribute("href") || "");
          if (url) {
            items.push({
              url,
              kind: `site icon: ${icon.getAttribute("rel")}`,
              alt: "",
              width: icon.getAttribute("sizes") || "",
              height: icon.getAttribute("sizes") || "",
              context: "Document icon"
            });
          }
        }

        for (const element of document.querySelectorAll("*")) {
          const urls = urlsFromCss(element.getAttribute("style") || "");
          urls.push(...urlsFromCss(window.getComputedStyle(element).backgroundImage || ""));

          for (const url of urls) {
            items.push({
              url,
              kind: "background image",
              alt: "",
              width: "",
              height: "",
              context: nearbyHeading(element)
            });
          }
        }

        for (const media of document.querySelectorAll("video source, audio source, video, audio")) {
          const url = absoluteUrl(media.getAttribute("src") || "");
          if (url) {
            items.push({
              url,
              kind: media.tagName.toLowerCase(),
              alt: "",
              width: "",
              height: "",
              context: nearbyHeading(media)
            });
          }
        }

        for (const link of document.querySelectorAll("a[href]")) {
          const url = absoluteUrl(link.getAttribute("href") || "");
          if (url && mediaExtensionPattern.test(url)) {
            items.push({
              url,
              kind: "linked media",
              alt: link.textContent?.trim().replace(/\s+/g, " ") || "",
              width: "",
              height: "",
              context: nearbyHeading(link)
            });
          }
        }

        return items;
      });

      rawReferences.push(
        ...references.map((reference) => ({
          ...reference,
          sourcePage: sourcePage.url,
          sourcePageLabel: sourcePage.label,
          sourcePageSlug: sourcePage.slug,
          pageStatus: response?.status() ?? "unknown",
          finalPageUrl: page.url()
        }))
      );
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}

const assets = await buildAssetInventory(rawReferences);
const generatedAt = new Date().toISOString();
const summary = buildSummary(rawReferences, assets);
const migratedBatch1 = await readMigratedBatch1();
const migratedBatch2 = await readMigratedBatch2();
const migratedBatch3 = await readMigratedBatch3();
const assetQaBatch2 = await readAssetQaBatch2();

await writeFile(
  jsonPath,
  `${JSON.stringify({ generatedAt, pages, summary, assets }, null, 2)}\n`
);
await writeFile(inventoryPath, buildMarkdown(generatedAt, summary, assets, migratedBatch1, migratedBatch2, migratedBatch3, assetQaBatch2));

console.log(`Asset references found: ${summary.totalReferences}`);
console.log(`Unique assets found: ${summary.uniqueAssets}`);
console.log(`Missing alt image references: ${summary.missingAltReferences}`);
console.log(`JSON written to ${jsonPath}`);
console.log(`Markdown written to ${inventoryPath}`);

async function buildAssetInventory(references) {
  const byUrl = new Map();

  for (const reference of references) {
    const url = normalizeAssetUrl(reference.url);
    if (!url || url.startsWith("data:")) {
      continue;
    }

    if (!byUrl.has(url)) {
      byUrl.set(url, {
        url,
        fileType: getFileType(url),
        sourceType: getSourceType(url),
        contentType: "",
        contentLength: "",
        approximateSize: "Unknown",
        width: "",
        height: "",
        hasAltText: false,
        altTexts: [],
        kinds: [],
        usagePages: [],
        contexts: [],
        referenceCount: 0,
        criticality: "review",
        suggestedLocalPath: "",
        suggestedFilename: "",
        notes: []
      });
    }

    const asset = byUrl.get(url);
    asset.referenceCount += 1;
    addUnique(asset.kinds, reference.kind);
    addUnique(asset.usagePages, reference.sourcePage);
    addUnique(asset.contexts, reference.context || reference.sourcePageLabel);

    if (!asset.width && reference.width) {
      asset.width = reference.width;
    }
    if (!asset.height && reference.height) {
      asset.height = reference.height;
    }

    const alt = reference.alt?.trim();
    if (alt) {
      asset.hasAltText = true;
      addUnique(asset.altTexts, alt);
    }
  }

  const assets = [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url));

  await Promise.all(
    assets.map(async (asset) => {
      const metadata = await fetchAssetMetadata(asset.url);
      asset.contentType = metadata.contentType;
      asset.contentLength = metadata.contentLength;
      asset.approximateSize = formatBytes(metadata.contentLength);
      asset.criticality = classifyCriticality(asset);
      asset.suggestedFilename = suggestFilename(asset);
      asset.suggestedLocalPath = suggestLocalPath(asset);
      asset.notes = buildAssetNotes(asset);
    })
  );

  return assets;
}

function buildSummary(references, assets) {
  const missingAltReferences = references.filter(
    (reference) => reference.kind.includes("img") && !reference.alt?.trim()
  ).length;
  const wordpressUploadAssets = assets.filter((asset) =>
    asset.url.includes("/wp-content/uploads/")
  ).length;
  const externalAssets = assets.filter((asset) => asset.sourceType === "external").length;
  const iconAssets = assets.filter((asset) => asset.kinds.some((kind) => kind.includes("icon"))).length;
  const ogAssets = assets.filter((asset) =>
    asset.kinds.some((kind) => kind.includes("og:image") || kind.includes("twitter:image"))
  ).length;

  return {
    totalReferences: references.length,
    uniqueAssets: assets.length,
    wordpressUploadAssets,
    externalAssets,
    iconAssets,
    ogAssets,
    missingAltReferences,
    duplicatedAssets: assets.filter((asset) => asset.usagePages.length > 1).length
  };
}

async function fetchAssetMetadata(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(10000)
    });

    return {
      contentType: response.headers.get("content-type") ?? "",
      contentLength: Number(response.headers.get("content-length") ?? "") || ""
    };
  } catch {
    return {
      contentType: "",
      contentLength: ""
    };
  }
}

async function readMigratedBatch1() {
  try {
    return JSON.parse(await readFile(migratedBatch1Path, "utf8"));
  } catch {
    return null;
  }
}

async function readMigratedBatch2() {
  try {
    return JSON.parse(await readFile(migratedBatch2Path, "utf8"));
  } catch {
    return null;
  }
}

async function readMigratedBatch3() {
  try {
    return JSON.parse(await readFile(migratedBatch3Path, "utf8"));
  } catch {
    return null;
  }
}

async function readAssetQaBatch2() {
  try {
    return JSON.parse(await readFile(assetQaBatch2Path, "utf8"));
  } catch {
    return null;
  }
}

function buildMarkdown(generatedAt, summary, assets, migratedBatch1, migratedBatch2, migratedBatch3, assetQaBatch2) {
  const lines = [
    "# Image and Media Inventory",
    "",
    `Inventory date: ${generatedAt}`,
    "",
    "Source: approved public WordPress pages at `https://tatianasf.com/`.",
    "",
    "This inventory is for asset migration planning only. It does not download full assets, migrate content, rebuild pages, or change production metadata.",
    "",
    "## Summary",
    "",
    `- Total image/media references found: \`${summary.totalReferences}\``,
    `- Unique assets found: \`${summary.uniqueAssets}\``,
    `- WordPress upload assets: \`${summary.wordpressUploadAssets}\``,
    `- External assets: \`${summary.externalAssets}\``,
    `- Open Graph/Twitter image assets: \`${summary.ogAssets}\``,
    `- Favicon/site icon assets: \`${summary.iconAssets}\``,
    `- Assets used on multiple pages: \`${summary.duplicatedAssets}\``,
    `- Image references missing alt text: \`${summary.missingAltReferences}\``,
    "",
    "Machine-readable output: `docs/audit/data/wordpress-assets.json`."
  ];

  if (migratedBatch1?.summary) {
    lines.push(
      "",
      "## Migration Status",
      "",
      "Asset Migration Batch 1 has been completed for the highest-priority subset:",
      "",
      "- Favicon and site icons",
      "- Open Graph/Twitter images",
      "- Homepage critical displayed images",
      "- `/hackathon_services/` critical displayed images",
      "",
      "Batch 1 output:",
      "",
      "- Manifest: `docs/audit/assets-migration-manifest.md`",
      "- JSON: `docs/audit/data/migrated-assets-batch-1.json`",
      `- Downloaded: \`${migratedBatch1.summary.totalDownloaded}\``,
      `- Failed: \`${migratedBatch1.summary.totalFailed}\``,
      ""
    );

    if (migratedBatch2?.summary) {
      lines.push(
        "Asset Migration Batch 2 has been completed for displayed `/photo_portfolio/` visual assets:",
        "",
        "- Displayed same-site WordPress upload images used by `/photo_portfolio/`",
        "- Duplicate displayed images already downloaded in Batch 1 mapped to existing local paths",
        "- `srcset`-only variants excluded unless they were the displayed image",
        "",
        "Batch 2 output:",
        "",
        "- Manifest: `docs/audit/assets-migration-manifest.md`",
        "- JSON: `docs/audit/data/migrated-assets-batch-2.json`",
        `- Downloaded: \`${migratedBatch2.summary.totalDownloaded}\``,
        `- Mapped from Batch 1: \`${migratedBatch2.summary.duplicateMappingsFromBatch1}\``,
        `- Failed: \`${migratedBatch2.summary.totalFailed}\``,
        ""
      );

      if (assetQaBatch2?.summary) {
        lines.push(
          "Batch 2 QA output:",
          "",
          "- QA report: `docs/audit/assets-review/batch-2/asset-qa-report.md`",
          "- QA JSON: `docs/audit/data/asset-qa-batch-2.json`",
          "- Contact sheet: `docs/audit/assets-review/batch-2/contact-sheet.html`",
          `- Passed: \`${assetQaBatch2.summary.passedAssets}\``,
          `- Failed: \`${assetQaBatch2.summary.failedAssets}\``,
          `- Warnings: \`${assetQaBatch2.summary.warningCount}\``,
          ""
        );
      }
    }

    if (migratedBatch3?.summary) {
      lines.push(
        "Asset Migration Batch 3 has been completed for `/openai-codex-design-guide/` visual asset traceability:",
        "",
        "- OpenAI Codex Design Guide image mapped from Batch 1",
        "- Shared displayed profile image mapped from Batch 2",
        "- Site icons mapped from Batch 1",
        "- Optional emoji and unneeded `srcset`-only variants recorded as skipped",
        "",
        "Batch 3 output:",
        "",
        "- Manifest: `docs/audit/assets-migration-manifest.md`",
        "- JSON: `docs/audit/data/migrated-assets-batch-3.json`",
        `- Downloaded: \`${migratedBatch3.summary.totalDownloaded}\``,
        `- Mapped from Batch 1: \`${migratedBatch3.summary.duplicateMappingsFromBatch1}\``,
        `- Mapped from Batch 2: \`${migratedBatch3.summary.duplicateMappingsFromBatch2}\``,
        `- Skipped: \`${migratedBatch3.summary.totalSkipped}\``,
        `- Failed: \`${migratedBatch3.summary.totalFailed}\``,
        ""
      );
    }

    lines.push(
      "The full inventory below remains the planning source for later batches. Assets not included in completed batches have not been downloaded yet.",
      ""
    );
  } else {
    lines.push("");
  }

  lines.push(
    "## Open Graph and Site Icons",
    "",
    ...assets
      .filter((asset) =>
        asset.kinds.some((kind) => kind.includes("og:image") || kind.includes("twitter:image") || kind.includes("icon"))
      )
      .map(assetSummaryLine),
    "",
    "## Duplicated Assets",
    "",
    ...assets.filter((asset) => asset.usagePages.length > 1).map(assetSummaryLine),
    "",
    "## Full Inventory",
    "",
    "| Asset URL | Type | Size | Usage pages | Kinds | Alt status | Criticality | Suggested local path | Notes |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |"
  );

  for (const asset of assets) {
    lines.push(
      `| ${markdownLink(asset.url)} | ${asset.fileType || "unknown"} | ${asset.approximateSize} | ${asset.usagePages.length} | ${escapeCell(asset.kinds.join(", "))} | ${asset.hasAltText ? "Has alt text" : "Missing or not applicable"} | ${asset.criticality} | \`${asset.suggestedLocalPath}\` | ${escapeCell(asset.notes.join("; "))} |`
    );
  }

  lines.push(
    "",
    "## Alt Text Notes",
    "",
    "- Many WordPress gallery and content images have empty `alt` attributes.",
    "- Missing alt text should be fixed during content migration, not by copying the current empty values.",
    "- Site icons, Open Graph images, CSS background images, and linked media may not have meaningful `alt` fields in HTML.",
    "",
    "## Inventory Method",
    "",
    "- Captured only approved public source pages.",
    "- Extracted `img` sources, `srcset` variants, discoverable CSS background images, Open Graph/Twitter images, favicon/site icon links, and directly linked media files.",
    "- Used `HEAD` requests for approximate file sizes and content types when available.",
    "- Did not use authenticated sessions, cookies, private WordPress views, or private endpoints."
  );

  return `${lines.join("\n")}\n`;
}

function assetSummaryLine(asset) {
  return `- ${markdownLink(asset.url)} -> \`${asset.suggestedLocalPath}\` (${asset.kinds.join(", ")})`;
}

function classifyCriticality(asset) {
  if (asset.url.includes("s.w.org/images/core/emoji/")) {
    return "optional";
  }
  if (asset.kinds.some((kind) => kind.includes("icon"))) {
    return "critical";
  }
  if (asset.kinds.some((kind) => kind.includes("og:image") || kind.includes("twitter:image"))) {
    return "critical";
  }
  if (asset.usagePages.some((pageUrl) => pageUrl.includes("hello-world") || pageUrl.includes("category/uncategorized"))) {
    return asset.usagePages.length > 1 ? "review" : "legacy cleanup";
  }
  if (asset.usagePages.some((pageUrl) => pageUrl.includes("photo_portfolio") || pageUrl.includes("hackathon_services") || pageUrl === "https://tatianasf.com/")) {
    return "critical";
  }
  return "review";
}

function suggestLocalPath(asset) {
  const filename = asset.suggestedFilename || suggestFilename(asset);

  if (asset.url.includes("s.w.org/images/core/emoji/")) {
    return `public/images/legacy/emoji/${filename}`;
  }
  if (asset.kinds.some((kind) => kind.includes("icon"))) {
    return `public/icons/${filename}`;
  }
  if (asset.kinds.some((kind) => kind.includes("og:image") || kind.includes("twitter:image"))) {
    return `public/og/${filename}`;
  }
  if (asset.usagePages.some((pageUrl) => pageUrl.includes("hackathon_services"))) {
    return `public/images/pages/hackathon-services/${filename}`;
  }
  if (asset.usagePages.some((pageUrl) => pageUrl.includes("photo_portfolio"))) {
    return `public/images/pages/photo-portfolio/${filename}`;
  }
  if (asset.usagePages.some((pageUrl) => pageUrl.includes("openai-codex-design-guide"))) {
    return `public/images/pages/openai-codex-design-guide/${filename}`;
  }
  if (asset.usagePages.some((pageUrl) => pageUrl.includes("hello-world") || pageUrl.includes("category/uncategorized"))) {
    return `public/images/legacy/${filename}`;
  }
  if (asset.usagePages.includes("https://tatianasf.com/")) {
    return `public/images/pages/home/${filename}`;
  }
  return `public/images/${filename}`;
}

function suggestFilename(asset) {
  const url = new URL(asset.url);
  const baseName = path.basename(decodeURIComponent(url.pathname));
  const extension = path.extname(baseName) || extensionFromContentType(asset.contentType) || ".bin";
  const name = path.basename(baseName, path.extname(baseName));
  return `${slugify(name)}${extension.toLowerCase()}`;
}

function buildAssetNotes(asset) {
  const notes = [];

  if (asset.url.includes("/wp-content/uploads/")) {
    notes.push("WordPress upload asset");
  }
  if (asset.url.includes("/wp-content/themes/")) {
    notes.push("WordPress theme asset");
  }
  if (asset.url.includes("s.w.org/images/core/emoji/")) {
    notes.push("WordPress emoji CDN asset; optional unless exact emoji image rendering is required");
  }
  if (asset.usagePages.length > 1) {
    notes.push(`Duplicated across ${asset.usagePages.length} pages`);
  }
  if (!asset.hasAltText && asset.kinds.some((kind) => kind === "img" || kind === "srcset variant")) {
    notes.push("Missing alt text in current HTML");
  }
  if (!asset.contentLength) {
    notes.push("File size unavailable from HEAD request");
  }

  return notes;
}

function getFileType(url) {
  const extension = path.extname(new URL(url).pathname).replace(".", "").toLowerCase();
  return extension || "unknown";
}

function getSourceType(url) {
  return new URL(url).hostname === "tatianasf.com" ? "same-site" : "external";
}

function normalizeAssetUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    return parsed.href;
  } catch {
    return "";
  }
}

function formatBytes(value) {
  if (!value) {
    return "Unknown";
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function extensionFromContentType(contentType) {
  if (contentType.includes("jpeg")) return ".jpg";
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("svg")) return ".svg";
  if (contentType.includes("gif")) return ".gif";
  return "";
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function addUnique(target, value) {
  if (value && !target.includes(value)) {
    target.push(value);
  }
}

function markdownLink(url) {
  return `[${escapeCell(shortenUrl(url))}](${url})`;
}

function shortenUrl(url) {
  const parsed = new URL(url);
  return `${parsed.hostname}${parsed.pathname}`;
}

function escapeCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}
