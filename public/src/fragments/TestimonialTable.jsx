import React, { useEffect, useState } from 'react';
import TestimonialModal from './TestimonialModal';
import DeleteModal from './DeleteModal';
import { apiFetch } from '../lib/api';

const TestimonialTable = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTestimonial, setSelectedTestimonial] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTestimonials = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await apiFetch('/api/testimoni');
            const list = res?.data || res || [];
            setTestimonials(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err?.data?.message || 'Gagal memuat data testimoni');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const buildFormData = (data) => {
        const formData = new FormData();
        formData.append('namaTester', data.namaTester);
        formData.append('jenisTestimoni', data.jenisTestimoni);
        formData.append('deskripsi', data.deskripsi || '');
        formData.append('tanggalTreatment', data.tanggalTreatment);
        if (data.buktiFoto) {
            formData.append('buktiFoto', data.buktiFoto);
        }
        return formData;
    };

    const handleAdd = async (newTestimonial) => {
        try {
            const formData = buildFormData(newTestimonial);
            await apiFetch('/api/testimoni', {
                method: 'POST',
                body: formData,
            });
            setIsAddModalOpen(false);
            await fetchTestimonials();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menambah testimoni');
        }
    };

    const handleEdit = async (updatedTestimonial) => {
        if (!selectedTestimonial) return;
        try {
            const formData = buildFormData(updatedTestimonial);
            // Laravel requires POST with _method for file uploads
            formData.append('_method', 'PUT');

            await apiFetch(`/api/testimoni/${selectedTestimonial.idTestimoni}`, {
                method: 'POST',
                body: formData,
            });

            closeEditModal();
            await fetchTestimonials();
        } catch (err) {
            setError(err?.data?.message || 'Gagal memperbarui testimoni');
        }
    };

    const handleDelete = async () => {
        if (!selectedTestimonial) return;
        try {
            await apiFetch(`/api/testimoni/${selectedTestimonial.idTestimoni}`, {
                method: 'DELETE',
            });
            setIsDeleteModalOpen(false);
            setSelectedTestimonial(null);
            await fetchTestimonials();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menghapus testimoni');
        }
    };

    const openEditModal = (testimonial) => {
        setSelectedTestimonial(testimonial);
        setIsEditModalOpen(true);
        window.history.pushState({}, '', `/testimonials/${testimonial.idTestimoni}`);
    };

    const openDeleteModal = (testimonial) => {
        setSelectedTestimonial(testimonial);
        setIsDeleteModalOpen(true);
        window.history.pushState({}, '', `/api/testimoni/${testimonial.idTestimoni}`);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedTestimonial(null);
        window.history.pushState({}, '', '/testimonials');
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedTestimonial(null);
        window.history.pushState({}, '', '/testimonials');
    };

    // Filter testimonials based on search query
    const filteredTestimonials = testimonials.filter((testimonial) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const namaTester = (testimonial.namaTester || '').toLowerCase();
        const jenisTestimoni = (testimonial.jenisTestimoni || '').toLowerCase();
        const deskripsi = (testimonial.deskripsi || '').toLowerCase();
        return namaTester.includes(query) || jenisTestimoni.includes(query) || deskripsi.includes(query);
    });

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const getPhotoUrl = (photoPath) => {
        if (!photoPath) return 'https://ui-avatars.com/api/?name=No+Photo&background=e5e7eb&color=6b7280';
        // Backend saves to public/uploads/testimoni/ and stores path as 'uploads/testimoni/filename.jpg'
        // So we access it directly without /storage prefix
        return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/${photoPath}`;
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-4 flex items-center border-b border-gray-100">
                <div className="flex gap-2 ml-auto">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-gray-100 text-sm pl-4 pr-10 py-2 rounded-md outline-none focus:ring-1 focus:ring-primary w-64"
                        />
                        <button className="absolute right-0 top-0 bottom-0 px-3 bg-primary rounded-r-md text-white flex items-center justify-center hover:bg-primary-dark">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Add Button */}
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
                                <th className="py-4 px-6 font-medium">Foto</th>
                                <th className="py-4 px-6 font-medium">Nama</th>
                                <th className="py-4 px-6 font-medium">Tanggal</th>
                                <th className="py-4 px-6 font-medium">Deskripsi</th>
                                <th className="py-4 px-6 font-medium">Jenis Testimoni</th>
                                <th className="py-4 px-6 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTestimonials.map((testimonial, index) => (
                                <tr key={testimonial.idTestimoni} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                                    <td className="py-4 px-6">
                                        <img
                                            src={getPhotoUrl(testimonial.buktiFoto)}
                                            alt={testimonial.namaTester}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    </td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{testimonial.namaTester}</td>
                                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{formatDate(testimonial.tanggalTreatment)}</td>
                                    <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{testimonial.deskripsi || '-'}</td>
                                    <td className="py-4 px-6 text-gray-900">{testimonial.jenisTestimoni}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => openEditModal(testimonial)}
                                                className="text-gray-400 hover:text-blue-500"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(testimonial)}
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
                            {filteredTestimonials.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-4 py-6 text-center text-sm text-gray-500">
                                        Tidak ada data testimoni
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

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
            <TestimonialModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <TestimonialModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                mode="edit"
                initialData={selectedTestimonial}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                itemType="testimoni"
            />
        </div>
    );
};

export default TestimonialTable;
