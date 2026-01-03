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
import DashboardPage from './pages/DashboardPage'
import ProductManagementPage from './pages/ProductManagementPage'
import PromoManagementPage from './pages/PromoManagementPage'
import EventManagementPage from './pages/EventManagementPage'
import SalesDataPage from './pages/SalesDataPage'
import DoctorProfilePage from './pages/DoctorProfilePage'
import UserManagementPage from './pages/UserManagementPage'
import TreatmentReservationPage from './pages/TreatmentReservationPage'
import ScheduleReservationPage from './pages/ScheduleReservationPage'
import ProductCategoryPage from './pages/ProductCategoryPage'
import TestimonialManagementPage from './pages/TestimonialManagementPage'
import ClinicProfilePage from './pages/ClinicProfilePage'

const App = () => {
  // Initialize from localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))

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
      <Route path="/promo-detail" element={<PromoDetailPage isLoggedIn={isLoggedIn} />} />
      <Route path="/product" element={<ProductsPage isLoggedIn={isLoggedIn} />} />
      <Route path="/event" element={<EventPage isLoggedIn={isLoggedIn} />} />
      <Route path="/event-detail" element={<EventDetailPage isLoggedIn={isLoggedIn} />} />
      <Route path="/cart" element={<CartPage isLoggedIn={isLoggedIn} />} />
      <Route path="/about" element={<AboutPage isLoggedIn={isLoggedIn} />} />
      <Route path="/doctors" element={<DoctorsPage isLoggedIn={isLoggedIn} />} />
      <Route path="/testimonial" element={<TestimonialPage isLoggedIn={isLoggedIn} />} />
      <Route path="/testimonial-detail" element={<TestimonialDetailPage isLoggedIn={isLoggedIn} />} />
      <Route path="/reservation" element={<ReservationPage isLoggedIn={isLoggedIn} />} />
      <Route path="/doctor-detail" element={<DoctorDetailPage isLoggedIn={isLoggedIn} />} />
      <Route path="/dashboard" element={<DashboardPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
      <Route path="/products" element={<ProductManagementPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
      <Route path="/promos" element={<PromoManagementPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
      <Route path="/events" element={<EventManagementPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
      <Route path="/sales" element={<SalesDataPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
      <Route path="/doctor" element={<DoctorProfilePage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
      <Route path="/users" element={<UserManagementPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
      <Route path="/reservations" element={<TreatmentReservationPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
      <Route path="/schedules" element={<ScheduleReservationPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
      <Route path="/categories" element={<ProductCategoryPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
      <Route path="/testimonials" element={<TestimonialManagementPage isLoggedIn={isLoggedIn} onLogout={handleLogout} />} />
      <Route path="/clinic-profile" element={<ClinicProfilePage isLoggedIn={isLoggedIn} onL ogout={handleLogout} />} />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
