/**
 * Lakshan Manohara Photography — Client Stories & Full Albums Data
 *
 * Dynamically imports images from src/assets/albums/ and src/assets/portfolio/ subfolders:
 *  - convocation / graduations
 *  - birthday / birthdays
 *  - wedding / weddings
 *  - couples
 *
 * If photos exist, Lakshan's original photos are loaded seamlessly for covers and full galleries.
 */

export interface AlbumPhoto {
  id: string;
  src: string;
  title: string;
  caption?: string;
  location?: string;
}

export interface StoryAlbum {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  location: string;
  coverImage: string;
  storyDescription: string;
  clientHighlight?: string;
  photos: AlbumPhoto[];
  date?: string;
  photoCount?: number;
  highlightQuote?: string;
  storyParagraphs?: string[];
}

const BASE = 'https://images.unsplash.com/photo-';

function img(id: string, w = 1600, h = 1067): string {
  return `${BASE}${id}?w=${w}&h=${h}&fit=crop&auto=format&q=85`;
}

// ─── Curated Fallback Stories (Used if no local photos exist) ────────────────

export const fallbackAlbums: StoryAlbum[] = [
  {
    id: 'convocation-story',
    title: 'Honours Convocation Session',
    subtitle: 'Milestone portraits, proud academic regalia, and family tributes.',
    category: 'Graduations & Convocations',
    location: 'BMICH & Colombo 07',
    coverImage: img('1627556704302-624286467c65', 1200, 800),
    storyDescription:
      'A deeply meaningful session honoring years of dedication and scholastic excellence. From solitary portraits in full academic regalia to candid moments of gratitude with family, this narrative captures both accomplishment and heartfelt pride.',
    clientHighlight: '“Lakshan brought a calm confidence to our graduation session. The regalia portraits look timeless.” — Shenara & Family',
    photos: [
      {
        id: 'conv-1',
        src: img('1627556704302-624286467c65', 1600, 1067),
        title: 'Academic Regalia Portrait',
        caption: 'Formal honours portrait capturing scholastic dedication and milestone achievement.',
        location: 'BMICH, Colombo',
      },
    ],
  },
  {
    id: 'birthday-milestone',
    title: 'Signature Birthday & Milestone Celebration',
    subtitle: 'Styled editorial birthday portraits and candid party moments.',
    category: 'Birthday & Milestone Shoots',
    location: 'Cinnamon Life & Colombo Celebrations',
    coverImage: img('1513151233558-d860c5398176', 1200, 800),
    storyDescription:
      'A bespoke celebratory album blending heartwarming family milestones, candid smiles, and vibrant party atmosphere. Preserving joyful memories that will be cherished for generations.',
    clientHighlight: '“Lakshan captured all the raw joy without any awkward posing. Truly unforgettable memories!” — Dilhani & Family',
    photos: [
      {
        id: 'bday-1',
        src: img('1513151233558-d860c5398176', 1600, 1067),
        title: 'Celebration Moments',
        caption: 'Joyful family smiles and milestone birthday celebrations.',
        location: 'Colombo, Sri Lanka',
      },
    ],
  },
  {
    id: 'intimate-wedding',
    title: 'Intimate Wedding & Homecoming',
    subtitle: 'Timeless bridal elegance and authentic emotional moments.',
    category: 'Weddings & Homecomings',
    location: 'Mount Lavinia & Heritage Venues',
    coverImage: img('1519741497674-611481863552', 1200, 800),
    storyDescription:
      'A timeless celebration of traditional Sri Lankan bridal elegance, sacred heritage ceremonies, and authentic romance. Soft natural light meets opulent traditional regalia.',
    clientHighlight: '“Looking at our photos brings back every tear and every smile. Lakshan is a master of natural light.” — Kavindi & Dinuka',
    photos: [
      {
        id: 'wed-1',
        src: img('1519741497674-611481863552', 1600, 1067),
        title: 'Sacred Vows & Elegance',
        caption: 'Timeless traditional wedding elegance captured in Sri Lanka.',
        location: 'Sri Lanka',
      },
    ],
  },
  {
    id: 'golden-hour-couple',
    title: 'Golden Hour Couple Story',
    subtitle: 'Candid outdoor warmth and romance.',
    category: 'Couples & Casual Shoots',
    location: 'Scenic Landscapes & Coastal Groves',
    coverImage: img('1516589178581-6cd7833ae3b2', 1200, 800),
    storyDescription:
      'A relaxed, unscripted session embracing natural sunlight, scenic open landscapes, and golden backlight. Effortless couple chemistry immortalized in frames.',
    clientHighlight: '“Neither of us like stiff posing, but Lakshan made us feel completely relaxed. Best photos we have together!” — Sachini & Tharindu',
    photos: [
      {
        id: 'couple-1',
        src: img('1516589178581-6cd7833ae3b2', 1600, 1067),
        title: 'Golden Hour Embrace',
        caption: 'Effortless chemistry and candid outdoor warmth.',
        location: 'Sri Lanka',
      },
    ],
  },
];

