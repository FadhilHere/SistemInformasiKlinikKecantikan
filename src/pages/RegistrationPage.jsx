import Navbar from '../fragments/Navbar'
import RegistrationForm from '../fragments/RegistrationForm'

const RegistrationPage = ({ onShowLogin, onShowRegister, onShowLanding }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onShowLogin={onShowLogin}
        onShowRegister={onShowRegister}
        onShowLanding={onShowLanding}
      />
      <main className="flex justify-center px-4 py-14">
        <RegistrationForm />
      </main>
    </div>
  )
}

export default RegistrationPage
