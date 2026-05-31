import { Leaf } from 'lucide-react';
import FadeUp from './FadeUp';
import AbstractDeco from './AbstractDeco';

export default function TaglineBand() {
  return (
    <section className="bg-card relative overflow-hidden">
      <AbstractDeco
        src="/abstract/Leaf1.svg"
        className="-left-20 -top-10 w-[180px] h-[180px]"
        opacity={0.9}
        style={{ transform: 'rotate(-25deg)' }}
      />
      <AbstractDeco
        src="/abstract/Leaf2.svg"
        className="-right-16 -bottom-8 w-[160px] h-[160px]"
        opacity={0.9}
        style={{ transform: 'rotate(20deg)' }}
      />

      <FadeUp>
        <div className="max-w-[800px] mx-auto text-center py-12 px-6">
          <div className="flex items-center justify-center gap-4">
            <Leaf size={18} className="text-primary/30" />
            <p
              className="text-foreground leading-relaxed"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontWeight: 600,
                fontStyle: 'italic',
                fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
              }}
            >
              Seven years of freelancing, one book, a thousand conversations, and only a few minor typos along the way.
            </p>
            <Leaf size={18} className="text-primary/30" />
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
