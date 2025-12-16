import Button from '../atoms/Button'

const TreatmentCard = ({ name, description, image }) => {
  return (
    <article className="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-card">
      <img
        src={image}
        alt={name}
        className="h-44 w-full rounded-2xl object-cover"
        loading="lazy"
      />
      <div>
        <h3 className="text-lg font-semibold text-brand">{name}</h3>
        <p className="mt-2 text-sm text-brand/70">{description}</p>
      </div>
      <Button variant="outline" className="mt-auto w-full">
        Lihat Selengkapnya
      </Button>
    </article>
  )
}

export default TreatmentCard
