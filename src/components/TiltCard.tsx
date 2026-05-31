import { useRef, useState, useCallback, type ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltAmount?: number;
}

export default function TiltCard({
  children,
  className = '',
  tiltAmount = 10,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
    transition: 'transform 0.1s ease',
  });

  const canHover =
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover)').matches;

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canHover || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setStyle({
        transform: `perspective(1000px) rotateY(${x * tiltAmount}deg) rotateX(${-y * tiltAmount}deg)`,
        transition: 'transform 0.1s ease',
      });
    },
    [canHover, tiltAmount]
  );

  const handleLeave = useCallback(() => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.4s ease-out',
    });
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        willChange: 'transform',
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}
