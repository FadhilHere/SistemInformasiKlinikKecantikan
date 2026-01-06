import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import { API_BASE_URL } from '../lib/api';

const EventModal = ({ isOpen, onClose, mode = 'add', initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        nama: '',
        deskripsi: '',
        tanggalMulai: '',
        tanggalSelesai: '',
        lokasi: '',
        fotoFile: null
    });
    const [photoPreview, setPhotoPreview] = useState(null);

    // Helper function to convert date to yyyy-MM-dd format
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        // Handle both ISO format and yyyy-MM-dd format
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    nama: initialData.nama || '',
                    deskripsi: initialData.deskripsi || '',
                    tanggalMulai: formatDateForInput(initialData.tanggalMulai),
                    tanggalSelesai: formatDateForInput(initialData.tanggalSelesai),
                    lokasi: initialData.lokasi || '',
                    fotoFile: null
                });
                // Set preview for existing photo
                if (initialData.foto) {
                    const photoUrl = initialData.foto.startsWith('http')
                        ? initialData.foto
                        : `${API_BASE_URL}/storage/${initialData.foto}`;
                    setPhotoPreview(photoUrl);
                } else {
                    setPhotoPreview(null);
                }
            } else {
                setFormData({
                    nama: '',
                    deskripsi: '',
                    tanggalMulai: '',
                    tanggalSelesai: '',
                    lokasi: '',
                    fotoFile: null
                });
                setPhotoPreview(null);
            }
        }
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, fotoFile: file }));
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden m-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {mode === 'add' ? 'Tambah Event' : 'Edit Event'}
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
                            <label className="text-sm font-medium text-gray-700">Nama Event</label>
                            <input
                                type="text"
                                name="nama"
                                value={formData.nama}
                                onChange={handleChange}
                                placeholder="Nama Event"
                                required
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Lokasi</label>
                            <input
                                type="text"
                                name="lokasi"
                                value={formData.lokasi}
                                onChange={handleChange}
                                placeholder="Lokasi Event"
                                required
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Tanggal Mulai</label>
                            <input
                                type="date"
                                name="tanggalMulai"
                                value={formData.tanggalMulai}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Tanggal Selesai</label>
                            <input
                                type="date"
                                name="tanggalSelesai"
                                value={formData.tanggalSelesai}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Foto Event</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                        {photoPreview && (
                            <div className="mt-2">
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Deskripsi Event</label>
                        <textarea
                            name="deskripsi"
                            value={formData.deskripsi}
                            onChange={handleChange}
                            placeholder="Deskripsi Event"
                            rows="4"
                            required
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none"
                        ></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="min-w-[150px]">
                            {mode === 'add' ? 'Tambah Event' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventModal;
