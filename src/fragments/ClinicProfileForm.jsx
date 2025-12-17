import React, { useState } from 'react';
import Button from '../components/atoms/Button';

const ClinicProfileForm = () => {
    const [formData, setFormData] = useState({
        description: 'Klinik kecantikan terpercaya dengan layanan profesional dan berkualitas tinggi.',
        vision: 'Menjadi klinik kecantikan terbaik di Indonesia',
        mission: 'Memberikan layanan kecantikan berkualitas dengan harga terjangkau',
        openingHours: '08:00',
        closingHours: '17:00',
        photo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = () => {
        alert('Informasi klinik berhasil diperbarui!');
    };

    const handleDelete = () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus deskripsi ini?')) {
            setFormData({
                description: '',
                vision: '',
                mission: '',
                openingHours: '',
                closingHours: '',
                photo: ''
            });
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pengaturan Tentang Kami</h2>
            <p className="text-gray-500 text-sm mb-6">
                Halaman ini menampilkan informasi Tentang kami yang tersedia di sistem. Anda dapat menambah, memperbarui, atau menghapus Tentang kami sesuai kebutuhan.
            </p>

            <div className="space-y-4">
                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Klinik</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none"
                    />
                </div>

                {/* Vision and Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Visi Klinik</label>
                        <input
                            type="text"
                            name="vision"
                            value={formData.vision}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Misi Klinik</label>
                        <input
                            type="text"
                            name="mission"
                            value={formData.mission}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                    </div>
                </div>

                {/* Operating Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jam Operasional Buka</label>
                        <input
                            type="time"
                            name="openingHours"
                            value={formData.openingHours}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jam Operasional Tutup</label>
                        <input
                            type="time"
                            name="closingHours"
                            value={formData.closingHours}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                    </div>
                </div>

                {/* Photo Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto Perusahaan</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="company-photo"
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
                            htmlFor="company-photo"
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-900 transition-colors text-sm"
                        >
                            Choose File
                        </label>
                        <span className="text-sm text-gray-500">
                            {formData.photo ? 'File Selected' : 'No File Choosen'}
                        </span>
                    </div>
                    {formData.photo && (
                        <img src={formData.photo} alt="Company Preview" className="mt-4 w-48 h-32 object-cover rounded-lg border border-gray-200" />
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button onClick={handleUpdate} className="bg-primary hover:bg-primary-dark">
                        Perbarui
                    </Button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClinicProfileForm;
