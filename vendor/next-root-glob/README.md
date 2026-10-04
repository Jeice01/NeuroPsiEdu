# Next root directory glob adapter

This private package replaces only `fast-glob` under `@next/eslint-plugin-next`
through the root manifest's scoped npm override. It removes the vulnerable
`fast-glob → micromatch → braces` dependency chain (GHSA-vfj7-8cjw-p6xm).
The dependency audit and Next lint rules remain enabled.

Next 15.5.27 uses only `globSync(pattern, { onlyDirectories: true })` in
`dist/utils/get-root-dirs.js`. The adapter implements that exact contract with
Node's built-in `fs.globSync`, preserves absolute versus relative paths, and
rejects unsupported options. It is not a general replacement for fast-glob.

The project already requires Node 24.18.1 or newer within major 24. That runtime
supports native glob and synchronous CommonJS loading of this ESM module.
No external dependency is added to this adapter.

`tests/next-eslint-glob.test.mjs` checks directory discovery, brace patterns,
multiple roots, missing roots, and an actual Next internal-link rule violation.
Recheck this contract when upgrading Next. Remove the override if upstream
stops depending on the vulnerable library and its replacement passes the tests.

References:

- https://nodejs.org/api/fs.html#fsglobsyncpattern-options
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides
- https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
