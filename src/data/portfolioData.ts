/**
 * Lakshan Manohara Photography — Portfolio Data
 *
 * Dynamically imports images from src/assets/portfolio/ subfolders:
 *  - graduations/
 *  - birthdays/
 *  - weddings/
 *  - couples/
 *  - events/
 *
 * If a folder contains local images, they will be dynamically loaded and displayed.
 * If a folder is empty (or only has .gitkeep), high-quality curated fallbacks
 * will be used seamlessly.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export type CategoryLabel =
  | 'All'
  | 'Graduations & Convocations'
  | 'Birthday & Milestone Shoots'
  | 'Weddings & Homecomings'
  | 'Couples & Casual Shoots'
  | 'Events & Commercial';

export type AspectRatioKey = '2:3' | '3:4' | '4:5' | '3:2' | '16:9' | '1:1';

export interface ExifData {
  camera: string;
  lens: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: Exclude<CategoryLabel, 'All'>;
  location: string;
  aspectRatio: AspectRatioKey;
  exif: ExifData;
  src: string;
  srcFull: string;
  width: number;
  height: number;
  alt: string;
}

// ─── Filter Categories ───────────────────────────────────────────────────────

export const CATEGORIES: CategoryLabel[] = [
  'All',
  'Graduations & Convocations',
  'Birthday & Milestone Shoots',
  'Weddings & Homecomings',
  'Couples & Casual Shoots',
  'Events & Commercial',
];

// ─── Fallback Curated Placeholders ──────────────────────────────────────────

const BASE = 'https://images.unsplash.com/photo-';

function thumb(id: string, w: number, h: number): string {
  return `${BASE}${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}

function full(id: string): string {
  return `${BASE}${id}?w=2000&auto=format&q=90`;
}

export const fallbackPortfolioItems: PortfolioItem[] = [
  // ══ GRADUATIONS & CONVOCATIONS ════════════════════════════════════════════
  {
    id: 'g-001',
    title: 'Honours Convocation Portrait',
    category: 'Graduations & Convocations',
    location: 'BMICH, Colombo',
    aspectRatio: '2:3',
    exif: { camera: 'Sony A7 IV', lens: '85mm f/1.4 GM', aperture: 'f/1.4', shutterSpeed: '1/800s', iso: 'ISO 100' },
    src: thumb('1627556704302-624286467c65', 800, 1200),
    srcFull: full('1627556704302-624286467c65'),
    width: 800,
    height: 1200,
    alt: 'Honours convocation portrait at BMICH Colombo',
  },
  {
    id: 'g-002',
    title: 'Cap & Gown Milestone',
    category: 'Graduations & Convocations',
    location: 'University of Kelaniya',
    aspectRatio: '3:4',
    exif: { camera: 'Sony A7 IV', lens: '50mm f/1.2 GM', aperture: 'f/1.8', shutterSpeed: '1/500s', iso: 'ISO 200' },
    src: thumb('1523580494863-6f3031224c94', 800, 1067),
    srcFull: full('1523580494863-6f3031224c94'),
    width: 800,
    height: 1067,
    alt: 'Graduation portrait in cap and gown University of Kelaniya',
  },
  {
    id: 'g-003',
    title: 'Academic Excellence Ceremony',
    category: 'Graduations & Convocations',
    location: 'SLIIT Auditorium, Malabe',
    aspectRatio: '3:2',
    exif: { camera: 'Sony A7 IV', lens: '24-70mm f/2.8 GM II', aperture: 'f/2.8', shutterSpeed: '1/320s', iso: 'ISO 800' },
    src: thumb('1541339907198-e08756dedf3f', 1200, 800),
    srcFull: full('1541339907198-e08756dedf3f'),
    width: 1200,
    height: 800,
    alt: 'Academic excellence graduation ceremony at SLIIT Malabe',
  },
  {
    id: 'g-004',
    title: 'Golden Scroll Moment',
    category: 'Graduations & Convocations',
    location: 'Bandaranaike Memorial Hall, Colombo',
    aspectRatio: '3:4',
    exif: { camera: 'Sony A7 IV', lens: '85mm f/1.4 GM', aperture: 'f/1.4', shutterSpeed: '1/640s', iso: 'ISO 400' },
    src: thumb('1469371670807-013ccf25f16a', 800, 1067),
    srcFull: full('1469371670807-013ccf25f16a'),
    width: 800,
    height: 1067,
    alt: 'Golden scroll diploma moment at Bandaranaike Memorial Hall Colombo',
  },

  // ══ BIRTHDAY & MILESTONE SHOOTS ═══════════════════════════════════════════
  {
    id: 'b-001',
    title: '21st Birthday Editorial Shoot',
    category: 'Birthday & Milestone Shoots',
    location: 'Colombo City Hotel',
    aspectRatio: '2:3',
    exif: { camera: 'Sony A7 IV', lens: '85mm f/1.4 GM', aperture: 'f/1.4', shutterSpeed: '1/800s', iso: 'ISO 200' },
    src: thumb('1494790108377-be9c29b29330', 800, 1200),
    srcFull: full('1494790108377-be9c29b29330'),
    width: 800,
    height: 1200,
    alt: '21st birthday editorial portrait shoot at Colombo City Hotel',
  },
  {
    id: 'b-002',
    title: 'Milestone Celebration Story',
    category: 'Birthday & Milestone Shoots',
    location: 'Cinnamon Life, Colombo',
    aspectRatio: '3:2',
    exif: { camera: 'Sony A7 IV', lens: '35mm f/1.4 GM', aperture: 'f/2.0', shutterSpeed: '1/640s', iso: 'ISO 400' },
    src: thumb('1513151233558-d860c5398176', 1200, 800),
    srcFull: full('1513151233558-d860c5398176'),
    width: 1200,
    height: 800,
    alt: 'Milestone birthday celebration story at Cinnamon Life Colombo',
  },
  {
    id: 'b-003',
    title: 'Sweet Sixteen Portrait',
    category: 'Birthday & Milestone Shoots',
    location: 'Nelum Pokuna, Colombo',
    aspectRatio: '3:4',
    exif: { camera: 'Sony A7 IV', lens: '85mm f/1.4 GM', aperture: 'f/1.8', shutterSpeed: '1/500s', iso: 'ISO 100' },
    src: thumb('1487412720507-e7ab37603c6f', 800, 1067),
    srcFull: full('1487412720507-e7ab37603c6f'),
    width: 800,
    height: 1067,
    alt: 'Sweet sixteen birthday portrait at Nelum Pokuna Colombo',
  },
  {
    id: 'b-004',
    title: 'Golden Birthday Editorial',
    category: 'Birthday & Milestone Shoots',
    location: 'Galle Fort, Southern Province',
    aspectRatio: '16:9',
    exif: { camera: 'Sony A7 IV', lens: '24-70mm f/2.8 GM II', aperture: 'f/2.8', shutterSpeed: '1/1000s', iso: 'ISO 100' },
    src: thumb('1506794778202-cad84cf45f1d', 1600, 900),
    srcFull: full('1506794778202-cad84cf45f1d'),
    width: 1600,
    height: 900,
    alt: 'Golden birthday editorial shoot at Galle Fort Southern Province',
  },

  // ══ WEDDINGS & HOMECOMINGS ════════════════════════════════════════════════
  {
    id: 'w-001',
    title: 'Champagne Bridal Portrait',
    category: 'Weddings & Homecomings',
    location: 'Mount Lavinia Hotel, Colombo',
    aspectRatio: '3:4',
    exif: { camera: 'Sony A7 IV', lens: '85mm f/1.4 GM', aperture: 'f/1.8', shutterSpeed: '1/500s', iso: 'ISO 200' },
    src: thumb('1606216794074-735e91aa2c92', 800, 1067),
    srcFull: full('1606216794074-735e91aa2c92'),
    width: 800,
    height: 1067,
    alt: 'Champagne bridal portrait at Mount Lavinia Hotel Colombo',
  },
  {
    id: 'w-002',
    title: 'Golden Vows at Sunset',
    category: 'Weddings & Homecomings',
    location: 'Galle Face Green, Colombo',
    aspectRatio: '3:2',
    exif: { camera: 'Sony A7 IV', lens: '35mm f/1.4 GM', aperture: 'f/2.0', shutterSpeed: '1/1000s', iso: 'ISO 100' },
    src: thumb('1519741497674-611481863552', 1200, 800),
    srcFull: full('1519741497674-611481863552'),
    width: 1200,
    height: 800,
    alt: 'Wedding couple golden hour at Galle Face Green Colombo',
  },
  {
    id: 'w-003',
    title: 'Bespoke Wedding Coverage',
    category: 'Weddings & Homecomings',
    location: 'Cinnamon Grand, Colombo',
    aspectRatio: '2:3',
    exif: { camera: 'Sony A7 IV', lens: '85mm f/1.4 GM', aperture: 'f/1.4', shutterSpeed: '1/640s', iso: 'ISO 200' },
    src: thumb('1583939003579-730e3918a45a', 800, 1200),
    srcFull: full('1583939003579-730e3918a45a'),
    width: 800,
    height: 1200,
    alt: 'Bespoke wedding coverage at Cinnamon Grand Colombo',
  },
  {
    id: 'w-004',
    title: 'Heritage Homecoming',
    category: 'Weddings & Homecomings',
    location: 'Galle Fort Ramparts',
    aspectRatio: '3:4',
    exif: { camera: 'Sony A7 IV', lens: '50mm f/1.2 GM', aperture: 'f/2.8', shutterSpeed: '1/320s', iso: 'ISO 400' },
    src: thumb('1552053831-71f68f2f6e78', 800, 1067),
    srcFull: full('1552053831-71f68f2f6e78'),
    width: 800,
    height: 1067,
    alt: 'Heritage homecoming couple portrait at Galle Fort',
  },

  // ══ COUPLES & CASUAL SHOOTS ═══════════════════════════════════════════════
  {
    id: 'c-001',
    title: 'Golden Hour Couple Story',
    category: 'Couples & Casual Shoots',
    location: 'Galle Fort, Southern Province',
    aspectRatio: '16:9',
    exif: { camera: 'Sony A7 IV', lens: '85mm f/1.4 GM', aperture: 'f/1.8', shutterSpeed: '1/1000s', iso: 'ISO 100' },
    src: thumb('1516589178581-6cd7833ae3b2', 1600, 900),
    srcFull: full('1516589178581-6cd7833ae3b2'),
    width: 1600,
    height: 900,
    alt: 'Golden hour couple story at Galle Fort Southern Province',
  },
  {
    id: 'c-002',
    title: 'Monsoon Romance',
    category: 'Couples & Casual Shoots',
    location: 'Kandy Lake, Kandy',
    aspectRatio: '2:3',
    exif: { camera: 'Sony A7 IV', lens: '85mm f/1.4 GM', aperture: 'f/1.4', shutterSpeed: '1/800s', iso: 'ISO 200' },
    src: thumb('1515552726023-7125c8d07fb3', 800, 1200),
    srcFull: full('1515552726023-7125c8d07fb3'),
    width: 800,
    height: 1200,
    alt: 'Romantic couple portrait at Kandy Lake',
  },
  {
    id: 'c-003',
    title: 'Beach Bliss Session',
    category: 'Couples & Casual Shoots',
    location: 'Mirissa Beach',
    aspectRatio: '3:2',
    exif: { camera: 'Sony A7 IV', lens: '35mm f/1.4 GM', aperture: 'f/2.0', shutterSpeed: '1/1250s', iso: 'ISO 100' },
    src: thumb('1533636721434-0e2d61030955', 1200, 800),
    srcFull: full('1533636721434-0e2d61030955'),
    width: 1200,
    height: 800,
    alt: 'Couple beach session at Mirissa Beach Sri Lanka',
  },
  {
    id: 'c-004',
    title: 'Urban Love Stories',
    category: 'Couples & Casual Shoots',
    location: 'Colombo 07 Streets',
    aspectRatio: '3:4',
    exif: { camera: 'Sony A7 IV', lens: '50mm f/1.2 GM', aperture: 'f/1.8', shutterSpeed: '1/500s', iso: 'ISO 400' },
    src: thumb('1539571696357-5a69c17a67c6', 800, 1067),
    srcFull: full('1539571696357-5a69c17a67c6'),
    width: 800,
    height: 1067,
    alt: 'Urban couple casual shoot at Colombo 07',
  },

  // ══ EVENTS & COMMERCIAL ════════════════════════════════════════════════════
  {
    id: 'e-001',
    title: 'Annual Gala Coverage',
    category: 'Events & Commercial',
    location: 'Shangri-La Hotel, Colombo',
    aspectRatio: '3:2',
    exif: { camera: 'Sony A7 IV', lens: '24-70mm f/2.8 GM II', aperture: 'f/2.8', shutterSpeed: '1/250s', iso: 'ISO 1600' },
    src: thumb('1540575467063-178a50c2df87', 1200, 800),
    srcFull: full('1540575467063-178a50c2df87'),
    width: 1200,
    height: 800,
    alt: 'Annual gala event coverage at Shangri-La Hotel Colombo',
  },
  {
    id: 'e-002',
    title: 'Executive Portrait Series',
    category: 'Events & Commercial',
    location: 'World Trade Centre, Colombo',
    aspectRatio: '3:4',
    exif: { camera: 'Sony A7 IV', lens: '85mm f/1.4 GM', aperture: 'f/1.8', shutterSpeed: '1/320s', iso: 'ISO 400' },
    src: thumb('1507003211169-0a1dd7228f2d', 800, 1067),
    srcFull: full('1507003211169-0a1dd7228f2d'),
    width: 800,
    height: 1067,
    alt: 'Executive portrait series at World Trade Centre Colombo',
  },
  {
    id: 'e-003',
    title: 'Tech Summit 2025',
    category: 'Events & Commercial',
    location: 'BMICH, Colombo',
    aspectRatio: '16:9',
    exif: { camera: 'Sony A7 IV', lens: '24-70mm f/2.8 GM II', aperture: 'f/4.0', shutterSpeed: '1/200s', iso: 'ISO 1600' },
    src: thumb('1511578314322-379afb476865', 1600, 900),
    srcFull: full('1511578314322-379afb476865'),
    width: 1600,
    height: 900,
    alt: 'Tech Summit 2025 event photography at BMICH Colombo',
  },
  {
    id: 'e-004',
    title: 'Brand Campaign Shoot',
    category: 'Events & Commercial',
    location: 'Cinnamon Life, Colombo',
    aspectRatio: '3:4',
    exif: { camera: 'Sony A7 IV', lens: '85mm f/1.4 GM', aperture: 'f/1.4', shutterSpeed: '1/800s', iso: 'ISO 200' },
    src: thumb('1524117074681-31bd4de22ad3', 800, 1067),
    srcFull: full('1524117074681-31bd4de22ad3'),
    width: 800,
    height: 1067,
    alt: 'Brand campaign photography at Cinnamon Life Colombo',
  },
];

// ─── Dynamic Asset Import with Fallback ──────────────────────────────────────

type GlobModule = {
  default: string | { src: string; width?: number; height?: number };
};

// Vite import.meta.glob to dynamically discover images placed inside assets
const portfolioAssetFiles = import.meta.glob<GlobModule>(
  '../assets/portfolio/**/*.{png,jpg,jpeg,webp,avif,svg}',
  { eager: true }
);

