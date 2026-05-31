import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Linkedin, Instagram, Youtube, Music2, ExternalLink, Mail, Phone, Send, MessageSquare, ArrowRight, Heart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import FadeUp from '../components/FadeUp';
import AbstractDeco from '../components/AbstractDeco';
import TiltCard from '../components/TiltCard';
import TextReveal from '../components/TextReveal';
import CurvedLoop from '../components/CurvedLoop';

const socials: { icon: LucideIcon; label: string; desc: string; href: string; color: string }[] = [
  { icon: Linkedin, label: 'LinkedIn', desc: 'My professional-ish alter ego', href: 'https://www.linkedin.com/in/meenakshi-girish/', color: 'hsl(210 60% 50%)' },
  { icon: Instagram, label: 'Instagram (Books)', desc: 'Where I geek out over my reading list', href: 'https://www.instagram.com/meenugirish31/', color: 'hsl(340 60% 55%)' },
  { icon: Instagram, label: 'Instagram (Personal)', desc: 'Where I post about writing and life', href: 'https://www.instagram.com/meenakshigirish31/', color: 'hsl(290 50% 55%)' },
  { icon: Youtube, label: 'YouTube', desc: 'Watch me ramble on TFM Shortcast', href: 'https://www.youtube.com/@TFMShortcast/videos', color: 'hsl(0 70% 55%)' },
  { icon: Music2, label: 'Spotify', desc: 'Listen to me ramble on TFM Shortcast', href: 'https://open.spotify.com/show/55C8g0qgxeROYP0X6m8inn', color: 'hsl(140 60% 45%)' },
];

const subjectOptions = ['Hire Me', 'Speaking & Mentoring', 'Book Stuff', 'Just saying hi'];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

