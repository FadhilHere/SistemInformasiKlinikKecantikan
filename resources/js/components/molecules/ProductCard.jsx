import Button from '../atoms/Button'

const ProductCard = ({ name, description, image }) => {
  return (
    <article className="flex h-[500px] flex-col overflow-hidden rounded-br-[40px] rounded-tl-[40px] bg-white shadow-lg transition-transform hover:-translate-y-1">
      <div className="h-[70%] w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-6 text-left">
        <h3 className="text-xl font-bold uppercase text-[#4aa731]">{name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          {description}
        </p>
        <div className="mt-auto">
          <Button className="rounded-full bg-[#4aa731] px-8 py-2 text-sm font-bold text-white shadow-lg hover:bg-[#3d8b28]">
            Lihat Produk
          </Button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
