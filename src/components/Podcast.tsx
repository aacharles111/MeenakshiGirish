import FadeUp from './FadeUp';
import { Play, Headphones } from 'lucide-react';
import AbstractDeco from './AbstractDeco';

export default function Podcast() {
  return (
    <section className="bg-card py-24 relative overflow-hidden">
      <AbstractDeco
        src="/abstract/Teal shape 2.svg"
        className="-right-32 -top-20 w-[400px] h-[400px]"
        opacity={0.9}
      />
      <AbstractDeco
        src="/abstract/Leaf2.svg"
        className="-left-20 bottom-0 w-[220px] h-[220px]"
        opacity={0.9}
        style={{ transform: 'rotate(25deg) scaleX(-1)' }}
      />

      {/* Decorative circle */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full bg-accent/15 z-0"
        style={{ left: '50%', transform: 'translateX(-50%)', bottom: 0 }}
      />

      <FadeUp>
        <div className="max-w-[800px] mx-auto text-center px-6 relative z-10">
          <h2
            className="font-playfair font-bold italic text-foreground mb-5"
            style={{
              fontWeight: 700,
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            }}
          >
            Conversations actually worth eavesdropping on.
          </h2>

          <p className="text-base text-muted-foreground leading-[1.7] max-w-[600px] mx-auto mb-8">
            Over on TFM Shortcast, I chat with real freelancers, authors, and creators about what
            this industry actually looks like. We skip the fluffy &lsquo;hustle culture&rsquo;
            nonsense and get straight into the good, the bad, and the highly caffeinated realities of
            doing the work.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* YouTube — outlined */}
            <a
              href="https://www.youtube.com/@TFMShortcast/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-primary text-primary font-semibold text-[13px] uppercase rounded-full px-7 py-3 inline-flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-250"
            >
              <Play size={16} />
              WATCH ON YOUTUBE
            </a>

            {/* Spotify — filled */}
            <a
              href="https://open.spotify.com/show/55C8g0qgxeROYP0X6m8inn"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground font-semibold text-[13px] uppercase rounded-full px-7 py-3 inline-flex items-center gap-2 hover:bg-[hsl(175_35%_50%)] transition-all duration-250"
            >
              <Headphones size={16} />
              LISTEN ON SPOTIFY
            </a>
          </div>
        </div>
      </FadeUp>
    </section>
  );
}
