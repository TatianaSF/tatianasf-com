#!/usr/bin/env node

import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceJson = "docs/audit/data/migrated-assets-batch-2.json";
const batch1Json = "docs/audit/data/migrated-assets-batch-1.json";
const outputJson = "docs/audit/data/asset-qa-batch-2.json";
const reviewDir = "docs/audit/assets-review/batch-2";
const reportFile = `${reviewDir}/asset-qa-report.md`;
const contactSheetFile = `${reviewDir}/contact-sheet.html`;

const approvedFolders = [
  "public/images/pages/photo-portfolio",
  "public/images/pages/home",
  "public/images/pages/hackathon-services",
  "public/icons",
  "public/og"
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

const allowedStatuses = new Set(["downloaded", "mapped-existing", "mapped", "skipped", "failed"]);
const now = new Date().toISOString();
const source = JSON.parse(await readFile(path.join(root, sourceJson), "utf8"));
const batch1 = JSON.parse(await readFile(path.join(root, batch1Json), "utf8"));
const sourceRecords = Array.isArray(source.records) ? source.records : [];
const batch1ByOriginalUrl = new Map((batch1.records ?? []).map((record) => [record.originalUrl, record]));

await mkdir(path.join(root, reviewDir), { recursive: true });

const folderSummary = await verifyFolders();
const records = [];

for (const [index, asset] of sourceRecords.entries()) {
  records.push(await verifyAsset(asset, index));
}

const duplicateMappingNotes = summarizeDuplicateMappings(records);
const documentationConsistency = await verifyDocumentationConsistency(source.summary || {});
const downloadedAssetsChecked = records.filter((record) => record.sourceStatus === "downloaded").length;
const mappedAssetsChecked = records.filter((record) => isMappedStatus(record.sourceStatus)).length;
const passedAssets = records.filter((record) => record.verificationStatus === "passed").length;
const failedAssets = records.filter((record) => record.verificationStatus === "failed").length;
const warningCount = records.reduce((total, record) => total + record.warnings.length, 0);
const byStatus = summarizeBy(records, "sourceStatus");
const byCategory = summarizeBy(records, "category");

const summary = {
  qaDate: now,
  sourceJson,
  sourcePage: source.summary?.sourcePage ?? "",
  totalAssetsChecked: records.length,
  downloadedAssetsChecked,
  mappedAssetsChecked,
  passedAssets,
  failedAssets,
  warningCount,
  folderSummary,
  duplicateMappingNotes,
  documentationConsistency,
  byStatus,
  byCategory
};

const qaData = {
  summary,
  records: records.map((record) => ({
    originalUrl: record.originalUrl,
    localPath: record.localPath,
    mappedSourcePath: record.mappedSourcePath,
    category: record.category,
    usagePage: record.usagePage,
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

console.log(`Asset QA Batch 2 complete: ${passedAssets}/${records.length} passed, ${failedAssets} failed, ${warningCount} warning(s).`);
console.log(`Downloaded assets checked: ${downloadedAssetsChecked}`);
console.log(`Mapped assets checked: ${mappedAssetsChecked}`);
console.log(`QA report: ${reportFile}`);
console.log(`Contact sheet: ${contactSheetFile}`);

if (failedAssets > 0) {
  console.error("Asset QA Batch 2 failed. Review the generated report before approving page rebuild work.");
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

async function verifyAsset(asset, index) {
  const warnings = [];
  const notes = [];
  const originalUrl = asset.originalUrl || "";
  const localPath = normalizePath(asset.localPath || "");
  const sourceStatus = asset.status || "";
  const category = asset.category || "";
  const extension = path.extname(localPath).toLowerCase();
  const absolutePath = path.join(root, localPath);
  const batch1Record = batch1ByOriginalUrl.get(originalUrl);
  const mappedSourcePath = isMappedStatus(sourceStatus) ? normalizePath(batch1Record?.localPath || localPath) : "";
  let exists = false;
  let sizeBytes = 0;
  let signature = "not checked";

  if (!originalUrl) {
    warnings.push("Original URL is missing.");
  }

  if (!localPath) {
    warnings.push("Local path is missing.");
  } else if (!isApprovedPublicPath(localPath)) {
    warnings.push("Local path is outside the approved Batch 2 public folders.");
  }

  if (!sourceStatus) {
    warnings.push("Status is missing.");
  } else if (!allowedStatuses.has(sourceStatus)) {
    warnings.push(`Unexpected status: ${sourceStatus}.`);
  }

  if (!category) {
    warnings.push("Category is missing.");
  }

  if (!Array.isArray(asset.pageUsage) || asset.pageUsage.length === 0) {
    warnings.push("Usage page is missing.");
  }

  if (!expectedExtensions.has(extension)) {
    warnings.push(`Unexpected file extension: ${extension || "(none)"}.`);
  }

  if (asset.contentType && !asset.contentType.toLowerCase().startsWith("image/")) {
    warnings.push(`Recorded content type is not image-like: ${asset.contentType}.`);
  }

  if (isMappedStatus(sourceStatus)) {
    if (!batch1Record) {
      warnings.push("Mapped asset does not have a matching Batch 1 original URL record.");
    } else if (normalizePath(batch1Record.localPath) !== localPath) {
      warnings.push("Mapped local path does not match the Batch 1 local path for the same original URL.");
    }

    if (localPath.startsWith("public/images/pages/photo-portfolio/")) {
      warnings.push("Mapped asset points to a new photo portfolio path instead of an existing Batch 1 path.");
    }
  }

  if (sourceStatus === "downloaded" && batch1Record) {
    warnings.push("Asset was downloaded in Batch 2 even though the original URL already exists in Batch 1.");
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
      "Local path is outside the approved Batch 2 public folders.",
      "Mapped asset does not have a matching Batch 1 original URL record.",
      "Mapped local path does not match the Batch 1 local path for the same original URL.",
      "Mapped asset points to a new photo portfolio path instead of an existing Batch 1 path.",
      "Asset was downloaded in Batch 2 even though the original URL already exists in Batch 1."
    ].includes(warning) ||
    warning.startsWith("File signature does not match")
  );

  notes.push(`Signature check: ${signature}.`);
  notes.push(`Migration status: ${sourceStatus || "missing"}.`);
  if (isMappedStatus(sourceStatus)) {
    notes.push(`Mapped source path: ${mappedSourcePath || "missing"}.`);
  }

  return {
    index,
    originalUrl,
    localPath,
    mappedSourcePath,
    category,
    usagePage: Array.isArray(asset.pageUsage) ? asset.pageUsage.join(", ") : "",
    exists,
    sizeBytes,
    extension,
    sourceStatus,
    verificationStatus: failed ? "failed" : "passed",
    warnings,
    notes,
    pageUsage: Array.isArray(asset.pageUsage) ? asset.pageUsage : [],
    criticality: asset.criticality || "",
    contentType: asset.contentType || ""
  };
}

function isMappedStatus(status) {
  return status === "mapped-existing" || status === "mapped";
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

function summarizeDuplicateMappings(assets) {
  const mappedAssets = assets.filter((asset) => isMappedStatus(asset.sourceStatus));

  return {
    mappedAssets: mappedAssets.length,
    mappedToBatch1: mappedAssets.filter((asset) => batch1ByOriginalUrl.has(asset.originalUrl)).length,
    unnecessaryDuplicateDownloads: assets.filter(
      (asset) => asset.sourceStatus === "downloaded" && batch1ByOriginalUrl.has(asset.originalUrl)
    ).length,
    notes:
      mappedAssets.length === 0
        ? ["No Batch 1 duplicate mappings were recorded."]
        : mappedAssets.map((asset) => `${asset.originalUrl} -> ${asset.localPath}`)
  };
}

function summarizeBy(assets, key) {
  return assets.reduce((summary, asset) => {
    const value = asset[key] || "missing";
    summary[value] = (summary[value] ?? 0) + 1;
    return summary;
  }, {});
}

async function verifyDocumentationConsistency(batchSummary) {
  const manifest = await readOptionalText("docs/audit/assets-migration-manifest.md");
  const plan = await readOptionalText("docs/audit/asset-migration-plan.md");
  const inventory = await readOptionalText("docs/audit/image-inventory.md");
  const migration = await readOptionalText("MIGRATION.md");
  const parity = await readOptionalText("docs/qa/parity-checklist.md");

  const checks = [
    {
      label: "Assets migration manifest includes Batch 2",
      passed:
        manifest.includes("## Asset Migration Batch 2") &&
        manifest.includes(`Total assets downloaded: \`${batchSummary.totalDownloaded}\``) &&
        manifest.includes(`Duplicate mappings from Batch 1: \`${batchSummary.duplicateMappingsFromBatch1}\``),
      note: "Manifest should include Batch 2 totals and duplicate mapping notes."
    },
    {
      label: "Asset migration plan records Batch 2 migration and QA status",
      passed:
        plan.includes("## Batch 2 Status") &&
        plan.includes("Asset Migration Batch 2 is complete") &&
        plan.includes("## Batch 2 QA Status") &&
        plan.includes("Asset Migration Batch 2 QA is complete"),
      note: "Plan should distinguish migration and QA completion from page rebuild work."
    },
    {
      label: "Image inventory avoids claiming full asset migration is complete",
      passed:
        inventory.includes("Assets not included in completed batches have not been downloaded yet") &&
        !inventory.toLowerCase().includes("full asset migration is complete"),
      note: "Inventory should keep completed batches separate from remaining inventory."
    },
    {
      label: "Migration notes keep content migration incomplete",
      passed:
        migration.includes("Content migration is not complete yet") &&
        migration.includes("Batch 2 does not mean page content migration is complete"),
      note: "Assets are available for future work, but pages are not rebuilt."
    },
    {
      label: "Parity checklist includes photo portfolio asset checks",
      passed:
        parity.includes("Portfolio displayed assets migrated from approved inventory in Batch 2") &&
        parity.includes("Portfolio Batch 2 asset QA report and contact sheet created"),
      note: "Checklist should record Batch 2 asset QA separately from page parity."
    }
  ];

  return {
    passed: checks.every((check) => check.passed),
    checks
  };
}

function buildReport(summaryData, assets) {
  const folderLines = Object.entries(summaryData.folderSummary)
    .map(([folder, data]) => `- \`${folder}\`: ${data.exists ? "exists" : "missing"}, ${data.fileCount} file(s)`)
    .join("\n");

  const documentationLines = summaryData.documentationConsistency.checks
    .map((check) => `- ${check.passed ? "Pass" : "Review"}: ${check.label}${check.note ? ` - ${check.note}` : ""}`)
    .join("\n");

  const duplicateLines = summaryData.duplicateMappingNotes.notes.map((note) => `- ${note}`).join("\n");
  const warningLines = assets
    .filter((asset) => asset.warnings.length > 0)
    .map((asset) => `- \`${asset.localPath}\`: ${asset.warnings.join(" ")}`);
  const failureLines = assets
    .filter((asset) => asset.verificationStatus === "failed")
    .map((asset) => `- \`${asset.localPath}\`: ${asset.warnings.join(" ")}`);

  return `# Asset QA Report: Batch 2

QA date: ${summaryData.qaDate}

Source JSON file: \`${summaryData.sourceJson}\`

Source page: \`${summaryData.sourcePage}\`

This report verifies the public files downloaded or mapped during Asset Migration Batch 2 for \`/photo_portfolio/\`. It is a visual-review and file-integrity aid only. It does not mean page content migration is complete.

## Summary

- Total assets checked: \`${summaryData.totalAssetsChecked}\`
- Downloaded assets checked: \`${summaryData.downloadedAssetsChecked}\`
- Mapped assets checked: \`${summaryData.mappedAssetsChecked}\`
- Passed assets: \`${summaryData.passedAssets}\`
- Failed assets: \`${summaryData.failedAssets}\`
- Warnings: \`${summaryData.warningCount}\`

## Folder Summary

${folderLines}

## Photo Portfolio Image Status

- Downloaded files: \`${summaryData.byStatus.downloaded ?? 0}\`
- Mapped existing files: \`${summaryData.byStatus["mapped-existing"] ?? summaryData.byStatus.mapped ?? 0}\`
- Category \`photo-portfolio\`: \`${summaryData.byCategory["photo-portfolio"] ?? 0}\`

## Duplicate Mapping Notes

- Mapped assets: \`${summaryData.duplicateMappingNotes.mappedAssets}\`
- Mapped to Batch 1 records: \`${summaryData.duplicateMappingNotes.mappedToBatch1}\`
- Unnecessary duplicate downloads: \`${summaryData.duplicateMappingNotes.unnecessaryDuplicateDownloads}\`
${duplicateLines}

## Documentation Consistency

${documentationLines}

## Failed Assets

${failureLines.length > 0 ? failureLines.join("\n") : "- None."}

## Warnings

${warningLines.length > 0 ? warningLines.join("\n") : "- None."}

## Recommended Next Step

Open \`docs/audit/assets-review/batch-2/contact-sheet.html\` locally and perform a human visual review against the WordPress baseline screenshots before approving portfolio page rebuild or content migration work.
`;
}

function buildContactSheet(summaryData, assets) {
  const groupedAssets = ["downloaded", "mapped-existing", "mapped", "skipped", "failed"]
    .map((status) => {
      const items = assets.filter((asset) => asset.sourceStatus === status);
      if (items.length === 0) {
        return "";
      }

      const cards = items
        .map((asset) => {
          const imageSrc = `../../../../${asset.localPath}`;
          const warnings = asset.warnings.length > 0 ? `<p><strong>Warnings:</strong> ${escapeHtml(asset.warnings.join(" "))}</p>` : "";
          const mapped = asset.mappedSourcePath
            ? `<p><strong>Mapped source:</strong> <code>${escapeHtml(asset.mappedSourcePath)}</code></p>`
            : "";

          return `<article class="card">
  <div class="preview"><img src="${escapeAttribute(imageSrc)}" alt=""></div>
  <div class="meta">
    <p><strong>Status:</strong> ${escapeHtml(asset.sourceStatus)} / ${escapeHtml(asset.verificationStatus)}</p>
    <p><strong>Local:</strong> <code>${escapeHtml(asset.localPath)}</code></p>
    ${mapped}
    <p><strong>Original:</strong> <a href="${escapeAttribute(asset.originalUrl)}">${escapeHtml(asset.originalUrl)}</a></p>
    <p><strong>Size:</strong> ${asset.sizeBytes.toLocaleString("en-US")} bytes</p>
    ${warnings}
  </div>
</article>`;
        })
        .join("\n");

      return `<section>
  <h2>${escapeHtml(status)}</h2>
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
  <title>Asset QA Batch 2 Contact Sheet</title>
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
    <h1>Asset QA Batch 2 Contact Sheet</h1>
    <p class="summary">Generated ${escapeHtml(summaryData.qaDate)} from ${escapeHtml(summaryData.sourceJson)}. Checked ${summaryData.totalAssetsChecked} assets: ${summaryData.passedAssets} passed, ${summaryData.failedAssets} failed, ${summaryData.warningCount} warning(s).</p>
${groupedAssets}
  </main>
</body>
</html>
`;
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
