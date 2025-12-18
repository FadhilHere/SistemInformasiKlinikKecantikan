import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'

const DoctorDetailPage = ({ isLoggedIn }) => {
    return (
        <div className="min-h-screen bg-[#f9f9f9] font-sans">
            <Navbar isLoggedIn={isLoggedIn} />

            <main className="mx-auto max-w-6xl px-4 py-12">

                {/* Title Section */}
                <div className="mb-12 flex justify-start">
                    <h1 className="inline-block rounded-r-full bg-white py-4 pr-12 pl-4 text-3xl font-bold text-[#4aa731] shadow-md md:text-4xl">
                        Biografi Dokter Klinik Mische
                    </h1>
                </div>

                {/* Content Card */}
                <div className="flex flex-col overflow-hidden rounded-[40px] bg-white shadow-xl md:flex-row">

                    {/* Left: Image */}
                    <div className="w-full md:w-2/5">
                        <div className="h-full min-h-[400px] w-full bg-gradient-to-b from-gray-100 to-gray-200">
                            <img
                                src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80"
                                alt="Dr. Widya Finanda"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex w-full flex-col justify-center p-8 md:w-3/5 md:p-12">
                        <h2 className="mb-6 text-4xl font-bold uppercase text-black">
                            Dr. WIDYA FINANDA
                        </h2>

                        <div className="mb-8 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#53c41a]">
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-xl font-medium text-black">Widya@Gmail.Com</span>
                        </div>

                        <div className="text-justify text-lg leading-relaxed text-black">
                            <p>
                                Dr. Widya Finanda Adalah Dokter Kecantikan Berpengalaman Lebih Dari 20 Tahun Yang Telah Mengikuti Berbagai Pelatihan Dan Seminar Internasional Di Bidang Estetika, Perawatan Kulit, Dan Anti-Aging. Dikenal Sebagai Sosok Profesional Yang Peduli Pada Kesehatan Dan Kepercayaan Diri Pasien, Beliau Kini Menjadi Bagian Penting Dari Klinik Kecantikan Mische, Menghadirkan Pelayanan Berkualitas Dengan Hasil Optimal.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default DoctorDetailPage
