/**
 * Reusable abstract decoration component.
 * Renders SVG shapes from /abstract/ as positioned background elements.
 * On mobile, CSS scales these down automatically via global styles in index.css.
 */

interface DecoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  opacity?: number;
  /** Fully hides this decoration on mobile (< 768px) */
  hideMobile?: boolean;
}

export default function AbstractDeco({
  src,
  className = '',
  style,
  opacity = 0.9,
  hideMobile = false,
}: DecoProps) {
  return (
    <img
      src={src}
      alt=""
      role="presentation"
      aria-hidden="true"
      draggable={false}
      className={`abstract-deco pointer-events-none select-none absolute ${hideMobile ? 'hidden md:block' : ''} ${className}`}
      style={{
        opacity,
        ...style,
      }}
    />
  );
}
