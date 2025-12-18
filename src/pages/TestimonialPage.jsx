import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import Button from '../components/atoms/Button'
import { apiFetch, API_BASE_URL } from '../lib/api'

const TestimonialPage = ({ isLoggedIn }) => {
  const navigate = useNavigate()
  const [testimonials, setTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true)
        const response = await apiFetch('/api/testimoni')
        // Backend returns: { success: true, data: [...] }
        if (response.success && Array.isArray(response.data)) {
          setTestimonials(response.data)
        } else {
          setTestimonials([])
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err)
        setError('Gagal memuat testimoni.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x400?text=No+Image'
    // If it's already a full URL (e.g. from seed data), return it
    if (path.startsWith('http')) return path
    // Otherwise prepend API_BASE_URL. Note: Backend saves as 'uploads/...' which typically needs '/' before it if base is domain
    return `${API_BASE_URL}/${path}`
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Title */}
        <div className="mb-12 flex justify-start">
             <h1 className="inline-block rounded-r-full bg-white py-4 pr-12 pl-4 text-3xl font-bold text-[#4aa731] shadow-md md:text-4xl">
                Testimoni Customer
            </h1>
        </div>

        {/* Testimonials Grid */}
        {isLoading ? (
             <div className="py-20 text-center">
                <p className="text-gray-500">Memuat testimoni...</p>
             </div>
        ) : error ? (
             <div className="py-20 text-center">
                <p className="text-red-500">{error}</p>
             </div>
        ) : testimonials.length === 0 ? (
             <div className="py-20 text-center">
                <p className="text-gray-500">Belum ada testimoni saat ini.</p>
             </div>
        ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((item) => (
                <article 
                    key={item.id || item.idTestimoni}
                    className="group relative h-[450px] w-full overflow-hidden rounded-tl-[60px] rounded-br-[60px] shadow-card transition-transform hover:-translate-y-1"
                >
                  {/* Image */}
                  <img
                    src={getImageUrl(item.buktiFoto)}
                    alt={item.namaTester}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4aa731]/90 via-[#4aa731]/40 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 flex flex-col gap-2 p-6 text-white w-full">
                    <h2 className="text-2xl font-bold">
                        {item.namaTester}
                    </h2>
                    <p className="text-sm font-medium leading-relaxed text-white/90 line-clamp-3">
                        {item.deskripsi}
                    </p>
                    <Button 
                        variant="primary"
                        className="mt-4 w-fit rounded-full bg-[#53c41a] px-8 py-2 text-sm font-bold text-white shadow-lg border border-transparent hover:bg-[#43a015]"
                        onClick={() => navigate(`/testimonials/${item.id || item.idTestimoni}`)}
                    >
                      Selengkapnya
                    </Button>
                  </div>
                </article>
              ))}
            </div>
        )}
      </main>

      <Footer />
    </div>
  )
}


export default TestimonialPage
