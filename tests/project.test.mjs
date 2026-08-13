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
  const ciWorkflow = await readFile(".github/workflows/ci.yml", "utf8");
  const workflow = await readFile(
    ".github/workflows/deploy-hostinger.yml",
    "utf8",
  );

  assert.match(workflow, /workflow_run:/);
  assert.match(workflow, /actions\/download-artifact@v7/);
  assert.match(workflow, /HEAD:deploy/);
  assert.match(workflow, /secrets\.HOSTINGER_DEPLOY_WEBHOOK/);
  assert.match(workflow, /X-GitHub-Event: push/);
  assert.match(workflow, /hostinger-push\.json/);
  assert.match(workflow, /deploy\.json/);
  assert.match(workflow, /Wait for published version[\s\S]*--ipv4/);
  assert.match(workflow, /Wait for published version[\s\S]*--connect-timeout 4/);
  assert.match(workflow, /Wait for published version[\s\S]*--max-time 8/);
  assert.match(workflow, /Attempt \$\{attempt\}\/30/);
  assert.match(workflow, /reachable_attempts=0/);
  assert.match(workflow, /HOSTINGER_VERIFIED=false/);
  assert.match(workflow, /Hostinger was unreachable from the GitHub runner/);
  assert.match(workflow, /endpoint responded, but the expected version was not observed/);
  assert.match(workflow, /if: env\.HOSTINGER_VERIFIED == 'true'/);
  assert.match(ciWorkflow, /include-hidden-files:\s*true/);
  assert.match(ciWorkflow, /test -f out\/\.htaccess/);
  assert.match(workflow, /test -f out\/\.htaccess/);
  assert.doesNotMatch(workflow, /service[_-]?role/i);
  assert.doesNotMatch(workflow, /https:\/\/.*hostinger.*webhook/i);
});

test("the Supabase workflow gates production and never exposes administrative API keys", async () => {
  const workflow = await readFile(
    ".github/workflows/deploy-supabase.yml",
    "utf8",
  );

  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /name: supabase-\$\{\{ inputs\.target \}\}/);
  assert.match(workflow, /supabase db push --linked --dry-run/);
  assert.match(workflow, /functions deploy create-lead-formacao/);
  assert.match(workflow, /Smoke test deployed function/);
  assert.match(workflow, /deno check --node-modules-dir=auto/);
  assert.doesNotMatch(workflow, /environment:\s*[\s\S]{0,150}url:.*secrets\./);
  assert.doesNotMatch(workflow, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(workflow, /--prune/);
});

test("active lead forms use the shared submission infrastructure", async () => {
  const forms = await Promise.all([
    readFile("src/components/fnp/FnpLeadModal.tsx", "utf8"),
    readFile("src/components/manuseio-arma/ManuseioArmaLeadModal.tsx", "utf8"),
    readFile("src/components/sections/CoursesSection.tsx", "utf8"),
  ]);
  const client = await readFile("src/lib/lead-form-client.ts", "utf8");

  for (const source of forms) {
    assert.match(source, /useLeadSubmission/);
    assert.match(source, /pushLeadEvent/);
    assert.doesNotMatch(source, /supabase\.co\/functions\/v1/);
    assert.doesNotMatch(source, /dataLayer\.push/);
    assert.doesNotMatch(source, /await fetch\(/);
  }
  assert.match(client, /create-lead-formacao/);
  assert.match(client, /parseLeadResponse/);
});
