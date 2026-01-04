import React, { useState } from 'react';
import TreatmentReservationModal from './TreatmentReservationModal';
import DeleteModal from './DeleteModal';

// Mock Data
const INITIAL_RESERVATIONS = [
    {
        id: 1,
        customerName: 'Siti Aminah',
        treatmentType: 'Facial Treatment',
        startTime: '09:00',
        endTime: '10:00',
        treatmentDate: '2024-02-15',
        doctor: 'Dr. Sarah',
        whatsapp: '081234567890',
        reservationType: 'Walk-in',
        status: 'Konfirmasi'
    },
    {
        id: 2,
        customerName: 'Ahmad Fauzi',
        treatmentType: 'Hair Treatment',
        startTime: '11:00',
        endTime: '12:00',
        treatmentDate: '2024-02-16',
        doctor: 'Dr. Michael',
        whatsapp: '082345678901',
        reservationType: 'Online',
        status: 'Datang'
    },
    {
        id: 3,
        customerName: 'Dewi Lestari',
        treatmentType: 'Skin Treatment',
        startTime: '14:00',
        endTime: '15:00',
        treatmentDate: '2024-02-17',
        doctor: 'Dr. Sarah',
        whatsapp: '083456789012',
        reservationType: 'Online',
        status: 'Tidak Datang'
    }
];

const TreatmentReservationTable = () => {
    const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    // Handlers
    const handleAdd = (newReservation) => {
        const reservationWithId = { ...newReservation, id: reservations.length + 1 };
        setReservations([...reservations, reservationWithId]);
        setIsAddModalOpen(false);
    };

    const handleEdit = (updatedReservation) => {
        setReservations(reservations.map(r => r.id === updatedReservation.id ? updatedReservation : r));
        setIsEditModalOpen(false);
        setSelectedReservation(null);
    };

    const handleDelete = () => {
        setReservations(reservations.filter(r => r.id !== selectedReservation.id));
        setIsDeleteModalOpen(false);
        setSelectedReservation(null);
    };

    const openEditModal = (reservation) => {
        setSelectedReservation(reservation);
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (reservation) => {
        setSelectedReservation(reservation);
        setIsDeleteModalOpen(true);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Konfirmasi':
                return 'bg-green-100 text-green-600';
            case 'Datang':
                return 'bg-green-100 text-green-600';
            case 'Tidak Datang':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
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

                    {/* Print Button */}
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-md transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                    </button>

                    {/* Excel Button */}
                    <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition-colors flex items-center gap-2 text-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        Excel
                    </button>

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
                            <th className="py-4 px-6 font-medium">Nama Customer</th>
                            <th className="py-4 px-6 font-medium">Jenis Treatment</th>
                            <th className="py-4 px-6 font-medium">Jam</th>
                            <th className="py-4 px-6 font-medium">Tanggal</th>
                            <th className="py-4 px-6 font-medium">Dokter</th>
                            <th className="py-4 px-6 font-medium">Nomor</th>
                            <th className="py-4 px-6 font-medium">Type Reservasi</th>
                            <th className="py-4 px-6 font-medium">Status dan Result</th>
                            <th className="py-4 px-6 font-medium text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((reservation) => (
                            <tr key={reservation.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6 font-medium text-gray-900">{reservation.customerName}</td>
                                <td className="py-4 px-6 text-gray-500">{reservation.treatmentType}</td>
                                <td className="py-4 px-6 text-gray-500">{reservation.startTime} - {reservation.endTime}</td>
                                <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{reservation.treatmentDate}</td>
                                <td className="py-4 px-6 text-gray-900">{reservation.doctor}</td>
                                <td className="py-4 px-6 text-gray-500">{reservation.whatsapp}</td>
                                <td className="py-4 px-6 text-gray-500">{reservation.reservationType}</td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={reservation.status}
                                            onChange={(e) => {
                                                const newStatus = e.target.value;
                                                setReservations(reservations.map(r =>
                                                    r.id === reservation.id ? { ...r, status: newStatus } : r
                                                ));
                                            }}
                                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusBadgeClass(reservation.status)}`}
                                        >
                                            <option value="Konfirmasi">Konfirmasi</option>
                                            <option value="Datang">Datang</option>
                                            <option value="Tidak Datang">Tidak Datang</option>
                                        </select>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 10l5 5 5-5z" />
                                        </svg>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => openEditModal(reservation)}
                                            className="text-gray-400 hover:text-blue-500"
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(reservation)}
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
            <TreatmentReservationModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <TreatmentReservationModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={selectedReservation}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                itemType="reservation"
            />
        </div>
    );
};

export default TreatmentReservationTable;
