/**
 * StudioManager.tsx
 *
 * Bespoke Owner Portal / Studio Manager for Lakshan Manohara.
 * Strictly protected by Owner Password Only (no username required).
 * Gives Lakshan complete control to Add, Edit, and Delete photos, manage Story Albums,
 * and update his About profile photo and details in real time.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getStoredPortfolio,
  addPortfolioPhoto,
  updatePortfolioPhoto,
  deletePortfolioPhoto,
  getStoredAlbums,
  addStoryAlbum,
  updateStoryAlbum,
  deleteStoryAlbum,
  resetStudioToDefaults,
  checkOwnerPassword,
  isOwnerAuthenticated,
  setOwnerAuthenticated,
  getStoredAboutProfile,
  saveAboutProfile,
  UPDATE_EVENT_NAME,
} from '../utils/studioStore';
import type { PortfolioItem, CategoryLabel, AspectRatioKey } from '../data/portfolioData';
import { CATEGORIES } from '../data/portfolioData';
import type { StoryAlbum, AlbumPhoto } from '../data/albumsData';

interface StudioManagerProps {
  isStandalone?: boolean;
}

export default function StudioManager({ isStandalone = false }: StudioManagerProps) {
  const [isOpen, setIsOpen] = useState(isStandalone);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'albums' | 'about'>('portfolio');

  // Portfolio items & Albums state
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>([]);
  const [albumsList, setAlbumsList] = useState<StoryAlbum[]>([]);
  const [filterCategory, setFilterCategory] = useState<CategoryLabel>('All');

  // Modal for Add/Edit Photo
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);

  // Photo form fields
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<Exclude<CategoryLabel, 'All'>>('Graduations & Convocations');
  const [photoLocation, setPhotoLocation] = useState('Colombo, Sri Lanka');
  const [photoSrc, setPhotoSrc] = useState('');
  const [photoAspect, setPhotoAspect] = useState<AspectRatioKey>('2:3');
  const [photoAlt, setPhotoAlt] = useState('');
  const [camera, setCamera] = useState('Sony A7 IV');
  const [lens, setLens] = useState('85mm f/1.4 GM');
  const [aperture, setAperture] = useState('f/1.8');
  const [shutterSpeed, setShutterSpeed] = useState('1/640s');
  const [iso, setIso] = useState('ISO 100');

  // Modal for Add/Edit Story Album
  const [albumModalOpen, setAlbumModalOpen] = useState(false);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);

  // Album form fields
  const [albumTitle, setAlbumTitle] = useState('');
  const [albumSubtitle, setAlbumSubtitle] = useState('');
  const [albumCategory, setAlbumCategory] = useState('Graduations & Convocations');
  const [albumLocation, setAlbumLocation] = useState('Colombo, Sri Lanka');
  const [albumCover, setAlbumCover] = useState('');
  const [albumDesc, setAlbumDesc] = useState('');
  const [albumHighlight, setAlbumHighlight] = useState('');

  // About Section Profile fields
  const [aboutPhoto, setAboutPhoto] = useState('/lakshan-manohara-about.jpg');
  const [aboutName, setAboutName] = useState('Lakshan Manohara');
  const [aboutTitle, setAboutTitle] = useState('Lead Visual Storyteller • Sri Lanka');
  const [aboutBio1, setAboutBio1] = useState(
    'A passionate visual storyteller dedicated to capturing natural expressions, genuine chemistry, and timeless color tones. With years of refined behind-the-lens experience across Sri Lanka, Lakshan believes the most striking photographs emerge when you are free to simply be yourself.'
  );
  const [aboutBio2, setAboutBio2] = useState(
    'Known for his calm, supportive direction that puts clients effortlessly at ease during high-stakes milestones like convocations, weddings, and milestone birthday shoots. Every session is conducted with patience, warmth, and attention to light.'
  );
  const [aboutSaveSuccess, setAboutSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const albumFileInputRef = useRef<HTMLInputElement>(null);
  const aboutFileInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Load data & listen for events
  const refreshData = () => {
    setPortfolioList(getStoredPortfolio());
    setAlbumsList(getStoredAlbums());
    const profile = getStoredAboutProfile();
    setAboutPhoto(profile.photoSrc);
    setAboutName(profile.name);
    setAboutTitle(profile.title);
    setAboutBio1(profile.bio1);
    setAboutBio2(profile.bio2);
  };

  useEffect(() => {
    refreshData();
    if (isOwnerAuthenticated()) {
      setIsUnlocked(true);
    }

    const handleStudioUpdate = () => refreshData();
    const handleOpenStudio = () => {
      setIsOpen(true);
      if (isOwnerAuthenticated()) {
        setIsUnlocked(true);
      }
    };

    window.addEventListener(UPDATE_EVENT_NAME, handleStudioUpdate);
    window.addEventListener('open-studio-manager', handleOpenStudio);

    // Keyboard shortcut: Alt + P
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener(UPDATE_EVENT_NAME, handleStudioUpdate);
      window.removeEventListener('open-studio-manager', handleOpenStudio);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Autofocus password input when drawer opens locked
  useEffect(() => {
    if (isOpen && !isUnlocked) {
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isUnlocked]);

  // Handle password submission (Password-only, no username)
  const handlePasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (checkOwnerPassword(passwordInput)) {
      setOwnerAuthenticated(true);
      setIsUnlocked(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  // Sign out handler
  const handleSignOut = () => {
    setOwnerAuthenticated(false);
    setIsUnlocked(false);
    setPasswordInput('');
    setPasswordError(false);
  };

  // Image file upload handler (FileReader -> canvas resize/compress -> base64 DataURL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'photo' | 'album' | 'about') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        // Downscale large camera photos to max 1400px to avoid browser localStorage quota issues
        const maxDim = 1400;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          if (target === 'photo') {
            setPhotoSrc(compressed);
            if (!photoTitle) {
              const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
              setPhotoTitle(nameWithoutExt);
            }
          } else if (target === 'album') {
            setAlbumCover(compressed);
          } else if (target === 'about') {
            setAboutPhoto(compressed);
          }
          return;
        }

        if (target === 'photo') {
          setPhotoSrc(rawUrl);
          if (!photoTitle) {
            const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            setPhotoTitle(nameWithoutExt);
          }
        } else if (target === 'album') {
          setAlbumCover(rawUrl);
        } else if (target === 'about') {
          setAboutPhoto(rawUrl);
        }
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  // Save About Section Profile
  const handleSaveAboutProfile = (e: React.FormEvent) => {
    e.preventDefault();
    saveAboutProfile({
      photoSrc: aboutPhoto,
      name: aboutName,
      title: aboutTitle,
      bio1: aboutBio1,
      bio2: aboutBio2,
      quote: 'Beyond photos, we preserve the moments that matter.',
    });
    setAboutSaveSuccess(true);
    setTimeout(() => setAboutSaveSuccess(false), 3000);
  };

  // Open Photo Modal for Add
  const openAddPhoto = () => {
    setEditingPhotoId(null);
    setPhotoTitle('');
    setPhotoCategory('Graduations & Convocations');
    setPhotoLocation('BMICH, Colombo');
    setPhotoSrc('');
    setPhotoAspect('2:3');
    setPhotoAlt('Lakshan Manohara Photography Session');
    setCamera('Sony A7 IV');
    setLens('85mm f/1.4 GM');
    setAperture('f/1.8');
    setShutterSpeed('1/640s');
    setIso('ISO 100');
    setPhotoModalOpen(true);
  };

  // Open Photo Modal for Edit
  const openEditPhoto = (item: PortfolioItem) => {
    setEditingPhotoId(item.id);
    setPhotoTitle(item.title);
    setPhotoCategory(item.category as Exclude<CategoryLabel, 'All'>);
    setPhotoLocation(item.location);
    setPhotoSrc(item.src || item.srcFull || (item as any).srcThumb || '');
    setPhotoAspect((item as any).aspect || item.aspectRatio || '2:3');
    setPhotoAlt(item.alt || item.title || '');
    setCamera(item.exif?.camera || 'Sony A7 IV');
    setLens(item.exif?.lens || '85mm f/1.4 GM');
    setAperture(item.exif?.aperture || 'f/1.8');
    setShutterSpeed(item.exif?.shutterSpeed || '1/640s');
    setIso(item.exif?.iso || 'ISO 100');
    setPhotoModalOpen(true);
  };

  // Submit Photo (Add or Edit)
  const handlePhotoFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoSrc) {
      alert('Please provide an image by uploading a file or entering an image URL.');
      return;
    }

    if (editingPhotoId) {
      updatePortfolioPhoto(editingPhotoId, {
        title: photoTitle || 'Untitled Photograph',
        category: photoCategory,
        location: photoLocation || 'Sri Lanka',
        src: photoSrc,
        srcFull: photoSrc,
        aspectRatio: photoAspect,
        alt: photoAlt || photoTitle || 'Lakshan Manohara Photography',
        exif: {
          camera,
          lens,
          aperture,
          shutterSpeed,
          iso,
        },
      } as any);
    } else {
      addPortfolioPhoto({
        title: photoTitle || 'New Visual Story',
        category: photoCategory,
        location: photoLocation || 'Sri Lanka',
        src: photoSrc,
        srcFull: photoSrc,
        aspectRatio: photoAspect,
        alt: photoAlt || photoTitle || 'Lakshan Manohara Photography',
        date: new Date().toISOString().split('T')[0],
        featured: true,
        exif: {
          camera,
          lens,
          aperture,
          shutterSpeed,
          iso,
        },
      } as any);
    }

    setPhotoModalOpen(false);
    refreshData();
  };

  // Delete Photo confirmation
  const handleDeletePhoto = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}" from the live portfolio?`)) {
      deletePortfolioPhoto(id);
      refreshData();
    }
  };

  // Open Album Modal for Add
  const openAddAlbum = () => {
    setEditingAlbumId(null);
    setAlbumTitle('');
    setAlbumSubtitle('');
    setAlbumCategory('Graduations & Convocations');
    setAlbumLocation('Colombo, Sri Lanka');
    setAlbumCover('');
    setAlbumDesc('');
    setAlbumHighlight('');
    setAlbumModalOpen(true);
  };

  // Open Album Modal for Edit
  const openEditAlbum = (album: StoryAlbum) => {
    setEditingAlbumId(album.id);
    setAlbumTitle(album.title || '');
    setAlbumSubtitle(album.subtitle || '');
    setAlbumCategory(album.category || 'Graduations & Convocations');
    setAlbumLocation(album.location || 'Colombo, Sri Lanka');
    setAlbumCover(album.coverImage || '');
    const desc =
      (album as any).storyParagraphs && Array.isArray((album as any).storyParagraphs)
        ? (album as any).storyParagraphs.join('\n\n')
        : album.storyDescription || '';
    setAlbumDesc(desc);
    setAlbumHighlight(album.clientHighlight || (album as any).highlightQuote || '');
    setAlbumModalOpen(true);
  };

  // Submit Album (Add or Edit)
  const handleAlbumFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumCover) {
      alert('Please provide a cover image by uploading or entering a URL.');
      return;
    }

    const paragraphs = albumDesc
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean);

    const descText = albumDesc.trim();

    if (editingAlbumId) {
      updateStoryAlbum(editingAlbumId, {
        title: albumTitle || 'Client Story',
        subtitle: albumSubtitle,
        category: albumCategory,
        location: albumLocation,
        coverImage: albumCover,
        storyDescription:
          descText || (paragraphs.length ? paragraphs.join(' ') : 'A timeless visual story captured across Sri Lanka.'),
        storyParagraphs: paragraphs.length ? paragraphs : ['A timeless visual story captured across Sri Lanka.'],
        clientHighlight: albumHighlight,
        highlightQuote: albumHighlight,
      });
    } else {
      addStoryAlbum({
        title: albumTitle || 'New Client Story',
        subtitle: albumSubtitle || 'Special Shoot Coverage',
        category: albumCategory,
        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        location: albumLocation || 'Colombo, Sri Lanka',
        photoCount: 1,
        coverImage: albumCover,
        storyDescription: descText || 'A dedicated photoshoot captured by Lakshan Manohara.',
        highlightQuote: albumHighlight || 'Beyond photos, we preserve the moments that matter.',
        clientHighlight: albumHighlight || 'Beyond photos, we preserve the moments that matter.',
        storyParagraphs: paragraphs.length ? paragraphs : ['A dedicated photoshoot captured by Lakshan Manohara.'],
        photos: [
          {
            id: `story-photo-${Date.now()}`,
            src: albumCover,
            title: albumTitle || 'Story Portrait',
            caption: albumTitle || 'Story Portrait',
            location: albumLocation || 'Colombo, Sri Lanka',
          },
        ],
      });
    }

    setAlbumModalOpen(false);
    refreshData();
  };

  // Delete Album confirmation
  const handleDeleteAlbum = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the story album "${title}"?`)) {
      deleteStoryAlbum(id);
      refreshData();
    }
  };

  const filteredPortfolio =
    filterCategory === 'All'
      ? portfolioList
      : portfolioList.filter((item) => item.category === filterCategory);

  return (
    <>
      {/* ── Main Studio Drawer / Modal (Invoked via Alt+P or /studio) ── */}
      <AnimatePresence>
        {isOpen && (
          <div
            style={{
              position: isStandalone ? 'relative' : 'fixed',
              inset: isStandalone ? undefined : 0,
              zIndex: isStandalone ? 10 : 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: isStandalone ? 'center' : 'flex-end',
              background: isStandalone ? '#f5f2eb' : 'rgba(14, 16, 20, 0.72)',
              backdropFilter: isStandalone ? 'none' : 'blur(8px)',
              minHeight: isStandalone ? '100vh' : undefined,
              padding: isStandalone ? '2rem 1.5rem' : 0,
              boxSizing: 'border-box',
            }}
            onClick={() => !isStandalone && setIsOpen(false)}
          >
            <motion.div
              initial={isStandalone ? { opacity: 0, y: 15 } : { x: '100%' }}
              animate={isStandalone ? { opacity: 1, y: 0 } : { x: 0 }}
              exit={isStandalone ? { opacity: 0, y: 15 } : { x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: isStandalone ? '1280px' : '820px',
                height: isStandalone ? 'auto' : '100%',
                minHeight: isStandalone ? '88vh' : '100%',
                backgroundColor: '#ffffff',
                border: isStandalone ? '1px solid rgba(18, 18, 20, 0.1)' : undefined,
                borderLeft: !isStandalone ? '1px solid rgba(18, 18, 20, 0.1)' : undefined,
                borderRadius: isStandalone ? '8px' : 0,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: isStandalone ? '0 16px 48px rgba(0, 0, 0, 0.08)' : '-10px 0 40px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
              }}
            >
              {/* Drawer Top Header */}
              <div
                style={{
                  padding: '1.25rem 1.75rem',
                  borderBottom: '1px solid rgba(18, 18, 20, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#faf8f5',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      width: '2.25rem',
                      height: '2.25rem',
                      borderRadius: '50%',
                      background: 'rgba(179, 135, 40, 0.12)',
                      border: '1px solid rgba(179, 135, 40, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#b38728',
                      fontSize: '0.95rem',
                    }}
                  >
                    {isUnlocked ? '📸' : '🔒'}
                  </span>
                  <div>
                    <h2
                      style={{
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: '1.4rem',
                        fontWeight: 500,
                        color: '#121214',
                        lineHeight: 1.1,
                      }}
                    >
                      Studio Portal
                    </h2>
                    <p
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.65rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: '#8c8880',
                      }}
                    >
                      {isUnlocked
                        ? 'Content Management • Curated Works & Story Albums'
                        : 'Private Studio Access'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {isUnlocked && (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      title="Lock Studio"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.75rem',
                        background: '#ffffff',
                        border: '1px solid rgba(18, 18, 20, 0.15)',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        color: '#575550',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#ef4444';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(18, 18, 20, 0.15)';
                        e.currentTarget.style.color = '#575550';
                      }}
                    >
                      <span>🔒 Lock</span>
                    </button>
                  )}

                  {isStandalone ? (
                    <a
                      href="/"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.45rem 0.95rem',
                        backgroundColor: '#121214',
                        color: '#ffffff',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      &larr; Return to Website
                    </a>
                  ) : (
                    <button
                      onClick={() => setIsOpen(false)}
                      aria-label="Close Studio Portal"
                      style={{
                        background: 'none',
                        border: '1px solid rgba(18, 18, 20, 0.12)',
                        borderRadius: '50%',
                        width: '2rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        color: '#575550',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f3efe6';
                        e.currentTarget.style.color = '#121214';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.color = '#575550';
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* ── Strictly Password-Only Sign In (No Username Field) ── */}
              {!isUnlocked ? (
                <div
                  style={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2.5rem',
                    textAlign: 'center',
                    background: '#faf8f5',
                  }}
                >
                  <div
                    style={{
                      width: '4.25rem',
                      height: '4.25rem',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(179, 135, 40, 0.15) 0%, rgba(255, 255, 255, 0.8) 100%)',
                      border: '1px solid rgba(179, 135, 40, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.85rem',
                      color: '#b38728',
                      marginBottom: '1.5rem',
                      boxShadow: '0 8px 24px rgba(179, 135, 40, 0.12)',
                    }}
                  >
                    🔒
                  </div>

                  <h3
                    style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: '2rem',
                      color: '#121214',
                      fontWeight: 400,
                      marginBottom: '0.4rem',
                    }}
                  >
                    Studio Access
                  </h3>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      color: '#575550',
                      maxWidth: '380px',
                      lineHeight: 1.6,
                      marginBottom: '2rem',
                    }}
                  >
                    Enter passcode to access studio management and albums.
                  </p>

                  <form
                    onSubmit={handlePasswordSubmit}
                    style={{
                      width: '100%',
                      maxWidth: '340px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        ref={passwordInputRef}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter passcode..."
                        value={passwordInput}
                        onChange={(e) => {
                          setPasswordInput(e.target.value);
                          if (passwordError) setPasswordError(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.85rem 2.85rem 0.85rem 1.15rem',
                          fontSize: '0.95rem',
                          borderRadius: '4px',
                          border: passwordError ? '1.5px solid #ef4444' : '1px solid rgba(179, 135, 40, 0.4)',
                          outline: 'none',
                          background: '#ffffff',
                          color: '#121214',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? 'Hide passcode' : 'Show passcode'}
                        style={{
                          position: 'absolute',
                          right: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#8c8880',
                          fontSize: '1rem',
                        }}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>

                    {passwordError && (
                      <p
                        style={{
                          color: '#dc2626',
                          fontSize: '0.78rem',
                          fontFamily: 'Inter, sans-serif',
                          background: 'rgba(239, 68, 68, 0.08)',
                          padding: '0.5rem',
                          borderRadius: '4px',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                        }}
                      >
                        Incorrect passcode. Please try again.
                      </p>
                    )}

                    <button
                      type="submit"
                      style={{
                        padding: '0.85rem',
                        background: '#b38728',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(179, 135, 40, 0.25)',
                        transition: 'background-color 0.2s ease, transform 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#91691a';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#b38728';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      Enter Studio &rarr;
                    </button>
                  </form>
                </div>
              ) : (
                /* ── Unlocked Studio Management Interface ── */
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                  {/* Tab Navigation & Add Actions */}
                  <div
                    style={{
                      padding: '0.85rem 1.75rem',
                      borderBottom: '1px solid rgba(18, 18, 20, 0.08)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                      background: '#f8f5ee',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setActiveTab('portfolio')}
                        style={{
                          padding: '0.45rem 1rem',
                          borderRadius: '4px',
                          border: activeTab === 'portfolio' ? '1px solid #b38728' : '1px solid transparent',
                          background: activeTab === 'portfolio' ? '#ffffff' : 'transparent',
                          color: activeTab === 'portfolio' ? '#b38728' : '#575550',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span>Curated Works ({portfolioList.length})</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('albums')}
                        style={{
                          padding: '0.45rem 1rem',
                          borderRadius: '4px',
                          border: activeTab === 'albums' ? '1px solid #b38728' : '1px solid transparent',
                          background: activeTab === 'albums' ? '#ffffff' : 'transparent',
                          color: activeTab === 'albums' ? '#b38728' : '#575550',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span>Story Albums ({albumsList.length})</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('about')}
                        style={{
                          padding: '0.45rem 1rem',
                          borderRadius: '4px',
                          border: activeTab === 'about' ? '1px solid #b38728' : '1px solid transparent',
                          background: activeTab === 'about' ? '#ffffff' : 'transparent',
                          color: activeTab === 'about' ? '#b38728' : '#575550',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span>About Section Profile</span>
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {activeTab === 'portfolio' && (
                        <button
                          onClick={openAddPhoto}
                          style={{
                            padding: '0.45rem 1rem',
                            background: '#b38728',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <span>+ Add New Photo</span>
                        </button>
                      )}

                      {activeTab === 'albums' && (
                        <button
                          onClick={openAddAlbum}
                          style={{
                            padding: '0.45rem 1rem',
                            background: '#b38728',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <span>+ Add New Album</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm('Reset portfolio and albums back to original defaults?')) {
                            resetStudioToDefaults();
                            refreshData();
                          }
                        }}
                        title="Reset studio storage to factory sample items"
                        style={{
                          padding: '0.45rem 0.75rem',
                          background: 'none',
                          border: '1px solid rgba(18, 18, 20, 0.15)',
                          borderRadius: '4px',
                          color: '#8c8880',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                        }}
                      >
                        Reset Defaults
                      </button>
                    </div>
                  </div>

                  {/* ── TAB 1: CURATED PORTFOLIO ── */}
                  {activeTab === 'portfolio' && (
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                      {/* Filter category pills */}
                      <div
                        style={{
                          padding: '0.65rem 1.75rem',
                          display: 'flex',
                          gap: '0.45rem',
                          overflowX: 'auto',
                          background: '#ffffff',
                          borderBottom: '1px solid rgba(18, 18, 20, 0.05)',
                        }}
                      >
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '9999px',
                              border: filterCategory === cat ? '1px solid #b38728' : '1px solid rgba(18, 18, 20, 0.1)',
                              background: filterCategory === cat ? '#b38728' : '#faf8f5',
                              color: filterCategory === cat ? '#ffffff' : '#575550',
                              fontSize: '0.65rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Photo Grid List */}
                      <div
                        style={{
                          padding: '1.5rem 1.75rem',
                          overflowY: 'auto',
                          flexGrow: 1,
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                          gap: '1.25rem',
                          background: '#fcfbf9',
                        }}
                      >
                        {filteredPortfolio.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              background: '#ffffff',
                              border: '1px solid rgba(18, 18, 20, 0.1)',
                              borderRadius: '4px',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            }}
                          >
                            <div style={{ position: 'relative', width: '100%', height: '160px', background: '#ece7db', overflow: 'hidden' }}>
                              <img
                                src={item.src || item.srcFull || (item as any).srcThumb || '/lakshan-manohara-about.jpg'}
                                alt={item.title}
                                loading="lazy"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  if (item.srcFull && target.src !== item.srcFull) {
                                    target.src = item.srcFull;
                                  } else {
                                    target.src = '/lakshan-manohara-about.jpg';
                                  }
                                }}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '0.5rem',
                                  left: '0.5rem',
                                  background: 'rgba(255,255,255,0.95)',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '3px',
                                  fontSize: '0.58rem',
                                  fontWeight: 600,
                                  color: '#b38728',
                                  letterSpacing: '0.05em',
                                  textTransform: 'uppercase',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                }}
                              >
                                {item.category.split(' ')[0]}
                              </span>
                            </div>

                            <div style={{ padding: '0.75rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                              <h4
                                style={{
                                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                  color: '#121214',
                                  marginBottom: '0.2rem',
                                  lineHeight: 1.2,
                                }}
                              >
                                {item.title}
                              </h4>
                              <p style={{ fontSize: '0.62rem', color: '#8c8880', marginBottom: '0.35rem' }}>
                                📍 {item.location}
                              </p>
                              <p
                                style={{
                                  fontFamily: 'Courier New, monospace',
                                  fontSize: '0.58rem',
                                  color: '#a39f99',
                                  lineHeight: 1.4,
                                  marginBottom: '0.75rem',
                                }}
                              >
                                {item.exif.lens} • {item.exif.aperture}
                              </p>

                              <div style={{ marginTop: 'auto', display: 'flex', gap: '0.45rem' }}>
                                <button
                                  onClick={() => openEditPhoto(item)}
                                  style={{
                                    flex: 1,
                                    padding: '0.4rem',
                                    background: '#faf8f5',
                                    border: '1px solid rgba(18, 18, 20, 0.15)',
                                    borderRadius: '3px',
                                    fontSize: '0.68rem',
                                    fontWeight: 600,
                                    color: '#121214',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeletePhoto(item.id, item.title)}
                                  style={{
                                    padding: '0.4rem 0.65rem',
                                    background: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    borderRadius: '3px',
                                    fontSize: '0.68rem',
                                    fontWeight: 600,
                                    color: '#dc2626',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── TAB 2: STORY ALBUMS ── */}
                  {activeTab === 'albums' && (
                    <div
                      style={{
                        padding: '1.5rem 1.75rem',
                        overflowY: 'auto',
                        flexGrow: 1,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '1.5rem',
                        background: '#fcfbf9',
                      }}
                    >
                      {albumsList.map((album) => (
                        <div
                          key={album.id}
                          style={{
                            background: '#ffffff',
                            border: '1px solid rgba(18, 18, 20, 0.1)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          }}
                        >
                          <div style={{ position: 'relative', width: '100%', height: '180px', background: '#ece7db' }}>
                            <img
                              src={album.coverImage}
                              alt={album.title}
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
                              }}
                            />
                            <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.85rem', right: '0.85rem' }}>
                              <span
                                style={{
                                  fontSize: '0.55rem',
                                  textTransform: 'uppercase',
                                  color: '#ffd875',
                                  letterSpacing: '0.1em',
                                  fontWeight: 600,
                                }}
                              >
                                {album.category}
                              </span>
                              <h4
                                style={{
                                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                                  fontSize: '1.25rem',
                                  color: '#ffffff',
                                  fontWeight: 500,
                                }}
                              >
                                {album.title}
                              </h4>
                            </div>
                          </div>

                          <div style={{ padding: '0.85rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <p style={{ fontSize: '0.75rem', color: '#575550', marginBottom: '0.5rem' }}>
                              {album.subtitle}
                            </p>
                            <p style={{ fontSize: '0.65rem', color: '#8c8880', marginBottom: '0.75rem' }}>
                              📍 {album.location} &bull; 🗓 {album.date}
                            </p>

                            <div style={{ marginTop: 'auto', display: 'flex', gap: '0.45rem' }}>
                              <button
                                onClick={() => openEditAlbum(album)}
                                style={{
                                  flex: 1,
                                  padding: '0.45rem',
                                  background: '#faf8f5',
                                  border: '1px solid rgba(18, 18, 20, 0.15)',
                                  borderRadius: '3px',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  color: '#121214',
                                  cursor: 'pointer',
                                }}
                              >
                                Edit Album
                              </button>
                              <button
                                onClick={() => handleDeleteAlbum(album.id, album.title)}
                                style={{
                                  padding: '0.45rem 0.75rem',
                                  background: '#fef2f2',
                                  border: '1px solid #fecaca',
                                  borderRadius: '3px',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  color: '#dc2626',
                                  cursor: 'pointer',
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── TAB 3: ABOUT SECTION PROFILE ── */}
                  {activeTab === 'about' && (
                    <div
                      style={{
                        padding: '1.75rem',
                        overflowY: 'auto',
                        flexGrow: 1,
                        background: '#fcfbf9',
                      }}
                    >
                      <form
                        onSubmit={handleSaveAboutProfile}
                        style={{
                          maxWidth: '640px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1.25rem',
                          background: '#ffffff',
                          padding: '1.5rem',
                          border: '1px solid rgba(18, 18, 20, 0.08)',
                          borderRadius: '4px',
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: '"Cormorant Garamond", Georgia, serif',
                            fontSize: '1.4rem',
                            fontWeight: 500,
                            color: '#121214',
                          }}
                        >
                          Meet Lakshan — About Section Profile
                        </h3>

                        {/* Portrait Preview & Upload */}
                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              color: '#575550',
                              marginBottom: '0.5rem',
                            }}
                          >
                            Lakshan&apos;s Portrait Photo
                          </label>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div
                              style={{
                                width: '90px',
                                height: '120px',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                border: '1px solid #b38728',
                                background: '#f3efe6',
                                flexShrink: 0,
                              }}
                            >
                              <img
                                src={aboutPhoto}
                                alt="Lakshan Portrait Preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                              <input
                                ref={aboutFileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileUpload(e, 'about')}
                                style={{ display: 'none' }}
                              />
                              <button
                                type="button"
                                onClick={() => aboutFileInputRef.current?.click()}
                                style={{
                                  padding: '0.6rem 1rem',
                                  background: 'rgba(179, 135, 40, 0.08)',
                                  border: '1px dashed #b38728',
                                  borderRadius: '4px',
                                  color: '#b38728',
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                  cursor: 'pointer',
                                }}
                              >
                                📁 Pick New Photo from Computer / Phone
                              </button>
                              <input
                                type="text"
                                placeholder="Or enter direct image URL..."
                                value={aboutPhoto}
                                onChange={(e) => setAboutPhoto(e.target.value)}
                                style={{
                                  padding: '0.55rem',
                                  fontSize: '0.75rem',
                                  border: '1px solid rgba(18, 18, 20, 0.15)',
                                  borderRadius: '3px',
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#575550' }}>
                            Photographer Full Name
                          </label>
                          <input
                            type="text"
                            value={aboutName}
                            onChange={(e) => setAboutName(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.55rem',
                              border: '1px solid rgba(18, 18, 20, 0.15)',
                              borderRadius: '3px',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#575550' }}>
                            Headline Title
                          </label>
                          <input
                            type="text"
                            value={aboutTitle}
                            onChange={(e) => setAboutTitle(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.55rem',
                              border: '1px solid rgba(18, 18, 20, 0.15)',
                              borderRadius: '3px',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#575550' }}>
                            Storytelling Philosophy (Paragraph 1)
                          </label>
                          <textarea
                            rows={3}
                            value={aboutBio1}
                            onChange={(e) => setAboutBio1(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.55rem',
                              border: '1px solid rgba(18, 18, 20, 0.15)',
                              borderRadius: '3px',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#575550' }}>
                            Client Approach &amp; Milestones (Paragraph 2)
                          </label>
                          <textarea
                            rows={3}
                            value={aboutBio2}
                            onChange={(e) => setAboutBio2(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.55rem',
                              border: '1px solid rgba(18, 18, 20, 0.15)',
                              borderRadius: '3px',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        {aboutSaveSuccess && (
                          <div
                            style={{
                              background: '#ecfdf5',
                              border: '1px solid #a7f3d0',
                              color: '#065f46',
                              padding: '0.65rem',
                              borderRadius: '4px',
                              fontSize: '0.78rem',
                            }}
                          >
                            ✓ About section profile updated successfully!
                          </div>
                        )}

                        <button
                          type="submit"
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: '#b38728',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 600,
                            fontSize: '0.8rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            alignSelf: 'flex-start',
                          }}
                        >
                          Save About Profile
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: ADD / EDIT PORTFOLIO PHOTO ── */}
      <AnimatePresence>
        {photoModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '1rem',
            }}
            onClick={() => setPhotoModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '560px',
                maxHeight: '90vh',
                overflowY: 'auto',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                padding: '2rem',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              }}
            >
              <h3
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: '1.6rem',
                  fontWeight: 500,
                  marginBottom: '0.35rem',
                }}
              >
                {editingPhotoId ? 'Edit Photograph Details' : 'Add New Photograph to Portfolio'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#8c8880', marginBottom: '1.5rem' }}>
                Fill in the photoshoot details. Changes will immediately update on the live website.
              </p>

              <form onSubmit={handlePhotoFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Photo File upload / URL */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Photo Image * (Upload from Device or Paste URL)
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, 'photo')}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '0.65rem 1rem',
                        background: 'rgba(179, 135, 40, 0.08)',
                        border: '1px dashed #b38728',
                        borderRadius: '4px',
                        color: '#b38728',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      📁 Pick Image from Computer / Phone
                    </button>

                    <input
                      type="text"
                      placeholder="Or paste direct image URL (e.g. /my-photo.jpg or https://...)"
                      value={photoSrc}
                      onChange={(e) => setPhotoSrc(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: '1px solid rgba(18, 18, 20, 0.15)',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {photoSrc && (
                    <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={photoSrc}
                        alt="Preview"
                        style={{
                          width: '70px',
                          height: '70px',
                          objectFit: 'cover',
                          borderRadius: '3px',
                          border: '1px solid #b38728',
                        }}
                      />
                      <span style={{ fontSize: '0.7rem', color: '#16a34a' }}>✓ Image ready for publishing</span>
                    </div>
                  )}
                </div>

                {/* Title & Category */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Photo Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Honours Regalia Walk"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: '1px solid rgba(18, 18, 20, 0.15)',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Shoot Category *
                    </label>
                    <select
                      value={photoCategory}
                      onChange={(e) => setPhotoCategory(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: '1px solid rgba(18, 18, 20, 0.15)',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        background: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location & Aspect Ratio */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Photoshoot Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BMICH, Colombo"
                      value={photoLocation}
                      onChange={(e) => setPhotoLocation(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: '1px solid rgba(18, 18, 20, 0.15)',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Aspect Ratio
                    </label>
                    <select
                      value={photoAspect}
                      onChange={(e) => setPhotoAspect(e.target.value as AspectRatioKey)}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: '1px solid rgba(18, 18, 20, 0.15)',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        background: '#ffffff',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="2:3">Portrait (2:3)</option>
                      <option value="3:2">Landscape (3:2)</option>
                      <option value="4:5">Classic (4:5)</option>
                      <option value="1:1">Square (1:1)</option>
                    </select>
                  </div>
                </div>

                {/* EXIF Camera Metadata */}
                <div
                  style={{
                    background: '#faf8f5',
                    padding: '0.85rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(179,135,40,0.2)',
                  }}
                >
                  <p
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#b38728',
                      marginBottom: '0.65rem',
                    }}
                  >
                    Camera &amp; Lens Metadata (EXIF)
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 0.8fr', gap: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.6rem', color: '#575550' }}>Camera</span>
                      <input
                        type="text"
                        value={camera}
                        onChange={(e) => setCamera(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.45rem',
                          fontSize: '0.75rem',
                          border: '1px solid rgba(18,18,20,0.15)',
                          borderRadius: '2px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.6rem', color: '#575550' }}>Lens</span>
                      <input
                        type="text"
                        value={lens}
                        onChange={(e) => setLens(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.45rem',
                          fontSize: '0.75rem',
                          border: '1px solid rgba(18,18,20,0.15)',
                          borderRadius: '2px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.6rem', color: '#575550' }}>Aperture</span>
                      <input
                        type="text"
                        value={aperture}
                        onChange={(e) => setAperture(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.45rem',
                          fontSize: '0.75rem',
                          border: '1px solid rgba(18,18,20,0.15)',
                          borderRadius: '2px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.6rem', color: '#575550' }}>Shutter Speed</span>
                      <input
                        type="text"
                        value={shutterSpeed}
                        onChange={(e) => setShutterSpeed(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.45rem',
                          fontSize: '0.75rem',
                          border: '1px solid rgba(18,18,20,0.15)',
                          borderRadius: '2px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.6rem', color: '#575550' }}>ISO</span>
                      <input
                        type="text"
                        value={iso}
                        onChange={(e) => setIso(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.45rem',
                          fontSize: '0.75rem',
                          border: '1px solid rgba(18,18,20,0.15)',
                          borderRadius: '2px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setPhotoModalOpen(false)}
                    style={{
                      padding: '0.65rem 1.25rem',
                      background: '#faf8f5',
                      border: '1px solid rgba(18,18,20,0.15)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.65rem 1.5rem',
                      background: '#b38728',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {editingPhotoId ? 'Update Photograph' : 'Publish Photograph'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: ADD / EDIT STORY ALBUM ── */}
      <AnimatePresence>
        {albumModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '1rem',
            }}
            onClick={() => setAlbumModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '560px',
                maxHeight: '90vh',
                overflowY: 'auto',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                padding: '2rem',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              }}
            >
              <h3
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: '1.6rem',
                  fontWeight: 500,
                  marginBottom: '0.35rem',
                }}
              >
                {editingAlbumId ? 'Edit Story Album' : 'Create New Client Story Album'}
              </h3>
              <p style={{ fontSize: '0.75rem', color: '#8c8880', marginBottom: '1.5rem' }}>
                Manage full shoot storytelling albums for client viewing.
              </p>

              <form onSubmit={handleAlbumFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                    Album Cover Photo *
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input
                      ref={albumFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageFileUpload(e, 'album')}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => albumFileInputRef.current?.click()}
                      style={{
                        padding: '0.65rem 1rem',
                        background: 'rgba(179, 135, 40, 0.08)',
                        border: '1px dashed #b38728',
                        borderRadius: '4px',
                        color: '#b38728',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      📁 Pick Cover from Device
                    </button>
                    <input
                      type="text"
                      placeholder="Or paste cover image URL..."
                      value={albumCover}
                      onChange={(e) => setAlbumCover(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: '1px solid rgba(18, 18, 20, 0.15)',
                        borderRadius: '3px',
                        fontSize: '0.8rem',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  {albumCover && (
                    <img
                      src={albumCover}
                      alt="Album Cover Preview"
                      style={{
                        marginTop: '0.5rem',
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Album Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kasun & Tharushi"
                      value={albumTitle}
                      onChange={(e) => setAlbumTitle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: '1px solid rgba(18, 18, 20, 0.15)',
                        borderRadius: '3px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Category
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Weddings & Homecomings"
                      value={albumCategory}
                      onChange={(e) => setAlbumCategory(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem',
                        border: '1px solid rgba(18, 18, 20, 0.15)',
                        borderRadius: '3px',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Subtitle / Shoot Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grand Homecoming at Cinnamon Grand"
                    value={albumSubtitle}
                    onChange={(e) => setAlbumSubtitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid rgba(18, 18, 20, 0.15)',
                      borderRadius: '3px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cinnamon Grand, Colombo"
                    value={albumLocation}
                    onChange={(e) => setAlbumLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid rgba(18, 18, 20, 0.15)',
                      borderRadius: '3px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Story Narrative (Double line break for new paragraph)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write the behind-the-scenes story and narrative here..."
                    value={albumDesc}
                    onChange={(e) => setAlbumDesc(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem',
                      border: '1px solid rgba(18, 18, 20, 0.15)',
                      borderRadius: '3px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setAlbumModalOpen(false)}
                    style={{
                      padding: '0.65rem 1.25rem',
                      background: '#faf8f5',
                      border: '1px solid rgba(18,18,20,0.15)',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.65rem 1.5rem',
                      background: '#b38728',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {editingAlbumId ? 'Update Album' : 'Save Story Album'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
