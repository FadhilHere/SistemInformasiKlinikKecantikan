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
  }
]

const ResultsShowcase = () => {
  return (
    <section className="rounded-[36px] bg-[#1c641c] px-8 py-12 text-white shadow-card">
      <div className="text-center">
        <h2 className="text-3xl font-semibold">Mische Clinic Dengan Hasil Nyata</h2>
        <p className="text-sm text-white/70">
          Lihat perubahan sebelum dan sesudah dari pasien kami.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {RESULTS.map((result) => (
          <ResultCard key={result.title} {...result} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Button variant="light" className="px-8">
          Reservasi Sekarang
        </Button>
      </div>
    </section>
  )
}

export default ResultsShowcase
