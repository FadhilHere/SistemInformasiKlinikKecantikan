import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import Button from '../components/atoms/Button'
import { apiFetch, API_BASE_URL } from '../lib/api'

const calendarIcon = (
  <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 7h14M7 3v4M17 3v4M6 11h12v9H6z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const voucherIcon = (
  <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 7.5a2.5 2.5 0 0 0 0 5v4a2.5 2.5 0 0 1 2.5 2.5h13a2.5 2.5 0 0 1 2.5-2.5v-4a2.5 2.5 0 0 0 0-5v-4A2.5 2.5 0 0 1 18.5 1h-13A2.5 2.5 0 0 1 3 3.5v4Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M9 8h6M9 12h6M9 16h6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
)

const bagIcon = (
  <svg className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 8h12l1.5 12.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5L6 8Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M9 8V6a3 3 0 1 1 6 0v2"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
)

const PromoDetailPage = ({ isLoggedIn }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [promo, setPromo] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true)
        const response = await apiFetch(`/api/promo/${id}`)
        if (response.success) {
          setPromo(response.data)
        } else {
          throw new Error('Promo tidak ditemukan')
        }
      } catch (err) {
        console.error(err)
        setError('Gagal memuat detail promo.')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchDetail()
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/1600x600?text=No+Image'
    if (path.startsWith('http')) return path
    return `${API_BASE_URL}/storage/${path}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isLoggedIn={isLoggedIn} />
        <div className="flex justify-center py-20">Memuat...</div>
      </div>
    )
  }

  if (error || !promo) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar isLoggedIn={isLoggedIn} />
        <div className="flex justify-center py-20 text-red-500">{error || 'Promo tidak ditemukan'}</div>
      </div>
    )
  }

  const isActive = promo.status && new Date(promo.tanggalSelesai) >= new Date();

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12">
        <section className="overflow-hidden rounded-tl-[36px] rounded-br-[36px] rounded-tr-none rounded-bl-none bg-white shadow-card">
          <img
            src={getImageUrl(promo.gambar)}
            alt={promo.namaPromo}
            className="h-[360px] w-full object-cover"
          />
          <div className="space-y-6 px-8 py-8 text-brand">
            <h1 className="text-3xl font-semibold">{promo.namaPromo}</h1>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#f3fff2] px-4 py-3 text-sm font-semibold text-primary">
              <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-brand">
                {calendarIcon}
                {formatDate(promo.tanggalMulai)}
              </span>
              <span className="px-4 text-brand">-</span>
              <span className="rounded-full bg-white px-4 py-2 text-brand">
                {formatDate(promo.tanggalSelesai)}
              </span>
            </div>
            <p className="leading-relaxed text-brand/80">{promo.deskripsi}</p>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-tl-[28px] rounded-br-[28px] rounded-tr-none rounded-bl-none bg-white p-6 shadow-card">
            <div className="flex items-center gap-4">
              {voucherIcon}
              <div>
                <h3 className="text-lg font-semibold text-brand">Code Voucher</h3>
                <p className="text-sm text-brand/70">Status : {isActive ? 'Masih Berlaku' : 'Tidak Berlaku'}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-full bg-[#f3fff2] px-4 py-3 font-semibold tracking-widest text-brand">
              <span>{promo.kode.replace(/[A-Z0-9]/g, '*')}</span>
              <Button variant="light" className="px-3 py-1 text-sm text-primary">
                Lihat
              </Button>
            </div>
          </div>

          <div className="rounded-tl-[28px] rounded-br-[28px] rounded-tr-none rounded-bl-none bg-white p-6 shadow-card">
            <div className="flex items-center gap-4">
              {bagIcon}
              <div>
                <h3 className="text-lg font-semibold text-brand">Kategori Produk</h3>
                <p className="text-sm text-brand/70">
                  Jenis :{' '}
                  <span className="font-semibold text-brand">{promo.jenisPromo}</span>
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              className="mt-6 w-full"
              onClick={() => navigate('/products')}
            >
              Lihat Semua Produk
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default PromoDetailPage