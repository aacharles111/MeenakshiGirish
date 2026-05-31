import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const easeOut = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/video/hero-landscape.mp4" type="video/mp4" />
      </video>

      {/* Hero Content Overlay — CENTER aligned */}
      <div
        className="relative z-10 h-full flex flex-col items-center justify-start text-center px-6 sm:px-10 lg:px-20 max-w-[1400px] mx-auto"
        style={{ paddingTop: '22vh' }}
      >
        {/* Greeting */}
        <motion.p
          className="text-white italic mb-1 md:mb-2 text-[5.5vw] md:text-[2.5vw] lg:text-[1.7rem]"
          style={{
            fontFamily: 'var(--font-playfair)',
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
        >
          Hey there! I am
        </motion.p>

        {/* Name — MASSIVE display font
             Desktop: "MEENAKSHI" single line
             Mobile: "MEEN" / "AKSHI" two lines via hidden <br> */}
        <motion.h1
          style={{
            fontFamily: 'var(--font-endeavour)',
            textShadow: '0 2px 40px rgba(0,0,0,0.06)',
            lineHeight: 0.88,
          }}
          /* Mobile: 22vw fills width with 50px padding. Desktop: 15vw capped at 11rem */
          className="text-white tracking-tight mb-6 md:mb-8 text-[22vw] md:text-[15vw] lg:text-[11rem]"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
        >
          {/* Mobile: two lines. Desktop: single line */}
          <span className="md:hidden">MEEN<br />AKSHI</span>
          <span className="hidden md:inline">MEENAKSHI</span>
        </motion.h1>

        {/* Desktop: subheading + button in a row | Mobile: stacked */}
        <motion.div
          className="flex flex-col items-center md:flex-row md:items-end md:gap-12"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.5 }}
        >
          {/* Subheading */}
          <p
            className="text-white/85 italic max-w-[380px] leading-relaxed mb-6 md:mb-0 text-center md:text-left"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(0.85rem, 1.5vw, 1.05rem)',
            }}
          >
            Freelance writer, author, speaker, content creator &amp; someone who
            probably spends a little too much time talking into a mic.
          </p>

          {/* CTA Button — outlined white, pill shape */}
          <Link
            to="/contact"
            className="border-2 border-white/80 text-white font-semibold text-[12px] uppercase tracking-[0.18em] rounded-full px-8 py-3.5 inline-flex items-center justify-center hover:bg-white hover:text-foreground transition-all duration-300 whitespace-nowrap"
          >
            LET'S WORK TOGETHER
          </Link>
        </motion.div>
      </div>

      {/* Hero Bottom — Cloud/mist fade to background color */}
      <div
        className="absolute bottom-0 left-0 w-full z-10 h-[180px] md:h-[220px]"
        style={{
          background: 'linear-gradient(to top, hsl(40 30% 97%) 0%, hsl(40 30% 97% / 0.85) 30%, hsl(40 30% 97% / 0.4) 60%, transparent 100%)',
        }}
      />
    </section>
  );
}
