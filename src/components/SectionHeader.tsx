import { Leaf } from 'lucide-react';

interface SectionHeaderProps {
  label: string;
  heading: string;
  align?: 'center' | 'left';
}

export default function SectionHeader({ label, heading, align = 'center' }: SectionHeaderProps) {
  const isCenter = align === 'center';
  return (
    <div className={`${isCenter ? 'text-center' : 'text-left'} mb-14`}>
      <div className={`flex items-center ${isCenter ? 'justify-center' : 'justify-start'} gap-2 font-medium text-xs uppercase tracking-[0.15em] text-primary`}>
        <Leaf size={14} />
        <span>{label}</span>
      </div>
      <h2
        className="font-playfair font-bold italic text-foreground mt-2 leading-tight"
        style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
        }}
      >
        {heading}
      </h2>
    </div>
  );
}
