import { globSync as nativeGlobSync } from "node:fs";
import { isAbsolute, resolve, relative } from "node:path";

// Scoped to Next 15's getRootDirs: support its exact globSync(pattern, options)
// contract using Node's glob implementation instead of the vulnerable braces chain.
export function globSync(pattern, options) {
  if (typeof pattern !== "string" || options?.onlyDirectories !== true ||
      Object.keys(options).some(key => key !== "onlyDirectories")) {
    throw new TypeError("Unsupported Next root directory glob contract");
  }
  const absolute = isAbsolute(pattern);
  return nativeGlobSync(pattern, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => {
      const path = resolve(entry.parentPath, entry.name);
      return (absolute ? path : relative(process.cwd(), path)).replaceAll("\\", "/");
    });
}
