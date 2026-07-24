import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';

import blogsData from '../content/blogs.json';
import type { Blog } from '../lib/contentTypes';
import PageHero from '../components/PageHero';
import SectionHeader from '../components/SectionHeader';
import FadeUp from '../components/FadeUp';
import AbstractDeco from '../components/AbstractDeco';
import useSEO from '../hooks/useSEO';

/** Published blogs, newest first. Recomputed at module load (build-time JSON). */
const published: Blog[] = (blogsData.blogs as Blog[])
  .filter((b) => b.status === 'published')
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogListPage() {
  useSEO({
    title: 'Blog — Meenakshi Girish',
    description:
      "Essays and notes on freelance writing, content strategy, books and the creative life — from Meenakshi Girish, author of The Freelancer's Mindset.",
    path: '/blog',
  });

  // 0 published → tasteful "coming soon" hero (nav/footer still render).
  if (published.length === 0) {
    return (
      <>
        <PageHero
          eyebrow="From the desk"
          title="The Blog, Coming Soon"
          subtitle="I am sharpening my pencils and lining up the first essays. Pop back shortly for notes on freelance writing, content strategy, and the messy, marvellous creative life."
        />
        <section className="bg-background py-20 lg:py-28 relative overflow-hidden">
          <AbstractDeco
            src="/abstract/leaf-1.svg"
            className="-right-20 -top-10 w-[300px] h-[300px]"
            opacity={0.9}
            style={{ transform: 'rotate(25deg)' }}
          />
          <AbstractDeco
            src="/abstract/brown-shape-2.svg"
            className="-left-16 bottom-0 w-[220px] h-[220px]"
            opacity={0.9}
          />
          <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
            <FadeUp>
              <p
                className="text-foreground/75 leading-relaxed"
                style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)' }}
              >
                No posts are live just yet. Meanwhile, wander over to{' '}
                <Link
                  to="/the-book"
                  className="text-primary underline underline-offset-2 hover:text-[hsl(175_35%_45%)] transition-colors"
                >
                  the book
                </Link>{' '}
                or{' '}
                <Link
                  to="/freelancing"
                  className="text-primary underline underline-offset-2 hover:text-[hsl(175_35%_45%)] transition-colors"
                >
                  my services
                </Link>{' '}
                — I will have something fresh for you here soon.
              </p>
            </FadeUp>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="From the desk"
        title="The Blog"
        subtitle="Notes on freelance writing, content strategy, books, and the messy, marvellous creative life."
      />

      <section className="bg-background py-20 lg:py-28 relative overflow-hidden">
        <AbstractDeco
          src="/abstract/teal-shape-1.svg"
          className="-left-24 -top-16 w-[320px] h-[320px]"
          opacity={0.9}
          hideMobile
        />
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="Latest" heading="Recent Posts" align="left" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {published.map((post, i) => (
              <FadeUp key={post.id} delay={i * 0.08}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    <img
                      src={post.banner}
                      alt={post.bannerAlt || post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <CalendarDays size={13} />
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                    </div>
                    <h3
                      className="font-bold italic text-foreground mb-2 leading-snug"
                      style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.2rem' }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wide group-hover:gap-2.5 transition-all">
                      Read more
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
