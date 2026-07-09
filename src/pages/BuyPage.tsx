import { useState } from 'react';
import { BookHeart, BookOpen, Headphones, Package, User, MapPin, MessageSquare, Check, Star, ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import useSEO from '../hooks/useSEO';
import SectionHeader from '../components/SectionHeader';
import FadeUp from '../components/FadeUp';
import AbstractDeco from '../components/AbstractDeco';
import SplineBook from '../components/SplineBook';
import CountUp from '../components/CountUp';
import Marquee from '../components/Marquee';
import { createOrder, checkout, verifyPayment } from '../lib/razorpay';

// Paperback price in INR. (Currently using Razorpay TEST keys — swap to LIVE keys for real sales.)
const BOOK_PRICE_INR = 549;

const bookDetails = [
  { icon: BookHeart, label: 'Title', value: "The Freelancer's Mindset" },
  { icon: User, label: 'Author', value: 'Meenakshi Girish (Hey, that\'s me!)' },
  { icon: Package, label: 'Format', value: 'Paperback (Audiobook in the oven)' },
  { icon: MessageSquare, label: 'Language', value: 'English' },
  { icon: MapPin, label: 'Available For', value: 'India (shipping)' },
];

const copyOptions = [1, 2, 3, 5];

export default function BuyPage() {
  useSEO({
    title: "Buy The Freelancer's Mindset — Meenakshi Girish",
    description: "Buy The Freelancer's Mindset by Meenakshi Girish. Order a signed paperback shipped to your door or get the Kindle edition instantly on Amazon.",
    path: '/buy',
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'paid' | 'error'>('idle');
  const [copies, setCopies] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [paymentId, setPaymentId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget;
    // Read + sanitize: strip control chars / angle brackets and cap length.
    // (Razorpay rejects note values over 256 chars; also defence-in-depth
    // in case these are ever rendered back in an admin view later.)
    const field = (id: string) => (form.querySelector(`#${id}`) as HTMLInputElement | null)?.value.trim() ?? '';
    const clean = (val: string, max: number) => val.replace(/[<>]/g, '').trim().slice(0, max);
    const name = clean(field('buy-name'), 100) || 'Customer';
    const email = clean(field('buy-email'), 254);
    const amount = BOOK_PRICE_INR * copies * 100; // ₹ → paise (Razorpay uses paise)

    setStatus('processing');
    setErrorMsg('');
    try {
      const order = await createOrder({
        amount,
        receipt: `book_x${copies}_${Date.now()}`,
        // Stored against the order in your Razorpay dashboard so you can fulfil it.
        notes: {
          copies: String(copies),
          name,
          email,
          address: clean([field('buy-addr1'), field('buy-addr2')].filter(Boolean).join(', '), 256),
          city: clean(field('buy-city'), 100),
          state: clean(field('buy-state'), 100),
          pin: clean(field('buy-pin'), 10),
          country: clean(field('buy-country'), 50),
          request: clean(field('buy-notes'), 200),
        },
      });
      const result = await checkout({
        orderId: order.id,
        amount,
        name: "The Freelancer's Mindset",
        prefillName: name,
        email,
        description: `${copies} ${copies > 1 ? 'copies' : 'copy'} of The Freelancer's Mindset`,
      });
      const verification = await verifyPayment(result);
      if (verification?.verified) {
        setPaymentId(result.razorpay_payment_id);
        setStatus('paid');
      } else {
        setErrorMsg("Payment couldn't be verified. If you were charged, email meenakshigirish31@gmail.com with your details.");
        setStatus('error');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (/cancel/i.test(msg)) {
        // user dismissed the modal — quietly return to the form
        setStatus('idle');
      } else {
        setErrorMsg(msg || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Order Your Copy"
        title="Get Your Hands on The Freelancer's Mindset"
        subtitle="Fill out the boring form below, pay the piper, and I'll make sure a fresh copy heads your way. Easy!"
      />

      {/* ─── Stats strip ─── */}
      <section className="py-12 bg-card border-y border-border/30 relative overflow-hidden">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <CountUp end={200} suffix="+" label="Copies Sold" />
            <CountUp end={50} suffix="+" label="5-Star Reviews" />
            <CountUp end={100} suffix="%" label="Handwritten Notes" />
          </div>
        </div>
      </section>

      {/* ─── Book Details — Horizontal strip with TiltCard book visual ─── */}
      <section className="bg-background py-24 lg:py-32 relative overflow-hidden">
        <AbstractDeco src="/abstract/leaf-1.svg" className="-right-20 -top-10 w-[300px] h-[300px]" opacity={0.9} style={{ transform: 'rotate(20deg)' }} />
        <AbstractDeco src="/abstract/teal-shape-2.svg" className="-left-32 bottom-10 w-[400px] h-[400px]" opacity={0.9} hideMobile />

        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[470px_1fr] gap-10 items-center">
            {/* 3D Interactive Spline Book */}
            <FadeUp>
              <div className="flex justify-center lg:justify-start">
                <div className="w-full max-w-[350px] md:max-w-[450px]">
                  <SplineBook />
                </div>
              </div>
            </FadeUp>

            {/* Book details in a clean list */}
            <FadeUp delay={0.1}>
              <h3 className="font-bold italic text-foreground mb-6" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.3rem' }}>
                Quick Details
              </h3>
              <div className="space-y-3">
                {bookDetails.map((d) => {
                  const Icon = d.icon;
                  return (
                    <div key={d.label} className="flex items-center gap-4 bg-card rounded-xl p-4 border border-border/30">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs uppercase tracking-wider text-primary font-medium">{d.label}</span>
                        <p className="text-foreground text-sm font-medium truncate">{d.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <a href="https://amzn.in/d/06pnDdVe" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wide rounded-full px-6 py-3 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200">
                <BookOpen size={16} /> Prefer Kindle? Get the Digital Edition <ArrowRight size={14} />
              </a>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─── Marquee band — social proof ─── */}
      <section className="py-5 border-y border-border/30 overflow-hidden bg-card">
        <Marquee speed={25} direction="left" pauseOnHover>
          {['Real stories', 'Practical advice', 'Original artworks', 'No-BS guidance', 'Community interviews', 'Freelancing frameworks'].map((word) => (
            <span
              key={word}
              className="inline-flex items-center gap-2 mx-6 text-primary/50 text-sm font-bold italic"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              <Star size={12} className="text-primary/30" />
              {word}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ─── Order Form — Full-width with stepped sections ─── */}
      <section className="py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(170deg, hsl(175 30% 92%) 0%, hsl(40 30% 97%) 100%)' }}>
        <AbstractDeco src="/abstract/brown-shape-1.svg" className="-right-28 -top-16 w-[350px] h-[350px]" opacity={0.9} hideMobile />
        <AbstractDeco src="/abstract/leaf-2.svg" className="-left-16 bottom-20 w-[280px] h-[280px]" opacity={0.9} style={{ transform: 'rotate(20deg)' }} hideMobile />

        <div className="max-w-[700px] mx-auto px-6 lg:px-10 relative z-10">
          <SectionHeader label="Order form" heading="The Logistics (Your Details)" />
          <FadeUp>
            {status === 'paid' ? (
              <div className="bg-white rounded-[2rem] p-10 border border-border/50 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Check size={28} className="text-primary" />
                </div>
                <h3 className="font-bold italic text-foreground mb-2" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.3rem' }}>
                  Payment successful! 🎉
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-md mx-auto">
                  Thank you! Your order is confirmed{paymentId ? <> (Ref <strong>{paymentId}</strong>)</> : null}. I'll email you a confirmation shortly. Questions? Email me at <strong>meenakshigirish31@gmail.com</strong>.
                </p>
                <button onClick={() => { setStatus('idle'); setPaymentId(''); }} className="mt-6 text-primary text-sm font-medium hover:underline">
                  Place another order
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-8 md:p-10 border border-border/50 shadow-[0_8px_30px_hsl(30_15%_80%_/_0.15)] space-y-8">
                {/* Step 1: Personal Info */}
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border/30">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs" style={{ fontFamily: 'var(--font-playfair)' }}>1</div>
                    <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Personal Information</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="buy-name" className="block text-foreground text-sm font-medium mb-1.5">Full Name *</label>
                      <input id="buy-name" type="text" required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="buy-email" className="block text-foreground text-sm font-medium mb-1.5">Email Address *</label>
                        <input id="buy-email" type="email" required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Shipping */}
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border/30">
                    <div className="w-8 h-8 rounded-full bg-[hsl(35_55%_55%)]/10 flex items-center justify-center font-bold text-xs" style={{ fontFamily: 'var(--font-playfair)', color: 'hsl(35 55% 55%)' }}>2</div>
                    <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Shipping Address</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="buy-addr1" className="block text-foreground text-sm font-medium mb-1.5">Address Line 1 *</label>
                      <input id="buy-addr1" type="text" required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label htmlFor="buy-addr2" className="block text-foreground text-sm font-medium mb-1.5">Address Line 2</label>
                      <input id="buy-addr2" type="text" className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="buy-city" className="block text-foreground text-sm font-medium mb-1.5">City *</label>
                        <input id="buy-city" type="text" required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label htmlFor="buy-state" className="block text-foreground text-sm font-medium mb-1.5">State *</label>
                        <input id="buy-state" type="text" required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                      </div>
                      <div>
                        <label htmlFor="buy-pin" className="block text-foreground text-sm font-medium mb-1.5">PIN Code *</label>
                        <input id="buy-pin" type="text" required className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="buy-country" className="block text-foreground text-sm font-medium mb-1.5">Country *</label>
                      <input id="buy-country" type="text" required defaultValue="India" className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
                    </div>
                  </div>
                </div>

                {/* Step 3: Order Details */}
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border/30">
                    <div className="w-8 h-8 rounded-full bg-[hsl(200_40%_55%)]/10 flex items-center justify-center font-bold text-xs" style={{ fontFamily: 'var(--font-playfair)', color: 'hsl(200 40% 55%)' }}>3</div>
                    <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Order Details</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="buy-copies" className="block text-foreground text-sm font-medium mb-1.5">Number of Copies *</label>
                      <select
                        id="buy-copies"
                        value={copies}
                        onChange={(e) => setCopies(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors appearance-none"
                      >
                        {copyOptions.map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? 'Copy' : 'Copies'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="buy-notes" className="block text-foreground text-sm font-medium mb-1.5">Special Requests</label>
                      <input
                        id="buy-notes"
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-border/60 bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                        placeholder='E.g., "Sign it!" or "Draw a cat"'
                      />
                    </div>
                  </div>
                </div>

                {status === 'error' && (
                  <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                    {errorMsg}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <span className="text-sm text-muted-foreground">Total payable</span>
                  <span className="font-bold text-foreground" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.15rem' }}>
                    ₹{BOOK_PRICE_INR * copies}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={status === 'processing'}
                  className="w-full bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wide rounded-full px-10 py-4 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200 inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {status === 'processing' ? (
                    <><span className="inline-block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" /> Processing…</>
                  ) : (
                    <><Check size={16} /> Pay ₹{BOOK_PRICE_INR * copies} & Complete Order</>
                  )}
                </button>
              </form>
            )}
          </FadeUp>
        </div>
      </section>

      {/* ─── Audiobook Banner — Different from Book page version ─── */}
      <section className="bg-background py-16 lg:py-20 px-6 relative overflow-hidden">
        <AbstractDeco src="/abstract/brown-shape-2.svg" className="-left-20 -bottom-16 w-[300px] h-[300px]" opacity={0.9} />

        <div className="max-w-[800px] mx-auto px-6 lg:px-10 relative z-10">
          <FadeUp>
            <div className="rounded-[2rem] p-8 md:p-10 border border-[hsl(35_40%_70%)]/40 shadow-[0_4px_20px_hsl(30_15%_80%_/_0.15)] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, hsl(40 40% 92%) 0%, hsl(35 35% 88%) 100%)' }}>
              <AbstractDeco src="/abstract/leaf-1.svg" className="-right-10 -bottom-8 w-[180px] h-[180px]" opacity={0.25} style={{ transform: 'rotate(-20deg)' }} />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Headphones size={28} className="text-primary" />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h3 className="font-bold italic text-foreground mb-2" style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.1rem' }}>
                    Hate reading? The audiobook is coming soon.
                  </h3>
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    Drop your email and I'll let you know when it drops!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full sm:w-48 px-4 py-3 rounded-full border border-border/60 bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                  <button className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wide rounded-full px-6 py-3 hover:bg-[hsl(175_35%_50%)] hover:-translate-y-px hover:shadow-lg transition-all duration-200">
                    Keep Me Posted
                  </button>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
