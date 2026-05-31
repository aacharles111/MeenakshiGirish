import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Briefcase, PenLine, User as UserIcon, MessageCircle, Mic2,
  Award, Target, FileText, DollarSign, Lightbulb, User
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import FadeUp from '../components/FadeUp';
import AbstractDeco from '../components/AbstractDeco';
import DotField from '../components/DotField';
import DomeGallery from '../components/DomeGallery';
import CountUp from '../components/CountUp';
import ExpandableCard from '../components/ExpandableCard';
import TextReveal from '../components/TextReveal';

const topics: { icon: LucideIcon; title: string; body: string; color: string }[] = [
  { icon: Briefcase, title: 'Freelancing in the Real World', body: "What freelancing actually looks like behind the scenes. We talk getting started, finding clients, and how to survive the unpredictable income months without panicking.", color: 'hsl(175 35% 55%)' },
  { icon: PenLine, title: 'Content Writing as a Legit Career', body: "Yes, you can make a living writing! I break down the skills you actually need, how to build a portfolio that doesn't suck, and how to go from writing for fun to writing for money.", color: 'hsl(35 55% 55%)' },
  { icon: UserIcon, title: 'Building Your Personal Brand', body: "For founders and pros who want to stop being a well-kept secret. We talk about finding your voice, posting consistently, and not feeling awkward about self-promotion.", color: 'hsl(200 40% 55%)' },
  { icon: MessageCircle, title: 'Communication 101', body: "A super practical session on how to write and speak clearly. Backed by years of editing content that made me want to pull my hair out, so you don't make the same mistakes!", color: 'hsl(320 30% 55%)' },
];

const audiences: { icon: LucideIcon; label: string }[] = [
  { icon: Award, label: 'College Students' },
  { icon: Mic2, label: 'Uni Events' },
  { icon: Briefcase, label: 'Founders & Biz Owners' },
  { icon: MessageCircle, label: 'Toastmasters' },
  { icon: UserIcon, label: 'Creator Communities' },
  { icon: Lightbulb, label: 'Online Webinars' },
];

const bookCallIf = [
  { icon: Target, text: "You're a student/grad and freelancing sounds cool, but confusing." },
  { icon: PenLine, text: 'You have great writing skills but zero clue how to monetize them.' },
  { icon: Briefcase, text: "You're a business owner realizing your brand voice sounds like a robot." },
  { icon: DollarSign, text: "You're already freelancing but you're broke and burnt out." },
];

const whatWeDo = [
  { icon: Target, text: "Figure out what's currently blocking you." },
  { icon: Lightbulb, text: 'Set goals that are actually achievable.' },
  { icon: FileText, text: 'Fix up your portfolio so clients take you seriously.' },
  { icon: DollarSign, text: 'Talk about how to price your work (spoiler: you need to charge more).' },
  { icon: PenLine, text: 'Find a way for you to create content without losing your mind.' },
];

const testimonials = [
  { quote: 'She spoke at our college and the students were actually awake and asking questions. It felt like a conversation, not a boring lecture.', author: 'Prof. Ramya Venkatesh', role: 'SRM University' },
  { quote: "One mentoring call with Meenakshi gave me a clearer roadmap than 6 months of Googling. I've been landing clients ever since!", author: 'Deepika Raj', role: 'Freelance Designer' },
  { quote: 'Her content writing workshop totally shifted how our team writes. Practical, funny, and so helpful.', author: 'Vikram Iyer', role: 'Head of Content, TechBridge' },
];

const mentoringImages = [
  '/images/mentoring/event1.png',
  '/images/mentoring/event2.png',
  '/images/mentoring/event3.png',
  '/images/mentoring/event4.png',
  '/images/mentoring/event5.png',
  '/images/mentoring/event6.png',
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } } };

