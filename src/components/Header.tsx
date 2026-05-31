import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

const navItems = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "FREELANCING", href: "/freelancing" },
  { label: "THE BOOK", href: "/the-book" },
  { label: "SPEAKING & MENTORING", href: "/speaking" },
  { label: "CONTACT", href: "/contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Only use white-on-transparent for homepage hero
  const isHomePage = location.pathname === '/';
  const useDarkNav = !isHomePage || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full h-20 transition-all duration-300 ${
        useDarkNav
          ? "bg-white/70 backdrop-blur-xl shadow-[0_1px_3px_0_rgb(0_0_0/0.06)] border-b border-border/30"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto h-full flex items-center justify-between px-6 lg:px-10 max-w-[1280px]">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <img
            src="/logo.svg"
            alt="Meenakshi Girish"
            className="h-10 w-auto transition-all duration-300"
            style={{
              filter: useDarkNav ? 'none' : 'brightness(0) invert(1)',
            }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`font-medium text-xs uppercase tracking-wider transition-colors duration-200 ${
                location.pathname === item.href
                  ? useDarkNav
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-white border-b-2 border-white pb-1'
                  : useDarkNav
                    ? 'text-foreground/80 hover:text-primary'
                    : 'text-white/80 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          to="/buy"
          className="hidden lg:inline-flex items-center bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-6 py-2.5 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200"
        >
          BUY THE BOOK
          <ArrowRight size={14} className="ml-1.5" />
        </Link>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full border transition-colors duration-300 ${useDarkNav ? 'border-border' : 'border-white/50'}`}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? (
            <X size={20} className={useDarkNav ? 'text-foreground' : 'text-white'} />
          ) : (
            <Menu size={20} className={useDarkNav ? 'text-foreground' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg"
          >
            <div className="flex flex-col items-center justify-center gap-8 pt-24 h-full">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`font-medium text-lg uppercase tracking-wider min-h-[44px] flex items-center ${
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/buy"
                onClick={() => setIsOpen(false)}
                className="mt-4 inline-flex items-center bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wide rounded-full px-8 py-3 hover:bg-[hsl(175_35%_50%)] transition-all duration-200"
              >
                BUY THE BOOK
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
