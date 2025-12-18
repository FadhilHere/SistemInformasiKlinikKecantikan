import { useNavigate } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import Button from '../components/atoms/Button'

const DOCTORS = [
    {
        id: 1,
        name: 'Dr. WIDYA FINANDA',
        description: 'Dokter Dengan Pengalaman Selama 20 Tahun Di Dunia Kecantikan.....',
        image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80',
        link: '/doctor-detail'
    },
    {
        id: 2,
        name: 'Dr. RIEFNI SILARA DINI',
        description: 'Dokter Dengan Pengalaman Selama 20 Tahun Di Dunia Kecantikan.....',
        image: 'https://images.unsplash.com/photo-1544723795-432537f2b12b?auto=format&fit=crop&w=600&q=80',
        link: '#' // Assuming generic or same detail page for now
    }
]

const DoctorsPage = ({ isLoggedIn }) => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-sans">
            <Navbar isLoggedIn={isLoggedIn} />

            <main className="mx-auto max-w-6xl px-4 py-12">
                {/* Title */}
                <div className="mb-12 flex justify-start">
                    <h1 className="inline-block rounded-r-full bg-white py-4 pr-12 pl-4 text-3xl font-bold text-[#4aa731] shadow-md md:text-4xl">
                        Tentang Dokter
                    </h1>
                </div>

                {/* Doctors Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
                    {DOCTORS.map((doctor) => (
                        <article
                            key={doctor.id}
                            className="group relative h-[500px] w-full overflow-hidden rounded-tl-[60px] rounded-br-[60px] shadow-card transition-transform hover:-translate-y-1"
                        >
                            {/* Image */}
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#4aa731]/80 via-[#4aa731]/30 to-transparent" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 flex flex-col gap-3 p-8 text-white">
                                <h2 className="text-3xl font-bold uppercase leading-tight">
                                    {doctor.name}
                                </h2>
                                <p className="text-sm font-medium leading-relaxed text-white/90">
                                    {doctor.description}
                                </p>
                                <Button
                                    variant="primary"
                                    className="mt-4 w-fit rounded-full bg-[#53c41a] px-8 py-3 text-sm font-bold text-white shadow-lg border border-transparent hover:bg-[#43a015]"
                                    onClick={() => navigate(doctor.link)}
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

export default DoctorsPage
