import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';

const TestimonialModal = ({ isOpen, onClose, mode = 'add', initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        photo: '',
        name: '',
        description: '',
        date: '',
        testimonialType: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    photo: '',
                    name: '',
                    description: '',
                    date: '',
                    testimonialType: ''
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden m-4">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {mode === 'add' ? 'Tambah Kategori Produk' : 'Tambah Kategori Produk'}
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
                            <label className="text-sm font-medium text-gray-700">Unggah Gambar Testimoni</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="photo-upload"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData(prev => ({ ...prev, photo: reader.result }));
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="photo-upload"
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm border border-gray-200"
                                >
                                    Choose File
                                </label>
                                <span className="text-sm text-gray-500">
                                    {formData.photo ? 'File Selected' : 'No File Chosen'}
                                </span>
                            </div>
                            {formData.photo && (
                                <img src={formData.photo} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200 mt-2" />
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Nama Testimoni</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Nama Testimoni"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Deskripsi Kategori</label>
                            <input
                                type="text"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Deskripsi Kategori"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Tanggal Testimoni</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Jenis Testimoni</label>
                        <select
                            name="testimonialType"
                            value={formData.testimonialType}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm appearance-none"
                        >
                            <option value="">Pilih Jenis Testimoni</option>
                            <option value="Treatment">Treatment</option>
                            <option value="Product">Product</option>
                            <option value="Service">Service</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="min-w-[150px]">
                            {mode === 'add' ? 'Tambah Testimoni' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TestimonialModal;
