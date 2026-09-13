"""Regenerate every web image from the masters in source-assets/.

Two sizes per photograph, two formats each:
  <name>.jpg / .webp          display size (stone detail, lightbox, hero)
  thumbs/<name>.jpg / .webp   grid size

WebP is ~30% smaller at equivalent quality; the JPEG is the <picture> fallback.
Serving a 1000px slab photo into a 132px grid tile was the single largest
avoidable cost on the catalogue.

Run: python3 tools/build-images.py
"""
import pathlib, shutil
from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC  = ROOT / 'source-assets'
SITE = ROOT / 'public'

GRANITE_NAMES = {
    'black-absolute-2.jpg': 'black-absolute',      'Blue-Pearl-Granite.jpg': 'blue-pearl',
    'Green_marble.jpg': 'green-marble',            'Hassan-Green-Granite.jpg': 'hassan-green',
    'Imperial-Red.jpg': 'imperial-red',            'indian-aurora-granite.jpg': 'indian-aurora',
    'Indian_juprana.jpg': 'indian-juparana',       'granite_Ivory-Brown.jpg': 'ivory-brown',
    'RED_MULTI_GRANITE.jpg': 'red-multi',          'Tan_brown.jpg': 'tan-brown',
    'ultimate_black_granite.jpg': 'ultimate-black','Viscount_white.jpg': 'viscount-white',
    'indian-aurora-slab-original.png': 'indian-aurora-slab',
}

# (display size, thumbs size) — the long edge, in pixels. Facility photos are
# landscape and fill the About page's tall gallery frame, which shows the thumbs/
# copy; at 640px they would be upscaled and soft, so they get a larger one.
SIZES = {'granite': (1000, 440), 'monuments': (1600, 640), 'facility': (1600, 1200),
         'hero': (1600, 640)}
QUALITY = {'jpg': 82, 'webp': 78}

def emit(im, stem, out_dir, edge):
    out_dir.mkdir(parents=True, exist_ok=True)
    w, h = im.size
    if max(w, h) > edge:
        r = edge / max(w, h)
        im = im.resize((round(w * r), round(h * r)), Image.LANCZOS)
    im.save(out_dir / f'{stem}.jpg',  'JPEG', quality=QUALITY['jpg'], optimize=True, progressive=True)
    im.save(out_dir / f'{stem}.webp', 'WEBP', quality=QUALITY['webp'], method=6)
    return im.size

def process(src_path, stem, kind):
    im = ImageOps.exif_transpose(Image.open(src_path)).convert('RGB')
    full, thumb = SIZES[kind]
    dims = emit(im, stem, SITE / 'assets' / kind, full)
    emit(im, stem, SITE / 'assets' / kind / 'thumbs', thumb)
    return dims

total = 0
for f in sorted((SRC / 'granite').glob('*')):
    stem = GRANITE_NAMES.get(f.name)
    if stem:
        process(f, stem, 'granite'); total += 1

for i, f in enumerate(sorted((SRC / 'monuments').glob('*.jpeg')), 1):
    process(f, f'm{i:02d}', 'monuments'); total += 1

# Facility and hero photos keep their own names (plant-frontage.jpeg -> plant-frontage).
for kind in ('facility', 'hero'):
    for f in sorted((SRC / kind).glob('*')):
        if f.suffix.lower() in ('.jpg', '.jpeg', '.png', '.webp'):
            process(f, f.stem.lower(), kind); total += 1

def mb(p): return sum(x.stat().st_size for x in p.rglob('*') if x.is_file()) / 1e6
print(f'processed {total} photographs')
for kind in SIZES:
    if (SITE / 'assets' / kind).exists():
        print(f'  {kind:<10}{mb(SITE / "assets" / kind):.1f} MB')
