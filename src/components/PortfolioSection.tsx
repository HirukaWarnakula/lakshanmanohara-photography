/**
 * PortfolioSection.tsx
 * All-in-one interactive gallery: filter bar → CSS masonry → EXIF hover overlay → Framer Motion lightbox.
 * Rendered with client:visible in Astro for deferred hydration.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioItems, CATEGORIES } from '../data/portfolioData';
import type { PortfolioItem, CategoryLabel } from '../data/portfolioData';
import { getStoredPortfolio, UPDATE_EVENT_NAME } from '../utils/studioStore';

// ─────────────────────────────────────────────────────────────────────────────
// LIGHTBOX
// ─────────────────────────────────────────────────────────────────────────────

interface LightboxProps {
  items: PortfolioItem[];
  index: number;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
}

function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const item = items[index];
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Keyboard navigation + body scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') onNavigate(-1);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') onNavigate(1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onNavigate]);

  const NavBtn = ({ dir }: { dir: 1 | -1 }) => (
    <button
      onClick={(e) => { e.stopPropagation(); onNavigate(dir); }}
      aria-label={dir === -1 ? 'Previous photo' : 'Next photo'}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        ...(dir === -1 ? { left: '1rem' } : { right: '1rem' }),
        width: '2.75rem',
        height: '2.75rem',
        background: 'rgba(245,245,247,0.06)',
        border: '1px solid rgba(245,245,247,0.12)',
        color: 'rgba(245,245,247,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '1rem',
        zIndex: 2,
        transition: 'background 0.2s, border-color 0.2s, color 0.2s',
      }}
      onMouseEnter={(e) => {
        const b = e.currentTarget;
        b.style.background = 'rgba(212,175,55,0.15)';
        b.style.borderColor = 'rgba(212,175,55,0.6)';
        b.style.color = '#d4af37';
      }}
      onMouseLeave={(e) => {
        const b = e.currentTarget;
        b.style.background = 'rgba(245,245,247,0.06)';
        b.style.borderColor = 'rgba(245,245,247,0.12)';
        b.style.color = 'rgba(245,245,247,0.65)';
      }}
    >
      {dir === -1 ? '←' : '→'}
    </button>
  );

  return (
    <motion.div
      key="lightbox-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        background: 'rgba(4,4,4,0.97)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'zoom-out',
      }}
    >
      {/* Counter */}
      <p
        aria-live="polite"
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'Inter, sans-serif',
          fontSize: '0.6rem',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color: 'rgba(245,245,247,0.28)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {index + 1} / {items.length}
      </p>

      {/* Close */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close lightbox"
        style={{
          position: 'absolute',
          top: '1.1rem',
          right: '1.5rem',
          background: 'none',
          border: 'none',
          color: 'rgba(245,245,247,0.45)',
          fontSize: '1.1rem',
          cursor: 'pointer',
          zIndex: 3,
          padding: '0.5rem',
          lineHeight: 1,
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f5f5f7'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(245,245,247,0.45)'; }}
      >
        ✕
      </button>

      {/* Prev / Next navigation arrows */}
      <NavBtn dir={-1} />
      <NavBtn dir={1} />

      {/* Image panel — animates per item */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 }}
          transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
          }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            const dy = e.changedTouches[0].clientY - touchStartY.current;
            // Only swipe horizontally if that's the dominant direction
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
              onNavigate(dx < 0 ? 1 : -1);
            }
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            maxWidth: 'min(90vw, 1280px)',
            cursor: 'default',
          }}
        >
          <img
            src={item.srcFull}
            alt={item.alt}
            loading="eager"
            style={{
              display: 'block',
              maxWidth: '100%',
              maxHeight: '74vh',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
            }}
          />

          {/* Caption row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              gap: '2rem',
              paddingInline: '0.125rem',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: '"Cormorant Garamond", Georgia, serif',
                  fontSize: '1.05rem',
                  fontWeight: 300,
                  color: '#f5f5f7',
                  marginBottom: '0.3rem',
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </p>
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.58rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#a3a3a3',
                }}
              >
                {item.category} &bull; {item.location}
              </p>
            </div>

            {/* EXIF data */}
            <p
              style={{
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '0.58rem',
                color: 'rgba(245,245,247,0.22)',
                lineHeight: 1.9,
                textAlign: 'right',
                flexShrink: 0,
                letterSpacing: '0.03em',
              }}
            >
              {item.exif.camera}
              <br />
              {item.exif.lens} {item.exif.aperture}
              <br />
              {item.exif.shutterSpeed} &bull; {item.exif.iso}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY ITEM
// ─────────────────────────────────────────────────────────────────────────────

interface GalleryItemProps {
  item: PortfolioItem;
  index: number;
  onClick: () => void;
}

