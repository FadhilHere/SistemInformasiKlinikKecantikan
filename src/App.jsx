import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegistrationPage from './pages/RegistrationPage'
import PromoPage from './pages/PromoPage'
import PromoDetailPage from './pages/PromoDetailPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import EventPage from './pages/EventPage'
import EventDetailPage from './pages/EventDetailPage'
import CartPage from './pages/CartPage'
import AboutPage from './pages/AboutPage'
import ReservationPage from './pages/ReservationPage'
import ProfilePage from './pages/ProfilePage'
import DoctorDetailPage from './pages/DoctorDetailPage'
import DoctorsPage from './pages/DoctorsPage'
import TestimonialPage from './pages/TestimonialPage'
import TestimonialDetailPage from './pages/TestimonialDetailPage'

const App = () => {
  // No more activePage state
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} />} />
      <Route path="/login" element={
        isLoggedIn ? <Navigate to="/" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
      } />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/profile" element={
        isLoggedIn ? <ProfilePage isLoggedIn={isLoggedIn} onLogout={handleLogout} /> : <Navigate to="/login" />
      } />
      <Route path="/promo" element={<PromoPage isLoggedIn={isLoggedIn} />} />
      <Route path="/promo/:id" element={<PromoDetailPage isLoggedIn={isLoggedIn} />} />
      <Route path="/products" element={<ProductsPage isLoggedIn={isLoggedIn} />} />
      <Route path="/products/:id" element={<ProductDetailPage isLoggedIn={isLoggedIn} />} />
      <Route path="/event" element={<EventPage isLoggedIn={isLoggedIn} />} />
      <Route path="/event/:id" element={<EventDetailPage isLoggedIn={isLoggedIn} />} />
      <Route path="/cart" element={<CartPage isLoggedIn={isLoggedIn} />} />
      <Route path="/about" element={<AboutPage isLoggedIn={isLoggedIn} />} />
      <Route path="/doctors" element={<DoctorsPage isLoggedIn={isLoggedIn} />} />
      <Route path="/testimonials" element={<TestimonialPage isLoggedIn={isLoggedIn} />} />
      <Route path="/testimonials/:id" element={<TestimonialDetailPage isLoggedIn={isLoggedIn} />} />
      <Route path="/reservation" element={<ReservationPage isLoggedIn={isLoggedIn} />} />
      <Route path="/doctor-detail/:id" element={<DoctorDetailPage isLoggedIn={isLoggedIn} />} />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
