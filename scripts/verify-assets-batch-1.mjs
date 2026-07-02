#!/usr/bin/env node

import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceJson = "docs/audit/data/migrated-assets-batch-1.json";
const outputJson = "docs/audit/data/asset-qa-batch-1.json";
const reviewDir = "docs/audit/assets-review/batch-1";
const reportFile = `${reviewDir}/asset-qa-report.md`;
const contactSheetFile = `${reviewDir}/contact-sheet.html`;

const approvedFolders = [
  "public/icons",
  "public/og",
  "public/images/pages/home",
  "public/images/pages/hackathon-services"
];

const expectedExtensions = new Set([
  ".avif",
  ".gif",
  ".jpg",
  ".jpeg",
  ".png",
  ".svg",
  ".webp"
]);

const categoryLabels = new Map([
  ["icon", "Favicon and site icons"],
  ["open-graph", "Open Graph and Twitter images"],
  ["homepage", "Homepage critical images"],
  ["hackathon-services", "Hackathon services critical images"]
]);

const now = new Date().toISOString();
const source = JSON.parse(await readFile(path.join(root, sourceJson), "utf8"));
const sourceRecords = Array.isArray(source.records) ? source.records : [];

await mkdir(path.join(root, reviewDir), { recursive: true });

const folderSummary = await verifyFolders();
const duplicateSummary = summarizeDuplicates(sourceRecords);
const records = [];

for (const [index, asset] of sourceRecords.entries()) {
  records.push(await verifyAsset(asset, index, duplicateSummary));
}

const byCategory = summarizeCategories(records);
const passedAssets = records.filter((record) => record.verificationStatus === "passed").length;
const failedAssets = records.filter((record) => record.verificationStatus === "failed").length;
const warningCount = records.reduce((total, record) => total + record.warnings.length, 0);
const duplicateWarnings = [...duplicateSummary.values()]
  .filter((entry) => entry.localPaths.size > 1)
  .map((entry) => ({
    originalUrl: entry.originalUrl,
    count: entry.count,
      localPaths: [...entry.localPaths].sort()
  }));
const documentationConsistency = await verifyDocumentationConsistency(source.summary || {});

const summary = {
  qaDate: now,
  sourceJson,
  totalAssetsChecked: records.length,
  passedAssets,
  failedAssets,
  warningCount,
  folderSummary,
  duplicateWarnings,
  documentationConsistency,
  byCategory
};

const qaData = {
  summary,
  records: records.map((record) => ({
    originalUrl: record.originalUrl,
    localPath: record.localPath,
    category: record.category,
    exists: record.exists,
    sizeBytes: record.sizeBytes,
    extension: record.extension,
    verificationStatus: record.verificationStatus,
    warnings: record.warnings,
    notes: record.notes
  }))
};

await writeFile(path.join(root, outputJson), `${JSON.stringify(qaData, null, 2)}\n`);
await writeFile(path.join(root, reportFile), buildReport(summary, records));
await writeFile(path.join(root, contactSheetFile), buildContactSheet(summary, records));

console.log(`Asset QA Batch 1 complete: ${passedAssets}/${records.length} passed, ${failedAssets} failed, ${warningCount} warning(s).`);
console.log(`QA report: ${reportFile}`);
console.log(`Contact sheet: ${contactSheetFile}`);

if (failedAssets > 0) {
  console.error("Asset QA Batch 1 failed. Review the generated report before approving the next batch.");
  process.exit(1);
}

async function verifyFolders() {
  const results = {};

  for (const folder of approvedFolders) {
    const absoluteFolder = path.join(root, folder);
    try {
      const folderStat = await stat(absoluteFolder);
      results[folder] = {
        exists: folderStat.isDirectory(),
        fileCount: folderStat.isDirectory() ? await countFiles(absoluteFolder) : 0
      };
    } catch {
      results[folder] = {
        exists: false,
        fileCount: 0
      };
    }
  }

  return results;
}

