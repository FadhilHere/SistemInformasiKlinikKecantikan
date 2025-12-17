import React, { useState } from 'react';
import ScheduleReservationModal from './ScheduleReservationModal';
import DeleteModal from './DeleteModal';

// Mock Data
const INITIAL_SCHEDULES = [
    { id: 1, startTime: '08:00', endTime: '09:00' },
    { id: 2, startTime: '09:00', endTime: '10:00' },
    { id: 3, startTime: '10:00', endTime: '11:00' },
    { id: 4, startTime: '11:00', endTime: '12:00' },
    { id: 5, startTime: '13:00', endTime: '14:00' },
    { id: 6, startTime: '14:00', endTime: '15:00' },
    { id: 7, startTime: '15:00', endTime: '16:00' },
    { id: 8, startTime: '16:00', endTime: '17:00' }
];

const ScheduleReservationTable = () => {
    const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    // Handlers
    const handleAdd = (newSchedule) => {
        const scheduleWithId = { ...newSchedule, id: schedules.length + 1 };
        setSchedules([...schedules, scheduleWithId]);
        setIsAddModalOpen(false);
    };

    const handleEdit = (updatedSchedule) => {
        setSchedules(schedules.map(s => s.id === updatedSchedule.id ? updatedSchedule : s));
        setIsEditModalOpen(false);
        setSelectedSchedule(null);
    };

    const handleDelete = () => {
        setSchedules(schedules.filter(s => s.id !== selectedSchedule.id));
        setIsDeleteModalOpen(false);
        setSelectedSchedule(null);
    };

    const openEditModal = (schedule) => {
        setSelectedSchedule(schedule);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (schedule) => {
        setSelectedSchedule(schedule);
        setIsDeleteModalOpen(true);
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

            {/* Table */}
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
                        {schedules.map((schedule, index) => (
                            <tr key={schedule.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                                <td className="py-4 px-6 font-medium text-gray-900">{schedule.startTime}</td>
                                <td className="py-4 px-6 font-medium text-gray-900">{schedule.endTime}</td>
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
            <ScheduleReservationModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <ScheduleReservationModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={selectedSchedule}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemType="schedule"
            />
        </div>
    );
};

export default ScheduleReservationTable;
