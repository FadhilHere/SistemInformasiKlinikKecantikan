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
  }
]

const TreatmentsSection = () => {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      <div className="rounded-[32px] bg-gradient-to-b from-[#65ce4d] to-[#4aa731] p-10 text-white shadow-card">
        <h2 className="text-3xl font-semibold leading-tight">
          Temukan Perawatan Wajah Dan Kulit Terbaik Dari Mische Aesthetic Clinic
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-white/90">
          Menghadirkan berbagai pilihan treatment berkualitas untuk memenuhi
          kebutuhan kecantikan dan kesehatan kulit Anda. Lihat berbagai jenis
          perawatan unggulan yang tersedia pada card di samping dan pilih
          treatment yang sesuai dengan kebutuhan Anda untuk mendapatkan hasil
          maksimal.
        </p>
      </div>

      <div className="grid gap-6">
        {TREATMENTS.map((treatment) => (
          <TreatmentCard key={treatment.name} {...treatment} />
        ))}
      </div>
    </section>
  )
}

export default TreatmentsSection
