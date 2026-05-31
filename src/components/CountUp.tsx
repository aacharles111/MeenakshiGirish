import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export default function CountUp({
  end,
  suffix = '',
  label,
  duration = 2,
}: CountUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div
        style={{
          fontFamily: 'var(--font-playfair, "Playfair Display", serif)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 700,
          fontStyle: 'italic',
          color: 'hsl(175 35% 55%)',
          lineHeight: 1.1,
        }}
      >
        {count}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-poppins, "Poppins", sans-serif)',
          fontSize: '0.85rem',
          color: 'hsl(40 15% 50%)',
          marginTop: '4px',
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </div>
  );
}
