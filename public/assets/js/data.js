/**
 * Swasim Granite — content model.
 *
 * This is the single source of truth for everything the site renders:
 * stones, specs, process, markets and articles. Pages import from here,
 * so copy changes happen in one place and never in markup.
 */

export const COMPANY = {
  name: 'Swasim Granite',
  founded: 2010,
  md: 'Roopesh Kumar',
  location: 'Hosur, Tamil Nadu, India',
  address: 'Shoolgiri / Sappadi, Hosur, Tamil Nadu, India',
  phone: '+91 94488 41482',
  phoneHref: '+919448841482',
  email: 'swasimgranite@gmail.com',
  markets: ['India', 'Vietnam', 'Singapore', 'Russia', 'Europe'],
};

export const CERTIFICATIONS = [
  'ISO 9001:2015',
  'CE Marked Slabs',
  'FOB Chennai · Tuticorin',
];

export const TRUST_STRIP = [
  'ISO 9001:2015',
  'CE MARKED SLABS',
  'FOB CHENNAI · TUTICORIN',
  'MONTHLY CAPACITY 45,000 SQM',
];

export const FINISHES = ['Polished', 'Honed', 'Leathered', 'Flamed'];

export const GRANITES = [
  { id: 'blue-pearl', name: 'Blue Pearl Granite', type: 'Exotic', origin: 'IMPORT LOT',
    tagline: 'LABRADORITE SHIMMER', img: '/assets/granite/blue-pearl.jpg',
    description: 'Labradorite crystals fire blue and silver as the viewing angle shifts — a stone that changes across the day. Best used where light moves: feature walls, vanity tops and lift surrounds. Supplied in book-matched pairs on request.',
    specs: { strength: '174 MPa', absorption: '0.09%', hardness: '6.5 Mohs', density: '2,780 kg/m³' } },

  { id: 'green-marble', name: 'Green Marble', type: 'Exotic', origin: 'RAJASTHAN',
    tagline: 'FLOWING VEIN MARBLE', img: '/assets/granite/green-marble.jpg',
    description: 'A deep forest-green marble crossed by dense white veining that runs in flowing, almost woven bands. Book-match it across a wall and the pattern reads as one continuous composition. Specified for feature walls, altar surrounds and reception counters.',
    specs: { strength: '96 MPa', absorption: '0.40%', hardness: '3.5 Mohs', density: '2,780 kg/m³' } },

  { id: 'hassan-green', name: 'Hassan Green Granite', type: 'Premium', origin: 'KARNATAKA',
    tagline: 'DEEP QUARRY GREEN', img: '/assets/granite/hassan-green.jpg',
    description: 'Our house-colour green, quarried near Hassan: a dark uniform ground with fine pale speckle and occasional quartz threading. Cut from a single bench so colour repeats reliably across container lots. Recommended for cladding, island tops and dark flooring.',
    specs: { strength: '170 MPa', absorption: '0.13%', hardness: '6.5 Mohs', density: '2,720 kg/m³' } },

  { id: 'imperial-red', name: 'Imperial Red', type: 'Exotic', origin: 'ANDHRA PRADESH',
    tagline: 'DEEP RED FELDSPAR', img: '/assets/granite/imperial-red.jpg',
    description: 'Dense red feldspar with dark, flame-like streaking and a velvet depth after leathering. A dramatic stone that holds its saturation outdoors, making it suitable for entrance portals, monuments and exterior cladding bands.',
    specs: { strength: '181 MPa', absorption: '0.11%', hardness: '6.5 Mohs', density: '2,750 kg/m³' } },

  { id: 'indian-juparana', name: 'Indian Juparana', type: 'Premium', origin: 'ANDHRA PRADESH',
    tagline: 'WARM GOLD MOVEMENT', img: '/assets/granite/indian-juparana.jpg',
    description: 'A warm gold-and-cream field with sweeping burgundy streaks and fine mica sparkle. One of the most fabricated export granites for its reliability at scale. Kitchen countertops, reception cladding and stair treads.',
    specs: { strength: '155 MPa', absorption: '0.20%', hardness: '6 Mohs', density: '2,650 kg/m³' } },

  { id: 'red-multi', name: 'Red Multi Granite', type: 'Commercial', origin: 'ANDHRA PRADESH',
    tagline: 'HIGH-CONTRAST FIELD', img: '/assets/granite/red-multi.jpg',
    description: 'A lively red-and-grey multicolour field with coarse crystal structure, priced for volume work without sacrificing durability. Popular for commercial kitchen counters, steps and paving.',
    specs: { strength: '165 MPa', absorption: '0.18%', hardness: '6 Mohs', density: '2,690 kg/m³' } },

  { id: 'tan-brown', name: 'Tan Brown', type: 'Commercial', origin: 'ANDHRA PRADESH',
    tagline: 'HIGH-VOLUME WORKHORSE', img: '/assets/granite/tan-brown.jpg',
    description: 'Dark brown ground with reddish-tan crystal clusters and black flecking. Extremely hard-wearing and stain-tolerant, which is why it dominates commercial kitchen and hospitality specifications worldwide.',
    specs: { strength: '188 MPa', absorption: '0.08%', hardness: '6.5 Mohs', density: '2,860 kg/m³' } },

  { id: 'viscount-white', name: 'Viscount White', type: 'Premium', origin: 'IMPORT LOT',
    tagline: 'MARBLE-LIKE VEINING', img: '/assets/granite/viscount-white.jpg',
    description: 'A pale grey-white field crossed by soft flowing grey veins, giving the appearance of marble with the durability of granite. The preferred substitute where a marble look is wanted in high-traffic wet areas.',
    specs: { strength: '165 MPa', absorption: '0.15%', hardness: '6.5 Mohs', density: '2,690 kg/m³' } },

  { id: 'black-absolute', name: 'Black Absolute', type: 'Premium', origin: 'KARNATAKA',
    tagline: 'UNIFORM VELVET BLACK', img: '/assets/granite/black-absolute.jpg',
    description: 'A dense, uniform black dolerite with almost no visible crystal structure. Holds a soft velvet sheen even before full polish. Used for countertops, memorials, signage bases and interior stair treads.',
    specs: { strength: '190 MPa', absorption: '0.06%', hardness: '7 Mohs', density: '2,980 kg/m³' } },

  { id: 'ivory-brown', name: 'Ivory Brown', type: 'Commercial', origin: 'RAJASTHAN',
    tagline: 'SOFT LAYERED CREAM', img: '/assets/granite/ivory-brown.jpg',
    description: 'A soft ivory-cream ground with fine rust-brown veining running in layered bands. Forgiving in fabrication and consistently available. Countertops, window sills and light-toned flooring.',
    specs: { strength: '148 MPa', absorption: '0.23%', hardness: '6 Mohs', density: '2,630 kg/m³' } },

  // Two views, so this stone shows a gallery (arrows, dots, swipe). Add more
  // entries to `images` to extend it; `img` stays the single grid thumbnail.
  { id: 'indian-aurora', name: 'Indian Aurora Granite', type: 'Exotic', origin: 'KARNATAKA',
    tagline: 'FLOWING COPPER & BLACK', img: '/assets/granite/indian-aurora-slab.jpg',
    images: [
      { src: '/assets/granite/indian-aurora-slab.jpg',
        alt: 'A full polished Indian Aurora slab standing on trestles, with the rest of the bundle stacked behind it' },
      { src: '/assets/granite/indian-aurora.jpg',
        alt: 'Close detail of Indian Aurora, showing the flowing copper and black banding' },
    ],
    description: 'A gneissic stone in copper and black, with long flowing bands that behave almost like a textile at slab scale. Book-match it across a wall and the movement resolves into a single sweeping composition. Feature walls and boardroom tables.',
    specs: { strength: '159 MPa', absorption: '0.17%', hardness: '6 Mohs', density: '2,700 kg/m³' } },

  { id: 'ultimate-black', name: 'Ultimate Black Granite', type: 'Premium', origin: 'TAMIL NADU',
    tagline: 'PRECISION JET BLACK', img: '/assets/granite/ultimate-black.jpg',
    description: 'A true uniform black granite with no visible veining — the benchmark stone for precision fabrication. Holds a mirror polish above 90 gloss units. Countertops, signage bases and interior cladding.',
    specs: { strength: '196 MPa', absorption: '0.05%', hardness: '7 Mohs', density: '3,010 kg/m³' } },
];

