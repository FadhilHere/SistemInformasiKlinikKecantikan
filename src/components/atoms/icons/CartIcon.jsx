const CartIcon = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M5.5 5h1.7l1.6 9.3A1.5 1.5 0 0 0 10.3 15h6.7a1.5 1.5 0 0 0 1.5-1.2l1.3-6.8H8.3"
      stroke="#111"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10.5" cy="19" r="1.4" fill="#111" />
    <circle cx="17.5" cy="19" r="1.4" fill="#111" />
  </svg>
)

export default CartIcon
