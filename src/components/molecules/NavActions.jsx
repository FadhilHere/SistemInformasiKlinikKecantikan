import Button from '../atoms/Button'
import CartIcon from '../atoms/icons/CartIcon'

const NavActions = ({ onShowLogin, onShowRegister, onNavigate, isLoggedIn }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onNavigate('cart')}
        className="rounded-full border border-brand/20 p-2 transition hover:border-primary hover:text-primary"
        aria-label="Keranjang"
      >
        <CartIcon />
      </button>
      
      {isLoggedIn ? (
        <Button 
            variant="primary" 
            className="flex items-center gap-2 !px-6"
            onClick={() => onNavigate('profile')}
        >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Profil
        </Button>
      ) : (
          <Button variant="ghost" onClick={onShowLogin}>
            Login
          </Button>
      )}

      {/* Temporary Profile Button */}
      <Button variant="primary" onClick={() => onNavigate('profile')}>
        Profil (Temp)
      </Button>

      <Button variant="primary" onClick={onShowRegister}>
        Registrasi
      </Button>
    </div>
  )
}

export default NavActions
