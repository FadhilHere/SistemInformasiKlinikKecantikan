import { useMemo, useState } from 'react'
import Navbar from '../fragments/Navbar'
import PromoCard from '../components/molecules/PromoCard'

const PROMOS = [
  {
    id: 1,
    title: 'Ada Promo Apa Ini?',
    description:
      'Ini adalah salah satu promo paling bagus pada tahun ini dengan diskon paling besar dan beberapa hal menarik lainnya.',
    status: 'active',
    expiresOn: '24 Nov 2025',
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Promo Khusus Member',
    description:
      'Nikmati paket facial intensif untuk member loyal dengan harga spesial sepanjang bulan ini.',
    status: 'expired',
    expiresOn: '10 Nov 2025',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Diskon Treatment Laser',
    description:
      'Treatment laser untuk memudarkan bekas jerawat kini hadir dengan potongan harga menarik.',
    status: 'active',
    expiresOn: '30 Nov 2025',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    title: 'Perawatan Anti Aging',
    description:
      'Paket anti aging terbaik dengan produk berkualitas tinggi untuk menjaga kulit tetap muda.',
    status: 'expired',
    expiresOn: '05 Nov 2025',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80'
  }
]

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

const PromoPage = ({ onShowLanding, onShowLogin, onShowRegister, onNavigate }) => {
  const [query, setQuery] = useState('')
  const filteredPromos = useMemo(() => {
    return PROMOS.filter((promo) =>
      promo.title.toLowerCase().includes(query.toLowerCase().trim())
    )
  }, [query])

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onShowLogin={onShowLogin}
        onShowRegister={onShowRegister}
        onShowLanding={onShowLanding}
        activeRoute="promo"
        onNavigate={onNavigate}
      />
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

        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPromos.map((promo) => (
            <button
              key={promo.id}
              type="button"
              className="text-left"
              onClick={() => onNavigate?.('promoDetail')}
            >
              <PromoCard {...promo} />
            </button>
          ))}
          {filteredPromos.length === 0 && (
            <div className="col-span-full rounded-3xl bg-white p-10 text-center text-brand/70 shadow-card">
              Promo tidak ditemukan. Coba kata kunci lain.
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default PromoPage
