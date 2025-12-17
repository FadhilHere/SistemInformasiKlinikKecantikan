import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import InputField from '../components/atoms/InputField';

const ProductModal = ({ isOpen, onClose, mode = 'add', initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: '',
        description: ''
    });

    useEffect(() => {
        if (isOpen && mode === 'edit' && initialData) {
            setFormData(initialData);
        } else if (isOpen && mode === 'add') {
            setFormData({
                name: '',
                price: '',
                stock: '',
                category: '',
                description: ''
            });
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden m-4">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {mode === 'add' ? 'Tambah Produk' : 'Edit Produk'}
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
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Nama Produk</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nama Produk"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Harga Produk</label>
                            <input
                                type="text"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Harga Produk"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="Jumlah Stock"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Kategori</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm appearance-none"
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    <option value="Serum">Serum</option>
                                    <option value="Cream">Cream</option>
                                    <option value="Facial Wash">Facial Wash</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Deskripsi Produk</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Deskripsi Produk"
                            rows="4"
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none"
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="min-w-[150px]">
                            {mode === 'add' ? 'Tambah Produk' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
