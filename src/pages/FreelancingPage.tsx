import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Globe, FileText, Search, Smartphone, Mail, UserPen, Megaphone,
  FileCode, User, Printer, Heart, ShoppingBag, Building2, GraduationCap,
  Dumbbell, Cpu, Wallet, Rocket, BookOpen, Hotel, ArrowRight, Send
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageHero from '../components/PageHero';
import useSEO from '../hooks/useSEO';
import SectionHeader from '../components/SectionHeader';
import FadeUp from '../components/FadeUp';
import AbstractDeco from '../components/AbstractDeco';
import DotField from '../components/DotField';
import CircularGallery from '../components/CircularGallery';
import CountUp from '../components/CountUp';
import TiltCard from '../components/TiltCard';

const services: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Globe, title: 'Website Content Writing', body: "Your website is your digital living room—make sure it's inviting! I write homepages, about pages, and landing pages that sound like you and actually convert." },
  { icon: FileText, title: 'Blog & Article Writing', body: 'Blogs that no one reads make me sad. I write pieces that grab attention and hold it, whether for thought leadership, SEO, or just purely entertaining your audience.' },
  { icon: Search, title: 'SEO Content Writing', body: "Good SEO shouldn't sound like you just aggressively pasted keywords into a document. I write content that performs beautifully for the algorithm without putting humans to sleep." },
  { icon: Smartphone, title: 'Social Media Content', body: "Because what works on LinkedIn will make you look ridiculous on Instagram. I handle ideation, captions, and strategy to keep your online presence looking sharp." },
  { icon: Mail, title: 'Newsletters & Email Content', body: "Emails are my jam. I write newsletters that people actually want to open, plus the sneaky remarketing flows that bring the sales home." },
  { icon: UserPen, title: 'Ghostwriting', body: "You have the brilliant ideas; I have the words. I ghostwrite for founders and execs to build their authority while keeping their authentic voice intact." },
  { icon: Megaphone, title: 'Ads & Copywriting', body: "You have about three seconds to get someone to click an ad. I write punchy, focused copy for Google ads and landing pages that make them want to click now." },
  { icon: FileCode, title: 'Technical Writing', body: "I translate dense healthcare, tech, and B2B jargon into readable white papers and guides that won't make your audience's eyes glaze over." },
  { icon: User, title: 'Personal Branding', body: "Want to be a thought leader but don't know what to say? I help you figure out your angle and write the content that builds your brand." },
  { icon: Printer, title: 'The Fun Offline Stuff', body: "Print isn't dead! I also write magazine content, brochures, video scripts, and even do some voiceover work." },
];

const steps = [
  { num: '01', title: 'We Chat', body: "You tell me what you need, and I ask a bunch of questions so I can crawl inside your brand's brain.", color: 'hsl(175 35% 55%)' },
  { num: '02', title: 'The Proposal', body: 'I send you a plan, a timeline, and a price. No hidden fees, no drama.', color: 'hsl(35 55% 55%)' },
  { num: '03', title: 'I Get the Work Done', body: 'I research, write, and polish. You get a clean, proofread copy.', color: 'hsl(200 40% 55%)' },
  { num: '04', title: 'We Tweak', body: "You read it. If something feels off, we tweak it until it's perfect.", color: 'hsl(320 30% 55%)' },
  { num: '05', title: 'Launch Day', body: 'You hit publish, look awesome, and we high-five (virtually).', color: 'hsl(150 35% 50%)' },
];

const niches: { icon: LucideIcon; label: string }[] = [
  { icon: Heart, label: 'Healthcare' },
  { icon: ShoppingBag, label: 'E-Commerce' },
  { icon: Building2, label: 'B2B & Corporate' },
  { icon: GraduationCap, label: 'Education' },
  { icon: Dumbbell, label: 'Lifestyle & Wellness' },
  { icon: Cpu, label: 'Tech' },
  { icon: Wallet, label: 'Personal Finance' },
  { icon: Rocket, label: 'Startups' },
  { icon: BookOpen, label: 'Publishing' },
  { icon: Hotel, label: 'Hospitality' },
];

const testimonials = [
  { quote: 'You made freelancing sound so accessible that I also want to start it today.', author: 'Session Attendee', role: 'Freelancing Talk' },
  { quote: "I didn't know it's possible for students to start their own personal brands. I am going to create a LinkedIn page today and give it a try. Thanks so much.", author: 'Student Attendee', role: 'Personal Branding Session' },
  { quote: "My parents didn't believe my goal to earn money by writing content online. You are the first person who accepted my belief and told me to keep going. This really means a lot and I won't forget you.", author: 'Student Attendee', role: 'Freelancing Session' },
];

