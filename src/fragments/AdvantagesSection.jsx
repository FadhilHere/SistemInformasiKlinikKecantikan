import AdvantageItem from '../components/molecules/AdvantageItem'

const icons = {
  care: (
    <svg viewBox="0 0 24 24" className="h-16 w-16 text-[#4aa731]" fill="currentColor">
       <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
       <circle cx="12" cy="9" r="3" fill="white"/>
       <path d="M12 7.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5" fill="#4aa731"/>
    </svg>
  ),
  specialist: (
    <svg viewBox="0 0 24 24" className="h-16 w-16 text-[#4aa731]" fill="currentColor">
       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/> 
       {/* Using a generic doctor/info icon as placeholder for complex doctor path, or I can try a better one */}
       <path d="M12 4a4 4 0 0 1 4 4c0 1.66-1.01 3.08-2.42 3.71C15.93 12.38 18 14.09 18 16v2H6v-2c0-1.91 2.07-3.62 4.42-4.29C9.01 11.08 8 9.66 8 8a4 4 0 0 1 4-4" />
    </svg>
  ),
  relax: (
    <svg viewBox="0 0 24 24" className="h-16 w-16 text-[#4aa731]" fill="currentColor">
       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v-2h2v2h2v2h-2v2h-2v-2z" />
       <path d="M12 6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3" />
    </svg>
  ),
  monitoring: (
    <svg viewBox="0 0 24 24" className="h-16 w-16 text-[#4aa731]" fill="currentColor">
       <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5l-1 2h10l-1-2h5c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V6h18v12zM6.5 10h2l2-3 2 6 2-3h3v2h-4l-2 3-2-6-2 3h-3z"/>
    </svg>
  ),
  product: (
    <svg viewBox="0 0 24 24" className="h-16 w-16 text-[#4aa731]" fill="currentColor">
       <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
    </svg>
  )
}

const ADVANTAGES = [
  {
    title: 'Perawatan Yang Dipersonalisasi Sesuai Kondisi Kulit',
    description:
      'Untuk Perawatan Lebih Tepat.',
    icon: icons.care
  },
  {
    title: 'Spesialisasi Perawatan Kulit Berjerawat',
    description:
      'Ditangani Oleh Dokter Berpengalaman',
    icon: icons.specialist
  },
  {
    title: 'Menggabungkan Relaksasi (Facial + Totok Wajah)',
    description:
      'Perawatan Wajah',
    icon: icons.relax
  },
  {
    title: 'Pemantauan Hasil Yang Terarah.',
    description: 'Untuk Perawatan Lebih Tepat.',
    icon: icons.monitoring
  },
  {
    title: 'Penggunaan Produk Skincare Berkualitas Tinggi',
    description: 'Skincare Berkualitas Untuk Hasil Maksimal.',
    icon: icons.product
  }
]

const AdvantagesSection = () => {
  return (
    <section className="flex flex-col gap-12 py-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#4aa731]">
          Keunggulan Mische Dibanding Beauty Clinic Lain
        </h2>
      </div>
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
        {ADVANTAGES.map((advantage) => (
          <div key={advantage.title} className="flex flex-row items-center gap-6 p-4">
             <div className="flex-shrink-0">
                {advantage.icon}
             </div>
             <div>
                <h3 className="text-lg font-bold text-black leading-tight mb-1">{advantage.title}</h3>
                <p className="text-sm font-medium text-gray-600">{advantage.description}</p>
             </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdvantagesSection
