import React, { useEffect, useState } from 'react';
import TreatmentReservationModal from './TreatmentReservationModal';
import DeleteModal from './DeleteModal';
import { apiFetch } from '../lib/api';

const TreatmentReservationTable = () => {
    const [reservations, setReservations] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showExportFilter, setShowExportFilter] = useState(false);
    const [exportFilterJenisTreatment, setExportFilterJenisTreatment] = useState('');
    const [exportFilterTanggalMulai, setExportFilterTanggalMulai] = useState('');
    const [exportFilterTanggalSelesai, setExportFilterTanggalSelesai] = useState('');

    const fetchReservations = async () => {
        try {
            setIsLoading(true);
            setError('');
            const res = await apiFetch('/api/reservasi');
            const list = res?.data || res || [];
            setReservations(Array.isArray(list) ? list : []);
        } catch (err) {
            setError(err?.data?.message || 'Gagal memuat data reservasi');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCustomers = async () => {
        try {
            const res = await apiFetch('/api/users');
            const list = res?.data || res || [];
            setCustomers(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Failed to fetch customers:', err);
        }
    };

    const fetchDoctors = async () => {
        try {
            const res = await apiFetch('/api/profil-dokter');
            const list = res?.data || res || [];
            setDoctors(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error('Failed to fetch doctors:', err);
        }
    };

    useEffect(() => {
        fetchReservations();
        fetchCustomers();
        fetchDoctors();
    }, []);

    const handleAdd = async (newReservation) => {
        try {
            await apiFetch('/api/reservasi', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newReservation),
            });
            setIsAddModalOpen(false);
            await fetchReservations();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menambah reservasi');
        }
    };

    const handleEdit = async (updatedReservation) => {
        if (!selectedReservation) return;
        try {
            await apiFetch(`/api/reservasi/${selectedReservation.idReservasi || selectedReservation.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedReservation),
            });
            closeEditModal();
            await fetchReservations();
        } catch (err) {
            setError(err?.data?.message || 'Gagal memperbarui reservasi');
        }
    };

    const handleDelete = async () => {
        if (!selectedReservation) return;
        try {
            await apiFetch(`/api/reservasi/${selectedReservation.idReservasi || selectedReservation.id}`, {
                method: 'DELETE',
            });
            setIsDeleteModalOpen(false);
            setSelectedReservation(null);
            await fetchReservations();
        } catch (err) {
            setError(err?.data?.message || 'Gagal menghapus reservasi');
        }
    };

    const openEditModal = (reservation) => {
        setSelectedReservation(reservation);
        setIsEditModalOpen(true);
        window.history.pushState({}, '', `/reservations/${reservation.idReservasi || reservation.id}`);
    };

    const openDeleteModal = (reservation) => {
        setSelectedReservation(reservation);
        setIsDeleteModalOpen(true);
        window.history.pushState({}, '', `/api/reservasi/${reservation.idReservasi || reservation.id}`);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedReservation(null);
        window.history.pushState({}, '', '/reservations');
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedReservation(null);
        window.history.pushState({}, '', '/reservations');
    };

    const getCustomerName = (idUser) => {
        const customer = customers.find(c => String(c.idUser) === String(idUser));
        return customer ? customer.nama : '-';
    };

    const getDoctorName = (idDokter) => {
        const doctor = doctors.find(d => String(d.idDokter) === String(idDokter));
        return doctor ? doctor.nama : '-';
    };

    const getStatusBadgeClass = (status) => {
        const statusLower = (status || '').toLowerCase();
        switch (statusLower) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-600';
            case 'konfirmasi':
                return 'bg-blue-100 text-blue-600';
            case 'datang':
                return 'bg-green-100 text-green-600';
            case 'tidak datang':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
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

    // Filter reservations based on search query only (for table display)
    const filteredReservations = reservations.filter((reservation) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const customerName = getCustomerName(reservation.idUser).toLowerCase();
        const doctorName = getDoctorName(reservation.idDokter).toLowerCase();
        const jenisTreatment = (reservation.jenisTreatment || '').toLowerCase();
        return customerName.includes(query) || doctorName.includes(query) || jenisTreatment.includes(query);
    });

    // Export to CSV - uses export-specific filters
    const handleExportCSV = () => {
        let dataToExport = reservations;

        // Apply export filters
        if (exportFilterJenisTreatment) {
            dataToExport = dataToExport.filter(res => res.jenisTreatment === exportFilterJenisTreatment);
        }

        if (exportFilterTanggalMulai) {
            const startDate = new Date(exportFilterTanggalMulai);
            dataToExport = dataToExport.filter(res => new Date(res.tanggalReservasi) >= startDate);
        }

        if (exportFilterTanggalSelesai) {
            const endDate = new Date(exportFilterTanggalSelesai);
            dataToExport = dataToExport.filter(res => new Date(res.tanggalReservasi) <= endDate);
        }

        const headers = ['No', 'Nama Customer', 'Nomor WA', 'Jenis Treatment', 'Tanggal Reservasi', 'Dokter', 'Status'];
        const data = dataToExport.map((res, index) => [
            index + 1,
            getCustomerName(res.idUser),
            res.nomorWa || '-',
            res.jenisTreatment || '-',
            formatDate(res.tanggalReservasi),
            getDoctorName(res.idDokter),
            res.status || '-'
        ]);

        const csvContent = [
            headers.join(','),
            ...data.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Reservasi_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                            placeholder="Cari reservasi..."
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

                    {/* CSV Export Button */}
                    <button
                        onClick={() => setShowExportFilter(!showExportFilter)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition-colors flex items-center gap-2 text-sm"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                        </svg>
                        Export CSV
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

            {/* Export Filter Form (Collapsible) */}
            {showExportFilter && (
                <div className="p-4 bg-blue-50 border-b border-blue-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Filter Data Export</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Jenis Treatment</label>
                            <select
                                value={exportFilterJenisTreatment}
                                onChange={(e) => setExportFilterJenisTreatment(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            >
                                <option value="">Semua Treatment</option>
                                <option value="Hair Treatment">Hair Treatment</option>
                                <option value="Body Treatment">Body Treatment</option>
                                <option value="Perawatan Wajah">Perawatan Wajah</option>
                                <option value="Skin Treatment">Skin Treatment</option>
                                <option value="Facial Treatment">Facial Treatment</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Tanggal Mulai</label>
                            <input
                                type="date"
                                value={exportFilterTanggalMulai}
                                onChange={(e) => setExportFilterTanggalMulai(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Tanggal Selesai</label>
                            <input
                                type="date"
                                value={exportFilterTanggalSelesai}
                                onChange={(e) => setExportFilterTanggalSelesai(e.target.value)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => {
                                setExportFilterJenisTreatment('');
                                setExportFilterTanggalMulai('');
                                setExportFilterTanggalSelesai('');
                            }}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                        >
                            Reset Filter
                        </button>
                        <button
                            onClick={() => {
                                handleExportCSV();
                                setShowExportFilter(false);
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                        >
                            Download CSV
                        </button>
                    </div>
                </div>
            )}

            {error && <div className="px-4 py-2 text-sm text-red-600">{error}</div>}
            {isLoading ? (
                <div className="py-6 text-center text-sm text-gray-500">Memuat data...</div>
            ) : (
                <div className="overflow-x-auto min-h-[300px]">
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-500 border-b border-gray-100 bg-white">
                            <tr>
                                <th className="py-4 px-6 font-medium w-16">No</th>
                                <th className="py-4 px-6 font-medium">Nama Customer</th>
                                <th className="py-4 px-6 font-medium">Nomor WA</th>
                                <th className="py-4 px-6 font-medium">Jenis Treatment</th>
                                <th className="py-4 px-6 font-medium">Tanggal Reservasi</th>
                                <th className="py-4 px-6 font-medium">Dokter</th>
                                <th className="py-4 px-6 font-medium">Status</th>
                                <th className="py-4 px-6 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map((reservation, index) => (
                                <tr key={reservation.idReservasi || reservation.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-gray-400">{index + 1}</td>
                                    <td className="py-4 px-6 font-medium text-gray-900">{getCustomerName(reservation.idUser)}</td>
                                    <td className="py-4 px-6 text-gray-500">{reservation.nomorWa}</td>
                                    <td className="py-4 px-6 text-gray-500">{reservation.jenisTreatment}</td>
                                    <td className="py-4 px-6 text-gray-500 whitespace-nowrap">{formatDate(reservation.tanggalReservasi)}</td>
                                    <td className="py-4 px-6 text-gray-500">{getDoctorName(reservation.idDokter)}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(reservation.status)}`}>
                                            {reservation.status}
                                        </span>
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
                            {filteredReservations.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center text-gray-500">
                                        {searchQuery ? 'Tidak ada reservasi yang sesuai dengan pencarian.' : 'Belum ada reservasi yang terdaftar.'}
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
            <TreatmentReservationModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={handleAdd}
            />

            <TreatmentReservationModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                mode="edit"
                initialData={selectedReservation}
                onSubmit={handleEdit}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                itemType="reservasi"
            />
        </div>
    );
};

export default TreatmentReservationTable;
