/**
 * Swasim Granite — content model.
 *
 * This is the single source of truth for everything the site renders:
 * stones, process, markets and articles. Pages import from here,
 * so copy changes happen in one place and never in markup.
 */

export const COMPANY = {
  name: 'Swasim Granite',
  founded: 2010,
  md: 'Roopesh Kumar',
  location: 'Hosur, Tamil Nadu, India',
  address: '1279/18281, Samanapalli Road, Kammandhoddi Village, Shoolagiri Taluk, Krishnagiri District, Tamil Nadu 635117, India',
  phone: '+91 94488 41482',
  phoneHref: '+919448841482',
  email: 'swasimgranite@gmail.com',
  markets: ['India', 'Vietnam', 'Singapore', 'Russia', 'Europe', 'Middle East'],
};

/** WhatsApp chat link, on the same number as the phone. */
export const WHATSAPP = `https://wa.me/${COMPANY.phoneHref.replace('+', '')}`;

/** Google Maps search for the plant, used by the footer address. The contact
    page's "Get directions" button (tools/pages.py) runs the same query. */
export const MAPS = 'https://www.google.com/maps/search/?api=1&query=1279%2F18281%2C+Samanapalli+Road%2C+Kammandhoddi+Village%2C+Shoolagiri%2C+Krishnagiri%2C+Tamil+Nadu+635117';

/* Footer icon links, in display order. An entry without an `href` shows its
   icon but is not a link. `label` is what a screen reader announces for the
   link. The three profile URLs are also the JSON-LD `sameAs` in tools/pages.py. */
export const SOCIAL = [
  { key: 'facebook',  label: 'Swasim Granite on Facebook',  href: 'https://www.facebook.com/Swasimgranite/' },
  { key: 'instagram', label: 'Swasim Granite on Instagram', href: 'https://www.instagram.com/swasimgranite/' },
  { key: 'whatsapp',  label: 'Message us on WhatsApp',      href: WHATSAPP },
  { key: 'linkedin',  label: 'Swasim Granite on LinkedIn',  href: 'https://www.linkedin.com/company/swasim-granite' },
  { key: 'email',     label: `Email ${COMPANY.email}`,       href: `mailto:${COMPANY.email}` },
  { key: 'phone',     label: `Call ${COMPANY.phone}`,        href: `tel:${COMPANY.phoneHref}` },
];

export const FINISHES = ['Polished', 'Honed', 'Leathered', 'Flamed'];

/* The collection, in catalogue order. `facts` are the client's own descriptions
   (Sep 2026) and fill the catalogue detail; `origin` is the short label on
   cards, chips and the hero. Ids never change, so links keep working.

   A stone without a photograph (`img: null`) is held back from every page by
   the filter at the end, and appears on its own once its photo is added. */
