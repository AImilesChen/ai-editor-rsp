#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

const helper = read("src/lib/utils/metadata.ts");
assert.match(helper, /title:\s*\{\s*absolute:\s*fullTitle\s*\}/, "createMetadata titles must bypass the root title template");
assert.match(helper, /\?\s*\{\s*index:\s*false,\s*follow:\s*true\s*\}/, "noindex utility pages must remain followable");

for (const page of ["waitlist", "suggest-prompt"]) {
  const source = read(`src/app/${page}/page.tsx`);
  assert.match(source, /noindex:\s*true/, `/${page} must be noindex`);
}

const sitemap = read("src/app/sitemap.ts");
assert.doesNotMatch(sitemap, /BASE_URL\}\/waitlist/, "/waitlist must not be in sitemap");
assert.doesNotMatch(sitemap, /BASE_URL\}\/suggest-prompt/, "/suggest-prompt must not be in sitemap");

const requiredOgPages = [
  "generate",
  "reference-edit",
  "pricing",
  "ai-policy",
  "content-policy",
  "ai-models",
  "image-editor",
  "ai-headshot-generator",
];
for (const page of requiredOgPages) {
  const source = read(`src/app/${page}/page.tsx`);
  assert.match(source, /openGraph:\s*\{/, `/${page} must define page-specific Open Graph metadata`);
  assert.match(source, /url:\s*`\$\{SITE_URL\}\//, `/${page} must define a self Open Graph URL`);
  assert.match(source, /images:\s*\[/, `/${page} must define an Open Graph image`);
}

const prompts = read("src/app/prompts/[[...slug]]/page.tsx");
assert.match(prompts, /url:\s*`\$\{site\.url\}\/prompts`[\s\S]*?images:\s*\[/, "/prompts must define an Open Graph image");

const llms = read("public/llms.txt");
for (const marker of ["# AI Editor RSP", "https://aieditorrspediting.org/image-editor", "https://aieditorrspediting.org/pricing"]) {
  assert.ok(llms.includes(marker), `llms.txt missing ${marker}`);
}

const appRoot = path.join(root, "src/app");
for (const entry of fs.readdirSync(appRoot, { recursive: true })) {
  if (!entry.endsWith("page.tsx") || entry === "page.tsx") continue;
  const source = fs.readFileSync(path.join(appRoot, entry), "utf8");
  const metadata = source.match(/export const metadata[^=]*=\s*\{([\s\S]*?)\n\};/)?.[1];
  if (!metadata) continue;
  const topLevelTitle = metadata.match(/^\s{2}title:\s*([^\n]+)$/m)?.[1] ?? "";
  if (topLevelTitle.includes("AI Editor RSP") && !topLevelTitle.includes("absolute")) {
    assert.fail(`${entry} has a branded child title that will be duplicated by the root template; use title.absolute`);
  }
}

console.log("SEO metadata regression checks passed");
