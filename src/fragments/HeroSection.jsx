import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/atoms/Button'

const SLIDES = [
  {
    id: 1,
    title: 'The First Acne Expert In Town',
    subtitle: 'Atasi Berbagai Masalah Kulit Dan Wajah',
    image: 'https://images.unsplash.com/photo-1506898665064-fb3e568bbc05?auto=format&fit=crop&w=600&q=80',
    bgGradient: 'from-[#0f8d21] via-[#3fb149] to-[#9de36b]'
  },
  {
    id: 2,
    title: 'Solusi Kulit Sehat & Cerah',
    subtitle: 'Perawatan Terbaik Untuk Kulit Impianmu',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80',
    bgGradient: 'from-[#0f8d21] via-[#3fb149] to-[#9de36b]'
  },
  {
    id: 3,
    title: 'Teknologi Laser Terbaru',
    subtitle: 'Hasil Nyata Dalam Sekali Treatment',
    image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80',
    bgGradient: 'from-[#0f8d21] via-[#3fb149] to-[#9de36b]'
  }
]

const HeroSection = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)

  // Clone first and last slides for infinite loop effect
  const extendedSlides = [
    { ...SLIDES[SLIDES.length - 1], uniqueId: 'clone-last' },
    ...SLIDES.map(s => ({ ...s, uniqueId: s.id })),
    { ...SLIDES[0], uniqueId: 'clone-first' }
  ]

  const startAutoplay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      nextSlide()
    }, 5000)
  }

  useEffect(() => {
    startAutoplay()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (currentIndex === extendedSlides.length - 1) {
      // We reached the clone of the first slide (at the end)
      // Wait for transition to finish, then snap back to real first slide
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(1)
      }, 500)
    } else if (currentIndex === 0) {
      // We reached the clone of the last slide (at the beginning)
      // Wait for transition to finish, then snap back to real last slide
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false)
        setCurrentIndex(SLIDES.length)
      }, 500)
    }
  }, [currentIndex])

  const nextSlide = () => {
    if (currentIndex >= extendedSlides.length - 1) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
    startAutoplay() // Reset timer
  }

  const prevSlide = () => {
    if (currentIndex <= 0) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
    startAutoplay() // Reset timer
  }

  // Calculate the active dot index (0-based relative to original SLIDES)
  const getActiveDotIndex = () => {
    if (currentIndex === 0) return SLIDES.length - 1
    if (currentIndex === extendedSlides.length - 1) return 0
    return currentIndex - 1
  }

  return (
    <section className="relative overflow-hidden shadow-card group">
      <div 
        className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {extendedSlides.map((slide, index) => (
          <div 
            key={`${slide.uniqueId}-${index}`}
            className={`min-w-full bg-gradient-to-r ${slide.bgGradient} py-12 text-white`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:px-8">
              <div className="flex flex-col gap-4 pl-0 lg:pl-8">
                <span className="text-sm font-semibold uppercase tracking-[0.6em] text-white/80">
                  mische clinic
                </span>
                <h1 className="text-4xl font-semibold leading-tight lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="w-fit rounded-full bg-white/20 px-5 py-3 text-sm font-medium tracking-wide backdrop-blur-sm">
                  {slide.subtitle}
                </p>
                <Button 
                    variant="light" 
                    className="mt-4 w-fit px-10 py-3 text-primary font-bold"
                    onClick={() => navigate('/reservation')}
                >
                  Reservasi Sekarang
                </Button>
              </div>

              <div className="relative mt-10 flex justify-center lg:mt-0">
                <div className="relative z-10 h-[360px] w-[320px] overflow-hidden rounded-[48px] shadow-2xl">
                   <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute inset-y-12 left-1/2 h-[80%] w-3/4 -translate-x-1/2 rounded-[48px] bg-white/20 blur-3xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/40 lg:left-8 opacity-0 group-hover:opacity-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/40 lg:right-8 opacity-0 group-hover:opacity-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true)
              setCurrentIndex(index + 1)
              startAutoplay()
            }}
            className={`h-1.5 rounded-full transition-all ${
              getActiveDotIndex() === index ? 'w-12 bg-white' : 'w-6 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroSection
