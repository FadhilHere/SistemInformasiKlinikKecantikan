import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import { apiFetch, API_BASE_URL } from '../lib/api'

const EventDetailPage = ({ isLoggedIn }) => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true)
        setError('')
        const response = await apiFetch(`/api/event/${id}`)
        const data =
          response?.data?.data ||
          response?.data ||
          response

        if (data) {
          setEvent(data)
        } else {
          setError('Event tidak ditemukan.')
        }
      } catch (err) {
        setError(err?.data?.message || err?.message || 'Gagal memuat detail event.')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchDetail()
    }
  }, [id])

  const getImageUrl = (path) => {
    if (!path) return 'https://placehold.co/1200x600/e2e8f0/1e293b?text=No+Image'
    if (path.startsWith('http')) return path
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${API_BASE_URL}/storage/${cleanPath}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9f9f9]">
        <Navbar isLoggedIn={isLoggedIn} />
        <div className="mx-auto max-w-6xl px-4 py-12 text-center text-gray-500">
          Memuat detail event...
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#f9f9f9]">
        <Navbar isLoggedIn={isLoggedIn} />
        <div className="mx-auto max-w-6xl px-4 py-12 text-center text-red-500">
          {error || 'Event tidak ditemukan.'}
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-br-[60px] rounded-tl-[60px] bg-white p-8 shadow-xl">
          {/* Banner Image */}
          <div className="h-[350px] w-full overflow-hidden rounded-br-[40px] rounded-tl-[40px]">
            <img
              src={getImageUrl(event.foto)}
              alt={event.nama || 'Event'}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Title */}
          <h1 className="mt-8 text-3xl font-bold text-black md:text-4xl">
            {event.nama || '-'}
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
                  {formatDate(event.tanggalMulai)}
                </span>
                <span className="text-2xl font-bold text-black">-</span>
                <span className="rounded-full bg-[#53c41a] px-6 py-2 text-sm font-bold text-white shadow-md">
                  {formatDate(event.tanggalSelesai)}
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
                {event.lokasi || '-'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8 text-justify text-lg leading-relaxed text-gray-800">
            <p>{event.deskripsi || '-'}</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default EventDetailPage
