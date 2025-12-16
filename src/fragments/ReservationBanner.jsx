import Button from '../components/atoms/Button'

const ReservationBanner = () => {
  return (
    <section className="rounded-[32px] bg-gradient-to-r from-[#1f701d] to-[#3fb149] px-10 py-10 text-center text-white shadow-card md:text-left">
      <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <h2 className="text-3xl font-semibold">
            Reservasi Mudah Dengan Layanan Online Kami
          </h2>
          <p className="text-white/80">
            Konsultasi dengan dokter ahli tanpa harus menunggu lama.
          </p>
        </div>
        <Button variant="light" className="px-10">
          Reservasi Sekarang
        </Button>
      </div>
    </section>
  )
}

export default ReservationBanner
