import LegalLayout from '../components/LegalLayout';

export default function RefundPage() {
  return (
    <LegalLayout
      eyebrow="Fair & Simple"
      title="Refund Policy"
      updated="1 July 2026"
      intro="I want you to be happy with everything you get here. This policy explains how refunds and returns work."
      sections={[
        { h: 'Physical Book', p: [
          'If your copy of The Freelancer’s Mindset arrives damaged or does not reach you, email me within 7 days of delivery and I will send a replacement or issue a refund.',
          'Because books are physical goods, change-of-mind refunds are handled on a case-by-case basis — just reach out and I will do my best to help.',
        ]},
        { h: 'Digital & Audiobook', p: [
          'Digital audiobook purchases happen on third-party platforms (Audible, Storytel, Kuku FM, Apple Music) and are governed by their own refund policies.',
        ]},
        { h: 'Mentoring Sessions', p: [
          'Booked through Topmate: sessions can be rescheduled or refunded if cancelled at least 24 hours in advance.',
          'If a session could not be delivered for any reason on my end, you will receive a full refund or reschedule.',
        ]},
        { h: 'How to Request a Refund', p: [
          'Email meenakshigirish31@gmail.com with your order details and the reason for the request. Refunds are processed back to the original payment method via Razorpay within 5–7 business days.',
        ]},
      ]}
    />
  );
}
