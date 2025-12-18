import Navbar from '../fragments/Navbar'
import LoginForm from '../fragments/LoginForm'

const LoginPage = ({ onLoginSuccess }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex justify-center px-4 py-14">
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </main>
    </div>
  )
}

export default LoginPage
