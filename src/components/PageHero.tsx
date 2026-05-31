import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';
import AbstractDeco from './AbstractDeco';

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function PageHero({ eyebrow, title, subtitle, ctaText, ctaLink }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'linear-gradient(170deg, hsl(175 30% 92%) 0%, hsl(40 30% 97%) 50%, hsl(40 30% 97%) 100%)',
        }}
      />

      {/* Abstract decorations — large and bold like homepage */}
      <AbstractDeco
        src="/Abstract elements/Leaf1.svg"
        className="w-[250px] h-[250px] md:w-[350px] md:h-[350px] -top-10 -right-16"
        opacity={0.9}
        style={{ transform: 'rotate(30deg)' }}
      />
      <AbstractDeco
        src="/Abstract elements/Teal shape 1.svg"
        className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] -bottom-16 -left-20"
        opacity={0.9}
      />
      <AbstractDeco
        src="/Abstract elements/Brown shape 2.svg"
        className="w-[180px] h-[180px] md:w-[250px] md:h-[250px] top-16 right-[15%]"
        opacity={0.9}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
        {/* Eyebrow */}
        <motion.div
          className="flex items-center justify-center gap-2 font-medium text-xs uppercase tracking-[0.15em] text-primary mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
        >
          <Leaf size={14} />
          <span>{eyebrow}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="font-bold italic text-foreground leading-tight mb-6"
          style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8"
          style={{
            fontFamily: 'var(--font-poppins)',
            fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.35 }}
        >
          {subtitle}
        </motion.p>

        {/* Optional CTA */}
        {ctaText && ctaLink && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.5 }}
          >
            <Link
              to={ctaLink}
              className="inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wide rounded-full px-8 py-3.5 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200"
            >
              {ctaText}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

