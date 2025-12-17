import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'

const EventPage = ({
  onShowLogin,
  onShowRegister,
  onShowLanding,
  onNavigate,
  isLoggedIn
}) => {
  const events = [
    {
      id: 1,
      title: 'Seminar Kecantikan DI Politeknik Caltex Riau',
      date: '23 Nov 2025',
      description: 'Bakal Di Adain Di Kampus Ternama Di Riau Yaitu PCR Untuk Penjelasan Nya.....',
      image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Event+Image'
    },
    {
      id: 2,
      title: 'Seminar Kecantikan DI Politeknik Caltex Riau',
      date: '23 Nov 2025',
      description: 'Bakal Di Adain Di Kampus Ternama Di Riau Yaitu PCR Untuk Penjelasan Nya.....',
      image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Event+Image'
    },
    {
      id: 3,
      title: 'Seminar Kecantikan DI Politeknik Caltex Riau',
      date: '23 Nov 2025',
      description: 'Bakal Di Adain Di Kampus Ternama Di Riau Yaitu PCR Untuk Penjelasan Nya.....',
      image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Event+Image'
    },
    {
      id: 4,
      title: 'Seminar Kecantikan DI Politeknik Caltex Riau',
      date: '23 Nov 2025',
      description: 'Bakal Di Adain Di Kampus Ternama Di Riau Yaitu PCR Untuk Penjelasan Nya.....',
      image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Event+Image'
    }
  ]

  const summaryCards = [
    {
      title: 'Event Yang Akan Di Selenggarakan',
      count: '4 Event',
      status: 'Akan Berlangsung',
      bgImage: 'https://placehold.co/600x200/53c41a/ffffff?text=Upcoming'
    },
    {
      title: 'Event Yang Sudah Di Selenggarakan',
      count: '4 Event',
      status: 'Akan Berlangsung', // Text from image seems to be copy-pasted in design, keeping as is or fixing? I'll fix it slightly or keep generic.
      bgImage: 'https://placehold.co/600x200/64748b/ffffff?text=Past'
    },
    {
      title: 'Event Yang Sedang Di Selenggarakan',
      count: '4 Event', // Placeholder
      status: 'Sedang Berlangsung',
      bgImage: 'https://placehold.co/600x200/3b82f6/ffffff?text=Ongoing'
    }
  ]

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar
        onShowLogin={onShowLogin}
        onShowRegister={onShowRegister}
        onShowLanding={onShowLanding}
        activeRoute="event"
        onNavigate={onNavigate}
        isLoggedIn={isLoggedIn}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-[#7ce645] p-8 text-white shadow-lg md:p-12">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Event Yang Di <br /> Selenggarakan Oleh Mische
            </h1>
          </div>
          {/* Decorative Circle/Shape */}
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-3xl"></div>
          <div className="absolute top-0 right-0 h-full w-1/3 opacity-20">
             {/* Abstract shape placeholder */}
             <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                <path fill="#FFFFFF" d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.3,-41.2C83.5,-26.8,87.6,-11.7,85.6,2.6C83.6,16.9,75.4,30.4,66.1,42.5C56.8,54.6,46.3,65.3,34.1,71.5C21.9,77.7,8,79.4,-4.6,77.3C-17.2,75.2,-28.5,69.3,-39.3,61.9C-50.1,54.5,-60.4,45.6,-68.6,34.7C-76.8,23.8,-82.9,10.9,-81.8,-1.5C-80.7,-13.9,-72.4,-25.8,-63.1,-36.1C-53.8,-46.4,-43.5,-55.1,-32.2,-63.1C-20.9,-71.1,-8.6,-78.4,5.1,-81.3C18.8,-84.2,32.5,-83.3,45.7,-76.3Z" transform="translate(100 100)" />
             </svg>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-lg font-bold text-brand">Event:</span>
            <button className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white shadow-button transition hover:bg-primary-dark">
              Akan Berlangsung
            </button>
            <button className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white shadow-button transition hover:bg-primary-dark">
              Sudah Selesai
            </button>
            <button className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-white shadow-button transition hover:bg-primary-dark">
              Sedang Berlangsung
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search"
              className="w-full rounded-full border-none bg-white px-6 py-3 pl-12 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Events List (Left Column) */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-card transition hover:shadow-lg"
                >
                  <div className="relative h-48 w-full">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white">
                      {event.date}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-bold text-brand">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500">{event.description}</p>
                    <button 
                      onClick={() => onNavigate('event-detail')}
                      className="mt-4 w-full rounded-full bg-[#4aa731] py-2 text-sm font-bold text-white hover:bg-[#3d8b28]"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Summary (Right Column) */}
          <div className="flex flex-col gap-6">
            {summaryCards.map((card, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl bg-gray-800 p-6 text-white shadow-card"
                style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${card.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
              >
                <h3 className="mb-2 text-xl font-bold">{card.title}</h3>
                <p className="text-sm opacity-90">
                  Terdapat <span className="font-bold">{card.count}</span> Yang
                  Akan Berlangsung
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="mx-auto max-w-7xl px-4 pb-12">
        <Footer />
      </div>
    </div>
  )
}

export default EventPage
