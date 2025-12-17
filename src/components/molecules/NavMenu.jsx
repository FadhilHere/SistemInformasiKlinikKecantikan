const NAV_ITEMS = [
  { label: 'Beranda', route: 'landing' },
  { label: 'Produk', route: 'products' },
  { label: 'Promo', route: 'promo' },
  { label: 'Event', route: 'event' },
  { label: 'Reservasi', route: 'reservation' },
  { label: 'Tentang Kami', route: 'about', hasDropdown: true }
]

const NavMenu = ({ activeRoute, onNavigate }) => {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-6 text-base font-medium text-brand">
      {NAV_ITEMS.map((item) => {
        const isActive = item.route && activeRoute === item.route
        const baseClasses =
          'inline-flex items-center gap-1 transition-colors duration-150'
        const activeClasses = isActive
          ? 'text-primary-dark border-b-2 border-primary pb-1'
          : 'text-brand hover:text-primary-dark'

        if (item.route && onNavigate) {
          return (
            <button
              key={item.label}
              type="button"
              className={`${baseClasses} ${activeClasses}`}
              onClick={() => onNavigate(item.route)}
            >
              {item.label}
              {item.hasDropdown && (
                <span className="inline-block h-0 w-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-primary" />
              )}
            </button>
          )
        }

        return (
          <a
            key={item.label}
            href="#"
            className={`${baseClasses} ${activeClasses}`}
          >
            {item.label}
            {item.hasDropdown && (
              <span className="inline-block h-0 w-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-primary" />
            )}
          </a>
        )
      })}
    </nav>
  )
}

export default NavMenu
