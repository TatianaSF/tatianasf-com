import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const inventoryPath = path.join(root, "docs", "audit", "data", "wordpress-assets.json");
const batch1DataPath = path.join(root, "docs", "audit", "data", "migrated-assets-batch-1.json");
const outputDataPath = path.join(root, "docs", "audit", "data", "migrated-assets-batch-2.json");
const manifestPath = path.join(root, "docs", "audit", "assets-migration-manifest.md");

const photoPortfolioUrl = "https://tatianasf.com/photo_portfolio/";
const targetFolder = "public/images/pages/photo-portfolio";
const targetPrefix = `${targetFolder}/`;

const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
const batch1 = await readOptionalJson(batch1DataPath);
const batch1ByUrl = new Map((batch1?.records ?? []).map((record) => [record.originalUrl, record]));
const selectedAssets = selectBatchAssets(inventory.assets ?? []);
const migratedAt = new Date().toISOString();
const records = [];

for (const asset of selectedAssets) {
  const batch1Record = batch1ByUrl.get(asset.url);
  const record = {
    originalUrl: asset.url,
    localPath: batch1Record?.localPath ?? getPhotoPortfolioTargetPath(asset),
    status: "pending",
    contentType: batch1Record?.contentType ?? "",
    bytes: batch1Record?.bytes ?? 0,
    pageUsage: asset.usagePages,
    category: "photo-portfolio",
    criticality: asset.criticality,
    notes: []
  };

  try {
    validatePublicAssetUrl(asset.url);

    if (batch1Record) {
      await verifyExistingLocalFile(record.localPath);
      record.status = "mapped-existing";
      record.notes.push("Mapped to existing Batch 1 file to avoid a duplicate download.");
      records.push(record);
      continue;
    }

    validateTargetPath(record.localPath);
    await mkdir(path.dirname(path.join(root, record.localPath)), { recursive: true });

    const response = await fetch(asset.url, {
      redirect: "follow",
      signal: AbortSignal.timeout(30000)
    });

    record.contentType = response.headers.get("content-type") ?? "";

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    if (!isAllowedImageContentType(record.contentType)) {
      throw new Error(`Unexpected content type: ${record.contentType || "unknown"}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    if (buffer.length === 0) {
      throw new Error("Downloaded file is empty");
    }

    if (looksLikeHtml(buffer)) {
      throw new Error("Downloaded response looks like HTML, not an image");
    }

    await writeFile(path.join(root, record.localPath), buffer);
    const fileStat = await stat(path.join(root, record.localPath));

    if (fileStat.size === 0) {
      throw new Error("Saved file is zero bytes");
    }

    record.bytes = fileStat.size;
    record.status = "downloaded";
    record.notes.push("Downloaded from public WordPress asset URL.");
  } catch (error) {
    record.status = "failed";
    record.notes.push(error instanceof Error ? error.message : String(error));
  }

  records.push(record);
}

const summary = {
  batchName: "Asset Migration Batch 2",
  migratedAt,
  sourceInventoryFile: "docs/audit/data/wordpress-assets.json",
  sourcePage: photoPortfolioUrl,
  targetFolder,
  selection: "Displayed same-site WordPress upload images used by /photo_portfolio/.",
  totalAttempted: records.length,
  totalDownloaded: records.filter((record) => record.status === "downloaded").length,
  totalSkipped: records.filter((record) => record.status === "mapped-existing").length,
  totalFailed: records.filter((record) => record.status === "failed").length,
  duplicateMappingsFromBatch1: records.filter((record) => record.status === "mapped-existing").length,
  byCategory: countBy(records, "category")
};

await writeFile(outputDataPath, `${JSON.stringify({ summary, records }, null, 2)}\n`);
await writeFile(manifestPath, buildCombinedManifest(batch1, { summary, records }));

if (summary.totalFailed > 0) {
  throw new Error(`Asset Migration Batch 2 failed for ${summary.totalFailed} asset(s).`);
}

console.log(`Asset Migration Batch 2 attempted: ${summary.totalAttempted}`);
console.log(`Downloaded: ${summary.totalDownloaded}`);
console.log(`Skipped/mapped from Batch 1: ${summary.totalSkipped}`);
console.log(`Failed: ${summary.totalFailed}`);
console.log(`Manifest written to ${manifestPath}`);

async function readOptionalJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

function selectBatchAssets(assets) {
  return assets
    .filter((asset) => {
      return (
        asset.usagePages?.includes(photoPortfolioUrl) &&
        asset.sourceType === "same-site" &&
        asset.url.includes("/wp-content/uploads/") &&
        asset.kinds?.includes("img")
      );
    })
    .sort((a, b) => getPhotoPortfolioTargetPath(a).localeCompare(getPhotoPortfolioTargetPath(b)));
}

function getPhotoPortfolioTargetPath(asset) {
  const filename = cleanFilename(asset.suggestedFilename || filenameFromUrl(asset.url));
  return `${targetPrefix}${filename}`;
}

function cleanFilename(value) {
  const extension = path.extname(value).toLowerCase();
  const base = path.basename(value, path.extname(value));
  const cleanedBase = base
    .normalize("NFKD")
    .replace(/[^\w\s.-]/g, "")
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

  return `${cleanedBase || "asset"}${extension}`;
}

function filenameFromUrl(value) {
  const url = new URL(value);
  return decodeURIComponent(path.basename(url.pathname));
}

function validatePublicAssetUrl(value) {
  const url = new URL(value);

  if (url.protocol !== "https:") {
    throw new Error(`Only HTTPS asset URLs are allowed: ${value}`);
  }

  if (url.hostname !== "tatianasf.com") {
    throw new Error(`Batch 2 downloads only same-site WordPress assets: ${value}`);
  }

  const blockedPathPattern = /\/(?:wp-admin|wp-login\.php|xmlrpc\.php|wp-json|feed|sitemap|robots\.txt)(?:\/|$)/i;
  if (blockedPathPattern.test(url.pathname)) {
    throw new Error(`Blocked WordPress system URL: ${value}`);
  }
}

function validateTargetPath(value) {
  if (!value.startsWith(targetPrefix)) {
    throw new Error(`Target path is outside approved Batch 2 folder: ${value}`);
  }

  if (!/\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(value)) {
    throw new Error(`Target path does not have an approved image extension: ${value}`);
  }

  const resolved = path.resolve(root, value);
  const targetRoot = path.resolve(root, targetFolder);
  if (!resolved.startsWith(targetRoot)) {
    throw new Error(`Target path escapes photo portfolio directory: ${value}`);
  }
}

async function verifyExistingLocalFile(localPath) {
  const fileStat = await stat(path.join(root, localPath));

  if (!fileStat.isFile()) {
    throw new Error(`Mapped Batch 1 path is not a file: ${localPath}`);
  }

  if (fileStat.size === 0) {
    throw new Error(`Mapped Batch 1 file is zero bytes: ${localPath}`);
  }

  const buffer = await readFile(path.join(root, localPath));
  if (looksLikeHtml(buffer)) {
    throw new Error(`Mapped Batch 1 file looks like HTML: ${localPath}`);
  }
}

function isAllowedImageContentType(value) {
  return /^image\/(?:avif|gif|jpeg|jpg|png|svg\+xml|webp)/i.test(value);
}

function looksLikeHtml(buffer) {
  const sample = buffer.subarray(0, 256).toString("utf8").trimStart().toLowerCase();
  return sample.startsWith("<!doctype html") || sample.startsWith("<html");
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    counts[item[key]] = (counts[item[key]] ?? 0) + 1;
    return counts;
  }, {});
}

function buildCombinedManifest(batch1Data, batch2Data) {
  const lines = [
    "# Assets Migration Manifest",
    "",
    "This manifest records downloaded and mapped public WordPress assets for future visual parity work. It does not indicate that page content migration is complete."
  ];

  if (batch1Data?.summary && Array.isArray(batch1Data.records)) {
    lines.push("", ...buildBatchSection(batch1Data.summary, batch1Data.records, "Batch 1 Selection Logic", [
      "Favicon and site icon assets from the public inventory.",
      "Open Graph and Twitter image assets from the public inventory.",
      "Displayed homepage image assets marked critical in the inventory.",
      "Displayed `/hackathon_services/` image assets marked critical in the inventory.",
      "`srcset`-only variants were not downloaded in this batch unless they were also the displayed image or an OG/icon asset."
    ]));
  }

  lines.push("", ...buildBatchSection(batch2Data.summary, batch2Data.records, "Batch 2 Selection Logic", [
    "Displayed same-site WordPress upload images used by `https://tatianasf.com/photo_portfolio/`, including assets marked `review` when they are displayed in the page body.",
    "`srcset`-only variants were not downloaded unless the variant was the displayed image in the inventory.",
    "Assets already downloaded in Batch 1 were mapped to their existing local paths instead of downloaded again.",
    "External WordPress emoji assets were excluded because they are optional and not required for portfolio visual asset migration."
  ]));

  lines.push(
    "",
    "## Verification Notes",
    "",
    "- Each downloaded file was fetched from a public HTTPS same-site WordPress asset URL.",
    "- WordPress admin, login, REST API, XML-RPC, feed, sitemap, and robots URLs are blocked by the migration scripts.",
    "- Each saved file is checked for non-zero size and rejected if it appears to be an HTML error page.",
    "- Mapped duplicate files are checked locally before being recorded.",
    "- The batches are intentionally limited; page components are not updated to use these assets yet."
  );

  return `${lines.join("\n")}\n`;
}

