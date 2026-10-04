import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { ESLint } from 'eslint';

const require = createRequire(import.meta.url);
const plugin = require('@next/eslint-plugin-next');
const { getRootDirs } = require('@next/eslint-plugin-next/dist/utils/get-root-dirs');

test('Next root discovery preserves directory patterns with the secure glob replacement', async () => {
  const root = await mkdtemp(join(tmpdir(), 'neuropsiedu-eslint-'));
  try {
    for (const name of ['alpha', 'beta']) await mkdir(join(root, name));
    await writeFile(join(root, 'file.txt'), 'synthetic fixture');
    const discover = pattern => getRootDirs({ cwd: root, settings: { next: { rootDir: pattern } } })
      .map(path => resolve(path)).sort();
    const normalized = root.replaceAll('\\', '/');
    assert.deepEqual(discover(`${normalized}/*`), [join(root, 'alpha'), join(root, 'beta')].sort());
    assert.deepEqual(discover(`${normalized}/{alpha,beta}`), [join(root, 'alpha'), join(root, 'beta')].sort());
    assert.deepEqual(discover([`${normalized}/alpha`, `${normalized}/beta`]), [join(root, 'alpha'), join(root, 'beta')].sort());
    assert.deepEqual(discover(`${normalized}/missing`), []);
    assert.deepEqual(getRootDirs({ cwd: root, settings: {} }), [root]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('Next still detects an internal HTML link after root discovery', async () => {
  const root = await mkdtemp(join(tmpdir(), 'neuropsiedu-next-rule-'));
  try {
    await mkdir(join(root, 'pages'));
    await writeFile(join(root, 'pages', 'index.js'), 'export default function Home() {}');
    const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: [{
      files: ['**/*.jsx'],
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      plugins: { '@next/next': plugin },
      settings: { next: { rootDir: root } },
      rules: { '@next/next/no-html-link-for-pages': 'error' },
    }] });
    const [result] = await eslint.lintText('export default function View() { return <a href="/">Home</a>; }', { filePath: 'glob-fixture.jsx' });
    assert.ok(result.messages.some(message => message.ruleId === '@next/next/no-html-link-for-pages'));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
