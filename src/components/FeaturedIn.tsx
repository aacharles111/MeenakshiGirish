import { motion } from 'framer-motion';
import { ExternalLink, Newspaper, Youtube, Linkedin, GraduationCap, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SectionHeader from './SectionHeader';
import FadeUp from './FadeUp';
import AbstractDeco from './AbstractDeco';
import featuredData from '../content/featured.json';
import type { FeaturedItem } from '../lib/contentTypes';

// Presentation-only metadata keyed by item id (NOT part of the content model —
// the icon+color are a visual concern, kept here so the section keeps its
// per-card illustration even though featured.json only carries text+url).
// Items without an entry fall back to Newspaper + the brand teal.
const displayMeta: Record<string, { icon: LucideIcon; color: string }> = {
  'f-01': { icon: Newspaper, color: 'hsl(200 40% 55%)' },
  'f-02': { icon: GraduationCap, color: 'hsl(35 55% 55%)' },
  'f-03': { icon: BookOpen, color: 'hsl(320 30% 55%)' },
  'f-04': { icon: Youtube, color: 'hsl(0 70% 55%)' },
  'f-05': { icon: Linkedin, color: 'hsl(210 60% 50%)' },
  'f-06': { icon: Linkedin, color: 'hsl(210 60% 50%)' },
  'f-07': { icon: Linkedin, color: 'hsl(210 60% 50%)' },
  'f-08': { icon: Linkedin, color: 'hsl(210 60% 50%)' },
};
const fallbackMeta = { icon: Newspaper, color: 'hsl(175 35% 45%)' };

const items = featuredData.items as FeaturedItem[];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } } };

export default function FeaturedIn() {
  return (
    <section className="bg-card py-24 lg:py-32 relative overflow-hidden">
      <AbstractDeco src="/abstract/teal-shape-1.svg" className="-right-40 -bottom-32 w-[450px] h-[450px]" opacity={0.9} hideMobile />
      <AbstractDeco src="/abstract/brown-shape-2.svg" className="-left-24 top-10 w-[300px] h-[300px]" opacity={0.9} />

      <div className="max-w-[1100px] mx-auto px-6 lg:px-10 relative z-10">
        <SectionHeader label="As seen in" heading="Featured In" />
        <FadeUp>
          <p className="text-foreground/75 leading-relaxed mb-12 text-center max-w-2xl mx-auto -mt-4" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
            A few places that have been kind enough to feature my work, my words, or my wandering career path.
          </p>
        </FadeUp>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {items.map((f) => {
            const meta = displayMeta[f.id] ?? fallbackMeta;
            const Icon = meta.icon;
            const isLink = f.url && f.url !== '#';
            // Render as a real <a> when we have a usable URL; otherwise a
            // non-interactive card so '#' never becomes a self-navigating link.
            const Wrapper = isLink ? motion.a : motion.div;
            const wrapperProps = isLink
              ? { href: f.url, target: '_blank', rel: 'noopener noreferrer' }
              : {};
            return (
              <motion.div key={f.id} variants={itemVariants}>
                <Wrapper
                  {...wrapperProps}
                  className={`group flex flex-col h-full bg-background rounded-2xl p-6 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] hover:-translate-y-1 hover:shadow-[0_12px_40px_hsl(30_15%_75%_/_0.2)] hover:border-primary/30 transition-all duration-300${isLink ? ' cursor-pointer' : ''}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${meta.color}15` }}>
                      <Icon size={22} style={{ color: meta.color }} />
                    </div>
                    {isLink && (
                      <ExternalLink size={15} className="text-muted-foreground/40 group-hover:text-primary transition-colors duration-200" />
                    )}
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.12em] font-semibold mb-1.5" style={{ color: meta.color }}>
                    {f.label}
                  </p>
                  {f.title && (
                    <h3 className="font-bold italic text-foreground leading-snug" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem' }}>
                      {f.title}
                    </h3>
                  )}
                </Wrapper>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
