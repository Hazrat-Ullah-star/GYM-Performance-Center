import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, OptimizedImage } from '../components/ui';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

type FilterCategory = 'all' | 'gym' | 'classes' | 'equipment' | 'events';

interface GalleryImage {
  src: string;
  alt: string;
  category: Exclude<FilterCategory, 'all'>;
}

const galleryImages: GalleryImage[] = [
  { src: '/img/gallery/gallery-1.jpg', alt: 'Gym Floor - Main Training Area', category: 'gym' },
  { src: '/img/gallery/gallery-2.jpg', alt: 'Group Fitness Class in Session', category: 'classes' },
  { src: '/img/gallery/gallery-3.jpg', alt: 'Premium Equipment Zone', category: 'equipment' },
  { src: '/img/gallery/gallery-4.jpg', alt: 'Cardio & Functional Training', category: 'gym' },
  { src: '/img/gallery/gallery-5.jpg', alt: 'Annual Fitness Championship Event', category: 'events' },
  { src: '/img/gallery/gallery-6.jpg', alt: 'Yoga & Mobility Class', category: 'classes' },
  { src: '/img/gallery/gallery-7.jpg', alt: 'Olympic Lifting Platform', category: 'equipment' },
  { src: '/img/gallery/gallery-8.jpg', alt: 'Open Gym - Free Weight Floor', category: 'gym' },
  { src: '/img/gallery/gallery-9.jpg', alt: 'Member Appreciation Night', category: 'events' },
];

const filters: { id: FilterCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'gym', label: 'Gym Floor' },
  { id: 'classes', label: 'Classes' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'events', label: 'Events' },
];

const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages =
    activeFilter === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeFilter);

  const openLightbox = React.useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = React.useCallback(() => setLightboxIndex(null), []);
  const prevImage = React.useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + filteredImages.length) % filteredImages.length : null)),
    [filteredImages.length]
  );
  const nextImage = React.useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % filteredImages.length : null)),
    [filteredImages.length]
  );

  // Handle keyboard navigation
  React.useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, closeLightbox, nextImage, prevImage]);

  return (
    <>
      {/* Hero Banner */}
      <section
        className="position-relative py-5 d-flex align-items-center"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(243,97,0,0.12) 0%, rgba(8,12,16,1) 80%)',
          minHeight: '32vh',
        }}
      >
        <div className="container text-center">
          <Badge variant="primary" className="mb-3 px-3 py-2 inline-flex items-center gap-2">
            <ImageIcon size={14} /> OUR GALLERY
          </Badge>
          <h1
            className="display-4 text-white fw-bold text-uppercase"
            style={{ fontFamily: 'Oswald' }}
          >
            Explore Our Facilities
          </h1>
          <p className="text-secondary text-sm max-w-xl mx-auto mb-3">
            Take a visual tour of Islamabad's premier fitness destination — from our training floor to group studios.
          </p>
          <div className="d-flex justify-content-center align-items-center gap-2 text-secondary text-sm">
            <Link to="/" className="text-secondary text-decoration-none hover-orange">Home</Link>
            <span>/</span>
            <span className="text-white">Gallery</span>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="spad">
        <div className="container">
          {/* Filter Tabs */}
          <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className="btn btn-sm px-4 py-2 rounded-pill fw-semibold transition-all"
                style={{
                  background: activeFilter === f.id ? '#f36100' : 'rgba(20, 27, 36, 0.65)',
                  color: activeFilter === f.id ? '#fff' : '#94a3b8',
                  border: `1px solid ${activeFilter === f.id ? '#f36100' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all 0.2s ease',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="row g-3">
            {filteredImages.map((img, idx) => (
              <div key={img.src} className="col-lg-4 col-md-6">
                <div
                  className="position-relative overflow-hidden rounded-4 cursor-pointer gallery-thumb"
                  style={{ aspectRatio: '4/3', cursor: 'pointer' }}
                  onClick={() => openLightbox(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openLightbox(idx)}
                  aria-label={`View ${img.alt}`}
                >
                  <OptimizedImage
                    src={img.src}
                    alt={img.alt}
                    className="w-100 h-100"
                    blur={true}
                    style={{ objectFit: 'cover', transition: 'transform 0.4s ease, filter 0.4s ease, opacity 0.4s ease' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.07)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Overlay */}
                  <div
                    className="position-absolute inset-0 d-flex align-items-center justify-content-center gallery-overlay"
                    style={{
                      background: 'rgba(243, 97, 0, 0)',
                      transition: 'background 0.3s ease',
                      top: 0, left: 0, right: 0, bottom: 0,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(243, 97, 0, 0.4)';
                      const icon = e.currentTarget.querySelector('.zoom-icon') as HTMLElement;
                      if (icon) { icon.style.opacity = '1'; icon.style.transform = 'scale(1)'; }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(243, 97, 0, 0)';
                      const icon = e.currentTarget.querySelector('.zoom-icon') as HTMLElement;
                      if (icon) { icon.style.opacity = '0'; icon.style.transform = 'scale(0.8)'; }
                    }}
                  >
                    <ZoomIn
                      size={36}
                      className="zoom-icon text-white"
                      style={{ opacity: 0, transform: 'scale(0.8)', transition: 'all 0.3s ease' }}
                    />
                  </div>
                  {/* Category label */}
                  <span
                    className="position-absolute bottom-0 start-0 m-2 badge text-uppercase fw-semibold"
                    style={{
                      background: 'rgba(0,0,0,0.65)',
                      backdropFilter: 'blur(6px)',
                      fontSize: '10px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {img.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-5 text-secondary">
              <ImageIcon size={48} className="mb-3 opacity-25" />
              <p>No images found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="position-fixed d-flex align-items-center justify-content-center"
          style={{
            inset: 0,
            background: 'rgba(0, 0, 0, 0.92)',
            zIndex: 9999,
            backdropFilter: 'blur(10px)',
          }}
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="position-absolute btn btn-sm"
            style={{ top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '50%', width: '44px', height: '44px' }}
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          <button
            className="position-absolute btn btn-sm"
            style={{ left: '20px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '50%', width: '44px', height: '44px' }}
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Image */}
          <div onClick={(e) => e.stopPropagation()} className="text-center px-5">
            <OptimizedImage
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].alt}
              blur={false}
              style={{ maxHeight: '80vh', maxWidth: '90vw', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}
            />
            <p className="text-secondary mt-3 text-sm">{filteredImages[lightboxIndex].alt}</p>
            <p className="text-secondary text-xs">{lightboxIndex + 1} / {filteredImages.length}</p>
          </div>

          {/* Next */}
          <button
            className="position-absolute btn btn-sm"
            style={{ right: '20px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '50%', width: '44px', height: '44px' }}
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </>
  );
};

export default Gallery;
