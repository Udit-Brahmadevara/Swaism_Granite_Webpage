#!/usr/bin/env node
/**
 * Stamp the service worker's cache name with a hash of what it caches.
 *
 * The worker keeps photographs, fonts and the map cache-first, and serves pages,
 * CSS and JS stale-while-revalidate. A new cache name is what makes an installed
 * worker drop all of that and start again, so the name has to change whenever
 * any of those files do — and only then.
 *
 * `npm run build|pages|images|map` all run this. tools/check.mjs imports
 * siteVersion() and fails if sw.js carries a stale stamp, so a hand edit to the
 * CSS cannot ship without it.
 *
 * sw.js itself is not hashed (it holds the stamp). It does not need to be: the
 * browser re-installs the worker whenever sw.js changes by a single byte.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

export function siteVersion() {
  const hash = createHash('sha256');
  const walk = dir => {
    for (const e of readdirSync(join(SITE, dir)).sort()) {
      const rel = `${dir}/${e}`;
      const full = join(SITE, rel);
      if (statSync(full).isDirectory()) walk(rel);
      // Code is hashed by content, so an edit that keeps the byte count still
      // rolls the cache. Photographs go by name + size, which notices a rebuild
      // without reading ~25MB on every run.
      else if (/\.(css|js|svg)$/.test(e)) hash.update(`${rel}:`).update(readFileSync(full));
      else hash.update(`${rel}:${statSync(full).size}`);
    }
  };
  walk('assets');
  for (const f of readdirSync(SITE).filter(f => f.endsWith('.html')).sort())
    hash.update(`${f}:`).update(readFileSync(join(SITE, f)));
  return hash.digest('hex').slice(0, 8);
}

if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  const swPath = join(SITE, 'sw.js');
  const sw = readFileSync(swPath, 'utf8');
  const current = sw.match(/const CACHE = '([^']+)'/)?.[1];
  const next = `swasim-${siteVersion()}`;
  if (current === next) {
    console.log(`service worker cache unchanged (${current})`);
  } else {
    writeFileSync(swPath, sw.replace(/const CACHE = '[^']+'/, `const CACHE = '${next}'`));
    console.log(`service worker cache ${current} -> ${next}`);
  }
}
