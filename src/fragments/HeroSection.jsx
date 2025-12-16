import Button from '../components/atoms/Button'

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#0f8d21] via-[#3fb149] to-[#9de36b] px-8 py-12 text-white shadow-card lg:grid lg:grid-cols-2 lg:items-center">
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold uppercase tracking-[0.6em] text-white/80">
          mische clinic
        </span>
        <h1 className="text-4xl font-semibold leading-tight">
          The First Acne Expert In Town
        </h1>
        <p className="rounded-full bg-white/15 px-5 py-3 text-sm font-medium tracking-wide">
          Atasi berbagai masalah kulit dan wajah
        </p>
        <Button variant="light" className="mt-4 w-fit px-10 py-3">
          Reservasi Sekarang
        </Button>
      </div>

      <div className="relative mt-10 flex justify-center lg:mt-0">
        <img
          src="https://images.unsplash.com/photo-1506898665064-fb3e568bbc05?auto=format&fit=crop&w=600&q=80"
          alt="Model with clean skin"
          className="z-10 h-[360px] w-[320px] rounded-[48px] object-cover shadow-2xl"
        />
        <div className="absolute inset-y-12 left-1/2 h-[80%] w-3/4 -translate-x-1/2 rounded-[48px] bg-white/20 blur-3xl" />
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        <span className="h-1.5 w-12 rounded-full bg-white" />
        <span className="h-1.5 w-6 rounded-full bg-white/50" />
        <span className="h-1.5 w-6 rounded-full bg-white/50" />
      </div>
    </section>
  )
}

export default HeroSection