function GalleryItem({ item, index, onClick }: GalleryItemProps) {
  const [hovered, setHovered] = useState(false);

  // Short category label for the badge (avoids overflow on small cards)
  const badgeLabel = item.category.split(' ')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.52,
        delay: Math.min(index * 0.055, 0.55),
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        breakInside: 'avoid',
        marginBottom: '0.75rem',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#f3efe6',
        borderRadius: '2px',
        border: '1px solid rgba(18, 18, 20, 0.07)',
        boxShadow: '0 3px 14px rgba(0, 0, 0, 0.05)',
        display: 'block',
      }}
    >
      {/* ── Photograph ── */}
      <img
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        loading="lazy"
        decoding="async"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          transition: 'transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
        }}
      />

      {/* ── EXIF Hover Overlay (desktop) ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background:
            'linear-gradient(to top, rgba(14,14,16,0.95) 0%, rgba(14,14,16,0.72) 50%, transparent 100%)',
          padding: '2.25rem 0.875rem 0.875rem',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.32s ease, transform 0.32s ease',
          pointerEvents: 'none',
        }}
      >
        {/* Location */}
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.58rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#ffd875',
            fontWeight: 600,
            marginBottom: '0.55rem',
          }}
        >
          {item.location}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          {/* Category badge */}
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.46rem',
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#ffd875',
              border: '1px solid rgba(255,216,117,0.5)',
              padding: '0.15rem 0.5rem',
              lineHeight: 1.6,
              flexShrink: 0,
            }}
          >
            {badgeLabel}
          </span>

          {/* EXIF monospace */}
          <p
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '0.48rem',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.75,
              textAlign: 'right',
              letterSpacing: '0.03em',
            }}
          >
            {item.exif.lens} {item.exif.aperture} &bull; {item.exif.shutterSpeed} &bull; {item.exif.iso}
          </p>
        </div>
      </div>

      {/* ── Mobile always-visible info pill ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '0.6rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(179,135,40,0.35)',
          borderRadius: '9999px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          padding: '0.2rem 0.75rem',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: hovered ? 0 : 1,
          transition: 'opacity 0.2s',
        }}
        className="lm-mobile-pill"
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.52rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#b38728',
          }}
        >
          {item.category}
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER BAR
// ─────────────────────────────────────────────────────────────────────────────

interface FilterBarProps {
  active: CategoryLabel;
  onChange: (c: CategoryLabel) => void;
}

function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div
      role="group"
      aria-label="Filter portfolio by category"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'center',
        overflowX: 'auto',
        paddingBottom: '0.25rem',
      }}
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat === active;
        return (
          <motion.button
            key={cat}
            onClick={() => onChange(cat)}
            whileTap={{ scale: 0.97 }}
            aria-pressed={isActive}
            style={{
              position: 'relative',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '0.55rem 1.25rem',
              background: isActive ? '#b38728' : '#ffffff',
              border: `1px solid ${isActive ? '#b38728' : 'rgba(18,18,20,0.12)'}`,
              color: isActive ? '#ffffff' : '#575550',
              boxShadow: isActive
                ? '0 4px 14px rgba(179,135,40,0.28)'
                : '0 1px 4px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'background 0.22s, border-color 0.22s, color 0.22s, box-shadow 0.22s',
              whiteSpace: 'nowrap',
              outline: 'none',
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => {
              if (isActive) return;
              const b = e.currentTarget;
              b.style.color = '#121214';
              b.style.borderColor = '#b38728';
              b.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              if (isActive) return;
              const b = e.currentTarget;
              b.style.color = '#575550';
              b.style.borderColor = 'rgba(18,18,20,0.12)';
              b.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)';
            }}
          >
            {cat}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MASONRY GRID
// ─────────────────────────────────────────────────────────────────────────────

interface MasonryGridProps {
  items: PortfolioItem[];
  onItemClick: (index: number) => void;
}

function MasonryGrid({ items, onItemClick }: MasonryGridProps) {
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCols(1);
      else if (window.innerWidth < 1024) setCols(2);
      else setCols(3);
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div
      style={{
        columnCount: cols,
        columnGap: '0.85rem',
      }}
    >
      {items.map((item, i) => (
        <GalleryItem
          key={item.id}
          item={item}
          index={i}
          onClick={() => onItemClick(i)}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PORTFOLIO SECTION
// ─────────────────────────────────────────────────────────────────────────────

export default function PortfolioSection() {
  const [items, setItems] = useState<PortfolioItem[]>(portfolioItems);
  const [activeFilter, setActiveFilter] = useState<CategoryLabel>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Sync with client-side localStorage and listen for updates from StudioManager
  useEffect(() => {
    setItems(getStoredPortfolio());

    const handleUpdate = () => {
      setItems(getStoredPortfolio());
    };
    window.addEventListener(UPDATE_EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(UPDATE_EVENT_NAME, handleUpdate);
  }, []);

  const filteredItems =
    activeFilter === 'All'
      ? items
      : items.filter((i) => i.category === activeFilter);

  // Close lightbox when filter changes
  useEffect(() => {
    setLightboxOpen(false);
  }, [activeFilter]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const navigateLightbox = useCallback(
    (dir: 1 | -1) => {
      setLightboxIndex((prev) => {
        const next = prev + dir;
        if (next < 0) return filteredItems.length - 1;
        if (next >= filteredItems.length) return 0;
        return next;
      });
    },
    [filteredItems.length]
  );

  return (
    <section
      id="portfolio"
      style={{
        backgroundColor: '#faf8f5',
        paddingTop: '3.5rem',
        paddingBottom: '6rem',
      }}
    >
      {/* ── Section header ── */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingInline: '1.5rem',
          textAlign: 'center',
          marginBottom: '3rem',
        }}
      >
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
          Selected Works
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
          Curated Visual Works
        </h2>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.95rem',
            color: '#575550',
            maxWidth: '520px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.75,
            fontStyle: 'italic',
          }}
        >
          "Beyond photos, we preserve the moments that matter."
        </p>

        {/* Filter bar */}
        <FilterBar active={activeFilter} onChange={setActiveFilter} />
      </div>

      {/* ── Masonry grid with filter transition ── */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingInline: '1.5rem',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <MasonryGrid items={filteredItems} onItemClick={openLightbox} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            items={filteredItems}
            index={lightboxIndex}
            onClose={closeLightbox}
            onNavigate={navigateLightbox}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
