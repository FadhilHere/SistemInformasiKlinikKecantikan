import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';
import { apiFetch } from '../lib/api';

const TreatmentReservationModal = ({ isOpen, onClose, mode = 'add', initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        namaCustomer: '',
        nomorWa: '',
        idDokter: '',
        idJadwal: '',
        jenisTreatment: '',
        tanggalReservasi: '',
        status: 'pending'
    });

    const [customers, setCustomers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    // ... useEffect for data fetching ... (customers fetch might be removable if not used elsewhere, but let's leave it for now or remove if unused)

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    namaCustomer: initialData.namaCustomer || initialData.nama || '',
                    nomorWa: initialData.nomorWa || '',
                    idDokter: initialData.idDokter || '',
                    idJadwal: initialData.idJadwal || '',
                    jenisTreatment: initialData.jenisTreatment || '',
                    tanggalReservasi: formatDateForInput(initialData.tanggalReservasi),
                    status: initialData.status || 'pending'
                });
            } else {
                setFormData({
                    namaCustomer: '',
                    nomorWa: '',
                    idDokter: '',
                    idJadwal: '',
                    jenisTreatment: '',
                    tanggalReservasi: '',
                    status: 'pending'
                });
            }
        }
    }, [isOpen, mode, initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden m-4 max-h-[90vh] overflow-y-auto">
                {/* Header ... */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {mode === 'add' ? 'Tambah Reservasi' : 'Edit Reservasi'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Nama Customer</label>
                            <input
                                type="text"
                                name="namaCustomer"
                                value={formData.namaCustomer}
                                onChange={handleChange}
                                placeholder="Nama Lengkap"
                                required
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                            <input
                                type="text"
                                name="nomorWa"
                                value={formData.nomorWa}
                                onChange={handleChange}
                                placeholder="08123456789"
                                required
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Dokter</label>
                            <select
                                name="idDokter"
                                value={formData.idDokter}
                                onChange={handleChange}
                                required
                                disabled={isLoadingData}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            >
                                <option value="">Pilih Dokter</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.idDokter} value={doctor.idDokter}>
                                        {doctor.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Jadwal</label>
                            <select
                                name="idJadwal"
                                value={formData.idJadwal}
                                onChange={handleChange}
                                required
                                disabled={isLoadingData}
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            >
                                <option value="">Pilih Jadwal</option>
                                {schedules.map(schedule => (
                                    <option key={schedule.idJadwal} value={schedule.idJadwal}>
                                        {schedule.jamMulai} - {schedule.jamSelesai}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Jenis Treatment</label>
                            <select
                                name="jenisTreatment"
                                value={formData.jenisTreatment}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            >
                                <option value="">Pilih Jenis Treatment</option>
                                <option value="Hair Treatment">Hair Treatment</option>
                                <option value="Body Treatment">Body Treatment</option>
                                <option value="Perawatan Wajah">Perawatan Wajah</option>
                                <option value="Skin Treatment">Skin Treatment</option>
                                <option value="Facial Treatment">Facial Treatment</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Tanggal Reservasi</label>
                            <input
                                type="date"
                                name="tanggalReservasi"
                                value={formData.tanggalReservasi}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]} 
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        >
                            <option value="pending">Pending</option>
                            <option value="konfirmasi">Konfirmasi</option>
                            <option value="datang">Datang</option>
                            <option value="tidak datang">Tidak Datang</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="min-w-[150px]" disabled={isLoadingData}>
                            {mode === 'add' ? 'Tambah Reservasi' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TreatmentReservationModal;
