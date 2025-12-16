import LogoIcon from '../components/atoms/LogoIcon'
import footerImage from '../assets/image.svg'

const Footer = () => {
  return (
    <footer className="mt-16">
      <div
        className="rounded-[36px] bg-cover bg-center p-12 text-white shadow-card"
        style={{ backgroundImage: `url(${footerImage})` }}
      >
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <LogoIcon size={56} className="bg-white/20 rounded-2xl p-2" />
              <div>
                <p className="text-3xl font-semibold leading-tight">mische</p>
                <p className="text-xs tracking-[0.5em]">AESTHETIC CLINIC</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/80">
              Klinik kecantikan terpercaya dengan layanan premium dan dokter
              berpengalaman.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Alamat</h3>
            <p className="mt-2 text-sm text-white/80">
              Jl. KH Ahmad Dahlan No.80, Sukajadi, Pekanbaru
            </p>
            <p className="text-sm text-white/80">+62 811 692 2551</p>
            <h4 className="mt-4 text-lg font-semibold">Waktu Operasional</h4>
            <p className="text-sm text-white/80">Setiap Hari 10 A.M - 7 P.M</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Ikuti Kami</h3>
            <ul className="mt-2 space-y-1 text-sm text-white/80">
              <li>Facebook</li>
              <li>Instagram</li>
              <li>TikTok</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-3xl bg-[#131313] px-6 py-4 text-xs text-white/70 md:flex-row">
        <span>© 2023 Beautya. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#">Terms &amp; Conditions</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
