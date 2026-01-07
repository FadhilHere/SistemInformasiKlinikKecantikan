import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import { apiFetch, API_BASE_URL } from '../lib/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const EventPage = ({ isLoggedIn }) => {
    const navigate = useNavigate()
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('all') // 'all', 'upcoming', 'past', 'ongoing'
    const [searchQuery, setSearchQuery] = useState('')

    // Fetch Events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true)
                const response = await apiFetch('/api/event') 
                const data = response.data || response || []
                
                // Add computed status to each event for easier filtering
                const now = new Date()
                const processed = Array.isArray(data) ? data.map(ev => {
                    const start = new Date(ev.tanggalMulai)
                    const end = new Date(ev.tanggalSelesai)
                    let status = 'upcoming'
                    
                    // Normalize dates to start of day if time is not critical, or keep exact if it is.
                    // Assuming string format like 'YYYY-MM-DD' or ISO.
                    
                    if (end < now) status = 'past'
                    else if (start <= now && end >= now) status = 'ongoing'
                    
                    return { ...ev, computedStatus: status }
                }) : []

                setEvents(processed)
            } catch (error) {
                console.error("Failed to fetch events:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchEvents()
    }, [])

    // Summary Counts
    const summary = {
        upcoming: events.filter(e => e.computedStatus === 'upcoming').length,
        past: events.filter(e => e.computedStatus === 'past').length,
        ongoing: events.filter(e => e.computedStatus === 'ongoing').length
    }

    const summaryCards = [
        {
            title: 'Event Yang Akan Di Selenggarakan',
            count: `${summary.upcoming} Event`,
            status: 'upcoming',
            bgImage: 'https://placehold.co/600x200/53c41a/ffffff?text=Upcoming'
        },
        {
            title: 'Event Yang Sudah Di Selenggarakan',
            count: `${summary.past} Event`,
            status: 'past',
            bgImage: 'https://placehold.co/600x200/64748b/ffffff?text=Past'
        },
        {
            title: 'Event Yang Sedang Di Selenggarakan',
            count: `${summary.ongoing} Event`,
            status: 'ongoing',
            bgImage: 'https://placehold.co/600x200/3b82f6/ffffff?text=Ongoing'
        }
    ]

    // Filtering
    const filteredEvents = events.filter(event => {
        // Search Filter
        const matchSearch = (event.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (event.deskripsi || '').toLowerCase().includes(searchQuery.toLowerCase())
        if (!matchSearch) return false

        // Status Filter
        if (filterStatus === 'all') return true
        return event.computedStatus === filterStatus
    })

    const getImageUrl = (path) => {
        if (!path) return 'https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image';
        if (path.startsWith('http')) return path;
        // Clean path to ensure no double slashes if path has leading slash
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${API_BASE_URL}/storage/${cleanPath}`;
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        try {
            return format(new Date(dateString), 'd MMM yyyy', { locale: id })
        } catch (e) {
            return dateString
        }
    }

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navbar isLoggedIn={isLoggedIn} />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                            <path fill="#FFFFFF" d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.3,-41.2C83.5,-26.8,87.6,-11.7,85.6,2.6C83.6,16.9,75.4,30.4,66.1,42.5C56.8,54.6,46.3,65.3,34.1,71.5C21.9,77.7,8,79.4,-4.6,77.3C-17.2,75.2,-28.5,69.3,-39.3,61.9C-50.1,54.5,-60.4,45.6,-68.6,34.7C-76.8,23.8,-82.9,10.9,-81.8,-1.5C-80.7,-13.9,-72.4,-25.8,-63.1,-36.1C-53.8,-46.4,-43.5,-55.1,-32.2,-63.1C-20.9,-71.1,-8.6,-78.4,5.1,-81.3C18.8,-84.2,32.5,-83.3,45.7,-76.3Z" transform="translate(100 100)" />
                        </svg>
                    </div>
                </div>

                {/* Filter and Search */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-2 text-lg font-bold text-brand">Event:</span>
                        <button 
                            onClick={() => setFilterStatus(filterStatus === 'upcoming' ? 'all' : 'upcoming')}
                            className={`rounded-full px-6 py-2 text-sm font-medium shadow-button transition ${filterStatus === 'upcoming' ? 'bg-primary-dark text-white ring-2 ring-offset-1 ring-primary' : 'bg-primary text-white hover:bg-primary-dark'}`}
                        >
                            Akan Berlangsung
                        </button>
                        <button 
                            onClick={() => setFilterStatus(filterStatus === 'past' ? 'all' : 'past')}
                            className={`rounded-full px-6 py-2 text-sm font-medium shadow-button transition ${filterStatus === 'past' ? 'bg-gray-600 text-white ring-2 ring-offset-1 ring-gray-600' : 'bg-primary text-white hover:bg-primary-dark'}`}
                        >
                            Sudah Selesai
                        </button>
                        <button 
                            onClick={() => setFilterStatus(filterStatus === 'ongoing' ? 'all' : 'ongoing')}
                            className={`rounded-full px-6 py-2 text-sm font-medium shadow-button transition ${filterStatus === 'ongoing' ? 'bg-blue-600 text-white ring-2 ring-offset-1 ring-blue-600' : 'bg-primary text-white hover:bg-primary-dark'}`}
                        >
                            Sedang Berlangsung
                        </button>
                    </div>

                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Cari event..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : filteredEvents.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {filteredEvents.map((event) => (
                                    <div
                                        key={event.id || event.idEvent} 
                                        className="overflow-hidden rounded-2xl bg-white shadow-card transition hover:shadow-lg flex flex-col h-full"
                                    >
                                        <div className="relative h-48 w-full shrink-0">
                                            <img
                                                src={getImageUrl(event.foto)}
                                                alt={event.nama}
                                                className="h-full w-full object-cover"
                                                onError={(e) => { e.target.src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image' }}
                                            />
                                            <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white shadow-sm">
                                                {formatDate(event.tanggalMulai)}
                                            </div>
                                            {/* Status Badge */}
                                            <div className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm
                                                ${event.computedStatus === 'ongoing' ? 'bg-blue-500' : event.computedStatus === 'past' ? 'bg-gray-500' : 'bg-green-500'}`}>
                                                {event.computedStatus === 'ongoing' ? 'Sedang' : event.computedStatus === 'past' ? 'Selesai' : 'Akan Datang'}
                                            </div>
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="mb-2 text-lg font-bold text-brand line-clamp-2">
                                                {event.nama}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                                                {event.deskripsi}
                                            </p>
                                            <button
                                                onClick={() => navigate(`/event/${event.id || event.idEvent}`)}
                                                className="mt-auto w-full rounded-full bg-[#4aa731] py-2 text-sm font-bold text-white hover:bg-[#3d8b28] transition"
                                            >
                                                Lihat Detail
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
                                <p className="text-lg">Tidak ada event yang ditemukan.</p>
                                {filterStatus !== 'all' && (
                                    <button 
                                        onClick={() => setFilterStatus('all')}
                                        className="mt-2 text-primary hover:underline text-sm"
                                    >
                                        Lihat semua event
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar Summary (Right Column) */}
                    <div className="flex flex-col gap-6">
                        {summaryCards.map((card, index) => (
                            <div
                                key={index}
                                onClick={() => setFilterStatus(card.status)}
                                className={`relative overflow-hidden rounded-2xl bg-gray-800 p-6 text-white shadow-card cursor-pointer transition transform hover:scale-[1.02]
                                    ${filterStatus === card.status ? 'ring-2 ring-primary ring-offset-2' : ''}`}
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