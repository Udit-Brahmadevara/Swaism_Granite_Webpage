#!/usr/bin/env node
/**
 * Launch smoke test. No dependencies — start the site, then:
 *
 *     npm run serve          # in one terminal
 *     npm run verify         # in another
 *
 * Where tools/check.mjs inspects files on disk, this asks the running server
 * for what a browser would fetch, and asserts the launch-facing things: every
 * page resolves at its real URL, the deploy files are well-formed, every page
 * carries a canonical and a working share card, a deep 404 still loads its
 * styles, nothing third-party has crept back in, the form keeps its spam trap,
 * and the security headers are served.
 *
 * tools/serve.mjs applies public/_headers, so the header checks are meaningful
 * locally too. Once the site is live, run the same checks against it:
 *
 *     node tools/verify.mjs --url https://www.swasimgranite.com
 */
const argUrl = process.argv.indexOf('--url');
const BASE = (argUrl > -1 ? process.argv[argUrl + 1] : 'http://127.0.0.1:4173').replace(/\/$/, '');

const PAGES = ['index', 'about', 'catalogue', 'what-we-do', 'articles',
               'brochure', 'testimonials', 'contact', 'privacy'];
const urlOf = p => (p === 'index' ? '/' : `/${p}`);

let pass = 0;
const fails = [];
const ok   = m => { pass++; console.log(`  \x1b[32m✓\x1b[0m ${m}`); };
const bad  = m => { fails.push(m); console.log(`  \x1b[31m✗\x1b[0m ${m}`); };
const note = m => console.log(`  \x1b[33m!\x1b[0m ${m}`);
const test = (cond, good, why) => cond ? ok(good) : bad(why);

const get = async (path, opts = {}) => {
  try {
    const res = await fetch(path.startsWith('http') ? path : `${BASE}${path}`, opts);
    return { status: res.status, body: await res.text(), headers: res.headers };
  } catch (e) {
    return { status: 0, body: '', headers: new Headers(), error: e.message };
  }
};

console.log(`\nVerifying ${BASE}\n`);

/* ---- 1. everything resolves at its real URL ---------------------------- */
console.log('Pages and deploy files');
const bodies = {};
for (const p of PAGES) {
  const r = await get(urlOf(p), { redirect: 'manual' });
  bodies[p] = r.body;
  if (r.status === 0) {
    bad(`${urlOf(p)} — server not reachable (${r.error}). Is \`npm run serve\` running?`);
    console.log('\nAborting: nothing to test against.\n');
    process.exit(1);
  }
  test(r.status === 200, `${urlOf(p)}`, `${urlOf(p)} returned ${r.status} (expected 200, not a redirect)`);
}

const missing = await get('/no/such/page/here');
bodies['404'] = missing.body;
test(missing.status === 404, 'a missing URL answers 404', `a missing URL answered ${missing.status}`);
test(/href="\/assets\/css\/site\.css"/.test(missing.body),
     'the 404 page loads its styles at any depth (root-absolute paths)',
     'the 404 page uses relative asset paths — it renders unstyled at nested URLs');

const robots = await get('/robots.txt');
test(robots.status === 200 && /Sitemap:/.test(robots.body),
     'robots.txt exists and points at the sitemap',
     'robots.txt missing or has no Sitemap: line');

const sitemap = await get('/sitemap.xml');
const locs = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
test(sitemap.status === 200 && locs.length > 0,
     `sitemap.xml lists ${locs.length} urls`, 'sitemap.xml missing or empty');
test(!locs.some(l => /404|\.html$/.test(l)),
     'sitemap has no 404 and no .html URLs', 'sitemap lists a 404 or a .html URL');

for (const f of ['/assets/img/share-card.jpg', '/favicon.ico', '/apple-touch-icon.png']) {
  const r = await get(f);
  test(r.status === 200, `${f} is present`, `${f} is missing`);
}

