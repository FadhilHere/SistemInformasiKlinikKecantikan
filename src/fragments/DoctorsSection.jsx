import DoctorCard from '../components/molecules/DoctorCard'

const DOCTORS = [
  {
    name: 'Dr. Widya Finanda',
    title: 'Dermatolog',
    description:
      'Dokter dengan pengalaman 20 tahun di dunia kecantikan dan sering menjadi pembicara nasional.',
    image:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Dr. Riefni Silara Dini',
    title: 'Estetika',
    description:
      'Ahli perawatan wajah yang telah menangani lebih dari 5.000 pasien dengan berbagai kondisi kulit.',
    image:
      'https://images.unsplash.com/photo-1544723795-432537f2b12b?auto=format&fit=crop&w=600&q=80'
  }
]

const DoctorsSection = () => {
  return (
    <section className="flex flex-col gap-10">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">
          tim dokter
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-brand">
          Dokter kami siap membantu merawat kebutuhan kulitmu.
        </h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {DOCTORS.map((doctor) => (
          <DoctorCard key={doctor.name} {...doctor} />
        ))}
      </div>
    </section>
  )
}

export default DoctorsSection
