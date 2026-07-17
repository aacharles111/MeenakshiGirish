import SectionHeader from './SectionHeader';
import FadeUp from './FadeUp';
import AbstractDeco from './AbstractDeco';

interface ProjectCard {
  image: string;
  title: string;
  category: string;
  overlay: string;
}

const projects: ProjectCard[] = [
  {
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
    title: 'Website Overhaul for HealthTech Innovators',
    category: 'Website Copy',
    overlay: 'Turned complex medical jargon into clear authority — 40% traffic boost.',
  },
  {
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80',
    title: 'Future of Work Thought Leadership',
    category: 'Ghostwriting',
    overlay: '10-part series — 50K+ LinkedIn views, two major speaking gigs.',
  },
  {
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&q=80',
    title: 'E-Commerce Email Conversion Flow',
    category: 'Email Marketing',
    overlay: '35% open rates, 15% more monthly sales.',
  },
];

export default function Portfolio() {
  return (
    <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
      {/* Abstract Decorations */}
      <AbstractDeco
        src="/abstract/leaf-2.svg"
        className="-right-16 top-0 w-[300px] h-[300px]"
        opacity={0.9}
        style={{ transform: 'rotate(30deg) scaleX(-1)' }}
      />
      <AbstractDeco
        src="/abstract/brown-shape-1.svg"
        className="-left-32 bottom-10 w-[400px] h-[400px]"
        opacity={0.9}
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
        <SectionHeader
          label="SELECTED WORK"
          heading="Words in Action (Yes, I Actually Do Work)"
        />

        <FadeUp>
          <p className="text-foreground/80 leading-relaxed mb-10 text-center max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)' }}>
            Across brand websites, B2B blog writing, thought leadership content, and SEO content projects, here is what happens when strategy meets words that work.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <FadeUp key={project.title} delay={index * 0.15}>
              <div className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] hover:-translate-y-1.5 hover:shadow-[0_12px_40px_hsl(30_15%_75%_/_0.2)] transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden relative" style={{ backgroundColor: 'hsl(175, 40%, 92%)' }}>
                  {/* Teal duotone — pastel teal tones, no black */}
                  <div className="absolute inset-0 z-[1]" style={{ backgroundColor: 'hsl(175, 35%, 60%)', mixBlendMode: 'color' }} />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="object-cover w-full h-full"
                    style={{ filter: 'grayscale(1) brightness(1.4) contrast(0.75)' }}
                    loading="lazy"
                    width={600}
                    height={450}
                  />
                  <div className="absolute inset-0 z-[2] bg-foreground/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <p className="text-sm text-white text-center font-normal leading-relaxed">
                      {project.overlay}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-playfair font-bold italic text-lg text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-xs uppercase tracking-wider text-primary mt-1">
                    {project.category}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

      </div>
    </section>
  );
}