export default function SpeakingPage() {
  return (
    <>
      <PageHero
        eyebrow="Speaking & Mentoring"
        title="Because sometimes, I actually like leaving my desk."
        subtitle="Writing is how I think, but speaking is how I connect. Over the years, I've dragged myself away from my laptop to bring everything I know about freelancing and content to stages, classrooms, and 1-on-1 calls. Turns out, I love it."
        ctaText="Book My Brain"
        ctaLink="/contact"
      />

      {/* ─── Stats Bar ─── */}
      <section className="py-14 relative overflow-hidden border-y border-border/30" style={{ background: 'linear-gradient(to right, hsl(175 30% 92%), hsl(40 30% 97%))' }}>
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <CountUp end={1000} suffix="+" label="Students Mentored" />
            <CountUp end={50} suffix="+" label="Talks Delivered" />
            <CountUp end={30} suffix="+" label="Colleges Visited" />
            <CountUp end={4} suffix="" label="Core Topics" />
          </div>
        </div>
      </section>

      {/* ─── Speaking Intro — Full-width text + floating portrait ─── */}
      <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/abstract/brown-shape-2.svg" className="-left-32 bottom-10 w-[400px] h-[400px]" opacity={0.9} />
        <AbstractDeco src="/abstract/leaf-2.svg" className="-right-16 -top-10 w-[280px] h-[280px]" opacity={0.9} style={{ transform: 'rotate(-20deg)' }} />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          {/* Full-width text reveal heading */}
          <div className="mb-12">
            <TextReveal
              text="Give me a mic and some coffee."
              as="h2"
              className="font-bold italic text-foreground leading-tight"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
            />
          </div>

          {/* Two-column: text + offset portrait */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 items-start">
            <div>
              <FadeUp>
                <div className="space-y-5 text-foreground/85 leading-[1.75]" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
                  <p>I didn't plan on becoming a public speaker. But as my freelancing career grew, people kept asking me to explain how I did it. Next thing I knew, colleges were inviting me to guest lecture, and event organizers wanted me on panels.</p>
                  <p>I kept saying yes because seeing that "lightbulb" moment go off in someone's eyes in real life is just the coolest feeling. Plus, my time at <strong>Toastmasters International</strong> made sure I actually know what I'm doing up there!</p>
                </div>
              </FadeUp>
            </div>
            {/* Offset portrait with unique diamond-ish shape */}
            <FadeUp delay={0.2}>
              <div className="relative mx-auto lg:mx-0 lg:-mt-8">
                <div className="relative w-[260px] h-[320px] rounded-[2rem_1rem_2rem_1rem] overflow-hidden border-[3px] border-primary/20 shadow-[0_10px_40px_hsl(210_25%_15%_/_0.08)]"
                  style={{ transform: 'rotate(3deg)' }}
                >
                  <img src="/images/meenakshi-hero.png" alt="Meenakshi speaking" className="object-cover w-full h-full" />
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── Speaking Topics — Expandable cards (NOT icon grid) ─── */}
      <section className="bg-card py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/abstract/teal-shape-1.svg" className="-right-40 -bottom-32 w-[450px] h-[450px]" opacity={0.9} />
        <AbstractDeco src="/abstract/brown-shape-1.svg" className="-left-24 top-16 w-[300px] h-[300px]" opacity={0.9} />

        <div className="max-w-[800px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="Topics" heading="What I talk about." />
          <FadeUp>
            <p className="text-foreground/80 leading-relaxed mb-10 text-center max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
              I only speak about things I actually know and care about. No fluffy motivational speeches here—just real, useful stuff.
            </p>
          </FadeUp>
          <div className="space-y-4">
            {topics.map((topic, i) => {
              const Icon = topic.icon;
              return (
                <FadeUp key={i} delay={i * 0.1}>
                  <ExpandableCard
                    title={topic.title}
                    icon={<Icon size={22} />}
                    defaultOpen={i === 0}
                  >
                    {topic.body}
                  </ExpandableCard>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── DomeGallery — Moments from events and mentoring ─── */}
      <section className="relative overflow-hidden" style={{ background: 'hsl(40 30% 95%)' }}>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-16 relative z-10">
          <SectionHeader label="In action" heading="Moments from the Stage & Beyond." />
        </div>
        <div style={{ height: 'clamp(350px, 60vh, 600px)', position: 'relative' }}>
          <DomeGallery
            images={mentoringImages}
            grayscale={false}
            fit={0.55}
            padFactor={0.12}
            overlayBlurColor="hsl(40 30% 95%)"
            imageBorderRadius="16px"
          />
        </div>
      </section>

      {/* ─── Audience — Pill tags in a flowing layout ─── */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-background">
        <AbstractDeco src="/abstract/leaf-1.svg" className="-left-16 -top-10 w-[300px] h-[300px]" opacity={0.9} style={{ transform: 'rotate(30deg)' }} />

        <div className="max-w-[1000px] mx-auto px-6 lg:px-10 relative z-10 text-center">
          <SectionHeader label="My audience" heading="Who I've been talking to." />
          <FadeUp>
            <p className="text-foreground/80 leading-relaxed mb-10 max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
              I've had the absolute best time speaking to thousands of students, founders, and creators across South India.
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="flex flex-wrap justify-center gap-3">
              {audiences.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.label}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white border border-primary/20 shadow-[0_2px_8px_hsl(30_15%_80%_/_0.15)] hover:-translate-y-1 hover:shadow-md hover:border-primary/40 transition-all duration-200"
                    style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
                  >
                    <Icon size={18} className="text-primary" />
                    <span className="text-foreground/80 text-sm font-medium">{a.label}</span>
                  </div>
                );
              })}
            </div>
          </FadeUp>
          <FadeUp delay={0.25}>
            <p className="text-muted-foreground text-sm italic mt-8">
              Watching mentees go from confused to confidently running their own freelance gigs is easily the best part of my job.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ─── Mentoring — Two side-by-side list cards with different bg ─── */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(170deg, hsl(175 30% 92%) 0%, hsl(40 30% 97%) 100%)' }}>
        <AbstractDeco src="/abstract/teal-shape-2.svg" className="-right-40 -bottom-32 w-[450px] h-[450px]" opacity={0.9} />

        <div className="max-w-[1000px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="1-on-1" heading="1-on-1 Mentoring (Let's get specific)." />
          <FadeUp>
            <p className="text-foreground/80 leading-relaxed mb-10 text-center max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
              Listening to a talk is great, but sometimes you just need someone to look at <em>your</em> specific mess and tell you how to fix it. That's where mentoring comes in.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <FadeUp delay={0.1}>
              <div className="bg-white rounded-2xl p-8 border border-primary/20 shadow-[0_4px_20px_hsl(175_35%_55%_/_0.08)] h-full" style={{ background: 'linear-gradient(135deg, hsl(175 35% 97%) 0%, #ffffff 100%)' }}>
                <h3 className="font-bold italic text-foreground mb-5" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem' }}>
                  You should book a call if:
                </h3>
                <motion.ul className="space-y-4" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  {bookCallIf.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.li key={i} variants={itemVariants} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon size={16} className="text-primary" />
                        </div>
                        <span className="text-foreground/80 text-sm leading-relaxed pt-1">{item.text}</span>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="bg-white rounded-2xl p-8 border border-[hsl(35_50%_70%)]/30 shadow-[0_4px_20px_hsl(35_55%_55%_/_0.08)] h-full" style={{ background: 'linear-gradient(135deg, hsl(35 40% 96%) 0%, #ffffff 100%)' }}>
                <h3 className="font-bold italic text-foreground mb-5" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem' }}>
                  What we'll actually do:
                </h3>
                <motion.ul className="space-y-4" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  {whatWeDo.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.li key={i} variants={itemVariants} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon size={16} className="text-primary" />
                        </div>
                        <span className="text-foreground/80 text-sm leading-relaxed pt-1">{item.text}</span>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="https://topmate.io" target="_blank" rel="noopener noreferrer" className="bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wide rounded-full px-8 py-3.5 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200">
                Book a Mentoring Session
              </a>
              <Link to="/contact" className="border-2 border-primary text-primary font-semibold text-sm uppercase tracking-wide rounded-full px-8 py-3.5 hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                Ask Me a Question First
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── Toastmasters — Unique warm callout card ─── */}
      <section className="bg-background py-16 lg:py-20 relative overflow-hidden">
        <div className="max-w-[800px] mx-auto px-6 lg:px-10 relative z-10">
          <FadeUp>
            <div className="rounded-[2rem] p-8 md:p-10 border border-[hsl(35_40%_70%)]/40 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(40 40% 92%) 0%, hsl(35 35% 88%) 100%)' }}>
              <AbstractDeco src="/abstract/leaf-2.svg" className="-right-12 -bottom-10 w-[200px] h-[200px]" opacity={0.3} style={{ transform: 'rotate(25deg)' }} />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award size={28} className="text-primary" />
                </div>
                <h3 className="font-bold italic text-foreground mb-3" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.15rem' }}>
                  Shoutout to Toastmasters.
                </h3>
                <p className="text-foreground/80 leading-relaxed max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
                  I have to give credit where it's due: Toastmasters International totally changed the game for me. It gave me the structure and the thick skin to become a way better communicator. I bring all those sneaky public speaking tricks into my mentoring calls to make sure you sound as confident as you are.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── Testimonials — Overlapping card layout ─── */}
      <section className="bg-card py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/abstract/teal-shape-2.svg" className="-left-32 -top-20 w-[400px] h-[400px]" opacity={0.9} />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="Feedback" heading="What the crowd says." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {testimonials.map((t, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <div
                  className={`bg-background rounded-2xl p-8 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] h-full flex flex-col ${i === 1 ? 'md:-mt-4' : i === 2 ? 'md:mt-6' : ''}`}
                  style={{ transform: `rotate(${i === 0 ? -1 : i === 1 ? 0.5 : -0.5}deg)` }}
                >
                  <div className="text-primary/20 text-5xl font-bold leading-none mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>"</div>
                  <p className="text-foreground italic leading-relaxed flex-1" style={{ fontFamily: 'var(--font-playfair)', fontSize: '0.95rem' }}>
                    {t.quote}
                  </p>
                  <div className="mt-6 pt-4 border-t border-border/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{t.author}</p>
                      <p className="text-muted-foreground text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Band — Teal with white dot field ─── */}
      <section className="relative overflow-hidden py-24 lg:py-28 px-6" style={{ background: 'hsl(175 35% 55%)' }}>
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
        <AbstractDeco src="/abstract/leaf-1.svg" className="-left-20 -top-16 w-[300px] h-[300px]" opacity={0.12} style={{ filter: 'brightness(0) invert(1)' }} />
        <AbstractDeco src="/abstract/brown-shape-1.svg" className="-right-16 -bottom-20 w-[350px] h-[350px]" opacity={0.08} style={{ filter: 'brightness(0) invert(1)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-bold italic text-white mb-4" style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            Let's get you moving.
          </h2>
          <p className="text-white/80 leading-relaxed mb-8 max-w-xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
            Whether you want me on your stage or on a zoom call to fix your portfolio, let's make it happen.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://topmate.io" target="_blank" rel="noopener noreferrer" className="bg-white text-[hsl(175_35%_40%)] font-semibold text-sm uppercase tracking-wide rounded-full px-8 py-3.5 hover:bg-white/90 hover:-translate-y-px hover:shadow-lg transition-all duration-200">
              Book a Session
            </a>
            <Link to="/contact" className="border-2 border-white text-white font-semibold text-sm uppercase tracking-wide rounded-full px-8 py-3.5 hover:bg-white hover:text-[hsl(175_35%_40%)] transition-all duration-200">
              Invite Me to Speak
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
