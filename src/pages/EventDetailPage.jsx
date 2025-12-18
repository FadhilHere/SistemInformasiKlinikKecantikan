import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'

const EventDetailPage = ({ isLoggedIn }) => {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-br-[60px] rounded-tl-[60px] bg-white p-8 shadow-xl">
          {/* Banner Image */}
          <div className="h-[350px] w-full overflow-hidden rounded-br-[40px] rounded-tl-[40px]">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
              alt="Seminar Kecantikan"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Title */}
          <h1 className="mt-8 text-3xl font-bold text-black md:text-4xl">
            Seminar Kecantikan Di Politeknik Caltex Riau
          </h1>

          {/* Info Row */}
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:gap-12">
            {/* Date */}
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 24 24" className="h-12 w-12 text-[#4aa731]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#53c41a] px-6 py-2 text-sm font-bold text-white shadow-md">
                  23 Nov 2025
                </span>
                <span className="text-2xl font-bold text-black">-</span>
                <span className="rounded-full bg-[#53c41a] px-6 py-2 text-sm font-bold text-white shadow-md">
                  25 Nov 2025
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 24 24" className="h-12 w-12 text-[#4aa731]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="rounded-full bg-[#53c41a] px-6 py-2 text-sm font-bold text-white shadow-md">
                Politeknik Caltex Riau
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 text-justify text-lg leading-relaxed text-gray-800">
            <p>
              Seminar Kecantikan Yang Diselenggarakan Oleh Klinik Kecantikan Mische Akan Berlangsung Di Politeknik Caltex Riau Pada 23-25 November 2025 Dan Ditujukan Bagi Mahasiswa, Tenaga Pendidik, Serta Masyarakat Umum Yang Tertarik Untuk Memperdalam Wawasan Seputar Dunia Kecantikan. Acara Ini Akan Menghadirkan Sesi Edukatif Mengenai Perawatan Kulit Yang Tepat, Pengenalan Teknologi Terbaru Dalam Estetika, Tips Praktis Menjaga Kesehatan Dan Penampilan Sehari-Hari, Serta Diskusi Langsung Dengan Para Ahli Kecantikan Dari Mische. Melalui Kegiatan Ini, Peserta Diharapkan Memperoleh Pengetahuan Dan Keterampilan Yang Dapat Diterapkan Dalam Kehidupan Sehari-Hari Maupun Dunia Profesional Yang Berkaitan Dengan Industri Kecantikan.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default EventDetailPage
