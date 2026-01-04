import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch, API_BASE_URL } from '../lib/api'
import Button from '../components/atoms/Button'

const DoctorsSection = () => {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await apiFetch('/api/profil-dokter')
        if (response.success && Array.isArray(response.data)) {
            // Take only 2 for landing page
            setDoctors(response.data.slice(0, 2))
        }
      } catch (err) {
        console.error('Error fetching doctors:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctors()
  }, [])

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x600?text=No+Image'
    if (path.startsWith('http')) return path
    // handle path with leading /storage or without
    if (path.startsWith('/storage')) return `${API_BASE_URL}${path}`
    return `${API_BASE_URL}/storage/${path}`
  }

  if (isLoading) return <div className="py-10 text-center">Loading...</div>
  if (doctors.length === 0) return null

  return (
    <section className="flex flex-col gap-10">
      <div className="text-center">
        <h2 className="mt-2 text-3xl font-bold text-[#4aa731] md:text-4xl">
          Dokter Kami Siap Membantu Merawat Dan Menjawab Kebutuhan Kulitmu.
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {doctors.map((doctor) => (
            <article 
                key={doctor.id || doctor.idDokter}
                className="group relative h-[500px] w-full overflow-hidden rounded-tl-[60px] rounded-br-[60px] shadow-card transition-transform hover:-translate-y-1"
            >
              <img
                src={getImageUrl(doctor.foto)}
                alt={doctor.nama}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4aa731]/80 via-[#4aa731]/30 to-transparent" />
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
    </section>
  )
}

export default DoctorsSection
