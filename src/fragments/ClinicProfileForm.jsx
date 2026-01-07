import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import { apiFetch } from '../lib/api';

const ClinicProfileForm = () => {
    const [formData, setFormData] = useState({
        visi: '',
        misi: '',
        deskripsiPerusahaan: '',
        nomorCustomerService: '',
        jamBukak: '',
        jamKeluar: '',
        fotoFile: null
    });
    const [photoPreview, setPhotoPreview] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [profileId, setProfileId] = useState(null);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await apiFetch('/api/profil-perusahaan');
            const data = res?.data || res || [];

            // Ambil profil pertama jika ada
            if (Array.isArray(data) && data.length > 0) {
                const profile = data[0];
                setProfileId(profile.idProfil);
                setFormData({
                    visi: profile.visi || '',
                    misi: profile.misi || '',
                    deskripsiPerusahaan: profile.deskripsiPerusahaan || '',
                    nomorCustomerService: profile.nomorCustomerService || '',
                    jamBukak: profile.jamBukak || '',
                    jamKeluar: profile.jamKeluar || '',
                    fotoFile: null
                });
                // Set photo preview if exists
                if (profile.foto) {
                    setPhotoPreview(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/${profile.foto}`);
                }
            }
        } catch (err) {
            setError(err?.data?.message || 'Gagal memuat profil perusahaan');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
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

    const buildFormData = (data) => {
        const fd = new FormData();
        fd.append('visi', data.visi);
        fd.append('misi', data.misi);
        fd.append('deskripsiPerusahaan', data.deskripsiPerusahaan || '');
        fd.append('nomorCustomerService', data.nomorCustomerService || '');
        // Format time to H:i (remove seconds if present)
        fd.append('jamBukak', data.jamBukak ? data.jamBukak.substring(0, 5) : '');
        fd.append('jamKeluar', data.jamKeluar ? data.jamKeluar.substring(0, 5) : '');
        if (data.fotoFile) {
            fd.append('foto', data.fotoFile);
        }
        return fd;
    };

    const handleUpdate = async () => {
        try {
            setError('');
            const formDataToSend = buildFormData(formData);

            if (profileId) {
                // Update existing profile
                formDataToSend.append('_method', 'PUT');
                await apiFetch(`/api/profil-perusahaan/${profileId}`, {
                    method: 'POST',
                    body: formDataToSend,
                });
                alert('Informasi klinik berhasil diperbarui!');
            } else {
                // Create new profile
                await apiFetch('/api/profil-perusahaan', {
                    method: 'POST',
                    body: formDataToSend,
                });
                alert('Profil klinik berhasil ditambahkan!');
            }

            await fetchProfile();
        } catch (err) {
            setError(err?.data?.message || 'Gagal memperbarui profil');
            alert('Gagal memperbarui profil: ' + (err?.data?.message || 'Terjadi kesalahan'));
        }
    };

    const handleDelete = async () => {
        if (!profileId) {
            alert('Tidak ada profil untuk dihapus');
            return;
        }

        window.history.pushState({}, '', `/api/profil-perusahaan/${profileId}`);
        const confirmed = window.confirm('Apakah Anda yakin ingin menghapus profil ini?');
        window.history.pushState({}, '', '/clinic-profile');

        if (confirmed) {
            try {
                await apiFetch(`/api/profil-perusahaan/${profileId}`, {
                    method: 'DELETE',
                });
                setProfileId(null);
                setFormData({
                    visi: '',
                    misi: '',
                    deskripsiPerusahaan: '',
                    nomorCustomerService: '',
                    jamBukak: '',
                    jamKeluar: '',
                    fotoFile: null
                });
                setPhotoPreview('');
                alert('Profil berhasil dihapus!');
            } catch (err) {
                setError(err?.data?.message || 'Gagal menghapus profil');
                alert('Gagal menghapus profil');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <p className="text-center text-gray-500">Memuat data...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Pengaturan Tentang Kami</h2>
            <p className="text-gray-500 text-sm mb-6">
                Halaman ini menampilkan informasi Tentang kami yang tersedia di sistem. Anda dapat menambah, memperbarui, atau menghapus Tentang kami sesuai kebutuhan.
            </p>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

            <div className="space-y-4">
                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Klinik</label>
                    <textarea
                        name="deskripsiPerusahaan"
                        value={formData.deskripsiPerusahaan}
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
                            name="visi"
                            value={formData.visi}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Misi Klinik</label>
                        <input
                            type="text"
                            name="misi"
                            value={formData.misi}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                    </div>
                </div>

                {/* Customer Service Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Customer Service</label>
                    <input
                        type="text"
                        name="nomorCustomerService"
                        value={formData.nomorCustomerService}
                        onChange={handleChange}
                        placeholder="08123456789"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                    />
                </div>

                {/* Operating Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jam Operasional Buka</label>
                        <input
                            type="time"
                            name="jamBukak"
                            value={formData.jamBukak}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jam Operasional Tutup</label>
                        <input
                            type="time"
                            name="jamKeluar"
                            value={formData.jamKeluar}
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
                            onChange={handleFileChange}
                        />
                        <label
                            htmlFor="company-photo"
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg cursor-pointer hover:bg-gray-900 transition-colors text-sm"
                        >
                            Choose File
                        </label>
                        <span className="text-sm text-gray-500">
                            {formData.fotoFile ? formData.fotoFile.name : (photoPreview ? 'File Selected' : 'No File Choosen')}
                        </span>
                    </div>
                    {photoPreview && (
                        <img src={photoPreview} alt="Company Preview" className="mt-4 w-48 h-32 object-cover rounded-lg border border-gray-200" />
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button onClick={handleUpdate} className="bg-primary hover:bg-primary-dark">
                        {profileId ? 'Perbarui' : 'Tambah'}
                    </Button>
                    {profileId && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            Hapus
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClinicProfileForm;
