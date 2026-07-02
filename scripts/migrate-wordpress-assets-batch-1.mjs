import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const inventoryPath = path.join(root, "docs", "audit", "data", "wordpress-assets.json");
const outputDataPath = path.join(root, "docs", "audit", "data", "migrated-assets-batch-1.json");
const manifestPath = path.join(root, "docs", "audit", "assets-migration-manifest.md");

const homeUrl = "https://tatianasf.com/";
const hackathonUrl = "https://tatianasf.com/hackathon_services/";
const allowedPrefixes = [
  "public/icons/",
  "public/og/",
  "public/images/pages/home/",
  "public/images/pages/hackathon-services/"
];

const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
const selectedAssets = selectBatchAssets(inventory.assets);
const migratedAt = new Date().toISOString();
const records = [];

for (const asset of selectedAssets) {
  const category = getCategory(asset);
  const targetPath = normalizeTargetPath(asset.suggestedLocalPath);
  const record = {
    originalUrl: asset.url,
    localPath: targetPath,
    status: "pending",
    contentType: "",
    bytes: 0,
    pageUsage: asset.usagePages,
    category,
    criticality: asset.criticality,
    notes: []
  };

  try {
    validatePublicAssetUrl(asset.url);
    validateTargetPath(targetPath);
    await mkdir(path.dirname(path.join(root, targetPath)), { recursive: true });

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

    await writeFile(path.join(root, targetPath), buffer);

    const fileStat = await stat(path.join(root, targetPath));
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
  batchName: "Asset Migration Batch 1",
  migratedAt,
  sourceInventoryFile: "docs/audit/data/wordpress-assets.json",
  totalAttempted: records.length,
  totalDownloaded: records.filter((record) => record.status === "downloaded").length,
  totalSkipped: records.filter((record) => record.status === "skipped").length,
  totalFailed: records.filter((record) => record.status === "failed").length,
  byCategory: countBy(records, "category")
};

await writeFile(outputDataPath, `${JSON.stringify({ summary, records }, null, 2)}\n`);
await writeFile(manifestPath, buildManifest(summary, records));

if (summary.totalFailed > 0) {
  throw new Error(`Asset Migration Batch 1 failed for ${summary.totalFailed} asset(s).`);
}

console.log(`Asset Migration Batch 1 attempted: ${summary.totalAttempted}`);
console.log(`Downloaded: ${summary.totalDownloaded}`);
console.log(`Skipped: ${summary.totalSkipped}`);
console.log(`Failed: ${summary.totalFailed}`);
console.log(`Manifest written to ${manifestPath}`);

function selectBatchAssets(assets) {
  return assets
    .filter((asset) => {
      if (isSiteIcon(asset) || isOpenGraphImage(asset)) {
        return true;
      }

      return (
        asset.criticality === "critical" &&
        asset.sourceType === "same-site" &&
        asset.url.includes("/wp-content/uploads/") &&
        asset.kinds.includes("img") &&
        (asset.usagePages.includes(homeUrl) || asset.usagePages.includes(hackathonUrl))
      );
    })
    .sort((a, b) => {
      const order = {
        icon: 0,
        "open-graph": 1,
        homepage: 2,
        "hackathon-services": 3
      };

      return order[getCategory(a)] - order[getCategory(b)] || a.suggestedLocalPath.localeCompare(b.suggestedLocalPath);
    });
}

function getCategory(asset) {
  if (isSiteIcon(asset)) {
    return "icon";
  }

  if (isOpenGraphImage(asset)) {
    return "open-graph";
  }

  if (asset.usagePages.includes(homeUrl)) {
    return "homepage";
  }

  if (asset.usagePages.includes(hackathonUrl)) {
    return "hackathon-services";
  }

  return "review";
}

function isSiteIcon(asset) {
  return asset.kinds.some((kind) => kind.includes("icon"));
}

function isOpenGraphImage(asset) {
  return asset.kinds.some((kind) => kind.includes("og:image") || kind.includes("twitter:image"));
}

function validatePublicAssetUrl(value) {
  const url = new URL(value);

  if (url.protocol !== "https:") {
    throw new Error(`Only HTTPS asset URLs are allowed: ${value}`);
  }

  if (url.hostname !== "tatianasf.com") {
    throw new Error(`Batch 1 downloads only same-site WordPress assets: ${value}`);
  }

  const blockedPathPattern = /\/(?:wp-admin|wp-login\.php|xmlrpc\.php|wp-json|feed|sitemap|robots\.txt)(?:\/|$)/i;
  if (blockedPathPattern.test(url.pathname)) {
    throw new Error(`Blocked WordPress system URL: ${value}`);
  }
}

function normalizeTargetPath(value) {
  return value.replaceAll("\\", "/").replace(/^\/+/, "");
}

function validateTargetPath(value) {
  if (!allowedPrefixes.some((prefix) => value.startsWith(prefix))) {
    throw new Error(`Target path is outside approved Batch 1 folders: ${value}`);
  }

  if (!/\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(value)) {
    throw new Error(`Target path does not have an approved image extension: ${value}`);
  }

  const resolved = path.resolve(root, value);
  const publicRoot = path.resolve(root, "public");
  if (!resolved.startsWith(publicRoot)) {
    throw new Error(`Target path escapes public directory: ${value}`);
  }
}

function isAllowedImageContentType(value) {
  return /^image\/(?:avif|gif|jpeg|jpg|png|svg\+xml|webp)/i.test(value);
}

function looksLikeHtml(buffer) {
  const sample = buffer.subarray(0, 256).toString("utf8").trimStart().toLowerCase();
  return sample.startsWith("<!doctype html") || sample.startsWith("<html");
}

function countBy(records, key) {
  return records.reduce((counts, record) => {
    counts[record[key]] = (counts[record[key]] ?? 0) + 1;
    return counts;
  }, {});
}

function buildManifest(summary, records) {
  const lines = [
    "# Assets Migration Manifest",
    "",
    `Migration date: ${summary.migratedAt}`,
    "",
    `Batch name: ${summary.batchName}`,
    "",
    `Source inventory file: \`${summary.sourceInventoryFile}\``,
    "",
    "This manifest records downloaded public WordPress assets for future visual parity work. It does not indicate that page content migration is complete.",
    "",
    "## Summary",
    "",
    `- Total assets attempted: \`${summary.totalAttempted}\``,
    `- Total assets downloaded: \`${summary.totalDownloaded}\``,
    `- Total assets skipped: \`${summary.totalSkipped}\``,
    `- Total assets failed: \`${summary.totalFailed}\``,
    "",
    "## Category Counts",
    "",
    ...Object.entries(summary.byCategory).map(([category, count]) => `- ${category}: \`${count}\``),
    "",
    "## Batch 1 Selection Logic",
    "",
    "- Favicon and site icon assets from the public inventory.",
    "- Open Graph and Twitter image assets from the public inventory.",
    "- Displayed homepage image assets marked critical in the inventory.",
    "- Displayed `/hackathon_services/` image assets marked critical in the inventory.",
    "- `srcset`-only variants were not downloaded in this batch unless they were also the displayed image or an OG/icon asset.",
    "",
    "## Asset Records",
    "",
    "| Original WordPress URL | New local path | Page usage | Category | Criticality | Status | Content type | Bytes | Notes |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |"
  ];

  for (const record of records) {
    lines.push(
      `| ${markdownLink(record.originalUrl)} | \`${record.localPath}\` | ${record.pageUsage.length} page(s) | ${record.category} | ${record.criticality} | ${record.status} | ${record.contentType || "unknown"} | ${record.bytes} | ${escapeCell(record.notes.join("; "))} |`
    );
  }

  lines.push(
    "",
    "## Verification Notes",
    "",
    "- Each downloaded file was fetched from a public HTTPS same-site WordPress asset URL.",
    "- WordPress admin, login, REST API, XML-RPC, feed, sitemap, and robots URLs are blocked by the migration script.",
    "- Each saved file is checked for non-zero size and rejected if it appears to be an HTML error page.",
    "- The batch is intentionally limited; page components are not updated to use these assets yet."
  );

  return `${lines.join("\n")}\n`;
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
