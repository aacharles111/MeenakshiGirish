/**
 * Reusable abstract decoration component.
 * Renders SVG shapes from /abstract/ as positioned background elements.
 * Hidden on mobile by default to prevent text overlap.
 */

interface DecoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  opacity?: number;
  /** If true (default), hides this decoration on screens < 768px */
  hideMobile?: boolean;
}

export default function AbstractDeco({ src, className = '', style, opacity = 0.9, hideMobile = true }: DecoProps) {
  return (
    <img
      src={src}
      alt=""
      role="presentation"
      aria-hidden="true"
      draggable={false}
      className={`pointer-events-none select-none absolute ${hideMobile ? 'hidden md:block' : ''} ${className}`}
      style={{
        opacity,
        ...style,
      }}
    />
  );
}

