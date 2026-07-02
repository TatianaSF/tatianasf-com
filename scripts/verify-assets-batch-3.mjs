#!/usr/bin/env node

import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceJson = "docs/audit/data/migrated-assets-batch-3.json";
const batch1Json = "docs/audit/data/migrated-assets-batch-1.json";
const batch2Json = "docs/audit/data/migrated-assets-batch-2.json";
const outputJson = "docs/audit/data/asset-qa-batch-3.json";
const reviewDir = "docs/audit/assets-review/batch-3";
const reportFile = `${reviewDir}/asset-qa-report.md`;
const contactSheetFile = `${reviewDir}/contact-sheet.html`;

const approvedFolders = [
  "public/icons",
  "public/og",
  "public/images/pages/photo-portfolio",
  "public/images/pages/openai-codex-design-guide"
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
const batch2 = JSON.parse(await readFile(path.join(root, batch2Json), "utf8"));
const sourceRecords = Array.isArray(source.records) ? source.records : [];
const previousByOriginalUrl = new Map([
  ...(batch1.records ?? []).map((record) => [record.originalUrl, { ...record, sourceBatch: "Batch 1" }]),
  ...(batch2.records ?? []).map((record) => [record.originalUrl, { ...record, sourceBatch: "Batch 2" }])
]);

await mkdir(path.join(root, reviewDir), { recursive: true });

const folderSummary = await verifyFolders();
const records = [];

for (const [index, asset] of sourceRecords.entries()) {
  records.push(await verifyAsset(asset, index));
}

const documentationConsistency = await verifyDocumentationConsistency();
const duplicateMappingNotes = summarizeDuplicateMappings(records);
const skippedReasoningSummary = summarizeSkippedReasoning(records);
const mappedFileIntegritySummary = summarizeMappedIntegrity(records);
const downloadedRecordsChecked = records.filter((record) => record.sourceStatus === "downloaded").length;
const mappedRecordsChecked = records.filter((record) => isMappedStatus(record.sourceStatus)).length;
const skippedRecordsChecked = records.filter((record) => record.sourceStatus === "skipped").length;
const passedRecords = records.filter((record) => record.verificationStatus === "passed").length;
const failedRecords = records.filter((record) => record.verificationStatus === "failed").length;
const warningCount = records.reduce((total, record) => total + record.warnings.length, 0);
const byStatus = summarizeBy(records, "sourceStatus");
const byCategory = summarizeBy(records, "category");

const summary = {
  qaDate: now,
  sourceJson,
  sourcePage: source.summary?.sourcePage ?? "",
  totalRecordsChecked: records.length,
  downloadedRecordsChecked,
  mappedRecordsChecked,
  skippedRecordsChecked,
  passedRecords,
  failedRecords,
  warningCount,
  mappedFileIntegritySummary,
  skippedReasoningSummary,
  duplicateMappingNotes,
  googleDriveExternalDependencyNotes: [
    "The WordPress audit found a Google Drive CTA on /openai-codex-design-guide/.",
    "Batch 3 QA checks image/media records only; Google Drive access must be manually verified before page rebuild or launch parity approval."
  ],
  folderSummary,
  documentationConsistency,
  byStatus,
  byCategory
};

const qaData = {
  summary,
  records: records.map((record) => ({
    originalUrl: record.originalUrl,
    status: record.sourceStatus,
    mappedLocalPath: isMappedStatus(record.sourceStatus) || record.sourceStatus === "downloaded" ? record.localPath : "",
    mappedSourceBatch: record.mappedSourceBatch,
    usagePage: record.usagePage,
    category: record.category,
    exists: record.exists,
    sizeBytes: record.sizeBytes,
    extension: record.extension,
    verificationStatus: record.verificationStatus,
    warnings: record.warnings,
    skippedReason: record.skippedReason,
    notes: record.notes
  }))
};

await writeFile(path.join(root, outputJson), `${JSON.stringify(qaData, null, 2)}\n`);
await writeFile(path.join(root, reportFile), buildReport(summary, records));
await writeFile(path.join(root, contactSheetFile), buildContactSheet(summary, records));

console.log(`Asset QA Batch 3 complete: ${passedRecords}/${records.length} passed, ${failedRecords} failed, ${warningCount} warning(s).`);
console.log(`Mapped records checked: ${mappedRecordsChecked}`);
console.log(`Skipped records checked: ${skippedRecordsChecked}`);
console.log(`Downloaded records checked: ${downloadedRecordsChecked}`);
console.log(`QA report: ${reportFile}`);
console.log(`Contact sheet: ${contactSheetFile}`);

if (failedRecords > 0) {
  console.error("Asset QA Batch 3 failed. Review the generated report before approving page rebuild work.");
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
  const mappedSourceBatch = asset.sourceBatch || "";
  const skippedReason = sourceStatus === "skipped" ? (asset.notes ?? []).join(" ") : "";
  const previousRecord = previousByOriginalUrl.get(originalUrl);
  let exists = false;
  let sizeBytes = 0;
  let signature = "not checked";

  if (!originalUrl) {
    warnings.push("Original URL is missing.");
  }

  if (!sourceStatus) {
    warnings.push("Status is missing.");
  } else if (!allowedStatuses.has(sourceStatus)) {
    warnings.push(`Unexpected status: ${sourceStatus}.`);
  }

  if (!Array.isArray(asset.pageUsage) || asset.pageUsage.length === 0) {
    warnings.push("Usage page is missing.");
  }

  if (!category) {
    warnings.push("Category is missing.");
  }

  if (sourceStatus === "failed") {
    warnings.push("Batch 3 source record is marked failed.");
  }

  if (isMappedStatus(sourceStatus) || sourceStatus === "downloaded") {
    await verifyMappedOrDownloadedAsset({
      asset,
      localPath,
      extension,
      previousRecord,
      mappedSourceBatch,
      warnings,
      notes,
      setFileState: (state) => {
        exists = state.exists;
        sizeBytes = state.sizeBytes;
        signature = state.signature;
      }
    });
  }

  if (sourceStatus === "skipped") {
    verifySkippedAsset(asset, skippedReason, warnings, notes);
  }

  const failed = warnings.some((warning) =>
    [
      "Batch 3 source record is marked failed.",
      "Mapped local path is missing.",
      "Mapped local file does not exist.",
      "Mapped local file is empty.",
      "Mapped local path does not point to a file.",
      "Mapped local file appears to be an HTML document, not an image.",
      "Mapped local path is outside the approved Batch 3 public folders.",
      "Mapped asset does not have a matching Batch 1 or Batch 2 original URL record.",
      "Mapped source batch does not match the previous migration record.",
      "Downloaded record was unexpected for Batch 3.",
      "Skipped record is missing a clear reason.",
      "Skipped emoji asset is not marked optional.",
      "Skipped srcset-only variant is missing a non-essential reason.",
      "Skipped record has unexpected category."
    ].includes(warning) ||
    warning.startsWith("File signature does not match")
  );

  notes.push(`Signature check: ${signature}.`);
  notes.push(`Migration status: ${sourceStatus || "missing"}.`);
  if (mappedSourceBatch) {
    notes.push(`Mapped source batch: ${mappedSourceBatch}.`);
  }

  return {
    index,
    originalUrl,
    localPath,
    mappedSourceBatch,
    category,
    usagePage: Array.isArray(asset.pageUsage) ? asset.pageUsage.join(", ") : "",
    exists,
    sizeBytes,
    extension,
    sourceStatus,
    verificationStatus: failed ? "failed" : "passed",
    warnings,
    skippedReason,
    notes,
    pageUsage: Array.isArray(asset.pageUsage) ? asset.pageUsage : [],
    criticality: asset.criticality || "",
    contentType: asset.contentType || ""
  };
}

async function verifyMappedOrDownloadedAsset({
  asset,
  localPath,
  extension,
  previousRecord,
  mappedSourceBatch,
  warnings,
  notes,
  setFileState
}) {
  if (!localPath) {
    warnings.push("Mapped local path is missing.");
    return;
  }

  if (!isApprovedPublicPath(localPath)) {
    warnings.push("Mapped local path is outside the approved Batch 3 public folders.");
  }

  if (!expectedExtensions.has(extension)) {
    warnings.push(`Unexpected file extension: ${extension || "(none)"}.`);
  }

  if (asset.contentType && !asset.contentType.toLowerCase().startsWith("image/")) {
    warnings.push(`Recorded content type is not image-like: ${asset.contentType}.`);
  }

  if (asset.status === "downloaded") {
    warnings.push("Downloaded record was unexpected for Batch 3.");
  }

  if (isMappedStatus(asset.status)) {
    if (!previousRecord) {
      warnings.push("Mapped asset does not have a matching Batch 1 or Batch 2 original URL record.");
    } else {
      if (normalizePath(previousRecord.localPath) !== localPath) {
        warnings.push("Mapped local path does not match the previous migration record.");
      }

      if (previousRecord.sourceBatch !== mappedSourceBatch) {
        warnings.push("Mapped source batch does not match the previous migration record.");
      }

      notes.push(`Duplicate mapping is intentional: ${asset.originalUrl} -> ${localPath}.`);
    }
  }

  try {
    const absolutePath = path.join(root, localPath);
    const fileStat = await stat(absolutePath);
    const exists = fileStat.isFile();
    const sizeBytes = exists ? fileStat.size : 0;
    let signature = "not checked";

    if (!exists) {
      warnings.push("Mapped local path does not point to a file.");
    } else if (sizeBytes === 0) {
      warnings.push("Mapped local file is empty.");
    } else {
      const buffer = await readFile(absolutePath);
      const signatureResult = verifyImageSignature(buffer, extension);
      signature = signatureResult.signature;

      if (looksLikeHtml(buffer)) {
        warnings.push("Mapped local file appears to be an HTML document, not an image.");
      }

      if (!signatureResult.valid) {
        warnings.push(signatureResult.note);
      }
    }

    if (asset.bytes && sizeBytes > 0 && asset.bytes !== sizeBytes) {
      warnings.push(`Recorded byte size ${asset.bytes} does not match local size ${sizeBytes}.`);
    }

    setFileState({ exists, sizeBytes, signature });
  } catch {
    warnings.push("Mapped local file does not exist.");
    setFileState({ exists: false, sizeBytes: 0, signature: "missing" });
  }
}

function verifySkippedAsset(asset, skippedReason, warnings, notes) {
  if (!skippedReason.trim()) {
    warnings.push("Skipped record is missing a clear reason.");
  }

  if (asset.category === "optional-emoji") {
    const optional = asset.criticality === "optional" && /optional|native text rendering/i.test(skippedReason);
    if (!optional) {
      warnings.push("Skipped emoji asset is not marked optional.");
    }
    notes.push("Skipped emoji asset is documented as optional/non-critical.");
    return;
  }

  if (asset.category === "srcset-variant") {
    const nonEssential = /srcset-only|not needed|unless future implementation/i.test(skippedReason);
    if (!nonEssential) {
      warnings.push("Skipped srcset-only variant is missing a non-essential reason.");
    }
    notes.push("Skipped srcset-only variant is documented as non-essential for Batch 3.");
    return;
  }

  warnings.push("Skipped record has unexpected category.");
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

function summarizeMappedIntegrity(assets) {
  const mapped = assets.filter((asset) => isMappedStatus(asset.sourceStatus));
  return {
    mappedAssets: mapped.length,
    existingFiles: mapped.filter((asset) => asset.exists).length,
    nonZeroFiles: mapped.filter((asset) => asset.sizeBytes > 0).length,
    passedMappedAssets: mapped.filter((asset) => asset.verificationStatus === "passed").length,
    notes: mapped.map((asset) => `${asset.localPath}: ${asset.sizeBytes} bytes, ${asset.notes.find((note) => note.startsWith("Signature check:")) ?? "signature not checked"}`)
  };
}

function summarizeSkippedReasoning(assets) {
  const skipped = assets.filter((asset) => asset.sourceStatus === "skipped");
  return {
    skippedAssets: skipped.length,
    optionalEmoji: skipped.filter((asset) => asset.category === "optional-emoji").length,
    srcsetOnlyVariants: skipped.filter((asset) => asset.category === "srcset-variant").length,
    notes: skipped.map((asset) => `${asset.originalUrl}: ${asset.skippedReason}`)
  };
}

function summarizeDuplicateMappings(assets) {
  const mappedAssets = assets.filter((asset) => isMappedStatus(asset.sourceStatus));
  const unnecessaryDuplicateDownloads = assets.filter(
    (asset) => asset.sourceStatus === "downloaded" && previousByOriginalUrl.has(asset.originalUrl)
  ).length;

  return {
    mappedAssets: mappedAssets.length,
    mappedFromBatch1: mappedAssets.filter((asset) => asset.mappedSourceBatch === "Batch 1").length,
    mappedFromBatch2: mappedAssets.filter((asset) => asset.mappedSourceBatch === "Batch 2").length,
    unnecessaryDuplicateDownloads,
    notes: mappedAssets.map((asset) => `${asset.originalUrl} -> ${asset.localPath} (${asset.mappedSourceBatch})`)
  };
}

function summarizeBy(assets, key) {
  return assets.reduce((summary, asset) => {
    const value = asset[key] || "missing";
    summary[value] = (summary[value] ?? 0) + 1;
    return summary;
  }, {});
}

async function verifyDocumentationConsistency() {
  const manifest = await readOptionalText("docs/audit/assets-migration-manifest.md");
  const plan = await readOptionalText("docs/audit/asset-migration-plan.md");
  const inventory = await readOptionalText("docs/audit/image-inventory.md");
  const migration = await readOptionalText("MIGRATION.md");
  const parity = await readOptionalText("docs/qa/parity-checklist.md");
  const readme = await readOptionalText("README.md");
  const wordpressAudit = await readOptionalText("docs/audit/wordpress-audit.md");

  const checks = [
    {
      label: "Assets migration manifest includes Batch 3 mapped and skipped records",
      passed:
        manifest.includes("## Asset Migration Batch 3") &&
        manifest.includes("Total assets downloaded: `0`") &&
        manifest.includes("Total assets mapped: `5`") &&
        manifest.includes("Total assets skipped: `6`"),
      note: "Manifest should make the no-new-downloads Batch 3 outcome explicit."
    },
    {
      label: "Asset migration plan records Batch 3 migration and QA status",
      passed:
        plan.includes("## Batch 3 Status") &&
        plan.includes("Asset Migration Batch 3 is complete") &&
        plan.includes("## Batch 3 QA Status") &&
        plan.includes("Asset Migration Batch 3 QA is complete"),
      note: "Plan should distinguish migration, QA, and future page rebuild work."
    },
    {
      label: "Image inventory records Batch 3 output and QA output",
      passed:
        inventory.includes("Asset Migration Batch 3 has been completed") &&
        inventory.includes("Batch 3 QA output") &&
        inventory.includes("docs/audit/data/asset-qa-batch-3.json"),
      note: "Inventory should keep Batch 3 visible after regeneration."
    },
    {
      label: "Migration notes keep OpenAI Codex page content incomplete",
      passed:
        migration.includes("Batch 3 QA has verified") &&
        migration.includes("The OpenAI Codex Design Guide page has not been rebuilt") &&
        migration.includes("Content migration is not complete yet"),
      note: "Asset QA should not be represented as page/content migration."
    },
    {
      label: "Parity checklist includes Batch 3 QA report",
      passed:
        parity.includes("OpenAI Codex Design Guide Batch 3 asset QA report and contact sheet created") &&
        parity.includes("Google Drive access is manually verified"),
      note: "Checklist should record QA separately from page rebuild."
    },
    {
      label: "README documents the Batch 3 verification command",
      passed:
        readme.includes("npm run verify:assets:batch3") &&
        readme.includes("Asset Migration Batch 3 QA is documented"),
      note: "README should expose the new command and QA artifact locations."
    },
    {
      label: "WordPress audit records Google Drive dependency",
      passed: wordpressAudit.includes("Google Drive"),
      note: "External access remains a manual dependency outside asset QA."
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
  const mappedIntegrityLines = summaryData.mappedFileIntegritySummary.notes.map((note) => `- ${note}`).join("\n");
  const skippedReasonLines = summaryData.skippedReasoningSummary.notes.map((note) => `- ${note}`).join("\n");
  const externalLines = summaryData.googleDriveExternalDependencyNotes.map((note) => `- ${note}`).join("\n");
  const warningLines = assets
    .filter((asset) => asset.warnings.length > 0)
    .map((asset) => `- \`${asset.localPath || asset.originalUrl}\`: ${asset.warnings.join(" ")}`);
  const failureLines = assets
    .filter((asset) => asset.verificationStatus === "failed")
    .map((asset) => `- \`${asset.localPath || asset.originalUrl}\`: ${asset.warnings.join(" ")}`);

  return `# Asset QA Report: Batch 3

QA date: ${summaryData.qaDate}

Source JSON file: \`${summaryData.sourceJson}\`

Source page: \`${summaryData.sourcePage}\`

This report verifies mapped and skipped public image/media records for \`/openai-codex-design-guide/\`. It is a file-integrity and traceability aid only. It does not mean page content migration or page rebuild work is complete.

## Summary

- Total records checked: \`${summaryData.totalRecordsChecked}\`
- Mapped assets checked: \`${summaryData.mappedRecordsChecked}\`
- Skipped assets checked: \`${summaryData.skippedRecordsChecked}\`
- Downloaded assets checked: \`${summaryData.downloadedRecordsChecked}\`
- Passed records: \`${summaryData.passedRecords}\`
- Failed records: \`${summaryData.failedRecords}\`
- Warnings: \`${summaryData.warningCount}\`

## Mapped File Integrity Summary

- Mapped assets: \`${summaryData.mappedFileIntegritySummary.mappedAssets}\`
- Existing files: \`${summaryData.mappedFileIntegritySummary.existingFiles}\`
- Non-zero files: \`${summaryData.mappedFileIntegritySummary.nonZeroFiles}\`
- Passed mapped assets: \`${summaryData.mappedFileIntegritySummary.passedMappedAssets}\`
${mappedIntegrityLines}

## Skipped Asset Reasoning Summary

- Skipped assets: \`${summaryData.skippedReasoningSummary.skippedAssets}\`
- Optional emoji assets: \`${summaryData.skippedReasoningSummary.optionalEmoji}\`
- Srcset-only variants: \`${summaryData.skippedReasoningSummary.srcsetOnlyVariants}\`
${skippedReasonLines}

## Duplicate Mapping Notes

- Mapped assets: \`${summaryData.duplicateMappingNotes.mappedAssets}\`
- Mapped from Batch 1: \`${summaryData.duplicateMappingNotes.mappedFromBatch1}\`
- Mapped from Batch 2: \`${summaryData.duplicateMappingNotes.mappedFromBatch2}\`
- Unnecessary duplicate downloads: \`${summaryData.duplicateMappingNotes.unnecessaryDuplicateDownloads}\`
${duplicateLines}

## Folder Summary

${folderLines}

## Documentation Consistency

${documentationLines}

## Google Drive and External Dependency Notes

${externalLines}

## Failed Records

${failureLines.length > 0 ? failureLines.join("\n") : "- None."}

## Warnings

${warningLines.length > 0 ? warningLines.join("\n") : "- None."}

## Recommended Next Step

Open \`docs/audit/assets-review/batch-3/contact-sheet.html\` locally and review mapped images plus skipped records before approving any \`/openai-codex-design-guide/\` page rebuild. Manually verify Google Drive access separately.
`;
}

function buildContactSheet(summaryData, assets) {
  const mappedCards = assets
    .filter((asset) => isMappedStatus(asset.sourceStatus) || asset.sourceStatus === "downloaded")
    .map((asset) => {
      const imageSrc = `../../../../${asset.localPath}`;
      const warnings = asset.warnings.length > 0 ? `<p><strong>Warnings:</strong> ${escapeHtml(asset.warnings.join(" "))}</p>` : "";

      return `<article class="card">
  <div class="preview"><img src="${escapeAttribute(imageSrc)}" alt=""></div>
  <div class="meta">
    <p><strong>Status:</strong> ${escapeHtml(asset.sourceStatus)} / ${escapeHtml(asset.verificationStatus)}</p>
    <p><strong>Mapped source batch:</strong> ${escapeHtml(asset.mappedSourceBatch || "n/a")}</p>
    <p><strong>Local:</strong> <code>${escapeHtml(asset.localPath)}</code></p>
    <p><strong>Original:</strong> <a href="${escapeAttribute(asset.originalUrl)}">${escapeHtml(asset.originalUrl)}</a></p>
    <p><strong>Size:</strong> ${asset.sizeBytes.toLocaleString("en-US")} bytes</p>
    ${warnings}
  </div>
</article>`;
    })
    .join("\n");

  const skippedRows = assets
    .filter((asset) => asset.sourceStatus === "skipped")
    .map(
      (asset) => `<tr>
  <td><a href="${escapeAttribute(asset.originalUrl)}">${escapeHtml(asset.originalUrl)}</a></td>
  <td><code>${escapeHtml(asset.localPath)}</code></td>
  <td>${escapeHtml(asset.category)}</td>
  <td>${escapeHtml(asset.skippedReason)}</td>
  <td>${escapeHtml(asset.verificationStatus)}</td>
</tr>`
    )
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Asset QA Batch 3 Contact Sheet</title>
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
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--surface);
      border: 1px solid var(--border);
    }
    th,
    td {
      border-bottom: 1px solid var(--border);
      padding: 10px;
      text-align: left;
      vertical-align: top;
      overflow-wrap: anywhere;
    }
    th {
      background: #ecebe7;
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
    <h1>Asset QA Batch 3 Contact Sheet</h1>
    <p class="summary">Generated ${escapeHtml(summaryData.qaDate)} from ${escapeHtml(summaryData.sourceJson)}. Checked ${summaryData.totalRecordsChecked} records: ${summaryData.passedRecords} passed, ${summaryData.failedRecords} failed, ${summaryData.warningCount} warning(s).</p>
    <section>
      <h2>Mapped Images</h2>
      <div class="grid">
${mappedCards}
      </div>
    </section>
    <section>
      <h2>Skipped Records</h2>
      <table>
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Suggested local path</th>
            <th>Category</th>
            <th>Skipped reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
${skippedRows}
        </tbody>
      </table>
    </section>
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
