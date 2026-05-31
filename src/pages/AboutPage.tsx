import { Link } from 'react-router-dom';

import { PenLine, BookOpen, Mic2, Users, BookHeart, Instagram, Leaf } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import FadeUp from '../components/FadeUp';
import AbstractDeco from '../components/AbstractDeco';
import DotField from '../components/DotField';
import CurvedLoop from '../components/CurvedLoop';
import Marquee from '../components/Marquee';

const funFacts: { icon: LucideIcon; title: string; body: string; accent: string }[] = [
  { icon: PenLine, title: 'I am a writer first.', body: "Whether it's a 3,000-word deep-dive article or a cheeky 15-second Instagram caption, my brain works the same way: What is the clearest, most interesting way to say this? I hate fluff. I don't write to hit word counts; I write to make an impact.", accent: 'hsl(175 35% 55%)' },
  { icon: BookOpen, title: 'I read. A lot.', body: "My personal library is sitting pretty somewhere between 1,500 and 2,000 books. I review them, talk about them online, and interview publishing folks on my podcast. Reading isn't just my escape; it's the secret sauce behind everything I write.", accent: 'hsl(35 55% 55%)' },
  { icon: Mic2, title: 'I was freelancing before it was cool.', body: "Freelancing became the ultimate pandemic trend, but I was already out here in the trenches! I've ridden the highs, survived the lows, and built a system that actually works. That roller-coaster ride? That's what eventually became my book.", accent: 'hsl(200 40% 55%)' },
  { icon: Users, title: "I love a good 'Aha!' moment.", body: "I've mentored over a thousand students and pros. I don't do vague \"follow your dreams\" advice. I give you the real, actionable, step-by-step guidance I wish someone had handed me.", accent: 'hsl(320 30% 55%)' },
];

const whatIDo: { icon: LucideIcon; label: string; desc: string }[] = [
  { icon: PenLine, label: 'Freelance Content Writing', desc: "Websites, blogs, SEO, newsletters. If your brand needs a voice, I'm your girl." },
  { icon: BookHeart, label: 'Author', desc: "I wrote The Freelancer's Mindset so you wouldn't have to guess how to start freelancing." },
  { icon: Mic2, label: 'Podcaster', desc: 'I host TFM Shortcast, a space where I interrogate (kidding!) freelancers and creators about their real journeys.' },
  { icon: Users, label: 'Public Speaker', desc: "I've spoken all over South India about content, personal branding, and why words matter." },
  { icon: Leaf, label: 'Mentor', desc: '1-on-1 and group sessions for anyone trying to figure out their online voice without losing their mind.' },
  { icon: Instagram, label: 'Book Reviewer', desc: 'You can find me over on Instagram obsessing over my latest read.' },
];

const industries = ['Healthcare & Medicine', 'E-Commerce', 'B2B Corporate', 'Personal Brands', 'Startups', 'Education', 'Publishing', 'Lifestyle', 'Tech', 'Finance'];



