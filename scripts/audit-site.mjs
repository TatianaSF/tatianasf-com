#!/usr/bin/env node

const DEFAULT_URLS = [
  "https://tatianasf.com/",
  "https://tatianasf.com/robots.txt",
  "https://tatianasf.com/sitemap_index.xml"
];

const urls = process.argv.slice(2);
const startUrls = urls.length > 0 ? urls : DEFAULT_URLS;
const seen = new Set();
const queue = [...startUrls];
const results = [];

while (queue.length > 0) {
  const url = queue.shift();
  if (!url || seen.has(url)) {
    continue;
  }

  seen.add(url);
  const result = await fetchUrl(url);
  results.push(result);

  if (result.contentType.includes("xml")) {
    for (const loc of extractXmlLocs(result.body)) {
      if (isSameSite(loc) && !seen.has(loc)) {
        queue.push(loc);
      }
    }
  }

  if (result.contentType.includes("html")) {
    const page = extractPage(result.body, result.finalUrl);
    Object.assign(result, page);

    for (const link of page.links) {
      const cleanUrl = link.href.split("#")[0];
      if (isSameSite(cleanUrl) && !seen.has(cleanUrl)) {
        queue.push(cleanUrl);
      }
    }
  }
}

const printableResults = results.map((result) => {
  const output = { ...result };
  delete output.body;
  return output;
});

console.log(JSON.stringify(printableResults, null, 2));

async function fetchUrl(url) {
  try {
    const response = await fetch(url, { redirect: "follow" });
    return {
      requestedUrl: url,
      finalUrl: response.url,
      status: response.status,
      contentType: response.headers.get("content-type") ?? "",
      body: await response.text()
    };
  } catch (error) {
    return {
      requestedUrl: url,
      finalUrl: url,
      status: 0,
      contentType: "",
      error: error instanceof Error ? error.message : "Unknown fetch error",
      body: ""
    };
  }
}

function extractPage(html, baseUrl) {
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? "";
  const body = html.match(/<body[\s\S]*?<\/body>/i)?.[0] ?? html;
  const meta = {};

  for (const match of head.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    const key = getAttribute(tag, "name") || getAttribute(tag, "property");
    const content = getAttribute(tag, "content");
    if (key) {
      meta[key] = content;
    }
  }

  return {
    title: stripTags(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    canonical:
      [...head.matchAll(/<link\b[^>]*>/gi)]
        .map((match) => match[0])
        .filter((tag) => /rel\s*=\s*["'][^"']*canonical/i.test(tag))
        .map((tag) => toAbsoluteUrl(getAttribute(tag, "href"), baseUrl))[0] ?? "",
    meta,
    headings: [...body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
      .map((match) => ({
        level: `h${match[1]}`,
        text: stripTags(match[2])
      }))
      .filter((heading) => heading.text),
    links: [...body.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)]
      .map((match) => {
        const href = getAttribute(match[0], "href");
        return {
          text: stripTags(match[0]),
          href: href ? toAbsoluteUrl(href, baseUrl) : ""
        };
      })
      .filter((link) => link.href && !link.href.startsWith("javascript:")),
    images: [...html.matchAll(/<img\b[^>]*>/gi)]
      .map((match) => {
        const src = getAttribute(match[0], "src") || getAttribute(match[0], "data-src");
        return {
          src: src ? toAbsoluteUrl(src, baseUrl) : "",
          alt: getAttribute(match[0], "alt"),
          width: getAttribute(match[0], "width"),
          height: getAttribute(match[0], "height")
        };
      })
      .filter((image) => image.src),
    scripts: [...html.matchAll(/<script\b[^>]*>/gi)]
      .map((match) => getAttribute(match[0], "src"))
      .filter(Boolean)
      .map((src) => toAbsoluteUrl(src, baseUrl))
  };
}

function extractXmlLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decodeHtml(match[1]));
}

function getAttribute(tag, name) {
  const match = tag.match(
    new RegExp(`${name}\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+)`, "i")
  );
  return decodeHtml((match?.[1] ?? "").replace(/^["']|["']$/g, ""));
}

function stripTags(html) {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function decodeHtml(value) {
  return value
    .replace(/&#(\d+);/g, (_, number) => String.fromCharCode(Number(number)))
    .replace(/&#x([0-9a-f]+);/gi, (_, number) =>
      String.fromCharCode(Number.parseInt(number, 16))
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function toAbsoluteUrl(href, baseUrl) {
  try {
    return new URL(decodeHtml(href), baseUrl).href;
  } catch {
    return href;
  }
}

function isSameSite(url) {
  try {
    return new URL(url).hostname === "tatianasf.com";
  } catch {
    return false;
  }
}
