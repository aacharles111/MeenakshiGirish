/**
 * Reusable abstract decoration component.
 * Renders SVG shapes from /abstract/ as positioned background elements.
 */

interface DecoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  opacity?: number;
}

export default function AbstractDeco({ src, className = '', style, opacity = 0.9 }: DecoProps) {
  return (
    <img
      src={src}
      alt=""
      role="presentation"
      aria-hidden="true"
      draggable={false}
      className={`pointer-events-none select-none absolute ${className}`}
      style={{
        opacity,
        ...style,
      }}
    />
  );
}
