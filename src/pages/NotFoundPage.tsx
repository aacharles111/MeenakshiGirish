import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import FadeUp from '../components/FadeUp';
import AbstractDeco from '../components/AbstractDeco';

export default function NotFoundPage() {
  return (
    <section className="bg-background min-h-[80vh] flex items-center py-24 relative overflow-hidden">
      <AbstractDeco src="/abstract/teal-shape-2.svg" className="-right-32 -top-20 w-[450px] h-[450px]" opacity={0.9} hideMobile />
      <AbstractDeco src="/abstract/leaf-1.svg" className="-left-20 bottom-10 w-[280px] h-[280px]" opacity={0.9} style={{ transform: 'rotate(-20deg)' }} />

      <div className="max-w-[700px] mx-auto px-6 text-center relative z-10">
        <FadeUp>
          <p
            className="text-primary mb-4 leading-none"
            style={{ fontFamily: 'var(--font-endeavour)', fontSize: 'clamp(4rem, 18vw, 9rem)' }}
          >
            404
          </p>
          <h2 className="font-bold italic text-foreground mb-4" style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            This Page Wandered Off
          </h2>
          <p className="text-foreground/80 leading-relaxed mb-8 max-w-md mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
            Maybe it is out mentoring someone, or lost in a library of 1,500 books. Let me walk you back home.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wide rounded-full px-8 py-3.5 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
