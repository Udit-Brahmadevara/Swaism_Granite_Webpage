"""Build the standalone 'under development' holding page.

One self-contained file: fonts and the logo are embedded as data URIs and the
background is pure CSS, so it has no external requests at all and can be dropped
on any host — or opened straight from disk. Regenerate with:

    python3 tools/build-holding.py
"""
import base64, pathlib, sys
from PIL import Image, ImageDraw

sys.path.insert(0, str(pathlib.Path(__file__).parent / 'lib'))
from clean_logo import clean_logo, BRAND_ON_DARK

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT  = ROOT / 'holding' / 'index.html'

def b64(path):
    return base64.b64encode(pathlib.Path(path).read_bytes()).decode()

# The supplied master is a JPEG-compressed, hard-cut raster: 24,280 distinct
# colours in flat artwork, 1-bit alpha, and a cream ringing halo baked into the
# colour channels. clean_logo unmixes that halo back into transparency and snaps
# the inks flat; BRAND_ON_DARK additionally lifts the green's luminance (hue
# held) from 1.55:1 to 3.01:1 on this page's ground, since the green is most of
# the mark. See tools/lib/clean_logo.py.
logo_src = ROOT / 'source-assets/brand/swasim-logo.png'
im = clean_logo(logo_src, BRAND_ON_DARK, width=300)
tmp = pathlib.Path('/tmp/holding-logo.png')
im.save(tmp, 'PNG', optimize=True)   # PNG keeps the alpha channel

LOGO   = b64(tmp)

