import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Beranda', route: '/' },
  { label: 'Produk', route: '/product' },
  { label: 'Promo', route: '/promo' },
  { label: 'Event', route: '/event' },
  { label: 'Reservasi', route: '/reservation' },
  {
    label: 'Tentang Kami',
    route: '/about',
    hasDropdown: true,
    dropdownItems: [
      { label: 'Tentang Dokter', route: '/doctors' },
      { label: 'Testimoni', route: '/testimonial' }
    ]
  }
]

const NavMenu = () => {
  const location = useLocation()
  const activeRoute = location.pathname
  const [openDropdown, setOpenDropdown] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label)
  }

  return (
    <nav className="flex flex-wrap items-center justify-center gap-6 text-base font-medium text-brand" ref={dropdownRef}>
      {NAV_ITEMS.map((item) => {
        const isActive = item.route === '/'
          ? activeRoute === '/'
          : activeRoute.startsWith(item.route)

        const baseClasses =
          'inline-flex items-center gap-1 transition-colors duration-150 relative'
        const activeClasses = isActive
          ? 'text-primary-dark border-b-2 border-primary pb-1'
          : 'text-brand hover:text-primary-dark'

        return (
          <div key={item.label} className="relative group">
            <div className={`${baseClasses} ${activeClasses}`}>
              <Link to={item.route} className="flex items-center gap-1">
                {item.label}
              </Link>
              {item.hasDropdown && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleDropdown(item.label)
                  }}
                  className="ml-1 focus:outline-none"
                >
                  <svg
                    className={`h-4 w-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown Menu */}
            {item.hasDropdown && openDropdown === item.label && (
              <div className="absolute left-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {item.dropdownItems.map((subItem) => (
                    <Link
                      key={subItem.route}
                      to={subItem.route}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-[#4aa731]"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default NavMenu
