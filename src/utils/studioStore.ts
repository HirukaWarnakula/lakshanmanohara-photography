/**
 * studioStore.ts
 *
 * Client-side persistence and state management for Lakshan's Studio Portal.
 * Allows Lakshan to Add, Edit, and Delete photos and story albums.
 * Changes are stored in localStorage and reactive updates are broadcasted across components.
 */

import { portfolioItems as defaultPortfolioItems } from '../data/portfolioData';
import type { PortfolioItem, CategoryLabel } from '../data/portfolioData';
import { albumsData as defaultAlbumsData } from '../data/albumsData';
import type { StoryAlbum, AlbumPhoto } from '../data/albumsData';

const PORTFOLIO_STORAGE_KEY = 'lm_studio_portfolio_items';
const ALBUMS_STORAGE_KEY = 'lm_studio_story_albums';
const UPDATE_EVENT_NAME = 'lm-studio-update';

export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

/**
 * Get all current portfolio items (from localStorage or defaults)
 */
export function getStoredPortfolio(): PortfolioItem[] {
  if (!isBrowser()) return defaultPortfolioItems;
  try {
    const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (!raw) {
      // First time initialization
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(defaultPortfolioItems));
      return defaultPortfolioItems;
    }
    const parsed = JSON.parse(raw) as PortfolioItem[];
    // Ensure every item has valid image sources
    return parsed.map((item, idx) => {
      const defaultItem = defaultPortfolioItems[idx] || defaultPortfolioItems[0];
      const validSrc = item.src || item.srcFull || (item as any).srcThumb || defaultItem?.src || defaultItem?.srcFull || '';
      return {
        ...item,
        src: validSrc,
        srcFull: item.srcFull || validSrc,
      };
    });
  } catch (err) {
    console.error('Error reading portfolio from storage:', err);
    return defaultPortfolioItems;
  }
}

/**
 * Save updated portfolio items
 */
export function savePortfolio(items: PortfolioItem[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(items));
    broadcastUpdate();
  } catch (err) {
    console.error('Error saving portfolio to storage:', err);
  }
}

/**
 * Add a new photo to portfolio
 */
export function addPortfolioPhoto(newPhoto: Omit<PortfolioItem, 'id'> & { id?: string }): PortfolioItem {
  const current = getStoredPortfolio();
  const id = newPhoto.id || `custom-photo-${Date.now()}`;
  const item: PortfolioItem = {
    ...newPhoto,
    id,
  };
  const updated = [item, ...current];
  savePortfolio(updated);
  return item;
}

/**
 * Update an existing photo in portfolio
 */
export function updatePortfolioPhoto(id: string, updates: Partial<PortfolioItem>): boolean {
  const current = getStoredPortfolio();
  const index = current.findIndex((item) => item.id === id);
  if (index === -1) return false;

  current[index] = { ...current[index], ...updates };
  savePortfolio([...current]);
  return true;
}

/**
 * Delete a photo from portfolio
 */
export function deletePortfolioPhoto(id: string): boolean {
  const current = getStoredPortfolio();
  const filtered = current.filter((item) => item.id !== id);
  if (filtered.length === current.length) return false;

  savePortfolio(filtered);
  return true;
}

/**
 * Get all current story albums
 */
export function getStoredAlbums(): StoryAlbum[] {
  if (!isBrowser()) return defaultAlbumsData;
  try {
    const raw = localStorage.getItem(ALBUMS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(defaultAlbumsData));
      return defaultAlbumsData;
    }
    return JSON.parse(raw) as StoryAlbum[];
  } catch (err) {
    console.error('Error reading albums from storage:', err);
    return defaultAlbumsData;
  }
}

/**
 * Save updated story albums
 */
export function saveAlbums(albums: StoryAlbum[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(albums));
    broadcastUpdate();
  } catch (err) {
    console.error('Error saving albums to storage:', err);
  }
}

/**
 * Add a new Story Album
 */
