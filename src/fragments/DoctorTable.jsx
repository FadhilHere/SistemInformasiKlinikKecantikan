import React, { useEffect, useState } from 'react';
import DoctorModal from './DoctorModal';
import DeleteModal from './DeleteModal';
import { apiFetch, API_BASE_URL } from '../lib/api';

const DoctorTable = () => {
    const [doctors, setDoctors] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchDoctors = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await apiFetch('/api/profil-dokter');
            const list = res?.data || res || [];
            setDoctors(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err?.data?.message || 'Gagal memuat data dokter');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const buildFormData = (payload) => {
        const fd = new FormData();
        if (payload.nama) fd.append('nama', payload.nama);
        if (payload.email) fd.append('email', payload.email);
        if (payload.deskripsi) fd.append('deskripsi', payload.deskripsi);
        // if (payload.status) fd.append('status', payload.status); // status sementara tidak dipakai
        if (payload.fotoFile) fd.append('foto', payload.fotoFile);
        return fd;
    };

    const handleAdd = async (newDoctor) => {
        try {
            const formData = buildFormData(newDoctor);
            await apiFetch('/api/profil-dokter', {
                method: 'POST',
                body: formData,
            });
            setIsAddModalOpen(false);
            await fetchDoctors();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menambah dokter');
        }
    };

    const handleEdit = async (updatedDoctor) => {
        if (!selectedDoctor) return;
        try {
            const formData = buildFormData(updatedDoctor);
            formData.append('_method', 'PUT');
            await apiFetch(`/api/profil-dokter/${selectedDoctor.id || selectedDoctor.idDokter}`, {
                method: 'POST',
                body: formData,
            });
            setIsEditModalOpen(false);
            setSelectedDoctor(null);
            await fetchDoctors();
        } catch (err) {
            setError(err?.data?.message || 'Gagal memperbarui dokter');
        }
    };

    const handleDelete = async () => {
        if (!selectedDoctor) return;
        try {
            await apiFetch(`/api/profil-dokter/${selectedDoctor.id || selectedDoctor.idDokter}`, {
                method: 'DELETE',
            });
            setIsDeleteModalOpen(false);
            setSelectedDoctor(null);
            await fetchDoctors();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menghapus dokter');
        }
    };

    const openEditModal = (doctor) => {
        setSelectedDoctor(doctor);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (doctor) => {
        setSelectedDoctor(doctor);
        setIsDeleteModalOpen(true);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'active':
            case 'aktif':
                return 'bg-green-100 text-green-600';
            case 'inactive':
            case 'nonaktif':
                return 'bg-gray-100 text-gray-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/100?text=No+Image';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}/storage/${path}`;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center border-b border-gray-100">
                <div className="flex gap-2 ml-auto">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary hover:bg-primary-dark text-white p-2 rounded-md transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {error && <div className="px-4 py-2 text-sm text-red-600">{error}</div>}
            {isLoading ? (
                <div className="py-6 text-center text-sm text-gray-500">Memuat data...</div>
            ) : (
                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-500 border-b border-gray-100 bg-white">
                            <tr>
                                <th className="py-4 px-6 font-medium w-16">No</th>
                                <th className="py-4 px-6 font-medium">Nama Dokter</th>
                                <th className="py-4 px-6 font-medium">Photo</th>
                                <th className="py-4 px-6 font-medium">Email</th>
                                <th className="py-4 px-6 font-medium">Deskripsi</th>
                                <th className="py-4 px-6 font-medium">Status</th>
                                <th className="py-4 px-6 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor, index) => (
                                <tr key={doctor.id || doctor.idDokter} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{doctor.nama || doctor.name}</td>
                                    <td className="py-4 px-6">
                                        <img src={getImageUrl(doctor.foto || doctor.photo)} alt={doctor.nama || doctor.name} className="w-10 h-10 rounded-full object-cover" />
                                    </td>
                                    <td className="py-4 px-6 text-gray-500">{doctor.email}</td>
                                    <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{doctor.deskripsi || doctor.description}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusBadgeClass(doctor.status)}`}>
                                                {doctor.status || '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => openEditModal(doctor)}
                                                className="text-gray-400 hover:text-blue-500"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(doctor)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modals */}
            <DoctorModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <DoctorModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={selectedDoctor}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemType="doctor"
            />
        </div>
    );
};

export default DoctorTable;