function buildBatchSection(summary, records, selectionHeading, selectionLines) {
  const lines = [
    `## ${summary.batchName}`,
    "",
    `Migration date: ${summary.migratedAt}`,
    "",
    `Source inventory file: \`${summary.sourceInventoryFile}\``
  ];

  if (summary.sourcePage) {
    lines.push(`Source page: \`${summary.sourcePage}\``);
  }

  if (summary.targetFolder) {
    lines.push(`Target folder: \`${summary.targetFolder}\``);
  }

  lines.push(
    "",
    "### Summary",
    "",
    `- Total assets attempted: \`${summary.totalAttempted}\``,
    `- Total assets downloaded: \`${summary.totalDownloaded}\``,
    `- Total assets skipped: \`${summary.totalSkipped}\``,
    `- Total assets failed: \`${summary.totalFailed}\``
  );

  if (typeof summary.duplicateMappingsFromBatch1 === "number") {
    lines.push(`- Duplicate mappings from Batch 1: \`${summary.duplicateMappingsFromBatch1}\``);
  }

  lines.push(
    "",
    "### Category Counts",
    "",
    ...Object.entries(summary.byCategory).map(([category, count]) => `- ${category}: \`${count}\``),
    "",
    `### ${selectionHeading}`,
    "",
    ...selectionLines.map((line) => `- ${line}`),
    "",
    "### Asset Records",
    "",
    "| Original WordPress URL | New local path | Page usage | Category | Criticality | Status | Content type | Bytes | Notes |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |"
  );

  for (const record of records) {
    lines.push(
      `| ${markdownLink(record.originalUrl)} | \`${record.localPath}\` | ${record.pageUsage.length} page(s) | ${record.category} | ${record.criticality} | ${record.status} | ${record.contentType || "unknown"} | ${record.bytes} | ${escapeCell(record.notes.join("; "))} |`
    );
  }

  return lines;
}

function markdownLink(url) {
  return `[${escapeCell(shortenUrl(url))}](${url})`;
}

function shortenUrl(value) {
  const url = new URL(value);
  return `${url.hostname}${url.pathname}`;
}

function escapeCell(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}
