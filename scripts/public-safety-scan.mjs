#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".vercel",
  "coverage",
  "node_modules",
  "out"
]);
const ignoredFiles = new Set([
  "package-lock.json",
  "scripts/public-safety-scan.mjs"
]);
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".txt",
  ".yml",
  ".yaml"
]);
const publicContentRoots = new Set(["app", "components", "content", "public"]);

const fileNameChecks = [
  {
    name: "Environment file",
    pattern: /^\.env(?!\.example$)/i
  },
  {
    name: "Private key or certificate file",
    pattern: /(?:^|[._-])(?:id_rsa|id_dsa|private-key|private_key)|\.(?:pem|key|p12|pfx)$/i
  },
  {
    name: "Internal-only file name",
    pattern:
      /(?:^|[._-])(?:secret|secrets|credential|credentials|confidential|internal-only|private-notes|do-not-publish)(?:[._-]|$)/i
  }
];

const pathSegmentChecks = [
  /^(?:secret|secrets|credential|credentials|confidential|private|internal-only)$/i,
  /^(?:client-files|client_data|personal-data|private-notes)$/i
];

const contentChecks = [
  {
    name: "AWS access key",
    pattern: /\bAKIA[0-9A-Z]{16}\b/g
  },
  {
    name: "GitHub token",
    pattern: /\bgh[pousr]_[A-Za-z0-9_]{36,255}\b/g
  },
  {
    name: "OpenAI API key",
    pattern: /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/g
  },
  {
    name: "Google API key",
    pattern: /\bAIza[0-9A-Za-z_-]{35}\b/g
  },
  {
    name: "Stripe secret key",
    pattern: /\bsk_(?:live|test)_[0-9A-Za-z]{20,}\b/g
  },
  {
    name: "Private key block",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g
  },
  {
    name: "JWT-like token",
    pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g
  },
  {
    name: "Generic secret assignment",
    pattern:
      /\b(?:api[_-]?key|client[_-]?secret|password|secret|token)\s*[:=]\s*["'][^"'\n]{12,}["']/gi
  },
  {
    name: "Private publishing note",
    pattern:
      /\b(?:confidential|do not publish|internal only|not for public|private notes?)\b/gi
  }
];

const publicContentChecks = [
  {
    name: "Email address in public content",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
  },
  {
    name: "US phone-like number in public content",
    pattern: /\b(?:\+?1[-.\s]?)?(?:\(\d{3}\)|\d{3})[-.\s]\d{3}[-.\s]\d{4}\b/g
  },
  {
    name: "SSN-like number in public content",
    pattern: /\b\d{3}-\d{2}-\d{4}\b/g
  }
];

const findings = [];
let checkedFiles = 0;

const files = await walk(root);

for (const filePath of files) {
  const relativePath = toRelativePath(filePath);
  const fileName = path.basename(relativePath);

  for (const check of fileNameChecks) {
    if (check.pattern.test(fileName)) {
      findings.push({
        file: relativePath,
        reason: check.name
      });
    }
  }

  for (const segment of relativePath.split("/")) {
    if (pathSegmentChecks.some((pattern) => pattern.test(segment))) {
      findings.push({
        file: relativePath,
        reason: `Risky path segment: ${segment}`
      });
    }
  }

  if (!shouldReadAsText(relativePath)) {
    continue;
  }

  const content = await readFile(filePath, "utf8");
  checkedFiles += 1;
  scanContent(relativePath, content, contentChecks);

  if (isPublicContent(relativePath)) {
    scanContent(relativePath, content, publicContentChecks);
  }
}

if (findings.length > 0) {
  console.error("Public safety scan failed.");
  for (const finding of findings) {
    const line = finding.line ? `:${finding.line}` : "";
    console.error(`- ${finding.file}${line} - ${finding.reason}`);
  }
  process.exit(1);
}

console.log(`Public safety scan passed. Text files checked: ${checkedFiles}.`);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    const relativePath = toRelativePath(fullPath);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        results.push(...(await walk(fullPath)));
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (ignoredFiles.has(relativePath)) {
      continue;
    }

    const fileStat = await stat(fullPath);
    if (fileStat.size > 1024 * 1024) {
      continue;
    }

    results.push(fullPath);
  }

  return results;
}

function scanContent(relativePath, content, checks) {
  for (const check of checks) {
    check.pattern.lastIndex = 0;

    for (const match of content.matchAll(check.pattern)) {
      findings.push({
        file: relativePath,
        line: getLineNumber(content, match.index ?? 0),
        reason: check.name
      });
    }
  }
}

function shouldReadAsText(relativePath) {
  const extension = path.extname(relativePath).toLowerCase();
  return textExtensions.has(extension) || path.basename(relativePath) === ".env.example";
}

function isPublicContent(relativePath) {
  const [firstSegment] = relativePath.split("/");
  return publicContentRoots.has(firstSegment);
}

function getLineNumber(content, index) {
  return content.slice(0, index).split(/\r?\n/).length;
}

function toRelativePath(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}