/** Homepage hero rotation: stone id + the yard note shown over it. */
export const HERO = [
  { id: 'hassan-green',   kicker: 'FEATURED BLOCK · QUARRY 04' },
  { id: 'imperial-red',   kicker: 'GANGSAW LOT 1182 · 3CM' },
  { id: 'blue-pearl',     kicker: 'BOOK-MATCHED PAIR · EXOTIC' },
  { id: 'ultimate-black', kicker: 'MULTIWIRE LINE · 2CM' },
  { id: 'indian-aurora',  kicker: 'LEATHERED FINISH · QUARRY 02' },
].map(h => ({ ...h, stone: GRANITES.find(g => g.id === h.id) }));

export const STATS = [
  { n: '2010', l: 'FOUNDED IN HOSUR' },
  { n: '100%', l: 'IN-HOUSE PROCESS' },
  { n: '8',    l: 'STEP QUARRY-TO-EXPORT JOURNEY' },
];

export const HOME_BADGES = [
  { big: '2010', small: 'FOUNDED IN HOSUR' },
  { big: '5',    small: 'EXPORT MARKETS' },
  { big: '100%', small: 'IN-HOUSE PROCESS' },
];

export const PRODUCTS = [
  { t: 'Granite Blocks', d: 'Sourced and selected for consistency in colour, grain, and strength — ready for processing or direct export.' },
  { t: 'Granite Slabs', d: 'Large-format slabs finished to a flawless polish, ideal for countertops, flooring, and cladding.' },
  { t: 'Granite Tiles', d: 'Precision-cut tiles in a range of sizes and finishes, built for durability and easy installation.' },
  { t: 'Granite Monuments', d: 'Custom-crafted monuments and memorials, finished with the care and precision the occasion demands.' },
  // Cut-to-size and bespoke work merged into one offer — both are the same
  // conversation with the client, sized or designed to their specification.
  { t: 'Customised Granite Products', wide: true, d: 'Cut-to-size to your exact dimensions, with no compromise on fit or finish. And where the requirement is one of a kind, we work with you to design and deliver a bespoke stone solution.' },
];

