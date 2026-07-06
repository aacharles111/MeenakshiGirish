import { Link } from 'react-router-dom';

import { Sparkles, Heart, Users, Palette, Coffee, BookHeart, User, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageHero from '../components/PageHero';
import useSEO from '../hooks/useSEO';
import SectionHeader from '../components/SectionHeader';
import FadeUp from '../components/FadeUp';
import AbstractDeco from '../components/AbstractDeco';
import TiltCard from '../components/TiltCard';
import SplineBook from '../components/SplineBook';
import Marquee from '../components/Marquee';
import DotField from '../components/DotField';
import TextReveal from '../components/TextReveal';

const forWho: { icon: LucideIcon; title: string; body: string; color: string }[] = [
  { icon: Sparkles, title: 'The "Where Do I Even Start" Beginner.', body: "If you're curious but clueless, welcome! I don't use scary jargon. I'll walk you through the absolute basics.", color: 'hsl(175 35% 55%)' },
  { icon: Heart, title: 'The "I\'m About to Quit" Freelancer.', body: "Hitting a wall? Dealing with ghosting clients and weird income? Let's get you back on track before you burn your laptop.", color: 'hsl(35 55% 55%)' },
  { icon: Users, title: 'The "Get Me Out of This Cubicle" Pro.', body: "You have the skills, you just need to know how to sell them on your own terms. I'll show you the frameworks.", color: 'hsl(200 40% 55%)' },
];

const differentiators: { icon: LucideIcon; label: string; desc: string }[] = [
  { icon: Heart, label: "It's Personal.", desc: "You're getting the real, messy highs and lows of my life, not a polished Instagram highlight reel." },
  { icon: Users, label: "It's Collaborative.", desc: "Real voices from other working freelancers are inside. It's a community effort." },
  { icon: Palette, label: "It's Artsy.", desc: 'Original artwork makes the reading experience way more fun.' },
  { icon: Coffee, label: "It's Friendly.", desc: "I wrote this like I was talking to a friend over coffee. I'm here to help you, not show off." },
];

const testimonials = [
  { quote: "Loved your candid thoughts on writing and becoming an author, ma'am.", author: 'Aspiring Author', role: 'Talk Attendee' },
  { quote: "I finished your book today and it has so many insights. I want to start freelancing and support my family but didn't know it's possible for students. Thank you.", author: 'Book Reader', role: 'Student' },
  { quote: "I have just started writing my book but thought nobody will buy a book on spirituality written by a college student. But your session gave me the confidence to give it a try anyway. Thanks so much, ma'am.", author: 'Aspiring Author', role: 'Student' },
];

// TODO: replace with real Amazon Kindle and catalog URLs
const purchaseLinks = [
  { label: 'Amazon Kindle', href: 'https://amzn.in/d/06pnDdVe' },
  { label: 'View Catalog', href: '#' },
];



export default function BookPage() {
  useSEO({
    title: "The Freelancer's Mindset — Book by Meenakshi Girish",
    description: "The Freelancer's Mindset — the honest, practical guide to building a freelance career by Meenakshi Girish. Available on Kindle; audiobook on Spotify.",
    path: '/the-book',
  });
  return (
    <>
      <PageHero
        eyebrow="Fresh Out of the Oven"
        title="The Freelancer's Mindset"
        subtitle="The book I wrote because nobody handed me a manual when I needed one. Look, this isn't a boring textbook. It's the honest, slightly messy, totally real story of how I built my freelancing career from zero. Part memoir, part survival guide, and entirely real."
        ctaText="Get Your Hands on a Copy"
        ctaLink="/buy"
      />

      {/* ─── Book Showcase — TiltCard 3D book visual, centered ─── */}
      <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/abstract/brown-shape-1.svg" className="-right-28 -top-20 w-[400px] h-[400px]" opacity={0.9} />
        <AbstractDeco src="/abstract/leaf-1.svg" className="-left-20 bottom-10 w-[300px] h-[300px]" opacity={0.9} style={{ transform: 'rotate(-30deg)' }} />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[470px_1fr] gap-10 items-center">
            {/* 3D Interactive Spline Book */}
            <FadeUp>
              <div className="flex justify-center lg:justify-start">
                <div className="w-full max-w-[350px] md:max-w-[450px]">
                  <SplineBook />
                </div>
              </div>
            </FadeUp>

            {/* Book story text */}
            <div>
              <SectionHeader label="The story" heading="So, What Is in This Book?" align="left" />
              <FadeUp>
                <div className="space-y-5 text-foreground/85 leading-[1.75]" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
                  <p><em>The Freelancer's Mindset</em> is the guide I scoured the earth for when I was starting out but couldn't find. Everything out there was either too corporate or full of toxic hustle-culture fluff. So, I wrote my own.</p>
                  <p>This book takes you through my early days of confusion, the mistakes I made, and the systems that finally made everything click. While you're laughing at my journey, you'll be absorbing the tools you need to build your own freelance empire.</p>
                  <p><strong>Student? 9-to-5er looking for an exit? Or already freelancing and feeling completely stuck?</strong> This one's for you.</p>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Audiobook Banner — Unique warm gradient callout ─── */}
      <section className="py-10 px-6 relative overflow-hidden">
        <div className="max-w-[1000px] mx-auto relative z-10">
          <FadeUp>
            <div className="rounded-[2rem] p-8 md:p-10 border border-[hsl(35_40%_70%)]/40 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(40 40% 92%) 0%, hsl(35 35% 88%) 100%)' }}>
              <AbstractDeco src="/abstract/teal-shape-1.svg" className="-right-16 -top-10 w-[200px] h-[200px]" opacity={0.2} />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <BookHeart size={28} className="text-primary" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-3">
                    First 10 Chapters Live
                  </span>
                  <p className="text-foreground/85 leading-relaxed" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
                    Too busy to read? I get it. The first 10 chapters of <em>The Freelancer's Mindset</em> audiobook are live now, with more coming soon. Listen to me read it to you!
                  </p>
                </div>
                <a href="https://open.spotify.com/show/55C8g0qgxeROYP0X6m8inn" target="_blank" rel="noopener noreferrer" className="border-2 border-primary text-primary font-semibold text-sm uppercase tracking-wide rounded-full px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-200 shrink-0">
                  Listen on Spotify
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── Who Is This For — 3-column with unique colored tops ─── */}
      <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/abstract/brown-shape-2.svg" className="left-1/3 -top-20 w-[350px] h-[350px]" opacity={0.9} hideMobile />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10 text-center">
          <TextReveal
            text="Who Is This For?"
            as="h2"
            className="font-bold italic text-foreground leading-tight mb-14"
            style={{ display: 'inline-block' }}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {forWho.map((card, i) => {
              const Icon = card.icon;
              return (
                <FadeUp key={i} delay={i * 0.12}>
                  <TiltCard tiltAmount={5} className="h-full">
                    <div className="bg-card rounded-2xl p-10 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] h-full relative overflow-hidden">
                      {/* Colored gradient strip at top */}
                      <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl" style={{ background: `linear-gradient(to right, ${card.color}, transparent)` }} />
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: `${card.color}15` }}>
                        <Icon size={28} style={{ color: card.color }} />
                      </div>
                      <h3 className="font-bold italic text-foreground mb-3" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem' }}>
                        {card.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{card.body}</p>
                    </div>
                  </TiltCard>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── What Makes It Different — 2x2 with Marquee divider ─── */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(170deg, hsl(175 30% 92%) 0%, hsl(40 30% 97%) 100%)' }}>
        <AbstractDeco src="/abstract/leaf-1.svg" className="-right-16 -top-10 w-[300px] h-[300px]" opacity={0.9} style={{ transform: 'rotate(30deg)' }} />

        <div className="max-w-[1000px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="Unique" heading="Not Your Average 'How-To' Book" />
          <FadeUp>
            <p className="text-foreground/80 leading-relaxed mb-10 text-center max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
              There are a million freelancing books. Most of them are boring. Here's why mine isn't:
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {differentiators.map((d, i) => {
              const Icon = d.icon;
              return (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-8 border border-primary/15 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] hover:-translate-y-1 hover:shadow-md transition-all duration-300 h-full flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={22} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary mb-1" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem' }}>
                        {d.label}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Marquee band — Book praise ─── */}
      <section className="py-6 bg-card border-y border-border/30 overflow-hidden">
        <Marquee speed={20} direction="right" pauseOnHover>
          {['Honest', 'Practical', 'Funny', 'Beautiful', 'Real', 'Actionable', 'Heartfelt', 'Inspiring'].map((word) => (
            <span
              key={word}
              className="inline-flex items-center gap-2 mx-6 text-primary/60 text-lg font-bold italic"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              <span className="text-primary/30">✦</span>
              {word}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ─── Testimonials — Single-column large quotes ─── */}
      <section className="bg-card py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/abstract/teal-shape-1.svg" className="-left-32 -top-16 w-[400px] h-[400px]" opacity={0.9} hideMobile />

        <div className="max-w-[700px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="Reviews" heading="Don't Take My Word For It" />
          <div className="space-y-8">
            {testimonials.map((t, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <div className="bg-background rounded-2xl p-8 md:p-10 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] text-center">
                  <div className="text-primary/20 text-6xl font-bold leading-none mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>"</div>
                  <p className="text-foreground italic leading-relaxed mb-6" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem' }}>
                    {t.quote}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                    <div className="text-left">
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

      {/* ─── Buy CTA — Teal with white dot field ─── */}
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
        <AbstractDeco src="/abstract/leaf-2.svg" className="-left-20 -top-16 w-[300px] h-[300px]" opacity={0.12} style={{ filter: 'brightness(0) invert(1)' }} />
        <AbstractDeco src="/abstract/brown-shape-1.svg" className="-right-16 -bottom-20 w-[350px] h-[350px]" opacity={0.08} style={{ filter: 'brightness(0) invert(1)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-bold italic text-white mb-4" style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            Grab Your Copy!
          </h2>
          <p className="text-white/80 leading-relaxed mb-8 max-w-xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
            Just fill in your details, grab your wallet, and I'll send it straight to your door. Easy peasy.
          </p>
          <Link to="/buy" className="bg-white text-[hsl(175_35%_40%)] font-semibold text-sm uppercase tracking-wide rounded-full px-10 py-4 hover:bg-white/90 hover:-translate-y-px hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2">
            Buy The Freelancer's Mindset <ArrowRight size={14} />
          </Link>
          <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
            <span className="text-white/70 text-xs uppercase tracking-wider">Also on</span>
            {purchaseLinks.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="border border-white/60 text-white font-semibold text-xs uppercase tracking-wide rounded-full px-5 py-2 hover:bg-white hover:text-[hsl(175_35%_40%)] transition-all duration-200">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
