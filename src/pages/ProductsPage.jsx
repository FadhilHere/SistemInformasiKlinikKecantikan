import { useMemo, useState } from 'react'
import Navbar from '../fragments/Navbar'
import Button from '../components/atoms/Button'
import ProductCategoryTabs from '../components/molecules/ProductCategoryTabs'

const PRODUCTS = [
    {
        id: 1,
        name: 'Serum Acne',
        price: 'Rp 700.000',
        category: 'acne',
        image:
            'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 2,
        name: 'Serum Brightening',
        price: 'Rp 650.000',
        category: 'whitening',
        image:
            'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 3,
        name: 'Serum Anti-Aging',
        price: 'Rp 750.000',
        category: 'anti-aging',
        image:
            'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80'
    }
]

const heroImage =
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'

const ProductsPage = ({ isLoggedIn }) => {
    const [category, setCategory] = useState('Semua Produk')
    const filteredProducts = useMemo(() => {
        if (category === 'Semua Produk') return PRODUCTS
        return PRODUCTS.filter(
            (product) =>
                product.category.toLowerCase() === category.toLowerCase()
        )
    }, [category])

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
                />

                <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <article
                            key={product.id}
                            className="rounded-tl-[28px] rounded-br-[28px] rounded-tr-none rounded-bl-none bg-white p-6 text-center shadow-card"
                        >
                            <img
                                src={product.image}
                                alt={product.name}
                                className="mx-auto h-48 w-full rounded-tl-[28px] rounded-br-[28px] rounded-tr-none rounded-bl-none object-cover"
                            />
                            <h3 className="mt-4 text-xl font-semibold text-brand">
                                {product.name}
                            </h3>
                            <p className="text-sm text-brand/70">{product.price}</p>
                        </article>
                    ))}
                </section>

                <div className="flex justify-center">
                    <Button className="px-10 py-3">Lihat Produk Lainnya</Button>
                </div>
            </main>
        </div>
    )
}

export default ProductsPage