export const PROCESS = [
  { n: '01', t: 'Bench Extraction', d: 'Diamond wire and controlled splitting keep blocks square and crack-free at the face. Every bench is surveyed before the first cut so the block yield is known in advance.' },
  { n: '02', t: 'Block Grading', d: 'Blocks are water-washed, photographed on four faces and graded A/B/C in the quarry yard. Buyers receive the photo set with the offer, not after loading.' },
  { n: '03', t: 'Gangsaw & Multiwire', d: 'Two gangsaws and one multiwire line cut 2cm and 3cm slabs to ±0.5 mm. Wire tension and feed rate are logged per block for traceability.' },
  { n: '04', t: 'Resin, Polish & Finish', d: 'Vacuum resin and oven cure, then polished, honed, leathered or flamed. Gloss is metered on every polished slab before it leaves the line.' },
  { n: '05', t: 'Crating & Export', d: 'Bundle-numbered A-frames, fumigated timber crates and lot-matched loading. FOB Chennai or Tuticorin, typically 12–16 days from PO.' },
];

export const JOURNEY = [
  'Selection', 'Cutting & Sizing', 'Processing', 'Finishing',
  'Inspection — At Factory', 'Inspection — Before Packing', 'Packing', 'Logistics',
];

export const VALUES = [
  { t: 'Quality you can see', d: 'Every block is selected and every slab finished to a standard we would put our own name on.' },
  { t: 'Consistency you can rely on', d: 'The same in-house process, run the same way, so a repeat order matches the first one.' },
  { t: 'Service that keeps clients coming back', d: 'Year after year, across India and international markets, on the strength of the relationship, not just the stone.' },
];

