import Navbar from '../fragments/Navbar'
import LoginForm from '../fragments/LoginForm'

const LoginPage = ({
  onShowLogin,
  onShowRegister,
  onShowLanding,
  onNavigate
}) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onShowLogin={onShowLogin}
        onShowRegister={onShowRegister}
        onShowLanding={onShowLanding}
        activeRoute="login"
        onNavigate={onNavigate}
      />
      <main className="flex justify-center px-4 py-14">
        <LoginForm />
      </main>
    </div>
  )
}

export default LoginPage
