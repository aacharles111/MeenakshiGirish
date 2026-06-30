import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, User } from 'lucide-react';
import SectionHeader from './SectionHeader';
import FadeUp from './FadeUp';
import AbstractDeco from './AbstractDeco';

interface Testimonial {
  text: string;
  author: string;
}

const testimonials: Testimonial[] = [
  {
    text: 'Working with Meenakshi was the best content decision we made this year. She understood our brand voice instantly and delivered consistently.',
    author: 'Rohan K., Marketing Director, TechFlow',
  },
  {
    text: 'Her book genuinely changed how I approach freelancing. It\u2019s the kind of read that makes you feel like someone finally gets it.',
    author: 'Ananya S., Freelance Designer',
  },
  {
    text: 'Her mentoring session was worth every minute. She doesn\u2019t give you generic advice \u2014 she gives you a real roadmap.',
    author: 'Vikram P., Content Strategist',
  },
  {
    text: 'I handed her a chaotic brief, and she returned a beautifully structured, highly converting sales page. Absolute magic.',
    author: 'Sarah L., E-commerce Founder',
  },
  {
    text: 'Meenakshi is rare. She writes with empathy but understands business metrics. Our newsletter open rates have never been higher.',
    author: 'Dr. Arvind T., Healthcare Consultant',
  },
];

const chatMessages = [
  { text: 'The draft looks amazing! 🔥', rotate: '-2deg' },
  { text: 'Just closed a deal thanks to that landing page!', rotate: '0deg' },
  { text: 'You nailed our brand voice instantly ✨', rotate: '2deg' },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isHovered = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isHovered.current) {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }
    }, 6000);
  }, []);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    startInterval();
  };

  return (
    <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
      {/* Abstract Decorations */}
      <AbstractDeco
        src="/abstract/teal-shape-1.svg"
        className="-left-48 top-10 w-[400px] h-[400px]"
        opacity={0.9}
      />
      <AbstractDeco
        src="/abstract/brown-shape-2.svg"
        className="-right-32 -bottom-20 w-[350px] h-[350px]"
        opacity={0.9}
      />
      <AbstractDeco
        src="/abstract/leaf-1.svg"
        className="right-20 top-8 w-[200px] h-[200px]"
        opacity={0.9}
        hideMobile
        style={{ transform: 'rotate(-30deg)' }}
      />

      <FadeUp>
        <SectionHeader label="PEOPLE SAYING NICE THINGS" heading="Don't Just Take My Word for It" />
        <p className="text-foreground/80 leading-relaxed mb-10 text-center max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
          From brand founders to senior content strategists, here is what working with a freelance content writer who takes the craft seriously looks like.
        </p>

        {/* Carousel */}
        <div
          className="max-w-[750px] mx-auto px-6 text-center relative"
          onMouseEnter={() => (isHovered.current = true)}
          onMouseLeave={() => (isHovered.current = false)}
        >
          {/* Large quote mark */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none">
            <Quote size={120} className="text-primary/10" />
          </div>

          {/* Testimonial text — fixed height to prevent jitter */}
          <div className="pt-16 min-h-[220px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <p
                  className="font-playfair italic text-foreground leading-[1.8] mb-6"
                  style={{
                    fontWeight: 600,
                    fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
                  }}
                >
                  &ldquo;{testimonials[currentIndex].text}&rdquo;
                </p>
                <p className="font-medium text-sm text-muted-foreground">
                  &mdash; {testimonials[currentIndex].author}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                  i === currentIndex ? 'bg-primary' : 'bg-primary/20'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Screenshot Reviews Strip */}
        <div className="mt-12">
          <p className="font-medium text-[11px] uppercase tracking-[0.15em] text-primary/60 text-center mb-4">
            Real reviews, real chats.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl px-4 py-3 shadow-[0_2px_10px_hsl(30_15%_80%_/_0.1)] max-w-[220px] flex items-start gap-2"
                style={{ rotate: msg.rotate }}
              >
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <User size={10} />
                </div>
                <span className="text-xs text-foreground/80">{msg.text}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
