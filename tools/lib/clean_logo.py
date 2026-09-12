"""Recover clean artwork from the supplied logo raster.

The master (source-assets/brand/swasim-logo.png) is a flat-colour mark that has
been through JPEG compression and then crudely cut out from a white background.
Two measurable defects follow from that, and both read as "muddy" once scaled:

  * 69,903 opaque pixels carry 24,280 distinct RGB values, for artwork that
    should hold about seven.
  * the alpha channel has exactly two values, 0 and 224 -- a 1-bit cutout with
    no antialiasing, which leaves a cream ringing halo baked into the colour
    channels as roughly 20% of the visible pixels.

So the halo is unmixed rather than blurred away: every pixel is modelled as ink
blended with the old white backdrop, P = a*B + (1-a)*W, and solving for a turns
the ringing back into transparency instead of light-coloured fringe.
"""
from PIL import Image, ImageFilter
from scipy import ndimage
import numpy as np

WHITE = np.array([255, 255, 255], np.float32)

# The mark's real inks. Blue and red cover few pixels but are brand colours, so
# they are named explicitly rather than left to win a cluster on area.
BRAND_ON_LIGHT = np.array([
    [0x0B, 0x45, 0x2B],   # deep green
    [0xE2, 0xA4, 0x18],   # gold
    [0xB1, 0x73, 0x24],   # dark gold
    [0x1F, 0x4F, 0xA8],   # blue bar
    [0xC8, 0x2A, 0x22],   # red bar
], np.float32)

# Reversed-out variant. Only the green moves: at #0B452B it sits at 1.55:1 on the
# dark shell, well under the 3:1 WCAG asks of graphics, and it is most of the
# mark. The lift is pure luminance -- 3x in linear light, hue held.
BRAND_ON_DARK = BRAND_ON_LIGHT.copy()
BRAND_ON_DARK[0] = [0x1A, 0x75, 0x4C]

# Present only to absorb the ringing. Without these the grey halo binds to the
# blue ink -- #89998E really is nearer #1F4FA8 than #0B452B in RGB -- and
# speckles blue through the green.
_HALO = np.array([[0xD5, 0xD1, 0xB7], [0x89, 0x99, 0x8E], [0x34, 0x5F, 0x71]], np.float32)


def clean_logo(path, inks=BRAND_ON_LIGHT, width=None):
    """Return the mark as RGBA with flat inks and a genuine alpha edge."""
    src = Image.open(path).convert('RGBA')
    alpha = np.array(src, np.float32)[..., 3]
    opaque = alpha > 200

    # Median first: kills isolated compression speckle without softening edges.
    den = np.array(Image.fromarray(np.array(src)[..., :3])
                   .filter(ImageFilter.MedianFilter(3)), np.float32)

    palette = np.vstack([inks, _HALO])
    dist = ((den.reshape(-1, 1, 3) - palette[None]) ** 2).sum(2)
    label = dist.argmin(1).reshape(alpha.shape)

    # Only pixels sitting close to a real ink may choose their own colour; halo
    # pixels are ambiguous in RGB, so they inherit from the nearest confident
    # neighbour instead of guessing.
    confident = opaque & (label < len(inks)) & (dist.min(1).reshape(alpha.shape) < 55 ** 2)
    nearest = ndimage.distance_transform_edt(~confident, return_distances=False,
                                             return_indices=True)
    ink = inks[np.clip(label, 0, len(inks) - 1)][tuple(nearest)]

    # Coverage measured against the ink the pixel actually belongs to, so cream
    # fringe resolves to low alpha rather than to light paint.
    cov = np.clip((((WHITE - den) * (WHITE - ink)).sum(2) /
                   np.maximum(((WHITE - ink) ** 2).sum(2), 1e-6)), 0, 1)
    out_a = np.where(opaque, cov * 255, 0).astype(np.uint8)
    out_a = np.array(Image.fromarray(out_a).filter(ImageFilter.GaussianBlur(0.5)), np.float32)
    out_a = np.clip((out_a - 30) * (255 / (255 - 30)), 0, 255)   # interiors stay solid

    img = Image.fromarray(np.dstack([ink, out_a]).astype(np.uint8))
    if width:
        img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    return img
