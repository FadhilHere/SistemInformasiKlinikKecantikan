import { useNavigate } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import Button from '../components/atoms/Button'

// ... TESTIMONIALS ...
// (We replace the top part to add import)

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Bintang',
    text: 'Saya Sangat Senang Bisa Treatment Di Klinik Terbaik Di Pekanbaru Ini...',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    name: 'Bintang',
    text: 'Saya Sangat Senang Bisa Treatment Di Klinik Terbaik Di Pekanbaru Ini...',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    name: 'Bintang',
    text: 'Saya Sangat Senang Bisa Treatment Di Klinik Terbaik Di Pekanbaru Ini...',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80'
  }
]

const TestimonialPage = ({ isLoggedIn }) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      <Navbar isLoggedIn={isLoggedIn} />

      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Title */}
        <div className="mb-12 flex justify-start">
             <h1 className="inline-block rounded-r-full bg-white py-4 pr-12 pl-4 text-3xl font-bold text-[#4aa731] shadow-md md:text-4xl">
                Tesminoni Customer
            </h1>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article 
                key={item.id}
                className="group relative h-[450px] w-full overflow-hidden rounded-tl-[60px] rounded-br-[60px] shadow-card transition-transform hover:-translate-y-1"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#4aa731]/90 via-[#4aa731]/40 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 flex flex-col gap-2 p-6 text-white">
                <h2 className="text-2xl font-bold">
                    {item.name}
                </h2>
                <p className="text-sm font-medium leading-relaxed text-white/90">
                    {item.text}
                </p>
                <Button 
                    variant="primary"
                    className="mt-4 w-fit rounded-full bg-[#53c41a] px-8 py-2 text-sm font-bold text-white shadow-lg border border-transparent hover:bg-[#43a015]"
                    onClick={() => navigate('/testimonial-detail')}
                >
                  Selengkapnya
                </Button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}


export default TestimonialPage
