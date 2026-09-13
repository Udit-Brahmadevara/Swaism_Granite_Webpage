#!/usr/bin/env node
/**
 * Project self-check. No dependencies — `npm run check` (node tools/check.mjs).
 *
 * Inspects public/, the publish directory, and fails on the regressions that are
 * easy to introduce and invisible until someone opens the deployed page:
 *   1. class names used in markup or templates that no stylesheet defines
 *   2. internal links and asset paths that do not resolve
 *   3. URLs written in a form the host breaks: relative paths (they fail when
 *      404.html is served at a nested URL) and links to *.html (Cloudflare
 *      redirects them, and a service worker must never cache a redirect)
 *   4. inline style attributes — the CSP (style-src 'self') strips them
 *   5. <head> blocks drifting apart between pages
 *   6. third-party subresources and embeds
 *   7. deploy files (robots, sitemap, 404, favicon) out of step with the pages
 *   8. photographs missing their WebP twin or grid-size copy
 *   9. images named by the content model that are missing
 *  10. a service-worker cache stamp that no longer matches the files it caches
 *  11. a CSP that allows inline script
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteVersion } from './bump-sw.mjs';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const read = p => readFileSync(join(SITE, p), 'utf8');
const walk = (dir, out = []) => {
  for (const e of readdirSync(join(SITE, dir))) {
    const rel = `${dir}/${e}`;
    statSync(join(SITE, rel)).isDirectory() ? walk(rel, out) : out.push(rel);
  }
  return out;
};
const isFile = f => existsSync(f) && statSync(f).isFile();

const pages   = readdirSync(SITE).filter(f => f.endsWith('.html'));
const js      = walk('assets/js').filter(f => f.endsWith('.js'));
const css     = read('assets/css/site.css');
const sources = [...pages.map(p => [p, read(p)]), ...js.map(f => [f, read(f)])];

const problems = [];
const fail = (kind, detail) => problems.push(`${kind}: ${detail}`);

/** A root-absolute path resolves the way the host resolves it: /about -> about.html. */
const resolves = path => {
  if (path === '/') return true;
  const f = join(SITE, decodeURIComponent(path));
  return [f, `${f}.html`, join(f, 'index.html')].some(isFile);
};

/* 1 — every class used must be defined ---------------------------------- */
const defined = new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map(m => m[1]));
const used = new Map();
for (const [where, src] of sources)
  for (const m of src.matchAll(/class="([^"$]*)"/g))
    for (const c of m[1].split(/\s+/).filter(Boolean))
      if (!c.includes('{')) used.set(c, where);
for (const [cls, where] of used)
  if (!defined.has(cls)) fail('undefined class', `.${cls} (used in ${where})`);

/* 2 + 3 — internal URLs resolve, and are written the way the host serves them */
for (const [where, src] of sources) {
  for (const [, raw] of src.matchAll(/\b(?:href|src|srcset)="([^"]*)"/g)) {
    if (/^(https?:|mailto:|tel:|data:|#)/.test(raw)) continue;
    // Templates: check the static part only when the dynamic part is the #hash.
    const head = raw.split('${')[0];
    const cut = head.search(/[#?]/);
    if (raw.includes('${') && cut < 0) continue;
    const path = cut >= 0 ? head.slice(0, cut) : head;
    if (!path.startsWith('/')) {
      fail('relative url', `"${raw}" in ${where} — write it root-absolute; relative `
        + `paths break when 404.html is served at a nested URL`);
    } else if (path.endsWith('.html')) {
      fail('.html link', `"${raw}" in ${where} — link to ${path.replace(/(index)?\.html$/, '') || '/'}; `
        + `Cloudflare redirects *.html`);
    } else if (!resolves(path)) {
      fail('broken path', `${path} (in ${where})`);
    }
  }
}
for (const f of js) {
  const src = read(f);
  if (/["'`(]assets\//.test(src)) fail('relative url', `${f} has a relative "assets/…" path — write it root-absolute`);
  const html = src.match(/["'`]\/?[\w-]+\.html\b/);
  if (html) fail('.html link', `${html[0]} in ${f} — use the extensionless path`);
}

/* 4 — no inline styles, in markup or in templates -------------------------- */
for (const [where, src] of sources) {
  const n = (src.match(/\sstyle="/g) || []).length;
  if (n) fail('inline style', `${n} in ${where} — the CSP (style-src 'self') strips these; use a class in site.css`);
}

/* 5 — page <head> blocks must stay in sync ------------------------------- */
// canonical and og:* are per-page by definition; preloads follow each page's
// own module graph.
const headSig = src => (src.match(/<link[^>]*>/g) || [])
  .filter(l => !/canonical|og:|modulepreload|as="image"/.test(l)).join('\n');
const [first, ...rest] = pages;
const baseline = headSig(read(first));
for (const p of rest)
  if (headSig(read(p)) !== baseline)
    fail('head drift', `${p} differs from ${first} — regenerate with npm run pages`);

/* 6 — no third-party SUBRESOURCES in shipped markup -----------------------
   A navigational <a href> to another site costs nothing until it is clicked;
   what must stay out is anything the browser fetches to render the page —
   src=, and href= on <link>. Those are the requests that add a DNS + TLS
   handshake before first paint on a slow connection. */
for (const p of pages) {
  const html = read(p);
  for (const m of html.matchAll(/<(\w+)\b([^>]*?)\b(src|href)="(https?:\/\/[^"]+)"/g)) {
    const [, tag, attrs, attr, url] = m;
    if (tag.toLowerCase() === 'a' && attr === 'href') continue;   // navigation is fine
    // <link rel=canonical|alternate> is metadata, not something the browser fetches
    if (tag.toLowerCase() === 'link' && /rel="(canonical|alternate)"/.test(attrs)) continue;
    fail('third-party subresource', `${new URL(url).host} in ${p} (<${tag} ${attr}>) — `
      + `costs a DNS + TLS handshake before first paint on a slow link`);
  }
  if (/<iframe/.test(html)) {
    fail('embedded frame', `${p} — an embed sets third-party cookies on load, `
      + `which is what obliges a site to carry a consent banner`);
  }
}

/* 7 — the deploy-facing files must exist and agree with the pages ---------- */
for (const f of ['robots.txt', 'sitemap.xml', '404.html', 'privacy.html', '_headers', 'sw.js', 'favicon.ico']) {
  if (!existsSync(join(SITE, f))) fail('missing file', `public/${f}`);
}
if (existsSync(join(SITE, 'sitemap.xml'))) {
  const listed = new Set([...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(m => new URL(m[1]).pathname));         // compare paths, not full URLs
  for (const p of pages) {
    const path = p === 'index.html' ? '/' : `/${p.replace(/\.html$/, '')}`;
    if (p === '404.html') {
      if (listed.has(path)) fail('sitemap', '404 must not be offered to crawlers');
    } else if (!listed.has(path)) {
      fail('sitemap', `${path} is not listed — regenerate with npm run pages`);
    }
  }
  for (const path of listed) {
    if (path.endsWith('.html')) fail('sitemap', `${path} ends in .html — Cloudflare redirects it`);
    else if (!resolves(path)) fail('sitemap', `${path} is listed but does not exist`);
  }
}
for (const p of pages) {
  const html = read(p);
  const canon = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
  if (!canon) fail('missing canonical', p);
  else if (canon.endsWith('.html')) fail('canonical', `${p} — ${canon} is a URL Cloudflare redirects`);
  if (!/property="og:image"/.test(html)) fail('missing og:image', p);
  const rel = html.match(/property="og:image" content="(?!https?:)([^"]*)"/);
  if (rel) fail('relative og:image', `${p} — "${rel[1]}" will render a blank share card`);
}

/* 8 — every photograph must have a WebP twin and a grid-size copy ---------- */
for (const dir of ['assets/granite', 'assets/monuments', 'assets/facility', 'assets/hero'].filter(d => existsSync(join(SITE, d)))) {
  for (const f of readdirSync(join(SITE, dir)).filter(f => f.endsWith('.jpg'))) {
    const stem = f.replace(/\.jpg$/, '');
    if (!existsSync(join(SITE, dir, `${stem}.webp`)))
      fail('missing webp', `${dir}/${stem}.webp — run npm run images`);
    if (!existsSync(join(SITE, dir, 'thumbs', f)))
      fail('missing thumbnail', `${dir}/thumbs/${f} — run npm run images`);
  }
}

/* 9 — images named by the content model must exist ------------------------ */
// strip comments first: doc blocks contain illustrative paths that do not exist
const data = read('assets/js/data.js')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');
for (const m of data.matchAll(/'(\/assets\/[^']+\.(?:jpg|png|jpeg))'/g))
  if (!resolves(m[1])) fail('missing asset', `${m[1]} (referenced in data.js)`);

/* 10 — the service worker's cache name must match what it caches ----------- */
const stamped = read('sw.js').match(/const CACHE = '([^']+)'/)?.[1];
const expected = `swasim-${siteVersion()}`;
if (stamped !== expected)
  fail('stale service worker', `sw.js is stamped ${stamped}, the files hash to ${expected} — `
    + `run npm run bump, or returning visitors keep serving the old files`);

/* 11 — the CSP must not allow inline script -------------------------------- */
const csp = read('_headers').match(/Content-Security-Policy:\s*(.+)/)?.[1] || '';
if (!csp) fail('csp', '_headers sets no Content-Security-Policy');
else if (/script-src[^;]*'unsafe-inline'/.test(csp))
  fail('csp', `script-src allows 'unsafe-inline' — nothing needs it (JSON-LD is data, not script)`);

/* ------------------------------------------------------------------------ */
const counts = `${pages.length} pages, ${js.length} modules, ${used.size} classes`;
if (problems.length) {
  console.error(`✗ ${problems.length} problem(s)\n`);
  problems.forEach(p => console.error('  ' + p));
  console.error(`\nchecked ${counts}`);
  process.exit(1);
}
console.log(`✓ all checks passed — ${counts}`);
