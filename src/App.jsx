import { useState, useEffect } from 'react'
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
import AuditLogPage from './pages/AuditLogPage'
import ErrorPage from './pages/ErrorPage'
import { apiFetch } from './lib/api'
import ErrorBoundary from './components/ErrorBoundary'
import ApiErrorListener from './components/ApiErrorListener'

const App = () => {
  // Initialize state based on token existence
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const resolveUser = (payload) => {
    if (!payload) return null
    return payload?.data?.user || payload?.user || payload?.data || payload
  }

  const resolveRole = (user) => {
    const role =
      user?.role ||
      user?.jenisUser ||
      user?.tipe ||
      user?.data?.role ||
      user?.user?.role ||
      null
    return role ? String(role).toLowerCase() : null
  }

  const fetchMe = async () => {
    try {
      const me = await apiFetch('/api/me')
      const user = resolveUser(me)
      if (user) {
        setIsLoggedIn(true)
        setUserRole(resolveRole(user))
      } else {
        setIsLoggedIn(false)
        setUserRole(null)
      }
    } catch (error) {
      setIsLoggedIn(false)
      setUserRole(null)
    } finally {
      setIsAuthLoading(false)
    }
  }

  useEffect(() => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    } catch {
      // Ignore if storage is unavailable.
    }
    fetchMe()
  }, [])

  const handleLoginSuccess = async (user) => {
    if (user) {
      setIsLoggedIn(true)
      setUserRole(resolveRole(user))
      return
    }
    await fetchMe()
  }

  const handleLogout = () => {
    apiFetch('/api/logout', { method: 'POST' }).catch(() => { })
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
    } catch {
      // Ignore if storage is unavailable.
    }
    setIsLoggedIn(false)
    setUserRole(null)
  }

  // Helper for Admin Only Routes
  const AdminRoute = ({ children }) => {
    if (isAuthLoading) return null
    if (!isLoggedIn) return <Navigate to="/login" />
    // Check state (or storage fallback) for robustness
    const role = userRole
    if (role?.toLowerCase() !== 'admin') return <Navigate to="/" />
    return children
  }

  // Redirect logic after login
  const getLoginRedirect = () => {
    return userRole?.toLowerCase() === 'admin' ? '/dashboard' : '/'
  }

  return (
    <ErrorBoundary>
      <ApiErrorListener />
      <Routes>
        <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} userRole={userRole} />} />
        <Route path="/login" element={
          isLoggedIn ? <Navigate to={getLoginRedirect()} /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
        } />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/profile" element={
          isLoggedIn ? <ProfilePage isLoggedIn={isLoggedIn} onLogout={handleLogout} /> : <Navigate to="/login" />
        } />

        {/* Specific Routes for History */}
        <Route path="/riwayat-reservasi" element={
          isLoggedIn ? <ProfilePage isLoggedIn={isLoggedIn} onLogout={handleLogout} initialTab="reservation_history" /> : <Navigate to="/login" />
        } />
        <Route path="/riwayat-pembelian" element={
          isLoggedIn ? <ProfilePage isLoggedIn={isLoggedIn} onLogout={handleLogout} initialTab="product_history" /> : <Navigate to="/login" />
        } />
        <Route path="/promo" element={<PromoPage isLoggedIn={isLoggedIn} />} />
        <Route path="/promo-detail" element={<PromoDetailPage isLoggedIn={isLoggedIn} />} />
        <Route path="/product" element={<ProductsPage isLoggedIn={isLoggedIn} />} />
        <Route path="/product/:id" element={<ProductDetailPage isLoggedIn={isLoggedIn} />} />
        <Route path="/products/:id" element={<ProductDetailPage isLoggedIn={isLoggedIn} />} />
        <Route path="/doctor-detail/:id" element={<DoctorDetailPage isLoggedIn={isLoggedIn} />} />
        <Route path="/event" element={<EventPage isLoggedIn={isLoggedIn} />} />
        <Route path="/event/:id" element={<EventDetailPage isLoggedIn={isLoggedIn} />} />
        <Route path="/cart" element={<CartPage isLoggedIn={isLoggedIn} />} />
        <Route path="/about" element={<AboutPage isLoggedIn={isLoggedIn} />} />
        <Route path="/doctors" element={<DoctorsPage isLoggedIn={isLoggedIn} />} />
        <Route path="/testimonial" element={<TestimonialPage isLoggedIn={isLoggedIn} />} />
        <Route path="/testimonial-detail" element={<TestimonialDetailPage isLoggedIn={isLoggedIn} />} />

        {/* Protected Reservation Route */}
        <Route path="/reservation" element={
          isLoggedIn ? (
            // Redirect admin to admin reservation management page
            userRole?.toLowerCase() === 'admin'
              ? <Navigate to="/reservations" />
              : <ReservationPage isLoggedIn={isLoggedIn} />
          ) : <Navigate to="/login" state={{ from: '/reservation' }} />
        } />

        <Route path="/doctor-detail" element={<DoctorDetailPage isLoggedIn={isLoggedIn} />} />

        {/* Admin Routes */}
        <Route path="/dashboard" element={<AdminRoute><DashboardPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/products" element={<AdminRoute><ProductManagementPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/promos" element={<AdminRoute><PromoManagementPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/events" element={<AdminRoute><EventManagementPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/sales" element={<AdminRoute><SalesDataPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/doctor" element={<AdminRoute><DoctorProfilePage isLoggedIn={isLoggedIn} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/users" element={<AdminRoute><UserManagementPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/reservations" element={<AdminRoute><TreatmentReservationPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/schedules" element={<AdminRoute><ScheduleReservationPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/categories" element={<AdminRoute><ProductCategoryPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/testimonials" element={<AdminRoute><TestimonialManagementPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/clinic-profile" element={<AdminRoute><ClinicProfilePage isLoggedIn={isLoggedIn} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/audit-logs" element={<AdminRoute><AuditLogPage isLoggedIn={isLoggedIn} onLogout={handleLogout} /></AdminRoute>} />
        <Route path="/unauthorized" element={<ErrorPage kind="unauthorized" />} />
        <Route path="/forbidden" element={<ErrorPage kind="forbidden" />} />

        {/* Fallback */}
        <Route path="*" element={<ErrorPage kind="not-found" />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
