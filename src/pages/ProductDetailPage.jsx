import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../fragments/Navbar'
import Button from '../components/atoms/Button'
import { apiFetch, API_BASE_URL } from '../lib/api'

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

const ProductDetailPage = ({ isLoggedIn }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch current product
        const productRes = await apiFetch(`/api/produk-klinik/${id}`)
        if (productRes.success) {
          setProduct(productRes.data)
        } else {
          throw new Error(productRes.message || 'Produk tidak ditemukan')
        }

        // Fetch "related" products (just random ones for now)
        const allProductsRes = await apiFetch('/api/produk-klinik')
        if (allProductsRes.success && Array.isArray(allProductsRes.data)) {
           // Filter out current product and take 3
           const others = allProductsRes.data
             .filter(p => p.idProduk != id) // Loose equality for string/number match
             .slice(0, 3)
           setRelatedProducts(others)
        }

      } catch (err) {
        console.error(err)
        setError(err.message || 'Gagal memuat detail produk')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
        fetchProductData()
        window.scrollTo(0, 0)
    }
  }, [id])

  const handleCreateOrder = async () => {
    try {
      await apiFetch('/api/keranjang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idProduk: product?.idProduk ?? product?.id,
          jumlahProduk: quantity
        })
      })
      alert(`Berhasil menambahkan ${quantity} items ke keranjang!`)
      navigate('/cart')
    } catch (error) {
      alert(error?.data?.message || error?.message || 'Gagal menambahkan ke keranjang.')
    }
  }

  const handleQuantityChange = (delta) => {
    setQuantity(prev => {
        const newVal = prev + delta
        if (newVal < 1) return 1
        // Optional: Check stock limit
        const limit = product?.stock ?? product?.stok
        if (limit && newVal > limit) return limit
        return newVal
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar isLoggedIn={isLoggedIn} />
            <div className="flex h-[80vh] items-center justify-center">
                <p className="text-xl text-brand/60">Memuat detail produk...</p>
            </div>
        </div>
    )
  }

  if (error || !product) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar isLoggedIn={isLoggedIn} />
            <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
                <p className="text-xl text-red-500">{error || 'Produk tidak ditemukan'}</p>
                <Button onClick={() => navigate('/product')}>Kembali ke Katalog</Button>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isLoggedIn={isLoggedIn} />
      
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-8 md:py-16">
        
        {/* Main Details Card */}
        <section className="flex flex-col gap-10 rounded-[40px] rounded-tr-[4px] rounded-bl-[4px] bg-white p-8 shadow-card md:flex-row md:items-center md:p-12 lg:gap-20">
            {/* Image Column */}
            <div className="flex w-full shrink-0 items-center justify-center md:w-1/3 lg:w-[400px]">
                <img 
                    src={getProductImage(product)} 
                    alt={product.nama} 
                    className="max-h-[300px] object-contain md:max-h-[400px]" 
                />
            </div>

            {/* Info Column */}
            <div className="flex flex-1 flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-brand md:text-4xl">{product.nama}</h1>
                    <p className="mt-2 text-2xl font-bold text-black md:text-3xl">
                        {formatPrice(product.harga)}
                    </p>
                </div>

                {/* Quantity & Action */}
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-4 text-xl font-bold text-brand">
                        <button 
                            onClick={() => handleQuantityChange(-1)}
                            className="text-2xl transition hover:text-brand/70"
                        >
                            -
                        </button>
                        <span className="w-4 text-center">{quantity}</span>
                        <button 
                            onClick={() => handleQuantityChange(1)}
                            className="text-2xl transition hover:text-brand/70"
                        >
                            +
                        </button>
                    </div>

                    <Button 
                        onClick={handleCreateOrder} 
                        className="flex items-center gap-2 rounded-full px-8 py-3"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                        Add To Cart
                    </Button>
                </div>

                {/* Description */}
                <div className="text-lg leading-relaxed text-gray-700">
                    <p>{product.deskripsi}</p>
                </div>
            </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
            <section className="space-y-6">
                <h2 className="text-3xl font-bold text-brand">Produk Lain</h2>
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedProducts.map((item) => (
                        <div 
                            key={item.idProduk}
                            onClick={() => navigate(`/product/${item.idProduk}`)}
                            className="group cursor-pointer rounded-t-[32px] rounded-br-[32px] bg-white p-6 shadow-card transition hover:shadow-xl"
                        >
                             <div className="mb-6 flex justify-center">
                                <img 
                                    src={getProductImage(item)} 
                                    alt={item.nama}
                                    className="h-40 object-contain transition group-hover:scale-105" 
                                />
                             </div>
                             <div className="rounded-b-[20px] bg-[#5BBB48] p-4 text-white">
                                <h3 className="font-bold">{item.nama}</h3>
                                <p className="text-sm opacity-90">{formatPrice(item.harga)}</p>
                             </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

      </main>
    </div>
  )
}

export default ProductDetailPage
