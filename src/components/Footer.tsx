import { Link } from 'react-router-dom';
import { Mail, Linkedin, Instagram, Youtube, Music2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import AbstractDeco from './AbstractDeco';
import siteSettings from '../content/site-settings.json';

// Map the social icon string stored in site-settings.json to a lucide icon.
// Unknown icons fall back to a generic globe-ish label-only link (none of the
// current socials hit this, but it keeps the footer robust to CMS edits).
const iconFor: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
  spotify: Music2,
};

const { email } = siteSettings.contact;
const socials = siteSettings.socials;

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
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-[13px] text-foreground/80 hover:text-primary transition-colors"
            >
              <Mail size={14} className="text-primary" />
              {email}
            </a>
          </div>

          {/* Right — Social Links */}
          <div>
            <p className="font-medium text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
              FOLLOW ME
            </p>
            <div className="flex gap-3">
              {socials.map((s, i) => {
                const Icon = iconFor[s.icon];
                return (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    className="w-9 h-9 rounded-full border border-primary/20 flex items-center justify-center text-primary/60 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                  >
                    {Icon ? <Icon size={16} /> : <span className="text-[10px] font-bold uppercase">{s.label.slice(0, 2)}</span>}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-border/50 mt-10 pt-6 flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Use</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link>
            <Link to="/cookies-policy" className="hover:text-primary transition-colors">Cookies Policy</Link>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            &copy; 2026 Meenakshi Girish. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