async function countFiles(directory) {
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(directory, { withFileTypes: true });
  let total = 0;

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      total += await countFiles(fullPath);
    } else if (entry.isFile()) {
      total += 1;
    }
  }

  return total;
}

function summarizeDuplicates(assets) {
  const duplicates = new Map();

  for (const asset of assets) {
    const key = asset.originalUrl || "";
    if (!duplicates.has(key)) {
      duplicates.set(key, {
        originalUrl: key,
        count: 0,
        localPaths: new Set()
      });
    }

    const entry = duplicates.get(key);
    entry.count += 1;
    if (asset.localPath) {
      entry.localPaths.add(normalizePath(asset.localPath));
    }
  }

  return duplicates;
}

async function verifyAsset(asset, index, duplicates) {
  const warnings = [];
  const notes = [];
  const originalUrl = asset.originalUrl || "";
  const localPath = normalizePath(asset.localPath || "");
  const category = asset.category || "";
  const extension = path.extname(localPath).toLowerCase();
  const absolutePath = path.join(root, localPath);
  let exists = false;
  let sizeBytes = 0;
  let signature = "not checked";

  if (!originalUrl) {
    warnings.push("Original URL is missing.");
  }

  if (!category) {
    warnings.push("Category is missing.");
  }

  if (!Array.isArray(asset.pageUsage) || asset.pageUsage.length === 0) {
    warnings.push("Usage page is missing.");
  }

  if (!asset.criticality) {
    warnings.push("Criticality is missing.");
  }

  if (!localPath) {
    warnings.push("Local path is missing.");
  } else if (!isApprovedPublicPath(localPath)) {
    warnings.push("Local path is outside the approved Batch 1 public folders.");
  }

  if (!expectedExtensions.has(extension)) {
    warnings.push(`Unexpected file extension: ${extension || "(none)"}.`);
  }

  if (asset.contentType && !asset.contentType.toLowerCase().startsWith("image/")) {
    warnings.push(`Recorded content type is not image-like: ${asset.contentType}.`);
  }

  const duplicateEntry = duplicates.get(originalUrl);
  if (duplicateEntry && duplicateEntry.localPaths.size > 1) {
    warnings.push("The same original URL is recorded with multiple local paths.");
  }

  try {
    const fileStat = await stat(absolutePath);
    exists = fileStat.isFile();
    sizeBytes = exists ? fileStat.size : 0;

    if (!exists) {
      warnings.push("Local path does not point to a file.");
    } else if (sizeBytes === 0) {
      warnings.push("Local file is empty.");
    } else {
      const buffer = await readFile(absolutePath);
      const signatureResult = verifyImageSignature(buffer, extension);
      signature = signatureResult.signature;

      if (looksLikeHtml(buffer)) {
        warnings.push("Local file appears to be an HTML document, not an image.");
      }

      if (!signatureResult.valid) {
        warnings.push(signatureResult.note);
      }
    }
  } catch {
    warnings.push("Local file does not exist.");
  }

  if (asset.bytes && sizeBytes > 0 && asset.bytes !== sizeBytes) {
    warnings.push(`Recorded byte size ${asset.bytes} does not match local size ${sizeBytes}.`);
  }

  const failed = warnings.some((warning) =>
    [
      "Local file does not exist.",
      "Local file is empty.",
      "Local path does not point to a file.",
      "Local file appears to be an HTML document, not an image.",
      "Local path is outside the approved Batch 1 public folders."
    ].includes(warning) ||
    warning.startsWith("File signature does not match")
  );

  notes.push(`Signature check: ${signature}.`);
  if (asset.status) {
    notes.push(`Migration status: ${asset.status}.`);
  }

  return {
    index,
    originalUrl,
    localPath,
    category,
    exists,
    sizeBytes,
    extension,
    verificationStatus: failed ? "failed" : "passed",
    warnings,
    notes,
    pageUsage: Array.isArray(asset.pageUsage) ? asset.pageUsage : [],
    criticality: asset.criticality || "",
    contentType: asset.contentType || ""
  };
}

