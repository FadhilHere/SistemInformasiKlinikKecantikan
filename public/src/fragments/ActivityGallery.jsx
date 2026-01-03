import React, { useState, useEffect } from 'react';
import ActivityModal from './ActivityModal';
import DeleteModal from './DeleteModal';
import { apiFetch } from '../lib/api';

const ActivityGallery = () => {
    const [activities, setActivities] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchActivities = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await apiFetch('/api/kegiatan');
            const list = res?.data || res || [];
            setActivities(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err?.data?.message || 'Gagal memuat data kegiatan');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const buildFormData = (data) => {
        const formData = new FormData();
        formData.append('namaKegiatan', data.namaKegiatan);
        formData.append('deskripsi', data.deskripsi || '');
        formData.append('tanggalKegiatan', data.tanggalKegiatan);
        if (data.foto) {
            formData.append('foto', data.foto);
        }
        return formData;
    };

    const handleAdd = async (newActivity) => {
        try {
            const formData = buildFormData(newActivity);
            await apiFetch('/api/kegiatan', {
                method: 'POST',
                body: formData,
            });
            setIsAddModalOpen(false);
            await fetchActivities();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menambah kegiatan');
            alert('Gagal menambah kegiatan');
        }
    };

    const handleEdit = async (updatedActivity) => {
        if (!selectedActivity) return;
        try {
            const formData = buildFormData(updatedActivity);
            formData.append('_method', 'PUT');

            await apiFetch(`/api/kegiatan/${selectedActivity.idKegiatan}`, {
                method: 'POST',
                body: formData,
            });

            closeEditModal();
            await fetchActivities();
        } catch (err) {
            setError(err?.data?.message || 'Gagal memperbarui kegiatan');
            alert('Gagal memperbarui kegiatan');
        }
    };

    const handleDelete = async () => {
        if (!selectedActivity) return;
        try {
            await apiFetch(`/api/kegiatan/${selectedActivity.idKegiatan}`, {
                method: 'DELETE',
            });
            setIsDeleteModalOpen(false);
            setSelectedActivity(null);
            await fetchActivities();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menghapus kegiatan');
            alert('Gagal menghapus kegiatan');
        }
    };

    const openDeleteModal = (activity) => {
        setSelectedActivity(activity);
        setIsDeleteModalOpen(true);
        window.history.pushState({}, '', `/api/kegiatan/${activity.idKegiatan}`);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedActivity(null);
        window.history.pushState({}, '', '/clinic-profile');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const openEditModal = (activity) => {
        setSelectedActivity(activity);
        setIsEditModalOpen(true);
        window.history.pushState({}, '', `/clinic-profile/${activity.idKegiatan}`);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedActivity(null);
        window.history.pushState({}, '', '/clinic-profile');
    };

    const getPhotoUrl = (photoPath) => {
        if (!photoPath) return 'https://via.placeholder.com/400x300';
        return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${photoPath}`;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Galeri Kegiatan</h2>
                    <p className="text-gray-500 text-sm">
                        Kegiatan dan dokumentasi dari berbagai acara kami.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium"
                >
                    Tambah
                </button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>}

            {isLoading ? (
                <div className="py-6 text-center text-sm text-gray-500">Memuat data...</div>
            ) : (
                <>
                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activities.map((activity) => (
                            <div key={activity.idKegiatan} className="border border-gray-200 rounded-lg overflow-hidden">
                                {/* Photo */}
                                <div className="relative bg-gray-100 h-48 flex items-center justify-center">
                                    {activity.foto ? (
                                        <img src={getPhotoUrl(activity.foto)} alt={activity.namaKegiatan} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-400 text-sm">Foto</span>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="px-3 py-1 bg-gray-800 text-white text-xs rounded">
                                            {activity.deskripsi || '-'}
                                        </span>

                                    </div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-4">{activity.namaKegiatan}</h3>
                                    <div>
                                        <span className="text-xs text-gray-500 ml-2">
                                            {formatDate(activity.tanggalKegiatan)}
                                        </span>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(activity)}
                                            className="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors text-sm font-medium"
                                        >
                                            Perbarui
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(activity)}
                                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {
                        activities.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                Belum ada kegiatan yang ditambahkan
                            </div>
                        )
                    }
                </>
            )}

            {/* Modals */}
            <ActivityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <ActivityModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                mode="edit"
                initialData={selectedActivity}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                itemType="kegiatan"
            />
        </div>
    );
};

export default ActivityGallery;
