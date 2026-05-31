import { Monitor, BookHeart, Mic } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import FadeUp from './FadeUp';
import AbstractDeco from './AbstractDeco';

interface ServiceCard {
  icon: LucideIcon;
  title: string;
  body: string;
  link: string;
  href: string;
}

const services: ServiceCard[] = [
  {
    icon: Monitor,
    title: 'Freelance Content Writing',
    body: "I write for brands, businesses, and people who need words that actually work. Websites, blogs, social media, SEO content, newsletters — if it has letters in it, I've probably written it.",
    link: 'Stalk My Services →',
    href: '/freelancing',
  },
  {
    icon: BookHeart,
    title: "The Freelancer's Mindset",
    body: "I wrote the book I desperately wished someone had handed me when I started. It's part personal story, part survival guide, and 100% honest.",
    link: 'Grab a Copy →',
    href: '/the-book',
  },
  {
    icon: Mic,
    title: 'Public Speaking & Mentoring',
    body: "I've spoken at colleges, practically lived at Toastmasters, and mentored over a thousand folks through content and freelancing. Turns out, I like talking almost as much as writing.",
    link: 'Book My Brain →',
    href: '/speaking',
  },
];

export default function Services() {
  return (
    <section className="bg-card py-24 lg:py-32 relative overflow-hidden">
      {/* Abstract Decorations */}
      <AbstractDeco
        src="/abstract/teal-shape-1.svg"
        className="-right-40 -bottom-32 w-[450px] h-[450px] lg:w-[550px] lg:h-[550px]"
        opacity={0.9}
      />
      <AbstractDeco
        src="/abstract/leaf-2.svg"
        className="-left-24 top-20 w-[250px] h-[250px]"
        opacity={0.9}
        style={{ transform: 'rotate(-20deg)' }}
      />
      <AbstractDeco
        src="/abstract/brown-shape-1.svg"
        className="left-1/3 -top-20 w-[350px] h-[350px]"
        opacity={0.9}
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
        <SectionHeader
          label="WHAT I BRING TO THE TABLE"
          heading="Three things I've built my life around (besides reading)."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <FadeUp key={service.title} delay={index * 0.15} className="h-full">
                <div className="h-full flex flex-col bg-background rounded-2xl p-10 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_hsl(30_15%_75%_/_0.2)] hover:border-primary/30 transition-all duration-300 ease-out">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Icon size={36} className="text-primary" />
                  </div>

                  <h3
                    className="font-playfair font-bold italic text-[22px] text-foreground mb-2"
                  >
                    {service.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {service.body}
                  </p>

                  <Link to={service.href} className="font-medium text-[13px] text-primary inline-flex items-center gap-1 hover:gap-2 transition-all duration-200 cursor-pointer mt-auto">
                    {service.link}
                  </Link>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
