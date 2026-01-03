import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import PromoCard from '../components/molecules/PromoCard'
import { apiFetch, API_BASE_URL } from '../lib/api'

const filterIcon = (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
  >
    <path
      d="M4 6h16M7 12h10M10 18h4"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const searchIcon = (
  <svg
    className="h-5 w-5 text-brand"
    viewBox="0 0 24 24"
    stroke="currentColor"
    fill="none"
  >
    <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
    <line
      x1="16.5"
      y1="16.5"
      x2="21"
      y2="21"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)

const PromoPage = ({ isLoggedIn }) => {
  const [query, setQuery] = useState('')
  const [promos, setPromos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPromos = async () => {
      try {
        setIsLoading(true)
        const response = await apiFetch('/api/promo')
        if (response.success && Array.isArray(response.data)) {
          setPromos(response.data)
        } else {
          setPromos([])
        }
      } catch (err) {
        console.error('Error fetching promos:', err)
        setError('Gagal memuat promo.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPromos()
  }, [])

  const filteredPromos = useMemo(() => {
    return promos.filter((promo) =>
      promo.namaPromo.toLowerCase().includes(query.toLowerCase().trim())
    )
  }, [query, promos])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x400?text=No+Image'
    if (path.startsWith('http')) return path
    return `${API_BASE_URL}/storage/${path}`
  }

  // Helper to map backend data to PromoCard props
  const mapPromoToCard = (promo) => {
    // Determine status string for card styling: 'active' or 'expired'
    // Backend has 'status' (boolean) and dates.
    // If status is 1 and today <= tanggalSelesai -> active
    // Else expired
    const isActive = promo.status && new Date(promo.tanggalSelesai) >= new Date();

    return {
      id: promo.id || promo.idPromo,
      title: promo.namaPromo,
      description: promo.deskripsi,
      status: isActive ? 'active' : 'expired',
      expiresOn: formatDate(promo.tanggalSelesai),
      image: getImageUrl(promo.gambar)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="flex w-full max-w-2xl items-center gap-3 rounded-full bg-white px-5 py-3 text-brand shadow-[0_18px_40px_rgba(0,0,0,0.15)] md:flex-1 md:max-w-xl">
            {searchIcon}
            <input
              type="text"
              placeholder="Ayo cari promo terbaru dari Mische..."
              className="w-full border-none bg-transparent text-base text-brand placeholder:text-brand/60 focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <button className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand shadow-[0_18px_40px_rgba(0,0,0,0.15)] transition hover:-translate-y-0.5">
            {filterIcon}
            Filter
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-20">Memuat promo...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">{error}</div>
        ) : (
          <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPromos.map((promo) => (
              <Link
                key={promo.id || promo.idPromo}
                to={`/promo/${promo.id || promo.idPromo}`}
                className="text-left"
              >
                <PromoCard {...mapPromoToCard(promo)} />
              </Link>
            ))}
            {filteredPromos.length === 0 && (
              <div className="col-span-full rounded-3xl bg-white p-10 text-center text-brand/70 shadow-card">
                Promo tidak ditemukan. Coba kata kunci lain.
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default PromoPage