const galleryItems = [
  { image: '/images/portfolio/website.png', text: 'Website Copy' },
  { image: '/images/portfolio/blog.png', text: 'Blog Writing' },
  { image: '/images/portfolio/social.png', text: 'Social Media' },
  { image: '/images/portfolio/newsletter.png', text: 'Newsletters' },
  { image: '/images/portfolio/seo.png', text: 'SEO Content' },
  { image: '/images/portfolio/copywriting.png', text: 'Copywriting' },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } } };

export default function FreelancingPage() {
  useSEO({
    title: 'Freelance Content Writing Services — Meenakshi Girish',
    description: 'Freelance content writing services: blogs, SEO content, website copy, newsletters and content strategy. 7+ years, 350+ projects across 40+ industries.',
    path: '/freelancing',
  });
  const [sampleFormState, setSampleFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [sampleFormError, setSampleFormError] = useState('');

  const handleSampleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const field = (id: string) => (form.querySelector(`#${id}`) as HTMLInputElement | null)?.value.trim() ?? '';
    const payload = {
      type: 'work-sample',
      name: field('sample-name'),
      company: field('sample-company'),
      email: field('sample-email'),
      industry: field('sample-industry'),
      website: field('sample-website'), // honeypot
    };
    setSampleFormState('sending');
    setSampleFormError('');
    try {
      const res = await fetch('/api/contact-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error(data?.error || 'Could not send your request. Please try again.');
      setSampleFormState('sent');
      form.reset();
    } catch (err) {
      setSampleFormError(err instanceof Error ? err.message : 'Could not send your request. Please try again.');
      setSampleFormState('idle');
    }
  };
  return (
    <>
      <PageHero
        eyebrow="Freelance Content Writing"
        title="Words That Pay the Bills (Yours and Mine)"
        subtitle="I've been playing with words professionally for seven years and freelancing full-time for four. In that time, I've written for more industries than I can count on two hands, helping brands sound like humans rather than robots. If you need writing that's sharp, researched, and fun to read, we need to talk."
        ctaText="Pitch Me Your Project"
        ctaLink="/contact"
      />

      {/* ─── Stats Bar — CountUp numbers ─── */}
      <section className="bg-card py-14 relative overflow-hidden border-y border-border/30">
        <div className="max-w-[1000px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <CountUp end={7} suffix="+" label="Years of Writing" />
            <CountUp end={350} suffix="+" label="Projects Delivered" />
            <CountUp end={40} suffix="+" label="Industry Niches" />
            <CountUp end={4} suffix="" label="Years Full-Time Freelancing" />
          </div>
        </div>
      </section>

      {/* ─── Intro with portrait — IMAGE LEFT, text RIGHT (opposite of About) ─── */}
      <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/abstract/brown-shape-1.svg" className="-right-32 -top-20 w-[350px] h-[350px]" opacity={0.9} />
        <AbstractDeco src="/abstract/teal-shape-2.svg" className="-left-28 bottom-10 w-[400px] h-[400px]" opacity={0.9} hideMobile />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-16 items-center">
            {/* Portrait LEFT */}
            <FadeUp>
              <div className="relative mx-auto lg:mx-0">
                <AbstractDeco src="/abstract/leaf-2.svg" className="-left-14 -top-10 w-[280px] h-[280px]" opacity={0.9} style={{ transform: 'rotate(20deg)' }} hideMobile />
                <div className="relative w-[280px] h-[350px] md:w-[320px] md:h-[400px] rounded-[2rem] overflow-hidden border-[3px] border-primary/20 shadow-[0_10px_40px_hsl(210_25%_15%_/_0.06)]">
                  <img src="/images/meenakshi-hero.png" alt="Meenakshi writing" className="object-cover w-full h-full" />
                </div>
              </div>
            </FadeUp>
            {/* Text RIGHT */}
            <div>
              <SectionHeader label="My approach" heading="Four Years of Full-Time Freelancing Looks Like..." align="left" />
              <FadeUp>
                <div className="space-y-5 text-foreground/85 leading-[1.75]" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
                  <p>Freelancing wasn't a backup plan for me; it was <em>the</em> plan. Earning a consistent living doing this isn't about luck (though a good cup of coffee helps). It's about treating writing like a craft and clients like real partners.</p>
                  <p>Whether you're a solo entrepreneur figuring out your vibe, or a big company that needs to sound less corporate, my strategy is simple: understand the goal, get to know the audience, and write something that knocks their socks off.</p>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services — Bento grid (3+2+3+2 layout, NOT uniform grid) ─── */}
      <section className="bg-card py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/abstract/teal-shape-1.svg" className="-right-40 -bottom-32 w-[500px] h-[500px]" opacity={0.9} hideMobile />
        <AbstractDeco src="/abstract/brown-shape-2.svg" className="-left-24 top-1/4 w-[300px] h-[300px]" opacity={0.9} />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="My services" heading="How I Can Help You" />
          <motion.div
            className="grid gap-6"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
            }}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {services.map((svc, i) => {
              const Icon = svc.icon;
              // Alternate card sizes for visual variety
              const isWide = i === 0 || i === 5 || i === 9;
              return (
                <motion.div
                  key={svc.title}
                  variants={itemVariants}
                  style={isWide ? { gridColumn: 'span 1' } : {}}
                >
                  <TiltCard className="h-full" tiltAmount={6}>
                    <div className="bg-background rounded-2xl p-8 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] hover:shadow-[0_12px_40px_hsl(30_15%_75%_/_0.2)] hover:border-primary/30 transition-all duration-300 ease-out h-full">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                        <Icon size={28} className="text-primary" />
                      </div>
                      <h3 className="font-bold italic text-foreground mb-2" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem' }}>
                        {svc.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{svc.body}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ─── CircularGallery — Portfolio showcase ─── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(170deg, hsl(175 30% 92%) 0%, hsl(40 30% 97%) 40%, hsl(38 28% 95%) 100%)' }}>
        {/* Soft radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, hsl(175 35% 88% / 0.5) 0%, transparent 60%)' }} />
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-16 relative z-10">
          <div className="text-center mb-4">
            <span className="text-primary font-medium text-xs uppercase tracking-[0.15em]">My Work</span>
            <h2 className="font-bold italic text-foreground mt-2" style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
              A Glimpse of What I Create
            </h2>
          </div>
        </div>
        <div style={{ height: 'clamp(260px, 50vh, 600px)', position: 'relative' }}>
          <CircularGallery
            items={galleryItems}
            bend={3}
            textColor="#1e3a3a"
            borderRadius={0.05}
            scrollSpeed={2}
            scrollEase={0.02}
          />
        </div>
      </section>

      {/* ─── Work Samples on Demand — request form ─── */}
      <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/abstract/leaf-2.svg" className="-right-16 -top-10 w-[280px] h-[280px]" opacity={0.9} style={{ transform: 'rotate(15deg)' }} hideMobile />

        <div className="max-w-[820px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="Work samples" heading="Want to see if we're a fit?" />
          <FadeUp>
            <p className="text-foreground/80 leading-relaxed mb-10 text-center max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
              Work samples as per your industry and required content format are available on demand. Tell me a little about your business and what you need, and I'll send over relevant samples.
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            {sampleFormState === 'sent' ? (
              <div className="bg-card rounded-[2rem] p-10 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Send size={28} className="text-primary" />
                </div>
                <h3 className="font-bold italic text-foreground mb-2" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.3rem' }}>
                  Request received!
                </h3>
                <p className="text-muted-foreground text-sm">I'll get back to you within 48 hours with work samples tailored to your industry.</p>
                <button onClick={() => setSampleFormState('idle')} className="mt-6 text-primary text-sm font-medium hover:underline">
                  Send another request
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSampleSubmit}
                className="bg-card rounded-[2rem] p-8 md:p-10 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] space-y-5"
              >
                {/* honeypot — hidden anti-spam field; humans never see it, bots fill it */}
                <input type="text" id="sample-website" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute opacity-0 pointer-events-none h-0 w-0 -left-[9999px]" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="sample-name" className="block text-foreground text-sm font-medium mb-1.5">Your Name *</label>
                    <input id="sample-name" type="text" required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="sample-company" className="block text-foreground text-sm font-medium mb-1.5">Company / Organization *</label>
                    <input id="sample-company" type="text" required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" placeholder="Where you work" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="sample-email" className="block text-foreground text-sm font-medium mb-1.5">Email *</label>
                    <input id="sample-email" type="email" required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" placeholder="you@company.com" />
                  </div>
                </div>
                <div>
                  <label htmlFor="sample-industry" className="block text-foreground text-sm font-medium mb-1.5">Industry / Content type you need</label>
                  <input id="sample-industry" type="text" className="w-full px-4 py-3 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" placeholder="E.g., healthcare blogs, SaaS website copy..." />
                </div>
                {sampleFormError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">{sampleFormError}</div>
                )}
                <button type="submit" disabled={sampleFormState === 'sending'} className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wide rounded-full px-10 py-3.5 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none">
                  {sampleFormState === 'sending' ? <><span className="inline-block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" /> Sending…</> : <><Send size={14} /> Request Work Samples</>}
                </button>
              </form>
            )}
          </FadeUp>
        </div>
      </section>

      {/* ─── Niches — Hexagonal-ish scattered layout ─── */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(170deg, hsl(175 30% 92%) 0%, hsl(40 30% 97%) 50%, hsl(40 30% 97%) 100%)' }}>
        <AbstractDeco src="/abstract/leaf-1.svg" className="-left-16 -top-10 w-[300px] h-[300px]" opacity={0.9} style={{ transform: 'rotate(-30deg)' }} />
        <AbstractDeco src="/abstract/teal-shape-2.svg" className="-right-20 bottom-0 w-[350px] h-[350px]" opacity={0.9} />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10 text-center">
          <SectionHeader label="Niches" heading="Where I've Been Hanging Out (Industries)" />
          <FadeUp>
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
              {niches.map((niche, i) => {
                const Icon = niche.icon;
                return (
                  <div
                    key={niche.label}
                    className="bg-white rounded-2xl border border-primary/15 shadow-[0_2px_8px_hsl(30_15%_80%_/_0.15)] hover:-translate-y-1.5 hover:shadow-[0_8px_24px_hsl(30_15%_75%_/_0.2)] hover:border-primary/30 transition-all duration-200 text-center flex flex-col items-center justify-center p-5 w-[130px] h-[110px]"
                    style={{
                      transform: `rotate(${i % 2 === 0 ? -2 : 2}deg)`,
                    }}
                  >
                    <Icon size={24} className="text-primary mb-2" />
                    <p className="text-foreground/80 text-xs font-medium">{niche.label}</p>
                  </div>
                );
              })}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── Process — Horizontal progress steps with connecting line ─── */}
      <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/abstract/brown-shape-1.svg" className="-left-32 -top-24 w-[400px] h-[400px]" opacity={0.9} />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="My process" heading="How This Whole Thing Goes Down" />
          <FadeUp>
            <p className="text-foreground/80 leading-relaxed mb-10 text-center max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
              I like to keep things painfully simple. No stress, no weird jargon.
            </p>
          </FadeUp>

          {/* Desktop: horizontal with connecting line */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[30px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((step, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-center h-full relative">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10" style={{ backgroundColor: `${step.color}15`, border: `2px solid ${step.color}30` }}>
                      <span className="font-bold text-lg" style={{ fontFamily: 'var(--font-playfair)', color: step.color }}>{step.num}</span>
                    </div>
                    <h3 className="font-bold text-foreground text-sm mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{step.body}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials — Staggered masonry, NOT uniform 3-col ─── */}
      <section className="bg-card py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/abstract/teal-shape-1.svg" className="-right-28 top-20 w-[380px] h-[380px]" opacity={0.9} />
        <AbstractDeco src="/abstract/leaf-1.svg" className="-left-20 -bottom-16 w-[300px] h-[300px]" opacity={0.9} style={{ transform: 'rotate(-15deg)' }} />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="Social proof" heading="Don't Just Take My Word For It" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {testimonials.map((t, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <div
                  className={`bg-background rounded-2xl p-8 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] h-full flex flex-col ${i === 1 ? 'md:mt-8' : i === 2 ? 'md:mt-4' : ''}`}
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
        <AbstractDeco src="/abstract/brown-shape-1.svg" className="-left-20 -top-16 w-[300px] h-[300px]" opacity={0.12} style={{ filter: 'brightness(0) invert(1)' }} />
        <AbstractDeco src="/abstract/leaf-2.svg" className="-right-16 -bottom-20 w-[350px] h-[350px]" opacity={0.08} style={{ filter: 'brightness(0) invert(1)', transform: 'rotate(15deg)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-bold italic text-white mb-4" style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            Ready to Make Some Magic?
          </h2>
          <p className="text-white/80 leading-relaxed mb-8 max-w-xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
            Whether it's a quick blog post or a massive website revamp, I'm game. Let's figure it out together.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center bg-white text-[hsl(175_35%_40%)] font-semibold text-sm uppercase tracking-wide rounded-full px-8 py-3.5 hover:bg-white/90 hover:-translate-y-px hover:shadow-lg transition-all duration-200">
              Email Me <ArrowRight size={14} className="ml-2" />
            </Link>
            <a href="https://topmate.io/meenakshi_girish/" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white font-semibold text-sm uppercase tracking-wide rounded-full px-8 py-3.5 hover:bg-white hover:text-[hsl(175_35%_40%)] transition-all duration-200">
              Book a Call
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
