import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoadingScreen from './components/LoadingScreen'
import BubbleMenu from './components/BubbleMenu'
import Hero from './components/Hero'

import About from './components/About'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import AboutTeaser from './components/AboutTeaser'
import BookBanner from './components/BookBanner'
import Podcast from './components/Podcast'
import FeaturedIn from './components/FeaturedIn'
import Testimonials from './components/Testimonials'
import CTABand from './components/CTABand'
import Footer from './components/Footer'

// Pages
import AboutPage from './pages/AboutPage'
import FreelancingPage from './pages/FreelancingPage'
import BookPage from './pages/BookPage'
import SpeakingPage from './pages/SpeakingPage'
import ContactPage from './pages/ContactPage'
import BuyPage from './pages/BuyPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import RefundPage from './pages/RefundPage'
import CookiesPage from './pages/CookiesPage'
import NotFoundPage from './pages/NotFoundPage'

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <AboutTeaser />
      <BookBanner />
      <Podcast />
      <FeaturedIn />
      <Testimonials />
      <CTABand />
    </>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      {!isLoading && <BubbleMenu />}
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/freelancing" element={<FreelancingPage />} />
          <Route path="/the-book" element={<BookPage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/speaking" element={<SpeakingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/refund-policy" element={<RefundPage />} />
          <Route path="/cookies-policy" element={<CookiesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
