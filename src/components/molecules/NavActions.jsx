import Button from '../atoms/Button'
import CartIcon from '../atoms/icons/CartIcon'

const NavActions = ({ onShowLogin, onShowRegister, onNavigate }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onNavigate('cart')}
        className="rounded-full border border-brand/20 p-2 transition hover:border-primary hover:text-primary"
        aria-label="Keranjang"
      >
        <CartIcon />
      </button>
      <Button variant="ghost" onClick={onShowLogin}>
        Login
      </Button>
      <Button variant="primary" onClick={onShowRegister}>
        Registrasi
      </Button>
    </div>
  )
}

export default NavActions
