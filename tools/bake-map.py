"""Pre-render the export-markets world map to a static SVG.

The About page used to pull d3 (~90KB), topojson-client and a 100KB atlas from
a CDN at runtime — three requests to a third-party origin before the map could
draw. None of that is needed to display a fixed map of a fixed set of markets,
so the projection is computed once here and the result committed as an SVG.

Run: python3 tools/bake-map.py   (needs /tmp/countries-110m.json)
"""
import json, math, pathlib

W, H = 960, 470
SRC = '/tmp/countries-110m.json'
OUT = pathlib.Path(__file__).resolve().parent.parent / 'public/assets/img/world-map.svg'

topo = json.load(open(SRC))
tr = topo['transform']
sx, sy = tr['scale']; tx, ty = tr['translate']

def decode_arc(arc):
    """TopoJSON arcs are quantised and delta-encoded."""
    x = y = 0; pts = []
    for dx, dy in arc:
        x += dx; y += dy
        pts.append((x * sx + tx, y * sy + ty))
    return pts

ARCS = [decode_arc(a) for a in topo['arcs']]

def ring(indices):
    out = []
    for i in indices:
        pts = ARCS[~i][::-1] if i < 0 else ARCS[i]
        out.extend(pts if not out else pts[1:])
    return out

def split_antimeridian(ring):
    """Split a lon/lat ring wherever it steps across ±180°.

    d3.geoPath clips geometry against the sphere; projecting naively does not,
    so a country spanning the date line (Russia, Fiji, the US via Alaska) gets a
    segment drawn straight back across the whole map — the horizontal bars.
    Cutting the ring at the crossing gives each side its own closed subpath.
    """
    parts, cur = [], [ring[0]]
    for prev, pt in zip(ring, ring[1:]):
        if abs(pt[0] - prev[0]) > 180:
            parts.append(cur)
            cur = [pt]
        else:
            cur.append(pt)
    parts.append(cur)
    return [q for q in parts if len(q) >= 3]


def centroid(ring):
    n = len(ring)
    return sum(p[0] for p in ring) / n, sum(p[1] for p in ring) / n


# Overseas territories are legitimately part of their country, but highlighting
# "Europe" should not put a green patch in South America (French Guiana) — on a
# market map that reads as a mistake. Drop rings far from the main landmass.
MAX_OFFSET_DEG = 40


def drop_far_flung(rings):
    if len(rings) < 2:
        return rings
    main = max(rings, key=len)
    mx, my = centroid(main)
    return [r for r in rings
            if abs(centroid(r)[0] - mx) <= MAX_OFFSET_DEG
            and abs(centroid(r)[1] - my) <= MAX_OFFSET_DEG]


def natural_earth1(lon, lat):
    """d3.geoNaturalEarth1 raw projection (radians in, unit plane out)."""
    l = math.radians(lon); p = math.radians(lat)
    p2 = p * p; p4 = p2 * p2
    x = l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4)))
    y = p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4)))
    return x, y

# collect every polygon, skipping Antarctica as the live map did
shapes = []
for geom in topo['objects']['countries']['geometries']:
    name = geom.get('properties', {}).get('name', '')
    if name == 'Antarctica':
        continue
    polys = geom['arcs'] if geom['type'] == 'MultiPolygon' else [geom['arcs']]
    # lon/lat first: both the antimeridian split and the distance test are
    # meaningless once the coordinates have been projected to the plane.
    geo_rings = [ring(r) for poly in polys for r in poly]
    geo_rings = [piece for r in geo_rings for piece in split_antimeridian(r)]
    geo_rings = drop_far_flung(geo_rings)
    rings = [[natural_earth1(*pt) for pt in r] for r in geo_rings]
    if rings:
        shapes.append((name, rings))

# fit to the viewport, matching d3's fitSize([W, H-10])
xs = [p[0] for _, rs in shapes for r in rs for p in r]
ys = [p[1] for _, rs in shapes for r in rs for p in r]
k = min(W / (max(xs) - min(xs)), (H - 10) / (max(ys) - min(ys)))
ox = (W - (max(xs) + min(xs)) * k) / 2
oy = (H - (max(ys) + min(ys)) * -k) / 2      # y is flipped

def simplify_ring(pts, tol=0.6):
    """Simplify a CLOSED ring.

    Douglas-Peucker measures each point against the line joining the first and
    last. On a closed ring those are the same point, so the baseline has zero
    length, every distance evaluates to 0 and the whole ring collapses. Split
    the ring at the vertex furthest from its start and simplify the two halves
    as open polylines instead.
    """
    if len(pts) > 3 and pts[0] == pts[-1]:
        pts = pts[:-1]
    if len(pts) < 4:
        return pts + [pts[0]]
    x0, y0 = pts[0]
    far = max(range(1, len(pts)), key=lambda i: (pts[i][0] - x0) ** 2 + (pts[i][1] - y0) ** 2)
    head = simplify(pts[:far + 1], tol)
    tail = simplify(pts[far:] + [pts[0]], tol)
    return head[:-1] + tail

def simplify(pts, tol=0.6):
    """Douglas-Peucker on an OPEN polyline. At this scale 0.6px is below what a
    screen can resolve, so the outline is visually identical with far fewer points."""
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    norm = math.hypot(dx, dy) or 1e-9
    worst, idx = 0.0, 0
    for i, (x, y) in enumerate(pts[1:-1], 1):
        d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / norm
        if d > worst:
            worst, idx = d, i
    if worst <= tol:
        return [pts[0], pts[-1]]
    return simplify(pts[:idx + 1], tol)[:-1] + simplify(pts[idx:], tol)

def to_path(rings):
    parts = []
    for r in rings:
        proj = [(x * k + ox, -y * k + oy) for x, y in r]
        proj = simplify_ring(proj)
        pts = [f'{round(x)},{round(y)}' for x, y in proj]      # integers: 960px wide
        dedup = [pts[0]] + [q for a, q in zip(pts, pts[1:]) if a != q]
        if len(dedup) > 2:
            parts.append('M' + 'L'.join(dedup) + 'Z')
    return ''.join(parts)

# Markets too small to have a polygon at 110m resolution get an explicit marker,
# projected with the same transform so it lands in the right place.
MARKERS = [('singapore', 'Singapore', 103.82, 1.35)]
marks = []
for key, label, lon, lat in MARKERS:
    mx, my = natural_earth1(lon, lat)
    px, py = mx * k + ox, -my * k + oy
    marks.append(
        f'<g class="worldmap__marker" data-market="{key}">'
        f'<circle class="worldmap__halo" cx="{px:.0f}" cy="{py:.0f}" r="11"/>'
        f'<circle class="worldmap__dot"  cx="{px:.0f}" cy="{py:.0f}" r="4.5"/>'
        f'<text x="{px+15:.0f}" y="{py+4:.0f}">{label.upper()}</text></g>')

body = ''.join(
    f'<path data-country="{n}" d="{to_path(rs)}"/>' for n, rs in shapes if to_path(rs)
) + ''.join(marks)
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
       f'class="worldmap__svg" role="img" '
       f'aria-label="World map with Swasim Granite export markets highlighted">'
       f'<g class="worldmap__countries">{body}</g></svg>')

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(svg, encoding='utf-8')
print(f'{OUT}  {OUT.stat().st_size // 1024} KB  ({len(shapes)} countries)')
