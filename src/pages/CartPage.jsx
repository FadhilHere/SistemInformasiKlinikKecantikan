import { useEffect, useMemo, useState } from 'react'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import Button from '../components/atoms/Button'
import { apiFetch, API_BASE_URL } from '../lib/api'

const CartPage = ({ isLoggedIn }) => {
    const [items, setItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [promoCode, setPromoCode] = useState('')
    const [appliedPromo, setAppliedPromo] = useState(null)
    const [promos, setPromos] = useState([])
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    const normalizeListResponse = (res) => {
        if (Array.isArray(res)) return res
        if (Array.isArray(res?.data)) return res.data
        if (Array.isArray(res?.data?.data)) return res.data.data
        if (Array.isArray(res?.data?.data?.keranjang)) return res.data.data.keranjang
        if (Array.isArray(res?.data?.keranjang)) return res.data.keranjang
        if (Array.isArray(res?.data?.items)) return res.data.items
        if (Array.isArray(res?.items)) return res.items
        if (Array.isArray(res?.keranjang)) return res.keranjang
        if (res?.data?.idKeranjang || res?.data?.id) return [res.data]
        if (res?.idKeranjang || res?.id) return [res]
        return []
    }

    const fetchCart = async () => {
        try {
            setIsLoading(true)
            setError('')
            const res = await apiFetch('/api/keranjang')
            const list = normalizeListResponse(res)
            const mapped = list.map((item) => ({
                id: item.idKeranjang ?? item.id,
                idProduk: item.idProduk,
                quantity: item.jumlahProduk ?? item.quantity ?? 0,
                product: item.produk ?? item.product ?? item.produkKlinik ?? item.produk_klinik ?? {},
                checked: true
            }))
            if (mapped.length > 0 && mapped.some(item => !item.product?.nama)) {
                const productsRes = await apiFetch('/api/produk-klinik')
                const productsList = normalizeListResponse(productsRes)
                const productMap = new Map(
                    productsList.map((product) => [String(product.idProduk ?? product.id), product])
                )
                const enriched = mapped.map((item) => ({
                    ...item,
                    product: item.product?.nama ? item.product : (productMap.get(String(item.idProduk)) || item.product)
                }))
                setItems(enriched)
            } else {
                setItems(mapped)
            }
        } catch (err) {
            setError(err?.data?.message || 'Gagal memuat keranjang.')
        } finally {
            setIsLoading(false)
        }
    }

    const fetchPromos = async () => {
        try {
            const res = await apiFetch('/api/promo')
            const list = normalizeListResponse(res)
            setPromos(list)
        } catch (err) {
            setPromos([])
        }
    }

    useEffect(() => {
        fetchCart()
        fetchPromos()
    }, [])

    const updateQuantity = (id, change) => {
        setItems((prev) =>
            prev.map(item => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + change)
                    return { ...item, quantity: newQuantity }
                }
                return item
            })
        )
    }

    const commitQuantity = async (itemId, quantity) => {
        try {
            await apiFetch(`/api/keranjang/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jumlahProduk: quantity })
            })
        } catch (err) {
            setError(err?.data?.message || 'Gagal memperbarui jumlah produk.')
            await fetchCart()
        }
    }

    const handleQuantityChange = async (itemId, change) => {
        const item = items.find(i => i.id === itemId)
        if (!item) return
        const newQuantity = Math.max(1, item.quantity + change)
        const stockLimit = item.product?.stock ?? item.product?.stok
        if (stockLimit !== undefined && newQuantity > stockLimit) {
            setError(`Stok produk tidak mencukupi. Sisa: ${stockLimit}`)
            return
        }
        updateQuantity(itemId, change)
        await commitQuantity(itemId, newQuantity)
    }

    const toggleCheck = (id) => {
        setItems((prev) =>
            prev.map(item => {
                if (item.id === id) {
                    return { ...item, checked: !item.checked }
                }
                return item
            })
        )
    }

    const handleRemove = async (itemId) => {
        try {
            await apiFetch(`/api/keranjang/${itemId}`, { method: 'DELETE' })
            setItems((prev) => prev.filter(item => item.id !== itemId))
        } catch (err) {
            setError(err?.data?.message || 'Gagal menghapus item dari keranjang.')
        }
    }

    const applyPromo = () => {
        if (!promoCode.trim()) {
            setAppliedPromo(null)
            return
        }
        const match = promos.find(promo => promo.kode?.toLowerCase() === promoCode.trim().toLowerCase())
        if (!match) {
            setAppliedPromo(null)
            setError('Kode promo tidak ditemukan.')
            return
        }
        setError('')
        setAppliedPromo(match)
    }

    const subtotal = useMemo(() => {
        return items
            .filter(item => item.checked)
            .reduce((sum, item) => {
                const price = item.product?.harga ?? 0
                return sum + (price * item.quantity)
            }, 0)
    }, [items])

    const promoSummary = useMemo(() => {
        if (!appliedPromo) {
            return { eligible: false, reason: '', discount: 0 }
        }

        const isActive = appliedPromo.status === true || appliedPromo.status === 1 || appliedPromo.status === 'Active' || appliedPromo.status === '1'
        if (!isActive) {
            return { eligible: false, reason: 'Promo tidak aktif.', discount: 0 }
        }

        const today = new Date()
        const startDate = appliedPromo.tanggalMulai ? new Date(appliedPromo.tanggalMulai) : null
        const endDate = appliedPromo.tanggalSelesai ? new Date(appliedPromo.tanggalSelesai) : null
        if (startDate && today < startDate) {
            return { eligible: false, reason: 'Promo belum berlaku.', discount: 0 }
        }
        if (endDate) {
            const endOfDay = new Date(endDate)
            endOfDay.setHours(23, 59, 59, 999)
            if (today > endOfDay) {
                return { eligible: false, reason: 'Promo sudah berakhir.', discount: 0 }
            }
        }

        const minimum = Number(appliedPromo.minimalTransaksi ?? 0)
        if (subtotal < minimum) {
            return { eligible: false, reason: `Minimal transaksi ${formatPrice(minimum)} belum terpenuhi.`, discount: 0 }
        }

        const diskonPersen = Math.min(Math.max(Number(appliedPromo.diskon ?? 0), 0), 100)
        const discount = Math.floor(subtotal * (diskonPersen / 100))
        return { eligible: true, reason: '', discount }
    }, [appliedPromo, subtotal])

    const total = Math.max(subtotal - promoSummary.discount, 0)

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price).replace('Rp', 'Rp ')
    }

    const getProductImage = (product, fallbackId) => {
        if (product?.gambar) {
            return product.gambar.startsWith('http')
                ? product.gambar
                : `${API_BASE_URL}/storage/${product.gambar}`
        }
        const images = [
            'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=200&q=80',
            'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=200&q=80',
            'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=200&q=80',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80',
            'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=200&q=80'
        ]
        return images[fallbackId % images.length] || images[0]
    }

    const handleCheckout = async () => {
        if (items.length === 0) return
        if (items.some(item => !item.checked)) {
            setError('Checkout hanya dapat dilakukan untuk semua item di keranjang.')
            return
        }

        try {
            setIsCheckingOut(true)
            setError('')
            const payload = {
                idPromo: appliedPromo?.idPromo ?? appliedPromo?.id ?? null,
                metodePembayaran: 'manual'
            }
            await apiFetch('/api/penjualan/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            setItems([])
            setAppliedPromo(null)
            setPromoCode('')
        } catch (err) {
            setError(err?.data?.message || err?.message || 'Checkout gagal.')
        } finally {
            setIsCheckingOut(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f9f9f9] font-sans">
            <Navbar isLoggedIn={isLoggedIn} />

            <main className="mx-auto max-w-6xl px-4 py-12">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#4aa731]" fill="currentColor">
                        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                    <h1 className="text-3xl font-bold text-black">Keranjang Produk</h1>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Product List */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        {isLoading ? (
                            <div className="rounded-br-[40px] rounded-tl-[40px] bg-white p-6 text-center text-sm text-gray-500 shadow-md">
                                Memuat keranjang...
                            </div>
                        ) : items.length === 0 ? (
                            <div className="rounded-br-[40px] rounded-tl-[40px] bg-white p-6 text-center text-sm text-gray-500 shadow-md">
                                Keranjang masih kosong.
                            </div>
                        ) : (
                            items.map((item, index) => {
                                const price = item.product?.harga ?? 0
                                const stock = item.product?.stock ?? item.product?.stok
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 rounded-br-[40px] rounded-tl-[40px] bg-white p-6 shadow-md transition hover:shadow-lg"
                                    >
                                        {/* Checkbox */}
                                        <div
                                            onClick={() => toggleCheck(item.id)}
                                            className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded border-2 ${item.checked ? 'border-[#4aa731] bg-[#4aa731]' : 'border-gray-300'}`}
                                        >
                                            {item.checked && (
                                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Image */}
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                            <img
                                                src={getProductImage(item.product, index)}
                                                alt={item.product?.nama || 'Produk'}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center">
                                            <div>
                                                <h3 className="text-xl font-bold text-black">{item.product?.nama || '-'}</h3>
                                                <p className="text-lg font-medium text-gray-600">{formatPrice(price)}</p>
                                                {stock !== undefined && (
                                                    <p className="text-xs text-gray-500">Stok: {stock}</p>
                                                )}
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="mt-4 flex items-center gap-4 sm:mt-0">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                    className="text-2xl font-bold text-[#4aa731] hover:text-[#3d8b28]"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xl font-bold text-[#4aa731]">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                    className="text-2xl font-bold text-[#4aa731] hover:text-[#3d8b28]"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500 hover:border-red-300 hover:text-red-500"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>

                    {/* Summary */}
                    <div className="h-fit rounded-br-[40px] rounded-tl-[40px] bg-white p-8 shadow-md">
                        <h2 className="mb-6 text-xl font-bold text-black">Total Dari Pembelian</h2>

                        <div className="mb-6 flex flex-col gap-3">
                            <p className="text-sm text-gray-600">Total Dari Pembelian</p>
                            {items.filter(i => i.checked).map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-gray-800">{item.product?.nama || '-'}</span>
                                    <span className="font-bold text-[#4aa731]">
                                        {formatPrice((item.product?.harga ?? 0) * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="my-4 h-px w-full bg-gray-200"></div>

                        <div className="mb-4 flex justify-between text-sm text-gray-600">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="mb-6 flex justify-between text-lg font-bold">
                            <span>Total Pembelian</span>
                            <span className="text-[#4aa731]">{formatPrice(total)}</span>
                        </div>

                        {/* Voucher */}
                        <div className="mb-6 flex gap-2">
                            <input
                                type="text"
                                placeholder="Masukkan Voucher"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-[#4aa731] focus:outline-none"
                            />
                            <button
                                onClick={applyPromo}
                                className="rounded-full bg-[#4aa731] px-6 py-2 text-sm font-bold text-white hover:bg-[#3d8b28]"
                            >
                                Pakai
                            </button>
                        </div>

                        {appliedPromo && (
                            <div className={`mb-4 rounded-lg px-3 py-2 text-xs ${promoSummary.eligible ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                Promo: {appliedPromo.kode || appliedPromo.namaPromo || 'Promo'}
                                {promoSummary.eligible ? ` - Hemat ${formatPrice(promoSummary.discount)}` : ` - ${promoSummary.reason}`}
                            </div>
                        )}

                        <Button
                            onClick={handleCheckout}
                            disabled={items.length === 0 || isCheckingOut}
                            className="w-full rounded-full bg-[#4aa731] py-3 text-lg font-bold text-white shadow-lg hover:bg-[#3d8b28]"
                        >
                            {isCheckingOut ? 'Memproses...' : 'Bayar'}
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default CartPage
