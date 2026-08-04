import assert from "node:assert/strict";
import { readdir, readFile, stat } from "node:fs/promises";
import { extname, join } from "node:path";

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }));
  return nested.flat();
}

const publicFiles = await filesUnder("public");
const publicBytes = (await Promise.all(publicFiles.map(async (file) => (await stat(file)).size)))
  .reduce((total, size) => total + size, 0);
assert.ok(publicBytes < 5 * 1024 * 1024, `public exceeds 5 MB: ${publicBytes} bytes`);

const faviconBytes = (await stat("public/images/favicon-icone.png")).size;
assert.ok(faviconBytes < 100 * 1024, `favicon exceeds 100 KB: ${faviconBytes} bytes`);

const sourceFiles = (await filesUnder("src")).filter((file) => [".ts", ".tsx", ".css"].includes(extname(file)));
const source = (await Promise.all(sourceFiles.map((file) => readFile(file, "utf8")))).join("\n");
assert.doesNotMatch(source, /fonts\.googleapis\.com/);
assert.doesNotMatch(source, /(?:brain-3d\.png|foto-marilia-jaleco\.jpeg|logo-vertical\.png|Texto [1-6]\.png)/);

for (const match of source.matchAll(/<img\b[\s\S]*?\/>/g)) {
  assert.match(match[0], /\bwidth=/, `image without width: ${match[0].slice(0, 100)}`);
  assert.match(match[0], /\bheight=/, `image without height: ${match[0].slice(0, 100)}`);
}

console.log(`Performance assets verified: ${(publicBytes / 1024 / 1024).toFixed(2)} MB in public.`);
