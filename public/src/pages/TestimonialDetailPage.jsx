import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import { apiFetch, API_BASE_URL } from '../lib/api'

const TestimonialDetailPage = ({ isLoggedIn }) => {
    const { id } = useParams()
    const [testimonial, setTestimonial] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setIsLoading(true)
                const response = await apiFetch(`/api/testimoni/${id}`)
                if (response.success) {
                    setTestimonial(response.data)
                } else {
                    throw new Error('Testimoni tidak ditemukan')
                }
            } catch (err) {
                console.error(err)
                setError('Gagal memuat detail testimoni.')
            } finally {
                setIsLoading(false)
            }
        }

        if (id) fetchDetail()
    }, [id])

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/800x600?text=No+Image'
        if (path.startsWith('http')) return path
        return `${API_BASE_URL}/${path}`
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        })
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f9f9f9]">
                <Navbar isLoggedIn={isLoggedIn} />
                <div className="flex justify-center py-20">Memuat...</div>
            </div>
        )
    }

    if (error || !testimonial) {
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
                        Testimoni Customer
                    </h1>
                </div>

                {/* Content Card */}
                <div className="flex flex-col overflow-hidden rounded-[40px] bg-white shadow-xl md:flex-row">

                    {/* Left: Image */}
                    <div className="w-full md:w-2/5">
                        <div className="h-full min-h-[400px] w-full bg-gray-100">
                            <img
                                src={getImageUrl(testimonial.buktiFoto)}
                                alt={testimonial.namaTester}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex w-full flex-col justify-center p-8 md:w-3/5 md:p-12">
                        <h2 className="mb-4 text-4xl font-bold text-black">
                            {testimonial.namaTester}
                        </h2>

                        <div className="mb-6 flex items-center gap-4">
                            <span className="rounded-full bg-[#53c41a] px-6 py-2 text-lg font-bold text-white shadow-sm">
                                {formatDate(testimonial.tanggalTreatment)}
                            </span>
                            <span className="text-xl font-bold text-[#53c41a]">
                                {testimonial.jenisTestimoni}
                            </span>
                        </div>

                        <div className="text-justify text-lg leading-relaxed text-black/80">
                            <p>
                                {testimonial.deskripsi}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default TestimonialDetailPage