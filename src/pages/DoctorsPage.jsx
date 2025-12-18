import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import Button from '../components/atoms/Button'
import { apiFetch, API_BASE_URL } from '../lib/api'

const DoctorsPage = ({ isLoggedIn }) => {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true)
        const response = await apiFetch('/api/profil-dokter')
        if (response.success && Array.isArray(response.data)) {
          setDoctors(response.data)
        } else {
          setDoctors([])
        }
      } catch (err) {
        console.error('Error fetching doctors:', err)
        setError('Gagal memuat data dokter.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x600?text=No+Image'
    if (path.startsWith('http')) return path
    return `${API_BASE_URL}/storage/${path}`
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Title */}
        <div className="mb-12 flex justify-start">
             <h1 className="inline-block rounded-r-full bg-white py-4 pr-12 pl-4 text-3xl font-bold text-[#4aa731] shadow-md md:text-4xl">
                Tentang Dokter
            </h1>
        </div>

        {/* Doctors Grid */}
        {isLoading ? (
            <div className="text-center py-20">Memuat data dokter...</div>
        ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
        ) : doctors.length === 0 ? (
            <div className="text-center py-20">Belum ada data dokter.</div>
        ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {doctors.map((doctor) => (
                <article 
                    key={doctor.id || doctor.idDokter}
                    className="group relative h-[500px] w-full overflow-hidden rounded-tl-[60px] rounded-br-[60px] shadow-card transition-transform hover:-translate-y-1"
                >
                {/* Image */}
                <img
                    src={getImageUrl(doctor.foto)}
                    alt={doctor.nama}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#4aa731]/80 via-[#4aa731]/30 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 flex flex-col gap-3 p-8 text-white w-full">
                    <h2 className="text-3xl font-bold uppercase leading-tight">
                        {doctor.nama}
                    </h2>
                    <p className="text-sm font-medium leading-relaxed text-white/90 line-clamp-3">
                        {doctor.deskripsi}
                    </p>
                    <Button 
                        variant="primary"
                        className="mt-4 w-fit rounded-full bg-[#53c41a] px-8 py-3 text-sm font-bold text-white shadow-lg border border-transparent hover:bg-[#43a015]"
                        onClick={() => navigate(`/doctor-detail/${doctor.id || doctor.idDokter}`)}
                    >
                    Selengkapnya
                    </Button>
                </div>
                </article>
            ))}
            </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default DoctorsPage