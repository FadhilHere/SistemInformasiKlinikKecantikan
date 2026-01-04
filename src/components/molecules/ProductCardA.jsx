import Button from '../atoms/Button'

const ProductCardA = ({ name, description, image }) => {
  return (
    <article className="flex flex-col gap-3 rounded-[26px] bg-white p-5 text-center shadow-card">
      <img
        src={image}
        alt={name}
        className="h-48 w-full rounded-2xl object-cover"
        loading="lazy"
      />
      <h3 className="text-lg font-semibold text-brand">{name}</h3>
      <p className="text-sm text-brand/65">{description}</p>
      <Button variant="outline" className="mt-auto">
        Lihat Produk
      </Button>
    </article>
  )
}

export default ProductCardA
