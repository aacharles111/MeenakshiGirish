import { type ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}

export default function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  className = '',
}: MarqueeProps) {
  const dur = `${100 / speed * 10}s`;
  const dir = direction === 'left' ? 'normal' : 'reverse';

  return (
    <div
      className={`marquee-container ${className}`}
      style={{
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
        maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
      }}
    >
      <div
        className="marquee-track"
        style={{
          display: 'flex',
          width: 'max-content',
          animation: `marquee-scroll ${dur} linear infinite`,
          animationDirection: dir,
        }}
        onMouseEnter={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = 'paused';
          }
        }}
        onMouseLeave={(e) => {
          if (pauseOnHover) {
            e.currentTarget.style.animationPlayState = 'running';
          }
        }}
      >
        <div style={{ display: 'flex', flexShrink: 0 }}>{children}</div>
        <div style={{ display: 'flex', flexShrink: 0 }} aria-hidden="true">
          {children}
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation-play-state: paused !important;
          }
        }
      `}</style>
    </div>
  );
}
