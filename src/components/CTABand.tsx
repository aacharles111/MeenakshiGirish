import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FadeUp from './FadeUp';
import AbstractDeco from './AbstractDeco';
import DotField from './DotField';

export default function CTABand() {
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'hsl(175 35% 55%)' }}>
      {/* Interactive dot field background — white/light-teal dots on teal */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <DotField
          dotRadius={1.5}
          dotSpacing={18}
          bulgeStrength={50}
          glowRadius={140}
          sparkle={false}
          waveAmplitude={0}
          gradientFrom="rgba(255, 255, 255, 0.55)"
          gradientTo="rgba(255, 255, 255, 0.35)"
        />
      </div>

      <AbstractDeco
        src="/abstract/leaf-2.svg"
        className="-left-20 -top-16 w-[240px] h-[240px]"
        opacity={0.12}
        style={{ transform: 'rotate(10deg)', filter: 'brightness(0) invert(1)' }}
      />
      <AbstractDeco
        src="/abstract/teal-shape-1.svg"
        className="-right-36 -bottom-24 w-[380px] h-[380px]"
        opacity={0.08}
        style={{ filter: 'brightness(0) invert(1)' }}
      />

      <FadeUp>
        <div className="max-w-[700px] mx-auto text-center px-6 relative z-10">
          <h2
            className="font-playfair font-bold italic text-white mb-4"
            style={{
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            }}
          >
            Alright, let&rsquo;s do this.
          </h2>

          <p className="text-base text-white/80 leading-[1.7] mb-8">
            Whether you need a freelance content writer for your brand, a content strategist to
            shape your editorial roadmap, a blog writer for your next campaign, a speaker for your
            event, a bit of mentoring, or you just really want to buy my book, let&rsquo;s make it
            happen.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary — Buy the Book */}
            <Link
              to="/buy"
              className="bg-white text-[hsl(175_35%_40%)] font-semibold text-[13px] uppercase tracking-wider rounded-full px-8 py-3.5 inline-flex items-center gap-2 hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-250"
            >
              BUY THE BOOK
              <ArrowRight size={16} />
            </Link>

            {/* Secondary — Contact */}
            <Link
              to="/contact"
              className="border-2 border-white text-white font-semibold text-[13px] uppercase tracking-wider rounded-full px-8 py-3.5 inline-flex items-center gap-2 hover:bg-white hover:text-[hsl(175_35%_40%)] transition-all duration-250"
            >
              SLIDE INTO MY INBOX
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
