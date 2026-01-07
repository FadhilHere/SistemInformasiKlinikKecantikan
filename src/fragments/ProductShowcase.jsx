import { useNavigate } from 'react-router-dom'
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
    const navigate = useNavigate()

  return (
    <section className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="mx-auto max-w-3xl text-2xl font-bold leading-relaxed text-[#4aa731] md:text-3xl">
          Rawat Kulit Cantikmu Dari Rumah. Temukan Produk Best Seller Pilihan Kami.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PRODUCTS.map((product) => (
          <ProductCard 
            key={product.name} 
            {...product} 
            onClick={() => navigate('/product')}
          />
        ))}
      </div>
    </section>
  )
}

export default ProductShowcase
