import { motion } from 'framer-motion';
import { ExternalLink, Newspaper, Youtube, Linkedin, GraduationCap, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SectionHeader from './SectionHeader';
import FadeUp from './FadeUp';
import AbstractDeco from './AbstractDeco';

interface Feature {
  source: string;
  title: string;
  href: string;
  icon: LucideIcon;
  color: string;
}

const features: Feature[] = [
  {
    source: 'The New Indian Express',
    title: 'Alumna Returns to Campus as a Newly Published Author',
    href: 'https://www.newindianexpress.com/cities/chennai/2025/Aug/06/alumna-of-mop-vaishnav-college-for-women-returns-to-campus-as-newly-published-author',
    icon: Newspaper,
    color: 'hsl(200 40% 55%)',
  },
  {
    source: 'MOP Vaishnav College',
    title: 'How to Stop 9-to-5ing It and March to the Beat of Your Own Drum',
    href: 'https://mopvc.edu.in/how-to-stop-9-5ing-it-and-march-to-the-beat-of-your-own-drum/',
    icon: GraduationCap,
    color: 'hsl(35 55% 55%)',
  },
  {
    source: 'SheGotYou Newsletter',
    title: 'Meet Meenakshi Girish, Freelancer',
    href: 'https://shegotyou.beehiiv.com/p/meenakshi-girish-freelancer',
    icon: BookOpen,
    color: 'hsl(320 30% 55%)',
  },
  {
    source: 'YouTube',
    title: 'In Conversation with Meenakshi Girish',
    href: 'https://www.youtube.com/watch?v=7a-VocObVuI',
    icon: Youtube,
    color: 'hsl(0 70% 55%)',
  },
  {
    source: 'LinkedIn',
    title: 'An Off-Beat Conversation on Full-Time Freelancing',
    href: 'https://www.linkedin.com/pulse/off-beat-conversation-full-time-freelancing-girishs-shivaswamy-fxotc/',
    icon: Linkedin,
    color: 'hsl(210 60% 50%)',
  },
  {
    source: 'LinkedIn',
    title: '"Mindset is Everything"',
    href: 'https://www.linkedin.com/posts/shraddha-thuwal_mindset-is-everything-ugcPost-7331173170181300224-XV03/',
    icon: Linkedin,
    color: 'hsl(210 60% 50%)',
  },
  {
    source: 'LinkedIn',
    title: 'Featured on LinkedIn',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7358697708099919872/',
    icon: Linkedin,
    color: 'hsl(210 60% 50%)',
  },
  {
    source: 'LinkedIn',
    title: 'Mentioned on LinkedIn',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7338454101183053825/',
    icon: Linkedin,
    color: 'hsl(210 60% 50%)',
  },
];

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
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.href} variants={itemVariants}>
                <a
                  href={f.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col h-full bg-background rounded-2xl p-6 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] hover:-translate-y-1 hover:shadow-[0_12px_40px_hsl(30_15%_75%_/_0.2)] hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${f.color}15` }}>
                      <Icon size={22} style={{ color: f.color }} />
                    </div>
                    <ExternalLink size={15} className="text-muted-foreground/40 group-hover:text-primary transition-colors duration-200" />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.12em] font-semibold mb-1.5" style={{ color: f.color }}>
                    {f.source}
                  </p>
                  <h3 className="font-bold italic text-foreground leading-snug" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1rem' }}>
                    {f.title}
                  </h3>
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
