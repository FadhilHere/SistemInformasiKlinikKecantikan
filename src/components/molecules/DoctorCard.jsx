import Button from '../atoms/Button'

const DoctorCard = ({ name, title, description, image }) => {
  return (
    <article className="flex flex-col overflow-hidden rounded-[28px] bg-white/90 text-center shadow-card">
      <img
        src={image}
        alt={name}
        className="h-72 w-full object-cover"
        loading="lazy"
      />
      <div className="flex flex-col gap-2 px-8 pb-10 pt-6">
        <h3 className="text-xl font-semibold text-brand">{name}</h3>
        <p className="text-sm font-medium text-primary-dark uppercase tracking-widest">
          {title}
        </p>
        <p className="text-sm text-brand/70">{description}</p>
        <Button variant="outline" className="mt-4 self-center px-8">
          Lihat Profil
        </Button>
      </div>
    </article>
  )
}

export default DoctorCard
