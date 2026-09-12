"""Build the social share card (assets/img/share-card.jpg).

Every platform that unfurls a link — WhatsApp, LinkedIn, Slack, Facebook — wants
roughly 1.91:1 at 1200x630. Pointing og:image at a catalogue photograph meant a
1000x1000 square, which those platforms centre-crop hard: the top and bottom of
the stone were cut away and the result carried no branding at all.

This composes the card once, from assets the site already ships:
  - a stone photograph, darkened, as the ground
  - the diagonal masthead texture, so it matches the site's inner pages
  - the cleaned logo (see tools/lib/clean_logo.py)
  - the standing line, set in the brand condensed face

Run: python3 tools/build-share-card.py
"""
import pathlib, sys, io
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(pathlib.Path(__file__).parent / 'lib'))
from clean_logo import clean_logo, BRAND_ON_DARK

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT  = ROOT / 'public/assets/img/share-card.jpg'

W, H  = 1200, 630
INK   = (0x19, 0x1C, 0x1E)
GOLD  = (0xD4, 0x9B, 0x00)
PAPER = (0xF9, 0xF8, 0xF3)

STONE = ROOT / 'public/assets/granite/hassan-green.jpg'
LOGO  = ROOT / 'source-assets/brand/swasim-logo.png'


def brand_font(name, size):
    """Load one of the site's woff2 faces at `size`, via a TTF round-trip.

    PIL cannot read woff2, and the repo ships only woff2 — so the face is
    converted in memory rather than committing a duplicate font file.
    """
    from fontTools.ttLib import TTFont
    src = ROOT / 'public/assets/fonts' / name
    buf = io.BytesIO()
    f = TTFont(str(src))
    f.flavor = None                  # drop the woff2 wrapper
    f.save(buf)
    buf.seek(0)
    return ImageFont.truetype(buf, size)


# --- ground: stone, cropped to 1.91:1 and pushed back so the mark reads -----
stone = Image.open(STONE).convert('RGB')
scale = max(W / stone.width, H / stone.height)
stone = stone.resize((round(stone.width * scale), round(stone.height * scale)), Image.LANCZOS)
stone = stone.crop(((stone.width - W) // 2, (stone.height - H) // 2,
                    (stone.width - W) // 2 + W, (stone.height - H) // 2 + H))
card = Image.blend(stone, Image.new('RGB', (W, H), INK), 0.82)

# --- the masthead's diagonal texture, at the same weight the CSS uses -------
tex = Image.new('RGBA', (W, H), (0, 0, 0, 0))
td = ImageDraw.Draw(tex)
for x in range(-H, W + H, 28):
    td.line([(x, H), (x + H, 0)], fill=(255, 255, 255, 10), width=14)
card = Image.alpha_composite(card.convert('RGBA'), tex).convert('RGB')

d = ImageDraw.Draw(card)

# --- logo, optically centred slightly above the middle ----------------------
logo = clean_logo(LOGO, BRAND_ON_DARK, width=430)
card.paste(logo, ((W - logo.width) // 2, 150 - logo.height // 2 + 60), logo)

# --- rule + standing line ---------------------------------------------------
label = brand_font('barlow-condensed-400.woff2', 27)
line = 'QUARRY OWNERS  ·  PROCESSORS  ·  EXPORTERS'
# Barlow Condensed has no letter-spacing control in PIL, so space it by hand.
spaced = '  '.join(line)
tw = d.textlength(spaced, font=label)
y = 468
d.text(((W - tw) / 2, y), spaced, font=label, fill=PAPER)

rule_y = y + 62
d.line([(W / 2 - 190, rule_y), (W / 2 + 190, rule_y)], fill=GOLD, width=2)

place = brand_font('barlow-condensed-400.woff2', 24)
sub = '  '.join('HOSUR, TAMIL NADU, INDIA  ·  EST. 2010')
sw = d.textlength(sub, font=place)
d.text(((W - sw) / 2, rule_y + 22), sub, font=place, fill=GOLD)

OUT.parent.mkdir(parents=True, exist_ok=True)
card.save(OUT, 'JPEG', quality=88, optimize=True, progressive=True)
print(f'{OUT.relative_to(ROOT)}  {W}x{H}  {OUT.stat().st_size // 1024} KB')
