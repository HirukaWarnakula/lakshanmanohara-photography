/**
 * ClientStoriesSection.tsx
 *
 * Featured Stories & Full Albums section (#client-stories)
 * Displays 4 story cards with smooth modal gallery for full multi-photo shoot viewing.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { albumsData } from '../data/albumsData';
import type { StoryAlbum, AlbumPhoto } from '../data/albumsData';
import { getStoredAlbums, UPDATE_EVENT_NAME } from '../utils/studioStore';

export default function ClientStoriesSection() {
  const [albums, setAlbums] = useState<StoryAlbum[]>(albumsData);
  const [selectedAlbum, setSelectedAlbum] = useState<StoryAlbum | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  // Sync albums with studioStore and listen for updates
  useEffect(() => {
    setAlbums(getStoredAlbums());

    const handleUpdate = () => {
      setAlbums(getStoredAlbums());
    };
    window.addEventListener(UPDATE_EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(UPDATE_EVENT_NAME, handleUpdate);
  }, []);

  // Keyboard navigation & body scroll lock when modal is open
  useEffect(() => {
    if (!selectedAlbum) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedAlbum(null);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) =>
          prev === 0 ? selectedAlbum.photos.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) =>
          prev === selectedAlbum.photos.length - 1 ? 0 : prev + 1
        );
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [selectedAlbum]);

  const openAlbum = (album: StoryAlbum) => {
    setSelectedAlbum(album);
    setActivePhotoIndex(0);
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
  };

  return (
    <section
      id="client-stories"
      style={{
        backgroundColor: '#f3efe6',
        borderTop: '1px solid rgba(18, 18, 20, 0.06)',
        borderBottom: '1px solid rgba(18, 18, 20, 0.06)',
        paddingTop: '3.5rem',
        paddingBottom: '6rem',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingInline: '1.5rem' }}>
        {/* ── Section Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#b38728',
              marginBottom: '0.75rem',
            }}
          >
            Unhurried Narratives
          </p>

          <h2
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 300,
              color: '#121214',
              lineHeight: 1.1,
              marginBottom: '0.85rem',
            }}
          >
            Featured Stories &amp; Full Albums
          </h2>

          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.95rem',
              color: '#575550',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.75,
            }}
          >
            Explore complete, unhurried narratives from our recent sessions across Sri Lanka.
          </p>
        </div>

        {/* ── Albums Grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {albums.map((album, idx) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => openAlbum(album)}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(18, 18, 20, 0.08)',
                borderRadius: '2px',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#b38728';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(18, 18, 20, 0.08)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.04)';
              }}
            >
              {/* Cover Image Container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/10',
                  overflow: 'hidden',
                  backgroundColor: '#f3efe6',
                }}
              >
                <img
                  src={album.coverImage}
                  alt={album.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />

                {/* Badges on image */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.85rem',
                    left: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(179, 135, 40, 0.35)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '2px',
                    fontSize: '0.62rem',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#b38728',
                    fontWeight: 600,
                  }}
                >
                  {album.category}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.85rem',
                    right: '0.85rem',
                    backgroundColor: 'rgba(18, 18, 20, 0.78)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '2px',
                    fontSize: '0.62rem',
                    fontFamily: 'Inter, sans-serif',
                    color: '#ffffff',
                    fontWeight: 500,
                  }}
                >
                  {album.photos.length} Photos
                </div>
              </div>

              {/* Card Body */}
              <div
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.68rem',
                      color: '#8c8880',
                      letterSpacing: '0.08em',
                      marginBottom: '0.4rem',
                      fontWeight: 500,
                    }}
                  >
                    📍 {album.location}
                  </p>

                  <h3
                    style={{
                      fontFamily: '"Cormorant Garamond", Georgia, serif',
                      fontSize: '1.45rem',
                      fontWeight: 400,
                      color: '#121214',
                      lineHeight: 1.2,
                      marginBottom: '0.65rem',
                    }}
                  >
                    {album.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.82rem',
                      color: '#575550',
                      lineHeight: 1.6,
                      marginBottom: '1.25rem',
                    }}
                  >
                    {album.subtitle}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(18, 18, 20, 0.06)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#b38728',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    Explore Album <span>&rarr;</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Full Album Modal ── */}
      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(5, 5, 5, 0.94)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Modal Header Bar */}
            <div
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 20,
                backgroundColor: 'rgba(10, 10, 10, 0.85)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(245, 245, 247, 0.08)',
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#d4af37',
                    display: 'block',
                    marginBottom: '0.2rem',
                  }}
                >
                  {selectedAlbum.category} &bull; {selectedAlbum.location}
                </span>
                <h3
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '1.35rem',
                    color: '#f5f5f7',
                    fontWeight: 300,
                  }}
                >
                  {selectedAlbum.title}
                </h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <a
                  href="#contact"
                  onClick={closeAlbum}
                  className="btn-gold"
                  style={{ fontSize: '0.68rem', padding: '0.45rem 1rem' }}
                >
                  <span>Book This Shoot Style</span>
                </a>

                <button
                  onClick={closeAlbum}
                  aria-label="Close album modal"
                  style={{
                    background: 'rgba(245, 245, 247, 0.08)',
                    border: '1px solid rgba(245, 245, 247, 0.15)',
                    color: '#f5f5f7',
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
                    e.currentTarget.style.borderColor = '#d4af37';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(245, 245, 247, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(245, 245, 247, 0.15)';
                  }}
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div
              style={{
                maxWidth: '1200px',
                width: '100%',
                margin: '0 auto',
                padding: '2.5rem 1.5rem 4rem',
              }}
            >
              {/* Narrative banner */}
              <div
                style={{
                  backgroundColor: '#141414',
                  border: '1px solid rgba(245, 245, 247, 0.08)',
                  padding: '2rem',
                  marginBottom: '2.5rem',
                }}
              >
                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '1.25rem',
                    color: '#f5f5f7',
                    lineHeight: 1.6,
                    marginBottom: '1rem',
                  }}
                >
                  {selectedAlbum.storyDescription}
                </p>
                {selectedAlbum.clientHighlight && (
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8rem',
                      color: '#d4af37',
                      fontStyle: 'italic',
                    }}
                  >
                    {selectedAlbum.clientHighlight}
                  </p>
                )}
              </div>

              {/* Active Main Viewer */}
              {selectedAlbum.photos[activePhotoIndex] && (
                <div
                  style={{
                    position: 'relative',
                    backgroundColor: '#0a0a0a',
                    border: '1px solid rgba(245, 245, 247, 0.08)',
                    overflow: 'hidden',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      maxHeight: '70vh',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#000',
                    }}
                  >
                    <img
                      src={selectedAlbum.photos[activePhotoIndex].src}
                      alt={selectedAlbum.photos[activePhotoIndex].title}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '70vh',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />

                    {/* Left arrow */}
                    <button
                      onClick={() =>
                        setActivePhotoIndex((prev) =>
                          prev === 0 ? selectedAlbum.photos.length - 1 : prev - 1
                        )
                      }
                      aria-label="Previous photo"
                      style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '2.75rem',
                        height: '2.75rem',
                        background: 'rgba(10, 10, 10, 0.65)',
                        border: '1px solid rgba(245, 245, 247, 0.15)',
                        color: '#f5f5f7',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                      }}
                    >
                      &#8249;
                    </button>

                    {/* Right arrow */}
                    <button
                      onClick={() =>
                        setActivePhotoIndex((prev) =>
                          prev === selectedAlbum.photos.length - 1 ? 0 : prev + 1
                        )
                      }
                      aria-label="Next photo"
                      style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '2.75rem',
                        height: '2.75rem',
                        background: 'rgba(10, 10, 10, 0.65)',
                        border: '1px solid rgba(245, 245, 247, 0.15)',
                        color: '#f5f5f7',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                      }}
                    >
                      &#8250;
                    </button>
                  </div>

                  {/* Photo Caption Strip */}
                  <div
                    style={{
                      width: '100%',
                      padding: '1rem 1.5rem',
                      backgroundColor: '#121212',
                      borderTop: '1px solid rgba(245, 245, 247, 0.06)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.75rem',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontFamily: '"Cormorant Garamond", Georgia, serif',
                          fontSize: '1.2rem',
                          color: '#f5f5f7',
                          fontWeight: 400,
                        }}
                      >
                        {selectedAlbum.photos[activePhotoIndex].title}
                      </h4>
                      {selectedAlbum.photos[activePhotoIndex].caption && (
                        <p
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '0.78rem',
                            color: '#999',
                            marginTop: '0.2rem',
                          }}
                        >
                          {selectedAlbum.photos[activePhotoIndex].caption}
                        </p>
                      )}
                    </div>

                    <span
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.72rem',
                        color: '#d4af37',
                        letterSpacing: '0.1em',
                      }}
                    >
                      {activePhotoIndex + 1} of {selectedAlbum.photos.length}
                    </span>
                  </div>
                </div>
              )}

              {/* Thumbnails Filmstrip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: '0.75rem',
                  marginTop: '1.5rem',
                }}
              >
                {selectedAlbum.photos.map((photo, pIdx) => (
                  <div
                    key={photo.id}
                    onClick={() => setActivePhotoIndex(pIdx)}
                    style={{
                      aspectRatio: '3/2',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border:
                        pIdx === activePhotoIndex
                          ? '2px solid #d4af37'
                          : '1px solid rgba(245, 245, 247, 0.1)',
                      opacity: pIdx === activePhotoIndex ? 1 : 0.65,
                      transition: 'all 0.2s ease',
                      backgroundColor: '#000',
                    }}
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
