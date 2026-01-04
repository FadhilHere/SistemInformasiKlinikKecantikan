import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';

const PromoModal = ({ isOpen, onClose, mode = 'add', initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        category: '',
        product: '',
        startDate: '',
        endDate: '',
        minTransaction: '',
        code: '',
        description: '',
        discount: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    name: '',
                    type: '',
                    category: '',
                    product: '',
                    startDate: '',
                    endDate: '',
                    minTransaction: '',
                    code: '',
                    description: '',
                    discount: ''
                });
            }
        }
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const inputClass = "w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm";
    const labelClass = "text-sm font-medium text-gray-700 mb-1 block";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl m-4 my-8">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {mode === 'add' ? 'Tambah Promo' : 'Edit Promo'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Nama Promo</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nama Promo" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Jenis Promo</label>
                            <div className="relative">
                                <select name="type" value={formData.type} onChange={handleChange} className={`${inputClass} appearance-none`}>
                                    <option value="" disabled>Pilih Jenis Promo</option>
                                    <option value="Discount">Discount</option>
                                    <option value="Cashback">Cashback</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Pilih Kategori Produk</label>
                            <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Nama Kategori" className={inputClass} />
                            <span className="text-[10px] text-red-500 mt-1">*Pilih kategori produk bila promo berdasarkan kategori produk</span>
                        </div>
                        <div>
                            <label className={labelClass}>Pilih Produk</label>
                            <input type="text" name="product" value={formData.product} onChange={handleChange} placeholder="Nama Produk" className={inputClass} />
                            <span className="text-[10px] text-red-500 mt-1">*Pilih produk bila promo berdasarkan produk</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Tanggal Mulai</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Tanggal Selesai</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Minimal Transaksi</label>
                            <input type="text" name="minTransaction" value={formData.minTransaction} onChange={handleChange} placeholder="Minimal Transaksi" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Kode Promo</label>
                            <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder="Kode Promo" className={inputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Deskripsi Produk</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Deskripsi Produk" rows="4" className={`${inputClass} resize-none`}></textarea>
                        </div>
                        <div>
                            <label className={labelClass}>Diskon</label>
                            <input type="text" name="discount" value={formData.discount} onChange={handleChange} placeholder="Diskon" className={inputClass} />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="min-w-[150px]">
                            {mode === 'add' ? 'Tambah Promo' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PromoModal;
