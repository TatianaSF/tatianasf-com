#!/usr/bin/env node

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const inventoryPath = path.join(root, "docs", "audit", "data", "wordpress-assets.json");
const batch1DataPath = path.join(root, "docs", "audit", "data", "migrated-assets-batch-1.json");
const batch2DataPath = path.join(root, "docs", "audit", "data", "migrated-assets-batch-2.json");
const outputDataPath = path.join(root, "docs", "audit", "data", "migrated-assets-batch-3.json");
const manifestPath = path.join(root, "docs", "audit", "assets-migration-manifest.md");

const sourcePage = "https://tatianasf.com/openai-codex-design-guide/";
const targetFolder = "public/images/pages/openai-codex-design-guide";
const targetPrefix = `${targetFolder}/`;

const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
const batch1 = await readOptionalJson(batch1DataPath);
const batch2 = await readOptionalJson(batch2DataPath);
const previousRecords = [
  ...(batch1?.records ?? []).map((record) => ({ ...record, batchName: "Batch 1" })),
  ...(batch2?.records ?? []).map((record) => ({ ...record, batchName: "Batch 2" }))
];
const previousByUrl = new Map(previousRecords.map((record) => [record.originalUrl, record]));
const selectedAssets = selectBatchAssets(inventory.assets ?? []);
const migratedAt = new Date().toISOString();
const records = [];

await mkdir(path.join(root, targetFolder), { recursive: true });

for (const asset of selectedAssets) {
  const previousRecord = previousByUrl.get(asset.url);
  const decision = decideAsset(asset, previousRecord);
  const record = {
    originalUrl: asset.url,
    localPath: decision.localPath,
    status: "pending",
    contentType: previousRecord?.contentType ?? asset.contentType ?? "",
    bytes: previousRecord?.bytes ?? 0,
    pageUsage: asset.usagePages,
    category: decision.category,
    criticality: asset.criticality,
    sourceBatch: previousRecord?.batchName ?? "",
    notes: [...decision.notes]
  };

  try {
    if (decision.status === "skipped") {
      record.status = "skipped";
      records.push(record);
      continue;
    }

    validatePublicAssetUrl(asset.url);

    if (previousRecord) {
      await verifyExistingLocalFile(previousRecord.localPath);
      record.status = "mapped-existing";
      record.localPath = previousRecord.localPath;
      record.notes.push(`Mapped to existing ${previousRecord.batchName} file to avoid a duplicate download.`);
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
  batchName: "Asset Migration Batch 3",
  migratedAt,
  sourceInventoryFile: "docs/audit/data/wordpress-assets.json",
  sourcePage,
  targetFolder,
  selection:
    "Public image/media records used by /openai-codex-design-guide/, with already-migrated files mapped and optional emoji/srcset-only variants skipped.",
  totalAttempted: records.length,
  totalDownloaded: records.filter((record) => record.status === "downloaded").length,
  totalMapped: records.filter((record) => record.status === "mapped-existing").length,
  totalSkipped: records.filter((record) => record.status === "skipped").length,
  totalFailed: records.filter((record) => record.status === "failed").length,
  duplicateMappingsFromBatch1: records.filter((record) => record.status === "mapped-existing" && record.sourceBatch === "Batch 1").length,
  duplicateMappingsFromBatch2: records.filter((record) => record.status === "mapped-existing" && record.sourceBatch === "Batch 2").length,
  byCategory: countBy(records, "category")
};

await writeFile(outputDataPath, `${JSON.stringify({ summary, records }, null, 2)}\n`);
await writeFile(manifestPath, buildCombinedManifest([batch1, batch2, { summary, records }]));

if (summary.totalFailed > 0) {
  throw new Error(`Asset Migration Batch 3 failed for ${summary.totalFailed} asset(s).`);
}

console.log(`Asset Migration Batch 3 attempted: ${summary.totalAttempted}`);
console.log(`Downloaded: ${summary.totalDownloaded}`);
console.log(`Mapped from Batch 1: ${summary.duplicateMappingsFromBatch1}`);
console.log(`Mapped from Batch 2: ${summary.duplicateMappingsFromBatch2}`);
console.log(`Skipped: ${summary.totalSkipped}`);
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
    .filter((asset) => asset.usagePages?.includes(sourcePage))
    .sort((a, b) => a.url.localeCompare(b.url));
}

function decideAsset(asset, previousRecord) {
  if (previousRecord) {
    return {
      status: "mapped-existing",
      localPath: previousRecord.localPath,
      category: categorizeAsset(asset),
      notes: []
    };
  }

  if (asset.sourceType === "external") {
    return {
      status: "skipped",
      localPath: asset.suggestedLocalPath ?? "",
      category: "optional-emoji",
      notes: ["Skipped optional external WordPress emoji asset; native text rendering is sufficient unless exact emoji image parity is later required."]
    };
  }

  if (asset.kinds?.length === 1 && asset.kinds.includes("srcset variant")) {
    return {
      status: "skipped",
      localPath: asset.suggestedLocalPath ?? "",
      category: "srcset-variant",
      notes: ["Skipped srcset-only variant; not needed for the Batch 3 displayed visual asset set."]
    };
  }

  return {
    status: "download",
    localPath: getOpenAiTargetPath(asset),
    category: "openai-codex-design-guide",
    notes: []
  };
}

function categorizeAsset(asset) {
  if (asset.sourceType === "external") {
    return "optional-emoji";
  }

  if (asset.kinds?.some((kind) => kind.startsWith("site icon:"))) {
    return "site-icon";
  }

  if (asset.kinds?.some((kind) => kind.includes("og:image") || kind.includes("twitter:image"))) {
    return "openai-codex-design-guide";
  }

  if (asset.kinds?.length === 1 && asset.kinds.includes("srcset variant")) {
    return "srcset-variant";
  }

  return "openai-codex-design-guide";
}

function getOpenAiTargetPath(asset) {
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
    throw new Error(`Batch 3 downloads only same-site WordPress assets: ${value}`);
  }

  const blockedPathPattern = /\/(?:wp-admin|wp-login\.php|xmlrpc\.php|wp-json|feed|sitemap|robots\.txt)(?:\/|$)/i;
  if (blockedPathPattern.test(url.pathname)) {
    throw new Error(`Blocked WordPress system URL: ${value}`);
  }
}