# 32px favicon from the same mark, embedded so the browser's automatic
# /favicon.ico request never 404s
ico = clean_logo(logo_src, BRAND_ON_DARK)
ico.thumbnail((32, 32), Image.LANCZOS)
sq = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
sq.paste(ico, ((32 - ico.width) // 2, (32 - ico.height) // 2), ico)
sq.save('/tmp/holding-icon.png', 'PNG', optimize=True)
ICON = b64('/tmp/holding-icon.png')
DISPLAY = b64(ROOT / 'public/assets/fonts/cormorant-garamond-600.woff2')
LABEL   = b64(ROOT / 'public/assets/fonts/barlow-condensed-400.woff2')

HTML = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Swasim Granite — Website Under Development</title>
<meta name="description" content="Swasim Granite: quarry owners, processors and exporters of Indian granite from Hosur since 2010. Our website is under development — please contact the export desk directly.">
<meta name="robots" content="noindex">
<meta property="og:title" content="Swasim Granite — Website Under Development">
<meta property="og:description" content="Quarry owners and exporters of Indian granite, Hosur. Blocks, slabs, tiles and monuments.">
<meta name="theme-color" content="#191C1E">
<link rel="icon" href="data:image/png;base64,{ICON}">
<style>
/* Self-contained: two brand faces and the mark are embedded, the background is
   drawn in CSS, so this page makes no network requests whatsoever. */
@font-face {{ font-family:'Cormorant Garamond'; font-style:normal; font-weight:600; font-display:swap;
  src:url(data:font/woff2;base64,{DISPLAY}) format('woff2'); }}
@font-face {{ font-family:'Barlow Condensed'; font-style:normal; font-weight:400; font-display:swap;
  src:url(data:font/woff2;base64,{LABEL}) format('woff2'); }}

:root {{
  --ink:#191C1E; --paper:#F9F8F3; --green:#0F4C2E; --green-deep:#0A3A22;
  --green-light:#0D5C3A; --gold:#D49B00;
  --display:'Cormorant Garamond',Georgia,'Times New Roman',serif;
  --label:'Barlow Condensed',system-ui,sans-serif;
  --body:system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}}
*,*::before,*::after {{ box-sizing:border-box; }}
html {{ height:100%; }}
body {{
  margin:0; min-height:100%; color:var(--paper); background:var(--ink);
  font-family:var(--body); line-height:1.6; -webkit-font-smoothing:antialiased;
  display:flex; flex-direction:column;
}}
/* the site's original near-black masthead texture, reproduced without an image */
body::before {{
  content:""; position:fixed; inset:0; pointer-events:none; opacity:.28;
  background-image:
    repeating-linear-gradient(114deg,rgba(255,255,255,.045) 0 14px,rgba(0,0,0,.045) 14px 28px),
    radial-gradient(ellipse 70% 55% at 22% 24%,#3a4046,transparent 70%),
    radial-gradient(ellipse 45% 80% at 78% 66%,#0f1113,transparent 72%),
    linear-gradient(160deg,#191C1E,#0f1113);
}}
.wrap {{
  position:relative; flex:1; display:flex; align-items:center; justify-content:center;
  padding:56px 24px;
}}
.card {{ position:relative; width:100%; max-width:760px; }}
.corner {{ position:absolute; width:104px; height:104px; pointer-events:none; }}
.corner--tr {{ top:-26px; right:-14px; border-top:2px solid var(--gold); border-right:2px solid var(--gold); }}
.corner--bl {{ bottom:-26px; left:-14px; border-bottom:2px solid rgba(249,248,243,.3); border-left:2px solid rgba(249,248,243,.3); }}

.logo {{ width:158px; height:auto; display:block; margin-bottom:30px; }}
.eyebrow {{
  display:flex; align-items:center; gap:12px; margin:0 0 22px;
  font-family:var(--label); font-size:12px; letter-spacing:.36em; color:var(--gold);
  text-transform:uppercase;
}}
.eyebrow::before {{ content:""; width:44px; height:1px; background:var(--gold); flex:none; }}
h1 {{
  font-family:var(--display); font-weight:600; font-size:clamp(38px,7vw,66px);
  line-height:1.04; letter-spacing:-.01em; margin:0 0 22px;
}}
h1 em {{ color:var(--gold); font-style:italic; }}
.lede {{ font-size:16.5px; line-height:1.7; color:rgba(249,248,243,.76); margin:0; max-width:56ch; }}



footer {{
  position:relative; border-top:1px solid rgba(249,248,243,.14);
  background:rgba(0,0,0,.26); padding:16px 24px;
}}
.strip {{
  margin:0 auto; max-width:1100px; list-style:none; padding:0;
  display:flex; flex-wrap:wrap; gap:10px 36px; justify-content:center;
  font-family:var(--label); font-size:11.5px; letter-spacing:.26em;
  color:rgba(249,248,243,.5); text-transform:uppercase;
}}
@media (max-width:600px) {{
  .wrap {{ padding:40px 20px; }}
  .corner {{ display:none; }}
  .logo {{ width:130px; margin-bottom:24px; }}
}}
@media (prefers-reduced-motion:reduce) {{ * {{ transition:none !important; }} }}
</style>
</head>
<body>

<main class="wrap">
  <div class="card">
    <span class="corner corner--tr" aria-hidden="true"></span>
    <span class="corner corner--bl" aria-hidden="true"></span>

    <img class="logo" src="data:image/png;base64,{LOGO}" alt="Swasim Granite"
         width="{im.width}" height="{im.height}">

    <p class="eyebrow">Est. 2010 · Hosur, India</p>
    <h1>Our website is<br>under <em>development</em>.</h1>
    <p class="lede">Swasim Granite — quarry owners, processors and exporters of Indian granite.
      Blocks, slabs, tiles and monuments, shipped from Hosur to India, Vietnam, Singapore,
      Russia and Europe. Our full site is on its way.</p>

  </div>
</main>

<footer>
  <ul class="strip">
    <li>ISO 9001:2015</li>
    <li>CE Marked Slabs</li>
    <li>FOB Chennai · Tuticorin</li>
    <li>&copy; 2026 Swasim Granite</li>
  </ul>
</footer>

</body>
</html>
'''

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(HTML, encoding='utf-8')
kb = OUT.stat().st_size / 1024
print(f'{OUT}  {kb:.0f} KB (single file, zero external requests)')
