import LegalLayout from '../components/LegalLayout';

export default function CookiesPage() {
  return (
    <LegalLayout
      eyebrow="Transparency"
      title="Cookies Policy"
      updated="1 July 2026"
      intro="This policy explains what cookies are, which ones this site uses, and how you can manage them."
      sections={[
        { h: 'What Are Cookies', p: [
          'Cookies are small text files stored on your device when you visit a website. They help the site remember you and work smoothly.',
        ]},
        { h: 'Cookies I Use', p: [
          'Essential cookies keep basic features working, such as remembering your menu state.',
          'Analytics cookies help me understand which pages are popular so I can improve the site.',
        ]},
        { h: 'Third-Party Cookies', p: [
          'Embedded third-party services such as Razorpay (payments), YouTube and Spotify (media), and audiobook platforms may set their own cookies.',
          'I do not control these; please review their policies if relevant.',
        ]},
        { h: 'Managing Cookies', p: [
          'You can accept or block cookies in your browser settings. Blocking some cookies may affect how parts of the site function.',
        ]},
      ]}
    />
  );
}