/** Export markets plotted on the About page world map. */
export const MARKETS = [
  { key: 'india', name: 'India', countries: ['India'],
    since: 'Since 2010', lead: 'Home market — Hosur, Tamil Nadu.',
    body: 'Our founding market. Blocks, slabs and cut-to-size supplied to fabricators and builders across Tamil Nadu, Karnataka, Kerala and Andhra Pradesh, delivered direct from the Hosur facility.',
    facts: ['Direct road delivery', 'Blocks · slabs · monuments', 'Repeat trade clients'] },

  { key: 'vietnam', name: 'Vietnam', countries: ['Vietnam'],
    since: 'Since 2016', lead: 'Container exports for stone processors.',
    body: 'Regular block and gangsaw-slab shipments to processing partners, sailing FOB Chennai. Lots are photographed and colour-matched before loading so repeat orders stay consistent.',
    facts: ['FOB Chennai', 'Block & slab lots', 'Colour-matched repeats'] },

  { key: 'singapore', name: 'Singapore', countries: ['Singapore'], marker: [103.82, 1.35],
    since: 'Since 2018', lead: 'Finished slabs for interior fit-outs.',
    body: 'Polished and honed slabs for commercial interiors and residential projects, packed in fumigated timber crates to arrive install-ready.',
    facts: ['Polished & honed', 'Crated, install-ready', 'Project-scheduled shipping'] },

  { key: 'russia', name: 'Russia', countries: ['Russia'],
    since: 'Since 2019', lead: 'Monuments and memorial stone.',
    body: 'Black and red granite monuments, headstones and cut-to-size memorial components — carved and finished in-house, then bundle-numbered for the yard that receives them.',
    facts: ['Monuments & memorials', 'Black · red granite', 'Bundle-numbered crates'] },

  { key: 'europe', name: 'Europe',
    countries: ['Germany', 'France', 'Italy', 'Netherlands', 'Belgium', 'Spain', 'Poland', 'United Kingdom'],
    since: 'Since 2021', lead: 'Specification-grade slabs and cladding.',
    body: 'Supply to importers and façade contractors who need documented tolerances and repeatable colour across containers. Every slab is inspected twice — once at the factory, once before packing.',
    facts: ['Facade & cladding', 'Documented tolerances', 'Two-stage inspection'] },
];

export const ARTICLES = [
  { id: 'granite-vs-quartz', tag: 'BUYER GUIDE', date: 'Aug 2026', read: '6 min read',
    title: 'Granite or engineered quartz: how to choose for a countertop run',
    excerpt: 'Heat tolerance, seam behaviour and long-run cost differ more than the showroom sample suggests. What we tell fabricators before a large order.' },
  { id: 'reading-a-block-photo', tag: 'FROM THE YARD', date: 'Jul 2026', read: '5 min read',
    title: 'How to read a block photo set before you commit to a lot',
    excerpt: 'Four faces, water-washed, in daylight. What the corners tell you about yield, and the three things a single glamour shot always hides.' },
  { id: 'finishes-explained', tag: 'TECHNICAL', date: 'Jun 2026', read: '4 min read',
    title: 'Polished, honed, leathered, flamed — where each finish belongs',
    excerpt: 'Gloss is not the same as quality. A practical map of finish to application, from wet-area flooring to exterior cladding bands.' },
  { id: 'export-packing', tag: 'LOGISTICS', date: 'May 2026', read: '7 min read',
    title: 'What good export packing actually looks like',
    excerpt: 'A-frames, fumigated timber, bundle numbering and lot-matched loading — why the crate matters as much as the stone inside it.' },
  { id: 'inspection-twice', tag: 'PROCESS', date: 'Apr 2026', read: '3 min read',
    title: 'Why we inspect every slab twice',
    excerpt: 'Once on the factory floor, once again before packing. The second pass catches what handling introduces, not what cutting left behind.' },
  { id: 'monument-lead-times', tag: 'MONUMENTS', date: 'Mar 2026', read: '5 min read',
    title: 'Planning monument lead times around carving capacity',
    excerpt: 'Carving is the bottleneck, not sawing. How to sequence a memorial order so the finishing line never sits idle.' },
];

export const BROCHURE_CONTENTS = [
  'Full granite collection — blocks, slabs, tiles, cut-to-size',
  'Granite monuments and custom stone solutions',
  'Available finishes and specifications',
  'The quarry-to-delivery process, step by step',
  'Export markets and contact details',
];

export const OFFICE_HOURS = [
  { k: 'MON – SAT', v: '09:00 – 18:30 IST' },
  { k: 'PLANT VISITS', v: 'By appointment, Hosur' },
  { k: 'QUOTE TURNAROUND', v: '1 working day' },
];

/** 47 monument photographs; `thumb` feeds the grid, `full` the lightbox. */
export const MONUMENTS = Array.from({ length: 47 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return { id: `m${n}`, full: `/assets/monuments/m${n}.jpg`, thumb: `/assets/monuments/thumbs/m${n}.jpg` };
});

/**
 * About page — facility gallery.
 *
 * Real photographs of the Hosur plant, not stock. The first is the plant
 * frontage (master in source-assets/facility/); the rest come from the monument
 * shoot (m25 / m27 / m42 / m16), chosen because each shows a different part of
 * the operation. Captions describe only what is visible.
 *
 * The gallery shows each image's thumbs/ copy, so a new facility photo goes into
 * source-assets/facility/ and through `npm run images` before it is listed here.
 *
 * `focus: 'left' | 'right'` keeps that side of a wide photo in view where the
 * frame crops it narrow (phones). The frontage uses it so the lettering on the
 * gantry is not cut off.
 */
