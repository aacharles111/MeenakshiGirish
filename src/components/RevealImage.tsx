import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  revealColor?: string;
}

export default function RevealImage({
  src,
  alt,
  className = '',
  revealColor = 'hsl(175 35% 60%)',
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div
      ref={ref}
      className={`reveal-image-wrapper ${className}`}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 'inherit' }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      {/* Color curtain that wipes away */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={isInView ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: revealColor,
          transformOrigin: 'right center',
        }}
      />
    </div>
  );
}
