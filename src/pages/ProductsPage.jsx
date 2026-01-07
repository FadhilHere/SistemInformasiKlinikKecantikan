import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import Button from '../components/atoms/Button'
import ProductCategoryTabs from '../components/molecules/ProductCategoryTabs'
import { apiFetch, API_BASE_URL } from '../lib/api'
import Footer from '../fragments/Footer'

const heroImage =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'

const ProductsPage = ({ isLoggedIn }) => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState('all')
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const normalizeListResponse = (res) => {
      if (Array.isArray(res)) return res
      if (Array.isArray(res?.data)) return res.data
      if (Array.isArray(res?.data?.data)) return res.data.data
      return []
    }

    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await apiFetch('/api/produk-klinik')
        const list = normalizeListResponse(response)
        setProducts(Array.isArray(list) ? list : [])
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Gagal memuat produk. Silakan coba lagi nanti.')
      } finally {
        setIsLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await apiFetch('/api/kategori-produk')
        const list = normalizeListResponse(response)
        const normalized = list
          .map((item) => ({
            id: item.idKategori ?? item.id,
            name: item.namaKategori ?? item.nama ?? item.name
          }))
          .filter((item) => item.id != null && item.name)
        setCategories(normalized)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setCategories([])
      }
    }

    fetchProducts()
    fetchCategories()
  }, [])

  const filteredProducts = useMemo(() => {
    if (category === 'all') return products

    return products.filter((product) => {
      const productCategoryId =
        product.idKategori ??
        product.kategori?.idKategori ??
        product.kategori?.id ??
        null
      return String(productCategoryId) === String(category)
    })
  }, [category, products])

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Helper to generate a consistent placeholder image based on product data
  const getProductImage = (product) => {
    if (product?.gambar) {
      return product.gambar.startsWith('http')
        ? product.gambar
        : `${API_BASE_URL}/storage/${product.gambar}`
    }
    const images = [
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=600&q=80'
    ]
    const fallbackId = product?.idProduk ?? product?.id ?? 0
    return images[fallbackId % images.length] || images[0]
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-12">
        <section className="grid gap-8 rounded-tl-[36px] rounded-br-[36px] rounded-tr-none rounded-bl-none bg-gradient-to-r from-[#1b8f35] to-[#4ad14e] px-8 py-12 text-white shadow-card lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/70">
              Produk unggulan
            </p>
            <h1 className="text-4xl font-semibold">
              Produk MISCHE Skincare
            </h1>
            <p className="text-white/90">
              Pilihan cerdas untuk kulit sehat dan terawat
            </p>
            <Button variant="light" className="mt-4 px-8 py-3">
              Lihat Produk
            </Button>
          </div>
          <div className="flex justify-center">
            <img
              src={heroImage}
              alt="Produk Mische"
              className="max-h-72 rounded-tl-[32px] rounded-br-[32px] rounded-tr-none rounded-bl-none bg-white/30 p-6 shadow-2xl"
            />
          </div>
        </section>

        <section className="space-y-6 text-center text-brand">
          <h2 className="text-3xl font-semibold">
            Rangkaian Produk Skincare Untuk Lengkapi Kebutuhan Kamu
          </h2>
          <p className="text-sm text-brand/70">
            Dengan rangkaian produk yang diformulasikan khusus untuk perawatan kulit wajah,
            MISCHE skincare menghadirkan manfaat lengkap yang dibutuhkan kulitmu.
          </p>
        </section>

        <ProductCategoryTabs
          activeCategory={category}
          onSelect={setCategory}
          categories={categories}
        />

        {isLoading ? (
          <div className="py-20 text-center">
            <p className="text-gray-500">Memuat produk...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-500">Belum ada produk untuk kategori ini.</p>
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.idProduk || product.id}
                onClick={() => navigate(`/product/${product.idProduk || product.id}`)}
                className="flex cursor-pointer flex-col rounded-tl-[28px] rounded-br-[28px] rounded-tr-none rounded-bl-none bg-white p-6 text-center shadow-card transition-shadow hover:shadow-xl"
              >
                <img
                  src={getProductImage(product)}
                  alt={product.nama}
                  className="mx-auto h-48 w-full rounded-tl-[28px] rounded-br-[28px] rounded-tr-none rounded-bl-none object-cover"
                />
                <h3 className="mt-4 text-xl font-semibold text-brand">
                  {product.nama}
                </h3>
                <p className="mb-4 text-brand/70 line-clamp-2 text-sm mt-1">{product.deskripsi}</p>
                <div className="mt-auto">
                  <p className="text-lg font-bold text-brand">{formatPrice(product.harga)}</p>
                  <p className={`text-xs ${(product.stock ?? product.stok ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(product.stock ?? product.stok ?? 0) > 0 ? `Stok: ${product.stock ?? product.stok ?? 0}` : 'Stok Habis'}
                  </p>
                </div>
              </article>
            ))}
          </section>
        )}

        <div className="flex justify-center">
          <Button className="px-10 py-3">Lihat Produk Lainnya</Button>
        </div>
      </main>
        <Footer />
    </div>
  )
}

export default ProductsPage
