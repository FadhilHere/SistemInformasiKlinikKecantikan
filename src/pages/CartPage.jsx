import { useState } from 'react'
import Navbar from '../fragments/Navbar'
import Footer from '../fragments/Footer'
import Button from '../components/atoms/Button'

const CartPage = ({ onNavigate, onShowLogin, onShowRegister, onShowLanding }) => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Serum Acne',
      price: 700000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80',
      checked: true
    },
    {
      id: 2,
      name: 'Serum A',
      price: 700000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80',
      checked: true
    },
    {
      id: 3,
      name: 'Serum B',
      price: 700000,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=200&q=80',
      checked: true
    }
  ])

  const updateQuantity = (id, change) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const toggleCheck = (id) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, checked: !item.checked }
      }
      return item
    }))
  }

  const total = items
    .filter(item => item.checked)
    .reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace('Rp', 'Rp ')
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans">
      <Navbar
        onShowLogin={onShowLogin}
        onShowRegister={onShowRegister}
        onShowLanding={onShowLanding}
        activeRoute="cart"
        onNavigate={onNavigate}
      />

      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#4aa731]" fill="currentColor">
             <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          <h1 className="text-3xl font-bold text-black">Keranjang Produk</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Product List */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {items.map((item) => (
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
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-xl font-bold text-black">{item.name}</h3>
                    <p className="text-lg font-medium text-gray-600">{formatPrice(item.price)}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="mt-4 flex items-center gap-4 sm:mt-0">
                    <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-2xl font-bold text-[#4aa731] hover:text-[#3d8b28]"
                    >
                        -
                    </button>
                    <span className="text-xl font-bold text-[#4aa731]">{item.quantity}</span>
                    <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-2xl font-bold text-[#4aa731] hover:text-[#3d8b28]"
                    >
                        +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit rounded-br-[40px] rounded-tl-[40px] bg-white p-8 shadow-md">
            <h2 className="mb-6 text-xl font-bold text-black">Total Dari Pembelian</h2>
            
            <div className="mb-6 flex flex-col gap-3">
              <p className="text-sm text-gray-600">Total Dari Pembelian</p>
              {items.filter(i => i.checked).map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-800">{item.name}</span>
                    <span className="font-bold text-[#4aa731]">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="my-4 h-px w-full bg-gray-200"></div>

            <div className="mb-6 flex justify-between text-lg font-bold">
                <span>Total Pembelian</span>
                <span className="text-[#4aa731]">{formatPrice(total)}</span>
            </div>

            {/* Voucher */}
            <div className="mb-6 flex gap-2">
                <input 
                    type="text" 
                    placeholder="Masukkan Voucher" 
                    className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-[#4aa731] focus:outline-none"
                />
                <button className="rounded-full bg-[#4aa731] px-6 py-2 text-sm font-bold text-white hover:bg-[#3d8b28]">
                    Pakai
                </button>
            </div>

            <Button className="w-full rounded-full bg-[#4aa731] py-3 text-lg font-bold text-white shadow-lg hover:bg-[#3d8b28]">
                Bayar
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CartPage
