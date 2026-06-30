import LegalLayout from '../components/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout
      eyebrow="The Fine Print"
      title="Terms of Use"
      updated="1 July 2026"
      intro="Welcome to meenakshigirish.com. By using this website or buying anything from it, you agree to the terms below. I have tried to keep them human-readable."
      sections={[
        { h: 'Using This Site', p: [
          'This website is run by Meenakshi Girish ("I", "me"). By accessing the site you agree to use it lawfully and not to copy, scrape, or misuse its content.',
          'All written content, artwork, the book, and brand materials are my intellectual property. Please do not reproduce them without written permission.',
        ]},
        { h: 'Book & Service Purchases', p: [
          'When you buy The Freelancer’s Mindset or book a service, you agree to provide accurate information and complete payment.',
          'Payments are processed securely through Razorpay. I do not store your card or banking details on this site.',
        ]},
        { h: 'Third-Party Links', p: [
          'The site links to third-party platforms such as Razorpay, Amazon Kindle, Audible, Storytel, Apple Music, and Kuku FM for purchases and audiobook streaming.',
          'I am not responsible for the content, availability, or policies of those external platforms.',
        ]},
        { h: 'Disclaimer', p: [
          'The content on this site is provided for general information and is my honest opinion and experience. It is not professional or legal advice.',
          'Results from my book or mentoring depend on your own effort and circumstances.',
        ]},
        { h: 'Changes to These Terms', p: [
          'I may update these terms from time to time. Continued use of the site after changes means you accept the updated terms.',
        ]},
      ]}
    />
  );
}