const ALL_GRANITES = [
  // Ultimate Black and Absolute Black are one stone to the client: one entry
  // with both photographs. `black-absolute` keeps the id the hero uses.
  { id: 'black-absolute', name: 'Ultimate / Absolute Black', type: 'Premium', origin: 'SOUTH INDIA',
    tagline: 'DEEP UNIFORM BLACK', img: '/assets/granite/black-absolute.jpg',
    images: [
      { src: '/assets/granite/black-absolute.jpg', alt: 'Polished Ultimate / Absolute Black granite: a deep, uniform black' },
      { src: '/assets/granite/ultimate-black.jpg', alt: 'A second slab of Ultimate / Absolute Black granite' },
    ],
    facts: {
      origin: 'India, primarily quarried in South India, including Karnataka, Telangana and Andhra Pradesh.',
      foundIn: 'Major quarrying regions include Chamarajanagar, Warangal, Khammam and Kanigiri.',
      applications: 'Kitchen countertops, flooring, staircases, wall cladding, façades, monuments and commercial interiors.',
      properties: 'Deep black colour, fine grain, high durability, low porosity and water absorption, excellent scratch and wear resistance, and a high-quality polish.' } },

  { id: 'ivory-brown', name: 'Ivory Brown / Shivakasi Brown', type: 'Commercial', origin: 'TAMIL NADU',
    tagline: 'WARM IVORY & BROWN', img: '/assets/granite/ivory-brown.jpg',
    facts: {
      origin: 'India, primarily quarried in Tamil Nadu.',
      foundIn: 'Shivakasi and surrounding regions of Tamil Nadu.',
      applications: 'Countertops, flooring, staircases, wall cladding, façades, vanities and monuments.',
      properties: 'Warm brown and ivory tones with natural black, grey and burgundy mineral patterns. Durable, hard, low-porosity and resistant to heat, scratches and everyday wear.' } },

  // Two views, so this stone shows a gallery (arrows, dots, swipe). Add more
  // entries to `images` to extend it; `img` stays the single grid thumbnail.
  { id: 'indian-aurora', name: 'Indian Aurora', type: 'Exotic', origin: 'SOUTH INDIA',
    tagline: 'FLOWING WARM TONES', img: '/assets/granite/indian-aurora-slab.jpg',
    images: [
      { src: '/assets/granite/indian-aurora-slab.jpg',
        alt: 'A full polished Indian Aurora slab standing on trestles, with the rest of the bundle stacked behind it' },
      { src: '/assets/granite/indian-aurora.jpg',
        alt: 'Close detail of Indian Aurora, showing its flowing banding' },
    ],
    facts: {
      origin: 'India, primarily quarried in southern India.',
      foundIn: 'Karnataka and Andhra Pradesh.',
      applications: 'Countertops, flooring, staircases, wall cladding, façades, vanities and monuments.',
      properties: 'Warm brown, grey and cream tones with flowing natural patterns. Durable, hard, low-porosity and resistant to scratches, heat and everyday wear.' } },

  { id: 'viscount-white', name: 'Viscount White', type: 'Premium', origin: 'ANDHRA PRADESH',
    tagline: 'MARBLE-LIKE VEINING', img: '/assets/granite/viscount-white.jpg',
    facts: {
      origin: 'India, primarily quarried in Andhra Pradesh.',
      foundIn: 'The Ongole region of Andhra Pradesh.',
      applications: 'Countertops, flooring, staircases, wall cladding, façades, vanities and commercial interiors.',
      properties: 'Light grey to white base with flowing dark grey veins and subtle mineral patterns. Durable, hard, low-porosity and resistant to scratches, heat and everyday wear.' } },

  { id: 'tan-brown', name: 'Tan Brown', type: 'Commercial', origin: 'TELANGANA',
    tagline: 'HIGH-VOLUME WORKHORSE', img: '/assets/granite/tan-brown.jpg',
    facts: {
      origin: 'India, primarily quarried in Telangana.',
      foundIn: 'Karimnagar region of Telangana.',
      applications: 'Countertops, flooring, staircases, wall cladding, façades, vanities and monuments.',
      properties: 'Rich brown background with black and burgundy mineral patterns. Durable, hard, low-porosity and resistant to heat, scratches and everyday wear.' } },

  { id: 'blue-pearl', name: 'Blue Pearl', type: 'Exotic', origin: 'NORWAY',
    tagline: 'SILVER-BLUE SHIMMER', img: '/assets/granite/blue-pearl.jpg',
    facts: {
      origin: 'Norway.',
      foundIn: 'Larvik region of Norway.',
      applications: 'Countertops, flooring, wall cladding, façades, staircases and monuments.',
      properties: 'Distinctive blue-grey background with shimmering silver and blue feldspar crystals. Highly durable, hard, low-porosity and resistant to heat, scratches and everyday wear.' } },

  { id: 'emerald-green', name: 'Emerald Green', type: 'Premium', origin: 'INDIA',
    tagline: 'RICH DEEP GREEN', img: '/assets/granite/emerald-green.jpg',
    facts: {
      origin: 'India.',
      foundIn: 'Rajasthan and Karnataka, depending on the variety and quarry source.',
      applications: 'Countertops, flooring, wall cladding, staircases, façades and monuments.',
      properties: 'Rich green colour with natural black and darker green patterns. Durable, hard, low-porosity and resistant to heat, scratches and everyday wear.' } },

  { id: 'imperial-red', name: 'Imperial Red', type: 'Exotic', origin: 'SOUTH INDIA',
    tagline: 'DEEP RED FELDSPAR', img: '/assets/granite/imperial-red.jpg',
    facts: {
      origin: 'India.',
      foundIn: 'Primarily Telangana and Karnataka.',
      applications: 'Countertops, flooring, staircases, wall cladding, façades, monuments and memorials.',
      properties: 'Rich red background with black and grey mineral patterns. Highly durable, hard, low-porosity and resistant to heat, scratches and everyday wear.' } },

  { id: 'red-multi', name: 'Multi Red', type: 'Commercial', origin: 'SOUTH INDIA',
    tagline: 'HIGH-CONTRAST FIELD', img: '/assets/granite/red-multi.jpg',
    facts: {
      origin: 'India.',
      foundIn: 'Primarily Telangana, Karnataka and Andhra Pradesh.',
      applications: 'Countertops, flooring, staircases, wall cladding, façades, monuments and memorials.',
      properties: 'Vibrant red base with black, brown and grey mineral patterns. Durable, hard, low-porosity and resistant to heat, scratches and everyday wear.' } },

  { id: 'hassan-green', name: 'Hassan Green', type: 'Premium', origin: 'KARNATAKA',
    tagline: 'DEEP QUARRY GREEN', img: '/assets/granite/hassan-green.jpg',
    facts: {
      origin: 'India.',
      foundIn: 'Hassan district, Karnataka.',
      applications: 'Countertops, flooring, staircases, wall cladding, façades, monuments and landscaping.',
      properties: 'Deep green to dark green colour with natural black and grey mineral patterns. Durable, hard, low-porosity and resistant to heat, scratches and everyday wear.' } },

  { id: 'indian-juparana', name: 'Indian Juparana', type: 'Premium', origin: 'SOUTH INDIA',
    tagline: 'WARM WAVY MOVEMENT', img: '/assets/granite/indian-juparana.jpg',
    facts: {
      origin: 'India.',
      foundIn: 'Primarily Tamil Nadu and Karnataka.',
      applications: 'Countertops, flooring, staircases, wall cladding, façades, vanities and monuments.',
      properties: 'Warm cream, pink, brown and grey tones with flowing, wavy mineral patterns. Durable, hard, low-porosity and resistant to heat, scratches and everyday wear.' } },

  { id: 'green-marble', name: 'Green Marble', type: 'Exotic', origin: 'RAJASTHAN',
    tagline: 'FLOWING VEIN MARBLE', img: '/assets/granite/green-marble.jpg',
    facts: {
      origin: 'India.',
      foundIn: 'Rajasthan, particularly the Udaipur and Rajsamand regions.',
      applications: 'Flooring, wall cladding, countertops, staircases, bathrooms, temples and decorative interiors.',
      properties: 'Rich green colour with natural veining and patterns. Smooth, elegant, durable and suitable for both residential and commercial interiors.' } },

  { id: 'kuppam-green', name: 'Kuppam Green', type: 'Commercial', origin: 'ANDHRA PRADESH',
    tagline: 'FLOWING GREY-GREEN WAVES', img: '/assets/granite/kuppam-green.jpg',
    facts: {
      origin: 'India.',
      foundIn: 'Kuppam region, Andhra Pradesh.',
      applications: 'Countertops, flooring, staircases, wall cladding, façades, monuments and landscaping.',
      properties: 'Dark to medium green base with black and grey mineral patterns. Durable, hard, low-porosity and resistant to heat, scratches and everyday wear.' } },

  // No photograph yet, so held back (see above). Add the master to
  // source-assets/granite/ and GRANITE_NAMES, run `npm run images`, set `img`.
  { id: 'black-galaxy', name: 'Black Galaxy', type: 'Premium', origin: 'ANDHRA PRADESH',
    tagline: 'GOLDEN BRONZE FLECK', img: null,
    facts: {
      origin: 'India.',
      foundIn: 'Ongole region, Andhra Pradesh.',
      applications: 'Countertops, flooring, staircases, wall cladding, façades, vanities and monuments.',
      properties: 'Deep black background with distinctive golden and bronze flecks. Highly durable, hard, low-porosity and resistant to heat, scratches and everyday wear.' } },
];