export default function ContactPage() {
  const [formState, setFormState] = useState<'idle' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sent');
  };

  return (
    <>
      <PageHero
        eyebrow="Let's Talk"
        title="Got something on your mind? Slide into my inbox."
        subtitle="Want to hire me? Book me for a talk? Need a mentor? Or just have a burning question about the book? You're in the right place. I read every single message myself (no bots here!)."
      />

      {/* ─── CurvedLoop marquee for personality ─── */}
      <section className="overflow-hidden py-0" style={{ height: '280px', position: 'relative' }}>
        <CurvedLoop
          marqueeText="Hello ✦ Let's Create Something Amazing ✦ Let's Work Together ✦ Got a Project? ✦ "
          speed={2}
          curveAmount={120}
          direction="right"
          interactive={false}
          className="text-primary/30"
        />
      </section>

      {/* ─── Two CTA Cards — Side-by-side with different shapes ─── */}
      <section className="bg-background py-20 lg:py-28 relative overflow-hidden">
        <AbstractDeco src="/Abstract elements/Brown shape 2.svg" className="-left-32 -top-16 w-[400px] h-[400px]" opacity={0.9} />
        <AbstractDeco src="/Abstract elements/Leaf2.svg" className="-right-16 bottom-10 w-[280px] h-[280px]" opacity={0.9} style={{ transform: 'rotate(-15deg)' }} />

        <div className="max-w-[1000px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeUp>
              <TiltCard tiltAmount={5} className="h-full">
                <div className="bg-card rounded-[2rem] p-6 md:p-10 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: 'linear-gradient(to right, hsl(175 35% 55%), transparent)' }} />
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                    <Mail size={28} className="text-primary" />
                  </div>
                  <h3 className="font-bold italic text-foreground mb-3" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.15rem' }}>
                    For the serious (and fun) stuff
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    If you want to hire me to write, invite me to your event, or book a 1-on-1 call, poke me here. I usually reply within 48 hours (unless I'm lost in a good book).
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a href="mailto:hello@meenakshigirish.com" className="bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-6 py-3 text-center hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2">
                      <Mail size={14} /> Email Me
                    </a>
                    <a href="https://wa.me/?text=Hey%20Meenakshi!" target="_blank" rel="noopener noreferrer" className="border-2 border-primary text-primary font-semibold text-xs uppercase tracking-wide rounded-full px-6 py-3 text-center hover:bg-primary hover:text-primary-foreground transition-all duration-200 inline-flex items-center justify-center gap-2">
                      <Phone size={14} /> WhatsApp Me
                    </a>
                  </div>
                </div>
              </TiltCard>
            </FadeUp>
            <FadeUp delay={0.12}>
              <TiltCard tiltAmount={5} className="h-full">
                <div className="bg-card rounded-[2rem] p-6 md:p-10 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: 'linear-gradient(to right, hsl(35 55% 55%), transparent)' }} />
                  <div className="w-14 h-14 rounded-full bg-[hsl(35_55%_55%)]/10 flex items-center justify-center mb-5">
                    <MessageSquare size={28} className="text-[hsl(35_55%_55%)]" />
                  </div>
                  <h3 className="font-bold italic text-foreground mb-3" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.15rem' }}>
                    Just want the book?
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    Skip the small talk and head straight to the order form to grab your copy of <em>The Freelancer's Mindset</em>.
                  </p>
                  <Link to="/buy" className="bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-6 py-3 inline-flex items-center justify-center gap-2 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200">
                    Buy The Book <ArrowRight size={14} />
                  </Link>
                </div>
              </TiltCard>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── Contact Form — full-width with side illustration text ─── */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(170deg, hsl(175 30% 92%) 0%, hsl(40 30% 97%) 100%)' }}>
        <AbstractDeco src="/Abstract elements/Teal shape 1.svg" className="-left-32 -bottom-16 w-[400px] h-[400px]" opacity={0.9} />

        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">
            {/* Side text */}
            <div className="hidden lg:block">
              <FadeUp>
                <TextReveal
                  text="Drop it in this handy little box."
                  as="h2"
                  className="font-bold italic text-foreground leading-tight mb-4"
                  style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.8rem' }}
                />
                <p className="text-muted-foreground text-sm leading-relaxed mt-4">
                  Fill in the form and I'll get back to you within 48 hours. I read every message personally.
                </p>
                <div className="mt-8 flex items-center gap-2 text-primary/40">
                  <Heart size={16} />
                  <span className="text-xs italic" style={{ fontFamily: 'var(--font-playfair)' }}>No bots, just Meenakshi</span>
                </div>
              </FadeUp>
            </div>

            {/* Form */}
            <div className="lg:hidden mb-4">
              <SectionHeader label="Get in touch" heading="Or just drop it in this handy little box." />
            </div>
            <FadeUp delay={0.1}>
              {formState === 'sent' ? (
                <div className="bg-white rounded-[2rem] p-10 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Send size={28} className="text-primary" />
                  </div>
                  <h3 className="font-bold italic text-foreground mb-2" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.3rem' }}>
                    Message sent!
                  </h3>
                  <p className="text-muted-foreground text-sm">I'll get back to you within 48 hours. In the meantime, go read a good book!</p>
                  <button onClick={() => setFormState('idle')} className="mt-6 text-primary text-sm font-medium hover:underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 md:p-10 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="contact-name" className="block text-foreground text-sm font-medium mb-1.5">Your Name *</label>
                      <input id="contact-name" type="text" required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" placeholder="Your full name" />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-foreground text-sm font-medium mb-1.5">Your Email *</label>
                      <input id="contact-email" type="email" required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-foreground text-sm font-medium mb-1.5">Phone Number</label>
                    <input id="contact-phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-foreground text-sm font-medium mb-1.5">What's this about? *</label>
                    <select id="contact-subject" required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors appearance-none">
                      <option value="">Select a topic</option>
                      {subjectOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-foreground text-sm font-medium mb-1.5">Your Message *</label>
                    <textarea id="contact-message" required rows={5} className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" placeholder="Tell me what's on your mind..." />
                  </div>
                  <button type="submit" className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wide rounded-full px-10 py-3.5 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2">
                    <Send size={14} /> Send It!
                  </button>
                </form>
              )}
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── Social Cards — Grid of TiltCards ─── */}
      <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/Abstract elements/Teal shape 2.svg" className="-right-40 -bottom-32 w-[450px] h-[450px]" opacity={0.9} />
        <AbstractDeco src="/Abstract elements/Brown shape 1.svg" className="-left-28 -top-16 w-[300px] h-[300px]" opacity={0.9} />

        <div className="max-w-[900px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="Online" heading="Where I hang out on the internet." />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {socials.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} variants={itemVariants}>
                  <TiltCard tiltAmount={6} className="h-full">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center text-center gap-3 bg-card rounded-2xl p-6 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] hover:border-primary/30 transition-all duration-300 h-full group"
                    >
                      <div className="w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-200" style={{ backgroundColor: `${s.color}15` }}>
                        <Icon size={26} style={{ color: s.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{s.label}</p>
                        <p className="text-muted-foreground text-xs mt-1">{s.desc}</p>
                      </div>
                      <ExternalLink size={14} className="text-muted-foreground/40 group-hover:text-primary transition-colors duration-200 mt-auto" />
                    </a>
                  </TiltCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}
