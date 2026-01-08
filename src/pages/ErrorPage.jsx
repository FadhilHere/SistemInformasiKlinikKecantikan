import { Link, useLocation, useParams } from 'react-router-dom'
import Navbar from '../fragments/Navbar'

const COPY = {
  'not-found': {
    title: 'Halaman tidak ditemukan',
    message: 'Sepertinya halaman yang kamu cari tidak tersedia.'
  },
  unauthorized: {
    title: 'Akses tidak diizinkan',
    message: 'Silakan login terlebih dahulu untuk melanjutkan.'
  },
  forbidden: {
    title: 'Akses ditolak',
    message: 'Kamu tidak punya izin untuk membuka halaman ini.'
  },
  'app-error': {
    title: 'Terjadi kesalahan',
    message: 'Ada masalah saat memuat halaman. Coba refresh atau kembali.'
  }
}

const ErrorPage = ({ kind }) => {
  const location = useLocation()
  const params = useParams()
  const resolvedKind = kind || params.kind || 'not-found'
  const content = COPY[resolvedKind] || COPY['not-found']

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand/10 text-4xl font-semibold text-brand">
          !
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-brand">{content.title}</h1>
          <p className="text-brand/70">{content.message}</p>
          {resolvedKind === 'not-found' && (
            <p className="text-sm text-brand/50">
              URL: <span className="font-medium">{location.pathname}</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {resolvedKind === 'unauthorized' ? (
            <Link
              to="/login"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Login
            </Link>
          ) : (
            <Link
              to="/"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Kembali ke Beranda
            </Link>
          )}
          <button
            type="button"
            className="rounded-full border border-brand/20 px-6 py-3 text-sm font-semibold text-brand transition hover:bg-brand/5"
            onClick={() => window.location.reload()}
          >
            Muat Ulang
          </button>
        </div>
      </main>
    </div>
  )
}

export default ErrorPage
