import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import { apiFetch, API_BASE_URL } from '../lib/api'

const EventPage = ({ isLoggedIn }) => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Future implementation: fetch counts from API
  const [summaryCards, setSummaryCards] = useState([
    {
      title: 'Event Yang Akan Di Selenggarakan',
      count: '...',
      status: 'Akan Berlangsung',
      bgImage: 'https://placehold.co/600x200/53c41a/ffffff?text=Upcoming'
    },
    {
      title: 'Event Yang Sudah Di Selenggarakan',
      count: '...',
      status: 'Sudah Selesai',
      bgImage: 'https://placehold.co/600x200/64748b/ffffff?text=Past'
    },
    {
      title: 'Event Yang Sedang Di Selenggarakan',
      count: '...',
      status: 'Sedang Berlangsung',
      bgImage: 'https://placehold.co/600x200/3b82f6/ffffff?text=Ongoing'
    }
  ])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const response = await apiFetch('/api/event')
        if (response.success && Array.isArray(response.data)) {
          setEvents(response.data)
          updateSummaryCounts(response.data)
        } else {
          setEvents([])
        }
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Gagal memuat event.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const updateSummaryCounts = (data) => {
      const now = new Date()
      let upcoming = 0
      let past = 0
      let ongoing = 0

      data.forEach(event => {
          const start = new Date(event.tanggalMulai)
          const end = new Date(event.tanggalSelesai)
          
          if (now < start) upcoming++
          else if (now > end) past++
          else ongoing++
      })

      setSummaryCards(prev => [
          { ...prev[0], count: `${upcoming} Event` },
          { ...prev[1], count: `${past} Event` },
          { ...prev[2], count: `${ongoing} Event` }
      ])
  }

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x400?text=No+Image'
    if (path.startsWith('http')) return path
    return `${API_BASE_URL}/storage/${path}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-background font-sans w-full flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-grow w-full">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-[#7ce645] p-8 text-white shadow-lg md:p-12">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Event Yang Di <br /> Selenggarakan Oleh Mische
            </h1>
          </div>
          {/* Decorative Circle/Shape */}
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-3xl"></div>
          <div className="absolute top-0 right-0 h-full w-1/3 opacity-20">
             {/* Abstract shape placeholder */}
             <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                <path fill="#FFFFFF" d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.3,-41.2C83.5,-26.8,87.6,-11.7,85.6,2.6C83.6,16.9,75.4,30.4,66.1,42.5C56.8,54.6,46.3,65.3,34.1,71.5C21.9,77.7,8,79.4,-4.6,77.3C-17.2,75.2,-28.5,69.3,-39.3,61.9C-50.1,54.5,-60.4,45.6,-68.6,34.7C-76.8,23.8,-82.9,10.9,-81.8,-1.5C-80.7,-13.9,-72.4,-25.8,-63.1,-36.1C-53.8,-46.4,-43.5,-55.1,-32.2,-63.1C-20.9,-71.1,-8.6,-78.4,5.1,-81.3C18.8,-84.2,32.5,-83.3,45.7,-76.3Z" transform="translate(100 100)" />
             </svg>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-lg font-bold text-brand">Event:</span>
            <button className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white shadow-button transition hover:bg-primary-dark">
              Akan Berlangsung
            </button>
            <button className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white shadow-button transition hover:bg-primary-dark">
              Sudah Selesai
            </button>
            <button className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white shadow-button transition hover:bg-primary-dark">
              Sedang Berlangsung
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-full border-none bg-white px-6 py-3 pl-12 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Events List (Left Column) */}
          <div className="lg:col-span-2">
            {isLoading ? (
                <div className="text-center py-10">Memuat event...</div>
            ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
            ) : events.length === 0 ? (
                <div className="text-center py-10">Belum ada event.</div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {events.map((event) => (
                    <div
                    key={event.id || event.idEvent}
                    className="overflow-hidden rounded-2xl bg-white shadow-card transition hover:shadow-lg"
                    >
                    <div className="relative h-48 w-full">
                        <img
                        src={getImageUrl(event.foto)}
                        alt={event.nama}
                        className="h-full w-full object-cover"
                        />
                        <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                        {formatDate(event.tanggalMulai)}
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="mb-2 text-lg font-bold text-brand line-clamp-2 min-h-[56px]">
                        {event.nama}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{event.deskripsi}</p>
                        <button 
                        onClick={() => navigate(`/event/${event.id || event.idEvent}`)}
                        className="mt-4 w-full rounded-full bg-[#4aa731] py-2 text-sm font-bold text-white hover:bg-[#3d8b28]"
                        >
                        Lihat Detail
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            )}
          </div>

          {/* Sidebar Summary (Right Column) */}
          <div className="flex flex-col gap-6">
            {summaryCards.map((card, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl bg-gray-800 p-6 text-white shadow-card"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${card.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
              >
                <h3 className="mb-2 text-xl font-bold">{card.title}</h3>
                <p className="text-sm opacity-90">
                  Terdapat <span className="font-bold">{card.count}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default EventPage
