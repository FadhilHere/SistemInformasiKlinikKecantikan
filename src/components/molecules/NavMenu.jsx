const NAV_ITEMS = [
  'Beranda',
  'Produk',
  'Promo',
  'Event',
  'Reservasi',
  'Tentang Kami'
]

const NavMenu = () => {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-6 text-base font-medium text-brand">
      {NAV_ITEMS.map((item) => (
        <a
          key={item}
          href="#"
          className="inline-flex items-center gap-1 text-brand transition hover:text-primary-dark"
        >
          {item}
          {item === 'Tentang Kami' && (
            <span className="inline-block h-0 w-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-primary" />
          )}
        </a>
      ))}
    </nav>
  )
}

export default NavMenu
