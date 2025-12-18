import Button from '../atoms/Button'

const TreatmentCard = ({ name, description, image }) => {
  return (
    <article className="flex h-[480px] w-[300px] flex-col overflow-hidden rounded-br-[40px] rounded-tl-[40px] bg-white shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
      <div className="h-[45%] w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-[#4aa731]">{name}</h3>
        <div className="mt-3 h-0.5 w-full bg-[#4aa731]"></div>
        <p className="mt-4 text-xs leading-relaxed text-gray-500 line-clamp-4">
          {description}
        </p>
        <div className="mt-auto pt-4">
          <Button className="w-full rounded-full bg-[#4aa731] py-3 text-sm font-bold text-white hover:bg-[#3d8b28] shadow-button">
            Lihat Selengkapnya
          </Button>
        </div>
      </div>
    </article>
  )
}

export default TreatmentCard