export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="The girl behind the keyboard"
        title="Just a girl, a borderline-concerning number of books, and a freelancing career built from scratch."
        subtitle="I didn't have a mentor when I started. I definitely didn't have a map. I just had a laptop, a love for words, and a stubborn belief that good content can genuinely move people. Seven years later, I'm still at it—and honestly? I'm having more fun than ever."
      />

      {/* ─── Section 2: My Story — Magazine editorial layout ─── */}
      <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
        {/* Unique deco placement for About: bottom-right leaf, left teal */}
        <AbstractDeco src="/abstract/Leaf1.svg" className="-right-16 bottom-10 w-[280px] h-[280px] lg:w-[350px] lg:h-[350px]" opacity={0.9} style={{ transform: 'rotate(-25deg)' }} />
        <AbstractDeco src="/abstract/Teal shape 2.svg" className="-left-40 -top-32 w-[500px] h-[500px]" opacity={0.9} />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          {/* FLIPPED: Text LEFT, Image RIGHT (different from Freelancing page) */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">
            {/* Story text */}
            <div>
              <FadeUp>
                <div className="flex items-center gap-2 font-medium text-xs uppercase tracking-[0.15em] text-primary mb-3">
                  <Leaf size={14} />
                  <span>MY JOURNEY</span>
                </div>
                <h2 className="font-bold italic text-foreground leading-tight mb-6" style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
                  So, how did this all happen?
                </h2>
              </FadeUp>
              <FadeUp delay={0.1}>
                <div className="space-y-5 text-foreground/85 leading-[1.75]" style={{ fontFamily: 'var(--font-poppins)', fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
                  <p>Well, I was a voracious reader long before anyone ever paid me to write. Growing up, books weren't just a hobby; they were how I understood the world. So when I accidentally stumbled into content writing, it felt less like picking a career and more like, "Oh, right, this makes sense."</p>
                  <p>I started freelancing while everyone else my age was stressing over internships. I took on tiny projects, slowly built my client list, and eventually spiraled into doing <em>everything</em> content—websites, SEO, blogs, newsletters, podcast hosting, you name it.</p>
                  <p>Fast forward six years of full-time freelancing: I work with awesome clients globally. I've written for industries I never thought I'd understand (hello, medical tech and B2B software), and I built a stable business out of it. And no, it wasn't magic. It was just good systems, respecting the craft, and figuring out exactly what clients actually need.</p>
                </div>
              </FadeUp>
            </div>

            {/* Portrait — rounded-3xl rectangle, NOT circular */}
            <FadeUp delay={0.2}>
              <div className="relative mx-auto lg:mx-0">
                <AbstractDeco src="/abstract/Brown shape 2.svg" className="-right-12 -bottom-12 w-[300px] h-[300px]" opacity={0.9} />
                <div className="relative w-[300px] h-[400px] md:w-[340px] md:h-[440px] rounded-3xl overflow-hidden border-[3px] border-primary/20 shadow-[0_10px_40px_hsl(210_25%_15%_/_0.08)] lg:-mt-16">
                  <img src="/images/meenakshi-hero.png" alt="Meenakshi Girish" className="object-cover w-full h-full" />
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── Section 3: CurvedLoop Identity Band ─── */}
      <section className="py-4 bg-background overflow-hidden">
        <CurvedLoop
          marqueeText="Writer ✦ Author ✦ Speaker ✦ Podcaster ✦ Mentor ✦ Book Lover ✦"
          speed={2}
          curveAmount={200}
          direction="left"
          interactive={true}
        />
      </section>

      {/* ─── Section 4: Fun Facts — Staggered masonry layout ─── */}
      <section className="bg-card py-24 lg:py-32 relative overflow-hidden">
        {/* Different deco positions from other pages */}
        <AbstractDeco src="/abstract/Brown shape 1.svg" className="-right-28 top-1/4 w-[350px] h-[350px]" opacity={0.9} />
        <AbstractDeco src="/abstract/Teal shape 1.svg" className="-left-32 -bottom-20 w-[400px] h-[400px]" opacity={0.9} />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="Who I am" heading="A few fun facts about how I operate." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {funFacts.map((fact, i) => {
              const Icon = fact.icon;
              return (
                <FadeUp key={i} delay={i * 0.12}>
                  <div
                    className={`bg-background rounded-2xl p-6 md:p-10 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_hsl(30_15%_75%_/_0.2)] hover:border-primary/30 transition-all duration-300 ease-out h-full ${i === 1 ? 'md:mt-10' : i === 2 ? 'md:mt-5' : i === 3 ? 'md:mt-[60px]' : ''}`}
                  >
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: `${fact.accent}15` }}>
                      <Icon size={28} style={{ color: fact.accent }} />
                    </div>
                    <h3 className="font-bold italic text-foreground mb-3" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.2rem' }}>
                      {fact.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{fact.body}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Section 5: What I Do — Timeline on desktop, cards on mobile ─── */}
      <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/abstract/Teal shape 2.svg" className="-right-40 -bottom-32 w-[450px] h-[450px]" opacity={0.9} />
        <AbstractDeco src="/abstract/Leaf2.svg" className="-left-16 top-1/3 w-[250px] h-[250px]" opacity={0.9} style={{ transform: 'rotate(25deg)' }} />

        <div className="max-w-[900px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="What I do" heading="The Full Picture." />
          <FadeUp>
            <p className="text-foreground/80 leading-relaxed mb-10 text-center max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
              My work doesn't fit neatly into a tiny little box, and I gave up trying to force it into one. Here's what my day-to-day actually looks like:
            </p>
          </FadeUp>

          {/* Timeline layout on desktop, stacked on mobile */}
          <div className="relative">
            {/* Center line — visible on desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-primary/20" style={{ transform: 'translateX(-50%)' }} />

            <div className="space-y-6 lg:space-y-10">
              {whatIDo.map((item, i) => {
                const Icon = item.icon;
                const isLeft = i % 2 === 0;
                return (
                  <FadeUp key={item.label} delay={i * 0.08}>
                    <div className={`flex items-start gap-4 lg:gap-0 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                      {/* Content card */}
                      <div className={`flex-1 lg:max-w-[45%] ${isLeft ? 'lg:text-right lg:pr-10' : 'lg:text-left lg:pl-10'}`}>
                        <div className={`bg-card rounded-2xl p-6 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] hover:-translate-y-1 hover:shadow-[0_8px_30px_hsl(30_15%_75%_/_0.2)] hover:border-primary/30 transition-all duration-300`}>
                          <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'lg:justify-end' : 'lg:justify-start'}`}>
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 lg:order-none">
                              <Icon size={20} className="text-primary" />
                            </div>
                            <span className="font-semibold text-foreground text-sm">{item.label}</span>
                          </div>
                          <span className="text-muted-foreground text-sm leading-relaxed">{item.desc}</span>
                        </div>
                      </div>
                      {/* Center dot — visible on desktop */}
                      <div className="hidden lg:flex items-center justify-center w-4 h-4 rounded-full bg-primary border-2 border-white shadow-sm shrink-0 relative z-10 mt-6" />
                      {/* Spacer for opposite side */}
                      <div className="hidden lg:block flex-1 lg:max-w-[45%]" />
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 6: Industries — Animated Marquee ─── */}
      <section className="py-20 lg:py-28 relative overflow-hidden" style={{ background: 'linear-gradient(170deg, hsl(175 30% 92%) 0%, hsl(40 30% 97%) 50%, hsl(40 30% 97%) 100%)' }}>
        <AbstractDeco src="/abstract/Brown shape 2.svg" className="-right-20 -top-10 w-[300px] h-[300px]" opacity={0.9} style={{ transform: 'rotate(30deg)' }} />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10 text-center">
          <SectionHeader label="My clients" heading="The Cool People I Work With." />
          <FadeUp>
            <p className="text-foreground/80 leading-relaxed mb-10 max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
              I get bored easily, which is why I love jumping between different industries! From solo founders to massive international brands, here's where I've left my mark:
            </p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <Marquee speed={25} direction="left" pauseOnHover>
              {industries.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex px-8 py-3.5 mx-3 rounded-full bg-white border border-primary/20 text-foreground/80 text-sm font-medium shadow-[0_2px_8px_hsl(30_15%_80%_/_0.15)] whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </Marquee>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p className="text-muted-foreground text-sm italic mt-8">No copy-pasting here. Every niche gets a voice that sounds exactly like them (but, you know, better).</p>
          </FadeUp>
        </div>
      </section>

      {/* ─── Section 7: CTA Band — Teal with white dot field ─── */}
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
        <AbstractDeco src="/abstract/Leaf1.svg" className="-left-20 -top-16 w-[300px] h-[300px]" opacity={0.12} style={{ transform: 'rotate(-15deg)', filter: 'brightness(0) invert(1)' }} />
        <AbstractDeco src="/abstract/Teal shape 1.svg" className="-right-16 -bottom-20 w-[350px] h-[350px]" opacity={0.08} style={{ filter: 'brightness(0) invert(1)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-bold italic text-white mb-4" style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>
            Let's make something awesome.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link to="/buy" className="bg-white text-[hsl(175_35%_40%)] font-semibold text-sm uppercase tracking-wide rounded-full px-8 py-3.5 hover:bg-white/90 hover:-translate-y-px hover:shadow-lg transition-all duration-200">
              Buy The Freelancer's Mindset
            </Link>
            <Link to="/contact" className="border-2 border-white text-white font-semibold text-sm uppercase tracking-wide rounded-full px-8 py-3.5 hover:bg-white hover:text-[hsl(175_35%_40%)] transition-all duration-200">
              Say Hello
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
