import Navbar from '../fragments/Navbar'
import HeroSection from '../fragments/HeroSection'
import DoctorsSection from '../fragments/DoctorsSection'
import TreatmentsSection from '../fragments/TreatmentsSection'
import ProductShowcase from '../fragments/ProductShowcase'
import ResultsShowcase from '../fragments/ResultsShowcase'
import AdvantagesSection from '../fragments/AdvantagesSection'
import ReservationBanner from '../fragments/ReservationBanner'
import Footer from '../fragments/Footer'

const LandingPage = ({ onShowLogin, onShowRegister, onShowLanding }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onShowLogin={onShowLogin}
        onShowRegister={onShowRegister}
        onShowLanding={onShowLanding}
      />
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-12">
        <HeroSection />
        <DoctorsSection />
        <TreatmentsSection />
        <ProductShowcase />
        <ResultsShowcase />
        <ReservationBanner />
        <AdvantagesSection />
      </main>
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <Footer />
      </div>
    </div>
  )
}

export default LandingPage