export const FACILITY = [
  { img: '/assets/facility/plant-frontage.jpg', focus: 'right',
    caption: 'The plant and stone yard — Hosur facility',
    alt: 'The Swasim Granite plant seen from the road: a large white processing shed on the left, and an orange gantry crane lettered “Swasim Granite” spanning a yard of stacked granite blocks and slabs, behind the compound wall' },
  { img: '/assets/monuments/m25.jpg',
    caption: 'Finishing floor — Hosur facility',
    alt: 'Two finishers checking a polished Imperial Red monument on the floor of the Hosur facility, with the gangsaw line behind them' },
  { img: '/assets/monuments/m27.jpg',
    caption: 'Hand-carving — a Nandi pair in progress',
    alt: 'A pair of hand-carved granite Nandi bulls on trestles inside the workshop, with stacked slabs and the open yard beyond' },
  { img: '/assets/monuments/m42.jpg',
    caption: 'Finished monuments on the workshop floor',
    alt: 'A row of five finished granite monuments in black, red, green and grey standing on the workshop floor under the shed lights' },
  { img: '/assets/monuments/m16.jpg',
    caption: 'Slab stock and assembly area',
    alt: 'An assembled granite memorial surrounded by stacked slabs and offcuts in the assembly area of the facility' },
];

export const getStone = id => GRANITES.find(g => g.id === id);

/**
 * Images for a stone's detail gallery.
 *
 * A stone shows a gallery as soon as it has more than one entry; with a single
 * image the carousel renders no arrows or dots. To add views for a stone, give
 * it an `images` array — each entry `{ src, alt }` — e.g.
 *
 *   { id: 'indian-aurora', …, images: [
 *       { src: '/assets/granite/indian-aurora.jpg',        alt: 'Indian Aurora slab, polished' },
 *       { src: '/assets/granite/indian-aurora-book.jpg',   alt: 'Book-matched pair' },
 *     ] }
 *
 * `img` stays the single thumbnail used by the grid, home page and articles.
 */
export const stoneImages = g =>
  (g.images && g.images.length)
    ? g.images
    : [{ src: g.img, alt: `${g.name} — full slab` }];

/**
 * Client testimonials.
 *
 * Placeholder content for design review — the quotes, names and companies are
 * invented. Every entry carries `sample: true`, and testimonials.js never
 * renders one that does — the page shows its empty state until real, approved
 * quotes are added. Delete these samples once there are real ones.
 *
 * Real entries are the same shape, minus the flag.
 */
export const TESTIMONIALS = [
  { sample: true,
    quote: 'The block photo set is what won us over. Four faces, water-washed, sent with the offer — we could grade the lot before committing, which no other supplier we deal with does as standard.',
    name: 'Lena Tan', company: 'Eastpoint Stone & Tile', country: 'Singapore' },
  { sample: true,
    quote: 'We run repeat orders of the same green across three container loads a year. The colour has matched every time. For a natural stone that is not a small thing.',
    name: 'Andreas Brandt', company: 'Brandt Natursteinimport', country: 'Germany' },
  { sample: true,
    quote: 'Slabs arrive crated properly — bundle-numbered, fumigated timber, A-frames that hold. In eight shipments we have had one edge chip. Our old supplier averaged a dozen.',
    name: 'Joost van Dijk', company: 'Deltagevel Facades', country: 'Netherlands' },
  { sample: true,
    quote: 'They quote inside a working day and the quote holds. When a gangsaw lot ran late they told us before we had to ask, which mattered more than the delay itself.',
    name: 'Mikhail Orlov', company: 'Severny Memorials', country: 'Russia' },
  { sample: true,
    quote: 'We asked for a leathered finish on a red they had only ever polished. They ran a sample, sent photographs, and had the finish right on the second attempt.',
    name: 'Nguyen Thanh Hai', company: 'An Phu Stone', country: 'Vietnam' },
  { sample: true,
    quote: 'Thickness tolerance is the reason we keep buying. At 3cm we are measuring within half a millimetre across the slab, so our fabrication waste has dropped noticeably.',
    name: 'Anita Raghavan', company: 'Raghavan Granites', country: 'India' },
];
