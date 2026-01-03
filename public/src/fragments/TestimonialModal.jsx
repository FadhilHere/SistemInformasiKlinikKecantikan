import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';

const TestimonialModal = ({ isOpen, onClose, mode = 'add', initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        namaTester: '',
        jenisTestimoni: '',
        deskripsi: '',
        tanggalTreatment: '',
        buktiFoto: null
    });
    const [photoPreview, setPhotoPreview] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    namaTester: initialData.namaTester || '',
                    jenisTestimoni: initialData.jenisTestimoni || '',
                    deskripsi: initialData.deskripsi || '',
                    tanggalTreatment: initialData.tanggalTreatment || '',
                    buktiFoto: null
                });
                // Set preview from existing photo URL if available
                if (initialData.buktiFoto) {
                    // Backend saves to public/uploads/testimoni/ and stores path as 'uploads/testimoni/filename.jpg'
                    setPhotoPreview(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/${initialData.buktiFoto}`);
                } else {
                    setPhotoPreview('');
                }
            } else {
                setFormData({
                    namaTester: '',
                    jenisTestimoni: '',
                    deskripsi: '',
                    tanggalTreatment: '',
                    buktiFoto: null
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
            setFormData(prev => ({ ...prev, buktiFoto: file }));
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden m-4">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {mode === 'add' ? 'Tambah Testimoni' : 'Edit Testimoni'}
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
                            <label className="text-sm font-medium text-gray-700">Unggah Bukti Foto</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="photo-upload"
                                    onChange={handleFileChange}
                                />
                                <label
                                    htmlFor="photo-upload"
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors text-sm border border-gray-200"
                                >
                                    Choose File
                                </label>
                                <span className="text-sm text-gray-500">
                                    {formData.buktiFoto ? formData.buktiFoto.name : (photoPreview ? 'File Selected' : 'No File Chosen')}
                                </span>
                            </div>
                            {photoPreview && (
                                <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-gray-200 mt-2" />
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Nama Tester</label>
                            <input
                                type="text"
                                name="namaTester"
                                value={formData.namaTester}
                                onChange={handleChange}
                                placeholder="Nama Tester"
                                required
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                            <textarea
                                name="deskripsi"
                                value={formData.deskripsi}
                                onChange={handleChange}
                                placeholder="Deskripsi testimoni"
                                rows="3"
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Tanggal Treatment</label>
                            <input
                                type="date"
                                name="tanggalTreatment"
                                value={formData.tanggalTreatment}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Jenis Testimoni</label>
                        <select
                            name="jenisTestimoni"
                            value={formData.jenisTestimoni}
                            onChange={handleChange}
                            required
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
                            {mode === 'add' ? 'Tambah Testimoni' : 'Simpan Testimoni'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TestimonialModal;
