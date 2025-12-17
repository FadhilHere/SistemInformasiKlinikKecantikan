import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegistrationPage from './pages/RegistrationPage'
import PromoPage from './pages/PromoPage'
import PromoDetailPage from './pages/PromoDetailPage'
import ProductsPage from './pages/ProductsPage'
import EventPage from './pages/EventPage'
import EventDetailPage from './pages/EventDetailPage'
import CartPage from './pages/CartPage'
import AboutPage from './pages/AboutPage'
import ReservationPage from './pages/ReservationPage'

const App = () => {
  const [activePage, setActivePage] = useState('landing')

  const handleNavigate = (route) => {
    setActivePage(route)
  }

  const sharedProps = {
    onShowLanding: () => setActivePage('landing'),
    onShowLogin: () => setActivePage('login'),
    onShowRegister: () => setActivePage('registration'),
    onNavigate: handleNavigate
  }

  if (activePage === 'login') {
    return <LoginPage {...sharedProps} />
  }

  if (activePage === 'registration') {
    return <RegistrationPage {...sharedProps} />
  }

  if (activePage === 'promo') {
    return <PromoPage {...sharedProps} />
  }

  if (activePage === 'promoDetail') {
    return <PromoDetailPage {...sharedProps} />
  }

  if (activePage === 'products') {
    return <ProductsPage {...sharedProps} />
  }

  if (activePage === 'event') {
    return <EventPage {...sharedProps} />
  }

  if (activePage === 'event-detail') {
    return <EventDetailPage {...sharedProps} />
  }

  if (activePage === 'cart') {
    return <CartPage {...sharedProps} />
  }

  if (activePage === 'about') {
    return <AboutPage {...sharedProps} />
  }

  if (activePage === 'reservation') {
    return <ReservationPage {...sharedProps} />
  }

  return <LandingPage {...sharedProps} />
}

export default App
