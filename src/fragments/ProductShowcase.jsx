import ProductCard from '../components/molecules/ProductCard'

const PRODUCTS = [
  {
    name: 'Whitening Series',
    description:
      'Rangkaian skincare untuk mencerahkan kulit kusam serta menyamarkan noda hitam.',
    image:
      'https://images.unsplash.com/photo-1612810806546-1790f5cd0c16?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Acne Series',
    description:
      'Formula khusus kulit berjerawat dengan kandungan antibakteri dan soothing agent.',
    image:
      'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'Anti Aging Series',
    description:
      'Mengencangkan kulit dan meminimalisir garis halus dengan retinol dan peptide.',
    image:
      'https://images.unsplash.com/photo-1617301992335-57b9d948e1a2?auto=format&fit=crop&w=600&q=80'
  }
]

const ProductShowcase = () => {
  return (
    <section className="flex flex-col gap-8">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary">
          produk best seller
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-brand">
          Rawat kulit cantikmu dari rumah.
        </h2>
        <p className="text-brand/70">Temukan produk best seller pilihan kami.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PRODUCTS.map((product) => (
          <ProductCard key={product.name} {...product} />
        ))}
      </div>
    </section>
  )
}

export default ProductShowcase