function isApprovedPublicPath(localPath) {
  return approvedFolders.some((folder) => localPath === folder || localPath.startsWith(`${folder}/`));
}

function verifyImageSignature(buffer, extension) {
  if (extension === ".jpg" || extension === ".jpeg") {
    const valid = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    return {
      valid,
      signature: valid ? "JPEG" : "unknown",
      note: `File signature does not match ${extension}.`
    };
  }

  if (extension === ".png") {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const valid = buffer.length >= png.length && buffer.subarray(0, png.length).equals(png);
    return {
      valid,
      signature: valid ? "PNG" : "unknown",
      note: "File signature does not match .png."
    };
  }

  if (extension === ".gif") {
    const header = buffer.toString("ascii", 0, 6);
    const valid = header === "GIF87a" || header === "GIF89a";
    return {
      valid,
      signature: valid ? "GIF" : "unknown",
      note: "File signature does not match .gif."
    };
  }

  if (extension === ".webp") {
    const valid =
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP";
    return {
      valid,
      signature: valid ? "WEBP" : "unknown",
      note: "File signature does not match .webp."
    };
  }

  if (extension === ".svg") {
    const text = buffer.toString("utf8", 0, Math.min(buffer.length, 1024)).toLowerCase();
    const valid = text.includes("<svg");
    return {
      valid,
      signature: valid ? "SVG" : "unknown",
      note: "File signature does not match .svg."
    };
  }

  if (extension === ".avif") {
    const text = buffer.toString("ascii", 0, Math.min(buffer.length, 32));
    const valid = text.includes("ftyp") && (text.includes("avif") || text.includes("avis"));
    return {
      valid,
      signature: valid ? "AVIF" : "unknown",
      note: "File signature does not match .avif."
    };
  }

  return {
    valid: false,
    signature: "unknown",
    note: "File extension does not have a known image signature rule."
  };
}

function looksLikeHtml(buffer) {
  const text = buffer.toString("utf8", 0, Math.min(buffer.length, 512)).trimStart().toLowerCase();
  return text.startsWith("<!doctype html") || text.startsWith("<html") || text.includes("<title>404");
}

function summarizeCategories(assets) {
  const summary = {};

  for (const asset of assets) {
    const category = asset.category || "missing-category";
    if (!summary[category]) {
      summary[category] = {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      };
    }

    summary[category].total += 1;
    summary[category][asset.verificationStatus === "passed" ? "passed" : "failed"] += 1;
    summary[category].warnings += asset.warnings.length;
  }

  return summary;
}