// ─── Dynamic Albums Asset Integration ──────────────────────────────────────

type GlobModule = {
  default: string | { src: string };
};

// Discover photos from both assets/albums and assets/portfolio
const albumAssetFiles = import.meta.glob<GlobModule>(
  '../assets/albums/**/*.{png,jpg,jpeg,webp,avif,svg,PNG,JPG,JPEG,WEBP,AVIF,SVG}',
  { eager: true }
);

const portfolioAssetFiles = import.meta.glob<GlobModule>(
  '../assets/portfolio/**/*.{png,jpg,jpeg,webp,avif,svg,PNG,JPG,JPEG,WEBP,AVIF,SVG}',
  { eager: true }
);

function getLocalPhotosForKeys(folderKeys: string[]): AlbumPhoto[] {
  const combinedFiles = { ...portfolioAssetFiles, ...albumAssetFiles };

  const matchingPaths = Object.keys(combinedFiles).filter((path) => {
    const lower = path.toLowerCase();
    return folderKeys.some((k) => lower.includes(`/${k.toLowerCase()}/`));
  });

  // Remove duplicate filenames
  const seenFilenames = new Set<string>();
  const uniquePaths: string[] = [];
  for (const p of matchingPaths) {
    const filename = p.split('/').pop() || p;
    if (!seenFilenames.has(filename)) {
      seenFilenames.add(filename);
      uniquePaths.push(p);
    }
  }

  return uniquePaths.map((p, idx) => {
    const mod = combinedFiles[p];
    const src = typeof mod.default === 'string' ? mod.default : mod.default.src;
    return {
      id: `photo-${idx + 1}`,
      src,
      title: `Session Frame ${idx + 1}`,
      caption: `Authentic moment captured by Lakshan Manohara Photography.`,
      location: 'Sri Lanka',
    };
  });
}

export function getStoryAlbums(): StoryAlbum[] {
  const albumFolderMappings: {
    id: string;
    folders: string[];
    coverKeywords?: string[];
  }[] = [
    {
      id: 'convocation-story',
      folders: ['convocation', 'graduations'],
      coverKeywords: ['10.39.23', '10.39.24', '10.39.22', '10.39.25'],
    },
    {
      id: 'birthday-milestone',
      folders: ['birthday', 'birthdays'],
      coverKeywords: ['1273971004592999', '1273971034592996', '122098466757453922'],
    },
    {
      id: 'intimate-wedding',
      folders: ['wedding', 'weddings'],
      coverKeywords: ['10.39.20', '10.39.19', '10.39.21'],
    },
    {
      id: 'golden-hour-couple',
      folders: ['couples'],
      coverKeywords: ['1251186323538134', '1251185990204834', '1251186490204784'],
    },
  ];

  return fallbackAlbums.map((baseAlbum) => {
    const config = albumFolderMappings.find((m) => m.id === baseAlbum.id);
    if (!config) return baseAlbum;

    const localPhotos = getLocalPhotosForKeys(config.folders);
    if (localPhotos.length > 0) {
      // Find the most visually striking cover photo based on preferred keywords
      let chosenCover = localPhotos[0].src;
      if (config.coverKeywords && config.coverKeywords.length > 0) {
        const preferred = localPhotos.find((p) =>
          config.coverKeywords!.some((kw) => p.src.includes(kw))
        );
        if (preferred) {
          chosenCover = preferred.src;
        }
      }

      return {
        ...baseAlbum,
        coverImage: chosenCover,
        photos: localPhotos,
      };
    }

    return baseAlbum;
  });
}

export const albumsData: StoryAlbum[] = getStoryAlbums();
