import Brand from '../components/molecules/Brand'
import NavMenu from '../components/molecules/NavMenu'
import NavActions from '../components/molecules/NavActions'

const Navbar = ({ isLoggedIn, userRole }) => {
  return (
    <header className="sticky top-0 z-50 flex flex-col gap-4 bg-white px-6 py-4 shadow-navbar md:flex-row md:items-center md:justify-between lg:px-16">
      <Brand />
      <NavMenu />
      <NavActions isLoggedIn={isLoggedIn} userRole={userRole} />
    </header>
  )
}

export default Navbar
