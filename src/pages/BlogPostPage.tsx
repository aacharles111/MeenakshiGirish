import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, User } from 'lucide-react';
import DOMPurify from 'dompurify';

import blogsData from '../content/blogs.json';
import type { Blog } from '../lib/contentTypes';
import NotFoundPage from './NotFoundPage';
import FadeUp from '../components/FadeUp';
import AbstractDeco from '../components/AbstractDeco';
import useSEO from '../hooks/useSEO';

/** All published blogs — drafts and unknown slugs are never public. */
const published: Blog[] = (blogsData.blogs as Blog[]).filter((b) => b.status === 'published');

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? published.find((b) => b.slug === slug) : undefined;

  // No matching published post (draft, unknown slug, or missing param) → 404.
  if (!post) {
    return <NotFoundPage />;
  }

  // CRITICAL XSS gate: DOMPurify.sanitize MUST wrap the body HTML before it is
  // handed to dangerouslySetInnerHTML. Never render post.body raw.
  const sanitizedBody = DOMPurify.sanitize(post.body);

  return (
    <BlogPostView
      post={post}
      sanitizedBody={sanitizedBody}
      formattedDate={formatDate(post.publishedAt)}
    />
  );
}

interface BlogPostViewProps {
  post: Blog;
  sanitizedBody: string;
  formattedDate: string;
}

/**
 * Split out so the hook is called unconditionally on every render (the post
 * lookup above returns early with <NotFoundPage/> when there is no match, and
 * NotFoundPage calls its own hooks). SEO values come from the resolved post.
 */
function BlogPostView({ post, sanitizedBody, formattedDate }: BlogPostViewProps) {
  useSEO({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    image: post.banner,
    type: 'article',
    publishedTime: post.publishedAt,
    author: post.author,
  });

  return (
    <>
      {/* ─── Banner ─── */}
      <header className="relative">
        <div className="relative h-[42vh] min-h-[280px] max-h-[460px] w-full overflow-hidden bg-muted">
          <img
            src={post.banner}
            alt={post.bannerAlt || post.title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, hsl(210 25% 15% / 0.15) 0%, hsl(210 25% 15% / 0.55) 100%)',
            }}
          />
        </div>

        {/* Back link over banner */}
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="max-w-3xl mx-auto px-6">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-white/90 text-xs font-semibold uppercase tracking-wide hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Blog
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Article body ─── */}
      <article className="bg-background relative overflow-hidden">
        <AbstractDeco
          src="/abstract/leaf-1.svg"
          className="-right-24 top-10 w-[260px] h-[260px]"
          opacity={0.9}
          hideMobile
        />

        <div className="max-w-3xl mx-auto px-6 py-16 lg:py-20 relative z-10">
          <FadeUp>
            <h1
              className="font-bold italic text-foreground leading-tight mb-5"
              style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}
            >
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-10 pb-8 border-b border-border/60">
              <span className="inline-flex items-center gap-1.5">
                <User size={14} className="text-primary" />
                {post.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} className="text-primary" />
                <time dateTime={post.publishedAt}>{formattedDate}</time>
              </span>
            </div>

            {/* Authoritative sanitized body — .prose-cms scopes the typography. */}
            <div
              className="prose-cms"
              dangerouslySetInnerHTML={{ __html: sanitizedBody }}
            />

            <div className="mt-12 pt-8 border-t border-border/60">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wide rounded-full px-7 py-3 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200"
              >
                <ArrowLeft size={15} />
                Back to Blog
              </Link>
            </div>
          </FadeUp>
        </div>
      </article>
    </>
  );
}