function validateTargetPath(value) {
  if (!value.startsWith(targetPrefix)) {
    throw new Error(`Target path is outside approved Batch 3 folder: ${value}`);
  }

  if (!/\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(value)) {
    throw new Error(`Target path does not have an approved image extension: ${value}`);
  }

  const resolved = path.resolve(root, value);
  const targetRoot = path.resolve(root, targetFolder);
  if (!resolved.startsWith(targetRoot)) {
    throw new Error(`Target path escapes OpenAI Codex Design Guide directory: ${value}`);
  }
}

async function verifyExistingLocalFile(localPath) {
  const fileStat = await stat(path.join(root, localPath));

  if (!fileStat.isFile()) {
    throw new Error(`Mapped path is not a file: ${localPath}`);
  }

  if (fileStat.size === 0) {
    throw new Error(`Mapped file is zero bytes: ${localPath}`);
  }

  const buffer = await readFile(path.join(root, localPath));
  if (looksLikeHtml(buffer)) {
    throw new Error(`Mapped file looks like HTML: ${localPath}`);
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

function buildCombinedManifest(batchDataItems) {
  const lines = [
    "# Assets Migration Manifest",
    "",
    "This manifest records downloaded, mapped, and intentionally skipped public WordPress assets for future visual parity work. It does not indicate that page content migration is complete."
  ];

  for (const batchData of batchDataItems) {
    if (!batchData?.summary || !Array.isArray(batchData.records)) {
      continue;
    }

    const { summary: batchSummary, records: batchRecords } = batchData;
    lines.push("", ...buildBatchSection(batchSummary, batchRecords));
  }

  lines.push(
    "",
    "## Verification Notes",
    "",
    "- Each downloaded file was fetched from a public HTTPS same-site WordPress asset URL.",
    "- WordPress admin, login, REST API, XML-RPC, feed, sitemap, and robots URLs are blocked by the migration scripts.",
    "- Each saved file is checked for non-zero size and rejected if it appears to be an HTML error page.",
    "- Mapped duplicate files are checked locally before being recorded.",
    "- Optional WordPress emoji assets and unneeded `srcset`-only variants can be recorded as skipped for traceability.",
    "- The batches are intentionally limited; page components are not updated to use these assets yet."
  );

  return `${lines.join("\n")}\n`;
}

function buildBatchSection(summary, records) {
  const totals = normalizeTotals(summary);
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
    `- Total assets attempted: \`${totals.attempted}\``,
    `- Total assets downloaded: \`${totals.downloaded}\``,
    `- Total assets mapped: \`${totals.mapped}\``,
    `- Total assets skipped: \`${totals.skipped}\``,
    `- Total assets failed: \`${totals.failed}\``
  );

  if (typeof summary.duplicateMappingsFromBatch1 === "number") {
    lines.push(`- Duplicate mappings from Batch 1: \`${summary.duplicateMappingsFromBatch1}\``);
  }

  if (typeof summary.duplicateMappingsFromBatch2 === "number") {
    lines.push(`- Duplicate mappings from Batch 2: \`${summary.duplicateMappingsFromBatch2}\``);
  }

  lines.push(
    "",
    "### Category Counts",
    "",
    ...Object.entries(summary.byCategory ?? {}).map(([category, count]) => `- ${category}: \`${count}\``),
    "",
    "### Selection Logic",
    "",
    ...selectionNotesFor(summary.batchName),
    "",
    "### Asset Records",
    "",
    "| Original WordPress URL | New local path | Page usage | Category | Criticality | Status | Source batch | Content type | Bytes | Notes |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |"
  );

  for (const record of records) {
    lines.push(
      `| ${markdownLink(record.originalUrl)} | ${record.localPath ? `\`${record.localPath}\`` : ""} | ${(record.pageUsage ?? []).length} page(s) | ${record.category} | ${record.criticality} | ${record.status} | ${record.sourceBatch || ""} | ${record.contentType || "unknown"} | ${record.bytes ?? 0} | ${escapeCell((record.notes ?? []).join("; "))} |`
    );
  }

  return lines;
}

function normalizeTotals(summary) {
  const recordsMapped = summary.batchName === "Asset Migration Batch 2" ? summary.totalSkipped ?? 0 : summary.totalMapped ?? 0;
  const recordsSkipped = summary.batchName === "Asset Migration Batch 2" ? 0 : summary.totalSkipped ?? 0;

  return {
    attempted: summary.totalAttempted ?? 0,
    downloaded: summary.totalDownloaded ?? 0,
    mapped: recordsMapped,
    skipped: recordsSkipped,
    failed: summary.totalFailed ?? 0
  };
}

function selectionNotesFor(batchName) {
  if (batchName === "Asset Migration Batch 1") {
    return [
      "- Favicon and site icon assets from the public inventory.",
      "- Open Graph and Twitter image assets from the public inventory.",
      "- Displayed homepage image assets marked critical in the inventory.",
      "- Displayed `/hackathon_services/` image assets marked critical in the inventory.",
      "- `srcset`-only variants were not downloaded in this batch unless they were also the displayed image or an OG/icon asset."
    ];
  }

  if (batchName === "Asset Migration Batch 2") {
    return [
      "- Displayed same-site WordPress upload images used by `https://tatianasf.com/photo_portfolio/`, including assets marked `review` when they are displayed in the page body.",
      "- `srcset`-only variants were not downloaded unless the variant was the displayed image in the inventory.",
      "- Assets already downloaded in Batch 1 were mapped to their existing local paths instead of downloaded again.",
      "- External WordPress emoji assets were excluded because they are optional and not required for portfolio visual asset migration."
    ];
  }

  return [
    "- All inventory records used by `https://tatianasf.com/openai-codex-design-guide/` were reviewed for traceability.",
    "- The OpenAI Codex Design Guide image, site icons, and shared displayed image were mapped from earlier batches instead of duplicated.",
    "- External WordPress emoji assets were recorded as skipped because they are optional and not required for page visual asset migration.",
    "- `srcset`-only variants were recorded as skipped unless future implementation proves that a specific responsive source is needed."
  ];
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
