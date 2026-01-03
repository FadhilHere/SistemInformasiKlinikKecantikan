import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import { apiFetch } from '../lib/api';

const PromoModal = ({ isOpen, onClose, mode = 'add', initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        namaPromo: '',
        jenisPromo: '',
        kode: '',
        diskon: '',
        deskripsi: '',
        tanggalMulai: '',
        tanggalSelesai: '',
        minimalTransaksi: '',
        status: 'Active',
        idKategori: '',
        idProduk: '',
        gambar: null
    });
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [photoPreview, setPhotoPreview] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, prodRes] = await Promise.all([
                    apiFetch('/api/kategori-produk'),
                    apiFetch('/api/produk-klinik')
                ]);
                setCategories(Array.isArray(catRes?.data || catRes) ? (catRes?.data || catRes) : []);
                setProducts(Array.isArray(prodRes?.data || prodRes) ? (prodRes?.data || prodRes) : []);
            } catch (error) {
                console.error("Failed to fetch dropdown data", error);
            }
        };
        if (isOpen) fetchData();
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    namaPromo: initialData.namaPromo || '',
                    jenisPromo: initialData.jenisPromo || '',
                    kode: initialData.kode || '',
                    diskon: initialData.diskon || '',
                    deskripsi: initialData.deskripsi || '',
                    tanggalMulai: initialData.tanggalMulai ? initialData.tanggalMulai.substring(0, 10) : '',
                    tanggalSelesai: initialData.tanggalSelesai ? initialData.tanggalSelesai.substring(0, 10) : '',
                    minimalTransaksi: initialData.minimalTransaksi || '',
                    // Convert boolean/int status from backend to string for form select
                    status: (initialData.status === 1 || initialData.status === true || initialData.status === 'Active') ? 'Active' : 'Inactive',
                    idKategori: initialData.idKategori || '',
                    idProduk: initialData.idProduk || '',
                    gambar: null
                });
                if (initialData.gambar) {
                    setPhotoPreview(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${initialData.gambar}`);
                } else {
                    setPhotoPreview('');
                }
            } else {
                setFormData({
                    namaPromo: '',
                    jenisPromo: '',
                    kode: '',
                    diskon: '',
                    deskripsi: '',
                    tanggalMulai: '',
                    tanggalSelesai: '',
                    minimalTransaksi: '',
                    status: 'Active',
                    idKategori: '',
                    idProduk: '',
                    gambar: null
                });
                setPhotoPreview('');
            }
        }
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, gambar: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
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

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                    {/* Image Upload */}
                    <div>
                        <label className={labelClass}>Gambar Promo</label>
                        <div className="flex items-center gap-4">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                            ) : (
                                <div className="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                    No Image
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Nama Promo</label>
                            <input type="text" name="namaPromo" value={formData.namaPromo} onChange={handleChange} placeholder="Nama Promo" className={inputClass} required />
                        </div>
                        <div>
                            <label className={labelClass}>Jenis Promo</label>
                            <div className="relative">
                                <select name="jenisPromo" value={formData.jenisPromo} onChange={handleChange} className={`${inputClass} appearance-none`} required>
                                    <option value="" disabled>Pilih Jenis Promo</option>
                                    <option value="Discount">Discount</option>
                                    <option value="Cashback">Cashback</option>
                                    <option value="Buy 1 Get 1">Buy 1 Get 1</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Kategori Produk (Opsional)</label>
                            <select name="idKategori" value={formData.idKategori} onChange={handleChange} className={`${inputClass} appearance-none`}>
                                <option value="">Pilih Kategori</option>
                                {categories.map(cat => (
                                    <option key={cat.idKategori} value={cat.idKategori}>{cat.nama}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Produk (Opsional)</label>
                            <select name="idProduk" value={formData.idProduk} onChange={handleChange} className={`${inputClass} appearance-none`}>
                                <option value="">Pilih Produk</option>
                                {products.map(prod => (
                                    <option key={prod.idProduk || prod.id} value={prod.idProduk || prod.id}>{prod.nama}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Tanggal Mulai</label>
                            <input type="date" name="tanggalMulai" value={formData.tanggalMulai} onChange={handleChange} className={inputClass} required />
                        </div>
                        <div>
                            <label className={labelClass}>Tanggal Selesai</label>
                            <input type="date" name="tanggalSelesai" value={formData.tanggalSelesai} onChange={handleChange} className={inputClass} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Minimal Transaksi</label>
                            <input type="number" name="minimalTransaksi" value={formData.minimalTransaksi} onChange={handleChange} placeholder="Contoh: 100000" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Kode Promo</label>
                            <input type="text" name="kode" value={formData.kode} onChange={handleChange} placeholder="Kode Promo" className={inputClass} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Diskon (Nominal/Persen)</label>
                            <input type="text" name="diskon" value={formData.diskon} onChange={handleChange} placeholder="Contoh: 10% atau 50000" className={inputClass} required />
                        </div>
                        <div>
                            <label className={labelClass}>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className={`${inputClass} appearance-none`}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Deskripsi Promo</label>
                        <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} placeholder="Deskripsi Promo" rows="4" className={`${inputClass} resize-none`}></textarea>
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
