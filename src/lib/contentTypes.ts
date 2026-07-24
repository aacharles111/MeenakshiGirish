// src/lib/contentTypes.ts — imported by all content consumers
export interface Blog {
  id: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  banner: string;
  bannerAlt: string;
  body: string;
  status: 'draft' | 'published';
  publishedAt: string;
  updatedAt: string;
  author: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface FeaturedItem {
  id: string;
  label: string;
  url: string;
  // Optional press headline rendered as the big italic title (preserves the
  // 8 real headlines from the previous hardcoded FeaturedIn). May be empty
  // for items that only have a source label.
  title?: string;
}

export interface SiteSettings {
  book: { priceInr: number; title: string; buyCtaLabel: string };
  contact: { email: string };
  socials: { label: string; url: string; icon: 'linkedin' | 'instagram' | 'youtube' | 'spotify' }[];
}
