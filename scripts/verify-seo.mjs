import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const siteUrl = "https://neuropsiedu.com.br";

async function readOutput(path) {
  return readFile(join("out", path), "utf8");
}

function verifyMetadata(html, canonical) {
  assert.match(html, new RegExp(`<link rel="canonical" href="${canonical}"`));
  assert.match(html, new RegExp(`<meta property="og:url" content="${canonical}"`));
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"/);
  assert.match(html, /<meta property="og:image" content="https:\/\/neuropsiedu\.com\.br\//);
}

const expectedPages = new Map([
  ["index.html", `${siteUrl}/`],
  ["blog/index.html", `${siteUrl}/blog/`],
  ["fnp/index.html", `${siteUrl}/fnp/`],
  ["formacao-manuseio-arma/index.html", `${siteUrl}/formacao-manuseio-arma/`],
]);

for (const [file, canonical] of expectedPages) {
  verifyMetadata(await readOutput(file), canonical);
}

const blogDirectories = await readdir(join("out", "blog"), { withFileTypes: true });
for (const directory of blogDirectories.filter((entry) => entry.isDirectory())) {
  const canonical = `${siteUrl}/blog/${directory.name}/`;
  verifyMetadata(await readOutput(join("blog", directory.name, "index.html")), canonical);
}

for (const alias of ["famaf", "formacao-manuseio"]) {
  const html = await readOutput(join(alias, "index.html"));
  assert.match(html, /<meta name="robots" content="noindex, follow"/);
  verifyMetadata(html, `${siteUrl}/formacao-manuseio-arma/`);
}

const sitemap = await readOutput("sitemap.xml");
assert.match(sitemap, /<loc>https:\/\/neuropsiedu\.com\.br\/formacao-manuseio-arma\/<\/loc>/);
assert.doesNotMatch(sitemap, /<loc>[^<]+\/(?:famaf|formacao-manuseio)\/<\/loc>/);

const robots = await readOutput("robots.txt");
assert.match(robots, /Sitemap: https:\/\/neuropsiedu\.com\.br\/sitemap\.xml/);

const htaccess = await readOutput(".htaccess");
assert.match(htaccess, /RewriteRule \^\(\?:famaf\|formacao-manuseio\)\/\?\$ \/formacao-manuseio-arma\/ \[R=301,L,NE\]/);

const home = await readOutput("index.html");
assert.match(home, /"@type":\["MedicalClinic","LocalBusiness"\]/);
assert.match(home, /"@type":"WebSite"/);

console.log("SEO static artifact verified.");
