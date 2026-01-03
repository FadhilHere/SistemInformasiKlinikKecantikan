import React, { useEffect, useState } from 'react';
import EventModal from './EventModal';
import DeleteModal from './DeleteModal';
import { apiFetch, API_BASE_URL } from '../lib/api';

const EventTable = () => {
    const [events, setEvents] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchEvents = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await apiFetch('/api/event');
            const list = res?.data || res || [];
            setEvents(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err?.data?.message || 'Gagal memuat data event');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const buildFormData = (payload) => {
        const fd = new FormData();
        if (payload.nama) fd.append('nama', payload.nama);
        if (payload.deskripsi) fd.append('deskripsi', payload.deskripsi);
        if (payload.tanggalMulai) fd.append('tanggalMulai', payload.tanggalMulai);
        if (payload.tanggalSelesai) fd.append('tanggalSelesai', payload.tanggalSelesai);
        if (payload.lokasi) fd.append('lokasi', payload.lokasi);
        if (payload.fotoFile) fd.append('foto', payload.fotoFile);
        return fd;
    };

    const handleAdd = async (newEvent) => {
        try {
            const formData = buildFormData(newEvent);
            await apiFetch('/api/event', {
                method: 'POST',
                body: formData,
            });
            setIsAddModalOpen(false);
            await fetchEvents();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menambah event');
        }
    };

    const handleEdit = async (updatedEvent) => {
        if (!selectedEvent) return;
        try {
            const formData = buildFormData(updatedEvent);
            await apiFetch(`/api/event/${selectedEvent.idEvent || selectedEvent.id}`, {
                method: 'PUT',
                body: formData,
            });
            closeEditModal();
            await fetchEvents();
        } catch (err) {
            setError(err?.data?.message || 'Gagal memperbarui event');
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent) return;
        try {
            await apiFetch(`/api/event/${selectedEvent.idEvent || selectedEvent.id}`, {
                method: 'DELETE',
            });
            setIsDeleteModalOpen(false);
            setSelectedEvent(null);
            await fetchEvents();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menghapus event');
        }
    };

    const openEditModal = (event) => {
        setSelectedEvent(event);
        setIsEditModalOpen(true);
        // Update URL to show event ID
        window.history.pushState({}, '', `/events/${event.idEvent || event.id}`);
    };

    const openDeleteModal = (event) => {
        setSelectedEvent(event);
        setIsDeleteModalOpen(true);
        window.history.pushState({}, '', `/api/event/${event.idEvent || event.id}`);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedEvent(null);
        window.history.pushState({}, '', '/events');
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedEvent(null);
        // Restore URL to events page
        window.history.pushState({}, '', '/events');
    };

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/100?text=No+Image';
        if (path.startsWith('http')) return path;
        return `${API_BASE_URL}/storage/${path}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // Filter events based on search query
    const filteredEvents = events.filter((event) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const nama = (event.nama || '').toLowerCase();
        const deskripsi = (event.deskripsi || '').toLowerCase();
        const lokasi = (event.lokasi || '').toLowerCase();
        return nama.includes(query) || deskripsi.includes(query) || lokasi.includes(query);
    });

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-4 flex items-center border-b border-gray-100">
                <div className="flex gap-2 ml-auto">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari event..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <svg
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                        </svg>
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
                                <th className="py-4 px-6 font-medium">Nama Event</th>
                                <th className="py-4 px-6 font-medium">Deskripsi</th>
                                <th className="py-4 px-6 font-medium">Tanggal Mulai</th>
                                <th className="py-4 px-6 font-medium">Tanggal Selesai</th>
                                <th className="py-4 px-6 font-medium">Lokasi</th>
                                <th className="py-4 px-6 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.map((event, index) => (
                                <tr key={event.idEvent || event.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                                    <td className="py-4 px-6">
                                        <img
                                            src={getImageUrl(event.foto)}
                                            alt={event.nama}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                        />
                                    </td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{event.nama}</td>
                                    <td className="py-4 px-6 text-gray-500 max-w-xs truncate">{event.deskripsi}</td>
                                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{formatDate(event.tanggalMulai)}</td>
                                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{formatDate(event.tanggalSelesai)}</td>
                                    <td className="py-4 px-6 text-gray-900">{event.lokasi}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => openEditModal(event)}
                                                className="text-gray-400 hover:text-blue-500"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(event)}
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
                            {filteredEvents.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center text-gray-500">
                                        {searchQuery ? 'Tidak ada event yang sesuai dengan pencarian.' : 'Belum ada event yang terdaftar.'}
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
            <EventModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <EventModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                mode="edit"
                initialData={selectedEvent}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                itemType="event"
            />
        </div>
    );
};

export default EventTable;
