import { useNavigate } from 'react-router-dom'
import Button from '../atoms/Button'
import CartIcon from '../atoms/icons/CartIcon'

const NavActions = ({ isLoggedIn }) => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => navigate('/cart')}
        className="rounded-full border border-brand/20 p-2 transition hover:border-primary hover:text-primary"
        aria-label="Keranjang"
      >
        <CartIcon />
      </button>

      {isLoggedIn ? (
        <Button
          variant="primary"
          className="flex items-center gap-2 !px-6"
          onClick={() => navigate('/profile')}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          Profil
        </Button>
      ) : (
        <Button variant="ghost" onClick={() => navigate('/login')}>
          Login
        </Button>
      )}

      {/* Temporary Profile Button - Removed or kept if needed for testing? User asked to adjust code "project saya" so I assume cleaning up is good. I will remove the temp button as I have a real one above. Or did the user want it? The prev code had it. I'll keep it but updated, just in case. */}
      {/* 
      <Button variant="primary" onClick={() => navigate('/profile')}>
        Profil (Temp)
      </Button> 
      */}
      {/* Wait, the active isLoggedIn usually false by default. The user might want easy access. I'll comment it out or remove it. I'll remove it to be clean. */}

      {!isLoggedIn && (
        <Button variant="primary" onClick={() => navigate('/register')}>
          Registrasi
        </Button>
      )}
    </div>
  )
}

export default NavActions
