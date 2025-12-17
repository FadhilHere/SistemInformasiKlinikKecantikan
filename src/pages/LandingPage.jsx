import Navbar from '../fragments/Navbar'
import HeroSection from '../fragments/HeroSection'
import DoctorsSection from '../fragments/DoctorsSection'
import TreatmentsSection from '../fragments/TreatmentsSection'
import ProductShowcase from '../fragments/ProductShowcase'
import ResultsShowcase from '../fragments/ResultsShowcase'
import AdvantagesSection from '../fragments/AdvantagesSection'
import ReservationBanner from '../fragments/ReservationBanner'
import Footer from '../fragments/Footer'

const LandingPage = ({
  onShowLogin,
  onShowRegister,
  onShowLanding,
  onNavigate
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar
        onShowLogin={onShowLogin}
        onShowRegister={onShowRegister}
        onShowLanding={onShowLanding}
        activeRoute="landing"
        onNavigate={onNavigate}
      />
      
      <HeroSection />

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12">
        <DoctorsSection />
      </main>

      <TreatmentsSection />

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12">
        <ProductShowcase />
      </div>

      <ResultsShowcase />

      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12">
        <AdvantagesSection />
      </div>

      <Footer />

      {/* Floating Buttons */}
      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
        <button 
          onClick={scrollToTop}
          className="flex h-10 w-10 items-center justify-center border-2 border-[#4aa731] bg-white text-[#4aa731] shadow-lg transition hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
        <a 
          href="https://wa.me/628116922551" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 bg-[#4aa731] px-5 py-2.5 text-white shadow-lg transition hover:bg-[#3d8b29]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          <span className="text-lg font-medium">WhatsApp</span>
        </a>
      </div>
    </div>
  )
}

export default LandingPage
