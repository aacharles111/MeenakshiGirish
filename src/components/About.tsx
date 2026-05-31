import { motion } from 'framer-motion';
import { Leaf, ScrollText, FolderOpen, PenLine, IndianRupee, BookOpen, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeUp from './FadeUp';
import AbstractDeco from './AbstractDeco';

interface Stat {
  icon: LucideIcon;
  number: string;
  label: string;
}

const stats: Stat[] = [
  { icon: ScrollText, number: '7+', label: 'Years of Experience' },
  { icon: FolderOpen, number: '350+', label: 'Projects Delivered' },
  { icon: PenLine, number: '300,000+', label: 'Words Written' },
  { icon: IndianRupee, number: '₹2L+', label: 'Monthly Income' },
  { icon: BookOpen, number: '1,500+', label: 'Books Hoarded' },
  { icon: Users, number: '1,000+', label: 'Students Mentored' },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function About() {
  return (
    <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
      {/* Abstract Decorations */}
      <AbstractDeco
        src="/abstract/Leaf1.svg"
        className="hidden lg:block -right-10 top-10 w-[280px] h-[280px] lg:w-[350px] lg:h-[350px]"
        opacity={0.9}
        style={{ transform: 'rotate(15deg)' }}
      />
      <AbstractDeco
        src="/abstract/Brown shape 2.svg"
        className="right-10 -bottom-32 w-[300px] h-[300px]"
        opacity={0.9}
      />

      <FadeUp>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-12 items-center">
            {/* Portrait Column */}
            <FadeUp>
              <div className="relative mx-auto lg:mx-0">
                {/* Teal blob behind portrait */}
                <AbstractDeco
                  src="/abstract/Teal shape 2.svg"
                  className="-left-12 -top-12 w-[480px] h-[480px]"
                  opacity={0.9}
                />
                <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full overflow-hidden border-[3px] border-primary/20 shadow-[0_10px_40px_hsl(210_25%_15%_/_0.06)]">
                  <img
                    src="/images/meenakshi-hero.png"
                    alt="Meenakshi"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </FadeUp>

            {/* Text Column */}
            <div>
              <div className="flex items-center gap-2 font-medium text-xs uppercase tracking-[0.15em] text-primary mb-3">
                <Leaf size={14} />
                <span>HI, I'M MEENAKSHI</span>
              </div>

              <h2
                className="font-playfair font-bold italic text-foreground leading-tight mb-4"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                }}
              >
                A writer at heart, a strategist in mind.
              </h2>

              <p className="text-base text-foreground/85 leading-[1.75] max-w-[520px] mb-4">
                With over 7 years of experience, I help brands and businesses communicate with clarity, purpose, and authenticity across every word.
              </p>

              <Link
                to="/about"
                className="font-medium text-sm text-primary hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1"
              >
                More about me →
              </Link>

              {/* Stats Grid */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-6 md:gap-x-8 mt-10"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
              >
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div key={stat.label} className="text-left" variants={itemVariants}>
                      <Icon size={22} className="text-primary/70 mb-2" />
                      <div
                        className="text-[1.6rem] text-foreground mb-1"
                        style={{ fontFamily: 'var(--font-playfair)', fontWeight: 700 }}
                      >
                        {stat.number}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
