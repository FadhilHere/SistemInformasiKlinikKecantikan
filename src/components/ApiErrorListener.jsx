import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AUTO_HIDE_MS = 5000

const ApiErrorListener = () => {
  const [error, setError] = useState(null)
  const timeoutRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleApiError = (event) => {
      const detail = event?.detail || {}
      const status = detail.status

      if (status === 401) {
        navigate('/unauthorized')
        return
      }

      if (status === 403) {
        navigate('/forbidden')
        return
      }

      setError({
        status,
        message:
          detail.message ||
          'Terjadi kesalahan pada server. Silakan coba lagi.'
      })
    }

    window.addEventListener('api:error', handleApiError)
    return () => window.removeEventListener('api:error', handleApiError)
  }, [navigate])

  useEffect(() => {
    if (!error) return undefined

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setError(null)
    }, AUTO_HIDE_MS)

    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [error])

  if (!error) return null

  return (
    <div className="fixed left-1/2 top-6 z-50 w-[min(92vw,520px)] -translate-x-1/2 rounded-2xl border border-red-200 bg-white px-5 py-4 text-left shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-600">
          !
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-red-700">
            {error.status ? `Error ${error.status}` : 'Error'}
          </div>
          <p className="text-sm text-red-600">{error.message}</p>
        </div>
        <button
          type="button"
          onClick={() => setError(null)}
          className="text-xs font-semibold text-red-500 hover:text-red-700"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}

export default ApiErrorListener
