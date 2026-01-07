import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ResultCard from '../components/molecules/ResultCard'
import Button from '../components/atoms/Button'

const RESULTS = [
  {
    title: 'Botox',
    beforeImage:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Mesoflex',
    beforeImage:
      'https://images.unsplash.com/photo-1519415943484-9fa1873496b1?auto=format&fit=crop&w=400&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Lip Laser Rejuvenation',
    beforeImage:
      'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=400&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1433068738882-02d2babc5b8c?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Acne Scar Treatment',
    beforeImage:
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=400&q=80',
    afterImage:
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=400&q=80'
  }
]

const ResultsShowcase = () => {
  const navigate = useNavigate()
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
    <section className="w-full bg-[#2f7f00] py-16 text-white">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-bold md:text-4xl">Mische Clinic Dengan Hasil Nyata</h2>
      </div>

      <div className="mt-12 overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto px-8 pb-8 pt-4 cursor-grab active:cursor-grabbing"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollSnapType: isDragging ? 'none' : 'x mandatory' // Disable snap while dragging for smoothness
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
          {RESULTS.map((result) => (
            <div key={result.title} className="min-w-[300px] flex-shrink-0 snap-center md:min-w-[400px] select-none">
              <ResultCard {...result} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
            className="rounded-full bg-[#8cc63f] px-10 py-4 text-lg font-bold text-white shadow-lg hover:bg-[#7ab332] transition-transform hover:-translate-y-1"
            onClick={() => navigate('/reservation')}
        >
          Reservasi Sekarang
        </Button>
      </div>
    </section>
  )
}

export default ResultsShowcase
