import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import Button from '../components/atoms/Button'

const AboutPage = ({ onNavigate, onShowLogin, onShowRegister, onShowLanding, isLoggedIn }) => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar
        onShowLogin={onShowLogin}
        onShowRegister={onShowRegister}
        onShowLanding={onShowLanding}
        activeRoute="about"
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
      />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#4aa731] to-[#65ce4d] py-12 text-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 md:flex-row md:justify-between">
            {/* Staff Image */}
            <div className="relative z-10 w-full md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=800&q=80" 
                alt="Mische Staff" 
                className="rounded-xl shadow-2xl"
              />
            </div>
            
            {/* Text */}
            <div className="relative z-10 w-full text-center md:w-1/2 md:text-right">
              <h2 className="text-2xl font-medium opacity-90">Selamat Datang</h2>
              <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">
                # THE FIRST ACNE <br /> EXPERT IN TOWN
              </h1>
            </div>

            {/* Decorative Silhouette (Abstract) */}
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
               <svg viewBox="0 0 200 200" className="h-full w-full" fill="currentColor">
                  <path d="M100 0C44.8 0 0 44.8 0 100s44.8 100 100 100 100-44.8 100-100S155.2 0 100 0zm0 180c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/>
               </svg>
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="mb-6 text-3xl font-bold text-black">Mische Clinic</h2>
          <p className="text-justify text-lg leading-relaxed text-gray-600">
            Dengan Rangkaian Produk Yang Diformulasikan Khusus Untuk Perawatan Kulit Wajah, MISCHE Skincare Menghadirkan Manfaat Lengkap Yang Dibutuhkan Kulitmu. Mulai Dari Mencerahkan Warna Kulit, Menjaga Kelembapan Optimal, Hingga Mengatasi Tanda-Tanda Penuaan Dini. Produk Klinik Mische Juga Efektif Dalam Merawat Kulit Berjerawat Dan Membantu Mengembalikan Kilau Alami Wajahmu. Jangan Harga Yang Terjangkau, Klinik Mische Menjadi Pilihan Tepat Bagi Kamu Yang Ingin Merawat Kulit Secara Menyeluruh Dan Tampil Percaya Diri Setiap Hari.
          </p>
        </section>

        {/* Visi Misi Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="flex flex-col gap-12 md:flex-row">
            {/* Building Image */}
            <div className="w-full md:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80" 
                alt="Mische Clinic Building" 
                className="h-full w-full rounded-2xl object-cover shadow-lg"
              />
            </div>

            {/* Content */}
            <div className="flex w-full flex-col gap-8 md:w-1/2">
              <div>
                <h3 className="mb-4 text-2xl font-bold text-black">Visi</h3>
                <p className="text-gray-600">
                  Dengan Rangkaian Produk Yang Diformulasikan Khusus Untuk Perawatan Kulit Wajah, MISCHE Skincare Menghadirkan Manfaat Lengkap Yang Dibutuhkan Kulitmu. Mulai Dari Mencerahkan Warna Kulit, Menjaga Kelembapan Optimal.
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-2xl font-bold text-black">Misi</h3>
                <p className="text-gray-600">
                  Dengan Rangkaian Produk Yang Diformulasikan Khusus Untuk Perawatan Kulit Wajah, MISCHE Skincare Menghadirkan Manfaat Lengkap Yang Dibutuhkan Kulitmu. Mulai Dari Mencerahkan Warna Kulit, Menjaga Kelembapan Optimal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Jam Operasional */}
            <div className="flex items-center gap-6 rounded-2xl bg-gray-50 p-8 shadow-sm">
              <div className="rounded-full bg-[#4aa731]/20 p-4 text-[#4aa731]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-10 w-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-black">Jam Operasional</h3>
                <p className="text-2xl font-bold text-black">07:00 - 18:00 WIB</p>
              </div>
            </div>

            {/* Jumlah Dokter */}
            <div className="flex items-center gap-6 rounded-2xl bg-gray-50 p-8 shadow-sm">
              <div className="rounded-full bg-[#4aa731]/20 p-4 text-[#4aa731]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-10 w-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-black">Jumlah Dokter</h3>
                <p className="text-2xl font-bold text-black">2 Dokter Aktif</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="relative overflow-hidden bg-[#4aa731] py-16 text-white">
          {/* Decorative Curve Top */}
          <div className="absolute left-0 top-0 h-16 w-full bg-white" style={{ clipPath: 'ellipse(60% 100% at 50% 0%)' }}></div>

          <div className="mx-auto max-w-6xl px-4 text-center">
            <h2 className="mb-2 text-3xl font-bold">Inilah Kegiatan Harian Kami Dalam Memberikan</h2>
            <h2 className="mb-4 text-3xl font-bold">Perawatan Terbaik.</h2>
            <p className="mb-12 text-sm font-medium tracking-widest opacity-80">#BEING BEAUTY WITH MISCHE</p>

            {/* Main Slider */}
            <div className="relative mx-auto mb-8 h-[400px] w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80" 
                alt="Activity Main" 
                className="h-full w-full object-cover"
              />
              {/* Arrows */}
              <button className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 hover:bg-white/40">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 hover:bg-white/40">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* Thumbnails */}
            <div className="mx-auto mb-12 grid max-w-4xl grid-cols-3 gap-4">
               <div className="h-32 overflow-hidden rounded-xl">
                 <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80" className="h-full w-full object-cover" alt="Thumb 1" />
               </div>
               <div className="h-32 overflow-hidden rounded-xl">
                 <img src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=400&q=80" className="h-full w-full object-cover" alt="Thumb 2" />
               </div>
               <div className="h-32 overflow-hidden rounded-xl">
                 <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=400&q=80" className="h-full w-full object-cover" alt="Thumb 3" />
               </div>
            </div>

            <Button className="rounded-full bg-white px-8 py-3 text-[#4aa731] hover:bg-gray-100">
              Lihat Lainnya
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AboutPage
