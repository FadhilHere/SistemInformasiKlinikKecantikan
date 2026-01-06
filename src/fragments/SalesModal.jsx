import React, { useState, useEffect } from 'react';
import Button from '../components/atoms/Button';

const SalesModal = ({ isOpen, onClose, initialData, onSubmit }) => {
    const [status, setStatus] = useState('');

    useEffect(() => {
        if (isOpen && initialData) {
            setStatus(initialData.status || '');
        } else {
            setStatus('');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ status });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden m-4">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        Update Status Penjualan
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Content Info */}
                <div className="p-6 pb-0">
                    <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">ID Penjualan:</span> #{initialData?.idPenjualan || initialData?.id}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                        <span className="font-semibold">Customer:</span> {initialData?.name || initialData?.namaCustomer || '-'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                        >
                            <option value="">Pilih Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="w-full">
                            Simpan Perubahan
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SalesModal;
