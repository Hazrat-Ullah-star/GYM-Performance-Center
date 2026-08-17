import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Intrinsic width in px — prevents CLS */
  width?: number;
  /** Intrinsic height in px — prevents CLS */
  height?: number;
  /** Extra class for wrapper div */
  wrapperClassName?: string;
  /** Inline styles for wrapper */
  wrapperStyle?: React.CSSProperties;
  /** Show a blur-up placeholder while loading */
  blur?: boolean;
  /** Use IntersectionObserver instead of native loading="lazy" for fine-grained control */
  useObserver?: boolean;
}

/**
 * OptimizedImage — drop-in <img> replacement with:
 *  - loading="lazy" (native browser lazy loading)
 *  - decoding="async" (non-blocking image decode)
 *  - blur-up placeholder while loading
 *  - IntersectionObserver fallback for older browsers
 *  - intrinsic width/height to prevent CLS
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  wrapperClassName = '',
  wrapperStyle,
  blur = true,
  useObserver = false,
  style,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(!useObserver);
  const imgRef = useRef<HTMLImageElement>(null);

  // IntersectionObserver-based lazy loading (fallback / override)
  useEffect(() => {
    if (!useObserver) return;
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [useObserver]);

  const imgStyle: React.CSSProperties = {
    transition: blur ? 'filter 0.4s ease, opacity 0.4s ease' : undefined,
    filter: blur && !loaded ? 'blur(8px)' : 'none',
    opacity: loaded ? 1 : 0.6,
    ...style,
  };

  return (
    <div className={wrapperClassName} style={wrapperStyle}>
      <img
        ref={imgRef}
        src={visible ? src : undefined}
        data-src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={className}
        style={imgStyle}
        {...rest}
      />
    </div>
  );
};

export default OptimizedImage;
