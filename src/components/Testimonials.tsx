import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, User } from 'lucide-react';
import SectionHeader from './SectionHeader';
import FadeUp from './FadeUp';
import AbstractDeco from './AbstractDeco';
import testimonialsData from '../content/testimonials.json';
import type { Testimonial } from '../lib/contentTypes';

const testimonials: Testimonial[] = testimonialsData.testimonials;

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
        <SectionHeader label="PEOPLE SAYING NICE THINGS" heading="Don't just take my word for it" />

        <p className="text-base text-foreground/75 leading-[1.75] max-w-[680px] mx-auto text-center -mt-6 mb-14 px-6">
          From college auditoriums to book clubs to 1-on-1 mentoring calls — here's what people have said after attending a talk, reading the book, or sitting in on a session.
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
                  &ldquo;{testimonials[currentIndex].quote}&rdquo;
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
