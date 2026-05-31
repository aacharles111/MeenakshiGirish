import { Mail, Phone, Linkedin, Instagram, Youtube, Music2, BookOpen } from 'lucide-react';
import AbstractDeco from './AbstractDeco';

const socialLinks = [
  { icon: Linkedin, href: 'https://www.linkedin.com/in/meenakshi-girish/', title: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/meenakshigirish31/', title: 'Instagram' },
  { icon: BookOpen, href: 'https://www.instagram.com/meenugirish31/', title: 'Bookstagram' },
  { icon: Youtube, href: 'https://www.youtube.com/@TFMShortcast/videos', title: 'YouTube' },
  { icon: Music2, href: 'https://open.spotify.com/show/55C8g0qgxeROYP0X6m8inn', title: 'Spotify' },
];

export default function Footer() {
  return (
    <footer className="bg-muted py-14 relative overflow-hidden">
      {/* Abstract Decorations */}
      <AbstractDeco
        src="/abstract/leaf-1.svg"
        className="-right-16 -top-10 w-[200px] h-[200px]"
        opacity={0.9}
        style={{ transform: 'rotate(40deg)' }}
      />
      <AbstractDeco
        src="/abstract/brown-shape-2.svg"
        className="-left-28 -bottom-16 w-[300px] h-[300px]"
        opacity={0.9}
      />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
        {/* Main row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Left — Brand */}
          <div>
            <img src="/logo.svg" alt="Meenakshi Girish" className="h-10 w-auto mb-2" />
            <p className="text-xs text-muted-foreground mt-0.5">Writer. Author. Speaker. Podcaster. Professional Book Hoarder.</p>
          </div>

          {/* Center — Contact */}
          <div className="flex flex-col gap-2">
            <a
              href="mailto:meenakshigirish31@gmail.com"
              className="flex items-center gap-2 text-[13px] text-foreground/80 hover:text-primary transition-colors"
            >
              <Mail size={14} className="text-primary" />
              meenakshigirish31@gmail.com
            </a>
            <a
              href="tel:8754416226"
              className="flex items-center gap-2 text-[13px] text-foreground/80 hover:text-primary transition-colors"
            >
              <Phone size={14} className="text-primary" />
              8754416226
            </a>
          </div>

          {/* Right — Social Links */}
          <div>
            <p className="font-medium text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
              FOLLOW ME
            </p>
            <div className="flex gap-3">
              {socialLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.title}
                    className="w-9 h-9 rounded-full border border-primary/20 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-border/50 mt-10 pt-6">
          <p className="text-xs text-muted-foreground text-center">
            &copy; 2025 Meenakshi Girish. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