function buildReport(summaryData, assets) {
  const categorySections = [...categoryLabels.keys()]
    .map((category) => {
      const stats = summaryData.byCategory[category] || {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      };

      return `- ${categoryLabels.get(category)}: ${stats.passed}/${stats.total} passed, ${stats.failed} failed, ${stats.warnings} warning(s)`;
    })
    .join("\n");

  const folderLines = Object.entries(summaryData.folderSummary)
    .map(([folder, data]) => `- \`${folder}\`: ${data.exists ? "exists" : "missing"}, ${data.fileCount} file(s)`)
    .join("\n");

  const duplicateLines =
    summaryData.duplicateWarnings.length === 0
      ? "- No duplicate original URLs were downloaded to multiple local paths."
      : summaryData.duplicateWarnings
          .map(
            (duplicate) =>
              `- ${duplicate.originalUrl}: ${duplicate.count} record(s), ${duplicate.localPaths.length} local path(s)`
          )
          .join("\n");

  const documentationLines = summaryData.documentationConsistency.checks
    .map((check) => `- ${check.passed ? "Pass" : "Review"}: ${check.label}${check.note ? ` - ${check.note}` : ""}`)
    .join("\n");

  const warningLines = assets
    .filter((asset) => asset.warnings.length > 0)
    .map((asset) => `- \`${asset.localPath}\`: ${asset.warnings.join(" ")}`);

  const failureLines = assets
    .filter((asset) => asset.verificationStatus === "failed")
    .map((asset) => `- \`${asset.localPath}\`: ${asset.warnings.join(" ")}`);

  return `# Asset QA Report: Batch 1

QA date: ${summaryData.qaDate}

Source JSON file: \`${summaryData.sourceJson}\`

This report verifies the public files downloaded during Asset Migration Batch 1. It is a visual-review and file-integrity aid only. It does not mean page content migration is complete.

## Summary

- Total assets checked: \`${summaryData.totalAssetsChecked}\`
- Passed assets: \`${summaryData.passedAssets}\`
- Failed assets: \`${summaryData.failedAssets}\`
- Warnings: \`${summaryData.warningCount}\`

## Folder Summary

${folderLines}

## Category Status

${categorySections}

## Duplicate Notes

${duplicateLines}

## Documentation Consistency

${documentationLines}

## Failed Assets

${failureLines.length > 0 ? failureLines.join("\n") : "- None."}

## Warnings

${warningLines.length > 0 ? warningLines.join("\n") : "- None."}

## Favicon/Icon Status

- Batch 1 favicon and site icon assets checked: \`${summaryData.byCategory.icon?.total ?? 0}\`
- Result: \`${summaryData.byCategory.icon?.passed ?? 0}\` passed, \`${summaryData.byCategory.icon?.failed ?? 0}\` failed

## OG Image Status

- Batch 1 Open Graph/Twitter image assets checked: \`${summaryData.byCategory["open-graph"]?.total ?? 0}\`
- Result: \`${summaryData.byCategory["open-graph"]?.passed ?? 0}\` passed, \`${summaryData.byCategory["open-graph"]?.failed ?? 0}\` failed

## Homepage Critical Image Status

- Homepage critical image assets checked: \`${summaryData.byCategory.homepage?.total ?? 0}\`
- Result: \`${summaryData.byCategory.homepage?.passed ?? 0}\` passed, \`${summaryData.byCategory.homepage?.failed ?? 0}\` failed

## Hackathon Services Critical Image Status

- Hackathon services critical image assets checked: \`${summaryData.byCategory["hackathon-services"]?.total ?? 0}\`
- Result: \`${summaryData.byCategory["hackathon-services"]?.passed ?? 0}\` passed, \`${summaryData.byCategory["hackathon-services"]?.failed ?? 0}\` failed

## Recommended Next Step

Open \`docs/audit/assets-review/batch-1/contact-sheet.html\` locally and perform a human visual review against the WordPress baseline screenshots before approving the next asset batch or page rebuild work.
`;
}

