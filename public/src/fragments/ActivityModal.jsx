import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';

const ActivityModal = ({ isOpen, onClose, mode = 'add', initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        namaKegiatan: '',
        deskripsi: '',
        tanggalKegiatan: '',
        foto: null
    });
    const [photoPreview, setPhotoPreview] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    namaKegiatan: initialData.namaKegiatan || '',
                    deskripsi: initialData.deskripsi || '',
                    // Format timestamp to YYYY-MM-DD for date input
                    tanggalKegiatan: initialData.tanggalKegiatan ? initialData.tanggalKegiatan.substring(0, 10) : '',
                    foto: null
                });
                // Set preview from existing photo
                if (initialData.foto) {
                    // Backend stores in storage/kegiatan/ using Laravel Storage
                    setPhotoPreview(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${initialData.foto}`);
                } else {
                    setPhotoPreview('');
                }
            } else {
                setFormData({
                    namaKegiatan: '',
                    deskripsi: '',
                    tanggalKegiatan: '',
                    foto: null
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
            setFormData(prev => ({ ...prev, foto: file }));
            // Create preview
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden m-4">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        Tambah Kegiatan Baru
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {mode === 'edit' ? 'Ubah Gambar Kegiatan' : 'Unggah Gambar Kegiatan'}
                        </label>
                        {photoPreview && (
                            <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">Foto Kegiatan</p>
                                <img src={photoPreview} alt="Activity" className="w-full h-48 object-cover rounded-lg" />
                            </div>
                        )}
                        <p className="text-sm text-gray-500 mb-3">
                            Anda dapat menambahkan kegiatan baru dengan nama, deskripsi, dan gambar. Pastikan untuk mengupload informasi terbaru agar data selalu akurat.
                        </p>
                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="activity-photo"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="activity-photo"
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-900 transition-colors text-sm"
                            >
                                Choose File
                            </label>
                            <span className="text-sm text-gray-500">
                                {formData.foto ? formData.foto.name : (photoPreview ? 'File Selected' : 'No File Choosen')}
                            </span>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Kegiatan</label>
                        <input
                            type="text"
                            name="namaKegiatan"
                            value={formData.namaKegiatan}
                            onChange={handleChange}
                            placeholder="Nama Kegiatan"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Kegiatan</label>
                        <input
                            type="text"
                            name="deskripsi"
                            value={formData.deskripsi}
                            onChange={handleChange}
                            placeholder="Deskripsi Kegiatan"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Kegiatan</label>
                        <input
                            type="date"
                            name="tanggalKegiatan"
                            value={formData.tanggalKegiatan}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit">
                            Tambah Kegiatan
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActivityModal;
