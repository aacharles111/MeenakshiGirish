import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ExpandableCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function ExpandableCard({
  title,
  icon,
  children,
  defaultOpen = false,
}: ExpandableCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        background: 'var(--color-card, hsl(40 25% 95%))',
        borderRadius: '16px',
        border: '1px solid hsl(40 20% 85% / 0.5)',
        boxShadow: '0 2px 12px hsl(30 15% 80% / 0.12)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          padding: '20px 24px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          minHeight: '44px',
        }}
      >
        {icon && (
          <span
            style={{
              flexShrink: 0,
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'hsl(175 35% 60% / 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'hsl(175 35% 55%)',
            }}
          >
            {icon}
          </span>
        )}
        <span
          style={{
            flex: 1,
            fontFamily: 'var(--font-playfair, "Playfair Display", serif)',
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: '1.05rem',
            color: 'hsl(210 25% 15%)',
          }}
        >
          {title}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            flexShrink: 0,
            color: 'hsl(175 35% 55%)',
          }}
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 24px 20px',
                fontFamily: 'var(--font-poppins, "Poppins", sans-serif)',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                color: 'hsl(210 25% 15% / 0.75)',
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
