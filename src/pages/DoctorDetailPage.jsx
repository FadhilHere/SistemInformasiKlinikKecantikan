import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import { apiFetch, API_BASE_URL } from '../lib/api'

const DoctorDetailPage = ({ isLoggedIn }) => {
  const { id } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true)
        const response = await apiFetch(`/api/profil-dokter/${id}`)
        if (response.success) {
          setDoctor(response.data)
        } else {
          throw new Error('Dokter tidak ditemukan')
        }
      } catch (err) {
        console.error(err)
        setError('Gagal memuat profil dokter.')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchDetail()
  }, [id])

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/800x600?text=No+Image'
    if (path.startsWith('http')) return path
    return `${API_BASE_URL}/storage/${path}`
  }

  if (isLoading) {
    return (
        <div className="min-h-screen bg-[#f9f9f9]">
            <Navbar isLoggedIn={isLoggedIn} />
            <div className="flex justify-center py-20">Memuat...</div>
        </div>
    )
  }

  if (error || !doctor) {
    return (
        <div className="min-h-screen bg-[#f9f9f9]">
            <Navbar isLoggedIn={isLoggedIn} />
            <div className="flex justify-center py-20 text-red-500">{error || 'Tidak ditemukan'}</div>
        </div>
    )
  }

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
                        src={getImageUrl(doctor.foto)} 
                        alt={doctor.nama} 
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>

            {/* Right: Details */}
            <div className="flex w-full flex-col justify-center p-8 md:w-3/5 md:p-12">
                <h2 className="mb-6 text-4xl font-bold uppercase text-black">
                    {doctor.nama}
                </h2>

                <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#53c41a]">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="text-xl font-medium text-black">{doctor.email}</span>
                </div>

                <div className="text-justify text-lg leading-relaxed text-black">
                    <p>
                        {doctor.deskripsi}
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