function buildContactSheet(summaryData, assets) {
  const groupedAssets = [...categoryLabels.entries()]
    .map(([category, label]) => {
      const items = assets.filter((asset) => asset.category === category);
      if (items.length === 0) {
        return "";
      }

      const cards = items
        .map((asset) => {
          const imageSrc = `../../../../${asset.localPath}`;
          const warnings = asset.warnings.length > 0 ? `<p><strong>Warnings:</strong> ${escapeHtml(asset.warnings.join(" "))}</p>` : "";

          return `<article class="card">
  <div class="preview"><img src="${escapeAttribute(imageSrc)}" alt=""></div>
  <div class="meta">
    <p><strong>Status:</strong> ${escapeHtml(asset.verificationStatus)}</p>
    <p><strong>Local:</strong> <code>${escapeHtml(asset.localPath)}</code></p>
    <p><strong>Original:</strong> <a href="${escapeAttribute(asset.originalUrl)}">${escapeHtml(asset.originalUrl)}</a></p>
    <p><strong>Size:</strong> ${asset.sizeBytes.toLocaleString("en-US")} bytes</p>
    ${warnings}
  </div>
</article>`;
        })
        .join("\n");

      return `<section>
  <h2>${escapeHtml(label)}</h2>
  <div class="grid">
${cards}
  </div>
</section>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Asset QA Batch 1 Contact Sheet</title>
  <style>
    :root {
      color-scheme: light;
      --border: #d9d9d9;
      --ink: #202124;
      --muted: #5f6368;
      --surface: #ffffff;
      --page: #f7f7f5;
    }
    body {
      margin: 0;
      background: var(--page);
      color: var(--ink);
      font: 14px/1.45 Arial, sans-serif;
    }
    main {
      max-width: 1180px;
      margin: 0 auto;
      padding: 32px 20px 48px;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 28px;
    }
    h2 {
      margin: 36px 0 14px;
      font-size: 20px;
    }
    .summary {
      margin: 0 0 22px;
      color: var(--muted);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
    }
    .card {
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
    }
    .preview {
      display: grid;
      min-height: 190px;
      place-items: center;
      background: #ecebe7;
    }
    img {
      display: block;
      max-width: 100%;
      max-height: 260px;
      object-fit: contain;
    }
    .meta {
      padding: 12px;
      overflow-wrap: anywhere;
    }
    p {
      margin: 0 0 8px;
    }
    code {
      font-family: Consolas, monospace;
      font-size: 12px;
    }
    a {
      color: #174ea6;
    }
  </style>
</head>
<body>
  <main>
    <h1>Asset QA Batch 1 Contact Sheet</h1>
    <p class="summary">Generated ${escapeHtml(summaryData.qaDate)} from ${escapeHtml(summaryData.sourceJson)}. Checked ${summaryData.totalAssetsChecked} assets: ${summaryData.passedAssets} passed, ${summaryData.failedAssets} failed, ${summaryData.warningCount} warning(s).</p>
${groupedAssets}
  </main>
</body>
</html>
`;
}

async function verifyDocumentationConsistency(batchSummary) {
  const checks = [];
  const expectedTotal = batchSummary.totalDownloaded ?? sourceRecords.length;
  const expectedFailed = batchSummary.totalFailed ?? 0;
  const expectedCategories = batchSummary.byCategory || {};

  const manifest = await readOptionalText("docs/audit/assets-migration-manifest.md");
  const plan = await readOptionalText("docs/audit/asset-migration-plan.md");
  const inventory = await readOptionalText("docs/audit/image-inventory.md");
  const migration = await readOptionalText("MIGRATION.md");

  checks.push({
    label: "Batch 1 manifest total matches source JSON",
    passed:
      manifest.includes(`Total assets downloaded: \`${expectedTotal}\``) &&
      manifest.includes(`Total assets failed: \`${expectedFailed}\``),
    note: `Expected downloaded ${expectedTotal} and failed ${expectedFailed}.`
  });

  for (const [category, total] of Object.entries(expectedCategories)) {
    checks.push({
      label: `Batch 1 manifest category count matches JSON for ${category}`,
      passed: manifest.includes(`- ${category}: \`${total}\``),
      note: `Expected ${total}.`
    });
  }

  checks.push({
    label: "Asset migration plan records Batch 1 QA status",
    passed:
      plan.includes("## Batch 1 QA Status") &&
      plan.includes("Asset Migration Batch 1 QA is complete") &&
      plan.includes("docs/audit/assets-review/batch-1/asset-qa-report.md"),
    note: "Plan should point to the QA report and contact sheet."
  });

  checks.push({
    label: "Image inventory avoids claiming full asset migration is complete",
    passed:
      (inventory.includes("Assets not included in Batch 1 have not been downloaded yet") ||
        inventory.includes("Assets not included in completed batches have not been downloaded yet")) &&
      !inventory.toLowerCase().includes("full asset migration is complete"),
    note: "Inventory should keep Batch 1 separate from later batches."
  });

  checks.push({
    label: "Migration notes keep content migration incomplete",
    passed:
      migration.includes("Content migration is not complete yet") &&
      migration.includes("Batch 1 does not mean page content migration is complete"),
    note: "Assets are available for future work, but pages are not rebuilt."
  });

  return {
    passed: checks.every((check) => check.passed),
    checks
  };
}

async function readOptionalText(relativePath) {
  try {
    return await readFile(path.join(root, relativePath), "utf8");
  } catch {
    return "";
  }
}

function normalizePath(value) {
  return String(value).replaceAll("\\", "/");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
