import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeUp from './FadeUp';
import AbstractDeco from './AbstractDeco';
import SplineBook from './SplineBook';

export default function BookBanner() {
  return (
    <section className="bg-background py-20 relative overflow-hidden">
      {/* Abstract Decorations */}
      <AbstractDeco
        src="/abstract/Teal shape 2.svg"
        className="-left-40 -top-32 w-[500px] h-[500px]"
        opacity={0.9}
      />
      <AbstractDeco
        src="/abstract/Leaf1.svg"
        className="-right-12 bottom-0 w-[220px] h-[220px]"
        opacity={0.9}
        style={{ transform: 'rotate(45deg)' }}
      />

      <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
        <FadeUp>
          <div className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_40px_hsl(30_15%_80%_/_0.2)] p-6 md:p-10 lg:p-16">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              {/* 3D Interactive Book */}
              <div className="w-full max-w-[350px] lg:max-w-[450px] mx-auto lg:mx-0 shrink-0">
                <SplineBook />
              </div>

              {/* Content */}
              <div className="flex-1">
                <p className="font-medium text-[11px] uppercase tracking-[0.15em] text-primary mb-3">
                  ✦ FRESH OFF THE PRESS!
                </p>
                <h2
                  className="font-playfair font-bold italic text-foreground mb-4"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  }}
                >
                  The Freelancer's Mindset
                </h2>
                <p className="text-[15px] text-muted-foreground leading-[1.7] max-w-[480px] mb-6">
                  The only guide to freelancing that actually reads like a good story. Get ready for
                  real workflows, actual messes I made, insights from fellow freelancers, and a big
                  ol' push for anyone who's been overthinking their start.
                </p>
                <Link
                  to="/buy"
                  className="bg-primary text-primary-foreground font-semibold text-[13px] uppercase rounded-full px-8 py-3.5 inline-flex items-center gap-2 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-0.5 hover:shadow-xl transition-all duration-250"
                >
                  BUY YOUR COPY NOW
                  <ArrowRight size={16} />
                </Link>
                <p className="font-light text-[13px] text-muted-foreground italic mt-3">
                  (Audiobook coming soon — for those who prefer to let me do the reading!)
                </p>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
