import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'

const TestimonialDetailPage = ({ isLoggedIn }) => {
  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="mx-auto max-w-6xl px-4 py-12">
        
        {/* Title Section */}
        <div className="mb-12 flex justify-start">
            <h1 className="inline-block rounded-r-full bg-white py-4 pr-12 pl-4 text-3xl font-bold text-[#4aa731] shadow-md md:text-4xl">
                Testimoni Customer
            </h1>
        </div>

        {/* Content Card */}
        <div className="flex flex-col overflow-hidden rounded-[40px] bg-white shadow-xl md:flex-row">
            
            {/* Left: Image */}
            <div className="w-full md:w-2/5">
                <div className="h-full min-h-[400px] w-full bg-gradient-to-b from-gray-100 to-gray-200">
                    <img 
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80" 
                        alt="Bintang Puspita Dewi" 
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>

            {/* Right: Details */}
            <div className="flex w-full flex-col justify-center p-8 md:w-3/5 md:p-12">
                <h2 className="mb-4 text-4xl font-bold text-black">
                    Bintang Puspita Dewi
                </h2>

                <div className="mb-6 flex items-center gap-4">
                    <span className="rounded-full bg-[#53c41a] px-6 py-2 text-lg font-bold text-white shadow-sm">
                        23 Nov 2025
                    </span>
                    <span className="text-xl font-bold text-[#53c41a]">
                        Treatment Acne
                    </span>
                </div>

                <div className="text-justify text-lg leading-relaxed text-black/80">
                    <p>
                        Pada Tanggal 23 November 2025, Bintang Puspita Dewi Melakukan Treatment Acne Di Mische Aesthetic Clinic. Ia Menyampaikan Rasa Sangat Puas Dan Senang Dengan Hasil Perawatan Yang Diberikan. Menurutnya, Pelayanan Yang Ramah, Tenaga Profesional, Serta Hasil Yang Terasa Nyata Membuat Pengalamannya Di Klinik Ini Sangat Menyenangkan Dan Melebihi Ekspektasi.
                    </p>
                </div>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default TestimonialDetailPage
