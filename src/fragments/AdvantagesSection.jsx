import AdvantageItem from '../components/molecules/AdvantageItem'

const icons = {
  care: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor">
      <path
        d="M12 21s-8-4.5-8-10.5a4.5 4.5 0 0 1 8-2.5 4.5 4.5 0 0 1 8 2.5C20 16.5 12 21 12 21z"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  specialist: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor">
      <path
        d="M12 12a4 4 0 1 0-0.01-8.01A4 4 0 0 0 12 12zm0 2c-4 0-6 2-6 4v2h12v-2c0-2-2-4-6-4z"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  relax: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor">
      <path
        d="M3 12h18M4 5h16M6 19h12"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  monitoring: (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor">
      <path
        d="M3 5h18v14H3z"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 15l3-4 3 2 4-5"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const ADVANTAGES = [
  {
    title: 'Perawatan Personal',
    description:
      'Perawatan yang dipersonalisasi sesuai kondisi kulit untuk hasil optimal.',
    icon: icons.care
  },
  {
    title: 'Dokter Berpengalaman',
    description:
      'Spesialis perawatan kulit berjenjang ditangani dokter berpengalaman.',
    icon: icons.specialist
  },
  {
    title: 'Relaksasi Premium',
    description:
      'Menggabungkan relaksasi facial dan totok wajah dengan produk premium.',
    icon: icons.relax
  },
  {
    title: 'Pemantauan Intensif',
    description: 'Pemantauan hasil yang terarah untuk perawatan lebih tepat.',
    icon: icons.monitoring
  }
]

const AdvantagesSection = () => {
  return (
    <section className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-brand">
          Keunggulan Mische Dibanding Beauty Clinic Lain
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {ADVANTAGES.map((advantage) => (
          <AdvantageItem key={advantage.title} {...advantage} />
        ))}
      </div>
    </section>
  )
}

export default AdvantagesSection