export const GRANITES = ALL_GRANITES.filter(g => g.img);

/**
 * Homepage hero carousel, in the order shown. Each slide is a photograph with
 * two caption lines laid over it: { img, name, kicker, alt }.
 *
 * A catalogue stone can be a slide by id — { stone: 'viscount-white' } — and its
 * photograph, name and "TYPE · ORIGIN" kicker come from GRANITES, so the hero
 * cannot disagree with the catalogue. Add `kicker` to override that line.
 *
 * Photographs for img slides go in source-assets/hero/, then `npm run images`.
 * The first slide is the homepage's largest paint and tools/pages.py preloads
 * it, so run `npm run pages` after changing which slide comes first.
 */
export const HERO = [
  // Quarry photographs: confirm they are the client's own, and licensed, before launch.
  { img: '/assets/hero/quarry-1.jpg', name: 'From the quarry face', kicker: 'QUARRYING · BENCH EXTRACTION',
    alt: 'A quarry cut into stepped benches of pale grey stone, with an excavator working a pile of broken blocks and a truck on the haul road below' },
  { img: '/assets/hero/quarry-2.jpg', name: 'Where every block begins', kicker: 'QUARRYING · OPEN PIT',
    alt: 'An open-pit stone quarry seen from above: stepped grey benches cut down to a turquoise pool, with trees along the rim' },
  // Monuments from the catalogue gallery (MONUMENTS below): m10, m04, m44.
  // focus: 'top' keeps the top of a tall photo in view in the wide desktop frame.
  { img: '/assets/monuments/m10.jpg', focus: 'top', name: 'Heart & wings memorial', kicker: 'MONUMENTS · BLACK GRANITE',
    alt: 'A polished black granite headstone shaped as a heart held between carved wings, standing in the workshop' },
  { img: '/assets/monuments/m04.jpg', focus: 'top', name: 'Memorial set LPS-2', kicker: 'MONUMENT SET · 170 × 75',
    alt: 'A complete memorial set on the workshop floor: a two-piece black granite headstone above a cream granite ledger and base, labelled LPS-2 on a chalkboard' },
  { img: '/assets/monuments/m44.jpg', name: 'Angel & heart memorial', kicker: 'MONUMENTS · HAND-CARVED',
    alt: 'A grey granite memorial carved as an angel with folded wings around a heart-shaped tablet' },
  { stone: 'black-absolute' },
  { stone: 'viscount-white' },
].map(h => {
  if (!h.stone) return h;
  const g = GRANITES.find(s => s.id === h.stone);
  return { img: g.img, name: g.name, kicker: `${g.type} · ${g.origin}`.toUpperCase(),
           alt: `Polished ${g.name} slab`, ...h };
});

