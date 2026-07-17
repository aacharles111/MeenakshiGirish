import LegalLayout from '../components/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Your Privacy"
      title="Privacy Policy"
      updated="1 July 2026"
      intro="Your trust matters. This policy explains what information I collect, why, and how I keep it safe."
      sections={[
        { h: 'What I Collect', p: [
          'When you fill in a contact or order form, I collect the details you provide, such as your name, email address, and shipping details.',
          <>Payments are processed by Razorpay, the payment processor, which handles your card, UPI, and banking details — I never see or store that information. See Razorpay&rsquo;s <a href="https://razorpay.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Privacy Policy</a> and <a href="https://razorpay.com/terms-of-use/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Terms of Use</a>.</>,
        ]},
        { h: 'How I Use It', p: [
          'To respond to your enquiries, deliver book orders, provide mentoring sessions, and send updates you have asked for.',
          'To improve the website and understand what content works, using privacy-friendly analytics.',
        ]},
        { h: 'Cookies', p: [
          'This site uses cookies to remember preferences and measure traffic. See the Cookies Policy for details.',
        ]},
        { h: 'Sharing Your Data', p: [
          'I never sell your data. I only share the minimum needed to fulfil orders (for example, shipping details with a delivery partner) or as required by law.',
        ]},
        { h: 'Your Rights', p: [
          'You can ask to see, correct, or delete the personal information I hold about you at any time. Just email meenakshigirish31@gmail.com.',
        ]},
      ]}
    />
  );
}
