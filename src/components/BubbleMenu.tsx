import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import './BubbleMenu.css';

interface NavItem {
  label: string;
  href: string;
  hoverColor: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', hoverColor: 'hsl(175 35% 55%)' },
  { label: 'About', href: '/about', hoverColor: 'hsl(35 55% 55%)' },
  { label: 'Freelancing', href: '/freelancing', hoverColor: 'hsl(200 40% 55%)' },
  { label: 'The Book', href: '/the-book', hoverColor: 'hsl(15 55% 70%)' },
  { label: 'Speaking', href: '/speaking', hoverColor: 'hsl(320 30% 55%)' },
  { label: 'Contact', href: '/contact', hoverColor: 'hsl(140 35% 55%)' },
];

export default function BubbleMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const drawerItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleNav = useCallback(
    (href: string) => {
      setIsOpen(false);
      navigate(href);
      window.scrollTo({ top: 0 });
    },
    [navigate]
  );

  // Detect if we're on homepage hero area
  const isHomePage = location.pathname === '/';
  const [isInHero, setIsInHero] = useState(true);

  // Scroll listener for hero detection and shrink effect
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
      // Hero is roughly viewport height
      setIsInHero(window.scrollY < window.innerHeight * 0.85);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animate mobile drawer items when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const items = drawerItemsRef.current.filter(Boolean) as HTMLButtonElement[];
      gsap.set(items, { opacity: 0, y: 20, scale: 0.95 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.04,
        duration: 0.35,
        ease: 'back.out(1.4)',
        delay: 0.08,
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key closes drawer
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* ── Top Navigation Bar ── */}
      <header
        className={`navbar ${isScrolled ? 'is-scrolled' : ''} ${isHomePage && isInHero ? 'is-hero' : ''}`}
        role="banner"
      >
        {/* Logo */}
        <button
          type="button"
          className="navbar-logo"
          onClick={() => handleNav('/')}
          aria-label="Go to homepage"
        >
          <img src="/logo.svg" alt="Meenakshi Girish" />
        </button>

        {/* Desktop nav links */}
        <nav className="navbar-links" role="navigation" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.href}
              type="button"
              className={`navbar-link ${
                location.pathname === item.href ? 'is-active' : ''
              }`}
              onClick={() => handleNav(item.href)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop CTA */}
        <button
          type="button"
          className="navbar-cta"
          onClick={() => handleNav('/buy')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
          Buy the Book
        </button>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={`navbar-hamburger ${isOpen ? 'is-open' : ''}`}
          onClick={handleToggle}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
        >
          <div className={`navbar-hamburger-icon ${isOpen ? 'is-open' : ''}`}>
            <span />
            <span />
            <span />
          </div>
        </button>
      </header>

      {/* ── Mobile Drawer ── */}
      {isOpen && (
        <div
          className="navbar-drawer"
          role="navigation"
          aria-label="Mobile navigation"
        >
          {navItems.map((item, i) => (
            <button
              key={item.href}
              ref={(el) => { drawerItemsRef.current[i] = el; }}
              type="button"
              className={`navbar-drawer-item ${
                location.pathname === item.href ? 'is-active' : ''
              }`}
              onClick={() => handleNav(item.href)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = item.hoverColor;
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.borderColor = item.hoverColor;
              }}
              onMouseLeave={(e) => {
                const isActive = location.pathname === item.href;
                e.currentTarget.style.background = isActive
                  ? 'hsl(175 35% 60% / 0.08)'
                  : '#ffffff';
                e.currentTarget.style.color = isActive
                  ? 'hsl(175 35% 45%)'
                  : 'hsl(210 25% 15%)';
                e.currentTarget.style.borderColor = isActive
                  ? 'hsl(175 35% 60%)'
                  : 'hsl(40 20% 88%)';
              }}
            >
              {item.label}
            </button>
          ))}

          {/* CTA in drawer */}
          <button
            ref={(el) => { drawerItemsRef.current[navItems.length] = el; }}
            type="button"
            className="navbar-drawer-item navbar-drawer-item--cta"
            onClick={() => handleNav('/buy')}
          >
            Buy the Book
          </button>
        </div>
      )}
    </>
  );
}
