import { useState } from 'react'
import RegistrationPage from './pages/RegistrationPage'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
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
import TestimonialPage from './pages/TestimonialPage'
import ClinicProfilePage from './pages/ClinicProfilePage'

const App = () => {
  const [activePage, setActivePage] = useState('landing')

  const sharedProps = {
    onShowLanding: () => setActivePage('landing'),
    onShowLogin: () => setActivePage('login'),
    onShowRegister: () => setActivePage('registration'),
    onShowDashboard: () => setActivePage('dashboard'),
    onNavigate: (page) => setActivePage(page)
  }

  if (activePage === 'login') {
    return <LoginPage {...sharedProps} />
  }

  if (activePage === 'registration') {
    return <RegistrationPage {...sharedProps} />
  }

  if (activePage === 'dashboard') {
    return <DashboardPage onLogout={sharedProps.onShowLanding} onNavigate={sharedProps.onNavigate} />
  }

  if (activePage === 'products') {
    return <ProductManagementPage onLogout={sharedProps.onShowLanding} onNavigate={sharedProps.onNavigate} />
  }

  if (activePage === 'promos') {
    return <PromoManagementPage onLogout={sharedProps.onShowLanding} onNavigate={sharedProps.onNavigate} />
  }
  if (activePage === 'events') {
    return <EventManagementPage onLogout={sharedProps.onShowLanding} onNavigate={sharedProps.onNavigate} />
  }
  if (activePage === 'sales') {
    return <SalesDataPage onLogout={sharedProps.onShowLanding} onNavigate={sharedProps.onNavigate} />
  }
  if (activePage === 'doctor') {
    return <DoctorProfilePage onLogout={sharedProps.onShowLanding} onNavigate={sharedProps.onNavigate} />
  }
  if (activePage === 'users') {
    return <UserManagementPage onLogout={sharedProps.onShowLanding} onNavigate={sharedProps.onNavigate} />
  }
  if (activePage === 'reservations') {
    return <TreatmentReservationPage onLogout={sharedProps.onShowLanding} onNavigate={sharedProps.onNavigate} />
  }
  if (activePage === 'schedules') {
    return <ScheduleReservationPage onLogout={sharedProps.onShowLanding} onNavigate={sharedProps.onNavigate} />
  }
  if (activePage === 'categories') {
    return <ProductCategoryPage onLogout={sharedProps.onShowLanding} onNavigate={sharedProps.onNavigate} />
  }
  if (activePage === 'testimonials') {
    return <TestimonialPage onLogout={sharedProps.onShowLanding} onNavigate={sharedProps.onNavigate} />
  }
  if (activePage === 'clinic-profile') {
    return <ClinicProfilePage onLogout={sharedProps.onShowLanding} onNavigate={sharedProps.onNavigate} />
  }


  return <LandingPage {...sharedProps} />
}

export default App
