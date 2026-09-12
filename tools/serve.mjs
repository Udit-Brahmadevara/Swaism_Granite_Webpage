#!/usr/bin/env node
/**
 * Local server that behaves like the production host (Cloudflare Pages).
 *
 *     npm run serve                      # http://127.0.0.1:4173
 *     node tools/serve.mjs 8080 --no-pretty
 *
 * python's http.server hid three production-only bugs, so this mirrors the host
 * instead of a folder:
 *   - applies public/_headers (CSP, caching, HSTS), so a CSP violation shows up
 *     here rather than first on the live site
 *   - redirects /page.html -> /page and serves /page from page.html, exactly as
 *     Cloudflare Pages does. --no-pretty turns that off (Netlify-style hosting).
 *   - answers any missing path, however deep, with 404.html and a 404 status
 *
 * No dependencies. Not a production server: no compression, no range requests.
 */
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const args = process.argv.slice(2);
const PORT = Number(args.find(a => /^\d+$/.test(a)) || 4173);
const PRETTY = !args.includes('--no-pretty');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.json': 'application/json',
};

/* _headers: an unindented line is a path pattern (`*` is a wildcard); the
   indented lines under it are headers. Every matching block applies. */
const rules = [];
let block = null;
for (const raw of readFileSync(join(SITE, '_headers'), 'utf8').split('\n')) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  if (!/^\s/.test(raw)) {
    const pattern = line.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    rules.push(block = { re: new RegExp(`^${pattern}$`), headers: [] });
  } else if (block) {
    const i = line.indexOf(':');
    block.headers.push([line.slice(0, i).trim(), line.slice(i + 1).trim()]);
  }
}
const headersFor = path => {
  const out = {};
  for (const r of rules) if (r.re.test(path)) for (const [k, v] of r.headers) out[k] = v;
  return out;
};

const isFile = f => existsSync(f) && statSync(f).isFile();

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const path = decodeURIComponent(url.pathname);

  const send = (status, file, extra = {}) => {
    res.writeHead(status, {
      ...headersFor(path),
      'Content-Type': file ? (TYPES[extname(file)] || 'application/octet-stream') : 'text/plain',
      ...extra,
    });
    res.end(file && req.method !== 'HEAD' ? readFileSync(file) : undefined);
  };

  if (PRETTY && path.endsWith('.html')) {
    const target = path.endsWith('/index.html') ? path.slice(0, -'index.html'.length) : path.slice(0, -5);
    return send(308, null, { Location: (target || '/') + url.search });
  }

  let file = join(SITE, normalize(path));
  if (!file.startsWith(SITE)) return send(404, join(SITE, '404.html'));
  if (path.endsWith('/')) file = join(file, 'index.html');
  if (!isFile(file) && isFile(file + '.html')) file += '.html';
  if (isFile(file)) return send(200, file);
  return send(404, join(SITE, '404.html'));
}).listen(PORT, '127.0.0.1', () =>
  console.log(`Serving public/ at http://127.0.0.1:${PORT}  (${PRETTY ? 'Cloudflare-style URLs' : 'plain URLs'}, _headers applied)`));
