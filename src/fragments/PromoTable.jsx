import React, { useState, useEffect } from 'react';
import PromoModal from './PromoModal';
import DeleteModal from './DeleteModal';
import AlertModal from './AlertModal';
import { apiFetch } from '../lib/api';

const PromoTable = () => {
    const [promos, setPromos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [alertConfig, setAlertConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'info'
    });

    // Fetch Promos
    const fetchPromos = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await apiFetch('/api/promo');
            const list = res?.data || res || [];
            setPromos(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err?.data?.message || 'Gagal memuat data promo');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    // Helper: Build FormData
    const buildFormData = (data) => {
        const formData = new FormData();
        formData.append('namaPromo', data.namaPromo);
        formData.append('jenisPromo', data.jenisPromo);
        formData.append('kode', data.kode);
        formData.append('diskon', data.diskon);
        formData.append('deskripsi', data.deskripsi || '');
        formData.append('tanggalMulai', data.tanggalMulai);
        formData.append('tanggalSelesai', data.tanggalSelesai);
        formData.append('minimalTransaksi', data.minimalTransaksi || 0);
        // Convert status to boolean/integer (1 or 0) for backend
        // Default to 1 (Active) if undefined
        const statusValue = (data.status === 'Active' || data.status === '1' || data.status === 1 || data.status === true) ? 1 : 0;
        formData.append('status', statusValue);

        // Only append optional FKs if they have a non-empty value
        if (data.idKategori && data.idKategori !== '') formData.append('idKategori', data.idKategori);
        if (data.idProduk && data.idProduk !== '') formData.append('idProduk', data.idProduk);

        if (data.gambar instanceof File) {
            formData.append('gambar', data.gambar);
        }
        return formData;
    };

    // Handlers
    const handleAdd = async (newPromo) => {
        try {
            const formData = buildFormData(newPromo);
            await apiFetch('/api/promo', {
                method: 'POST',
                body: formData,
            });
            setIsAddModalOpen(false);
            await fetchPromos();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menambah promo');
            setAlertConfig({
                isOpen: true,
                title: 'Gagal menambah promo',
                message: err?.data?.message || err.message || 'Terjadi kesalahan saat menambah promo.',
                variant: 'error'
            });
        }
    };

    const handleEdit = async (updatedPromo) => {
        if (!selectedPromo) return;
        try {
            const formData = buildFormData(updatedPromo);
            formData.append('_method', 'PUT'); // For Laravel

            await apiFetch(`/api/promo/${selectedPromo.idPromo}`, {
                method: 'POST', // Use POST for FormData with _method=PUT
                body: formData,
            });
            setIsEditModalOpen(false);
            setSelectedPromo(null);
            await fetchPromos();
        } catch (err) {
            setError(err?.data?.message || 'Gagal memperbarui promo');
            setAlertConfig({
                isOpen: true,
                title: 'Gagal memperbarui promo',
                message: err?.data?.message || err.message || 'Terjadi kesalahan saat memperbarui promo.',
                variant: 'error'
            });
        }
    };

    const handleDelete = async () => {
        if (!selectedPromo) return;
        try {
            await apiFetch(`/api/promo/${selectedPromo.idPromo}`, {
                method: 'DELETE',
            });
            setIsDeleteModalOpen(false);
            setSelectedPromo(null);
            await fetchPromos();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menghapus promo');
            setAlertConfig({
                isOpen: true,
                title: 'Gagal menghapus promo',
                message: err?.data?.message || err.message || 'Terjadi kesalahan saat menghapus promo.',
                variant: 'error'
            });
        }
    };

    const openEditModal = (promo) => {
        setSelectedPromo(promo);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (promo) => {
        setSelectedPromo(promo);
        setIsDeleteModalOpen(true);
        window.history.pushState({}, '', `/api/promo/${promo.idPromo}`);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedPromo(null);
        window.history.pushState({}, '', '/promo');
    };

    // Helper functions
    const formatCurrency = (value) => {
        if (!value) return '-';
        return `Rp ${parseInt(value).toLocaleString('id-ID')}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const getPhotoUrl = (path) => {
        if (!path) return null;
        return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${path}`;
    };

    const getStatusBadgeClass = (status) => {
        if (status === 1 || status === true || status === 'Active' || status === '1') {
            return 'bg-green-100 text-green-600';
        }
        return 'bg-gray-100 text-gray-600';
    };

    // Filter
    const filteredPromos = promos.filter(promo =>
        promo.namaPromo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        promo.kode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Daftar Promo</h2>
                <div className="flex gap-2">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari Promo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-100 text-sm pl-4 pr-10 py-2 rounded-md outline-none focus:ring-1 focus:ring-primary w-64"
                        />
                        <div className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-gray-400 pointer-events-none">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                    </div>

                    {/* Add Button */}
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary hover:bg-primary-dark text-white p-2 rounded-md transition-colors flex items-center gap-2 px-4"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 text-sm">{error}</div>}

            {/* Table */}
            <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-sm text-left">
                    <thead className="text-gray-500 border-b border-gray-100 bg-white">
                        <tr>
                            <th className="py-4 px-6 font-medium w-16">No</th>
                            <th className="py-4 px-6 font-medium">Gambar</th>
                            <th className="py-4 px-6 font-medium">Nama Promo</th>
                            <th className="py-4 px-6 font-medium">Jenis</th>
                            <th className="py-4 px-6 font-medium">Kode</th>
                            <th className="py-4 px-6 font-medium">Diskon</th>
                            <th className="py-4 px-6 font-medium">Periode</th>
                            <th className="py-4 px-6 font-medium">Min. Transaksi</th>
                            <th className="py-4 px-6 font-medium text-center">Status</th>
                            <th className="py-4 px-6 font-medium text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="10" className="text-center py-8 text-gray-400">Memuat data...</td>
                            </tr>
                        ) : filteredPromos.length === 0 ? (
                            <tr>
                                <td colSpan="10" className="text-center py-8 text-gray-400">Tidak ada data promo ditemukan</td>
                            </tr>
                        ) : (
                            filteredPromos.map((promo, index) => (
                                <tr key={promo.idPromo} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                                    <td className="py-4 px-6">
                                        {promo.gambar ? (
                                            <img
                                                src={getPhotoUrl(promo.gambar)}
                                                alt={promo.namaPromo}
                                                className="w-32 h-20 object-cover rounded shadow-sm bg-gray-100"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500"
                                            style={{ display: promo.gambar ? 'none' : 'flex' }}
                                        >
                                            No Img
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{promo.namaPromo}</td>
                                    <td className="py-4 px-6 text-gray-500">{promo.jenisPromo}</td>
                                    <td className="py-4 px-6 text-gray-500">{promo.kode}</td>
                                    <td className="py-4 px-6 text-green-600 font-medium">{promo.diskon}</td>
                                    <td className="py-4 px-6 text-gray-500 text-xs">
                                        <div>{formatDate(promo.tanggalMulai)}</div>
                                        <div className="text-gray-400">s/d</div>
                                        <div>{formatDate(promo.tanggalSelesai)}</div>
                                    </td>
                                    <td className="py-4 px-6 text-gray-900">{formatCurrency(promo.minimalTransaksi)}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(promo.status)}`}>
                                            {(promo.status === 1 || promo.status === 'Active' || promo.status === true) ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => openEditModal(promo)}
                                                className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                title="Edit"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(promo)}
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Hapus"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
                <button className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Previous
                </button>

                <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-lg bg-green-100 text-green-600 font-medium flex items-center justify-center text-sm">1</button>
                </div>

                <button className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm">
                    Next
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Modals */}
            <PromoModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <PromoModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={selectedPromo}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                itemType="promo"
                itemName={selectedPromo?.namaPromo}
            />

            <AlertModal
                isOpen={alertConfig.isOpen}
                title={alertConfig.title}
                message={alertConfig.message}
                variant={alertConfig.variant}
                onClose={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
};

export default PromoTable;
