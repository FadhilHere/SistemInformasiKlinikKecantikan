import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';

const ScheduleReservationModal = ({ isOpen, onClose, mode = 'add', initialData, onSubmit }) => {
    const [formData, setFormData] = useState({
        jamMulai: '',
        jamSelesai: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && initialData) {
                setFormData({
                    jamMulai: initialData.jamMulai || '',
                    jamSelesai: initialData.jamSelesai || ''
                });
            } else {
                setFormData({
                    jamMulai: '',
                    jamSelesai: ''
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

        // Convert time format from HH:mm:ss to HH:mm (H:i format for Laravel)
        const submitData = {
            jamMulai: formData.jamMulai.substring(0, 5), // Remove seconds
            jamSelesai: formData.jamSelesai.substring(0, 5) // Remove seconds
        };

        onSubmit(submitData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden m-4">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {mode === 'add' ? 'Tambah Jadwal' : 'Edit Jadwal'}
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
                            <label className="text-sm font-medium text-gray-700">Jam Mulai</label>
                            <input
                                type="time"
                                name="jamMulai"
                                value={formData.jamMulai}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700">Jam Selesai</label>
                            <input
                                type="time"
                                name="jamSelesai"
                                value={formData.jamSelesai}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="min-w-[150px]">
                            {mode === 'add' ? 'Tambah Jadwal' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleReservationModal;
