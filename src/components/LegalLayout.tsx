import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import PageHero from './PageHero';
import FadeUp from './FadeUp';
import AbstractDeco from './AbstractDeco';

interface Section {
  h: string;
  p: ReactNode[];
}

interface Props {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
  updated?: string;
}

export default function LegalLayout({ eyebrow, title, intro, sections, updated }: Props) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={intro} />
      <section className="bg-background py-20 lg:py-28 relative overflow-hidden">
        <AbstractDeco src="/abstract/teal-shape-1.svg" className="-right-40 -top-20 w-[450px] h-[450px]" opacity={0.9} hideMobile />
        <AbstractDeco src="/abstract/leaf-2.svg" className="-left-24 bottom-10 w-[260px] h-[260px]" opacity={0.9} style={{ transform: 'rotate(20deg)' }} />

        <div className="max-w-[800px] mx-auto px-6 lg:px-10 relative z-10">
          {updated && (
            <p className="text-xs text-muted-foreground mb-10 uppercase tracking-wider">Last updated: {updated}</p>
          )}
          <div className="space-y-10">
            {sections.map((s, i) => (
              <FadeUp key={i} delay={i * 0.05}>
                <div>
                  <h2 className="font-bold italic text-foreground mb-3" style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.15rem, 2vw, 1.4rem)' }}>
                    {s.h}
                  </h2>
                  {s.p.map((para, j) => (
                    <p key={j} className="text-foreground/80 leading-[1.8] mb-3" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
                      {para}
                    </p>
                  ))}
                </div>
              </FadeUp>
            ))}
          </div>

          <div className="mt-14 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Questions about this policy?{' '}
              <Link to="/contact" className="text-primary hover:underline">Get in touch</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
