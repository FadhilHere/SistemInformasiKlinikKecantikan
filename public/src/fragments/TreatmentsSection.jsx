import { useState, useRef } from 'react'
import TreatmentCard from '../components/molecules/TreatmentCard'

const TREATMENTS = [
  {
    name: 'Regular Facial',
    description:
      'Perawatan dasar untuk peremajaan serta membersihkan komedo. Ideal untuk kulit normal.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Intensive Facial',
    description:
      'Fokus pada jerawat aktif dengan kombinasi deep cleansing, ekstraksi, dan LED therapy.',
    image:
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Skin Peel',
    description:
      'Mengurangi hiperpigmentasi dan mempercepat regenerasi sel melalui peeling khusus.',
    image:
      'https://images.unsplash.com/photo-1542838686-73e537bac21b?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Laser Rejuvenation',
    description:
      'Teknologi laser canggih untuk meremajakan kulit dan menghilangkan noda hitam.',
    image:
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80'
  }
]

const TreatmentsSection = () => {
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll-fast
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <section className="flex flex-col lg:flex-row lg:h-[600px] w-full bg-white">
      {/* Left Panel */}
      <div className="relative flex w-full flex-col justify-center overflow-hidden bg-gradient-to-br from-[#5bc244] to-[#4aa731] p-12 text-white shadow-2xl lg:w-[35%]">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">
            Temukan Perawatan Wajah Dan Kulit Terbaik Dari Mische Aesthetic Clinic
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-white/90">
            Temukan Perawatan Wajah Dan Kulit Terbaik Bersama Mische Aesthetic
            Clinic, Yang Menghadirkan Beragam Pilihan Treatment Berkualitas Untuk
            Memenuhi Kebutuhan Kecantikan Dan Kesehatan Kulit Anda. Lihat
            Berbagai Jenis Perawatan Unggulan Yang Tersedia Pada Card Di Samping
            Dan Pilih Treatment Yang Sesuai Dengan Kebutuhan Anda Untuk
            Mendapatkan Hasil Maksimal.
          </p>
        </div>
        {/* Decorative Curve Overlay */}
        <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/4 translate-y-1/4 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/4 translate-y-1/4 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      {/* Right Carousel */}
      <div className="relative w-full lg:w-[65%] flex items-center bg-white py-12 lg:py-0">
        <div className="relative w-full overflow-hidden px-8">
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-8 pt-4 cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollSnapType: isDragging ? 'none' : 'x mandatory'
            }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <style>
              {`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
              `}
            </style>
            {TREATMENTS.map((treatment) => (
              <div key={treatment.name} className="min-w-[300px] flex-shrink-0 snap-center select-none">
                <TreatmentCard {...treatment} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TreatmentsSection
