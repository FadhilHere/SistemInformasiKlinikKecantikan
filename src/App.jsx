import { useState } from 'react'
import RegistrationPage from './pages/RegistrationPage'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'

const App = () => {
  const [activePage, setActivePage] = useState('landing')

  const sharedProps = {
    onShowLanding: () => setActivePage('landing'),
    onShowLogin: () => setActivePage('login'),
    onShowRegister: () => setActivePage('registration')
  }

  if (activePage === 'login') {
    return <LoginPage {...sharedProps} />
  }

  if (activePage === 'registration') {
    return <RegistrationPage {...sharedProps} />
  }

  return <LandingPage {...sharedProps} />
}

export default App