function getLocalItemsForCategory(folderKey: string, category: Exclude<CategoryLabel, 'All'>): PortfolioItem[] {
  const matchingPaths = Object.keys(portfolioAssetFiles).filter((path) =>
    path.toLowerCase().includes(`/portfolio/${folderKey.toLowerCase()}/`)
  );

  return matchingPaths.map((path, index) => {
    const mod = portfolioAssetFiles[path];
    const src = typeof mod.default === 'string' ? mod.default : mod.default.src;
    const filename = path.split('/').pop()?.replace(/\.[^/.]+$/, '') || `Photo ${index + 1}`;
    const isGenericExport = /^(whatsapp|img|dsc|photo|p-|screenshot|_|\d)/i.test(filename.trim());
    const cleanTitle = isGenericExport
      ? `${category}`
      : filename.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      id: `${folderKey}-${index + 1}`,
      title: cleanTitle,
      category,
      location: 'Sri Lanka',
      aspectRatio: '3:4',
      exif: {
        camera: 'Sony A7 IV',
        lens: '85mm f/1.4 GM',
        aperture: 'f/1.4',
        shutterSpeed: '1/800s',
        iso: 'ISO 100',
      },
      src,
      srcFull: src,
      width: 1200,
      height: 1600,
      alt: `${cleanTitle} — ${category} by Lakshan Manohara Photography`,
    };
  });
}

// Build dynamic items or use fallbacks if folder has no files
function buildPortfolioItems(): PortfolioItem[] {
  const categoryFolders: { folder: string; category: Exclude<CategoryLabel, 'All'> }[] = [
    { folder: 'graduations', category: 'Graduations & Convocations' },
    { folder: 'birthdays', category: 'Birthday & Milestone Shoots' },
    { folder: 'weddings', category: 'Weddings & Homecomings' },
    { folder: 'couples', category: 'Couples & Casual Shoots' },
    { folder: 'events', category: 'Events & Commercial' },
  ];

  let items: PortfolioItem[] = [];

  for (const { folder, category } of categoryFolders) {
    const local = getLocalItemsForCategory(folder, category);
    if (local.length > 0) {
      items = items.concat(local);
    } else {
      // Fallback to curated items for this category
      const fallbacks = fallbackPortfolioItems.filter((item) => item.category === category);
      items = items.concat(fallbacks);
    }
  }

  return items;
}

export const portfolioItems: PortfolioItem[] = buildPortfolioItems();
