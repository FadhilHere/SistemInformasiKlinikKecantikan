import LogoIcon from '../components/atoms/LogoIcon'

const Footer = () => {
  return (
    <footer className="mt-16">
      <div className="bg-[#2f7f00] py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <LogoIcon size={56} className="bg-white/20 rounded-full p-2" />
              <div>
                <p className="text-4xl font-normal font-sans tracking-tight">mische</p>
                <p className="text-xs tracking-[0.4em] uppercase text-white/70">Aesthetic Clinic</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Alamat</h3>
            <p className="text-sm leading-relaxed text-white/90 mb-2">
              Jl. KH.Ahmad Dahlan No.80, Sukajadi, Pekanbaru
            </p>
            <p className="text-sm text-white/90">+628116922551</p>
            <h3 className="text-xl font-bold mt-6 mb-4">Waktu Operasional</h3>
            <p className="text-sm font-semibold text-white/90">Setiap Hari</p>
            <p className="text-sm text-white/90">10 A.M - 7 P.M</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Ikuti Kami</h3>
            <ul className="space-y-3 text-sm text-white/90">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
              <li><a href="#" className="hover:underline">Tiktok</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] py-6 text-xs text-white/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row lg:px-8">
          <div className="flex items-center gap-2">
            <span className="text-lg">©</span>
            <span>2023 Beautya. All Rights Reserved.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Terms & Conditions</a>
            <a href="#" className="hover:text-white">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
