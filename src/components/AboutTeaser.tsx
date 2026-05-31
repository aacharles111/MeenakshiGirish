import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeUp from './FadeUp';
import AbstractDeco from './AbstractDeco';

export default function AboutTeaser() {
  return (
    <section className="bg-card py-24 relative overflow-hidden">
      {/* Abstract Decorations */}
      <AbstractDeco
        src="/abstract/brown-shape-1.svg"
        className="-right-28 top-0 w-[380px] h-[380px]"
        opacity={0.9}
      />
      <AbstractDeco
        src="/abstract/leaf-1.svg"
        className="-left-16 -bottom-10 w-[200px] h-[200px]"
        opacity={0.9}
        style={{ transform: 'rotate(-15deg)' }}
      />


      <div className="max-w-[750px] mx-auto text-center px-6">
        <FadeUp>
          <h2
            className="font-playfair font-bold italic text-foreground mb-6"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            }}
          >
            So, who exactly is Meenakshi?
          </h2>

          <div className="space-y-4 mb-8">
            <p className="text-base text-foreground/85 leading-[1.8]">
              Well, I'm a 26-year-old South Indian girl who got into freelancing way before it
              became a trendy TikTok hashtag. I built a career out of words and somehow accidentally
              ended up living in a library of 1,500 books.
            </p>
            <p className="text-base text-foreground/85 leading-[1.8]">
              I work with awesome Indian and international clients across healthcare, e-commerce,
              and B2B. I host a podcast where I get real with other freelancers, I review books,
              and I read constantly. I built this whole thing from scratch — no safety net, no magic
              tricks, just a laptop and an unreasonable amount of stubbornness.
            </p>
          </div>

          <Link
            to="/about"
            className="border-2 border-primary text-primary font-semibold text-[13px] uppercase tracking-wider rounded-full px-8 py-3 inline-flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-250"
          >
            READ THE WHOLE STORY
            <ArrowRight size={16} />
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