export function addStoryAlbum(newAlbum: Omit<StoryAlbum, 'id'> & { id?: string }): StoryAlbum {
  const current = getStoredAlbums();
  const id = newAlbum.id || `album-${Date.now()}`;
  const album: StoryAlbum = {
    ...newAlbum,
    id,
  };
  const updated = [album, ...current];
  saveAlbums(updated);
  return album;
}

/**
 * Update an existing story album
 */
export function updateStoryAlbum(id: string, updates: Partial<StoryAlbum>): boolean {
  const current = getStoredAlbums();
  const index = current.findIndex((a) => a.id === id);
  if (index === -1) return false;

  current[index] = { ...current[index], ...updates };
  saveAlbums([...current]);
  return true;
}

/**
 * Delete a story album
 */
export function deleteStoryAlbum(id: string): boolean {
  const current = getStoredAlbums();
  const filtered = current.filter((a) => a.id !== id);
  if (filtered.length === current.length) return false;

  saveAlbums(filtered);
  return true;
}

/**
 * Reset all storage to original factory defaults
 */
export function resetStudioToDefaults(): void {
  if (!isBrowser()) return;
  localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(defaultPortfolioItems));
  localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(defaultAlbumsData));
  localStorage.removeItem(ABOUT_STORAGE_KEY);
  broadcastUpdate();
}

/**
 * ─── Studio Passcode Authentication (Strictly Password-Only) ────────────
 */
const AUTH_STORAGE_KEY = 'lm_studio_owner_authenticated';
const MASTER_PASSWORDS = [
  'Lakshan@#321',
  'lakshan@#321',
  'lakshan',
  '7882',
  'lakshan2026',
  'lmphotography',
];

export function checkOwnerPassword(input: string): boolean {
  if (!input) return false;
  const raw = input.trim();
  const lower = raw.toLowerCase();
  const custom = isBrowser() ? localStorage.getItem('lm_custom_owner_password') : null;
  if (custom && (raw === custom.trim() || lower === custom.trim().toLowerCase())) return true;
  return MASTER_PASSWORDS.some((pass) => raw === pass || lower === pass.toLowerCase());
}

export function isOwnerAuthenticated(): boolean {
  if (!isBrowser()) return false;
  return (
    sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true' ||
    localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  );
}

export function setOwnerAuthenticated(status: boolean): void {
  if (!isBrowser()) return;
  if (status) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
    localStorage.setItem(AUTH_STORAGE_KEY, 'true');
  } else {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  broadcastUpdate();
}

/**
 * ─── About Section Profile Store ─────────────────────────────────────────
 */
const ABOUT_STORAGE_KEY = 'lm_studio_about_profile';

export interface AboutProfile {
  photoSrc: string;
  name: string;
  title: string;
  bio1: string;
  bio2: string;
  quote: string;
}

export const defaultAboutProfile: AboutProfile = {
  photoSrc: '/lakshan-manohara-about.jpg',
  name: 'Lakshan Manohara',
  title: 'Lead Visual Storyteller • Sri Lanka',
  bio1: 'A passionate visual storyteller dedicated to capturing natural expressions, genuine chemistry, and timeless color tones. With years of refined behind-the-lens experience across Sri Lanka, Lakshan believes the most striking photographs emerge when you are free to simply be yourself.',
  bio2: 'Known for his calm, supportive direction that puts clients effortlessly at ease during high-stakes milestones like convocations, weddings, and milestone birthday shoots. Every session is conducted with patience, warmth, and attention to light.',
  quote: 'Beyond photos, we preserve the moments that matter.',
};

export function getStoredAboutProfile(): AboutProfile {
  if (!isBrowser()) return defaultAboutProfile;
  try {
    const raw = localStorage.getItem(ABOUT_STORAGE_KEY);
    if (!raw) return defaultAboutProfile;
    return { ...defaultAboutProfile, ...JSON.parse(raw) };
  } catch {
    return defaultAboutProfile;
  }
}

export function saveAboutProfile(profile: AboutProfile): void {
  if (!isBrowser()) return;
  localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(profile));
  broadcastUpdate();
}

/**
 * Notify all components on the page that studio data changed
 */
export function broadcastUpdate(): void {
  if (isBrowser()) {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME));
  }
}

export { UPDATE_EVENT_NAME };
