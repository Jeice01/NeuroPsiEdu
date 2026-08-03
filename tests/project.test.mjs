import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

test("the production build is configured as a static export", async () => {
  const source = await readFile("next.config.js", "utf8");

  assert.match(source, /output:\s*["']export["']/);
  assert.match(source, /trailingSlash:\s*true/);
  assert.match(source, /unoptimized:\s*true/);
});

test("the lockfile matches the package manifest", async () => {
  const packageJson = await readJson("package.json");
  const lockfile = await readJson("package-lock.json");

  assert.equal(lockfile.name, packageJson.name);
  assert.equal(lockfile.packages[""].version, packageJson.version);
  assert.deepEqual(lockfile.packages[""].dependencies, packageJson.dependencies);
  assert.deepEqual(
    lockfile.packages[""].devDependencies,
    packageJson.devDependencies,
  );
});

test("administrative Supabase credentials are absent from public source", async () => {
  const publicClient = await readFile("src/lib/supabase.ts", "utf8");
  const workflow = await readFile(".github/workflows/ci.yml", "utf8");

  assert.doesNotMatch(publicClient, /service[_-]?role/i);
  assert.doesNotMatch(workflow, /service[_-]?role/i);
  assert.doesNotMatch(workflow, /SUPABASE_SERVICE_ROLE_KEY/);
});

test("the Hostinger workflow deploys the approved artifact without embedded credentials", async () => {
  const workflow = await readFile(
    ".github/workflows/deploy-hostinger.yml",
    "utf8",
  );

  assert.match(workflow, /workflow_run:/);
  assert.match(workflow, /actions\/download-artifact@v7/);
  assert.match(workflow, /HEAD:deploy/);
  assert.match(workflow, /secrets\.HOSTINGER_DEPLOY_WEBHOOK/);
  assert.match(workflow, /deploy\.json/);
  assert.doesNotMatch(workflow, /service[_-]?role/i);
  assert.doesNotMatch(workflow, /https:\/\/.*hostinger.*webhook/i);
});
