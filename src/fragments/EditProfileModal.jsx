import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import AlertModal from './AlertModal';
import { apiFetch } from '../lib/api';

const EditProfileModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: '',
        gender: '',
        whatsapp: '',
        address: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'info'
    });

    useEffect(() => {
        const fetchUser = async () => {
            if (!isOpen) return;
            try {
                setIsLoading(true);
                const res = await apiFetch('/api/me');
                const user = res.data || res;
                setFormData({
                    name: user.nama || '',
                    email: user.email || '',
                    birthDate: user.tanggalLahir || '',
                    gender: user.jenisKelamin || '',
                    whatsapp: user.nomorWa || '',
                    address: user.alamat || '',
                    password: '' // Keep empty for security
                });
            } catch (err) {
                console.error('Failed to fetch user info:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setAlertConfig({
            isOpen: true,
            title: 'Berhasil',
            message: 'Profil berhasil diperbarui!',
            variant: 'success'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        EDIT PROFIL
                    </h2>
                </div>

                {/* Welcome Message */}
                <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                        <div className="flex-1">
                            <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs rounded mb-1">Online</span>
                            <h3 className="font-bold text-gray-900 mb-1">Hallo, {formData.name}!</h3>
                            <p className="text-sm text-gray-600">
                                Anda dapat mengganti dan menyesuaikan dengan kebutuhan. Ayo atur profil Anda sekarang!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Bintang Puspita"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="BintangPuspita@gmail.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>

                        {/* Birth Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm appearance-none"
                            >
                                <option value="">Pilih Jenis Kelamin</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>

                        {/* WhatsApp */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                placeholder="08xx-xxxx-xxxx"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Jl.KlangKubumi"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>

                        {/* Password */}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Isi untuk ubah password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div> */}
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-center pt-2">
                        <p className="text-sm text-gray-600">
                            Lupa Password Anda?{' '}
                            <button type="button" className="text-primary hover:underline font-medium">
                                klik Di sini.
                            </button>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        >
                            Batal
                        </button>
                        <Button type="submit">
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>

            <AlertModal
                isOpen={alertConfig.isOpen}
                title={alertConfig.title}
                message={alertConfig.message}
                variant={alertConfig.variant}
                onClose={() => {
                    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
                    onClose();
                }}
            />
        </div>
    );
};

export default EditProfileModal;
