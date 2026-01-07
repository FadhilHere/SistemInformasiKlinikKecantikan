import { useState, useEffect } from 'react'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import Button from '../components/atoms/Button'
import { apiFetch, API_BASE_URL } from '../lib/api'

const AboutPage = ({ isLoggedIn }) => {
    const [profile, setProfile] = useState(null)
    const [doctorCount, setDoctorCount] = useState(0)
    const [activities, setActivities] = useState([])
    const [activeActivityIndex, setActiveActivityIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                setLoading(true)
                
                // Fetch Company Profile
                try {
                    const profileRes = await apiFetch('/api/profil-perusahaan')
                    const profileData = profileRes.data || profileRes || []
                    if (Array.isArray(profileData) && profileData.length > 0) {
                        setProfile(profileData[0])
                    }
                } catch (e) { console.error("Err fetch profile", e) }

                // Fetch Doctor Count
                try {
                    const doctorRes = await apiFetch('/api/profil-dokter')
                    const doctorData = doctorRes.data || doctorRes || []
                    if (Array.isArray(doctorData)) {
                        setDoctorCount(doctorData.length)
                    }
                } catch (e) { console.error("Err fetch doctor count", e) }

                // Fetch Activities (Kegiatan)
                try {
                    // Assuming endpoint is /api/kegiatan based on KegiatanController
                    const activityRes = await apiFetch('/api/kegiatan')
                    const activityData = activityRes.data || activityRes || []
                    if (Array.isArray(activityData)) {
                        setActivities(activityData)
                    }
                } catch (e) { console.error("Err fetch activities", e) }

            } catch (error) {
                console.error("Failed to fetch page data:", error)
            } finally {
                setLoading(false)
            }
        }
        
        fetchAboutData()
    }, [])

    const handleNextActivity = () => {
        if (activities.length === 0) return
        setActiveActivityIndex((prev) => (prev + 1) % activities.length)
    }

    const handlePrevActivity = () => {
        if (activities.length === 0) return
        setActiveActivityIndex((prev) => (prev === 0 ? activities.length - 1 : prev - 1))
    }

    const getImageUrl = (path) => {
        if (!path) return 'https://placehold.co/1200x800/e2e8f0/1e293b?text=No+Image';
        if (path.startsWith('http')) return path;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${API_BASE_URL}/storage/${cleanPath}`;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white font-sans flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4aa731]"></div>
            </div>
        )
    }

    const currentActivity = activities[activeActivityIndex]

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar isLoggedIn={isLoggedIn} />

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-r from-[#4aa731] to-[#65ce4d] py-12 text-white">
                    <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 md:flex-row md:justify-between">
                        {/* Staff Image */}
                        <div className="relative z-10 w-full md:w-1/2">
                            <img
                                src={getImageUrl(profile?.gambar)}
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
                                <path d="M100 0C44.8 0 0 44.8 0 100s44.8 100 100 100 100-44.8 100-100S155.2 0 100 0zm0 180c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" />
                            </svg>
                        </div>
                    </div>
                </section>

                {/* Description Section */}
                <section className="mx-auto max-w-6xl px-4 py-16">
                    <h2 className="mb-6 text-3xl font-bold text-black">Mische Clinic</h2>
                    <p className="text-justify text-lg leading-relaxed text-gray-600">
                        {profile?.deskripsiPerusahaan || "-"}
                    </p>
                </section>

                {/* Visi Misi Section */}
                <section className="mx-auto max-w-6xl px-4 pb-16">
                    <div className="flex flex-col gap-12 md:flex-row">
                        {/* Building Image */}
                        <div className="w-full md:w-1/2">
                            <img
                                src={getImageUrl(profile?.gambar)}
                                alt="Mische Clinic Building"
                                className="h-full w-full rounded-2xl object-cover shadow-lg"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex w-full flex-col gap-8 md:w-1/2">
                            <div>
                                <h3 className="mb-4 text-2xl font-bold text-black">Visi</h3>
                                <p className="text-gray-600">
                                    {profile?.visi || "-"}
                                </p>
                            </div>
                            <div>
                                <h3 className="mb-4 text-2xl font-bold text-black">Misi</h3>
                                <p className="text-gray-600">
                                    {profile?.misi || "-"}
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
                                <p className="text-2xl font-bold text-black">
                                    {profile?.jamBukak ? `${profile.jamBukak.substring(0,5)} - ${profile.jamKeluar.substring(0,5)} WIB` : '-'}
                                </p>
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
                                <p className="text-2xl font-bold text-black">{doctorCount} Dokter Aktif</p>
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

                         {activities.length > 0 ? (
                            <>
                                {/* Main Slider */}
                                <div className="relative mx-auto mb-8 h-[400px] w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl bg-gray-800">
                                    <img
                                        src={getImageUrl(currentActivity?.foto)}
                                        alt={currentActivity?.namaKegiatan || "Activity"}
                                        className="h-full w-full object-cover transition-opacity duration-300"
                                    />
                                    {/* Caption Overlay - Optional */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-left">
                                         <h3 className="text-xl font-bold text-white">{currentActivity?.namaKegiatan}</h3>
                                         <p className="text-sm text-gray-200 line-clamp-2">{currentActivity?.deskripsi}</p>
                                    </div>

                                    {/* Arrows */}
                                    <button 
                                        onClick={handlePrevActivity}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 hover:bg-black/50 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={handleNextActivity}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 hover:bg-black/50 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8 text-white">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Thumbnails - Show 3 items or as many as available */}
                                <div className="mx-auto mb-12 grid max-w-4xl grid-cols-3 gap-4">
                                    {[0, 1, 2].map((offset) => {
                                        // Simple logic to show next 3 items, wrapping around
                                        const index = (activeActivityIndex + offset + 1) % activities.length;
                                        // Avoid showing duplicates if total items < 4 (simplification)
                                        if (activities.length <= 1 && offset > 0) return null;
                                        if (activities.length <= 2 && offset > 1) return null;
                                        
                                        const item = activities[index];
                                        return (
                                            <div 
                                                key={item.idKegiatan || index} 
                                                className="h-32 overflow-hidden rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => setActiveActivityIndex(index)}
                                            >
                                                <img 
                                                    src={getImageUrl(item.foto)} 
                                                    className="h-full w-full object-cover" 
                                                    alt={item.namaKegiatan} 
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            </>
                         ) : (
                             <div className="py-12 bg-white/10 rounded-xl mb-12">
                                 <p className="text-white">Belum ada kegiatan yang ditampilkan.</p>
                             </div>
                         )}

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
