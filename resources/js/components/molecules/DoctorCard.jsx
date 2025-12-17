import Button from '../atoms/Button'

const DoctorCard = ({ name, description, image }) => {
  return (
    <article className="group relative h-[500px] w-full overflow-hidden rounded-tl-[60px] rounded-br-[60px] shadow-card transition-transform hover:-translate-y-1">
      {/* Background Image */}
      <img
        src={image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#4aa731]/90 via-[#4aa731]/40 to-transparent opacity-90" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 flex flex-col gap-3 p-8 text-white">
        <h3 className="text-3xl font-bold uppercase leading-tight">{name}</h3>
        <p className="text-sm font-medium leading-relaxed text-white/90">
          {description}
        </p>
        <Button className="mt-4 w-fit rounded-full bg-[#53c41a] px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-[#43a015] border border-white/20">
          Lihat Profil
        </Button>
      </div>
    </article>
  )
}

export default DoctorCard