export const STATS = [
  { n: '2010', l: 'FOUNDED IN HOSUR' },
  { n: '100%', l: 'IN-HOUSE PROCESS' },
  { n: '8',    l: 'STEP QUARRY-TO-EXPORT JOURNEY' },
];

export const HOME_BADGES = [
  { big: '2010', small: 'FOUNDED IN HOSUR' },
  { big: '8',    small: 'QUARRY-TO-EXPORT STEPS' },   // the JOURNEY list below
  { big: '100%', small: 'IN-HOUSE PROCESS' },
];

export const PRODUCTS = [
  { t: 'Granite Blocks', d: 'Sourced and selected for consistency in colour, grain, and strength, and ready for processing or direct export.' },
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
  'Factory Inspection', 'Pre-Packing Inspection', 'Packing', 'Logistics',
];

/** About page, Infrastructure & Capabilities: the plant's machines, in the order
    a block moves through them. The figures are the client's. */
export const CAPABILITIES = [
  { t: 'Cutting Machine',          d: '5-blade cutting machine that cuts blocks up to 4 feet.' },
  { t: 'Edge Cutting Machine',     d: '250mm edge cutting machine for precision sizing.' },
  { t: 'Line Polishing Machine',   d: 'Line polishing for thicknesses up to 80mm.' },
  { t: 'Hand Polishing',           d: 'Hand polishing, suitable for any thickness.' },
  { t: 'Lift / Material Handling', d: '5-ton capacity lift for handling finished product.' },
  { t: 'Loading Facility',         d: 'Dual loading, supporting both manual and machine-assisted loading.' },
];

export const VALUES = [
  { t: 'Quality you can see', d: 'Every block is selected and every slab finished to a standard we would put our own name on.' },
  { t: 'Consistency you can rely on', d: 'The same in-house process, run the same way, so a repeat order matches the first one.' },
  { t: 'Service that keeps clients coming back', d: 'Year after year, across India and international markets, on the strength of the relationship, not just the stone.' },
];

/* Home page affiliations. `role` is Swasim's relationship to each body: confirm
   the wording with the client before launch. `logo` ({ src, w, h }, a file in
   /assets/affiliations/) shows at the top of the tile once set; use a body's
   logo only with its permission. */
export const AFFILIATIONS = [
  { abbr: 'CAPEXIL', role: 'Member exporter',
    logo: { src: '/assets/affiliations/capexil.png', w: 111, h: 112 },
    name: 'Chemicals and Allied Products Export Promotion Council',
    note: 'The export promotion council for granite, natural stone and allied products, set up by the Government of India.' },
  { abbr: 'DGFT', role: 'Registered exporter (IEC)',
    logo: { src: '/assets/affiliations/dgft.png', w: 67, h: 112 },
    name: 'Directorate General of Foreign Trade',
    note: 'The Government of India authority for foreign trade, under the Ministry of Commerce and Industry.' },
  { abbr: 'STONA', role: 'Exhibition participant',
    logo: { src: '/assets/affiliations/stona.png', w: 104, h: 112 },
    name: 'International Granite and Stone Exhibition',
    note: 'The international granite and stone trade fair held in Bengaluru.' },
];

/** Export markets plotted on the About page world map. */
export const MARKETS = [
  { key: 'india', name: 'India', countries: ['India'],
    since: 'Since 2010', lead: 'Home market, served from Hosur, Tamil Nadu.',
    body: 'Our founding market. Blocks, slabs and cut-to-size supplied to fabricators and builders across India, delivered direct from the Hosur facility.',
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
    body: 'Black and red granite monuments, headstones and cut-to-size memorial components. Each is carved and finished in-house, then bundle-numbered for the yard that receives it.',
    facts: ['Monuments & memorials', 'Black · red granite', 'Bundle-numbered crates'] },

  { key: 'europe', name: 'Europe',
    countries: ['Germany', 'France', 'Italy', 'Netherlands', 'Belgium', 'Spain', 'Poland', 'United Kingdom'],
    since: 'Since 2021', lead: 'Specification-grade slabs and cladding.',
    body: 'Supply to importers and façade contractors who need documented tolerances and repeatable colour across containers. Every slab is inspected twice: once at the factory and once before packing.',
    facts: ['Facade & cladding', 'Documented tolerances', 'Two-stage inspection'] },

  // Countries are an assumption (the Gulf states) pending client confirmation.
  // No `since` until the client gives a year — the panel omits the label.
  { key: 'middle-east', name: 'Middle East',
    countries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Oman', 'Kuwait'],
    lead: 'Slabs and cut-to-size for Gulf projects.',
    body: 'Polished slabs, tiles and cut-to-size granite for importers and contractors across the Gulf, shipped FOB Chennai or Tuticorin in fumigated crates and lot-matched so a large project stays consistent from the first container to the last.',
    facts: ['FOB Chennai or Tuticorin', 'Slabs · tiles · cut-to-size', 'Lot-matched containers'] },
];