/* ---- 2. per-page metadata ---------------------------------------------- */
console.log('\nMetadata on every page');
let metaBad = 0;
for (const p of PAGES) {
  const h = bodies[p];
  const canon = /rel="canonical"\s+href="(https?:[^"]+)"/.exec(h);
  const img   = /property="og:image"\s+content="(https?:[^"]+)"/.exec(h);
  const desc  = /name="description"\s+content="([^"]{50,})"/.test(h);
  const tw    = /twitter:card/.test(h);
  if (!canon || canon[1].endsWith('.html') || !img || !desc || !tw) {
    metaBad++;
    bad(`${urlOf(p)} — ${[!canon && 'no canonical', canon?.[1].endsWith('.html') && '.html canonical',
         !img && 'no absolute og:image', !desc && 'no description', !tw && 'no twitter:card']
         .filter(Boolean).join(', ')}`);
  }
}
test(metaBad === 0, `all ${PAGES.length} pages carry canonical + absolute og:image + description + twitter card`,
     `${metaBad} page(s) short on metadata`);
test(/name="robots"[^>]*noindex/.test(bodies['404']), '404 is noindex',
     '404 is missing its noindex — crawlers will index it');

/* ---- 3. nothing third-party -------------------------------------------- */
console.log('\nThird-party and privacy surface');
let sub = [], frames = 0;
for (const p of [...PAGES, '404']) {
  const h = bodies[p];
  if (/<iframe/.test(h)) frames++;
  for (const m of h.matchAll(/<(\w+)\b([^>]*?)\b(src|href)="(https?:\/\/[^"]+)"/g)) {
    const [, tag, attrs, attr, url] = m;
    if (tag.toLowerCase() === 'a' && attr === 'href') continue;
    if (tag.toLowerCase() === 'link' && /rel="(canonical|alternate)"/.test(attrs)) continue;
    sub.push(`${new URL(url).host} in ${urlOf(p)}`);
  }
}
test(frames === 0, 'no embedded frames (nothing setting third-party cookies)',
     `${frames} <iframe> found — that is what would force a cookie banner`);
test(sub.length === 0, 'no third-party subresources',
     `third-party subresources: ${[...new Set(sub)].join(', ')}`);

/* ---- 4. the form still defends itself ---------------------------------- */
console.log('\nContact form');
const contact = bodies['contact'];
test(/name="fax"/.test(contact) && /class="hp"/.test(contact),
     'honeypot field is present', 'the honeypot field is gone from the contact form');
test(/required/.test(contact), 'required fields are marked', 'no required attributes on the form');

const contactJs = await get('/assets/js/pages/contact.js');
test(/MIN_FILL_MS/.test(contactJs.body), 'submit-timing trap is in place',
     'the timing trap is missing from contact.js');
const endpoint = /const FORM_ENDPOINT = (.+);/.exec(contactJs.body);
if (endpoint && endpoint[1].trim().startsWith('null')) {
  note(`FORM_ENDPOINT is still null — the form hands off to the visitor's WhatsApp.`);
  console.log(`    Buyers without WhatsApp are left with the email address.`);
}

/* ---- 5. headers --------------------------------------------------------- */
console.log('\nHeaders');
const root = await get('/');
const csp  = root.headers.get('content-security-policy') || '';
test(!!root.headers.get('strict-transport-security'), 'HSTS is set',
     'no Strict-Transport-Security header — check the host reads _headers');
test(!!csp, 'Content-Security-Policy is set', 'no CSP header');
test(csp && !/script-src[^;]*'unsafe-inline'/.test(csp), "CSP does not allow inline script",
     "CSP allows 'unsafe-inline' script");
test(root.headers.get('x-content-type-options') === 'nosniff', 'nosniff is set', 'no X-Content-Type-Options');
const sw = await get('/sw.js');
test(/no-cache|max-age=0/.test(sw.headers.get('cache-control') || ''),
     'sw.js is never cached (a release can roll out)', 'sw.js is cacheable — updates will stall');

if (BASE.startsWith('https://')) {
  const http = await get(BASE.replace(/^https:/, 'http:') + '/', { redirect: 'manual' });
  test([301, 302, 307, 308].includes(http.status) && /^https:/.test(http.headers.get('location') || ''),
       'http:// redirects to https://',
       `http:// answered ${http.status} — turn on "Always Use HTTPS" in Cloudflare`);
}

/* ------------------------------------------------------------------------ */
console.log(`\n${'─'.repeat(60)}`);
if (fails.length) {
  console.log(`\x1b[31m${fails.length} failed\x1b[0m, ${pass} passed\n`);
  process.exit(1);
}
console.log(`\x1b[32mall ${pass} checks passed\x1b[0m\n`);
