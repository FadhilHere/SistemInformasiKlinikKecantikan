import React, { useEffect, useState } from 'react';
import ScheduleReservationModal from './ScheduleReservationModal';
import DeleteModal from './DeleteModal';
import { apiFetch } from '../lib/api';

const ScheduleReservationTable = () => {
    const [schedules, setSchedules] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchSchedules = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await apiFetch('/api/jadwal-reservasi');
            const list = res?.data || res || [];
            setSchedules(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err?.data?.message || 'Gagal memuat data jadwal');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleAdd = async (newSchedule) => {
        try {
            await apiFetch('/api/jadwal-reservasi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSchedule),
            });
            setIsAddModalOpen(false);
            await fetchSchedules();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menambah jadwal');
        }
    };

    const handleEdit = async (updatedSchedule) => {
        if (!selectedSchedule) return;
        try {
            await apiFetch(`/api/jadwal-reservasi/${selectedSchedule.idJadwal || selectedSchedule.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSchedule),
            });
            closeEditModal();
            await fetchSchedules();
        } catch (err) {
            setError(err?.data?.message || 'Gagal memperbarui jadwal');
        }
    };

    const handleDelete = async () => {
        if (!selectedSchedule) return;
        try {
            await apiFetch(`/api/jadwal-reservasi/${selectedSchedule.idJadwal || selectedSchedule.id}`, {
                method: 'DELETE',
            });
            setIsDeleteModalOpen(false);
            setSelectedSchedule(null);
            await fetchSchedules();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menghapus jadwal');
        }
    };

    const openEditModal = (schedule) => {
        setSelectedSchedule(schedule);
        setIsEditModalOpen(true);
        window.history.pushState({}, '', `/schedules/${schedule.idJadwal || schedule.id}`);
    };

    const openDeleteModal = (schedule) => {
        setSelectedSchedule(schedule);
        setIsDeleteModalOpen(true);
        window.history.pushState({}, '', `/api/jadwal-reservasi/${schedule.idJadwal || schedule.id}`);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedSchedule(null);
        window.history.pushState({}, '', '/schedules');
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedSchedule(null);
        window.history.pushState({}, '', '/schedules');
    };

    // Filter schedules based on search query
    const filteredSchedules = schedules.filter((schedule) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const jamMulai = (schedule.jamMulai || '').toLowerCase();
        const jamSelesai = (schedule.jamSelesai || '').toLowerCase();
        return jamMulai.includes(query) || jamSelesai.includes(query);
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
                            placeholder="Cari jadwal..."
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
                                <th className="py-4 px-6 font-medium w-20">No</th>
                                <th className="py-4 px-6 font-medium">Jam Mulai</th>
                                <th className="py-4 px-6 font-medium">Jam Selesai</th>
                                <th className="py-4 px-6 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchedules.map((schedule, index) => (
                                <tr key={schedule.idJadwal || schedule.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{schedule.jamMulai}</td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{schedule.jamSelesai}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-center gap-4">
                                            <button
                                                onClick={() => openEditModal(schedule)}
                                                className="text-gray-400 hover:text-blue-500"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(schedule)}
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
                            {filteredSchedules.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-500">
                                        {searchQuery ? 'Tidak ada jadwal yang sesuai dengan pencarian.' : 'Belum ada jadwal yang terdaftar.'}
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
            <ScheduleReservationModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <ScheduleReservationModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                mode="edit"
                initialData={selectedSchedule}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                itemType="jadwal"
            />
        </div>
    );
};

export default ScheduleReservationTable;