/* Order here is the order on /articles: the first entry is the lead feature,
   and the topic chips follow the order in which each tag first appears. */
export const ARTICLES = [
  { id: 'reading-a-block-photo', tag: 'FROM THE YARD', date: 'Jul 2026', read: '5 min read',
    title: 'How to read a block photo set before you commit to a lot',
    excerpt: 'Four faces, water-washed, in daylight. What the corners tell you about yield, and the three things a single glamour shot always hides.' },
  { id: 'inspection-twice', tag: 'PROCESS', date: 'Apr 2026', read: '3 min read',
    title: 'Why we inspect every slab twice',
    excerpt: 'Once on the factory floor, once again before packing. The second pass catches what handling introduces, not what cutting left behind.' },
  { id: 'finishes-explained', tag: 'TECHNICAL', date: 'Jun 2026', read: '4 min read',
    title: 'Where each finish belongs: polished, honed, leathered and flamed',
    excerpt: 'Gloss is not the same as quality. A practical map of finish to application, from wet-area flooring to exterior cladding bands.' },
  { id: 'monument-lead-times', tag: 'MONUMENTS', date: 'Mar 2026', read: '5 min read',
    title: 'Planning monument lead times around carving capacity',
    excerpt: 'Carving is the bottleneck, not sawing. How to sequence a memorial order so the finishing line never sits idle.' },
  { id: 'export-packing', tag: 'LOGISTICS', date: 'May 2026', read: '7 min read',
    title: 'What good export packing actually looks like',
    excerpt: 'A-frames, fumigated timber, bundle numbering and lot-matched loading. Why the crate matters as much as the stone inside it.' },
  { id: 'granite-vs-quartz', tag: 'BUYER GUIDE', date: 'Aug 2026', read: '6 min read',
    title: 'Granite or engineered quartz: how to choose for a countertop run',
    excerpt: 'Heat tolerance, seam behaviour and long-run cost differ more than the showroom sample suggests. What we tell fabricators before a large order.' },
];

export const BROCHURE_CONTENTS = [
  'Full granite collection: blocks, slabs, tiles and cut-to-size',
  'Granite monuments and custom stone solutions',
  'Available finishes and specifications',
  'The quarry-to-delivery process, step by step',
  'Export markets and contact details',
];

export const OFFICE_HOURS = [
  { k: 'MON – SAT', v: '09:00 – 18:30 IST' },
  { k: 'PLANT VISITS', v: 'By appointment, Hosur' },
  { k: 'CLOSED', v: 'During Amavasya (new moon day)' },
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
    caption: 'The plant and stone yard at the Hosur facility',
    alt: 'The Swasim Granite plant seen from the road: a large white processing shed on the left, and an orange gantry crane lettered “Swasim Granite” spanning a yard of stacked granite blocks and slabs, behind the compound wall' },
  { img: '/assets/monuments/m27.jpg',
    caption: 'A hand-carved Nandi pair in progress',
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
    : [{ src: g.img, alt: `Full slab of ${g.name}` }];

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
    quote: 'The block photo set is what won us over. Four faces, water-washed, sent with the offer. We could grade the lot before committing, which no other supplier we deal with does as standard.',
    name: 'Lena Tan', company: 'Eastpoint Stone & Tile', country: 'Singapore' },
  { sample: true,
    quote: 'We run repeat orders of the same green across three container loads a year. The colour has matched every time. For a natural stone that is not a small thing.',
    name: 'Andreas Brandt', company: 'Brandt Natursteinimport', country: 'Germany' },
  { sample: true,
    quote: 'Slabs arrive crated properly: bundle-numbered, in fumigated timber, on A-frames that hold. In eight shipments we have had one edge chip. Our old supplier averaged a dozen.',
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
